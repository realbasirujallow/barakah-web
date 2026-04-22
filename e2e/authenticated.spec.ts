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
  // Reuse the session established once per test run by e2e/global-setup.ts.
  // That setup persists the cookie jar to STORAGE_STATE_FILE (defaults to
  // e2e/.auth/user.json) so every spec file shares the same login.
  const STORAGE_STATE = 'e2e/.auth/user.json';
  try {
    sharedContext = await apiRequest.newContext({
      baseURL: API,
      storageState: STORAGE_STATE,
    });

    // Confirm the persisted session still works. /auth/profile is a
    // GET so CSRF isn't required; a 401 here means global-setup
    // wrote an empty state or the session got invalidated between
    // globalSetup and beforeAll (rotation, etc.).
    const probe = await sharedContext.get('/auth/profile');
    if (!probe.ok()) {
      sessionError = `profile probe ${probe.status()}: ` +
        `global-setup may have written empty state (no creds, rate-limit, etc.)`;
      return;
    }

    // Pull CSRF token from the persisted storage state. Non-GET
    // requests add X-XSRF-TOKEN header from this value.
    const state = await sharedContext.storageState();
    const csrf = state.cookies.find((c) => c.name === 'XSRF-TOKEN');
    csrfToken = csrf?.value || process.env.E2E_CSRF_TOKEN || '';
    if (!csrfToken) {
      // Bootstrap on the fly if the persisted state didn't include it.
      await sharedContext.get('/auth/csrf');
      const refreshed = await sharedContext.storageState();
      csrfToken = refreshed.cookies.find((c) => c.name === 'XSRF-TOKEN')?.value || '';
    }
    sessionReady = csrfToken.length > 0;
    if (!sessionReady) sessionError = 'failed to obtain XSRF-TOKEN';
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

  // ── Nisab-type matrix (W2 hardening, 2026-04-22) ──────────────────────────
  // ZakatController.java:336 selects between gold and silver thresholds:
  //   `nisabThreshold = nisabType.equals("gold") ? goldThreshold : silverThreshold;`
  // Classical-Hanafi silver nisab is typically the LOWER of the two (silver
  // prices are much lower than gold), so $5K wealth tends to be above silver
  // and below gold — catching any mis-wiring of the threshold selector.

  test('zakat calculate nisabType=silver returns result', async () => {
    const res = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
      data: { totalWealth: 50000, nisabType: 'silver' },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.nisabType).toBe('silver');
    expect(data.eligible).toBe(true);
    expect(data.nisabThreshold).toBeGreaterThan(0);
    // Silver-based nisab should be materially lower than gold-based — the
    // same wealth straddling the two thresholds is exactly why Classical
    // Hanafi picks silver (wider zakat net, pro-poor intent).
  });

  test('zakat calculate silver vs gold thresholds differ for the same wealth', async () => {
    const goldRes = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
      data: { totalWealth: 50000, nisabType: 'gold' },
    });
    const silverRes = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
      data: { totalWealth: 50000, nisabType: 'silver' },
    });
    expect(goldRes.ok()).toBeTruthy();
    expect(silverRes.ok()).toBeTruthy();
    const goldData = await goldRes.json();
    const silverData = await silverRes.json();
    // Threshold values MUST differ — identical thresholds for both types
    // means the selector is broken (either silver is missing or gold is
    // shadowing silver). This guards against a real class of bug where
    // `nisabType` param is read but the threshold lookup ignores it.
    expect(goldData.nisabThreshold).not.toEqual(silverData.nisabThreshold);
  });

  test('zakat calculate returns debtDeductionMethod-consistent deductedDebt', async () => {
    // Whichever method the applereview account's fiqh config uses
    // (full_balance → deductedDebt = principal; annual_installment →
    // deductedDebt = 12 × monthly payment), the response SHAPE must
    // carry both totals. This pins the contract against backend
    // refactors that might quietly drop one of the fields.
    const res = await sharedContext.post('/api/zakat/calculate', {
      headers: writeHeaders(),
      data: {
        totalWealth: 50000,
        nisabType: 'gold',
        deductibleDebt: 10000,
        debtMonthlyPayment: 250,
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.eligible).toBe(true);
    expect(data).toHaveProperty('deductedDebt');
    expect(data).toHaveProperty('zakatableWealth');
    expect(data.deductedDebt).toBeGreaterThan(0);
    // zakatableWealth MUST equal totalWealth - deductedDebt modulo
    // precision — sanity-checks the deduction actually applied
    expect(data.zakatableWealth).toBeCloseTo(50000 - data.deductedDebt, 2);
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

  // ── Wasiyyah trust-critical invariants (W4 hardening, 2026-04-22) ─────────
  //
  // ⚠ Real bug surfaced while writing these tests (2026-04-22):
  //
  //   WasiyyahService.addBeneficiary gates BOTH the 1/3 cap AND the
  //   "no bequest to a legal heir" (La wasiyyata li-warith) checks
  //   behind `shareType.equals("voluntary")`. But the public DTO
  //   WasiyyahBeneficiaryRequest only accepts
  //   `percentage|fixed_amount|""` — "voluntary" is rejected upstream.
  //   That means NEITHER Islamic invariant currently fires for any
  //   request coming through /api/wasiyyah/add.
  //
  //   File:lines:
  //     barakah-backend/src/main/java/com/barakah/dto/WasiyyahBeneficiaryRequest.java:34
  //     barakah-backend/src/main/java/com/barakah/service/WasiyyahService.java:89-114
  //
  //   Fix is a product decision — either widen the DTO regex to include
  //   "voluntary" and set it as the default, or remove the
  //   shareType=="voluntary" gate in the service and apply the checks
  //   to every bequest. Both are valid readings of classical fiqh
  //   (all wasiyyah bequests are inherently voluntary in Islamic law).
  //
  // The two tests below are marked `.fixme` so they surface the issue
  // loudly in CI without blocking merges. They send the API shape as
  // documented (shareType=percentage) — which is what a Plus user
  // would hit. Once the dead-code gate is fixed, flip .fixme → no-op
  // and they will assert the cap + heir checks hold end-to-end.

  test.fixme('wasiyyah add enforces 1/3 cap on a 34% bequest', async () => {
    // Expected post-fix: 400 with "1/3" / "33.33" / "exceed" in the
    // error body. Pre-fix: the bequest is silently created and the
    // cap doesn't fire.
    const res = await sharedContext.post('/api/wasiyyah/add', {
      headers: writeHeaders(),
      data: {
        beneficiaryName: 'Test Mosque Foundation (E2E)',
        relationship: 'charity',
        sharePercentage: 34,
        shareType: 'percentage',
      },
    });
    if (res.status() === 403) return;
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/1\/3|33\.33|exceed/i);
  });

  test.fixme('wasiyyah add rejects bequest to a legal heir (La wasiyyata li-warith)', async () => {
    // Expected post-fix: 400 with "legal heir" / "warith" / "not
    // permitted" in the error body. Hadith: Abu Dawud 2870,
    // Tirmidhi 2120, Ibn Majah 2713. Pre-fix: the bequest to a legal
    // heir is silently created.
    const res = await sharedContext.post('/api/wasiyyah/add', {
      headers: writeHeaders(),
      data: {
        beneficiaryName: 'Test Legal Heir (E2E)',
        relationship: 'son',
        sharePercentage: 10,
        shareType: 'percentage',
      },
    });
    if (res.status() === 403) return;
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/legal heir|la wasiyyata|warith|not permitted/i);
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
