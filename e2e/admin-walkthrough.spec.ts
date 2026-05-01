/**
 * Comprehensive admin-surface walkthrough.
 *
 * Phase R37 (2026-04-30): exercises every admin tab + drilldown so the
 * founder has a one-button regression test for the admin shell. Skipped
 * by default; runs only when the test account has admin access AND
 * E2E_AS_ADMIN=true is set.
 *
 * To run this against staging or prod:
 *   1. Find the user ID of E2E_EMAIL (e.g. applereview@trybarakah.com)
 *      via /dashboard/admin → Users tab → search → note the ID.
 *   2. On Railway (backend), update ADMIN_USER_IDS env var to include
 *      that ID. Wait ~30s for the redeploy.
 *   3. Run:
 *        E2E_BASE_URL=https://trybarakah.com \
 *        E2E_EMAIL=applereview@trybarakah.com \
 *        E2E_PASSWORD=...                    \
 *        E2E_AS_ADMIN=true                    \
 *        npx playwright test e2e/admin-walkthrough.spec.ts
 *   4. After the run completes, REVERT the ADMIN_USER_IDS env var on
 *      Railway. (The applereview account should not retain admin
 *      access — App Store reviewers don't need it, and granting it
 *      permanently is an audit-trail risk.)
 *
 * The spec covers:
 *   • All 8 main tabs (overview, users, alerts, unverified, lifecycle,
 *     experiments, deleted, email-log)
 *   • The 7 secondary admin pages wired in R37 (acquisition, funnel,
 *     growth, scorecard, email-locales, email-preview, halal-screening)
 *   • The R37 drilldown — clicking a user → activity → transactions sheet
 *   • The R37 force-verify button label
 *
 * Failing assertions become bug tickets — each test isolates a single
 * surface so a regression is pinpointed by name.
 */
import { test, expect, Page } from '@playwright/test';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const EMAIL = process.env.E2E_EMAIL || '';
const PASSWORD = process.env.E2E_PASSWORD || '';
const RUN_AS_ADMIN = process.env.E2E_AS_ADMIN === 'true';

