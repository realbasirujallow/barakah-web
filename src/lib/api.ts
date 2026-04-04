// When empty (default), requests use same-origin and are proxied to the
// backend by Next.js rewrites in next.config.ts — no CORS required.
// Set NEXT_PUBLIC_API_URL to a full URL to call the backend directly
// (requires the backend ALLOWED_ORIGINS to include this app's domain).
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ── Timeout Constants ──────────────────────────────────────────────────────
const API_TIMEOUT = 30_000;      // 30s for standard API calls
const UPLOAD_TIMEOUT = 60_000;   // 60s for file uploads
const DOWNLOAD_TIMEOUT = 30_000; // 30s for file downloads
const IMPORT_TIMEOUT = 300_000;  // 5min for large imports (chunked)

// ── CSRF Token Helper ──────────────────────────────────────────────────────
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ── 401 global handler ────────────────────────────────────────────────────────
// Register a callback (e.g. logout + redirect) that fires whenever a 401
// cannot be recovered by the silent refresh flow below.
let onUnauthorizedCallback: (() => void) | null = null;

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorizedCallback = fn;
}

// ── Silent refresh ─────────────────────────────────────────────────────────────
// When a request gets a 401 (expired access token), we attempt one silent
// refresh via POST /auth/refresh. The refresh token is sent in the request
// body (primary) AND as an httpOnly cookie (fallback). The body approach
// bypasses CDN/proxy cookie corruption issues that plagued the cookie-only
// flow (Cloudflare + Railway CDN + Next.js rewrites can mangle cookie values).
//
// If refresh succeeds, the server sets a new auth_token cookie and returns
// a new refresh token in the response body. We store it for the next refresh.
//
// Concurrent 401s are deduplicated: all callers wait for the same refresh
// promise, then each re-tries their own request once.

// ── Persistent refresh token storage ────────────────────────────────────────
// The refresh token is stored in localStorage so it survives page reloads.
// Previously it was in-memory only, which meant that after any full-page
// navigation (typed URL, bookmark, browser refresh) the token was lost and
// the client fell back to the httpOnly cookie. If the cookie was corrupted
// by the Cloudflare/Railway/Next.js proxy chain (a known issue), the refresh
// would fail with 401 and the user would be logged out.
//
// Security note: localStorage IS accessible to XSS, but the auth_token
// (the actual session credential) remains in an httpOnly cookie. The refresh
// token alone cannot access API data — it can only obtain a new auth_token.
// This trade-off (XSS exposure of refresh token vs. functional sessions)
// is acceptable given the CSP headers already in place.
const RT_STORAGE_KEY = '_brt'; // short key to avoid detection by scrapers
const AT_STORAGE_KEY = '_bat'; // access token (JWT) — stored in localStorage

function _loadPersistedRT(): string | null {
  try { return localStorage.getItem(RT_STORAGE_KEY); } catch { return null; }
}
function _persistRT(token: string | null): void {
  try {
    if (token) localStorage.setItem(RT_STORAGE_KEY, token);
    else localStorage.removeItem(RT_STORAGE_KEY);
  } catch { /* SSR / private browsing */ }
}

function _loadPersistedAT(): string | null {
  try { return localStorage.getItem(AT_STORAGE_KEY); } catch { return null; }
}
function _persistAT(token: string | null): void {
  try {
    if (token) localStorage.setItem(AT_STORAGE_KEY, token);
    else localStorage.removeItem(AT_STORAGE_KEY);
  } catch { /* SSR / private browsing */ }
}

let _refreshToken: string | null = (typeof window !== 'undefined') ? _loadPersistedRT() : null;
let _accessToken: string | null = (typeof window !== 'undefined') ? _loadPersistedAT() : null;

/** Store the refresh token (called by AuthContext after login). */
export function setRefreshToken(token: string | null) {
  _refreshToken = token;
  _persistRT(token);
}

/** Store the access token JWT (called by AuthContext after login/refresh). */
export function setAccessToken(token: string | null) {
  _accessToken = token;
  _persistAT(token);
}

/** Get the current in-memory refresh token. */
export function getRefreshToken(): string | null {
  // Re-read from localStorage in case another tab updated it
  if (!_refreshToken && typeof window !== 'undefined') {
    _refreshToken = _loadPersistedRT();
  }
  return _refreshToken;
}

// ── Global refresh deduplication ───────────────────────────────────────────
// ALL callers (proactive refresh in AuthContext, layout navigation refresh,
// background interval, and 401 retry) go through this single gate. Only one
// POST /auth/refresh is ever in-flight at a time. Concurrent callers wait
// for the same promise. This prevents the "rotation death spiral" where two
// simultaneous refresh requests each try to rotate the same token — the
// first succeeds but the second uses the now-revoked token and fails.
type RefreshResult = 'ok' | 'expired' | 'network_error';
let _activeRefreshPromise: Promise<RefreshResult> | null = null;

/**
 * Deduplicated refresh — ALL refresh callers MUST use this instead of
 * calling attemptSilentRefresh() directly. Returns the same promise to
 * all concurrent callers.
 */
function deduplicatedRefresh(): Promise<RefreshResult> {
  if (_activeRefreshPromise) return _activeRefreshPromise;
  _activeRefreshPromise = attemptSilentRefresh().finally(() => {
    _activeRefreshPromise = null;
  });
  return _activeRefreshPromise;
}

