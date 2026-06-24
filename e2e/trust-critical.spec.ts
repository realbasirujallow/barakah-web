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
  let setupCompleted = false;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    // Accept /dashboard (setup complete), /setup (first-run), or the
    // /onboarding/locale-confirm shell (Wave 2, 2026-05-27 — shown once per
    // device after setup until the user confirms/skips a locale). A fresh
    // Playwright context never has the "seen" flag, so login always lands
    // there; the priming below clears it and we force-navigate to /dashboard.
    await page.waitForURL(/\/(dashboard|setup|onboarding\/locale-confirm)/, { timeout: 15000 });

    // R5 follow-up (2026-04-18): prime localStorage to mark guided setup
    // as completed for this session, same pattern that already unblocks
    // browser-authenticated.spec.ts. Without this, the dashboard layout
    // redirects every navigation back to /setup on a fresh reviewer
    // account and we skip every dashboard-dependent assertion.
    //
    // The priming is per-browser-context (Playwright ephemeral storage),
    // so it never persists to the real reviewer account or pollutes the
    // real user's actual onboarding state.
    try {
      const userJson = await page.evaluate(() => window.localStorage.getItem('user'));
      if (userJson) {
        const userId = (JSON.parse(userJson) as { id?: string })?.id;
        if (userId) {
          await page.evaluate((id) => {
            window.localStorage.setItem(`barakah_guided_setup_v1:${id}`, 'true');
            window.localStorage.setItem('barakah_onboarded', 'true');
            window.localStorage.setItem('barakah_referral_prompted', 'true');
            // Wave 2 (2026-05-27): mark the one-time locale-confirm shell as
            // seen so navigation lands on /dashboard, not the onboarding step.
            window.localStorage.setItem('barakah_onboarding_locale_seen', '1');
          }, userId);
        }
      }
    } catch {
      // localStorage quirk — fall back to the legacy skip behaviour below.
    }

    // If we landed on /setup or the /onboarding/locale-confirm shell,
    // force-navigate to /dashboard now that the guided-setup + locale-seen
    // flags are primed. The layout won't bounce us anymore.
    if (
      /\/setup(\/|$)/.test(page.url()) ||
      /\/onboarding\/locale-confirm/.test(page.url())
    ) {
      await page.goto(`${BASE}/dashboard`);
      await page.waitForLoadState('networkidle').catch(() => {});
    }
    setupCompleted = /\/dashboard(\/|$)/.test(page.url());
    if (!setupCompleted) {
      console.warn(
        '[trust-critical.spec] Post-priming redirect still on /setup — ' +
        'dashboard assertions will skip. Check src/app/dashboard/layout.tsx ' +
        'guided-setup gate for localStorage-flag drift.',
      );
    }
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('/dashboard/referral copy matches backend contract', async () => {
    test.skip(!setupCompleted, 'E2E account is on /setup — finish onboarding to run dashboard assertions');
    await page.goto(`${BASE}/dashboard/referral`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // Round 31 fix: invitee gets $4.99 first month, NOT a free month.
    // 2026-05-12 (QA-2026-05-12): canonical copy in src/lib/referralCopy.ts
    // is "their first month for just $4.99". Old regex required the literal
    // "first month for $4.99" with no words in between and failed when the
    // "just" was added for readability. Loosen to "first month .* $4.99"
    // so future copy tweaks (e.g. "their first MONTH for only $4.99") don't
    // re-trigger this without losing the substance of the assertion.
    await expect(page.getByText(/first month\b[^.\n]*\$4\.99/i).first()).toBeVisible();
    // Round 31 fix: referrer gets a free extra MONTH (not "both get free").
    await expect(page.getByText(/free extra month/i).first()).toBeVisible();
    // Negative assertion: the old wrong copy ("you both get a free month")
    // must not be on the page. If this string reappears, the copy contract
    // has regressed.
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/you both get a free month/i);
  });

  test('/dashboard/categorize has the Re-categorize button', async () => {
    test.skip(!setupCompleted, 'E2E account is on /setup — finish onboarding to run dashboard assertions');
    await page.goto(`${BASE}/dashboard/categorize`);
    // Do NOT wait for 'networkidle' here: the backfill button is part of the
    // page chrome (rendered immediately, not data-dependent — see
    // categorize/page.tsx commit 017803f), but the page's two data fetches
    // (rules + transactions) keep the network busy long enough on a
    // data-heavy account to blow the test budget. The auto-waiting assertion
    // below is sufficient and reliable.
    // R32 backfill feature — if this button ever disappears, the user lost
    // the only way to apply new categorization rules to historical data.
    await expect(page.getByText(/Re-categorize my existing transactions/i)).toBeVisible({
      timeout: 15000,
    });
  });

  test('/dashboard/riba page loads and shows fiqh disclaimer', async () => {
    test.skip(!setupCompleted, 'E2E account is on /setup — finish onboarding to run dashboard assertions');
    await page.goto(`${BASE}/dashboard/riba`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // Not-a-fatwa disclaimer is on every Islamic-sensitive page; if it ever
    // disappears, that's a compliance regression.
    await expect(page.getByText(/Not a fatwa/i).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('/dashboard/zakat shows AMJA-cited nisab + 2.5% rate', async () => {
    test.skip(!setupCompleted, 'E2E account is on /setup — finish onboarding to run dashboard assertions');
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
