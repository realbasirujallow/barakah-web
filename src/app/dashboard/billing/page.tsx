'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../lib/toast';
import { validateStripeUrl } from '../../../lib/validateUrl';
import { PRICING } from '../../../lib/pricing';
import { trackPaywallViewed, trackUpgradeStarted } from '../../../lib/analytics';

// ── Plan tier ranking ────────────────────────────────────────────────────────
const PLAN_TIER: Record<string, number> = { free: 0, plus: 1, family: 2 };

type SaveOffer = {
  label?: string;
  message?: string;
  percentOff?: number;
  durationMonths?: number;
  actionable?: boolean;
};

// ── Plan definitions ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    monthlyPeriod: 'forever',
    yearlyPeriod: 'forever',
    yearlySaving: null,
    color: 'gray',
    features: [
      '25 transactions per month',
      'Budgets, bills & savings goals',
      'Zakat calculator & Hawl tracker',
      'Prayer times & Ramadan Mode',
      'Sadaqah tracking',
      'Recurring transactions',
    ],
  },
  {
    id: 'plus' as const,
    name: 'Barakah Plus',
    monthlyPrice: PRICING.plus.monthly,
    yearlyPrice: PRICING.plus.yearly,
    monthlyPeriod: PRICING.plus.monthlyPeriod,
    yearlyPeriod: PRICING.plus.yearlyPeriod,
    yearlySaving: PRICING.plus.yearlySaving,
    color: 'green',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited transactions',
      'All Free features',
      'Halal stock screener (30,000+)',
      'Riba & Subscription detector',
      'Auto-categorize transactions',
      'Wasiyyah & Waqf planning',
      'Investments & net worth',
      'Barakah Score & analytics',
      'Debt Payoff Projector',
      'Financial Summary reports',
      'CSV & PDF export',
    ],
  },
  {
    id: 'family' as const,
    name: 'Barakah Family',
    monthlyPrice: PRICING.family.monthly,
    yearlyPrice: PRICING.family.yearly,
    monthlyPeriod: PRICING.family.monthlyPeriod,
    yearlyPeriod: PRICING.family.yearlyPeriod,
    yearlySaving: PRICING.family.yearlySaving,
    color: 'blue',
    features: [
      'Everything in Plus',
      'Up to 6 family members',
      'Shared budgets & goals',
      'Family Estate Visibility (wills & endowments)',
      'Family financial summary',
      'Shared expense splitting',
      'Priority support',
    ],
  },
];

