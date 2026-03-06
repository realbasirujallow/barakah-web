// When empty (default), requests use same-origin and are proxied to the
// backend by Next.js rewrites in next.config.ts — no CORS required.
// Set NEXT_PUBLIC_API_URL to a full URL to call the backend directly
// (requires the backend ALLOWED_ORIGINS to include this app's domain).
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ── 401 global handler ────────────────────────────────────────────────────────
// Register a callback (e.g. logout + redirect) that fires whenever a 401
// cannot be recovered by the silent refresh flow below.
let onUnauthorizedCallback: (() => void) | null = null;

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorizedCallback = fn;
}

// ── Silent refresh ─────────────────────────────────────────────────────────────
// When a request gets a 401 (expired access token), we attempt one silent
// refresh via POST /auth/refresh. The refresh_token httpOnly cookie is sent
// automatically by the browser (path=/auth). If it succeeds, the server sets
// a new auth_token cookie and we replay the original request transparently.
//
// Concurrent 401s are deduplicated: all callers wait for the same refresh
// promise, then each re-tries their own request once.

let isRefreshing = false;
let refreshSubscribers: Array<(ok: boolean) => void> = [];

function subscribeToRefresh(cb: (ok: boolean) => void) {
  refreshSubscribers.push(cb);
}

function notifySubscribers(ok: boolean) {
  refreshSubscribers.forEach(cb => cb(ok));
  refreshSubscribers = [];
}

