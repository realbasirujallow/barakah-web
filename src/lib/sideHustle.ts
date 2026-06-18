// 2026-06-18 (Side Hustle Phase 1): shared types + helpers for the Family-gated
// "Side Hustle" tax-tracking feature. User-facing copy is always "Side Hustle";
// the internal wire/DB field is `businessId` / `business_id` (parallels
// `assetId` / `asset_id`). See the backend contract.

/** SideHustle response object — matches the backend `sideHustle` JSON shape. */
export interface SideHustle {
  id: number;
  name: string;
  hustleType?: string | null;
  defaultCurrency?: string | null;
  /** Fiscal-year start month, 1–12. Jurisdiction-neutral (no Schedule-C assumption). */
  taxYearStartMonth: number;
  color?: string | null;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Per-fiscal-year aggregate summary — matches the backend summary payload.
 *  All monetary values are in a single base currency (`currency`); multi-
 *  currency rows are converted server-side via aggregateSummary + toBaseCurrency. */
export interface SideHustleSummary {
  sideHustleId: number;
  name: string;
  currency: string;
  year: number;
  taxYearStartMonth: number;
  periodStart: number;
  periodEnd: number;
  period: string;
  totalIncome: number;
  totalExpenses: number;
  totalTransfers: number;
  netIncome: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  transactionCount: number;
}

/** A read response that the backend gated for non-Family users. */
export interface LockedPayload {
  locked: true;
  requiredPlan: string;
}

/** Type guard: the backend returns {locked:true,requiredPlan:'family'} (HTTP
 *  200) for non-Family reads instead of data, so callers can branch without a
 *  403 ever firing. */
export function isLocked(res: unknown): res is LockedPayload {
  return typeof res === 'object' && res !== null && (res as { locked?: unknown }).locked === true;
}

/** Filename slug used by the CSV/PDF export endpoints. Mirrors the backend's
 *  filename derivation so the downloaded file name lines up: lowercased,
 *  non-alphanumerics collapsed to underscores, trimmed, never empty. */
export function sideHustleSlug(name: string): string {
  const slug = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return slug || 'side_hustle';
}

/** The 12 months, for the fiscal-year-start picker. Labelled via Intl in the
 *  active formatting locale so Arabic/Urdu/French users see localized month
 *  names without per-locale i18n keys. */
export function monthOptions(locale: string | undefined): Array<{ value: number; label: string }> {
  const fmt = new Intl.DateTimeFormat(locale || 'en', { month: 'long' });
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    // Day 1 of month i (2000 is a safe leap-agnostic anchor for month names).
    label: fmt.format(new Date(2000, i, 1)),
  }));
}
