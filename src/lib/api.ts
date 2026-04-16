// The web app uses same-origin requests only.
// `/auth/*` goes through the Route Handler in `src/app/auth/[...path]/route.ts`
// so Set-Cookie survives, while `/api/*` and `/admin/*` are forwarded by
// Next rewrites. This keeps auth httpOnly-cookie based and avoids leaking
// bearer/refresh tokens into browser storage.
const API_URL = '';

// ── Timeout Constants ──────────────────────────────────────────────────────
const API_TIMEOUT = 30_000;      // 30s for standard API calls
const UPLOAD_TIMEOUT = 60_000;   // 60s for file uploads
const DOWNLOAD_TIMEOUT = 30_000; // 30s for file downloads
const IMPORT_TIMEOUT = 300_000;  // 5min for large imports (chunked)
const REFRESH_FALLBACK_KEY = 'barakah_refresh_fallback';

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

/**
 * Refresh token sessionStorage fallback — INTENTIONAL, do not remove.
 *
 * Why this exists despite the obvious "store tokens only in httpOnly
 * cookies" rule:
 *
 *   The backend (api.trybarakah.com) sits behind Railway + a CDN/proxy
 *   chain that is NOT reliable about forwarding Set-Cookie headers in
 *   every code path. The web client has had two regressions where users
 *   were logged out within seconds of signing in because:
 *     1. /auth/login set the auth_token + refresh_token cookies, but the
 *        Set-Cookie headers got stripped before reaching the browser.
 *     2. The next API call had no auth_token cookie → 401 → silent
 *        refresh attempted → no refresh_token cookie → 'expired' → logout.
 *
 *   The backend deliberately also returns the refresh token in the
 *   /auth/login and /auth/refresh response bodies as a fallback (see the
 *   AuthController comments). The web client must capture it and send it
 *   back in the body of /auth/refresh requests when the cookie is missing.
 *
 *   sessionStorage scope:
 *     - Per-tab, per-origin (not shared across tabs or other origins)
 *     - Cleared when the tab closes
 *     - JS-accessible (XSS-readable)
 *
 *   The XSS exposure is the trade-off we accept. Mitigations:
 *     - Strict CSP in next.config.ts blocks most script injection
 *     - The token is refresh-only (medium-impact if leaked, NOT the
 *       access token which would be high-impact)
 *     - On logout / 401-cascade, we proactively clear it
 *     - Schemas validation + extractErrorMessage prevent server text
 *       from being rendered as HTML
 *
 *   Removing this fallback was tried in commit 8334bad and silently
 *   reintroduced the "frequent logout" UX bug. Don't do it again
 *   without first proving the cookie path is reliable end-to-end in
 *   production (Railway internal routing, CDN, Next.js rewrites).
 */
export function setRefreshToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token && token.trim()) {
      window.sessionStorage.setItem(REFRESH_FALLBACK_KEY, token);
    } else {
      window.sessionStorage.removeItem(REFRESH_FALLBACK_KEY);
    }
  } catch {
    // sessionStorage unavailable (private browsing, quota) — cookies
    // remain the primary path; we just won't have a fallback for this tab.
  }
}

function getRefreshTokenFallback(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = window.sessionStorage.getItem(REFRESH_FALLBACK_KEY);
    return token && token.trim() ? token : null;
  } catch {
    return null;
  }
}

// ── Silent refresh ─────────────────────────────────────────────────────────────
// When a request gets a 401 (expired access token), we attempt one silent
// refresh via POST /auth/refresh. Both the access token and refresh token live
// in httpOnly cookies set by the backend through the same-origin auth route
// handler, so the browser automatically sends them on refresh.

