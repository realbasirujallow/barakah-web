import { test, expect } from '@playwright/test';

/**
 * Signup → email verification (skipped in dev) → login → first-session E2E.
 *
 * This test is the regression guard for the 2026-05-02 incident where
 * /auth/signup returned 500 `UnexpectedRollbackException` because
 * TrafficAnalyticsService.maybeRecordLifecycleConversion ran in the
 * caller's transaction and a JdbcTemplate failure marked the parent
 * tx rollback-only. The fix (REQUIRES_NEW propagation) is pinned by
 * a backend unit test, but a full HTTP-flow assertion catches any
 * future cause that breaks the same surface.
 *
 * Skipped if `E2E_API_URL` does not expose `app.skip-email-verification=true`
 * — i.e., we're hitting prod or staging, where verification email is
 * required and we can't auto-resolve in a test. Locally with the
 * `local` Spring profile the user is auto-verified at signup, so a
 * follow-up POST /auth/login completes the loop.
 */

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const SKIP_VERIFICATION =
  // Default: when running against localhost we assume the local Spring
  // profile is in use (which sets app.skip-email-verification=true). When
  // pointing at any other host, the test self-skips because we can't
  // reliably click a magic link in a headless test.
  BASE.includes('localhost') ||
  BASE.includes('127.0.0.1');

test.describe('Signup end-to-end (regression for 2026-05-02 signup-500)', () => {
  test.skip(!SKIP_VERIFICATION, 'Requires app.skip-email-verification=true (local profile)');

  // Per-test unique email so re-runs in the same DB don't conflict.
  let email: string;

  test.beforeEach(() => {
    const stamp = Date.now().toString(36);
    email = `e2e-signup-${stamp}@trybarakah.local`;
  });

  test('signup, login, and dashboard all succeed end-to-end', async ({ page }) => {
    // Step 1: signup form fills + submits cleanly with no 500.
    await page.goto('/signup');

    await page.fill('#signup-name', 'E2E Signup User');
    await page.fill('#signup-email', email);
    await page.fill('#signup-password', 'TestPass123!');
    await page.fill('#signup-confirm-password', 'TestPass123!');
    await page.fill('#signup-phone', '+15555551234');

    // Submit and assert the response is NOT a 500. We watch the network
    // call directly because a server 500 is the most precise signal.
    const signupResp = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/auth/signup'), { timeout: 15_000 }),
      page.click('button[type="submit"]'),
    ]).then(([resp]) => resp);

    // The classic regression signal: rollback-only 500.
    expect(signupResp.status(), 'POST /auth/signup must NOT 500').not.toBe(500);
    // Should be 201 (new user) on local; 200/201 either is acceptable.
    expect(signupResp.status()).toBeLessThan(400);

    // The page should advance to the success state. Newer builds may send
    // fresh users to /setup before /dashboard; older builds may keep the
    // success confirmation on /signup. The regression being pinned here is
    // the server-side signup/login path, not the chosen activation route.
    await page.waitForURL(/(\/setup|\/dashboard|\/signup)/, { timeout: 10_000 });

    // Step 2: log in with the freshly-created credentials.
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'TestPass123!');

    const loginResp = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/auth/login'), { timeout: 15_000 }),
      page.click('button[type="submit"]'),
    ]).then(([resp]) => resp);

    expect(loginResp.status(), 'POST /auth/login must succeed').toBeLessThan(400);

    // Step 3: the first-session surface renders. Fresh accounts are expected
    // to land on /setup; already-onboarded accounts land on /dashboard. In
    // either case, the user must not be kicked back to /login.
    await page.waitForURL(/\/(setup|dashboard)/, { timeout: 15_000 });
    expect(page.url(), 'After login, must land on /setup or /dashboard').toMatch(/\/(setup|dashboard)/);
  });
});
