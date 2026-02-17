const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trybarakah.com';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

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
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name: string, email: string, password: string) =>
    apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  // Assets
  getAssets: () => apiFetch('/api/assets/list'),
  getAssetTotal: () => apiFetch('/api/assets/total'),

  // Transactions
  getTransactions: () => apiFetch('/api/transactions/list'),
  addTransaction: (data: Record<string, unknown>) =>
    apiFetch('/api/transactions/add', { method: 'POST', body: JSON.stringify(data) }),

  // Budgets
  getBudgets: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.set('month', String(month));
    if (year) params.set('year', String(year));
    return apiFetch(`/api/budgets/list?${params}`);
  },

  // Debts
  getDebts: () => apiFetch('/api/debts/list'),

  // Bills
  getBills: () => apiFetch('/api/bills/list'),

  // Hawl
  getHawl: () => apiFetch('/api/hawl/list'),

  // Sadaqah
  getSadaqah: () => apiFetch('/api/sadaqah/list'),
  getSadaqahStats: () => apiFetch('/api/sadaqah/stats'),

  // Wasiyyah
  getWasiyyah: () => apiFetch('/api/wasiyyah/list'),

  // Waqf
  getWaqf: () => apiFetch('/api/waqf/list'),

  // Riba
  scanRiba: () => apiFetch('/api/riba/scan'),

  // Auto Categorize
  reviewCategories: () => apiFetch('/api/categorize/review'),
  applyCategories: (minConfidence = 60) => apiFetch(`/api/categorize/apply?minConfidence=${minConfidence}`, { method: 'POST' }),

  // Zakat
  getZakat: () => apiFetch('/api/assets/total'),

  // Savings Goals
  getSavingsGoals: () => apiFetch('/api/savings-goals/list'),
};