// ── Global refresh deduplication ───────────────────────────────────────────
// ALL callers (proactive refresh in AuthContext, layout navigation refresh,
// background interval, and 401 retry) go through this single gate. Only one
// POST /auth/refresh is ever in-flight at a time. Concurrent callers wait
// for the same promise. This prevents the "rotation death spiral" where two
// simultaneous refresh requests each try to rotate the same token — the
// first succeeds but the second uses the now-revoked token and fails.
//
// 'rate_limited' is distinct from 'expired' — the session is NOT invalidated,
// the auth backend is just throttling our refresh attempts. Treat it like
// 'network_error' (don't logout); the next API call will trigger a fresh
// refresh once the rate-limit window passes.
type RefreshResult = 'ok' | 'expired' | 'rate_limited' | 'network_error';
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

async function verifySessionStillValid(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  const text = await res.text();
  if (!text) return fallback;
  try {
    const json = JSON.parse(text);
    return json.error || json.message || fallback;
  } catch {
    // Never show raw server text to users — could contain stack traces or internal paths
    return fallback;
  }
}

/**
 * Calls POST /auth/refresh directly (bypasses apiFetch to avoid recursion).
 * Returns: 'ok' if refresh succeeded, 'expired' if server rejected (401/403),
 * 'rate_limited' if the server returned 429 (auth backend throttled),
 * 'network_error' if the request failed due to connectivity.
 * This distinction is critical: 'expired' should trigger logout,
 * 'rate_limited' and 'network_error' should NOT (the session may still be valid).
 */
async function attemptSilentRefresh(): Promise<RefreshResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout
  try {
    const csrfToken = getCsrfToken();
    const refreshTokenFallback = getRefreshTokenFallback();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(refreshTokenFallback ? { refreshToken: refreshTokenFallback } : {}),
      signal: controller.signal,
    });
    if (res.ok) {
      try {
        const text = await res.text();
        if (text) {
          const json = JSON.parse(text);
          const rotated = typeof json.refreshToken === 'string'
            ? json.refreshToken
            : (typeof json.refresh_token === 'string' ? json.refresh_token : null);
          if (rotated) setRefreshToken(rotated);
        }
      } catch {
        // Ignore parsing/storage issues — cookies may still have refreshed
      }
      return 'ok';
    }
    // Server explicitly rejected our refresh token — session is truly expired
    if (res.status === 401 || res.status === 403) return 'expired';
    // Auth backend is rate-limiting us — session may still be valid, do NOT logout
    if (res.status === 429) return 'rate_limited';
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

  // credentials: 'include' ensures the auth_token and refresh_token httpOnly
  // cookies are sent on every request.
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
      const originalUnauthorizedResponse = res.clone();
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
          if (retryRes.status !== 401) {
            throw new Error(await extractErrorMessage(retryRes, `API error ${retryRes.status}`));
          }
          const sessionStillValid = await verifySessionStillValid();
          if (sessionStillValid) {
            throw new Error(await extractErrorMessage(retryRes, 'We could not complete that request. Please try again.'));
          }
          // Retry also failed with 401 and the session is genuinely gone — fall through to the unauthorized handler
        } catch (retryErr) {
          clearTimeout(retryTimeout);
          throw retryErr;
        }
      }

      if (refreshResult === 'network_error') {
        // Network issue — session may still be valid, do NOT logout.
        // Throw a connection error so the UI can show a retry prompt.
        throw new Error('Network error — please check your connection and try again.');
      }

      if (refreshResult === 'rate_limited') {
        // Auth backend throttled the refresh — do NOT logout. Surface a clear
        // message so the user understands this isn't a session problem and
        // a retry in a moment will work.
        throw new Error('Too many requests right now. Please wait a moment and try again.');
      }

      const sessionStillValid = await verifySessionStillValid();
      if (sessionStillValid) {
        throw new Error(await extractErrorMessage(originalUnauthorizedResponse, 'We could not complete that request. Please try again.'));
      }

      // Refresh returned 'expired' or retry after 'ok' also failed — session is gone.
      // Only fire the global logout if the caller hasn't opted out.
      if (!suppressUnauthorized && onUnauthorizedCallback) onUnauthorizedCallback();
      setRefreshToken(null);
      throw new Error('Your session has expired. Please log in again.');
    }

    // 429 from a non-auth endpoint should never be misclassified as a session
    // problem — surface a clear rate-limit message instead of the generic
    // "API error 429" string.
    if (res.status === 429) {
      throw new Error('Too many requests right now. Please wait a moment and try again.');
    }
    // ── End silent refresh ─────────────────────────────────────────────────

    throw new Error(await extractErrorMessage(res, `API error ${res.status}`));
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

  // BUG FIX: include CSRF token so upload endpoints are protected consistently
  const csrfToken = getCsrfToken();
  const uploadHeaders: Record<string, string> = {};
  if (csrfToken) uploadHeaders['X-XSRF-TOKEN'] = csrfToken;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: uploadHeaders,
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
        const r2 = await fetch(`${API_URL}${endpoint}`, { method: 'POST', body: formData, credentials: 'include', headers: uploadHeaders });
        if (r2.ok) { const t = await r2.text(); if (!t) return null; try { return JSON.parse(t); } catch { throw new Error('Unexpected server response.'); } }
        if (r2.status !== 401) throw new Error(await extractErrorMessage(r2, `Upload error ${r2.status}`));
        if (await verifySessionStillValid()) throw new Error(await extractErrorMessage(r2, 'Upload failed. Please try again.'));
      }
      if (refreshResult === 'network_error') throw new Error('Network error — please check your connection and try again.');
      if (refreshResult === 'rate_limited') throw new Error('Too many requests right now. Please wait a moment and try again.');
      if (await verifySessionStillValid()) throw new Error('Upload failed. Please try again.');
      if (onUnauthorizedCallback) onUnauthorizedCallback();
      setRefreshToken(null);
      throw new Error('Your session has expired. Please log in again.');
    }
    throw new Error(await extractErrorMessage(res, `Upload error ${res.status}`));
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
        if (r2.status !== 401) throw new Error(`Download failed (${r2.status})`);
        if (await verifySessionStillValid()) throw new Error('Download failed. Please try again.');
      }
      if (refreshResult === 'network_error') throw new Error('Network error — please check your connection and try again.');
      if (await verifySessionStillValid()) throw new Error('Download failed. Please try again.');
      if (onUnauthorizedCallback) onUnauthorizedCallback();
      setRefreshToken(null);
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

