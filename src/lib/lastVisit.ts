'use client';

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
 *  return to. Falls back to the prettified route if not in the table. */
const ROUTE_TO_LABEL: Record<string, string> = {
  '/dashboard/transactions': 'Transactions',
  '/dashboard/budget': 'Budget',
  '/dashboard/recurring': 'Recurring',
  '/dashboard/zakat': 'Zakat',
  '/dashboard/hawl': 'Zakat Anniversary',
  '/dashboard/sadaqah': 'Sadaqah',
  '/dashboard/savings': 'Savings Goals',
  '/dashboard/debts': 'Debts',
  '/dashboard/bills': 'Bills',
  '/dashboard/assets': 'Assets',
  '/dashboard/net-worth': 'Net Worth',
  '/dashboard/investments': 'Investments',
  '/dashboard/halal': 'Stock Screener',
  '/dashboard/riba': 'Riba Detector',
  '/dashboard/wasiyyah': 'Islamic Will',
  '/dashboard/faraid': 'Inheritance Calculator',
  '/dashboard/waqf': 'Endowment',
  '/dashboard/family': 'Family',
  '/dashboard/shared': 'Shared Finances',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/categorize': 'Auto-Categorize',
  '/dashboard/subscriptions': 'Subscription Detector',
  '/dashboard/prayer-times': 'Prayer Times',
  '/dashboard/ramadan': 'Ramadan Mode',
  '/dashboard/fiqh': 'Fiqh Settings',
  '/dashboard/ibadah': 'Ibadah Finance',
  '/dashboard/retirement-zakat': 'Retirement Zakat',
  '/dashboard/profile': 'Profile & Settings',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/referral': 'Refer a Friend',
  '/dashboard/reports': 'Reports',
  '/dashboard/summary': 'Financial Summary',
  '/dashboard/barakah-score': 'Barakah Score',
  '/dashboard/market-prices': 'Market Prices',
  '/dashboard/ledger': 'Audit Ledger',
};

export function labelForRoute(pathname: string): string {
  if (ROUTE_TO_LABEL[pathname]) return ROUTE_TO_LABEL[pathname];
  // Fallback: take the last path segment, capitalize, replace dashes.
  const tail = pathname.split('/').filter(Boolean).pop() ?? 'page';
  return tail.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
