'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../lib/toast';
import { REFEREE_FIRST_MONTH_PRICE } from '../../../lib/referralCopy';
import { validateStripeUrl } from '../../../lib/validateUrl';
import { PRICING } from '../../../lib/pricing';
import { CARD_ON_FILE_TRIAL_DAYS } from '../../../lib/trial';
import { useLocalizedPrice } from '../../../lib/useLocalizedPrice';
import { trackPaywallViewed, trackUpgradeStarted } from '../../../lib/analytics';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';

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
// 2026-06-06 (QA LOC-6): features + Free plan name + badge are stored as i18n
// keys here and resolved through t() at render time. Brand tokens ("Barakah
// Plus", "Barakah Family", USD prices, the "$X/mo" suffix) intentionally stay
// in English on the constant — pricing strings have to stay stable for the
// Stripe portal and the canonical price labels carried into the audit log.
const PLANS = [
  {
    id: 'free' as const,
    nameKey: 'billingPlanNameFree',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    monthlyPeriod: 'forever',
    yearlyPeriod: 'forever',
    yearlySaving: null,
    color: 'gray',
    featureKeys: [
      'billingFeatTransactions10',
      'billingFeatBudgetsBills',
      'billingFeatZakatHawl',
      'billingFeatSadaqahRamadan',
      'billingFeatCashFlowSadaqah',
      'billingFeatRecurring',
    ],
  },
  {
    id: 'plus' as const,
    // Brand token — not localized. Per LOC-5 stance: leave Barakah Plus / Family in English.
    name: 'Barakah Plus',
    monthlyPrice: PRICING.plus.monthly,
    yearlyPrice: PRICING.plus.yearly,
    monthlyPeriod: PRICING.plus.monthlyPeriod,
    yearlyPeriod: PRICING.plus.yearlyPeriod,
    yearlySaving: PRICING.plus.yearlySaving,
    color: 'green',
    highlight: true,
    badgeKey: 'billingBadgeMostPopular',
    featureKeys: [
      'billingFeatUnlimitedTx',
      'billingFeatAllFree',
      'billingFeatHalalScreener',
      'billingFeatRibaSubsDetector',
      'billingFeatTransactionRules',
      'billingFeatWasiyyahWaqf',
      'billingFeatInvestmentsNw',
      'billingFeatBarakahScore',
      'billingFeatDebtPayoff',
      'billingFeatFinancialSummary',
      'billingFeatCsvPdfExport',
    ],
  },
  {
    id: 'family' as const,
    // Brand token — not localized.
    name: 'Barakah Family',
    monthlyPrice: PRICING.family.monthly,
    yearlyPrice: PRICING.family.yearly,
    monthlyPeriod: PRICING.family.monthlyPeriod,
    yearlyPeriod: PRICING.family.yearlyPeriod,
    yearlySaving: PRICING.family.yearlySaving,
    color: 'blue',
    featureKeys: [
      'billingFeatEverythingInPlus',
      'billingFeatUpTo6',
      'billingFeatSharedBudgets',
      'billingFeatFamilyEstate',
      'billingFeatFamilySummary',
      'billingFeatSharedExpense',
      'billingFeatPrioritySupport',
    ],
  },
];