// ── Billing content (needs Suspense for useSearchParams) ─────────────────────
function BillingContent() {
  const params = useSearchParams();
  const { refreshPlan } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<{ plan: string; status: string; hasSubscription: boolean } | null>(null);
  const [saveOffer, setSaveOffer] = useState<SaveOffer | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [referral, setReferral] = useState<{ referralCode: string; shareUrl: string; referralCount: number; referralClicks?: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const normalizeSaveOffer = (raw: unknown): SaveOffer | null => {
    if (!raw || typeof raw !== 'object') return null;
    const offer = raw as Record<string, unknown>;
    return {
      label: typeof offer.label === 'string' ? offer.label : undefined,
      message: typeof offer.message === 'string' ? offer.message : undefined,
      percentOff: typeof offer.percentOff === 'number' ? offer.percentOff : undefined,
      durationMonths: typeof offer.durationMonths === 'number' ? offer.durationMonths : undefined,
      actionable: offer.actionable === true,
    };
  };

  const loadStatus = async () => {
    try {
      const data = await api.subscriptionStatus();
      setStatus(data as { plan: string; status: string; hasSubscription: boolean });
    } catch {
      setStatus({ plan: 'free', status: 'inactive', hasSubscription: false });
    }
  };

  useEffect(() => {
    loadStatus()
      .finally(() => setStatusLoading(false));

    api.getReferralCode()
      .then(setReferral)
      .catch(() => null);

    // Fire paywall_viewed — user landed on a page with upgrade CTAs.
    // Pairs with the backend PAYWALL_SHOWN event (which only fires on 403s)
    // to give full impression + click visibility.
    try { trackPaywallViewed('billing_page'); } catch { /* GA4 unavailable */ }
  }, []);

  const copyCode = () => {
    if (!referral) return;
    navigator.clipboard.writeText(referral.shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUpgrade = async (plan: 'plus' | 'family') => {
    setLoading(plan);
    // Fire upgrade_started before we touch Stripe — this is the click
    // intent, separate from the final 'purchase' (trackUpgrade) event
    // which only fires after Stripe confirms.
    try { trackUpgradeStarted(plan, billing, 'billing_page'); } catch { /* GA4 unavailable */ }
    try {
      // Existing subscribers: upgrade/downgrade in-place (no redirect needed).
      // New subscribers (free plan): get redirected to Stripe Checkout.
      const result = await api.upgradeSubscription(plan, billing);
      if (result?.url) {
        // Free user — redirect to Stripe Checkout
        if (validateStripeUrl(result.url)) {
          window.location.href = result.url;
        } else {
          toast('Invalid Stripe URL. Please contact support.', 'error');
          setLoading(null);
        }
      } else if (result?.success) {
        // Existing subscriber — plan switched immediately, refresh status
        setStatus(prev => prev ? { ...prev, plan: result.plan, status: result.status } : prev);
        // Sync AuthContext so all pages see the new plan immediately
        await refreshPlan();
        // Track upgrade conversion in GA4
        const { trackUpgrade } = await import('../../../lib/analytics');
        const price = billing === 'yearly'
          ? (plan === 'family' ? 119.99 : 79.99)
          : (plan === 'family' ? 14.99 : 9.99);
        trackUpgrade(plan, billing, price);
        toast('Plan updated! You\u2019re now on ' + (plan === 'family' ? 'Barakah Family' : 'Barakah Plus'), 'success');
        setLoading(null);
      } else {
        toast('Something went wrong. Please try again.', 'error');
        setLoading(null);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong. Please try again.', 'error');
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading('portal');
    try {
      const { url } = await api.openPortal();
      if (validateStripeUrl(url)) {
        window.location.href = url;
      } else {
        toast('Invalid Stripe URL. Please contact support.', 'error');
        setLoading(null);
      }
    } catch {
      toast('No active subscription found. Please contact support.', 'error');
      setLoading(null);
    }
  };

  const handleCancelFlow = async () => {
    setLoading('cancel');
    try {
      const response = await api.lifecycleCancelIntent('billing');
      setSaveOffer(normalizeSaveOffer(response?.offer));
    } catch (err) {
      toast(err instanceof Error ? err.message : 'We could not load cancellation options.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleAcceptSaveOffer = async () => {
    setLoading('save-offer');
    try {
      const response = await api.acceptSaveOffer();
      toast((response?.message as string) || 'Your save offer has been applied.', 'success');
      setSaveOffer(null);
      await loadStatus();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'We could not apply the save offer.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = status?.plan || 'free';
  const isPastDue   = status?.status === 'past_due';
  const isCanceled  = status?.status === 'canceled';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">
          {statusLoading ? (
            <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              You&apos;re on the{' '}
              <span className="font-semibold capitalize text-gray-700">{currentPlan}</span> plan
              {isPastDue && (
                <span className="ml-2 text-red-600 font-medium text-sm">
                  ⚠️ Payment past due — please update your payment method
                </span>
              )}
              {isCanceled && (
                <span className="ml-2 text-orange-600 font-medium text-sm">
                  (Canceled — access ends at period end)
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Success / Cancel banners */}
      {params.get('success') === 'true' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold">Subscription activated!</p>
            <p className="text-sm">Jazakallah khayran — your Barakah plan is now active.</p>
          </div>
        </div>
      )}
      {params.get('canceled') === 'true' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <p className="text-sm">Checkout was canceled — no charge was made.</p>
        </div>
      )}

      {saveOffer && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Before you cancel</p>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {String(saveOffer.label || 'Stay with Barakah and keep your progress')}
              </h2>
              <p className="text-sm text-amber-900/80 mt-2">
                {String(saveOffer.message || 'We can help you stay on track without losing your history.')}
              </p>
              {saveOffer.percentOff && saveOffer.durationMonths && (
                <p className="text-sm text-gray-700 mt-2">
                  Offer: <span className="font-semibold">{String(saveOffer.percentOff)}% off</span> for{' '}
                  <span className="font-semibold">{String(saveOffer.durationMonths)} month{Number(saveOffer.durationMonths) === 1 ? '' : 's'}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 md:w-72">
              {(saveOffer.actionable as boolean) ? (
                <button
                  type="button"
                  onClick={handleAcceptSaveOffer}
                  disabled={loading === 'save-offer'}
                  className="rounded-xl bg-[#1B5E20] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2E7D32] disabled:opacity-60"
                >
                  {loading === 'save-offer' ? 'Applying offer...' : 'Keep My Plan With This Offer'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleManage}
                disabled={loading === 'portal'}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-60"
              >
                {loading === 'portal' ? 'Opening portal...' : 'Continue to Billing Portal'}
              </button>
              <button
                type="button"
                onClick={() => setSaveOffer(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Monthly</span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${billing === 'yearly' ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billing === 'yearly' ? 'translate-x-7' : ''}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>
          Yearly
        </span>
        {billing === 'yearly' && (
          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Save up to 34%</span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {PLANS.map(plan => {
          const isCurrent   = currentPlan === plan.id;
          const isHighlight = 'highlight' in plan && plan.highlight;
          const price  = billing === 'yearly' ? plan.yearlyPrice  : plan.monthlyPrice;
          const period = billing === 'yearly' ? plan.yearlyPeriod : plan.monthlyPeriod;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border flex flex-col p-6 transition-shadow ${
                isCurrent
                  ? 'border-[#1B5E20] ring-2 ring-[#1B5E20] shadow-md'
                  : isHighlight
                  ? 'border-[#1B5E20] shadow-sm'
                  : 'border-gray-200'
              } bg-white`}
            >
              {/* Badge */}
              {'badge' in plan && plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B5E20] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <h2 className="text-lg font-bold text-gray-800 mt-1">{plan.name}</h2>

              <div className="mt-2 mb-4">
                <span className="text-3xl font-extrabold text-[#1B5E20]">{price}</span>
                <span className="text-gray-400 text-sm">{period}</span>
                {billing === 'yearly' && plan.yearlySaving && (
                  <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {plan.yearlySaving}
                  </span>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#1B5E20] font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA — only show upgrade buttons for HIGHER tiers.
                 Family users see no buttons on Plus/Free (retention-first).
                 Plus users see upgrade on Family, nothing on Free.
                 Free users see upgrade on both Plus and Family. */}
              {(() => {
                const currentTier = PLAN_TIER[currentPlan] || 0;
                const planTier    = PLAN_TIER[plan.id] || 0;

                if (isCurrent) {
                  return (
                    <div className="text-center text-sm font-semibold text-[#1B5E20] py-2 bg-green-50 rounded-xl">
                      ✅ Current Plan
                    </div>
                  );
                }
                if (plan.id === 'free') {
                  // Never show an upgrade/switch button for Free — only info text
                  return (
                    <div className="text-center text-sm text-gray-400 py-2">
                      {currentTier > 0 ? 'Included in your plan' : 'Always free — cancel anytime to return here'}
                    </div>
                  );
                }
                if (planTier <= currentTier) {
                  // Lower-tier plan — don't show downgrade button (retention-first).
                  // Users who truly need to downgrade can use the Stripe billing portal.
                  return (
                    <div className="text-center text-sm text-gray-400 py-2">
                      Included in your plan
                    </div>
                  );
                }
                // Higher-tier plan — show upgrade button
                return (
                  <button
                    onClick={() => handleUpgrade(plan.id as 'plus' | 'family')}
                    disabled={loading === plan.id}
                    className="w-full bg-[#1B5E20] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#155016] disabled:opacity-50 transition-colors"
                  >
                    {loading === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {status?.hasSubscription ? 'Upgrading plan...' : 'Redirecting to Stripe...'}
                      </span>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Manage subscription */}
      {status?.hasSubscription && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h3 className="font-semibold text-gray-700 mb-1">Manage Subscription</h3>
          <p className="text-sm text-gray-500 mb-3">
            Update your payment method, switch plans, or review cancellation options before you leave.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <button
              onClick={handleManage}
              disabled={loading === 'portal'}
              className="rounded-xl border border-[#1B5E20] px-4 py-3 text-sm font-semibold text-[#1B5E20] hover:bg-green-50 disabled:opacity-60"
            >
              {loading === 'portal' ? 'Opening portal...' : 'Open Billing Portal'}
            </button>
            <button
              onClick={handleCancelFlow}
              disabled={loading === 'cancel'}
              className="rounded-xl border border-amber-300 px-4 py-3 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-60"
            >
              {loading === 'cancel' ? 'Checking options...' : 'See Cancellation Options'}
            </button>
          </div>
        </div>
      )}

      {/* ── Referral Program ── */}
      {referral && (
        <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎁</span>
            <h3 className="font-bold text-gray-800">Refer a Friend — Get 1 Month Free</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Share your referral link. When a friend signs up and verifies their email, you <strong>both</strong> get 1 free month of Barakah access automatically.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              readOnly
              value={referral.shareUrl}
              className="flex-1 text-xs bg-white border border-green-200 rounded-lg px-3 py-2 text-gray-600 font-mono truncate"
            />
            <button
              onClick={copyCode}
              className="px-4 py-2 bg-[#1B5E20] text-white text-xs font-semibold rounded-lg hover:bg-[#2E7D32] transition whitespace-nowrap"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Your code: <strong className="text-[#1B5E20] font-mono text-sm">{referral.referralCode}</strong></span>
            <span>·</span>
            <span>Rewards triggered: <strong>{referral.referralCount}</strong></span>
            {typeof referral.referralClicks === 'number' && (
              <>
                <span>·</span>
                <span>Clicks: <strong>{referral.referralClicks}</strong></span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Security note */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        🔒 Payments are processed securely by Stripe. Barakah never stores your card details.
      </p>
    </div>
  );
}

// ── Page wrapper with Suspense ────────────────────────────────────────────────
export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}
