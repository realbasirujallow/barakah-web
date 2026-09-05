'use client';

import { useState } from 'react';
import { useAuth, hasAccess } from '../context/AuthContext';
import { api } from '../lib/api';
import { validateStripeUrl } from '../lib/validateUrl';
import { useToast } from '../lib/toast';
import { ReactNode } from 'react';

import { PRICING } from '../lib/pricing';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL, CARD_ON_FILE_TRIAL_DAYS } from '../lib/trial';

interface PlanGateProps {
  /** Minimum plan required to see the content. */
  required: 'plus' | 'family';
  /** What to display in the paywall heading, e.g. "Halal Screener" */
  featureName: string;
  /** Optional short description of why it's worth upgrading */
  description?: string;
  /** The actual feature content — shown only when access is granted */
  children: ReactNode;
}

type PaywallCopy = {
  headline: string;
  description: string;
  bullets: string[];
};

const PAYWALL_COPY: Record<string, PaywallCopy> = {
  'Savings Goals': {
    headline: 'Keep every goal on track',
    description: 'Plan zakat, debt payoff, emergency savings, and family goals without losing the history you already entered.',
    bullets: ['Unlimited savings goals', 'Progress history over time', 'Shared goals on Family'],
  },
  'Net Worth': {
    headline: 'See your full financial picture',
    description: 'Track assets, debts, and net worth history in one place so every decision starts from a clear snapshot.',
    bullets: ['Assets minus debts over time', 'Account-level history', 'Works with manual and linked data'],
  },
  'Net Worth Tracker': {
    headline: 'See your full financial picture',
    description: 'Track assets, debts, and net worth history in one place so every decision starts from a clear snapshot.',
    bullets: ['Assets minus debts over time', 'Account-level history', 'Works with manual and linked data'],
  },
  'Investments': {
    headline: 'Track investments with halal context',
    description: 'Follow portfolio value, allocation, and performance while keeping halal screening close to the numbers.',
    bullets: ['Holdings and allocation views', 'Portfolio history', 'Halal-screening context for stocks'],
  },
  'Forecasting': {
    headline: 'Forecast before money gets tight',
    description: 'Model income, bills, savings, and debt so you can see pressure points before they become emergencies.',
    bullets: ['Cash-flow projections', 'Debt payoff scenarios', 'Plan changes before they hit'],
  },
  'Halal Screener': {
    headline: 'Know what you own',
    description: 'Screen stocks for Sharia-compliance signals and keep watch on portfolios that change over time.',
    bullets: ['Large stock universe', 'Compliance reasons, not just labels', 'Portfolio watchlist support'],
  },
  'Halal Finance Check': {
    headline: 'Catch riba risk earlier',
    description: 'Review accounts and transactions for interest-bearing patterns that are easy to miss manually.',
    bullets: ['Transaction-level flags', 'Account-level review', 'Clear next steps for cleanup'],
  },
  'Transaction Rules': {
    headline: 'Stop re-sorting the same transactions',
    description: 'Create rules once so groceries, sadaqah, halal/riba review, and recurring items stay organized.',
    bullets: ['Automatic categorization', 'Recurring patterns', 'Less manual cleanup each month'],
  },
  'Debt Projections': {
    headline: 'Choose the debt plan with eyes open',
    description: 'Compare payoff strategies and see when each debt can realistically be cleared.',
    bullets: ['Snowball and avalanche views', 'Debt-free date estimates', 'Monthly payment planning'],
  },
};

/**
 * Wrap any premium dashboard page with <PlanGate required="plus" featureName="...">
 * Free users see a comparison of Plus vs Family plans. Paid users see the children normally.
 */