// ── Billing content (needs Suspense for useSearchParams) ─────────────────────
function BillingContent() {
  // 2026-05-08 (W-P1-1 top-of-funnel i18n pass): localize the labels and
  // button strings on the dashboard billing page. Stripe-required legal /
  // pricing strings (e.g. "$9.99/mo", PCI compliance line, Stripe portal
  // copy) intentionally stay English — Stripe support and the audit trail
  // need stable canonical price labels and Stripe's own UI is English.
  const { t, tFmt } = useI18n();
  const params = useSearchParams();
  const { refreshPlan } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<{ plan: string; status: string; hasSubscription: boolean; pendingDiscount?: { label?: string } } | null>(null);
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
      setStatus(data as { plan: string; status: string; hasSubscription: boolean; pendingDiscount?: { label?: string } });
    } catch {
      setStatus({ plan: 'free', status: 'inactive', hasSubscription: false });
    }
  };

  useEffect(() => {
    let cancelled = false;
    loadStatus()
      .finally(() => { if (!cancelled) setStatusLoading(false); });

    api.getReferralCode()
      .then(d => { if (!cancelled) setReferral(d); })
      .catch(() => null);

    // Fire paywall_viewed — user landed on a page with upgrade CTAs.
    // Pairs with the backend PAYWALL_SHOWN event (which only fires on 403s)
    // to give full impression + click visibility.
    try { trackPaywallViewed('billing_page'); } catch { /* GA4 unavailable */ }
    return () => { cancelled = true; };
  }, []);

  const copyCode = () => {
    if (!referral) return;
    navigator.clipboard.writeText(referral.shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUpgrade = async (plan: 'plus' | 'family') => {
    // Prevent double-submit while a previous upgrade (or portal/cancel
    // action) is still in flight — clicking "Upgrade" twice would otherwise
    // create two Stripe checkout sessions.
    if (loading) return;
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
        const priceStr = billing === 'yearly'
          ? (plan === 'family' ? PRICING.family.yearly : PRICING.plus.yearly)
          : (plan === 'family' ? PRICING.family.monthly : PRICING.plus.monthly);
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        // StripeController.upgrade now returns the billing currency (ISO 4217
        // from the Stripe price). Pass it through so GA4 revenue attribution
        // matches the actual charge when we enable non-USD plans.
        const chargedCurrency = typeof (result as { currency?: unknown }).currency === 'string'
          ? ((result as { currency: string }).currency).toUpperCase()
          : 'USD';
        trackUpgrade(plan, billing, price, chargedCurrency);
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

  // ACTIVATION-2 (2026-05-24): start a card-on-file, auto-converting trial.
  // Always goes through Stripe Checkout (subscription mode) so the card is
  // collected up front; Stripe auto-charges when the trial ends. Distinct
  // from handleUpgrade (which bills immediately for free users). This is the
  // primary CTA we surface to free users — the #1 revenue lever.
  const handleStartTrial = async (plan: 'plus' | 'family') => {
    if (loading) return;
    setLoading(`trial-${plan}`);
    try { trackUpgradeStarted(plan, billing, 'billing_page_trial'); } catch { /* GA4 unavailable */ }
    try {
      const result = await api.createCheckout(plan, billing, {
        trialDays: CARD_ON_FILE_TRIAL_DAYS,
        successPath: '/dashboard/billing?success=true',
        cancelPath: '/dashboard?checkout=canceled',
      });
      if (result?.url && validateStripeUrl(result.url)) {
        window.location.href = result.url;
      } else {
        toast('Invalid Stripe URL. Please contact support.', 'error');
        setLoading(null);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not start your trial. Please try again.', 'error');
      setLoading(null);
    }
  };

  // GROWTH-A (2026-05-24): one-click upgrade from lifecycle emails. The trial
  // reminder / trial-ended emails link here with ?plan=<tier>&checkout=1, so
  // the CTA in the inbox lands the user straight in Stripe Checkout instead of
  // a plan picker. Guards:
  //   - waits until subscription status has loaded (so we don't auto-charge
  //     someone who is already on that exact paid plan);
  //   - fires at most once per mount (autoCheckoutFired ref);
  //   - only for the two real tiers; any other ?plan value is ignored.
  const autoCheckoutFired = useRef(false);
  useEffect(() => {
    if (autoCheckoutFired.current) return;
    if (statusLoading) return; // need plan state before deciding
    if (params.get('checkout') !== '1') return;
    const requested = params.get('plan');
    if (requested !== 'plus' && requested !== 'family') return;
    // Already on this exact active plan? Don't re-launch checkout — send them
    // to the normal page so they can manage instead.
    if (status?.plan === requested && status?.status === 'active') return;
    autoCheckoutFired.current = true;
    handleUpgrade(requested);
    // handleUpgrade is stable for the lifetime of this mount; intentionally
    // excluded from deps to avoid re-firing on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusLoading, status, params]);

  const handleManage = async () => {
    setLoading('portal');
    try {
      const res = await api.openPortal();
      if (res?.url) {
        if (validateStripeUrl(res.url)) {
          window.location.href = res.url;
        } else {
          toast('Invalid Stripe URL. Please contact support.', 'error');
          setLoading(null);
        }
      } else {
        toast('No active subscription found. Please contact support.', 'error');
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
  const isTrialing  = status?.status === 'trialing' || status?.status === 'trial';

  // 2026-05-05 (P2 audit): "skip trial and pay now". Two paths handled by
  // the backend — Stripe-trial users get billed immediately via
  // subscription.update(trial_end=now); onboarding-trial users (no Stripe
  // sub) get a checkout URL with skipTrial=true.
  const handlePayNow = async () => {
    if (loading) return;
    setLoading('pay-now');
    try {
      const result = (await api.endTrialNow()) as
        | { success?: boolean; path?: string; status?: string; url?: string; error?: string };
      if (result?.error) {
        toast(result.error, 'error');
        setLoading(null);
        return;
      }
      if (result?.path === 'checkout_required' && typeof result.url === 'string') {
        if (validateStripeUrl(result.url)) {
          window.location.href = result.url;
          return;
        }
        toast('Invalid Stripe URL. Please contact support.', 'error');
        setLoading(null);
        return;
      }
      // Stripe-trial path: subscription.update succeeded, status flipped.
      setStatus(prev => prev ? { ...prev, status: result?.status || 'active' } : prev);
      await refreshPlan();
      toast('Trial ended. Your plan is now active.', 'success');
      setLoading(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to start billing. Please try again.', 'error');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <PageHeader
        title={t('billingPageTitle')}
        className="mb-8"
        subtitle={
          statusLoading ? (
            <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              You&apos;re on the{' '}
              <span className="font-semibold capitalize text-foreground">{currentPlan}</span> plan
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
          )
        }
      />

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

      {/* Founder-CRM: a staged admin "Issue Discount" the user hasn't claimed.
          The coupon auto-applies at checkout (StripeController), so picking ANY
          plan below claims it. Mobile subscribers see the same banner inside the
          app pointing here, since a Stripe coupon can't touch a store invoice. */}
      {!statusLoading && status?.pendingDiscount && currentPlan === 'free' && (
        <div
          className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300 rounded-2xl p-5 mb-6"
          data-testid="billing-discount-claim"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>🎁</span>
              <div>
                <p className="font-bold text-amber-900 text-base sm:text-lg">
                  You&apos;ve been given {status.pendingDiscount.label ?? 'a discount'}
                </p>
                <p className="text-sm text-amber-800">
                  It&apos;ll be applied automatically at checkout — choose any plan below to claim it.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleUpgrade('plus')}
              disabled={!!loading}
              className="shrink-0 rounded-xl bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
              data-testid="billing-discount-claim-btn"
            >
              {loading === 'plus' ? 'Opening checkout…' : 'Claim it on Barakah Plus'}
            </button>
          </div>
        </div>
      )}

      {/* ACTIVATION-2 (2026-05-24): card-on-file trial CTA for FREE users.
          This is the #1 revenue lever — free users today never enter a card,
          so they never convert. One tap → Stripe Checkout (card collected
          now, no charge for {CARD_ON_FILE_TRIAL_DAYS} days, auto-charges when
          the trial ends). Shown only to genuine free users (not trialing,
          not already subscribed). */}
      {!statusLoading && currentPlan === 'free' && !isTrialing && !status?.hasSubscription && (
        <div
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-6"
          data-testid="billing-trial-cta"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base sm:text-lg">
                Start your free {CARD_ON_FILE_TRIAL_DAYS}-day trial
              </p>
              <p className="text-sm text-gray-600 mt-1">
                No charge for {CARD_ON_FILE_TRIAL_DAYS} days · cancel anytime before it ends.
                Add your card now and unlock everything in Plus today.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-col md:w-64 shrink-0">
              <button
                type="button"
                onClick={() => handleStartTrial('plus')}
                disabled={loading === 'trial-plus'}
                className="rounded-xl bg-primary text-primary-foreground text-sm font-semibold px-4 py-3 hover:bg-[#155016] disabled:opacity-60 transition-colors"
                data-testid="billing-start-trial-plus"
              >
                {loading === 'trial-plus' ? 'Redirecting to Stripe…' : `Start free trial — no charge for ${CARD_ON_FILE_TRIAL_DAYS} days`}
              </button>
              <button
                type="button"
                onClick={() => handleStartTrial('family')}
                disabled={loading === 'trial-family'}
                className="rounded-xl border border-primary text-primary text-sm font-medium px-4 py-2.5 hover:bg-green-50 disabled:opacity-60 transition-colors"
                data-testid="billing-start-trial-family"
              >
                {loading === 'trial-family' ? 'Redirecting…' : 'Try Family free instead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2026-05-05 (P2 audit): trial users can skip the trial and start
          billing right now. Useful for users who decide they're sure about
          the plan and want to lock in continuous access without watching
          the countdown. */}
      {isTrialing && !statusLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🎯</span>
            <div>
              <p className="font-semibold text-blue-900 text-sm sm:text-base">
                You&apos;re on a {currentPlan === 'family' ? 'Family' : 'Plus'} trial
              </p>
              <p className="text-xs text-blue-800/80 mt-0.5">
                Want to skip the rest of the trial and lock in your plan now? You&apos;ll be billed immediately and there&apos;s no extra fee.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={loading === 'pay-now'}
            className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-60 whitespace-nowrap"
            data-testid="billing-pay-now"
          >
            {loading === 'pay-now' ? 'Starting…' : 'Skip trial · Pay now'}
          </button>
        </div>
      )}

      {saveOffer && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">{t('billingBeforeYouCancel')}</p>
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
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading === 'save-offer' ? t('billingApplyingOffer') : t('billingKeepPlanWithOffer')}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleManage}
                disabled={loading === 'portal'}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-60"
              >
                {loading === 'portal' ? t('billingOpeningPortal') : t('billingContinueToPortal')}
              </button>
              <button
                type="button"
                onClick={() => setSaveOffer(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {t('billingNotNow')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing toggle */}
      <div className="flex flex-col items-center mb-6 gap-2">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-primary' : 'text-gray-400'}`}>{t('billingToggleMonthly')}</span>
          <button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors ${billing === 'yearly' ? 'bg-primary' : 'bg-gray-300'}`}
            aria-label={billing === 'yearly' ? t('billingToggleAriaSwitchMonthly') : t('billingToggleAriaSwitchAnnual')}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billing === 'yearly' ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-primary' : 'text-gray-400'}`}>
            {t('billingToggleYearly')}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
            billing === 'yearly'
              ? 'text-green-700 bg-green-100'
              : 'text-amber-700 bg-amber-100 animate-pulse'
          }`}>
            {billing === 'yearly' ? t('billingToggleSave17') : t('billingToggleGet2MonthsFree')}
          </span>
        </div>
        {billing === 'monthly' && (
          <p className="text-xs text-gray-500">
            {/* 2026-05-08 (item K cascade): the savings figures here are
                derived from the USD list price. Showing them as "$21 on Plus
                or $31 on Family" is fine for USD users but jarring for the
                non-USD audience the rest of this page now localizes. The
                text is intentionally currency-neutral ("17% on Plus or 17%
                on Family") so it's true for every customer regardless of
                the local currency Stripe charges them in. */}
            {t('billingToggleAnnualSavingsNote')}
          </p>
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
                  ? 'border-primary ring-2 ring-primary shadow-md'
                  : isHighlight
                  ? 'border-primary shadow-sm'
                  : 'border-gray-200'
              } bg-white`}
            >
              {/* Badge */}
              {'badgeKey' in plan && plan.badgeKey && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {t(plan.badgeKey)}
                </span>
              )}

              <h2 className="text-lg font-bold text-gray-800 mt-1">
                {/* Free plan name localized via key; brand names ("Barakah Plus" / "Family") stay English. */}
                {'nameKey' in plan && plan.nameKey ? t(plan.nameKey) : plan.name}
              </h2>

              <div className="mt-2 mb-4">
                <PlanPriceDisplay price={price} period={period} />
                {billing === 'yearly' && plan.yearlySaving && (
                  <span className="ml-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {plan.yearlySaving}
                  </span>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.featureKeys.map(key => (
                  <li key={key} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    {t(key)}
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
                    <div className="text-center text-sm font-semibold text-primary py-2 bg-green-50 rounded-xl">
                      ✅ {t('billingCurrentPlan')}
                    </div>
                  );
                }
                if (plan.id === 'free') {
                  // Never show an upgrade/switch button for Free — only info text
                  return (
                    <div className="text-center text-sm text-gray-400 py-2">
                      {currentTier > 0 ? t('billingIncludedInPlan') : t('billingAlwaysFreeNote')}
                    </div>
                  );
                }
                if (planTier <= currentTier) {
                  // Lower-tier plan — don't show downgrade button (retention-first).
                  // Users who truly need to downgrade can use the Stripe billing portal.
                  return (
                    <div className="text-center text-sm text-gray-400 py-2">
                      {t('billingIncludedInPlan')}
                    </div>
                  );
                }
                // Higher-tier plan — show upgrade button. By this point the
                // narrowing above (early-return when plan.id === 'free') means
                // plan is Plus or Family, both of which carry a brand `.name`
                // — no nameKey lookup needed in this branch.
                const planLabel = plan.name;
                return (
                  <button
                    onClick={() => handleUpgrade(plan.id as 'plus' | 'family')}
                    disabled={loading === plan.id}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:bg-[#155016] disabled:opacity-50 transition-colors"
                  >
                    {loading === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {status?.hasSubscription ? t('billingUpgradingState') : t('billingRedirectingState')}
                      </span>
                    ) : (
                      tFmt('billingUpgradeToFmt', [planLabel])
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
          <h3 className="font-semibold text-gray-700 mb-1">{t('billingManageSubscription')}</h3>
          <p className="text-sm text-gray-500 mb-3">
            {t('billingManageSubscriptionBody')}
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <button
              onClick={handleManage}
              disabled={loading === 'portal'}
              className="rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-green-50 disabled:opacity-60"
            >
              {loading === 'portal' ? t('billingOpeningPortal') : t('billingOpenPortal')}
            </button>
            <button
              onClick={handleCancelFlow}
              disabled={loading === 'cancel'}
              className="rounded-xl border border-amber-300 px-4 py-3 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-60"
            >
              {loading === 'cancel' ? t('billingCheckingOptions') : t('billingSeeCancellationOptions')}
            </button>
          </div>
        </div>
      )}

      {/* ── Referral Program ── */}
      {referral && (
        <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎁</span>
            <h3 className="font-bold text-gray-800">Refer a Friend — You Get a Free Month</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Share your referral link. When a friend signs up and verifies their
            email, <strong>you</strong> get a free extra month of Barakah
            and <strong>they</strong> get their first month for{' '}
            <strong>{REFEREE_FIRST_MONTH_PRICE}</strong>.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              readOnly
              value={referral.shareUrl}
              className="flex-1 text-xs bg-white border border-green-200 rounded-lg px-3 py-2 text-gray-600 font-mono truncate"
            />
            <button
              onClick={copyCode}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition whitespace-nowrap"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Your code: <strong className="text-primary font-mono text-sm">{referral.referralCode}</strong></span>
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

/**
 * Renders a plan price with locale-aware approximate conversion.
 * 2026-05-08 (item K): pricing tiles previously hardcoded "$9.99/mo" for
 * every user. Non-USD users now see an approximate local-currency price
 * with a "Charged in your local currency at checkout" caption so the
 * displayed value sits coherently next to the actual Stripe charge.
 *
 * Free plan ("$0") is rendered verbatim — no conversion needed.
 */
function PlanPriceDisplay({ price, period }: { price: string; period: string }) {
  const { t } = useI18n();
  const { localized, approximate, loading } = useLocalizedPrice(price);
  // The "$0 / forever" free plan should render plainly — no FX dance.
  const isFree = price === '$0';
  return (
    <>
      <span className="text-3xl font-extrabold text-primary">
        {isFree ? price : (loading ? price : localized)}
      </span>
      <span className="text-gray-400 text-sm">{period}</span>
      {!isFree && approximate && !loading && (
        <p className="text-[11px] text-gray-500 mt-1">{t('billingLocalCurrencyNote')}</p>
      )}
    </>
  );
}
