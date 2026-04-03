'use client';

import { useState } from 'react';
import { useAuth, hasAccess } from '../context/AuthContext';
import { api } from '../lib/api';
import { ReactNode } from 'react';

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

/**
 * Wrap any premium dashboard page with <PlanGate required="plus" featureName="...">
 * Free users see a comparison of Plus vs Family plans. Paid users see the children normally.
 */
export function PlanGate({ required, featureName, description, children }: PlanGateProps) {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState<'plus' | 'family' | null>(null);

  // Still loading or no user (layout guard handles redirect)
  if (!user) return null;

  if (hasAccess(user.plan, required, user.planExpiresAt)) {
    return <>{children}</>;
  }

  const validateStripeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') return false;
      const hostname = urlObj.hostname;
      return hostname === 'stripe.com' || hostname === 'checkout.stripe.com' || hostname.endsWith('.stripe.com');
    } catch {
      return false;
    }
  };

  const handleUpgrade = async (planType: 'plus' | 'family') => {
    setUpgrading(planType);
    try {
      const result = await api.upgradeSubscription(planType);
      if (result?.url) {
        if (validateStripeUrl(result.url)) {
          window.location.href = result.url;
        } else {
          alert('Invalid Stripe URL. Please contact support.');
          setUpgrading(null);
        }
      } else if (result?.success) {
        window.location.reload();
      } else {
        alert('Something went wrong. Please try via the Billing page.');
        setUpgrading(null);
      }
    } catch {
      alert('Something went wrong. Please try via the Billing page.');
      setUpgrading(null);
    }
  };

  // Feature-specific descriptions for better conversion copy
  const featureDescriptions: Record<string, string> = {
    'Financial Insights': 'See your Barakah Score, spending trends, halal ratio, and month-over-month analytics — all in one place.',
    'Halal Screener': 'Screen 30,000+ stocks for Sharia compliance. Know exactly where your money is going.',
    'Halal Finance Check': 'Screen 30,000+ stocks for Sharia compliance and detect interest-bearing transactions in your accounts.',
    'Investments': 'Track your full portfolio — accounts, holdings, P&L, and allocation breakdown.',
    'Net Worth': 'See your complete financial picture — assets minus debts, tracked over time.',
    'Wasiyyah': 'Plan your Islamic will with automatic Faraid calculation and 1/3 cap enforcement. Export as PDF.',
    'Waqf': 'Track Islamic endowments, manage beneficiaries, and plan charitable distributions.',
    'Analytics': 'Spending trends, category breakdown, and month-over-month financial analysis.',
    'Auto-Categorize': 'AI-powered transaction categorization saves you time and keeps your records clean.',
    'Riba Detector': 'Automatically flag interest-bearing transactions and accounts in your finances.',
    'Subscription Detection': 'Auto-detect recurring subscriptions you may have forgotten about.',
    'Subscription Detector': 'Auto-detect recurring subscriptions from your transactions and flag non-halal services.',
    'Debt Projections': 'See exactly when you&apos;ll be debt-free with snowball and avalanche payoff strategies.',
  };

  // Plan features data
  const planFeatures = {
    free: [
      '25 transactions/month',
      'Zakat Calculator + Hawl Tracker',
      'Budgets, bills & savings goals',
      'Sadaqah tracking',
      'Prayer times & Ramadan Mode',
      'Recurring transactions',
    ],
    plus: [
      'Unlimited transactions',
      'Barakah Score & Analytics',
      'Halal Screener (30,000+ stocks)',
      'Riba Detector',
      'Subscription Detector',
      'Auto-categorization',
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
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-green-100 text-[#1B5E20]">
            🔒 Premium Feature
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Unlock <span className="text-[#1B5E20]">{featureName}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {description ?? featureDescriptions[featureName] ?? `Choose a plan to access ${featureName} and all other premium features.`}
          </p>
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
              <p className="text-4xl font-bold text-[#1B5E20] mb-1">$9.99<span className="text-lg text-gray-600">/mo</span></p>
              <p className="text-sm text-gray-500 mb-6">Billed monthly</p>

              <button
                onClick={() => handleUpgrade('plus')}
                disabled={upgrading === 'plus'}
                className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 mb-6"
              >
                {upgrading === 'plus' ? 'Redirecting to Stripe...' : 'Upgrade to Plus'}
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
            <p className="text-4xl font-bold text-gray-800 mb-1">$14.99<span className="text-lg text-gray-600">/mo</span></p>
            <p className="text-sm text-gray-500 mb-6">Billed monthly</p>

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
        <p className="text-xs text-gray-400">
          Already upgraded?{' '}
          <button
            onClick={() => window.location.reload()}
            className="underline hover:no-underline text-[#1B5E20] font-semibold"
          >
            Refresh the page
          </button>{' '}
          to sync your plan.
        </p>
      </div>
    );
  }

  // Plus user needs Family: show just Family upgrade with explanation
  if (required === 'family' && (user.plan === 'plus' || user.plan === 'free')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-green-100 text-[#1B5E20]">
            🔒 Premium Feature
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upgrade to <span className="text-[#1B5E20]">Family Plan</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {description ?? `${featureName} is a Family plan exclusive. Upgrade now to share with your family and unlock advanced features.`}
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

        {/* Family Plan Card */}
        <div className="max-w-2xl w-full bg-white border-2 border-[#1B5E20] rounded-2xl p-8 shadow-lg mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Family Plan</h2>
          <p className="text-5xl font-bold text-[#1B5E20] mb-1">$14.99<span className="text-xl text-gray-600">/mo</span></p>
          <p className="text-sm text-gray-500 mb-8">Billed monthly</p>

          <button
            onClick={() => handleUpgrade('family')}
            disabled={upgrading === 'family'}
            className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-semibold text-base transition disabled:opacity-60 mb-8"
          >
            {upgrading === 'family' ? 'Redirecting to Stripe...' : 'Upgrade to Family'}
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
        <p className="text-xs text-gray-400">
          Already upgraded?{' '}
          <button
            onClick={() => window.location.reload()}
            className="underline hover:no-underline text-[#1B5E20] font-semibold"
          >
            Refresh the page
          </button>{' '}
          to sync your plan.
        </p>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}
