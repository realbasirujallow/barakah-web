const SETUP_KEY_PREFIX = 'barakah_guided_setup_v1';
const ONBOARDING_KEY = 'barakah_onboarded';

function getSetupKey(userId: string) {
  return `${SETUP_KEY_PREFIX}:${userId}`;
}

export function hasCompletedGuidedSetup(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(getSetupKey(userId)) === 'true';
}

export function markGuidedSetupComplete(userId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getSetupKey(userId), 'true');
  window.localStorage.setItem(ONBOARDING_KEY, 'true');
}
