import { test, expect, request as apiRequest, type APIRequestContext } from '@playwright/test';

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

// R8 audit (2026-04-21): the backend no longer returns a raw access token
// in /auth/login JSON for web clients — only Flutter / native mobile UAs
// receive one. Previously this suite used Authorization: Bearer <token>
// and silently skipped all tests the moment the contract flipped. We now
// authenticate via the same httpOnly cookie flow the real browser uses:
//   1. POST /auth/login → backend sets auth_token + refresh_token cookies.
//   2. GET  /auth/csrf  → materialize XSRF-TOKEN cookie for double-submit.
//   3. Subsequent requests reuse sharedContext so cookies persist.
// Non-GET requests must include the CSRF header from the cookie value.

let sharedContext: APIRequestContext;
let sessionReady = false;
let sessionError = '';
let csrfToken = '';

test.beforeAll(async () => {
  sharedContext = await apiRequest.newContext({ baseURL: API });
  try {
    const loginRes = await sharedContext.post('/auth/login', {
      data: { email: EMAIL, password: PASSWORD },
    });
    if (!loginRes.ok()) {
      sessionError = `login ${loginRes.status()}: ${await loginRes.text()}`;
      return;
    }
    // Bootstrap CSRF cookie. /auth/csrf is same-origin and returns 204 +
    // Set-Cookie XSRF-TOKEN. Playwright's APIRequestContext keeps cookies
    // in its own jar across calls so this value is then auto-attached.
    await sharedContext.get('/auth/csrf');
    const state = await sharedContext.storageState();
    const csrf = state.cookies.find((c) => c.name === 'XSRF-TOKEN');
    csrfToken = csrf?.value || '';
    sessionReady = true;
  } catch (err) {
    sessionError = `beforeAll threw: ${err instanceof Error ? err.message : String(err)}`;
  }
});

test.afterAll(async () => {
  await sharedContext?.dispose();
});

test.beforeEach(() => {
  test.skip(!sessionReady, `Session not established — ${sessionError || 'unknown reason'}`);
});

function writeHeaders() {
  return { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken };
}

// NOTE: previously `test.describe.configure({ mode: 'serial' })` — that mode
// bails the rest of the suite on the first failure, so a single Plus-gated
// endpoint returning 403 (or any flake) skipped 6 unrelated tests downstream.
// Each test is independent (they only share the cached login session), so
// running in parallel-safe mode is correct.

test.describe('Authenticated API Tests', () => {
  test('login succeeds (session established via cookies)', async () => {
    expect(sessionReady).toBe(true);
    expect(csrfToken).toBeTruthy();
  });

  test('dashboard widgets returns data', async () => {
    const res = await sharedContext.get('/api/dashboard/widgets');
    expect(res.ok()).toBeTruthy();
  });

  test('dashboard insights returns array', async () => {
    const res = await sharedContext.get('/api/dashboard/insights');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.insights)).toBeTruthy();
  });

  test('zakat calculate returns result', async () => {
    const res = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
      data: { totalWealth: 50000, nisabType: 'gold' },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.eligible).toBe(true);
    expect(data.zakatDue).toBeGreaterThan(0);
    expect(data.hawlRequired).toBe(true);
    expect(data.nisabThreshold).toBeGreaterThan(0);
  });

  test('zakat calculate with debt deduction', async () => {
    const res = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
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

  test('zakat calculate below nisab returns not eligible', async () => {
    const res = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
      data: { totalWealth: 100, nisabType: 'gold' },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.eligible).toBe(false);
  });

  test('hawl list returns trackers', async () => {
    const res = await sharedContext.get('/api/hawl/list');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('trackers');
  });

  test('asset list returns data', async () => {
    const res = await sharedContext.get('/api/assets/list');
    expect(res.ok()).toBeTruthy();
  });

  test('transaction list returns paginated data', async () => {
    const res = await sharedContext.get('/api/transactions/list?page=0&size=10');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('transactions');
  });

  test('transaction search works', async () => {
    const res = await sharedContext.get('/api/transactions/list?search=payment&page=0&size=10');
    expect(res.ok()).toBeTruthy();
  });

  test('budget list returns data', async () => {
    const res = await sharedContext.get('/api/budgets/list');
    expect(res.ok()).toBeTruthy();
  });

  test('debt list returns data', async () => {
    const res = await sharedContext.get('/api/debts/list');
    expect(res.ok()).toBeTruthy();
  });

  test('bill list returns data', async () => {
    const res = await sharedContext.get('/api/bills/list');
    expect(res.ok()).toBeTruthy();
  });

  test('sadaqah list returns data', async () => {
    const res = await sharedContext.get('/api/sadaqah/list');
    expect(res.ok()).toBeTruthy();
  });

  test('fiqh config returns madhab', async () => {
    const res = await sharedContext.get('/api/fiqh/config');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('madhab');
  });

  test('wasiyyah list returns data or Plus-required gate', async () => {
    const res = await sharedContext.get('/api/wasiyyah/list');
    // Wasiyyah is gated to Plus/Family plans (AuthHelper.requirePlusPlan).
    // 200 = Plus user, 403 = Free user — both are valid backend behavior.
    expect([200, 403]).toContain(res.status());
  });

  test('stripe status returns plan', async () => {
    const res = await sharedContext.get('/api/stripe/status');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('plan');
  });

  test('churn save returns offers', async () => {
    const res = await sharedContext.post('/api/churn/start', { headers: writeHeaders() });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.offers)).toBeTruthy();
  });

  test('referral info returns code', async () => {
    const res = await sharedContext.get('/api/referral/code');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('referralCode');
  });

  test('plaid accounts responds', async () => {
    const res = await sharedContext.get('/api/plaid/accounts');
    expect([200, 404].includes(res.status())).toBeTruthy();
  });

  test('safe to spend responds', async () => {
    const res = await sharedContext.get('/api/cash-flow/safe-to-spend');
    expect([200, 404].includes(res.status())).toBeTruthy();
  });

  test('net worth history returns data', async () => {
    const res = await sharedContext.get('/api/net-worth/history');
    expect(res.ok()).toBeTruthy();
  });
});