/**
 * Calls POST /auth/refresh directly (bypasses apiFetch to avoid recursion).
 * Returns: 'ok' if refresh succeeded, 'expired' if server rejected (401/403),
 * 'network_error' if the request failed due to connectivity.
 * This distinction is critical: 'expired' should trigger logout,
 * 'network_error' should NOT (the session may still be valid).
 */
async function attemptSilentRefresh(): Promise<'ok' | 'expired' | 'network_error'> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout
  try {
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;

    // Send refresh token in body (primary) — bypasses cookie proxy corruption.
    // The httpOnly cookie is also sent automatically as a fallback.
    // Re-read from localStorage in case _refreshToken was lost (e.g. module
    // re-initialization) but persisted storage still has it.
    if (!_refreshToken) _refreshToken = _loadPersistedRT();
    const bodyPayload: Record<string, string> = {};
    if (_refreshToken) {
      bodyPayload.refreshToken = _refreshToken;
    }

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(bodyPayload),
      signal: controller.signal,
    });
    if (res.ok) {
      // Extract tokens from the response body and persist to localStorage.
      // Both access token (JWT) and refresh token are stored so they survive
      // page reloads — CDN/proxy strips Set-Cookie headers, so httpOnly
      // cookies cannot be relied upon for session persistence.
      try {
        const data = await res.json();
        if (data.refreshToken) {
          _refreshToken = data.refreshToken;
          _persistRT(data.refreshToken);
        }
        // The refresh endpoint returns a new JWT in the 'token' field
        if (data.token) {
          _accessToken = data.token;
          _persistAT(data.token);
        }
      } catch {
        // Response body parsing failed — not critical
      }
      return 'ok';
    }
    // Server explicitly rejected our refresh token — session is truly expired
    if (res.status === 401 || res.status === 403) return 'expired';
    // Other server errors (500, etc.) — treat as transient, don't logout
    return 'network_error';
  } catch {
    // Network error, timeout, abort — don't logout
    return 'network_error';
  } finally {
    clearTimeout(timeout);
  }
}

// ── JSON fetch helper ─────────────────────────────────────────────────────────
// suppressUnauthorized: when true, a 401 that cannot be recovered by silent
// refresh throws an error but does NOT fire the global onUnauthorizedCallback
// (i.e., does not auto-logout). Use this for pages like /admin where a 401
// should be handled locally (show "session expired" UI) rather than
// silently logging the user out.
export async function apiFetch(endpoint: string, options: RequestInit = {}, timeoutMs = API_TIMEOUT, suppressUnauthorized = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add Authorization header with JWT from localStorage.
  // CDN/proxy layers (Cloudflare + Railway) strip Set-Cookie headers from
  // Route Handler responses, so httpOnly cookies never reach the browser.
  // The Bearer token from localStorage is the primary auth mechanism.
  if (!_accessToken) _accessToken = _loadPersistedAT();
  if (_accessToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  // Add CSRF token to non-GET requests for CSRF protection
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'GET') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
    }
    // Idempotency key: every POST gets a unique key so the backend can detect
    // and safely deduplicate retries (network glitches, double-clicks, etc.).
    // The server caches the response for 24h keyed on (userId, idempotencyKey).
    // If the caller already set the header (e.g. for manual retry with same key),
    // we respect it.
    if (method === 'POST' && !headers['Idempotency-Key']) {
      headers['Idempotency-Key'] = crypto.randomUUID();
    }
  }

  // credentials: 'include' ensures the auth_token httpOnly cookie is sent on
  // every request. The cookie is never readable by JavaScript — it is set by
  // the server on login and cleared on logout. This eliminates the localStorage
  // XSS risk that exists when storing tokens in client-accessible storage.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err: unknown) {
    if ((err as Record<string, unknown>).name === 'AbortError') {
      throw new Error('Server unavailable, please try again later.');
    }
    throw new Error('No connection to server.');
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    // ── Silent refresh on 401 ──────────────────────────────────────────────
    // Before giving up and redirecting to login, try to silently refresh the
    // access token using the long-lived refresh_token httpOnly cookie.
    // Guard against recursive refresh calls (the /auth/refresh call itself
    // never gets a 401 — it's unauthenticated).
    //
    // SKIP refresh for auth endpoints — a 401 on /auth/login means "wrong
    // password", not "expired token". Let it fall through to the normal
    // error-message extraction below.
    const isAuthEndpoint = endpoint.startsWith('/auth/login') ||
                           endpoint.startsWith('/auth/signup') ||
                           endpoint.startsWith('/auth/forgot-password') ||
                           endpoint.startsWith('/auth/reset-password') ||
                           endpoint.startsWith('/auth/verify-email') ||
                           endpoint.startsWith('/auth/resend-verification');
    if (res.status === 401 && !isAuthEndpoint) {
      // Use the global deduplication gate — all concurrent 401s share one
      // refresh request, preventing the rotation death spiral.
      const refreshResult = await deduplicatedRefresh();

      if (refreshResult === 'ok') {
        // Stamp the refresh time so AuthContext's mount guard (and other tabs)
        // know the cookies are fresh. This prevents AuthContext from firing a
        // redundant proactive refresh when the user navigates between pages,
        // which would race with this refresh and could sign the user out.
        try { localStorage.setItem('last_refresh_ts', String(Date.now())); } catch { /* SSR safety */ }

        // Retry the original request — the new auth_token cookie is now set
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), API_TIMEOUT);
        try {
          const retryRes = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
            signal: retryController.signal,
          });
          clearTimeout(retryTimeout);
          if (retryRes.ok) {
            const retryText = await retryRes.text();
            if (!retryText) return null;
            try { return JSON.parse(retryText); } catch { throw new Error('Unexpected server response.'); }
          }
          // Retry also failed — fall through to the unauthorized handler
        } catch {
          clearTimeout(retryTimeout);
        }
      }

      if (refreshResult === 'network_error') {
        // Network issue — session may still be valid, do NOT logout.
        // Throw a connection error so the UI can show a retry prompt.
        throw new Error('Network error — please check your connection and try again.');
      }

      // Refresh returned 'expired' or retry after 'ok' also failed — session is gone.
      // Only fire the global logout if the caller hasn't opted out.
      if (!suppressUnauthorized && onUnauthorizedCallback) onUnauthorizedCallback();
      throw new Error('Your session has expired. Please log in again.');
    }
    // ── End silent refresh ─────────────────────────────────────────────────

    const text = await res.text();
    // Try to extract a user-friendly message from the JSON error body
    let msg = `API error ${res.status}`;
    if (text) {
      try {
        const json = JSON.parse(text);
        msg = json.error || json.message || msg;
      } catch {
        msg = text.length < 200 ? text : msg;
      }
    }
    throw new Error(msg);
  }

  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Unexpected server response. Please try again.');
  }
}

