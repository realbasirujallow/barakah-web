/**
 * Google Analytics 4 event tracking for Barakah.
 *
 * Tracks key conversion events:
 *   - sign_up: new account created
 *   - login: user signed in
 *   - begin_checkout: user views billing/upgrade page
 *   - purchase: user upgrades to Plus or Family
 *   - page_view: (automatic via gtag config)
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('sign_up', { method: 'email' });
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send a GA4 event. No-op if gtag isn't loaded. */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/** Track successful signup */
export function trackSignUp(method = 'email') {
  trackEvent('sign_up', { method });
}

/** Track successful login */
export function trackLogin(method = 'email') {
  trackEvent('login', { method });
}

/** Track plan upgrade (purchase event for GA4 revenue tracking).
 *
 *  HIGH BUG FIX (H-7): currency was hardcoded to 'USD'. Callers that already
 *  know the Stripe-billed currency (from subscription metadata or checkout
 *  session) should pass it so GA4 revenue reports aren't skewed for non-USD
 *  subscriptions. Defaults to 'USD' for backwards compatibility with
 *  existing call sites that don't yet plumb the currency through.
 */
export function trackUpgrade(
  plan: string,
  billingCycle: 'monthly' | 'yearly',
  value: number,
  currency = 'USD',
) {
  trackEvent('purchase', {
    currency,
    value,
    transaction_id: `upgrade_${plan}_${Date.now()}`,
    items: [{
      item_name: `Barakah ${plan}`,
      item_category: billingCycle,
      price: value,
      quantity: 1,
    }],
  });
}

/** Track feature usage (for engagement analysis) */
export function trackFeatureUse(feature: string) {
  trackEvent('feature_use', { feature_name: feature });
}

/** Track referral share */
export function trackReferralShare(method: string) {
  trackEvent('share', { method, content_type: 'referral' });
}

// ── Funnel Events ────────────────────────────────────────────────────────
// These track the critical user journey:
//   visitor → signup → setup_complete → first_sync → first_zakat → weekly_return → paid

/** Track setup completion (3-step wizard finished) */
export function trackSetupComplete(plan: string) {
  trackEvent('setup_complete', { plan });
}

/** Track first bank account link via Plaid */
export function trackFirstAccountLink(institution: string) {
  trackEvent('first_account_link', { institution });
}

/** Track first zakat calculation */
export function trackFirstZakatCalc(amount: number, methodology: string) {
  trackEvent('first_zakat_calc', { amount, methodology });
}

/** Track demo data loaded (onboarding) */
export function trackDemoDataLoaded() {
  trackEvent('demo_data_loaded', {});
}

/** Track weekly return (called on dashboard load if user has been away > 5 days) */
export function trackWeeklyReturn(daysSinceLastVisit: number) {
  trackEvent('weekly_return', { days_since_last: daysSinceLastVisit });
}

/** Track trial started */
export function trackTrialStarted(plan: string, durationDays: number) {
  trackEvent('trial_started', { plan, duration_days: durationDays });
}

/** Track trial expired */
export function trackTrialExpired(plan: string) {
  trackEvent('trial_expired', { plan });
}

/** Track page-level feature engagement */
export function trackPageView(page: string) {
  trackEvent('page_view_custom', { page_name: page });
}

/** Track zakat payment recorded */
export function trackZakatPayment(amount: number, lunarYear: number) {
  trackEvent('zakat_payment', { amount, lunar_year: lunarYear });
}

/** Track Islamic obligation action (sadaqah, waqf, wasiyyah) */
export function trackIbadahAction(type: string, amount?: number) {
  trackEvent('ibadah_action', { type, amount });
}

// ── Conversion-funnel Events (complement backend lifecycle events) ───────
// These capture UI-side milestones the backend can't see:
//   - paywall_viewed: user landed on a page showing upgrade CTAs
//   - upgrade_started: user clicked an upgrade button (before Stripe redirect)
//   - setup_skipped: user bailed out of guided setup

/** Track paywall impression — user saw upgrade CTAs */
export function trackPaywallViewed(source: string) {
  trackEvent('paywall_viewed', { source });
}

/** Track upgrade click — user initiated checkout (may or may not complete) */
export function trackUpgradeStarted(
  plan: 'plus' | 'family',
  billingCycle: 'monthly' | 'yearly',
  source: string,
) {
  trackEvent('upgrade_started', { plan, billing_cycle: billingCycle, source });
}

/** Track setup skip — user opted out of guided setup */
export function trackSetupSkipped(step: string) {
  trackEvent('setup_skipped', { step });
}
