const PLAID_LINK_TOKEN_STORAGE_KEY = 'barakah_plaid_link_token';

type PlaidPhase = 'start' | 'exchange' | 'sync' | 'unlink';

export function savePendingPlaidLinkToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PLAID_LINK_TOKEN_STORAGE_KEY, token);
}

export function readPendingPlaidLinkToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(PLAID_LINK_TOKEN_STORAGE_KEY);
}

export function clearPendingPlaidLinkToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PLAID_LINK_TOKEN_STORAGE_KEY);
}

function extractPlaidErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  if (
    error
    && typeof error === 'object'
    && 'display_message' in error
    && typeof (error as { display_message?: unknown }).display_message === 'string'
  ) {
    return ((error as { display_message?: string }).display_message || '').trim();
  }
  return '';
}

function defaultPlaidPhaseMessage(phase: PlaidPhase): string {
  switch (phase) {
    case 'exchange':
      return "We couldn't finish linking that account. Please try again or choose a different institution.";
    case 'sync':
      return "We couldn't sync this account right now. Please try again in a few minutes.";
    case 'unlink':
      return "We couldn't unlink that account right now. Please try again.";
    case 'start':
    default:
      return "We couldn't start secure bank linking right now. Please try again in a few minutes.";
  }
}

export function getPlaidUiErrorMessage(error: unknown, phase: PlaidPhase = 'start'): string {
  const message = extractPlaidErrorMessage(error);
  if (!message) return defaultPlaidPhaseMessage(phase);

  const lower = message.toLowerCase();
  if (
    lower.startsWith("we couldn't")
    || lower.startsWith('your session')
    || lower.startsWith('plaid bank sync is available')
    || lower.startsWith('bank linking is temporarily unavailable')
    || lower.startsWith('plaid is temporarily busy')
  ) {
    return message;
  }

  if (
    lower.includes('network error')
    || lower.includes('no connection')
    || lower.includes('server unavailable')
  ) {
    return "We couldn't reach Plaid right now. Please check your connection and try again.";
  }

  if (
    lower.includes('link token')
    || lower.includes('production.plaid.com')
    || lower.includes('documentation_url')
    || lower.includes('error_code')
    || lower.includes('invalid_product')
    || lower.includes('plaid request failed')
  ) {
    return defaultPlaidPhaseMessage(phase);
  }

  return message;
}
