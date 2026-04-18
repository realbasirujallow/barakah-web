/**
 * Single source of truth for the user-facing referral reward copy.
 *
 * Round 32: every surface that advertises the referral program must import
 * from this file so the copy stays consistent with the backend contract.
 *
 * Backend contract (authoritative):
 *   - Referrer:  one free extra month of Barakah Plus applied AFTER the
 *                invitee verifies their email. See AuthController.verifyEmail
 *                + `planExpiresAt += 30d` logic and the
 *                `referral_reward_pending_for_userId` flag.
 *   - Invitee:   a $4.99 first-month coupon applied at Stripe Checkout via
 *                REFEREE_FIRST_MONTH_COUPON_ID / the $5-off coupon ID in
 *                StripeController. Regular monthly price is $9.99 — so
 *                invitee effectively saves 50% off month one, then renews
 *                at the standard rate.
 *
 * If the backend contract changes (price, reward type, timing), update
 * exactly these constants and every surface reflects the change. Drift
 * between ReferralPromptModal and /dashboard/referral (discovered in the
 * Round 31 overnight audit — modal said "you both get a free month" but
 * invitee actually pays $4.99) is impossible when both import from here.
 *
 * Constants are strings (not JSX) so they can be rendered verbatim or
 * embedded into richer layouts at the call site.
 */

/** The discounted price the invitee pays for their first month, formatted for display. */
export const REFEREE_FIRST_MONTH_PRICE = '$4.99';

/** The regular monthly price the invitee transitions to after month 1. */
export const REFEREE_REGULAR_PRICE = '$9.99';

/** What the referrer gets (phrase that can slot into surrounding copy). */
export const REFERRER_REWARD_PHRASE = 'a free extra month of Barakah Plus';

/** What the invitee gets (phrase that can slot into surrounding copy). */
export const REFEREE_REWARD_PHRASE = `their first month for just ${REFEREE_FIRST_MONTH_PRICE}`;

/**
 * Lead paragraph for the referral-prompt modal. Uses plain strings (no
 * markup) so consumers can wrap key phrases in <strong> as they see fit.
 * Changing this sentence is a trust-critical edit — ensure the backend
 * contract still matches.
 */
export const REFERRAL_MODAL_LEAD = {
  prefix: 'When a friend signs up with your link and verifies their email, ',
  referrerSegment: 'you',
  middle: ' get ' + REFERRER_REWARD_PHRASE + ' — and ',
  refereeSegment: 'they',
  suffix: ' get ' + REFEREE_REWARD_PHRASE + '.',
} as const;
