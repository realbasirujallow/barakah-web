/**
 * Support-mode (super-admin "View as user") client helpers.
 *
 * <p>The backend issues a separate short-lived JWT when a super-admin
 * starts a support session. The web client stores that token in
 * sessionStorage (NOT localStorage; NOT a cookie) and includes it as
 * {@code X-Support-Token} on every request while support mode is
 * active. Removing the token from sessionStorage immediately reverts
 * the client to the admin's normal session — the cookie session is
 * never disturbed.
 *
 * <p>Backend reference: {@code SupportSessionFilter} +
 * {@code SupportSessionsController}.
 */

const TOKEN_KEY = 'barakah_support_token';
const META_KEY = 'barakah_support_meta';

/** All metadata the banner needs to render. */
export interface SupportSessionMeta {
  sessionId: number;
  targetUserId: number;
  /** target user's display info — fetched from /admin/users/{id}/360 */
  targetEmail?: string;
  targetName?: string;
  reasonCode: string;
  reasonNote?: string;
  mode: 'VIEW_ONLY';
  startedAt: number;
  expiresAt: number;
}

export function setSupportToken(token: string, meta: SupportSessionMeta) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(META_KEY, JSON.stringify(meta));
    // Notify same-tab listeners (storage events only fire across tabs)
    window.dispatchEvent(new CustomEvent('barakah:support-mode-changed'));
  } catch {
    /* sessionStorage may be disabled */
  }
}

export function clearSupportToken() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(META_KEY);
    window.dispatchEvent(new CustomEvent('barakah:support-mode-changed'));
  } catch {
    /* */
  }
}

export function getSupportToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getSupportMeta(): SupportSessionMeta | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupportSessionMeta;
    // Defensive: if the token has expired client-side, clear it. The
    // backend is the final enforcement, but a stale token in storage
    // should not show a misleading banner.
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      clearSupportToken();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** True iff there's an active, non-expired support token in storage. */
export function isInSupportMode(): boolean {
  return getSupportMeta() !== null;
}

/**
 * The valid reason codes accepted by the backend. Keep in sync with
 * {@code SupportSessionService.REASON_CODES}.
 */
export const REASON_CODES = [
  'customer_support',
  'onboarding_help',
  'billing_help',
  'bug_reproduction',
  'accessibility_help',
  'family_setup_help',
  'other_with_note_required',
] as const;

export type ReasonCode = (typeof REASON_CODES)[number];

export function reasonCodeLabel(code: string): string {
  switch (code) {
    case 'customer_support':           return 'Customer support';
    case 'onboarding_help':            return 'Onboarding help';
    case 'billing_help':               return 'Billing help';
    case 'bug_reproduction':           return 'Bug reproduction';
    case 'accessibility_help':         return 'Accessibility help';
    case 'family_setup_help':          return 'Family setup help';
    case 'other_with_note_required':   return 'Other (note required)';
    default:                           return code;
  }
}