export function PlanGate({ required, featureName, description, children }: PlanGateProps) {
  const { user, isLoading, refreshPlan } = useAuth();
  const { toast } = useToast();
  const [upgrading, setUpgrading] = useState<'plus' | 'family' | null>(null);
  // ACTIVATION-2 (2026-05-24): separate loading state for the card-on-file
  // trial CTA so it disables independently of the immediate-upgrade buttons.
  const [startingTrial, setStartingTrial] = useState<'plus' | 'family' | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  // Round 18: track the refresh-plan sync state so the button disables
  // during the call (prior to this, eager users would click twice and
  // double-fire the backend sync).
  const [syncingPlan, setSyncingPlan] = useState(false);
  const paywallCopy = PAYWALL_COPY[featureName];
  const featureDescription = description ?? paywallCopy?.description ?? `${featureName} comes with every other Plus feature — unlimited transactions, bank sync, halal screener, Barakah Score, and more.`;
  const featureBullets = paywallCopy?.bullets ?? ['Unlimited transactions', 'Bank sync and premium reports', 'Built-in halal finance tools'];
  const handleSyncPlan = async () => {
    if (syncingPlan) return;
    setSyncingPlan(true);
    try { await refreshPlan(); } catch { /* refreshPlan already toasts */ }
    finally { setSyncingPlan(false); }
  };

  // While AuthContext is reconciling the cached profile with the server
  // (e.g. to pick up plan changes made in another tab, or to backfill a
  // cached profile that predates a schema addition), do NOT render the
  // paywall. Showing "upgrade" to a user who actually has access, even
  // for a split second, is a worse bug than a brief blank frame.
  if (isLoading) return null;
  if (!user) return null;

  if (hasAccess(user.plan, required, user.planExpiresAt, user.isAdmin)) {
    return <>{children}</>;
  }

  const handleUpgrade = async (planType: 'plus' | 'family') => {
    setUpgrading(planType);
    try {
      const result = await api.upgradeSubscription(planType, billing);
      if (result?.url) {
        if (validateStripeUrl(result.url)) {
          window.location.href = result.url;
        } else {
          // BUG FIX: use toast instead of blocking alert()
          toast('Invalid payment URL. Please contact support.', 'error');
          setUpgrading(null);
        }
      } else if (result?.success) {
        // BUG FIX: refresh plan from /auth/profile instead of a hard reload —
        // avoids full navigation while still syncing the new plan into context.
        await refreshPlan();
        setUpgrading(null);
      } else {
        // BUG FIX: use toast instead of blocking alert()
        toast('Something went wrong. Please try via the Billing page.', 'error');
        setUpgrading(null);
      }
    } catch {
      // BUG FIX: use toast instead of blocking alert()
      toast('Something went wrong. Please try via the Billing page.', 'error');
      setUpgrading(null);
    }
  };

  // ACTIVATION-2 (2026-05-24): start a card-on-file, auto-converting trial
  // straight from the paywall. Goes through Stripe Checkout (subscription
  // mode) so the card is collected now, no charge for CARD_ON_FILE_TRIAL_DAYS,
  // then Stripe auto-charges. This is the one-tap conversion path the audit
  // flagged as missing — only 2 users ever reached Stripe in 3 months.
  const handleStartTrial = async (planType: 'plus' | 'family') => {
    setStartingTrial(planType);
    try {
      const result = await api.createCheckout(planType, billing, {
        trialDays: CARD_ON_FILE_TRIAL_DAYS,
      });
      if (result?.url && validateStripeUrl(result.url)) {
        window.location.href = result.url;
      } else {
        toast('Invalid payment URL. Please contact support.', 'error');
        setStartingTrial(null);
      }
    } catch {
      toast('Something went wrong. Please try via the Billing page.', 'error');
      setStartingTrial(null);
    }
  };

  // Plan features data
  const planFeatures = {
    free: [
      '10 transactions/month',
      'Zakat Calculator + Hawl Tracker',
      'Budgets & bills tracking',
      'Sadaqah tracking',
      'Ramadan Mode',
      'Recurring transactions',
    ],
    plus: [
      'Unlimited transactions',
      'Barakah Score & Analytics',
      'Halal Screener (30,000+ stocks)',
      'Riba Detector',
      'Subscription Detector',
      'Transaction Rules',
      'Investments & net worth tracking',
      'Wasiyyah & Waqf planning',
      'Debt Payoff Projector',
      'Financial Summary & PDF export',
    ],
    family: [
      'Everything in Plus',
      'Up to 6 family members',
      'Shared budgets & goals',
      'Shared transactions',
      'Family estate visibility',
    ],
  };

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-[#1B5E20]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  // Free user needs Plus: show side-by-side Plus and Family
  if (required === 'plus' && user.plan === 'free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-amber-100 text-amber-800">
            🔒 {featureName} is a Plus feature
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-[#1B5E20]">{paywallCopy?.headline ?? `Unlock ${featureName}`}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {featureDescription}
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 text-left">
            {featureBullets.map(item => (
              <div key={item} className="rounded-lg border border-green-100 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#1B5E20] font-semibold mt-4">
            New accounts get {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} of Family free &mdash; no card required. To keep premium after the trial, choose Plus or Family before access ends.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Annual plans are {PRICING.plus.yearly}/year for Plus or {PRICING.family.yearly}/year for Family.
          </p>
        </div>

        {/* Billing toggle — prominent card so users see the annual discount option */}
        <div className="flex items-center justify-center gap-4 mb-8 bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm">
          <span className={`text-sm font-semibold ${billing === 'monthly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors ${billing === 'yearly' ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}
            aria-label="Toggle annual billing"
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billing === 'yearly' ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-semibold ${billing === 'yearly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Yearly</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${billing === 'yearly' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {billing === 'yearly' ? 'Saving 17%!' : 'Save 17%'}
          </span>
        </div>

        {/* Plan Comparison */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full mb-10">
          {/* Plus Plan */}
          <div className="relative bg-white border-2 border-[#1B5E20] rounded-2xl p-8 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1B5E20] text-white px-4 py-1 rounded-full text-xs font-bold">
              RECOMMENDED
            </div>
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plus</h2>
              <p className="text-4xl font-bold text-[#1B5E20] mb-1">
                {billing === 'yearly' ? PRICING.plus.yearly : PRICING.plus.monthly}
                <span className="text-lg text-gray-600">{billing === 'yearly' ? '/year' : '/mo'}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {billing === 'yearly' ? (
                  <><span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{PRICING.plus.yearlySaving}</span></>
                ) : 'Billed monthly'}
              </p>

              {/* ACTIVATION-2 (2026-05-24): primary CTA is now the card-on-file
                  trial — no charge for {CARD_ON_FILE_TRIAL_DAYS} days, cancel
                  anytime, auto-converts. Immediate "upgrade now" stays as a
                  secondary option for users who want to pay today. */}
              <button
                onClick={() => handleStartTrial('plus')}
                disabled={startingTrial === 'plus'}
                className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 mb-2"
              >
                {startingTrial === 'plus'
                  ? 'Redirecting to Stripe...'
                  : `Start Plus trial — no charge for ${CARD_ON_FILE_TRIAL_DAYS} days`}
              </button>
              <button
                onClick={() => handleUpgrade('plus')}
                disabled={upgrading === 'plus'}
                className="w-full bg-white border border-[#1B5E20] text-[#1B5E20] hover:bg-green-50 py-2.5 rounded-xl font-medium text-sm transition disabled:opacity-60 mb-6"
              >
                {upgrading === 'plus' ? 'Redirecting to Stripe...' : 'Or upgrade & pay now'}
              </button>

              <div className="space-y-3 border-t pt-6">
                {planFeatures.plus.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Family Plan */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Family</h2>
            <p className="text-4xl font-bold text-gray-800 mb-1">
              {billing === 'yearly' ? PRICING.family.yearly : PRICING.family.monthly}
              <span className="text-lg text-gray-600">{billing === 'yearly' ? '/year' : '/mo'}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {billing === 'yearly' ? (
                <><span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{PRICING.family.yearlySaving}</span></>
              ) : 'Billed monthly'}
            </p>

            <button
              onClick={() => handleUpgrade('family')}
              disabled={upgrading === 'family'}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 mb-6"
            >
              {upgrading === 'family' ? 'Redirecting to Stripe...' : 'Upgrade to Family'}
            </button>

            <div className="space-y-3 border-t pt-6">
              {planFeatures.family.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh link */}
        {/* Round 18: renamed "Refresh the page" → "Sync my plan" (it's a
            server-side sync, not a page reload) and added a disabled
            state with spinner text so repeat-clicking doesn't double-fire. */}
        <p className="text-xs text-gray-400">
          Already upgraded?{' '}
          <button
            onClick={handleSyncPlan}
            disabled={syncingPlan}
            className="underline hover:no-underline text-[#1B5E20] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {syncingPlan ? 'Syncing\u2026' : 'Sync my plan'}
          </button>
        </p>
      </div>
    );
  }

  // Plus user needs Family: show just Family upgrade with explanation
  if (required === 'family' && (user.plan === 'plus' || user.plan === 'free')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-green-100 text-[#1B5E20]">
            🔒 Premium Feature
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upgrade to <span className="text-[#1B5E20]">Family</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {description ?? `${featureName} works best when the household can share plans, budgets, goals, and estate visibility.`}
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 text-left">
            {featureBullets.map(item => (
              <div key={item} className="rounded-lg border border-green-100 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Family is {PRICING.family.monthly}/mo or {PRICING.family.yearly}/year.
          </p>
        </div>

        {/* Current Plan Info */}
        {user.plan === 'plus' && (
          <div className="max-w-2xl w-full bg-green-50 border border-green-200 rounded-xl p-6 mb-10">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Your current plan:</span> Plus – Unlimited transactions, Zakat calculator, Halal screener, and more.
            </p>
          </div>
        )}

        {/* Billing toggle — prominent card */}
        <div className="flex items-center justify-center gap-4 mb-8 bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm">
          <span className={`text-sm font-semibold ${billing === 'monthly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors ${billing === 'yearly' ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}
            aria-label="Toggle annual billing"
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billing === 'yearly' ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-semibold ${billing === 'yearly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Yearly</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${billing === 'yearly' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {billing === 'yearly' ? PRICING.family.yearlySaving : 'Save 17%'}
          </span>
        </div>

        {/* Family Plan Card */}
        <div className="max-w-2xl w-full bg-white border-2 border-[#1B5E20] rounded-2xl p-8 shadow-lg mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Family Plan</h2>
          <p className="text-5xl font-bold text-[#1B5E20] mb-1">
            {billing === 'yearly' ? PRICING.family.yearly : PRICING.family.monthly}
            <span className="text-xl text-gray-600">{billing === 'yearly' ? '/year' : '/mo'}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            {billing === 'yearly' ? (
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{PRICING.family.yearlySaving}</span>
            ) : 'Billed monthly'}
          </p>

          <button
            onClick={() => handleUpgrade('family')}
            disabled={upgrading === 'family'}
            className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-semibold text-base transition disabled:opacity-60 mb-8"
          >
            {upgrading === 'family' ? 'Redirecting to Stripe...' : `Upgrade to Family ${billing === 'yearly' ? PRICING.family.yearly : PRICING.family.monthly}`}
          </button>

          <div className="border-t pt-8">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">What&apos;s included in Family Plan:</h3>
            <div className="space-y-3">
              {planFeatures.family.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh link */}
        {/* Round 18: renamed "Refresh the page" → "Sync my plan" (it's a
            server-side sync, not a page reload) and added a disabled
            state with spinner text so repeat-clicking doesn't double-fire. */}
        <p className="text-xs text-gray-400">
          Already upgraded?{' '}
          <button
            onClick={handleSyncPlan}
            disabled={syncingPlan}
            className="underline hover:no-underline text-[#1B5E20] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {syncingPlan ? 'Syncing\u2026' : 'Sync my plan'}
          </button>
        </p>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}
