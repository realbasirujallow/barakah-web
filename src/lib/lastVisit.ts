'use client';

import { t } from './i18n';

/**
 * Phase 14 (Apr 30 2026) — last-visited dashboard page tracker.
 *
 * Powers the "Continue where you left off" surface on /dashboard.
 *
 * Stores the last *meaningful* dashboard route the user visited (not
 * /dashboard itself, not transient modal routes) along with a
 * timestamp. The dashboard's <ContinueWhereYouLeftOff> reads this on
 * load and renders a single shortcut chip — same pattern Monarch /
 * Notion / Linear use to make returning to the product feel fluid.
 *
 * Why localStorage and not server state: this is purely a UX nicety,
 * lives client-side, and doesn't need to sync across devices for a
 * useful first version. If we ever want cross-device, we can swap the
 * storage layer here without touching consumers.
 */

const KEY = 'barakah_last_visit';
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface LastVisit {
  pathname: string;
  /** UTC timestamp ms */
  at: number;
}

/** Routes we never record — visiting the dashboard root is not "where
 *  you left off" (it would create a self-link), and admin/auth flows
 *  shouldn't be the suggested return destination. */
const SKIP_PREFIXES = [
  '/dashboard$',           // dashboard root
  '/dashboard/admin',      // admin pages
  '/dashboard/import',     // setup flows
  '/dashboard/billing',    // billing/upgrade isn't a "return to" surface
];

function shouldSkip(pathname: string): boolean {
  if (pathname === '/dashboard') return true;
  return SKIP_PREFIXES.some(p => {
    if (p.endsWith('$')) return pathname === p.slice(0, -1);
    return pathname.startsWith(p);
  });
}

/** Record the current path as the user's last visit. Call from
 *  dashboard sub-pages (or once globally in dashboard layout via
 *  pathname tracking). Skips routes in SKIP_PREFIXES.
 *  No-op outside the dashboard tree. */
export function recordVisit(pathname: string): void {
  if (typeof window === 'undefined') return;
  if (!pathname.startsWith('/dashboard/')) return;
  if (shouldSkip(pathname)) return;
  try {
    const payload: LastVisit = { pathname, at: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota — accept silently */
  }
}

/** Read the user's last meaningful dashboard visit, or null if none
 *  recorded / stored value is older than 7 days / parsing fails. */
export function getLastVisit(): LastVisit | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastVisit;
    if (!parsed?.pathname || typeof parsed.at !== 'number') return null;
    if (Date.now() - parsed.at > STALE_AFTER_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Map a route to its sidebar label. The dashboard layout already
 *  has the canonical labels (post-Phase-10 plain-language pass) — this
 *  is a smaller subset for the surfaces the user is most likely to
 *  return to. Falls back to the prettified route if not in the table.
 *
 *  2026-06-11 (i18n bug cluster): values are now the sidebar's nav* i18n
 *  KEYS instead of hardcoded English, so the dashboard's "Pick up where
 *  you left off — {route}" chip renders localized for ar/ur/fr users.
 *  labelForRoute resolves via the standalone t() (current locale); the
 *  consuming dashboard component already re-renders on locale change. */
const ROUTE_TO_LABEL_KEY: Record<string, string> = {
  '/dashboard/transactions': 'navTransactions',
  '/dashboard/budget': 'navBudget',
  '/dashboard/recurring': 'navRecurring',
  '/dashboard/zakat': 'navZakat',
  '/dashboard/hawl': 'navZakatAnniversary',
  '/dashboard/sadaqah': 'navSadaqah',
  '/dashboard/savings': 'navSavingsGoals',
  '/dashboard/debts': 'navDebts',
  '/dashboard/bills': 'navBills',
  '/dashboard/assets': 'navAssets',
  '/dashboard/net-worth': 'navNetWorth',
  '/dashboard/investments': 'navInvestments',
  '/dashboard/halal': 'navStockScreener',
  '/dashboard/riba': 'navRibaDetector',
  '/dashboard/wasiyyah': 'navIslamicWill',
  '/dashboard/faraid': 'navInheritanceCalculator',
  '/dashboard/waqf': 'navEndowment',
  '/dashboard/family': 'navFamily',
  '/dashboard/shared': 'navSharedFinances',
  '/dashboard/analytics': 'navAnalytics',
  '/dashboard/categorize': 'navTransactionSorting',
  '/dashboard/subscriptions': 'navSubscriptionDetector',
  '/dashboard/ramadan': 'navRamadanMode',
  '/dashboard/fiqh': 'navFiqhSettings',
  '/dashboard/ibadah': 'navIbadahFinance',
  '/dashboard/retirement-zakat': 'navRetirementZakat',
  '/dashboard/profile': 'navProfileSettings',
  '/dashboard/notifications': 'navNotifications',
  '/dashboard/referral': 'navReferAFriend',
  '/dashboard/reports': 'navReports',
  '/dashboard/summary': 'navFinancialSummary',
  '/dashboard/barakah-score': 'navBarakahScore',
  '/dashboard/market-prices': 'navMarketPrices',
  '/dashboard/ledger': 'navAuditLedger',
};

export function labelForRoute(pathname: string): string {
  const key = ROUTE_TO_LABEL_KEY[pathname];
  if (key) return t(key);
  // Fallback: take the last path segment, capitalize, replace dashes.
  const tail = pathname.split('/').filter(Boolean).pop() ?? 'page';
  return tail.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
