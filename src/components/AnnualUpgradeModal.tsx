'use client';

/**
 * AnnualUpgradeModal — mid-session modal shown to active monthly Plus/Family
 * subscribers who have been on the platform for 30+ days.
 *
 * Trigger rules:
 *   1. subscriptionStatus === 'active', plan === 'plus' | 'family'
 *   2. First seen on paid plan ≥ 30 days ago (tracked in localStorage)
 *   3. User has been in the current browser session ≥ SESSION_DELAY_MS (5 min)
 *   4. Not dismissed within the last COOLDOWN_DAYS (60 days)
 *
 * On dismiss: sets a 60-day cooldown so the modal re-appears after they've
 * had another billing cycle. Links to /dashboard/billing which has the annual
 * upgrade flow.
 */

import { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../lib/useFocusTrap';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { PRICING } from '../lib/pricing';

const PLAN_ACTIVE_SINCE_KEY = 'barakah_plan_active_since';
const MODAL_DISMISSED_UNTIL_KEY = 'barakah_annual_modal_dismissed_until';
const SESSION_DELAY_MS = 5 * 60 * 1000; // 5 minutes
const MIN_AGE_DAYS = 30;                  // must be on paid plan ≥ 30 days
const COOLDOWN_DAYS = 60;                 // re-shows after 60 days

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* unavailable */ }
}

export default function AnnualUpgradeModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  // Keep a ref to the pending timer so the useEffect cleanup can always cancel it,
  // even if the component unmounts while the API call is still in-flight.
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user || user.isAdmin || (user.plan !== 'plus' && user.plan !== 'family')) return;

    // Check cooldown first — cheapest check
    const dismissedUntil = safeGet(MODAL_DISMISSED_UNTIL_KEY);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) return;

    let cancelled = false;

    // Verify subscription is truly active (not trialing) via API
    api.subscriptionStatus()
      .then((data) => {
        if (cancelled) return;
        const s = data as { plan: string; status: string; hasSubscription: boolean };
        if (s.status !== 'active' || !s.hasSubscription) return;
        if (s.plan !== 'plus' && s.plan !== 'family') return;

        // Record when we first saw this user on an active paid plan
        const now = Date.now();
        const existing = safeGet(PLAN_ACTIVE_SINCE_KEY);
        if (!existing) safeSet(PLAN_ACTIVE_SINCE_KEY, String(now));
        const planActiveSince = parseInt(safeGet(PLAN_ACTIVE_SINCE_KEY) ?? String(now), 10);
        const daysOnPlan = (now - planActiveSince) / (1000 * 60 * 60 * 24);

        if (daysOnPlan < MIN_AGE_DAYS) return; // Too new — don't bother yet

        // Schedule the modal to appear after SESSION_DELAY_MS of this session
        timerRef.current = window.setTimeout(() => setOpen(true), SESSION_DELAY_MS);
      })
      .catch(() => { /* silently ignore */ });

    // Cleanup: cancel the in-flight timer and flag the async callback as stale
    return () => {
      cancelled = true;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [user]);

  const handleDismiss = () => {
    const until = Date.now() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    safeSet(MODAL_DISMISSED_UNTIL_KEY, String(until));
    setOpen(false);
  };

  // HIGH BUG FIX (H-10): add Escape key handler so users can dismiss the
  // annual-upgrade modal with the keyboard. This also records the 60-day
  // cooldown via handleDismiss so the modal doesn't immediately re-appear.
  // The wrapper already has role="dialog" + aria-modal set below.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Round 29: focus-trap so keyboard users can't Tab through to the
  // pricing page behind while the upgrade decision dialog is up.
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, open);

  if (!open || !user || user.isAdmin) return null;

  const isFamily = user.plan === 'family';
  const monthlyPrice = isFamily ? PRICING.family.monthly : PRICING.plus.monthly;
  const yearlyPrice  = isFamily ? PRICING.family.yearly  : PRICING.plus.yearly;
  const monthlySavingPct = isFamily ? PRICING.family.yearlySaving : PRICING.plus.yearlySaving;
  const monthlyNum  = parseFloat(monthlyPrice.replace('$', ''));
  const yearlyNum   = parseFloat(yearlyPrice.replace('$', ''));
  const annualSavings = ((monthlyNum * 12) - yearlyNum).toFixed(2);
  const planLabel   = isFamily ? 'Family' : 'Plus';

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="annual-upgrade-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-6 text-white text-center">
          <p className="text-4xl mb-2">💰</p>
          <h2 id="annual-upgrade-modal-title" className="text-xl font-bold">
            {monthlySavingPct} with an Annual Plan
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            You&apos;ve been with Barakah {MIN_AGE_DAYS}+ days — thank you!
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="bg-amber-50 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Barakah {planLabel} Monthly</span>
              <span className="font-semibold text-gray-800">{monthlyPrice}/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-gray-600">Barakah {planLabel} Annual</span>
              <span className="font-semibold text-[#1B5E20]">
                {yearlyPrice}/year
              </span>
            </div>
            <div className="border-t border-amber-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-amber-900">You save</span>
              <span className="text-2xl font-bold text-amber-700">${annualSavings}/year</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6 text-center">
            Switch to annual billing and get{' '}
            <strong>2 months free</strong>. Same features, same plan — just a
            better price for your commitment to halal financial management.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/billing"
              onClick={handleDismiss}
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl text-center transition"
            >
              Switch to Annual — Save ${annualSavings}
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Not now — maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
