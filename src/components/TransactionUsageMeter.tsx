'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth, hasAccess } from '../context/AuthContext';
import { api } from '../lib/api';

interface UsageData {
  used: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
  resetAt: number;
  plan: string;
  limitReached: boolean;
}

/**
 * Transaction usage meter for free-plan users.
 * Shows "X of 25 transactions used this month" with a progress bar.
 * Displays upgrade prompt when approaching or at the limit.
 *
 * Usage: <TransactionUsageMeter /> — renders nothing for Plus/Family users.
 */
export function TransactionUsageMeter() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [now] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    if (!user || hasAccess(user.plan, 'plus', user.planExpiresAt)) return;

    api.getTransactionUsage()
      .then((data: UsageData) => setUsage(data))
      .catch(() => {}); // Silent fail — meter is non-critical
  }, [user]);

  // Don't render for paid users or if no data
  if (!user || hasAccess(user.plan, 'plus', user.planExpiresAt) || !usage) return null;
  if (usage.limit === 'unlimited') return null;

  const used = usage.used;
  const limit = usage.limit as number;
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, (used / limit) * 100);
  const isNearLimit = remaining <= 5 && remaining > 0;
  const isAtLimit = remaining === 0;

  // Days until reset
  const daysUntilReset = Math.max(1, Math.ceil((usage.resetAt - now) / 86400));

  const handleUpgrade = async () => {
    try {
      const result = await api.upgradeSubscription('plus');
      if (result?.url) {
        // Validate URL before redirecting — only allow HTTPS Stripe URLs
        try {
          const parsed = new URL(result.url);
          if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('stripe.com')) {
            window.location.href = '/dashboard/billing';
            return;
          }
        } catch { window.location.href = '/dashboard/billing'; return; }
        window.location.href = result.url;
      }
    } catch {
      window.location.href = '/dashboard/billing';
    }
  };

  // At limit — show full upgrade prompt
  if (isAtLimit) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-amber-800">Monthly limit reached</span>
          <span className="text-xs text-amber-600">Resets in {daysUntilReset} days</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2 mb-3">
          <div className="bg-amber-600 h-2 rounded-full" style={{ width: '100%' }} />
        </div>
        <p className="text-sm text-amber-700 mb-3">
          You&apos;ve used all {limit} free transactions this month.
          Upgrade to Plus for unlimited transactions and 11 premium features.
        </p>
        <button
          onClick={handleUpgrade}
          className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-2 px-4 rounded-lg text-sm font-semibold transition"
        >
          Upgrade to Plus — $9.99/mo
        </button>
      </div>
    );
  }

  // Near limit — show warning with subtle upgrade nudge
  if (isNearLimit) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-amber-800">
            {remaining} transaction{remaining !== 1 ? 's' : ''} remaining
          </span>
          <span className="text-xs text-amber-600">Resets in {daysUntilReset} days</span>
        </div>
        <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-600">
            {used} of {limit} used this month
          </span>
          <button
            onClick={handleUpgrade}
            className="text-xs font-semibold text-[#1B5E20] hover:underline"
          >
            Go unlimited →
          </button>
        </div>
      </div>
    );
  }

  // Normal usage — subtle meter
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500">
          {used} of {limit} transactions this month
        </span>
        <span className="text-xs text-gray-400">Resets in {daysUntilReset} days</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-[#1B5E20] h-1.5 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
