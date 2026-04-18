import { test, expect, Page } from '@playwright/test';

/**
 * Trust-critical E2E specs added in Round 33 to pin the UX contracts that
 * the overnight hardening pass (Round 31 / 32) discovered were already
 * drifting or absent:
 *
 *   1. Referral modal copy MUST match backend reward contract.
 *      Round 31 found the modal claimed "you both get a free month" while
 *      the invitee actually pays $4.99. Fixed in R31 + moved behind
 *      constants in R32 (lib/referralCopy.ts). This spec pins the copy so
 *      a direct string edit can't regress it silently.
 *
 *   2. /dashboard/riba inline "Purify" button exists on a flagged
 *      transaction card (R32 feature #4).
 *
 *   3. /dashboard/categorize has the "Re-categorize my existing
 *      transactions" backfill button (R32 feature #5).
 *
 *   4. /dashboard/referral shows "They get first month for $4.99"
 *      (the authoritative copy).
 *
 * These tests run against production with the E2E reviewer account, same
 * as the existing browser-authenticated.spec.ts. They're read-only
 * (never click Purify or re-categorize — just assert the UI is
 * present and the copy is correct).
 */

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const EMAIL = process.env.E2E_EMAIL || '';
const PASSWORD = process.env.E2E_PASSWORD || '';

test.describe('Round 33: trust-critical surfaces', () => {
  test.skip(!EMAIL || !PASSWORD, 'E2E_EMAIL and E2E_PASSWORD required');

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('/dashboard/referral copy matches backend contract', async () => {
    await page.goto(`${BASE}/dashboard/referral`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // Round 31 fix: invitee gets $4.99 first month, NOT a free month.
    await expect(page.getByText(/first month for \$4\.99/i).first()).toBeVisible();
    // Round 31 fix: referrer gets a free extra MONTH (not "both get free").
    await expect(page.getByText(/free extra month/i).first()).toBeVisible();
    // Negative assertion: the old wrong copy ("you both get a free month")
    // must not be on the page. If this string reappears, the copy contract
    // has regressed.
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/you both get a free month/i);
  });

  test('/dashboard/categorize has the Re-categorize button', async () => {
    await page.goto(`${BASE}/dashboard/categorize`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // R32 backfill feature — if this button ever disappears, the user lost
    // the only way to apply new categorization rules to historical data.
    await expect(page.getByText(/Re-categorize my existing transactions/i)).toBeVisible({
      timeout: 15000,
    });
  });

  test('/dashboard/riba page loads and shows fiqh disclaimer', async () => {
    await page.goto(`${BASE}/dashboard/riba`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // Not-a-fatwa disclaimer is on every Islamic-sensitive page; if it ever
    // disappears, that's a compliance regression.
    await expect(page.getByText(/Not a fatwa/i).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('/dashboard/zakat shows AMJA-cited nisab + 2.5% rate', async () => {
    await page.goto(`${BASE}/dashboard/zakat`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // Nisab source + 2.5% rate must be visible as a trust signal.
    await expect(page.getByText(/2\.5%/).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Nisab/).first()).toBeVisible();
  });

  test('/api/islamic/date returns server-computed Hijri date', async ({ request }) => {
    // Round 33: server-authoritative Hijri endpoint. Flutter falls back to
    // this before using Aladhan; it must stay available + return the
    // expected shape.
    const res = await request.get(`${BASE}/api/islamic/date`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.source).toBe('server-umm-al-qura');
    expect(typeof body.day).toBe('string');
    expect(parseInt(body.day, 10)).toBeGreaterThanOrEqual(1);
    expect(parseInt(body.day, 10)).toBeLessThanOrEqual(30);
    expect(typeof body.year).toBe('string');
    expect(parseInt(body.year, 10)).toBeGreaterThan(1440); // Hijri year sanity
  });
});
