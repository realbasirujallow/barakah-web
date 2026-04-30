'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PRICING } from '../lib/pricing';

// Dismiss for 30 days — re-shows after that so we catch users who upgraded
// to Plus monthly and might now want the annual discount.
const DISMISS_KEY = 'barakah_annual_banner_dismissed_until';

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* unavailable */ }
}

/**
 * Annual upgrade nudge — shown to active monthly Plus/Family subscribers.
 *
 * Visibility rules:
 *   - subscriptionStatus === 'active' (not trialing, not inactive)
 *   - plan is 'plus' or 'family'
 *   - user hasn't dismissed within 30 days
 *
 * Shows the savings amount up-front: Plus saves $20.88/yr, Family saves $60.88/yr.
 * Links to /dashboard/billing where the user can toggle to the yearly tab and upgrade.
 */
export default function AnnualUpgradeBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      if (!user || user.isAdmin) {
        if (isMounted) {
          setShow(false);
          setLoaded(Boolean(user?.isAdmin));
        }
        return;
      }

      // Check localStorage dismissal
      const dismissedUntil = safeGet(DISMISS_KEY);
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        if (isMounted) {
          setShow(false);
          setLoaded(true);
        }
        return;
      }

      try {
        const data = await api.subscriptionStatus();
        const s = data as { plan: string; status: string; hasSubscription: boolean };
        const isActivePaid =
          s.status === 'active' &&
          (s.plan === 'plus' || s.plan === 'family') &&
          s.hasSubscription;
        if (isMounted) {
          setShow(isActivePaid);
        }
      } catch {
        if (isMounted) {
          setShow(false);
        }
      } finally {
        if (isMounted) {
          setLoaded(true);
        }
      }
    };

    void loadBanner();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user || user.isAdmin || !loaded || !show) return null;

  const isFamily = user.plan === 'family';
  const savingPct = isFamily ? PRICING.family.yearlySaving : PRICING.plus.yearlySaving; // 'Save 34%' or 'Save 17%'
  const monthlyPrice = isFamily ? PRICING.family.monthly : PRICING.plus.monthly;
  const yearlyPrice = isFamily ? PRICING.family.yearly : PRICING.plus.yearly;
  // Calculate annual savings: (monthly × 12) - yearly
  const monthlyNum = parseFloat(monthlyPrice.replace('$', ''));
  const yearlyNum = parseFloat(yearlyPrice.replace('$', ''));
  const annualSavings = ((monthlyNum * 12) - yearlyNum).toFixed(2);
  const planLabel = isFamily ? 'Family' : 'Plus';

  const handleDismiss = () => {
    // Dismiss for 30 days
    const until = Date.now() + 30 * 24 * 60 * 60 * 1000;
    safeSet(DISMISS_KEY, String(until));
    setShow(false);
  };

  return (
    <div
      className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3 flex-wrap"
      data-testid="annual-upgrade-banner"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">💰</span>
        <div className="min-w-0">
          <p className="font-semibold text-amber-900 text-sm sm:text-base">
            {savingPct} switching to annual — save ${annualSavings}/year
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            You&apos;re on Barakah {planLabel} monthly ({monthlyPrice}/mo). Switch to annual at{' '}
            <span className="font-semibold">{yearlyPrice}/year</span> and get 2 months free.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/dashboard/billing"
          className="bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-700 transition whitespace-nowrap"
        >
          Switch to Annual
        </Link>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss annual upgrade banner"
          className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2 py-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
