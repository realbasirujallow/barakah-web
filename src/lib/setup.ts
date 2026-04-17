const SETUP_KEY_PREFIX = 'barakah_guided_setup_v1';
const ONBOARDING_KEY = 'barakah_onboarded';

function getSetupKey(userId: string) {
  return `${SETUP_KEY_PREFIX}:${userId}`;
}

/**
 * Round 23: the per-device localStorage flag is now a FALLBACK for
 * legacy users who completed setup before the server-side
 * `setup_completed_at` column existed. New consumers should prefer
 * `user.setupCompletedAt` from `useAuth()`; use this helper only when
 * that field is null/undefined.
 */
export function hasCompletedGuidedSetup(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(getSetupKey(userId)) === 'true';
}

/**
 * Round 23: convenience that prefers the server-side timestamp over
 * the legacy localStorage flag. Pass the user's `setupCompletedAt`
 * from `useAuth()`; if it's null, we fall back to the flag.
 */
export function isSetupComplete(
  userId: string,
  serverSideSetupCompletedAt: number | null | undefined,
): boolean {
  if (serverSideSetupCompletedAt && serverSideSetupCompletedAt > 0) return true;
  return hasCompletedGuidedSetup(userId);
}

export function markGuidedSetupComplete(userId: string) {
  if (typeof window === 'undefined') return;
  // Still write the local flag so a user with an outage between POST
  // /auth/setup-complete and the next page load doesn't get bounced
  // back to setup.
  window.localStorage.setItem(getSetupKey(userId), 'true');
  window.localStorage.setItem(ONBOARDING_KEY, 'true');
}
