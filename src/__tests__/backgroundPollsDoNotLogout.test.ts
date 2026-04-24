import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

/**
 * Regression test for the 2026-04-22 session-bug fix.
 *
 * Background: Basiru reported getting force-logged-out repeatedly while
 * actively using the admin dashboard. Tracing showed NotificationBell was
 * polling `api.getUnreadNotifications()` every 2 minutes WITHOUT
 * suppressUnauthorized=true. Default for that flag was `false`, so a
 * single poll returning 401 (e.g. during a transient silent-refresh
 * race) would fire `onUnauthorizedCallback` and bounce the user to
 * /login?reason=expired.
 *
 * The fix flipped the default on both `getNotifications` and
 * `getUnreadNotifications` to `suppressUnauthorized = true`. These
 * tests verify the default — a caller that doesn't pass the flag
 * must NOT cause a logout on a 401. The real session check happens
 * on the next user-initiated action (a save, a click, etc.).
 */

describe('background-poll API helpers do not force-logout on 401', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;
  let logoutSpy: ReturnType<typeof vi.fn<() => void>>;

  beforeEach(async () => {
    // Fresh module import so the in-module onUnauthorizedCallback state
    // doesn't leak between tests.
    vi.resetModules();

    // Mock global fetch to always return 401 — simulates the failure mode
    // that used to trigger logout on every poll.
    fetchSpy = vi.fn(async (url: string) => {
      // /auth/refresh gets a 401 too so silent-refresh can't recover.
      // That's the exact pre-fix behaviour that was logging Basiru out.
      if (url.includes('/auth/refresh')) {
        return new Response('{}', {
          status: 401,
          headers: { 'content-type': 'application/json' },
        });
      }
      if (url.includes('/auth/profile')) {
        // verifySessionStillValid's probe — 401 means "session is gone".
        return new Response('{}', {
          status: 401,
          headers: { 'content-type': 'application/json' },
        });
      }
      return new Response('{}', {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    });
    // @ts-expect-error — overriding fetch for test
    global.fetch = fetchSpy;

    // Spy on the unauthorized callback. If a background poll is still
    // misbehaving, THIS is what fires and forces the logout.
    logoutSpy = vi.fn<() => void>();

    const api = await import('../lib/api');
    api.setUnauthorizedHandler(logoutSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getUnreadNotifications default-suppressed — no global logout on 401', async () => {
    const { api } = await import('../lib/api');

    // Default call, no explicit flag — mimics NotificationBell's polling.
    await expect(api.getUnreadNotifications()).rejects.toThrow(
      // Any error is fine; we care that the logout callback wasn't called.
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it('getNotifications default-suppressed — no global logout on 401', async () => {
    const { api } = await import('../lib/api');

    await expect(api.getNotifications()).rejects.toThrow(
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it('lifecycleHeartbeat — no global logout on 401 (already suppressed)', async () => {
    const { api } = await import('../lib/api');

    await expect(
      api.lifecycleHeartbeat({
        platform: 'web',
        appVersion: 'test',
        timeZone: 'UTC',
        route: '/dashboard/admin',
      }),
    ).rejects.toThrow(/session has expired|API error|Network|connection/);

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it('admin endpoints (suppressed by default) — no global logout on 401', async () => {
    const { api } = await import('../lib/api');

    await expect(api.getAdminOverview()).rejects.toThrow(
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  // R12 hardening follow-ups (2026-04-22). Two callers that fire on
  // [user] mount / analytics user-action — same "must not force logout
  // on a transient 401" requirement as the original NotificationBell
  // fix. Pins the contract so a future audit doesn't flip either
  // back to suppressUnauthorized=false and silently re-introduce
  // the bug from the other direction.

  it('subscriptionStatus — no global logout on 401 (background mount)', async () => {
    const { api } = await import('../lib/api');

    await expect(api.subscriptionStatus()).rejects.toThrow(
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it('lifecycleTrackEvent — no global logout on 401 (fire-and-forget analytics)', async () => {
    const { api } = await import('../lib/api');

    await expect(
      api.lifecycleTrackEvent('transactions_reviewed', { count: 5 }),
    ).rejects.toThrow(/session has expired|API error|Network|connection/);

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  // R12 hotfix (2026-04-23) regression — plaidGetAccounts fires on
  // mount from SyncBanksButton on /dashboard/assets AND
  // /dashboard/transactions (high-traffic pages). Default had been
  // suppressUnauthorized=false, which re-opened the exact bug class
  // the NotificationBell fix closed: a transient 401 on a background
  // mount-time fetch cascading through the global refresh + verify
  // loop and force-logging-out the user. Pins the contract so the
  // default can't be silently flipped back to false.
  it('plaidGetAccounts — no global logout on 401 (mount-time in SyncBanksButton)', async () => {
    const { api } = await import('../lib/api');

    await expect(api.plaidGetAccounts()).rejects.toThrow(
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  // R13 hardening (2026-04-23) — getReferralCode fires on mount from
  // ReferralPromptModal (dashboard), ShareReceiptButton (every receipt +
  // PDF download), /dashboard/referral, and /dashboard/billing. It was
  // the last unsuppressed mount-fired API in the session-logout audit.
  // Default was suppressUnauthorized=false, which reopened the same bug
  // class as notifications / plaid / subscription-status: transient 401 →
  // global logout → /login?reason=expired mid-session. Pins the contract.
  it('getReferralCode — no global logout on 401 (mount-time in modal / button / pages)', async () => {
    const { api } = await import('../lib/api');

    await expect(api.getReferralCode()).rejects.toThrow(
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  // R13 hardening (2026-04-23) — getTransactionUsage fires on mount from
  // TransactionUsageMeter, which is rendered on free-user surfaces
  // (dashboard, transactions, receipts). The same bug class — a
  // transient 401 during a mount probe would cascade through the
  // silent-refresh loop into a forced /login?reason=expired. Pins the
  // default so the meter stays a non-critical background read.
  it('getTransactionUsage — no global logout on 401 (mount-time in TransactionUsageMeter)', async () => {
    const { api } = await import('../lib/api');

    await expect(api.getTransactionUsage()).rejects.toThrow(
      /session has expired|API error|Network|connection/,
    );

    expect(logoutSpy).not.toHaveBeenCalled();
  });
});