// ── Multipart upload helper ──────────────────────────────────────────────────
// Sends a file as multipart/form-data (no Content-Type header — browser sets it
// with the correct boundary).
export async function apiUpload(endpoint: string, file: File, fieldName = 'file') {
  const formData = new FormData();
  formData.append(fieldName, file);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err: unknown) {
    if ((err as Record<string, unknown>).name === 'AbortError') throw new Error('Upload timed out.');
    throw new Error('No connection to server.');
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 401) {
      const refreshResult = await deduplicatedRefresh();
      if (refreshResult === 'ok') {
        const r2 = await fetch(`${API_URL}${endpoint}`, { method: 'POST', body: formData, credentials: 'include' });
        if (r2.ok) { const t = await r2.text(); if (!t) return null; try { return JSON.parse(t); } catch { throw new Error('Unexpected server response.'); } }
      }
      if (refreshResult === 'network_error') throw new Error('Network error — please check your connection and try again.');
      if (onUnauthorizedCallback) onUnauthorizedCallback();
      throw new Error('Your session has expired. Please log in again.');
    }
    const text = await res.text();
    let msg = `Upload error ${res.status}`;
    if (text) { try { const j = JSON.parse(text); msg = j.error || j.message || msg; } catch { /* ignore */ } }
    throw new Error(msg);
  }

  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { throw new Error('Unexpected server response.'); }
}