/** Calls POST /auth/refresh directly (bypasses apiFetch to avoid recursion). */
async function attemptSilentRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── JSON fetch helper ─────────────────────────────────────────────────────────
// suppressUnauthorized: when true, a 401 that cannot be recovered by silent
// refresh throws an error but does NOT fire the global onUnauthorizedCallback
// (i.e., does not auto-logout). Use this for pages like /admin where a 401
// should be handled locally (show "session expired" UI) rather than
// silently logging the user out.
export async function apiFetch(endpoint: string, options: RequestInit = {}, timeoutMs = 30000, suppressUnauthorized = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

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
  } catch (err: any) {
    if (err.name === 'AbortError') {
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
    // never gets a 401 — it's unauthenticated — so isRefreshing will be false
    // whenever we enter this block from a real API call).
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
      let refreshOk: boolean;
      if (!isRefreshing) {
        isRefreshing = true;
        refreshOk = await attemptSilentRefresh();
        isRefreshing = false;
        notifySubscribers(refreshOk);
      } else {
        // Another request is already refreshing — wait for it
        refreshOk = await new Promise<boolean>(resolve => subscribeToRefresh(resolve));
      }

      if (refreshOk) {
        // Retry the original request — the new auth_token cookie is now set
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 30000);
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

      // Refresh failed or retry failed — the session is gone.
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
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s for uploads
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Upload timed out.');
    throw new Error('No connection to server.');
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 401) {
      const refreshOk = isRefreshing
        ? await new Promise<boolean>(r => subscribeToRefresh(r))
        : (isRefreshing = true, await attemptSilentRefresh().finally(() => { isRefreshing = false; notifySubscribers(false); }));
      if (refreshOk) {
        const r2 = await fetch(`${API_URL}${endpoint}`, { method: 'POST', body: formData, credentials: 'include' });
        if (r2.ok) { const t = await r2.text(); if (!t) return null; try { return JSON.parse(t); } catch { throw new Error('Unexpected server response.'); } }
      }
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
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s for downloads
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Download timed out.');
    throw new Error('No connection to server.');
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 401) {
      const refreshOk = isRefreshing
        ? await new Promise<boolean>(r => subscribeToRefresh(r))
        : (isRefreshing = true, await attemptSilentRefresh().finally(() => { isRefreshing = false; notifySubscribers(false); }));
      if (refreshOk) {
        const r2 = await fetch(`${API_URL}${endpoint}`, { credentials: 'include' });
        if (r2.ok) {
          const blob2 = await r2.blob();
          const url2 = URL.createObjectURL(blob2);
          const a2 = document.createElement('a'); a2.href = url2; a2.download = filename;
          document.body.appendChild(a2); a2.click(); document.body.removeChild(a2); URL.revokeObjectURL(url2);
          return;
        }
      }
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
  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name: string, email: string, password: string, state: string) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ fullName: name, email, password, state }) }),
  // Clears the auth_token httpOnly cookie on the server side.
  logout: () =>
    apiFetch('/auth/logout', { method: 'POST' }),
  // Silently renews the access token using the refresh_token cookie.
  // Returns true if successful (new auth_token cookie has been set by the server).
  refresh: () => attemptSilentRefresh(),
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

  // Bills
  getBills: () => apiFetch('/api/bills/list'),
  addBill: (data: Record<string, unknown>) =>
    apiFetch('/api/bills/add', { method: 'POST', body: JSON.stringify(data) }),
  markBillPaid: (id: number) =>
    apiFetch(`/api/bills/${id}/mark-paid`, { method: 'POST' }),
  deleteBill: (id: number) =>
    apiFetch(`/api/bills/${id}`, { method: 'DELETE' }),

  // Hawl
  getHawl: () => apiFetch('/api/hawl/list'),
  addHawl: (data: Record<string, unknown>) =>
    apiFetch('/api/hawl/add', { method: 'POST', body: JSON.stringify(data) }),
  markHawlPaid: (id: number) =>
    apiFetch(`/api/hawl/${id}/mark-paid`, { method: 'POST' }),
  deleteHawl: (id: number) =>
    apiFetch(`/api/hawl/${id}`, { method: 'DELETE' }),

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

  // Savings Goals
  getSavingsGoals: () => apiFetch('/api/savings-goals/list'),
  addSavingsGoal: (data: Record<string, unknown>) =>
    apiFetch('/api/savings-goals/add', { method: 'POST', body: JSON.stringify(data) }),
  contributeSavingsGoal: (id: number, amount: number) =>
    apiFetch(`/api/savings-goals/${id}/contribute`, { method: 'POST', body: JSON.stringify({ amount }) }),
  deleteSavingsGoal: (id: number) =>
    apiFetch(`/api/savings-goals/${id}`, { method: 'DELETE' }),

  // Halal Screening
  checkHalal: (symbol: string) => apiFetch(`/api/halal/check/${symbol}`),
  getHalalStocks: () => apiFetch('/api/halal/list'),

  // Analytics
  getTransactionSummary: (period: string = 'month') =>
    apiFetch(`/api/transactions/summary?period=${period}`),

  getMonthlySummary: (months: number = 13) =>
    apiFetch(`/api/transactions/monthly-summary?months=${months}`),

  // Multi-currency
  getCurrencyRates: () => apiFetch('/api/currency/rates'),
  convertCurrency: (from: string, to: string, amount: number) =>
    apiFetch(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`),

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

  // Profile
  getProfile: () => apiFetch('/auth/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    apiFetch('/auth/update-profile', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: (password: string) =>
    apiFetch('/auth/delete-account', { method: 'DELETE', body: JSON.stringify({ password }) }),

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
  getAdminUserCount: () => apiFetch('/admin/user-count', {}, 30000, true),
  getAdminUsers: (page = 0, size = 50) =>
    apiFetch(`/admin/active-users?page=${page}&size=${size}`, {}, 30000, true),
  adminResetPassword: (userId: number) =>
    apiFetch(`/admin/users/${userId}/reset-password`, { method: 'POST' }, 30000, true),
  adminUpdatePlan: (userId: number, plan: string) =>
    apiFetch(`/admin/users/${userId}/plan`, { method: 'PUT', body: JSON.stringify({ plan }) }, 30000, true),
  getAdminAnalytics: () => apiFetch('/admin/analytics', {}, 30000, true),
  getAdminFeatureUsage: () => apiFetch('/admin/feature-usage', {}, 30000, true),

  // Exports
  downloadTransactionsCsv: () =>
    apiDownload('/api/transactions/export/csv', 'transactions.csv'),
  downloadTransactionsPdf: () =>
    apiDownload('/api/transactions/export/pdf', 'transactions.pdf'),

  // Import (Monarch Money — Balances or Transactions CSV)
  monarchPreview: (file: File) =>
    apiUpload('/api/import/monarch/preview', file),
  monarchExecute: (payload: Record<string, unknown>) =>
    apiFetch('/api/import/monarch/execute', { method: 'POST', body: JSON.stringify(payload) }, 300000),

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
      }, 300000);
    }

    // Split transactions into chunks
    const allTxns = (payload.transactions as unknown[]) || [];
    if (allTxns.length <= chunkSize) {
      return apiFetch('/api/import/monarch/execute', {
        method: 'POST', body: JSON.stringify(payload),
      }, 300000);
    }

    let totalCreated = 0;
    let totalSkipped = 0;
    const allErrors: string[] = [];

    for (let i = 0; i < allTxns.length; i += chunkSize) {
      const chunk = allTxns.slice(i, i + chunkSize);
      const chunkPayload = { format: 'transactions', transactions: chunk };
      const data = await apiFetch('/api/import/monarch/execute', {
        method: 'POST', body: JSON.stringify(chunkPayload),
      }, 300000);
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
};
