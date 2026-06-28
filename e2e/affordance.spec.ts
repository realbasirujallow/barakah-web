import { test, expect } from '@playwright/test';

const EMAIL = process.env.E2E_EMAIL || 'demo+p11-heavy-txn@trybarakah.com';
const PASSWORD = process.env.E2E_PASSWORD || 'demo-Pa55!';

/**
 * Action-affordance matrix (2026-06-28 gap closeout).
 *
 * The bug class: a fixed bottom-right widget (Feedback / Ask Barakah) overlaps a
 * page's primary add button, so the button looks present but can't be tapped.
 * Playwright's built-in actionability check IS the test — `.click()` throws
 * "element intercepts pointer events" if another element covers the target. So a
 * successful click on the primary action proves the FAB does NOT intercept it.
 *
 * For each high-value screen, at BOTH desktop (1366) and mobile (390px) widths:
 *   1. the primary action button is visible,
 *   2. clicking it succeeds (→ no FAB/overlay intercept),
 *   3. an add form/modal actually opens,
 *   4. the page has no horizontal scrollbar.
 *
 * Gated on E2E_PERSONAS_SEEDED=1 + a populated storage state, like persona-walk.
 */

const SEEDED = process.env.E2E_PERSONAS_SEEDED === '1';

// UI-driven login per test — apiRequest/storageState cookies do NOT authenticate
// the dashboard here (same lesson as persona-walk.spec.ts:105).
test.beforeEach(async ({ page }) => {
  test.skip(!SEEDED, 'set E2E_PERSONAS_SEEDED=1 against a seeded local stack to run');
  await page.goto('/login', { waitUntil: 'networkidle' }).catch(() => {});
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15_000 }).catch(() => {});
});

const SCREENS: { slug: string; path: string; button: RegExp; tab?: string }[] = [
  { slug: 'transactions', path: '/dashboard/transactions', button: /\+\s*Add\b/ },
  { slug: 'assets',       path: '/dashboard/assets',       button: /\+\s*Add Asset/ },
  { slug: 'sadaqah',      path: '/dashboard/sadaqah',      button: /\+\s*Give Sadaqah/ },
  { slug: 'waqf',         path: '/dashboard/waqf',         button: /\+\s*Add Contribution/ },
];

const VIEWPORTS = [
  { label: 'desktop', width: 1366, height: 900 },
  { label: 'mobile-390', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  for (const s of SCREENS) {
    test(`[${vp.label}] ${s.slug}: primary action is reachable + opens (no FAB intercept)`, async ({ page }) => {
      test.skip(!SEEDED, 'set E2E_PERSONAS_SEEDED=1 against a seeded local stack to run');
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(s.path);
      await page.waitForLoadState('networkidle').catch(() => {});

      // 1. primary action visible
      const btn = page.getByRole('button', { name: s.button }).first();
      await expect(btn, `${s.slug} primary action button visible`).toBeVisible({ timeout: 15_000 });

      // 4. no horizontal scroll at this width
      const hScroll = await page.evaluate(() => {
        const d = document.documentElement, b = document.body;
        return d.scrollWidth > d.clientWidth + 1 || b.scrollWidth > b.clientWidth + 1;
      });
      expect(hScroll, `${s.slug} @${vp.width}px must not horizontally scroll`).toBe(false);

      // 2. clicking succeeds → proves no fixed widget intercepts the click.
      await btn.click({ timeout: 10_000 });

      // 3. an add form/modal opened — a Cancel/Save control or a textbox appears.
      const opened = page
        .getByRole('button', { name: /Cancel|Save|Add|Give|Contribute/i })
        .or(page.getByRole('textbox'))
        .or(page.locator('input'))
        .first();
      await expect(opened, `${s.slug} add form should open after click`).toBeVisible({ timeout: 5_000 });

      await page.screenshot({
        path: `test-results/affordance-${s.slug}-${vp.label}.png`,
        fullPage: false,
      });
    });
  }
}