// ── Binary download helper ────────────────────────────────────────────────────
// Triggers a browser file download for endpoints that return binary data
// (CSV, PDF, etc.) rather than JSON.
export async function apiDownload(endpoint: string, filename: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err: unknown) {
    if ((err as Record<string, unknown>).name === 'AbortError') throw new Error('Download timed out.');
    throw new Error('No connection to server.');
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 401) {
      const refreshResult = await deduplicatedRefresh();
      if (refreshResult === 'ok') {
        const r2 = await fetch(`${API_URL}${endpoint}`, { credentials: 'include' });
        if (r2.ok) {
          const blob2 = await r2.blob();
          const url2 = URL.createObjectURL(blob2);
          const a2 = document.createElement('a'); a2.href = url2; a2.download = filename;
          document.body.appendChild(a2); a2.click(); document.body.removeChild(a2); URL.revokeObjectURL(url2);
          return;
        }
      }
      if (refreshResult === 'network_error') throw new Error('Network error — please check your connection and try again.');
      if (onUnauthorizedCallback) onUnauthorizedCallback();
      throw new Error('Your session has expired. Please log in again.');
    }
    throw new Error(`Download failed (${res.status})`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const api = {
  // Auth
  login: (email: string, password: string, rememberMe = false) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, rememberMe }) }),
  signup: (name: string, email: string, password: string, state: string, country: string, referralCode?: string) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ fullName: name, email, password, state, country, referralCode }) }),
  // Clears the auth_token httpOnly cookie on the server side.
  logout: () =>
    apiFetch('/auth/logout', { method: 'POST' }),
  // Silently renews the access token using the refresh_token cookie.
  // Returns 'ok' | 'expired' | 'network_error' to let callers distinguish
  // genuine session expiry from transient connectivity issues.
  // Uses deduplicatedRefresh() so concurrent callers share one request.
  refresh: () => deduplicatedRefresh(),
  verifyEmail: (token: string) =>
    apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`),
  resendVerification: (email: string) =>
    apiFetch('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, newPassword: string) =>
    apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),

  // Assets
  getAssets: () => apiFetch('/api/assets/list'),
  getAssetTotal: () => apiFetch('/api/assets/total'),
  addAsset: (data: Record<string, unknown>) =>
    apiFetch('/api/assets/add', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAsset: (id: number) =>
    apiFetch(`/api/assets/${id}`, { method: 'DELETE' }),

  // Transactions
  getTransactions: (type?: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (page !== undefined) params.set('page', String(page));
    if (size !== undefined) params.set('size', String(size));
    return apiFetch(`/api/transactions/list?${params}`);
  },
  getTransactionUsage: () => apiFetch('/api/transactions/usage'),
  addTransaction: (data: Record<string, unknown>) =>
    apiFetch('/api/transactions/add', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id: number) =>
    apiFetch(`/api/transactions/${id}`, { method: 'DELETE' }),
  bulkDeleteTransactions: (ids: number[]) =>
    apiFetch('/api/transactions/bulk', { method: 'DELETE', body: JSON.stringify({ ids }) }),
  deleteAllTransactions: (type?: string) => {
    const params = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiFetch(`/api/transactions/all${params}`, { method: 'DELETE' });
  },

  // Budgets
  getBudgets: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.set('month', String(month));
    if (year) params.set('year', String(year));
    return apiFetch(`/api/budgets/list?${params}`);
  },
  addBudget: (data: Record<string, unknown>) =>
    apiFetch('/api/budgets/add', { method: 'POST', body: JSON.stringify(data) }),
  updateBudget: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBudget: (id: number) =>
    apiFetch(`/api/budgets/${id}`, { method: 'DELETE' }),
  copyBudget: (fromMonth: number, fromYear: number, toMonth: number, toYear: number) =>
    apiFetch('/api/budgets/copy-month', { method: 'POST', body: JSON.stringify({ fromMonth, fromYear, toMonth, toYear }) }),

  // Debts
  getDebts: () => apiFetch('/api/debts/list'),
  addDebt: (data: Record<string, unknown>) =>
    apiFetch('/api/debts/add', { method: 'POST', body: JSON.stringify(data) }),
  updateDebt: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/debts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  makeDebtPayment: (id: number, amount: number) =>
    apiFetch(`/api/debts/${id}/payment`, { method: 'POST', body: JSON.stringify({ amount }) }),
  deleteDebt: (id: number) =>
    apiFetch(`/api/debts/${id}`, { method: 'DELETE' }),
  bulkDeleteDebts: (ids: number[]) =>
    apiFetch('/api/debts/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
  deleteAllDebts: () =>
    apiFetch('/api/debts/bulk-delete', { method: 'POST', body: JSON.stringify({ deleteAll: true }) }),
  getDebtProjections: () => apiFetch('/api/debts/projections'),

  // Bills
  getBills: () => apiFetch('/api/bills/list'),
  addBill: (data: Record<string, unknown>) =>
    apiFetch('/api/bills/add', { method: 'POST', body: JSON.stringify(data) }),
  markBillPaid: (id: number) =>
    apiFetch(`/api/bills/${id}/mark-paid`, { method: 'POST' }),
  updateBill: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/bills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBill: (id: number) =>
    apiFetch(`/api/bills/${id}`, { method: 'DELETE' }),

  // Recurring transactions
  getRecurringTransactions: () => apiFetch('/api/transactions/recurring'),
  toggleRecurring: (id: number) =>
    apiFetch(`/api/transactions/${id}/toggle-recurring`, { method: 'PUT' }),
  processRecurring: () =>
    apiFetch('/api/transactions/process-recurring', { method: 'POST' }),

  // Hawl
  getHawl: () => apiFetch('/api/hawl/list'),
  addHawl: (data: Record<string, unknown>) =>
    apiFetch('/api/hawl/add', { method: 'POST', body: JSON.stringify(data) }),
  markHawlPaid: (id: number) =>
    apiFetch(`/api/hawl/${id}/mark-paid`, { method: 'POST' }),
  deleteHawl: (id: number) =>
    apiFetch(`/api/hawl/${id}`, { method: 'DELETE' }),
  resetHawl: (id: number) =>
    apiFetch(`/api/hawl/${id}/reset`, { method: 'POST' }),
  lockHawlZakat: (id: number) =>
    apiFetch(`/api/hawl/${id}/lock-zakat`, { method: 'POST' }),
  unlockHawlZakat: (id: number) =>
    apiFetch(`/api/hawl/${id}/unlock-zakat`, { method: 'POST' }),
  importAssetsToHawl: () =>
    apiFetch('/api/hawl/import-assets', { method: 'POST' }),
  updateHawlStartDate: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/hawl/${id}/start-date`, { method: 'PUT', body: JSON.stringify(data) }),

  // Sadaqah
  getSadaqah: () => apiFetch('/api/sadaqah/list'),
  getSadaqahStats: () => apiFetch('/api/sadaqah/stats'),
  addSadaqah: (data: Record<string, unknown>) =>
    apiFetch('/api/sadaqah/add', { method: 'POST', body: JSON.stringify(data) }),
  deleteSadaqah: (id: number) =>
    apiFetch(`/api/sadaqah/${id}`, { method: 'DELETE' }),

  // Wasiyyah
  getWasiyyah: () => apiFetch('/api/wasiyyah/list'),
  addWasiyyah: (data: Record<string, unknown>) =>
    apiFetch('/api/wasiyyah/add', { method: 'POST', body: JSON.stringify(data) }),
  deleteWasiyyah: (id: number) =>
    apiFetch(`/api/wasiyyah/${id}`, { method: 'DELETE' }),

  // Wasiyyah Obligations (Islamic duties to settle from estate)
  getWasiyyahObligations: () => apiFetch('/api/wasiyyah/obligations/list'),
  addWasiyyahObligation: (data: Record<string, unknown>) =>
    apiFetch('/api/wasiyyah/obligations/add', { method: 'POST', body: JSON.stringify(data) }),
  updateWasiyyahObligation: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/wasiyyah/obligations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWasiyyahObligation: (id: number) =>
    apiFetch(`/api/wasiyyah/obligations/${id}`, { method: 'DELETE' }),

  // Waqf
  getWaqf: () => apiFetch('/api/waqf/list'),
  addWaqf: (data: Record<string, unknown>) =>
    apiFetch('/api/waqf/add', { method: 'POST', body: JSON.stringify(data) }),
  updateWaqf: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/waqf/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWaqf: (id: number) =>
    apiFetch(`/api/waqf/${id}`, { method: 'DELETE' }),
  getWaqfDistribution: () => apiFetch('/api/waqf/distribution'),
  addWaqfBeneficiary: (data: Record<string, unknown>) =>
    apiFetch('/api/waqf/distribution/beneficiary', { method: 'POST', body: JSON.stringify(data) }),
  updateWaqfBeneficiary: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/waqf/distribution/beneficiary/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWaqfBeneficiary: (id: number) =>
    apiFetch(`/api/waqf/distribution/beneficiary/${id}`, { method: 'DELETE' }),

  // Subscription Detection
  detectSubscriptions: () => apiFetch('/api/subscriptions/detect'),

  // Riba
  scanRiba: () => apiFetch('/api/riba/scan'),

  // Auto-Categorize
  reviewCategories: () => apiFetch('/api/categorize/review'),
  applyCategories: (minConfidence = 60) =>
    apiFetch(`/api/categorize/apply?minConfidence=${minConfidence}`, { method: 'POST' }),

  // Zakat
  getZakat: () => apiFetch('/api/assets/total'),
  getZakatPayments: (lunarYear?: number) =>
    apiFetch(`/api/zakat/payments${lunarYear ? `?lunarYear=${lunarYear}` : ''}`),
  addZakatPayment: (data: Record<string, unknown>) =>
    apiFetch('/api/zakat/payments', { method: 'POST', body: JSON.stringify(data) }),
  deleteZakatPayment: (id: number) =>
    apiFetch(`/api/zakat/payments/${id}`, { method: 'DELETE' }),
  getNisabInfo: () => apiFetch("/api/zakat/info"),
  calculateZakat: (data: Record<string, unknown>) =>
    apiFetch('/api/zakat/calculate', { method: 'POST', body: JSON.stringify(data) }),
  calculateRetirementZakat: (data: { balance: number; accountType?: string; employerMatchPercent?: number; state?: string }) =>
    apiFetch('/api/zakat/calculate-retirement', { method: 'POST', body: JSON.stringify(data) }),
  // FEATURE 1: Multi-Madhab Nisab Selector
  getNisabMethodologies: () => apiFetch('/api/zakat/nisab-methodologies'),
  getNisabMethodology: () => apiFetch('/api/zakat/nisab-methodology'),
  setNisabMethodology: (methodology: string) =>
    apiFetch('/api/zakat/nisab-methodology', { method: 'POST', body: JSON.stringify({ methodology }) }),
  // FEATURE 2: Zakat al-Fitr Calculator
  getZakatAlFitr: (householdSize: number = 1, currency: string = 'USD') =>
    apiFetch(`/api/zakat/fitr?householdSize=${householdSize}&currency=${currency}`),
  // FEATURE 3: PDF Export
  exportZakatReport: () => apiFetch('/api/zakat/export-report'),
  // FEATURE 4: Supported Currencies
  getSupportedCurrencies: () => apiFetch('/api/zakat/supported-currencies'),
  // FEATURE 5: Scholarly References
  getScholarlyReferences: () => apiFetch('/api/zakat/scholarly-references'),

  // Savings Goals
  getSavingsGoals: () => apiFetch('/api/savings-goals/list'),
  addSavingsGoal: (data: Record<string, unknown>) =>
    apiFetch('/api/savings-goals/add', { method: 'POST', body: JSON.stringify(data) }),
  contributeSavingsGoal: (id: number, amount: number) =>
    apiFetch(`/api/savings-goals/${id}/contribute`, { method: 'POST', body: JSON.stringify({ amount }) }),
  deleteSavingsGoal: (id: number) =>
    apiFetch(`/api/savings-goals/${id}`, { method: 'DELETE' }),

  // Halal Screening
  checkHalal: (symbol: string) => {
    // Validate symbol: alphanumeric, max 10 chars
    if (!symbol || !/^[A-Z0-9]{1,10}$/i.test(symbol.trim())) {
      throw new Error('Invalid stock symbol. Use alphanumeric characters only, max 10 characters.');
    }
    return apiFetch(`/api/halal/check/${encodeURIComponent(symbol.trim())}`);
  },
  getHalalStocks: (params?: { search?: string; sector?: string; compliance?: string; page?: number; size?: number }) => {
    const p = new URLSearchParams();
    if (params?.search) p.set('search', params.search);
    if (params?.sector) p.set('sector', params.sector);
    if (params?.compliance) p.set('compliance', params.compliance);
    if (params?.page !== undefined) p.set('page', String(params.page));
    if (params?.size !== undefined) p.set('size', String(params.size));
    const qs = p.toString();
    return apiFetch(`/api/halal/list${qs ? `?${qs}` : ''}`);
  },
  getHalalSectors: () => apiFetch('/api/halal/sectors'),
  getHalalStats: () => apiFetch('/api/halal/stats'),

  // Analytics
  getTransactionSummary: (period: string = 'month') =>
    apiFetch(`/api/transactions/summary?period=${period}`),

  getMonthlySummary: (months: number = 13) =>
    apiFetch(`/api/transactions/monthly-summary?months=${months}`),

  // Multi-currency
  getCurrencyRates: () => apiFetch('/api/currency/rates'),
  convertCurrency: (from: string, to: string, amount: number) => {
    // Validate currency codes: 3-letter uppercase codes
    if (!from || !/^[A-Z]{3}$/.test(from.trim().toUpperCase())) {
      throw new Error('Invalid source currency code. Use 3-letter uppercase codes (e.g., USD).');
    }
    if (!to || !/^[A-Z]{3}$/.test(to.trim().toUpperCase())) {
      throw new Error('Invalid target currency code. Use 3-letter uppercase codes (e.g., EUR).');
    }
    // Validate amount: must be positive and finite
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number.');
    }
    const params = new URLSearchParams({
      from: from.trim().toUpperCase(),
      to: to.trim().toUpperCase(),
      amount: String(amount),
    });
    return apiFetch(`/api/currency/convert?${params.toString()}`);
  },

  // Push notifications — register FCM device token
  registerFcmToken: (token: string) =>
    apiFetch('/api/notifications/fcm-token', { method: 'POST', body: JSON.stringify({ token }) }),

  // Live Prices
  getCryptoPrice: (symbol: string) => apiFetch(`/api/prices/crypto/${symbol}`),
  getStockPrice: (symbol: string) => apiFetch(`/api/prices/stock/${symbol}`),
  getSupportedCryptos: () => apiFetch('/api/prices/crypto'),

  // Investments
  getInvestmentAccounts: () => apiFetch('/api/investments/accounts/list'),
  addInvestmentAccount: (data: Record<string, unknown>) =>
    apiFetch('/api/investments/accounts/add', { method: 'POST', body: JSON.stringify(data) }),
  updateInvestmentAccount: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/investments/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInvestmentAccount: (id: number) =>
    apiFetch(`/api/investments/accounts/${id}`, { method: 'DELETE' }),
  getHoldings: (accountId: number) =>
    apiFetch(`/api/investments/accounts/${accountId}/holdings`),
  addHolding: (accountId: number, data: Record<string, unknown>) =>
    apiFetch(`/api/investments/accounts/${accountId}/holdings/add`, { method: 'POST', body: JSON.stringify(data) }),
  updateHolding: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/investments/holdings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHolding: (id: number) =>
    apiFetch(`/api/investments/holdings/${id}`, { method: 'DELETE' }),
  getPortfolioSummary: () => apiFetch('/api/investments/portfolio/summary'),
  getPortfolioHistory: (days: number = 30) =>
    apiFetch(`/api/investments/portfolio/history?days=${days}`),

  // Net Worth
  takeNetWorthSnapshot: () => apiFetch('/api/net-worth/snapshot', { method: 'POST' }),
  getNetWorthHistory: (period: string = '6m') => apiFetch(`/api/net-worth/history?period=${period}`),

  // Shared Finances
  getSharedGroups: () => apiFetch('/api/shared/groups/list'),
  getGroupDetails: (groupId: number) => apiFetch(`/api/shared/groups/${groupId}`),
  createSharedGroup: (data: Record<string, unknown>) =>
    apiFetch('/api/shared/groups/create', { method: 'POST', body: JSON.stringify(data) }),
  joinSharedGroup: (inviteCode: string) =>
    apiFetch('/api/shared/groups/join', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
  updateSharedGroup: (groupId: number, data: Record<string, unknown>) =>
    apiFetch(`/api/shared/groups/${groupId}`, { method: 'PUT', body: JSON.stringify(data) }),
  leaveSharedGroup: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/leave`, { method: 'POST' }),
  deleteSharedGroup: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}`, { method: 'DELETE' }),
  getGroupTransactions: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/transactions`),
  addGroupTransaction: (groupId: number, data: Record<string, unknown>) =>
    apiFetch(`/api/shared/groups/${groupId}/transactions/add`, { method: 'POST', body: JSON.stringify(data) }),
  deleteGroupTransaction: (groupId: number, txId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/transactions/${txId}`, { method: 'DELETE' }),
  getGroupSummary: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/summary`),
  getSharedBudgets: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/budgets`),
  addSharedBudget: (groupId: number, data: Record<string, unknown>) =>
    apiFetch(`/api/shared/groups/${groupId}/budgets`, { method: 'POST', body: JSON.stringify(data) }),
  deleteSharedBudget: (groupId: number, budgetId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/budgets/${budgetId}`, { method: 'DELETE' }),
  getSharedGoals: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/goals`),
  addSharedGoal: (groupId: number, data: Record<string, unknown>) =>
    apiFetch(`/api/shared/groups/${groupId}/goals`, { method: 'POST', body: JSON.stringify(data) }),
  contributeSharedGoal: (groupId: number, goalId: number, amount: number) =>
    apiFetch(`/api/shared/groups/${groupId}/goals/${goalId}/contribute`, { method: 'POST', body: JSON.stringify({ amount }) }),
  deleteSharedGoal: (groupId: number, goalId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/goals/${goalId}`, { method: 'DELETE' }),

  // Family Estate Sharing
  getFamilyEstate: (groupId: number) =>
    apiFetch(`/api/shared/groups/${groupId}/estate`),
  getEstateSharingStatus: () =>
    apiFetch('/api/shared/estate-sharing'),
  setEstateSharing: (enabled: boolean) =>
    apiFetch('/api/shared/estate-sharing', { method: 'PUT', body: JSON.stringify({ enabled }) }),

  // Ramadan
  getRamadanGoals: () => apiFetch('/api/ramadan/goals'),
  saveRamadanGoals: (data: Record<string, unknown>) =>
    apiFetch('/api/ramadan/goals', { method: 'PUT', body: JSON.stringify(data) }),

  // Profile
  getProfile: () => apiFetch('/auth/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    apiFetch('/auth/update-profile', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: () =>
    apiFetch('/auth/delete-account', { method: 'DELETE' }),

  exportData: () => apiFetch('/auth/export-data'),

  // Barakah Score
  getBarakahScore: () => apiFetch('/api/barakah-score'),

  // Notifications
  getNotifications: (page = 0) => apiFetch(`/api/notifications?page=${page}`),
  getUnreadNotifications: () => apiFetch('/api/notifications/unread'),
  markNotificationRead: (id: number) =>
    apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () =>
    apiFetch('/api/notifications/read-all', { method: 'PUT' }),
  deleteNotification: (id: number) =>
    apiFetch(`/api/notifications/${id}`, { method: 'DELETE' }),

  // Admin — all admin calls suppress the global logout so that a 401
  // (e.g. expired token) shows a "session expired" prompt on the admin page
  // instead of silently logging the user out site-wide.
  getAdminUserCount: () => apiFetch('/admin/user-count', {}, API_TIMEOUT, true),
  getAdminUsers: (page = 0, size = 50) =>
    apiFetch(`/admin/active-users?page=${page}&size=${size}`, {}, API_TIMEOUT, true),
  adminResetPassword: (userId: number) =>
    apiFetch(`/admin/users/${userId}/reset-password`, { method: 'POST' }, API_TIMEOUT, true),
  adminResendVerification: (userId: number) =>
    apiFetch(`/admin/users/${userId}/resend-verification`, { method: 'POST' }, API_TIMEOUT, true),
  adminUpdatePlan: (userId: number, plan: string) =>
    apiFetch(`/admin/users/${userId}/plan`, { method: 'PUT', body: JSON.stringify({ plan }) }, API_TIMEOUT, true),
  adminGrantTrial: (userId: number, plan: string, durationDays: number, sendEmail: boolean) =>
    apiFetch(`/admin/users/${userId}/grant-trial`, { method: 'POST', body: JSON.stringify({ plan, durationDays, sendEmail }) }, API_TIMEOUT, true),
  adminDeleteUser: (userId: number) =>
    apiFetch(`/admin/users/${userId}`, { method: 'DELETE' }, API_TIMEOUT, true),
  getAdminAnalytics: () => apiFetch('/admin/analytics', {}, API_TIMEOUT, true),
  getAdminFeatureUsage: () => apiFetch('/admin/feature-usage', {}, API_TIMEOUT, true),
  getAdminOverview: () => apiFetch('/admin/overview', {}, API_TIMEOUT, true),

  // Exports
  downloadTransactionsCsv: () =>
    apiDownload('/api/transactions/export/csv', 'transactions.csv'),
  downloadTransactionsPdf: () =>
    apiDownload('/api/transactions/export/pdf', 'transactions.pdf'),

  // Import (Monarch Money — Balances or Transactions CSV)
  monarchPreview: (file: File) =>
    apiUpload('/api/import/monarch/preview', file),
  monarchExecute: (payload: Record<string, unknown>) =>
    apiFetch('/api/import/monarch/execute', { method: 'POST', body: JSON.stringify(payload) }, IMPORT_TIMEOUT),

  /**
   * Chunked execute — splits large transaction imports into batches to avoid
   * gateway/proxy timeouts. Results are aggregated across all chunks.
   */
  monarchExecuteChunked: async (payload: Record<string, unknown>, chunkSize = 100) => {
    const format = payload.format as string;

    // Balances imports are small; send in one shot
    if (format !== 'transactions') {
      return apiFetch('/api/import/monarch/execute', {
        method: 'POST', body: JSON.stringify(payload),
      }, IMPORT_TIMEOUT);
    }

    // Split transactions into chunks
    const allTxns = (payload.transactions as unknown[]) || [];
    if (allTxns.length <= chunkSize) {
      return apiFetch('/api/import/monarch/execute', {
        method: 'POST', body: JSON.stringify(payload),
      }, IMPORT_TIMEOUT);
    }

    let totalCreated = 0;
    let totalSkipped = 0;
    const allErrors: string[] = [];

    for (let i = 0; i < allTxns.length; i += chunkSize) {
      const chunk = allTxns.slice(i, i + chunkSize);
      const chunkPayload = { format: 'transactions', transactions: chunk };
      const data = await apiFetch('/api/import/monarch/execute', {
        method: 'POST', body: JSON.stringify(chunkPayload),
      }, IMPORT_TIMEOUT);
      if (data.error) allErrors.push(data.error);
      totalCreated += data.transactionsCreated || 0;
      totalSkipped += data.skipped || 0;
      if (data.errors) allErrors.push(...data.errors);
    }

    return {
      format: 'transactions',
      success: allErrors.length === 0,
      transactionsCreated: totalCreated,
      skipped: totalSkipped,
      ...(allErrors.length > 0 ? { errors: allErrors } : {}),
    };
  },

  // ── Stripe Billing ──────────────────────────────────────────────────────────
  /** Create a Stripe Checkout session (new subscriber). Returns { url }. */
  createCheckout: (plan: 'plus' | 'family', billing: 'monthly' | 'yearly' = 'monthly') =>
    apiFetch('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan, billing }),
    }),

  /**
   * Upgrade/downgrade an existing subscription in-place (no redirect needed).
   * Falls back to createCheckout for free users with no subscription.
   * Returns { success, plan, status } OR { url } if redirect is needed.
   */
  upgradeSubscription: (plan: 'plus' | 'family', billing: 'monthly' | 'yearly' = 'monthly') =>
    apiFetch('/api/stripe/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan, billing }),
    }),

  /** Open Stripe Customer Portal (manage/cancel/update card). Returns { url }. */
  openPortal: () =>
    apiFetch('/api/stripe/portal', { method: 'POST' }),

  /** Current subscription status for the logged-in user. */
  subscriptionStatus: () =>
    apiFetch('/api/stripe/status'),

  // ── Contact / Feedback ──────────────────────────────────────────────────────
  /**
   * Send a feedback or contact message from a logged-in user.
   * name/email are auto-filled by the backend from the JWT.
   */
  contact: (subject: string, message: string) =>
    apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    }),

  // ── Referral ────────────────────────────────────────────────────────────────
  getReferralCode: () => apiFetch('/api/referral/code'),
  trackReferralClick: (code: string) => apiFetch(`/api/referrals/click/${encodeURIComponent(code)}`, { method: 'POST' }),

  // ── Assets bulk delete ───────────────────────────────────────────────────────
  bulkDeleteAssets: (ids: number[]) =>
    apiFetch('/api/assets/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),

  // ── Islamic Calendar ─────────────────────────────────────────────────────────
  getIslamicCalendarToday: () => apiFetch('/api/islamic-calendar/today'),
  getIslamicCalendarEvents: (year?: number) =>
    apiFetch(`/api/islamic-calendar/events${year ? `?year=${year}` : ''}`),

  // ── Halal Spending Analysis ─────────────────────────────────────────────────
  getHalalAnalysis: (period = 'month') =>
    apiFetch(`/api/transactions/halal-analysis?period=${encodeURIComponent(period)}`),

  // ── Multi-Currency Zakat Summary ────────────────────────────────────────────
  getZakatSummary: (currency = 'USD') =>
    apiFetch(`/api/hawl/zakat-summary?currency=${encodeURIComponent(currency)}`),

  // ── Hawl Due Reminders ──────────────────────────────────────────────────────
  getHawlDue: (days = 30) => apiFetch(`/api/hawl/due?days=${days}`),

  // ── Wasiyyah PDF Export ─────────────────────────────────────────────────────
  downloadWasiyyahPdf: async () => {
    const resp = await fetch(`${API_URL}/api/wasiyyah/export/pdf`, {
      credentials: 'include',
    });
    if (!resp.ok) throw new Error('Failed to download PDF');
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wasiyyah_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // ── Sadaqah / Donation to Barakah ────────────────────────────────────────────
  /**
   * Create a one-time Stripe Checkout session for a Sadaqah donation.
   * Barakah collects and distributes the funds to verified causes.
   * Returns { url } — redirect the user to this URL.
   */
  donateToBarakah: (amountCents: number, description: string) =>
    apiFetch('/api/stripe/donate', {
      method: 'POST',
      body: JSON.stringify({ amountCents, description }),
    }),

  // ─── Fiqh Configuration ──────────────────────────────────────
  getFiqhConfig: () =>
    apiFetch('/api/fiqh/config'),

  setMadhab: (madhab: string) =>
    apiFetch('/api/fiqh/madhab', { method: 'POST', body: JSON.stringify({ madhab }) }),

  updateFiqhRules: (rules: Record<string, unknown>) =>
    apiFetch('/api/fiqh/rules', { method: 'PUT', body: JSON.stringify(rules) }),

  getFiqhSchools: () =>
    apiFetch('/api/fiqh/schools'),

  // ─── Financial Ledger ────────────────────────────────────────
  getFinancialLedger: (page = 0, size = 50) =>
    apiFetch(`/api/ledger?page=${page}&size=${size}`),

  getLedgerByType: (type: string) =>
    apiFetch(`/api/ledger/type/${encodeURIComponent(type)}`),

  // ─── Zakat Snapshots ─────────────────────────────────────────
  getZakatSnapshots: () =>
    apiFetch('/api/zakat/snapshots'),

  getLockedSnapshots: () =>
    apiFetch('/api/zakat/snapshots/locked'),
};
