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
  return new Date(unixSec * 1000).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function fmtDateMs(unixMs: number | undefined) {
  if (!unixMs) return '—';
  return new Date(unixMs).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function fmtDateTimeMs(unixMs: number | undefined) {
  if (!unixMs) return '—';
  return new Date(unixMs).toLocaleString(undefined, {
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
  return new Date(unixMs).toLocaleString(undefined, {
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

// ── Geography: turn raw 2-letter codes into human-readable names ──────────────
// "IN" alone is ambiguous (India vs Indiana). We disambiguate by FIELD:
// country codes → country name + flag (via Intl.DisplayNames, covers all ISO
// alpha-2); state codes → expanded against the US/CA subdivision maps when the
// country is US/CA. So a country=IN row shows "🇮🇳 India" while a state=IN (US)
// row shows "Indiana, 🇺🇸 United States".

const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington, D.C.',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', PR: 'Puerto Rico',
};
const CA_PROVINCES: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador', NS: 'Nova Scotia', NT: 'Northwest Territories',
  NU: 'Nunavut', ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec',
  SK: 'Saskatchewan', YT: 'Yukon',
};

let _regionNames: Intl.DisplayNames | null = null;
function regionNames(): Intl.DisplayNames | null {
  if (_regionNames) return _regionNames;
  try { _regionNames = new Intl.DisplayNames(['en'], { type: 'region' }); } catch { _regionNames = null; }
  return _regionNames;
}

/** ISO alpha-2 country code → full English name (e.g. "IN" → "India"). */
export function countryName(code: string | null | undefined): string {
  if (!code) return '';
  const c = code.trim().toUpperCase();
  if (c.length !== 2) return code;
  try { return regionNames()?.of(c) ?? code; } catch { return code; }
}

/** ISO alpha-2 → flag emoji (regional-indicator pair). "" if not 2 letters. */
export function countryFlag(code: string | null | undefined): string {
  if (!code) return '';
  const c = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return '';
  return String.fromCodePoint(...[...c].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** "🇮🇳 India" for display; falls back to the raw code if unknown. */
export function formatCountry(code: string | null | undefined): string {
  if (!code) return '';
  const flag = countryFlag(code);
  const name = countryName(code);
  return flag ? `${flag} ${name}` : name;
}

/**
 * Human-readable location from a (state, country) pair. Expands US/CA state
 * codes to full names and the country to "flag + name", so admins never see a
 * bare ambiguous "IN".
 */
export function formatLocation(state: string | null | undefined, country: string | null | undefined): string {
  const c = (country ?? '').trim().toUpperCase();
  const st = (state ?? '').trim();
  let stateName = st;
  const stU = st.toUpperCase();
  if ((c === 'US' || c === 'USA' || c === '') && US_STATES[stU]) stateName = US_STATES[stU];
  else if (c === 'CA' && CA_PROVINCES[stU]) stateName = CA_PROVINCES[stU];
  const countryDisp = formatCountry(country);
  if (stateName && countryDisp) return `${stateName}, ${countryDisp}`;
  return countryDisp || stateName || '—';
}
