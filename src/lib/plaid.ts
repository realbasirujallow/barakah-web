const PLAID_LINK_TOKEN_STORAGE_KEY = 'barakah_plaid_link_token';

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
