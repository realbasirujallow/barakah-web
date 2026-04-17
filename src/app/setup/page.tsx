'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  trackPaywallViewed,
  trackSetupComplete,
  trackSetupSkipped,
  trackUpgradeStarted,
} from '../../lib/analytics';
import {
  clearPendingPlaidLinkToken,
  getPlaidUiErrorMessage,
  savePendingPlaidLinkToken,
} from '../../lib/plaid';
import { PRICING } from '../../lib/pricing';
import { hasCompletedGuidedSetup, markGuidedSetupComplete } from '../../lib/setup';
import { hasPaidSyncAccess } from '../../lib/subscription';
import { validateStripeUrl } from '../../lib/validateUrl';

type BillingCycle = 'monthly' | 'yearly';

interface SubscriptionStatus {
  plan: 'free' | 'plus' | 'family';
  status: string;
  hasSubscription: boolean;
}

interface PlaidAccount {
  id: number;
  institutionName: string;
  accountName: string;
  accountMask: string;
  accountType: string;
  accountSubtype?: string;
  accountRole?: string;
  currentBalance: number | null;
  availableBalance: number | null;
  currencyCode: string;
  lastSyncedAt: number | null;
}

const STEP_LABELS = ['Connect Accounts', 'Choose Plan', 'Pick Your Focus'] as const;

function formatPlaidBalance(value: number | null | undefined, currencyCode = 'USD') {
  if (value == null || Number.isNaN(Number(value))) return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(value);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
}

const focusOptions = [
  {
    title: 'Go to Dashboard',
    description: 'See your financial picture, next steps, and recent activity.',
    href: '/dashboard',
    icon: '🏠',
  },
  {
    title: 'Review Imported Accounts',
    description: 'Check linked accounts, import CSV data, or continue bank setup.',
    href: '/dashboard/import',
    icon: '🏦',
  },
  {
    title: 'Set Up Zakat',
    description: 'Start with nisab, hawl tracking, and annual zakat readiness.',
    href: '/dashboard/zakat',
    icon: '🕌',
  },
  {
    title: 'Start Budgeting',
    description: 'Build a monthly spending plan and track household cash flow.',
    href: '/dashboard/budget',
    icon: '📊',
  },
  {
    title: 'Tidy Up Debts',
    description: 'Track balances, payments, and riba exposure in one place.',
    href: '/dashboard/debts',
    icon: '💳',
  },
];

function SetupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, refreshPlan } = useAuth();

  const initialStep = searchParams.get('step') === 'connect' || searchParams.get('checkout') === 'success'
    ? 1
    : 0;

  const [step, setStep] = useState(initialStep);
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [error, setError] = useState('');
  // Round 18: banner starts empty; the "Your plan is active" success
  // banner is only set AFTER we confirm via the real subscriptionStatus
  // call (see loadSubscriptionStatus effect below). Previously the
  // banner was shown purely on `?checkout=success` which any attacker
  // could craft — spoofing "your plan is active" on a still-free user.
  const [banner, setBanner] = useState(() => {
    const checkout = searchParams.get('checkout');
    if (checkout === 'canceled') {
      return 'Checkout was canceled. You can continue with Free or try upgrading again anytime.';
    }
    return '';
  });
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState<'plus' | 'family' | null>(null);
  const [plaidAccounts, setPlaidAccounts] = useState<PlaidAccount[]>([]);
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [plaidMessage, setPlaidMessage] = useState('');

  const loadSubscriptionStatus = useCallback(async () => {
    try {
      const data = await api.subscriptionStatus();
      setStatus(data as SubscriptionStatus);
      // Round 18: only NOW show the "plan is active" success banner,
      // after the backend confirms subscription is real. This prevents
      // `?checkout=success` URL spoofing from falsely telling a free
      // user they've upgraded.
      //
      // Round 20: read searchParams directly inside the success handler
      // rather than including it as a useCallback dep. Prior code
      // re-created the callback (and re-fired the API call) every time
      // searchParams changed — including the router.replace that strips
      // the ?checkout=success param. Reading non-reactively here keeps
      // the callback stable across URL mutations.
      const typed = data as SubscriptionStatus;
      const currentCheckout = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('checkout')
        : null;
      if (currentCheckout === 'success' && typed?.status === 'active') {
        setBanner('Your plan is active. Next, connect your accounts so Barakah can start working for you.');
      }
    } catch {
      setStatus({ plan: 'free', status: 'inactive', hasSubscription: false });
      // Round 20: clear a stale success banner on load failure so users
      // aren't misled into thinking their plan is active while the
      // status fetch is broken.
      setBanner('');
    } finally {
      setStatusLoading(false);
    }
    // searchParams intentionally NOT in deps — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlaidAccounts = useCallback(async () => {
    try {
      const data = await api.plaidGetAccounts();
      setPlaidAccounts((data?.accounts || []) as PlaidAccount[]);
    } catch {
      setPlaidAccounts([]);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (hasCompletedGuidedSetup(user.id)) {
      router.replace('/dashboard');
      return;
    }
    loadSubscriptionStatus();
    loadPlaidAccounts();
  }, [isLoading, loadPlaidAccounts, loadSubscriptionStatus, router, user]);

  // Fire paywall_viewed when user lands on the plan-selection step.
  // Only fire once per step entry — the useEffect dependency on `step`
  // will rerun when the user moves between steps.
  useEffect(() => {
    if (step !== 1) return;
    try { trackPaywallViewed('setup_wizard'); } catch { /* GA4 unavailable */ }
  }, [step]);

  const onPlaidSuccess = useCallback(async (publicToken: string, metadata: { institution: { name: string } | null }) => {
    try {
      const result = await api.plaidExchangeToken(publicToken, metadata?.institution?.name);
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setPlaidLoading(false);
      const imported = Number(result?.transactionsImported || 0);
      setPlaidMessage(
        imported > 0
          ? `Accounts connected and ${imported} transaction(s) imported. You can review them below or continue to your setup focus.`
          : 'Accounts connected successfully. Balances now appear in Assets or Debts, and you can review them below.',
      );
      await loadPlaidAccounts();
    } catch (err) {
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setPlaidLoading(false);
      setError(getPlaidUiErrorMessage(err, 'exchange'));
    }
  }, [loadPlaidAccounts]);

  const onPlaidExit = useCallback((exitError: { display_message?: string | null } | null) => {
    clearPendingPlaidLinkToken();
    setPlaidLinkToken(null);
    setPlaidLoading(false);
    if (exitError?.display_message) {
      setError(exitError.display_message);
    } else if (exitError) {
      setError(getPlaidUiErrorMessage(exitError, 'start'));
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: plaidLinkToken ?? '',
    onSuccess: onPlaidSuccess,
    onExit: onPlaidExit,
  });

  useEffect(() => {
    if (!plaidLinkToken || !ready) return;
    open();
  }, [open, plaidLinkToken, ready]);

  const currentPlan = status?.plan || user?.plan || 'free';
  const plaidAccess = hasPaidSyncAccess(status);

  const handlePlanChoice = async (plan: 'free' | 'plus' | 'family') => {
    if (plan === 'free') {
      setStep(1);
      return;
    }

    if (currentPlan === plan || (currentPlan === 'family' && plan === 'plus')) {
      setBanner(`You're already on ${currentPlan === 'family' ? 'Barakah Family' : 'Barakah Plus'}. Next, connect your accounts.`);
      setStep(1);
      return;
    }

    setPlanLoading(plan);
    setError('');
    // Fire upgrade_started on click intent (before Stripe redirect).
    // The final 'purchase' GA4 event only fires after Stripe confirms,
    // so this click→checkout drop-off is essential for funnel analysis.
    try { trackUpgradeStarted(plan, billing, 'setup_wizard'); } catch { /* GA4 unavailable */ }
    try {
      const result = await api.upgradeSubscription(plan, billing, {
        successPath: '/setup?checkout=success&step=connect',
        cancelPath: '/setup?checkout=canceled',
      });

      if (result?.url) {
        if (!validateStripeUrl(result.url as string)) {
          throw new Error('Invalid Stripe URL returned from checkout.');
        }
        window.location.href = result.url as string;
        return;
      }

      if (result?.success) {
        await refreshPlan();
        await loadSubscriptionStatus();
        setBanner(`You're now on ${plan === 'family' ? 'Barakah Family' : 'Barakah Plus'}. Next, connect your accounts.`);
        setStep(1);
        return;
      }

      throw new Error('We could not update your plan. Please try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not update your plan.');
    } finally {
      setPlanLoading(null);
    }
  };

  const handlePlaidConnect = async () => {
    if (!plaidAccess) {
      setError('Plaid bank sync is available on Plus and Family. Upgrade to connect accounts.');
      return;
    }
    clearPendingPlaidLinkToken();
    setPlaidLinkToken(null);
    setPlaidLoading(true);
    setError('');
    setPlaidMessage('');
    try {
      const data = await api.plaidCreateLinkToken();
      if (data?.linkToken) {
        savePendingPlaidLinkToken(data.linkToken as string);
        setPlaidLinkToken(data.linkToken as string);
      } else {
        throw new Error("We couldn't start secure bank linking right now. Please try again in a few minutes.");
      }
    } catch (err) {
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setError(getPlaidUiErrorMessage(err, 'start'));
    } finally {
      setPlaidLoading(false);
    }
  };

  const finishSetup = async (href: string, options?: { skipped?: boolean; skipFromStep?: string }) => {
    if (!user) return;
    try {
      await api.lifecycleTrackEvent('setup_completed', {
        destination: href,
        plan: currentPlan,
        linkedAccounts: plaidAccounts.length,
        skipped: options?.skipped ?? false,
      }, 'web_setup');
    } catch {
      // Local completion still keeps the user moving if the tracking call fails.
    }
    // Client-side GA4 events — pair with backend SETUP_COMPLETED.
    try {
      if (options?.skipped) {
        trackSetupSkipped(options.skipFromStep ?? 'unknown');
      } else {
        trackSetupComplete(currentPlan);
      }
    } catch { /* GA4 unavailable */ }
    markGuidedSetupComplete(user.id);
    router.replace(href);
  };

  const planCards = useMemo(() => [
    {
      id: 'free' as const,
      title: 'Start Free',
      price: '$0',
      period: 'forever',
      badge: currentPlan === 'free' ? 'Current Plan' : null,
      description: 'Explore the essentials first, then upgrade when you want automatic workflows and deeper planning.',
      features: [
        'Budgets & bills tracking',
        'Zakat calculator and Hawl tracker',
        'Prayer times and Ramadan tools',
      ],
      cta: 'Continue with Free',
      ctaStyle: 'border border-green-200 text-[#1B5E20] bg-white hover:bg-green-50',
    },
    {
      id: 'plus' as const,
      title: 'Barakah Plus',
      price: billing === 'yearly' ? PRICING.plus.yearly : PRICING.plus.monthly,
      period: billing === 'yearly' ? PRICING.plus.yearlyPeriod : PRICING.plus.monthlyPeriod,
      badge: currentPlan === 'plus' ? 'Current Plan' : 'Most Popular',
      description: 'Best for individuals who want connected accounts, premium automation, and deeper Islamic finance tools.',
      features: [
        'Unlimited transactions',
        'Connected account workflows',
        'Barakah Score, investments, and reports',
      ],
      cta: currentPlan === 'plus' || currentPlan === 'family' ? 'Continue with Plus' : 'Upgrade to Plus',
      ctaStyle: 'bg-[#1B5E20] text-white hover:bg-[#2E7D32]',
    },
    {
      id: 'family' as const,
      title: 'Barakah Family',
      price: billing === 'yearly' ? PRICING.family.yearly : PRICING.family.monthly,
      period: billing === 'yearly' ? PRICING.family.yearlyPeriod : PRICING.family.monthlyPeriod,
      badge: currentPlan === 'family' ? 'Current Plan' : 'For Households',
      description: 'Designed for spouses and families who need shared visibility, household planning, and estate continuity.',
      features: [
        'Everything in Plus',
        'Shared household workflows',
        'Family estate visibility and collaboration',
      ],
      cta: currentPlan === 'family' ? 'Continue with Family' : 'Upgrade to Family',
      ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    },
  ], [billing, currentPlan]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center text-[#1B5E20]">
        Preparing your setup...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF7]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold text-[#1B5E20]">
            🌙 Barakah
          </Link>
          <button
            onClick={() => finishSetup('/dashboard', { skipped: true, skipFromStep: `step_${step}` })}
            className="text-sm font-medium text-gray-500 hover:text-[#1B5E20]"
          >
            Set up later
          </button>
        </div>

        <div className="bg-white border border-green-100 rounded-[32px] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#3C9B55] text-white px-8 py-10">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.25em] text-green-100 mb-3">Guided Setup</p>
              <h1 className="text-4xl font-bold leading-tight">Set up your financial home in a few calm steps.</h1>
              <p className="text-green-100 mt-4 max-w-2xl">
                Choose how you want to start, connect your accounts securely, and land inside Barakah with a clear next action instead of an empty dashboard.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {STEP_LABELS.map((label, index) => {
                const active = index === step;
                const completed = index < step;
                return (
                  <div
                    key={label}
                    className={`rounded-2xl px-4 py-4 border ${
                      active
                        ? 'bg-white text-[#1B5E20] border-white'
                        : completed
                          ? 'bg-white/15 border-white/20 text-white'
                          : 'bg-black/10 border-white/10 text-green-100'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wide opacity-80">Step {index + 1}</p>
                    <p className="font-semibold mt-1">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-8 py-8">
            {banner && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {banner}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 1 && ( /* Plan selection — now step 1 */
              <div className="space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1B5E20]">Choose your starting plan</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">Start free or unlock the smoother path now.</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl">
                      Automatic bank sync, deeper automation, and premium planning tools feel much better when they are part of setup instead of something you discover later.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-3 bg-[#F7FAF7] rounded-full px-4 py-2 border border-green-100">
                    <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Monthly</span>
                    <button
                      onClick={() => setBilling(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                      className={`relative h-7 w-14 rounded-full transition-colors ${billing === 'yearly' ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${billing === 'yearly' ? 'translate-x-7' : ''}`} />
                    </button>
                    <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Yearly</span>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  {planCards.map(plan => (
                    <div
                      key={plan.id}
                      className={`rounded-3xl border p-6 flex flex-col ${
                        plan.id === currentPlan
                          ? 'border-[#1B5E20] shadow-lg shadow-green-100'
                          : 'border-gray-200'
                      }`}
                    >
                      {plan.badge && (
                        <div className="mb-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            plan.id === 'family'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-[#1B5E20]'
                          }`}>
                            {plan.badge}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-[#1B5E20]">{plan.price}</span>
                        <span className="text-gray-400 pb-1">{plan.period}</span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                      <ul className="space-y-3 mt-6 flex-1">
                        {plan.features.map(feature => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="mt-0.5 text-[#1B5E20] font-bold">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanChoice(plan.id)}
                        disabled={planLoading === plan.id || statusLoading}
                        className={`mt-8 rounded-2xl px-4 py-3 text-sm font-semibold transition ${plan.ctaStyle} disabled:opacity-50`}
                      >
                        {planLoading === plan.id
                          ? 'Preparing checkout...'
                          : plan.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 0 && ( /* Connect accounts — first step */
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl border border-green-100 bg-[#F9FCF9] p-6">
                  <p className="text-sm font-semibold text-[#1B5E20]">Connect your accounts</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">Bring your day-to-day finances into Barakah.</h2>
                  <p className="text-gray-600 mt-3 max-w-xl">
                    Connect supported bank and card accounts securely through Plaid. Your login credentials stay with your bank, and you can always finish the rest later.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3 mt-6">
                    <div className="rounded-2xl bg-white border border-green-100 px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">Read-only</p>
                      <p className="text-xs text-gray-500 mt-1">Barakah can review balances and transactions, not move money.</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-green-100 px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">Powered by Plaid</p>
                      <p className="text-xs text-gray-500 mt-1">A familiar bank-connection flow users already trust.</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-green-100 px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">Flexible later</p>
                      <p className="text-xs text-gray-500 mt-1">You can still import CSVs or fine-tune everything afterward.</p>
                    </div>
                  </div>

                  {plaidMessage && (
                    <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                      {plaidMessage}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {statusLoading ? (
                      <button
                        disabled
                        className="rounded-2xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
                      >
                        Checking access...
                      </button>
                    ) : plaidAccess ? (
                      <button
                        onClick={handlePlaidConnect}
                        disabled={plaidLoading}
                        className="rounded-2xl bg-[#1B5E20] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2E7D32] disabled:opacity-50"
                      >
                        {plaidLoading ? 'Opening Plaid...' : 'Connect with Plaid'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setStep(1)}
                        className="rounded-2xl border border-[#1B5E20] px-5 py-3 text-sm font-semibold text-[#1B5E20] hover:bg-green-50"
                      >
                        Upgrade to Connect
                      </button>
                    )}
                    <button
                      onClick={() => setStep(2)}
                      className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      {plaidAccounts.length > 0 ? 'Continue with linked accounts' : 'Skip for now'}
                    </button>
                  </div>

                  {!statusLoading && !plaidAccess && (
                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Automatic bank sync is included on Plus and Family. Upgrade above when you&apos;re ready, or keep going with Barakah Free for manual tracking.
                    </div>
                  )}

                  {plaidAccess && currentPlan === 'family' && status?.status === 'trialing' && (
                    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                      Your current Family trial includes secure bank sync right now, so you can connect accounts during setup without upgrading again.
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1B5E20]">Connection status</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {plaidAccounts.length === 0
                          ? 'No accounts linked yet'
                          : `${plaidAccounts.length} account${plaidAccounts.length === 1 ? '' : 's'} linked`}
                      </h3>
                    </div>
                    <span className="text-4xl">🏦</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {plaidAccounts.length === 0 && (
                      <div className="rounded-2xl bg-[#F7FAF7] border border-dashed border-green-200 px-4 py-5 text-sm text-gray-500">
                        Connect your first bank or card account here. You can always manage categories and import details after setup.
                      </div>
                    )}

                    {plaidAccounts.map(account => (
                      <div key={account.id} className="rounded-2xl border border-gray-200 px-4 py-4">
                        <p className="font-semibold text-gray-900">{account.accountName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {account.institutionName} • {account.accountType}{account.accountSubtype ? `/${account.accountSubtype}` : ''}
                          {account.accountMask ? ` •••• ${account.accountMask}` : ''}
                        </p>
                        {account.accountRole && (
                          <p className="text-xs text-emerald-700 mt-1 font-medium capitalize">
                            Shows up as a linked {account.accountRole === 'debt' ? 'debt' : 'asset'} in Barakah
                          </p>
                        )}
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                          Current balance {formatPlaidBalance(account.currentBalance, account.currencyCode) ?? 'Unavailable'}
                        </p>
                        {account.availableBalance != null && (
                          <p className="text-xs text-gray-500 mt-1">
                            Available {formatPlaidBalance(account.availableBalance, account.currencyCode)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-xs leading-6 text-gray-500">
                    Need to import a CSV or fine-tune accounts later? You can always handle that from the dashboard import center after setup.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold text-[#1B5E20]">Choose your first destination</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">Where should Barakah take you first?</h2>
                  <p className="text-gray-600 mt-3">
                    Pick the area you want to focus on first. We’ll mark setup complete and take you straight there.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {focusOptions.map(option => (
                    <button
                      key={option.href}
                      onClick={() => finishSetup(option.href)}
                      className="rounded-3xl border border-gray-200 bg-white p-6 text-left hover:border-[#1B5E20] hover:shadow-lg hover:shadow-green-100 transition"
                    >
                      <div className="text-3xl">{option.icon}</div>
                      <h3 className="mt-4 text-xl font-bold text-gray-900">{option.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{option.description}</p>
                      <span className="mt-6 inline-flex text-sm font-semibold text-[#1B5E20]">
                        Open this next →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F9F5] animate-pulse" />}>
      <SetupPageInner />
    </Suspense>
  );
}
