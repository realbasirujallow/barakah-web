/**
 * Display helpers + color/label lookups shared across all admin dashboard
 * tabs: plan badge styles, subscription-status badges, and the timestamp
 * formatters (fmtDate — unix seconds; fmtDateMs / fmtDateTimeMs / fmtFullTs
 * — unix milliseconds; daysUntil).
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. No output-format changes — same strings produced as before.
 */

export const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:   { label: 'Free',   color: 'bg-gray-100 text-gray-600' },
  plus:   { label: 'Plus',   color: 'bg-blue-100 text-blue-700' },
  family: { label: 'Family', color: 'bg-purple-100 text-purple-700' },
};

export const SUB_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:   { label: 'Active',   color: 'bg-green-100 text-green-700' },
  trialing: { label: 'Trial',    color: 'bg-amber-100 text-amber-700' },
  trial:    { label: 'Trial',    color: 'bg-amber-100 text-amber-700' },  // legacy
  past_due: { label: 'Past Due', color: 'bg-red-100 text-red-700' },
  canceled: { label: 'Canceled', color: 'bg-gray-200 text-gray-500' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-400' },
};

export function fmtDate(unixSec: number | undefined) {
  if (!unixSec) return '—';
  return new Date(unixSec * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function fmtDateMs(unixMs: number | undefined) {
  if (!unixMs) return '—';
  return new Date(unixMs).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function fmtDateTimeMs(unixMs: number | undefined) {
  if (!unixMs) return '—';
  return new Date(unixMs).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/** Full-precision timestamp for admin troubleshooting: Jan 15, 2026 3:42:15 PM */
export function fmtFullTs(unixMs: number | undefined) {
  if (!unixMs) return '—';
  return new Date(unixMs).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function daysUntil(epochSec: number | undefined) {
  if (!epochSec) return null;
  const diff = epochSec - Math.floor(Date.now() / 1000);
  return Math.ceil(diff / 86400);
}