// ── subscriptionStatus in-flight deduplication ─────────────────────────────
// TrialBanner, AnnualUpgradeModal, AnnualUpgradeBanner, and billing/page all
// call subscriptionStatus() on mount. Without deduplication they fire several
// identical concurrent requests. Sharing one in-flight Promise is enough —
// the reference is cleared as soon as the request settles so the next
// independent call (e.g. after a plan change) always hits the network fresh.
let _subStatusInFlight: Promise<unknown> | null = null;

export const api = {
  // Auth
  login: (email: string, password: string, rememberMe = false) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, rememberMe }) }),
  signup: (name: string, email: string, password: string, state: string, country: string, referralCode?: string, phoneNumber?: string) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ fullName: name, email, password, state, country, referralCode, phoneNumber }) }),
  // Clears the auth_token httpOnly cookie on the server side.
  logout: () =>
    apiFetch('/auth/logout', { method: 'POST' }),
  // Silently renews the access token using the refresh_token cookie.
  // Returns 'ok' | 'expired' | 'network_error' to let callers distinguish
  // genuine session expiry from transient connectivity issues.
  // Uses deduplicatedRefresh() so concurrent callers share one request.
  refresh: () => deduplicatedRefresh(),
  // CWE-598 fix: send the token in the POST body, not as a GET URL parameter.
  // GET query params are captured in server access logs, CDN logs, proxy logs,
  // and browser history — all of which are poor places for a sensitive secret.
  verifyEmail: (token: string) =>
    apiFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
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
  getTransactions: (type?: string, page?: number, size?: number, search?: string) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (page !== undefined) params.set('page', String(page));
    if (size !== undefined) params.set('size', String(size));
    if (search) params.set('search', search);
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
  /** Get transactions needing review (uncategorized/imported). */
  getReviewQueue: (page = 0, size = 50) =>
    apiFetch(`/api/transactions/review-queue?page=${page}&size=${size}`),
  /** Bulk-categorize multiple transactions. */
  bulkCategorize: (ids: number[], category: string) =>
    apiFetch('/api/transactions/bulk-categorize', { method: 'POST', body: JSON.stringify({ ids, category, reviewStatus: 'reviewed' }) }),
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
  /** Safe-to-spend: how much free money is left this month after bills + budgets. */
  getSafeToSpend: () => apiFetch('/api/budgets/safe-to-spend'),
  /** Cash-flow forecast for next N months. */
  getCashFlowForecast: (months = 3) => apiFetch(`/api/budgets/forecast?months=${months}`),

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
  resetHawl: (id: number, reason?: string, note?: string) =>
    apiFetch(`/api/hawl/${id}/reset`, {
      method: 'POST',
      body: JSON.stringify({ reason, note }),
    }),
  lockHawlZakat: (id: number) =>
    apiFetch(`/api/hawl/${id}/lock-zakat`, { method: 'POST' }),
  unlockHawlZakat: (id: number) =>
    apiFetch(`/api/hawl/${id}/unlock-zakat`, { method: 'POST' }),
  importAssetsToHawl: () =>
    apiFetch('/api/hawl/import-assets', { method: 'POST' }),
  updateHawlStartDate: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/hawl/${id}/start-date`, { method: 'PUT', body: JSON.stringify(data) }),
  setHawlManualWealth: (amount: number, note?: string) =>
    apiFetch('/api/hawl/manual-wealth', {
      method: 'POST',
      body: JSON.stringify({ amount, note }),
    }),
  getHawlHistory: () => apiFetch('/api/hawl/history'),

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

  /** Faraid (Islamic Inheritance) Calculator */
  calculateFaraid: (data: Record<string, unknown>) =>
    apiFetch('/api/wasiyyah/calculate-faraid', { method: 'POST', body: JSON.stringify(data) }),

  /** Islamic inheritance shares by relationship (Surah An-Nisa 4:11-12) */
  getIslamicShares: () => apiFetch('/api/wasiyyah/islamic-shares'),

  /** Zakat calculation receipt — full transparency of every input and decision. */
  getZakatReceipt: () => apiFetch('/api/zakat/receipt'),

  /** Ibadah Finance Dashboard — aggregated Islamic obligations summary */
  getIbadahSummary: () =>
    apiFetch('/api/ibadah/summary'),

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
  getRibaPurificationStatus: () => apiFetch('/api/zakat/purification-status'),
  recordRibaPurification: (amount: number, notes?: string) =>
    apiFetch('/api/zakat/record-purification', { method: 'POST', body: JSON.stringify({ amount, notes }) }),

  // Riba Elimination Journey
  getRibaJourneySummary: () => apiFetch('/api/riba/journey/summary'),
  getRibaJourneyGoals: () => apiFetch('/api/riba/journey/goals'),
  createRibaGoal: (data: Record<string, unknown>) =>
    apiFetch('/api/riba/journey/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateRibaGoal: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/riba/journey/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminateRibaGoal: (id: number) =>
    apiFetch(`/api/riba/journey/goals/${id}/eliminate`, { method: 'POST' }),
  getRibaMilestones: () => apiFetch('/api/riba/journey/milestones'),
  getRibaGoalSuggestions: () => apiFetch('/api/riba/journey/suggestions'),

  // Auto-Categorize
  reviewCategories: () => apiFetch('/api/categorize/review'),
  applyCategories: (minConfidence = 60) =>
    apiFetch(`/api/categorize/apply?minConfidence=${minConfidence}`, { method: 'POST' }),
  getTransactionRules: () => apiFetch('/api/categorize/rules'),
  createTransactionRule: (data: Record<string, unknown>) =>
    apiFetch('/api/categorize/rules', { method: 'POST', body: JSON.stringify(data) }),
  updateTransactionRule: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/api/categorize/rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransactionRule: (id: number) =>
    apiFetch(`/api/categorize/rules/${id}`, { method: 'DELETE' }),

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
    apiFetch('/api/notifications/fcm-token', { method: 'POST', body: JSON.stringify({ token }) }, API_TIMEOUT, true),

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
  getProfile: (suppressUnauthorized = false) => apiFetch('/auth/profile', {}, API_TIMEOUT, suppressUnauthorized),
  updateProfile: (data: Record<string, unknown>) =>
    apiFetch('/auth/update-profile', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: () =>
    apiFetch('/auth/delete-account', { method: 'DELETE' }),

  exportData: () => apiFetch('/auth/export-data'),

  // Barakah Score
  getBarakahScore: () => apiFetch('/api/barakah-score'),

  // Notifications
  getNotifications: (page = 0, suppressUnauthorized = false) =>
    apiFetch(`/api/notifications?page=${page}`, {}, API_TIMEOUT, suppressUnauthorized),
  getUnreadNotifications: (suppressUnauthorized = false) =>
    apiFetch('/api/notifications/unread', {}, API_TIMEOUT, suppressUnauthorized),
  markNotificationRead: (id: number) =>
    apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' }, API_TIMEOUT, true),
  markAllNotificationsRead: () =>
    apiFetch('/api/notifications/read-all', { method: 'PUT' }, API_TIMEOUT, true),
  deleteNotification: (id: number) =>
    apiFetch(`/api/notifications/${id}`, { method: 'DELETE' }, API_TIMEOUT, true),

  // Preferences & lifecycle
  getPreferences: () => apiFetch('/api/preferences'),
  updatePreferences: (data: Record<string, unknown>) =>
    apiFetch('/api/preferences', { method: 'PUT', body: JSON.stringify(data) }),
  lifecycleHeartbeat: (data: { platform?: string; appVersion?: string; timeZone?: string; route?: string }) =>
    apiFetch('/api/lifecycle/heartbeat', { method: 'POST', body: JSON.stringify(data) }, API_TIMEOUT, true),
  lifecycleTrackEvent: (eventType: string, metadata?: Record<string, unknown>, source = 'web') =>
    apiFetch('/api/lifecycle/events', {
      method: 'POST',
      body: JSON.stringify({ eventType, metadata: metadata ?? {}, source }),
    }),
  getLifecycleSummary: () => apiFetch('/api/lifecycle/summary'),
  lifecycleCancelIntent: (context = 'billing') =>
    apiFetch('/api/lifecycle/cancel-intent', { method: 'POST', body: JSON.stringify({ context }) }),
  acceptSaveOffer: () =>
    apiFetch('/api/lifecycle/save-offer/accept', { method: 'POST' }),

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
  adminVerifyEmail: (userId: number) =>
    apiFetch(`/admin/users/${userId}/verify-email`, { method: 'POST' }, API_TIMEOUT, true),
  adminGetUserActivity: (userId: number) =>
    apiFetch(`/admin/users/${userId}/activity`, {}, API_TIMEOUT, true),
  adminGetUserHawlReport: (userId: number) =>
    apiFetch(`/admin/users/${userId}/hawl-report`, {}, API_TIMEOUT, true),
  adminGetDeletedUsers: (page = 0, size = 50) =>
    apiFetch(`/admin/deleted-users?page=${page}&size=${size}`, {}, API_TIMEOUT, true),
  adminGetChurnAnalysis: () =>
    apiFetch('/admin/churn-analysis', {}, API_TIMEOUT, true),
  adminGetEmailLog: (status: string = 'all', page: number = 0, size: number = 100) =>
    apiFetch(`/admin/email-log?status=${status}&page=${page}&size=${size}`, {}, API_TIMEOUT, true),
  getAdminAnalytics: () => apiFetch('/admin/analytics', {}, API_TIMEOUT, true),
  getAdminFunnel: (days = 30) =>
    apiFetch(`/admin/funnel?days=${days}`, {}, API_TIMEOUT, true),
  getAdminGrowth: () =>
    apiFetch('/admin/growth', {}, API_TIMEOUT, true),
  getAdminFeatureUsage: () => apiFetch('/admin/feature-usage', {}, API_TIMEOUT, true),
  getAdminOverview: () => apiFetch('/admin/overview', {}, API_TIMEOUT, true),
  getAdminOnboardingTrialSettings: () =>
    apiFetch('/admin/settings/onboarding-trial', {}, API_TIMEOUT, true),
  updateAdminOnboardingTrialSettings: (settings: { enabled: boolean; plan: string; durationDays: number }) =>
    apiFetch('/admin/settings/onboarding-trial', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }, API_TIMEOUT, true),
  getAdminLifecycleOverview: () =>
    apiFetch('/admin/lifecycle/overview', {}, API_TIMEOUT, true),
  getAdminLifecycleTemplates: () =>
    apiFetch('/admin/lifecycle/templates', {}, API_TIMEOUT, true),
  getAdminLifecycleCampaigns: () =>
    apiFetch('/admin/lifecycle/campaigns', {}, API_TIMEOUT, true),
  saveAdminLifecycleCampaign: (campaign: Record<string, unknown>) =>
    apiFetch('/admin/lifecycle/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    }, API_TIMEOUT, true),
  getAdminLifecycleDeliveries: (campaignId: number) =>
    apiFetch(`/admin/lifecycle/campaigns/${campaignId}/deliveries`, {}, API_TIMEOUT, true),
  sendAdminLifecycleCampaign: (campaignId: number) =>
    apiFetch(`/admin/lifecycle/campaigns/${campaignId}/send`, { method: 'POST' }, API_TIMEOUT, true),
  testAdminLifecycleCampaign: (campaignId: number, payload: Record<string, unknown>) =>
    apiFetch(`/admin/lifecycle/campaigns/${campaignId}/test`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, API_TIMEOUT, true),
  getAdminRetentionOfferSettings: () =>
    apiFetch('/admin/lifecycle/settings/retention-offer', {}, API_TIMEOUT, true),
  updateAdminRetentionOfferSettings: (settings: Record<string, unknown>) =>
    apiFetch('/admin/lifecycle/settings/retention-offer', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }, API_TIMEOUT, true),
  getAdminContactSubmissions: () =>
    apiFetch('/admin/lifecycle/contact-submissions', {}, API_TIMEOUT, true),
  getAdminNotificationTemplates: () =>
    apiFetch('/admin/notifications/templates', {}, API_TIMEOUT, true),
  broadcastPushNotification: (payload: {
    title: string;
    body: string;
    route?: string;
    /** @deprecated use `filters` — passes only a single plan string, ignored when `filters` is set */
    filter?: string;
    /** Full audience criteria. When provided, replaces the legacy `filter` field. */
    filters?: {
      plans?: string[];
      subscriptionStatuses?: string[];
      hasCompletedSetup?: boolean;
      hasLinkedAccounts?: boolean;
      hasTransactions?: boolean;
      inactiveDaysMin?: number;
      inactiveDaysMax?: number;
      trialEndingWithinDays?: number;
    };
  }) =>
    apiFetch('/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, API_TIMEOUT, true),
  getBroadcastStats: (broadcastId: string) =>
    apiFetch(`/admin/notifications/broadcast/${broadcastId}/stats`, {}, API_TIMEOUT, true),

  // Plaid Bank Linking
  plaidCreateLinkToken: () =>
    apiFetch('/api/plaid/create-link-token', { method: 'POST' }),
  plaidExchangeToken: (publicToken: string, institutionName?: string) =>
    apiFetch('/api/plaid/exchange-token', { method: 'POST', body: JSON.stringify({ publicToken, institutionName }) }),
  plaidSync: (linkedAccountId: number) =>
    apiFetch(`/api/plaid/sync/${linkedAccountId}`, { method: 'POST' }),
  plaidSyncAll: () =>
    apiFetch('/api/plaid/sync-all', { method: 'POST' }),
  plaidGetAccounts: () =>
    apiFetch('/api/plaid/accounts'),
  plaidUnlinkAccount: (linkedAccountId: number) =>
    apiFetch(`/api/plaid/accounts/${linkedAccountId}`, { method: 'DELETE' }),

  // Exports
  downloadTransactionsCsv: (period = 'month') => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return apiDownload(`/api/transactions/export/csv?period=${period}`, `barakah_transactions_${date}.csv`);
  },
  downloadTransactionsPdf: (period = 'month') => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return apiDownload(`/api/transactions/export/pdf?period=${period}`, `barakah_transactions_${date}.pdf`);
  },
  downloadZakatReport: () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return apiDownload('/api/zakat/export-report', `barakah_zakat_${date}.pdf`);
  },

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
      // BUG FIX: guard against null response body (e.g. 204 No Content)
      const data = await apiFetch('/api/import/monarch/execute', {
        method: 'POST', body: JSON.stringify(chunkPayload),
      }, IMPORT_TIMEOUT) ?? {};
      if (data?.error) allErrors.push(data.error);
      totalCreated += data?.transactionsCreated || 0;
      totalSkipped += data?.skipped || 0;
      if (data?.errors) allErrors.push(...data.errors);
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
  createCheckout: (
    plan: 'plus' | 'family',
    billing: 'monthly' | 'yearly' = 'monthly',
    options?: { successPath?: string; cancelPath?: string },
  ) =>
    apiFetch('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({
        plan,
        billing,
        successPath: options?.successPath,
        cancelPath: options?.cancelPath,
      }),
    }),

  /**
   * Upgrade/downgrade an existing subscription in-place (no redirect needed).
   * Falls back to createCheckout for free users with no subscription.
   * Returns { success, plan, status } OR { url } if redirect is needed.
   */
  upgradeSubscription: (
    plan: 'plus' | 'family',
    billing: 'monthly' | 'yearly' = 'monthly',
    options?: { successPath?: string; cancelPath?: string },
  ) =>
    apiFetch('/api/stripe/upgrade', {
      method: 'POST',
      body: JSON.stringify({
        plan,
        billing,
        successPath: options?.successPath,
        cancelPath: options?.cancelPath,
      }),
    }),

  /** Open Stripe Customer Portal (manage/cancel/update card). Returns { url }. */
  openPortal: () =>
    apiFetch('/api/stripe/portal', { method: 'POST' }),

  /** Aggregated dashboard widget data (spending, budget, transactions, bills, net worth). */
  getDashboardWidgets: () =>
    apiFetch('/api/dashboard/widgets'),

  /** Personalized financial insights (spending trends, nisab streak, zakat estimates, etc.). */
  getDashboardInsights: () =>
    apiFetch('/api/dashboard/insights'),

  /** Start churn save flow — returns personalized save offers. */
  startChurnSaveFlow: () =>
    apiFetch('/api/churn/start', { method: 'POST' }),

  /** Pause subscription for N months. */
  pauseSubscription: (months: number, reason?: string) =>
    apiFetch('/api/churn/pause', { method: 'POST', body: JSON.stringify({ months, reason }) }),

  /** Record exit survey on cancel. */
  recordExitSurvey: (reason: string, detail?: string) =>
    apiFetch('/api/churn/exit-survey', { method: 'POST', body: JSON.stringify({ reason, detail, offeredPause: true, offeredDowngrade: true, offeredDiscount: true }) }),

  /** Seed sample demo data for new users (one-time). */
  seedDemoData: () =>
    apiFetch('/api/onboarding/seed-demo', { method: 'POST' }),

  /** Current subscription status for the logged-in user. */
  subscriptionStatus: () => {
    if (!_subStatusInFlight) {
      _subStatusInFlight = apiFetch('/api/stripe/status').finally(() => {
        _subStatusInFlight = null;
      });
    }
    return _subStatusInFlight;
  },

  // ── Contact / Feedback ──────────────────────────────────────────────────────
  /**
   * Send a feedback or contact message from a logged-in user.
   * name/email are auto-filled by the backend for logged-in users and required
   * from the public contact page for guests.
   */
  contact: (data: { name?: string; email?: string; phone?: string; subject: string; message: string }) =>
    apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ── Referral ────────────────────────────────────────────────────────────────
  getReferralCode: () => apiFetch('/api/referral/code'),
  trackReferralClick: (code: string) => apiFetch(`/api/referrals/click/${encodeURIComponent(code)}`, { method: 'POST' }),

  // ── Household profile (gender/DOB/marital + dependents/spouse) ─────────────
  // Drives Faraid prefill, Wasiyyah beneficiary suggestions, and the gender-
  // aware gold jewelry fiqh classifier. See HouseholdController.java.
  getHousehold: () => apiFetch('/api/household'),
  updateHouseholdProfile: (data: { gender?: string | null; dateOfBirth?: number | null; maritalStatus?: string | null }) =>
    apiFetch('/api/household/profile', { method: 'PUT', body: JSON.stringify(data) }),
  createHouseholdMember: (data: { relationship: string; fullName: string; dateOfBirth?: number | null; gender?: string | null; notes?: string | null }) =>
    apiFetch('/api/household/members', { method: 'POST', body: JSON.stringify(data) }),
  updateHouseholdMember: (id: number, data: { relationship?: string; fullName?: string; dateOfBirth?: number | null; gender?: string | null; notes?: string | null }) =>
    apiFetch(`/api/household/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHouseholdMember: (id: number) =>
    apiFetch(`/api/household/members/${id}`, { method: 'DELETE' }),

  // ── Family Plan ─────────────────────────────────────────────────────────────
  // Owner can invite up to 5 additional members onto a single Family subscription.
  // See FamilyController.java for the server contract; preview is public (no auth).
  getFamily: () => apiFetch('/api/family'),
  createFamilyInvite: (email: string) =>
    apiFetch('/api/family/invites', { method: 'POST', body: JSON.stringify({ email }) }),
  listFamilyInvites: () => apiFetch('/api/family/invites'),
  cancelFamilyInvite: (inviteId: number) =>
    apiFetch(`/api/family/invites/${inviteId}`, { method: 'DELETE' }),
  listFamilyMembers: () => apiFetch('/api/family/members'),
  removeFamilyMember: (userId: number) =>
    apiFetch(`/api/family/members/${userId}`, { method: 'DELETE' }),
  leaveFamily: () => apiFetch('/api/family/leave', { method: 'POST' }),
  acceptFamilyInvite: (token: string) =>
    apiFetch('/api/family/accept', { method: 'POST', body: JSON.stringify({ token }) }),
  previewFamilyInvite: (token: string) =>
    apiFetch(`/api/family/invite/preview?token=${encodeURIComponent(token)}`),

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
  // BUG FIX: use apiDownload() instead of raw fetch() so auth/CSRF/timeout/retry
  // are all handled consistently with the rest of the API surface.
  downloadWasiyyahPdf: () =>
    apiDownload('/api/wasiyyah/export/pdf', `wasiyyah_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf`),

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

  getLedgerByType: (type: string, page = 0, size = 50) =>
    apiFetch(`/api/ledger/type/${encodeURIComponent(type)}?page=${page}&size=${size}`),

  // ─── Zakat Snapshots ─────────────────────────────────────────
  getZakatSnapshots: () =>
    apiFetch('/api/zakat/snapshots'),

  getLockedSnapshots: () =>
    apiFetch('/api/zakat/snapshots/locked'),
};
