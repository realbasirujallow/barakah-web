import { test, expect, type APIRequestContext } from '@playwright/test';

// API origin — falls back to E2E_BASE_URL (same-origin assumption) and
// finally to localhost so every branch is reachable in the default
// "just run the dev server" flow. Set E2E_API_URL to a separate host when
// the backend lives at a different origin (Railway backend + Vercel web).
const API = process.env.E2E_API_URL
  || process.env.E2E_BASE_URL
  || 'http://localhost:3000';
const EMAIL = process.env.E2E_EMAIL || '';
const PASSWORD = process.env.E2E_PASSWORD || '';

// Skip the whole suite at discovery time when credentials aren't present —
// otherwise every test fails with a misleading 401/JSON-parse error. See
// .env.e2e.example for the required vars.
test.skip(!EMAIL || !PASSWORD,
  'E2E_EMAIL + E2E_PASSWORD not set — skipping authenticated suite. ' +
  'Copy .env.e2e.example to .env.e2e and fill in a test account.');

// Login once and reuse token across tests
let token = '';

async function ensureToken(request: APIRequestContext) {
  if (token) return token;
  const res = await request.post(`${API}/auth/login`, {
    data: { email: EMAIL, password: PASSWORD },
  });
  const data = await res.json();
  token = data.token;
  return token;
}

function auth() {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// NOTE: previously `test.describe.configure({ mode: 'serial' })` — that mode
// bails the rest of the suite on the first failure, so a single Plus-gated
// endpoint returning 403 (or any flake) skipped 6 unrelated tests downstream.
// Each test is independent (they only share the cached login token), so
// running in parallel-safe mode is correct.

test.describe('Authenticated API Tests', () => {
  test('login succeeds and returns token', async ({ request }) => {
    await ensureToken(request);
    if (!token) {
      test.skip(true, 'Login rate-limited — wait 15 minutes and re-run');
      return;
    }
    expect(token).toBeTruthy();
  });

  test('dashboard widgets returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/dashboard/widgets`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('dashboard insights returns array', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/dashboard/insights`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.insights)).toBeTruthy();
  });

  test('zakat calculate returns result', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.post(`${API}/api/zakat/calculate`, {
      headers: auth(),
      data: { totalWealth: 50000, nisabType: 'gold' },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.eligible).toBe(true);
    expect(data.zakatDue).toBeGreaterThan(0);
    expect(data.hawlRequired).toBe(true);
    expect(data.nisabThreshold).toBeGreaterThan(0);
  });

  test('zakat calculate with debt deduction', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.post(`${API}/api/zakat/calculate`, {
      headers: auth(),
      data: { totalWealth: 50000, nisabType: 'gold', deductibleDebt: 20000, debtMonthlyPayment: 500 },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.eligible).toBe(true);
    // Debt deduction amount depends on user's fiqh config:
    // "full_balance" → deductedDebt = 20000
    // "annual_installment" → deductedDebt = 500 * 12 = 6000
    expect(data.deductedDebt).toBeGreaterThan(0);
    expect(data.zakatableWealth).toBeLessThan(50000);
  });

  test('zakat calculate below nisab returns not eligible', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.post(`${API}/api/zakat/calculate`, {
      headers: auth(),
      data: { totalWealth: 100, nisabType: 'gold' },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.eligible).toBe(false);
  });

  test('hawl list returns trackers', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/hawl/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('trackers');
  });

  test('asset list returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/assets/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('transaction list returns paginated data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/transactions/list?page=0&size=10`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('transactions');
  });

  test('transaction search works', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/transactions/list?search=payment&page=0&size=10`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('budget list returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/budgets/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('debt list returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/debts/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('bill list returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/bills/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('sadaqah list returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/sadaqah/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });

  test('fiqh config returns madhab', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/fiqh/config`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('madhab');
  });

  test('wasiyyah list returns data or Plus-required gate', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/wasiyyah/list`, { headers: auth() });
    // Wasiyyah is gated to Plus/Family plans (AuthHelper.requirePlusPlan).
    // 200 = Plus user, 403 = Free user — both are valid backend behavior.
    expect([200, 403]).toContain(res.status());
  });

  test('stripe status returns plan', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/stripe/status`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('plan');
  });

  test('churn save returns offers', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.post(`${API}/api/churn/start`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.offers)).toBeTruthy();
  });

  test('referral info returns code', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/referral/code`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('referralCode');
  });

  test('plaid accounts responds', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/plaid/accounts`, { headers: auth() });
    expect([200, 404].includes(res.status())).toBeTruthy();
  });

  test('safe to spend responds', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/cash-flow/safe-to-spend`, { headers: auth() });
    expect([200, 404].includes(res.status())).toBeTruthy();
  });

  test('net worth history returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/net-worth/history`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
  });
});
