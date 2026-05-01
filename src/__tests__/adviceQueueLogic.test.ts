import { describe, expect, it } from 'vitest';
import { __testables__ } from '../components/dashboard/AdviceQueue';

const { buildAdvice } = __testables__;

/**
 * R45 (2026-05-01) — guard rails on the dashboard advice queue's
 * priority logic. The component itself wraps these results in a
 * UI shell, but the BUSINESS rules (which advice fires for what
 * data shape, in what order) are what we want to lock down — they
 * directly affect what the user sees as "the most important next
 * thing" on every dashboard load.
 *
 * Each test pins a specific scenario the founder cares about:
 *   1. Clean-state account → empty queue (no cards, no clutter).
 *   2. Hawl-due is the first card when zakat is overdue (Islamic
 *      finance is the product's core; this can't get bumped by
 *      "review your transactions" ever).
 *   3. Brand-new account (no Plaid, no transactions) gets the
 *      "connect bank" suggestion but NOT the auto-categorize one
 *      (which only surfaces past 50 transactions).
 *   4. Spending-spike fires only when last month had ≥$50 of
 *      spending — under that, % deltas explode and the advice is
 *      actively misleading. Mirrors the dashboard's $50 floor on
 *      the spending widget MoM badge.
 *
 * If any of these break, please don't "fix" the test — talk to
 * the founder first about whether the priority order really
 * should change.
 */
describe('AdviceQueue.buildAdvice', () => {
  // "Calm" = no warnings, no info-level signals, but the account
  // has enough transactions that auto-categorize is a legitimate
  // suggestion. We still expect the queue to be small (1 card) and
  // contain ONLY suggestion-tier advice, never warnings.
  const calmProps = {
    reviewQueueCount: 0,
    overdueBillsCount: 0,
    upcomingBillsCount: 0,
    hawlDueNowCount: 0,
    hasLinkedAccount: true,
    budgetCount: 3,
    transactionCount: 200,
    spendingChangePercent: 0,
    spendingLastMonth: 1500,
  };

  // "Truly empty" = a small, mostly-set-up account where there's
  // really nothing to suggest. Used to assert the queue can in
  // fact be empty.
  const trulyEmptyProps = {
    reviewQueueCount: 0,
    overdueBillsCount: 0,
    upcomingBillsCount: 0,
    hawlDueNowCount: 0,
    hasLinkedAccount: true,
    budgetCount: 3,
    transactionCount: 5,
    spendingChangePercent: 0,
    spendingLastMonth: 1500,
  };

  it('returns empty queue when there is nothing to advise about', () => {
    expect(buildAdvice(trulyEmptyProps)).toEqual([]);
  });

  it('returns ONLY suggestion-tier advice when there are no warnings or info signals', () => {
    const advice = buildAdvice(calmProps);
    expect(advice.length).toBeGreaterThan(0);
    expect(advice.every(a => a.severity === 'suggestion')).toBe(true);
  });

  it('puts hawl-due first when zakat is overdue', () => {
    const advice = buildAdvice({ ...calmProps, hawlDueNowCount: 2, reviewQueueCount: 5 });
    expect(advice[0].id).toBe('hawl-due');
    // Sanity: the review-queue advice still appears, just below hawl.
    expect(advice.map(a => a.id)).toContain('needs-review');
  });

  it('shows connect-bank for a fresh account but NOT auto-categorize', () => {
    const advice = buildAdvice({
      ...calmProps,
      hasLinkedAccount: false,
      transactionCount: 0,
    });
    const ids = advice.map(a => a.id);
    expect(ids).toContain('connect-bank');
    expect(ids).not.toContain('auto-categorize');
  });

  it('does NOT fire spending-spike when last month was under $50 (avoids misleading huge percentages)', () => {
    const advice = buildAdvice({
      ...calmProps,
      spendingLastMonth: 12,           // tiny base
      spendingChangePercent: 999,      // huge spike on a tiny base
    });
    expect(advice.map(a => a.id)).not.toContain('spending-spike');
  });

  it('fires spending-spike when last month was ≥$50 and change > 25%', () => {
    const advice = buildAdvice({
      ...calmProps,
      spendingLastMonth: 800,
      spendingChangePercent: 35,
    });
    expect(advice.map(a => a.id)).toContain('spending-spike');
  });

  it('suppresses upcoming-bills nudge when overdue bills are already surfaced (avoids double-asking for attention)', () => {
    const advice = buildAdvice({
      ...calmProps,
      overdueBillsCount: 2,
      upcomingBillsCount: 3,
    });
    const ids = advice.map(a => a.id);
    expect(ids).toContain('overdue-bills');
    expect(ids).not.toContain('upcoming-bills');
  });
});