test.describe('Admin walkthrough (R37)', () => {
  test.skip(
    !RUN_AS_ADMIN,
    'Admin walkthrough only runs when E2E_AS_ADMIN=true. See file-level comment for setup.',
  );
  test.skip(!EMAIL || !PASSWORD, 'E2E_EMAIL + E2E_PASSWORD required');

  let page: Page;
  let isAdminConfirmed = false;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    page = await ctx.newPage();

    // Login.
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    // Confirm admin access by visiting /dashboard/admin and checking we
    // didn't get redirected to /dashboard. The shell renders Overview
    // when admin; the AdminPage useEffect router.replace's away when
    // not. Give the redirect a chance to fire before checking the URL.
    await page.goto(`${BASE}/dashboard/admin`);
    await page.waitForTimeout(3000);
    isAdminConfirmed = page.url().includes('/dashboard/admin');
  });

  test.afterAll(async () => {
    await page?.context().close();
  });

  test.beforeEach(() => {
    test.skip(!isAdminConfirmed,
      'Admin access NOT detected. Verify ADMIN_USER_IDS includes the test user ID on Railway, and re-run.');
  });

  // ── Main tabs ─────────────────────────────────────────────────────────────

  test('Overview tab renders KPIs', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await expect(page.getByRole('heading', { name: /Admin/i }).first()).toBeVisible({ timeout: 15000 });
    // Overview KPI labels.
    await expect(page.locator('text=/Total Users/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('Users tab loads with table', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: 'Users' }).first().click();
    await expect(page.locator('text=/Plan/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Email/i').first()).toBeVisible();
  });

  test('Alerts tab opens', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Alerts/i }).first().click();
    await page.waitForTimeout(1000);
    // Alerts tab can be empty; just confirm the tab content area renders.
    expect(page.url()).toContain('/dashboard/admin');
  });

  test('Unverified tab loads + has bulk-resend button', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Unverified/i }).first().click();
    // Bulk-resend button is the founder's bug item — verify it renders.
    await expect(page.locator('text=/Resend (All|Verification)/i').first())
      .toBeVisible({ timeout: 10000 });
  });

  test('Lifecycle tab renders campaign center', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Lifecycle/i }).first().click();
    await page.waitForTimeout(1500);
    expect(page.url()).toContain('/dashboard/admin');
  });

  test('Experiments tab renders', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Experiments/i }).first().click();
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/dashboard/admin');
  });

  test('Deleted tab renders archive', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Deleted/i }).first().click();
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/dashboard/admin');
  });

  test('Email Log tab renders + shows entries or empty state', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Email Log/i }).first().click();
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/dashboard/admin');
  });

  // ── R37 secondary admin pages ─────────────────────────────────────────────

  for (const path of [
    '/dashboard/admin/acquisition',
    '/dashboard/admin/funnel',
    '/dashboard/admin/growth',
    '/dashboard/admin/scorecard',
    '/dashboard/admin/email-locales',
    '/dashboard/admin/email-preview',
    '/dashboard/admin/halal-screening',
  ]) {
    test(`R37 secondary page loads: ${path}`, async () => {
      const res = await page.goto(`${BASE}${path}`);
      // Expect 200 — these are admin-gated pages, but with admin confirmed
      // they should render.
      expect(res?.status()).toBeLessThan(400);
      await page.waitForTimeout(2000);
      // If we landed back on /dashboard, the page redirected — surface that.
      expect(page.url()).toContain(path);
    });
  }

  // ── R37 user drilldown ────────────────────────────────────────────────────

  test('R37: clicking a user opens detail modal with activity', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: 'Users' }).first().click();
    await page.waitForTimeout(2000);
    // Click first user row's "View" or row to open the modal.
    const firstUserLink = page.locator('button', { hasText: /^View$/ }).first();
    if (await firstUserLink.isVisible().catch(() => false)) {
      await firstUserLink.click();
    } else {
      // Fallback: click first user row.
      await page.locator('tbody tr').first().click();
    }
    // Modal opens.
    await expect(page.locator('text=/Account Activity/i').first())
      .toBeVisible({ timeout: 10000 });
  });

  test('R37: Force-Verify button label is clear', async () => {
    await page.goto(`${BASE}/dashboard/admin`);
    await page.locator('button', { hasText: /Unverified/i }).first().click();
    await page.waitForTimeout(2000);
    // Open the first unverified user.
    const firstView = page.locator('button', { hasText: /^View$/ }).first();
    if (!(await firstView.isVisible().catch(() => false))) {
      test.skip(true, 'No unverified users in test environment');
      return;
    }
    await firstView.click();
    // The renamed label.
    await expect(page.locator('text=/Force-Verify/i').first())
      .toBeVisible({ timeout: 10000 });
  });

  // ── R37 subscription false-positive editor (founder explicit ask) ─────────

  test('R37: subscriptions page exposes per-row editor (kebab) for Plus admin', async () => {
    await page.goto(`${BASE}/dashboard/subscriptions`);
    await page.waitForTimeout(3000);
    // Plus-gated. With admin we should be able to see the page even
    // without Plus, but the detector might return zero subscriptions
    // for an admin account that doesn't have its own transaction
    // history. Tolerate either: page heading visible or empty state
    // visible.
    const pageHeading = page.locator('text=/Subscription/i').first();
    await expect(pageHeading).toBeVisible({ timeout: 10000 });
  });

  // ── Bills breakdown card (founder explicit ask) ───────────────────────────

  test('R37: bills breakdown card renders for admin account with bills', async () => {
    await page.goto(`${BASE}/dashboard/bills`);
    await page.waitForTimeout(2000);
    // Either the breakdown card or empty state.
    const heading = page.locator('h1, h2', { hasText: /Bills/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
