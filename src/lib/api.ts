const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trybarakah.com';


export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
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
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }

  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name: string, email: string, password: string, state: string) =>
    apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ fullName: name, email, password, state }) }),

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
  getTransactions: (type?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (limit) params.set('limit', String(limit));
    return apiFetch(`/api/transactions/list?${params}`);
  },
  addTransaction: (data: Record<string, unknown>) =>
    apiFetch('/api/transactions/add', { method: 'POST', body: JSON.stringify(data) }),
  deleteTransaction: (id: number) =>
    apiFetch(`/api/transactions/${id}`, { method: 'DELETE' }),

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
  getNetWorthHistory: () => apiFetch('/api/net-worth/history'),

  // Shared Finances
  getSharedGroups: () => apiFetch('/api/shared/groups/list'),
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
};
