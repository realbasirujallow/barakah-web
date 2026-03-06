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
 * Free users see a clean upgrade prompt. Paid users see the children normally.
 */
export function PlanGate({ required, featureName, description, children }: PlanGateProps) {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  // Still loading or no user (layout guard handles redirect)
  if (!user) return null;

  if (hasAccess(user.plan, required)) {
    return <>{children}</>;
  }

  const planLabel = required === 'family' ? 'Family' : 'Plus';
  const planPrice = required === 'family' ? '$14.99/mo' : '$7.99/mo';
  const planColor = required === 'family' ? 'purple' : 'green';

  const colorClasses = planColor === 'purple'
    ? { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', ring: 'ring-purple-200', badge: 'bg-purple-100 text-purple-800' }
    : { bg: 'bg-[#1B5E20]', hover: 'hover:bg-[#2E7D32]', ring: 'ring-green-200', badge: 'bg-green-100 text-[#1B5E20]' };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const result = await api.upgradeSubscription(required);
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.success) {
        window.location.reload();
      } else {
        alert('Something went wrong. Please try via the Billing page.');
        setUpgrading(false);
      }
    } catch {
      alert('Something went wrong. Please try via the Billing page.');
      setUpgrading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${colorClasses.badge}`}>
        {planLabel} Plan Feature
      </div>

      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{featureName}</h2>
      <p className="text-gray-500 text-sm max-w-md mb-8 leading-relaxed">
        {description ?? `${featureName} is available on the ${planLabel} plan. Upgrade to unlock this and all other premium features.`}
      </p>

      <div className={`bg-white border-2 ${colorClasses.ring} ring-2 rounded-2xl p-6 max-w-xs w-full shadow-sm mb-6`}>
        <p className="font-bold text-gray-800 text-lg">{planLabel} Plan</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{planPrice}</p>
        <p className="text-gray-400 text-xs mt-0.5">billed monthly</p>
        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className={`mt-5 block w-full ${colorClasses.bg} ${colorClasses.hover} text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-60`}
        >
          {upgrading ? 'Redirecting to Stripe...' : 'Upgrade Now'}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Already upgraded?{' '}
        <button
          onClick={() => window.location.reload()}
          className="underline hover:no-underline text-gray-500"
        >
          Refresh the page
        </button>{' '}
        to sync your plan.
      </p>
    </div>
  );
}
