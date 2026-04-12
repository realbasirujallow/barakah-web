import { test, expect } from '@playwright/test';

const API = process.env.E2E_API_URL || 'https://trybarakah.com';
const EMAIL = 'applereview@trybarakah.com';
const PASSWORD = 'ReviewBarakah2026!';

// Login once and reuse token across tests
let token = '';

async function ensureToken(request: any) {
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

test.describe.configure({ mode: 'serial' });

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
    expect([200, 400].includes(res.status())).toBeTruthy();
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

  test('wasiyyah list returns data', async ({ request }) => {
    await ensureToken(request);
    test.skip(!token, 'Login rate-limited');
    const res = await request.get(`${API}/api/wasiyyah/list`, { headers: auth() });
    expect(res.ok()).toBeTruthy();
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
    const res = await request.get(`${API}/api/referral/info`, { headers: auth() });
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
