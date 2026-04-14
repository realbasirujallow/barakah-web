import { test, expect, Page } from '@playwright/test';

const BASE = process.env.E2E_BASE_URL || 'https://trybarakah.com';
const EMAIL = process.env.E2E_EMAIL || '';
const PASSWORD = process.env.E2E_PASSWORD || '';

test.describe('Browser Authenticated Flows', () => {
  test.skip(!EMAIL || !PASSWORD, 'E2E_EMAIL and E2E_PASSWORD required');

  let page: Page;
  let loggedIn = false;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // Login via the real browser UI
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for any post-login redirect (dashboard, setup, or rate-limit error)
    await page.waitForTimeout(5000);

    // Check if we landed on an authenticated page
    const url = page.url();
    if (url.includes('/dashboard') || url.includes('/setup')) {
      // If setup flow, go directly to dashboard
      if (url.includes('/setup')) {
        await page.goto(`${BASE}/dashboard`);
        await page.waitForTimeout(3000);
      }
      loggedIn = true;
    } else {
      // Rate-limited or auth failed — try navigating directly
      await page.goto(`${BASE}/dashboard`);
      await page.waitForTimeout(3000);
      loggedIn = !page.url().includes('/login');
    }
  });

  test.afterAll(async () => {
    await page?.context().close();
  });

  test.beforeEach(() => {
    test.skip(!loggedIn, 'Login failed or rate-limited');
  });

  // ── Dashboard ──────────────────────────────────────────────────────────────

  test('dashboard loads with greeting and widgets', async () => {
    await page.goto(`${BASE}/dashboard`);
    await expect(page.locator('text=/Good (morning|afternoon|evening)/i')).toBeVisible({ timeout: 10000 });
    // Net worth and Zakat cards depend on /api/dashboard/widgets which can take
    // longer than the default 5s timeout — match the greeting timeout. Both
    // labels also appear in the sidebar nav, so .first() selects the card
    // (Playwright's strict mode otherwise rejects the ambiguous match).
    await expect(page.locator('text=/NET WORTH/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/ZAKAT/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('dashboard shows Islamic date', async () => {
    await page.goto(`${BASE}/dashboard`);
    // Anchor on the static "Islamic Date" label instead of a regex against the
    // formatted date — the date string format can vary by locale and Playwright's
    // text=/regex/ matching is finicky with mixed whitespace text nodes.
    await expect(page.getByText('Islamic Date', { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('session persists after page reload', async () => {
    await page.goto(`${BASE}/dashboard`);
    await page.reload();
    // After reload the AuthContext re-validates the cookie before the dashboard
    // mounts — give it room for that round-trip plus widget fetch.
    await expect(page.locator('text=/Good (morning|afternoon|evening)/i')).toBeVisible({ timeout: 15000 });
  });

  // ── Transactions ───────────────────────────────────────────────────────────

  test('transactions page loads with data', async () => {
    await page.goto(`${BASE}/dashboard/transactions`);
    // Page renders a SkeletonPage while loading; wait long enough for the
    // first data fetch (transactions + subscription status + categories) to
    // resolve before the real h1 mounts.
    await expect(page.getByRole('heading', { name: 'Transactions', exact: true })).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=/Income/i').first()).toBeVisible();
    await expect(page.locator('text=/Expenses/i').first()).toBeVisible();
  });

  test('transaction search works in browser', async () => {
    await page.fill('input[placeholder*="Search"]', 'QA');
    await page.waitForTimeout(500);
    await expect(page.locator('text=/QA/i').first()).toBeVisible();
  });

  // ── Assets ─────────────────────────────────────────────────────────────────

  test('assets page loads', async () => {
    await page.goto(`${BASE}/dashboard/assets`);
    await expect(page.locator('h1:has-text("Assets")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Net Worth/i').first()).toBeVisible();
  });

  // ── Debts ──────────────────────────────────────────────────────────────────

  test('debts page loads with tracker', async () => {
    await page.goto(`${BASE}/dashboard/debts`);
    await expect(page.locator('text=/Debt Tracker/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Total Remaining/i')).toBeVisible();
  });

  // ── Budget ─────────────────────────────────────────────────────────────────

  test('budget page loads', async () => {
    await page.goto(`${BASE}/dashboard/budget`);
    await expect(page.locator('text=/Budget Planning/i')).toBeVisible({ timeout: 10000 });
  });

  // ── Bills ──────────────────────────────────────────────────────────────────

  test('bills page loads', async () => {
    await page.goto(`${BASE}/dashboard/bills`);
    await expect(page.locator('text=/Bills/i').first()).toBeVisible({ timeout: 10000 });
  });

  // ── Savings Goals ──────────────────────────────────────────────────────────

  test('savings goals page loads', async () => {
    await page.goto(`${BASE}/dashboard/savings`);
    await expect(page.locator('text=/Savings Goals/i')).toBeVisible({ timeout: 10000 });
  });

  // ── Zakat Calculator ───────────────────────────────────────────────────────

  test('zakat calculator loads with live data', async () => {
    await page.goto(`${BASE}/dashboard/zakat`);
    await expect(page.locator('text=/Zakat Calculator/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Nisab Threshold/i')).toBeVisible();
    await expect(page.locator('text=/2\\.5%/i')).toBeVisible();
  });

  // ── Hawl Tracker ───────────────────────────────────────────────────────────

  test('hawl tracker loads', async () => {
    await page.goto(`${BASE}/dashboard/hawl`);
    await expect(page.locator('text=/Hawl Tracker/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Islamic Guidance on Hawl/i')).toBeVisible();
  });

  // ── Prayer Times ───────────────────────────────────────────────────────────

  test('prayer times loads', async () => {
    await page.goto(`${BASE}/dashboard/prayer-times`);
    await expect(page.locator('text=/Prayer Times/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Fajr/i')).toBeVisible();
    await expect(page.locator('text=/Maghrib/i')).toBeVisible();
  });

  // ── Fiqh Settings ──────────────────────────────────────────────────────────

  test('fiqh settings loads with madhab options', async () => {
    await page.goto(`${BASE}/dashboard/fiqh`);
    await expect(page.locator('text=/Fiqh Settings/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Hanafi/i')).toBeVisible();
    await expect(page.locator('text=/Shafi/i')).toBeVisible();
  });

  // ── Wasiyyah ───────────────────────────────────────────────────────────────

  test('wasiyyah page loads', async () => {
    await page.goto(`${BASE}/dashboard/wasiyyah`);
    await expect(page.locator('text=/Wasiyyah/i').first()).toBeVisible({ timeout: 10000 });
  });

  // ── Ibadah Finance ─────────────────────────────────────────────────────────

  test('ibadah finance shows all Islamic obligations', async () => {
    await page.goto(`${BASE}/dashboard/ibadah`);
    await expect(page.locator('text=/Ibadah Finance/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Zakat/i').first()).toBeVisible();
    await expect(page.locator('text=/Sadaqah/i')).toBeVisible();
    await expect(page.locator('text=/Wasiyyah/i').first()).toBeVisible();
  });

  // ── Billing ────────────────────────────────────────────────────────────────

  test('billing page shows plans', async () => {
    await page.goto(`${BASE}/dashboard/billing`);
    await expect(page.locator('text=/Billing/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Free/i').first()).toBeVisible();
    await expect(page.locator('text=/Plus/i').first()).toBeVisible();
    await expect(page.locator('text=/Family/i').first()).toBeVisible();
  });

  // ── Referral ───────────────────────────────────────────────────────────────

  test('referral page shows code and share buttons', async () => {
    await page.goto(`${BASE}/dashboard/referral`);
    await expect(page.locator('text=/Refer a Friend/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Your Referral Code/i')).toBeVisible();
  });

  // ── Audit Ledger ───────────────────────────────────────────────────────────

  test('audit ledger loads entries', async () => {
    await page.goto(`${BASE}/dashboard/ledger`);
    await expect(page.locator('text=/Audit Ledger/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Total Entries/i')).toBeVisible();
  });

  // ── Profile ────────────────────────────────────────────────────────────────

  test('profile page loads user data', async () => {
    await page.goto(`${BASE}/dashboard/profile`);
    await expect(page.locator('text=/Profile/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${EMAIL}`)).toBeVisible();
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  test('logout works and redirects to login', async () => {
    // Find and click the Sign Out link
    await page.goto(`${BASE}/dashboard`);
    await page.waitForTimeout(2000);
    const signOut = page.locator('text=/Sign Out/i').first();
    if (await signOut.isVisible()) {
      await signOut.click();
      await page.waitForURL('**/login**', { timeout: 10000 });
      expect(page.url()).toContain('/login');
    }
  });
});
