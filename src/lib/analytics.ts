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

/** Track when user views billing/upgrade page */
export function trackViewBilling(currentPlan: string) {
  trackEvent('begin_checkout', {
    currency: 'USD',
    items: [{ item_name: `Upgrade from ${currentPlan}` }],
  });
}

/** Track plan upgrade (purchase event for GA4 revenue tracking) */
export function trackUpgrade(plan: string, billingCycle: 'monthly' | 'yearly', value: number) {
  trackEvent('purchase', {
    currency: 'USD',
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

/** Track zakat calculation */
export function trackZakatCalculation(methodology: string, madhab: string) {
  trackEvent('zakat_calculated', { methodology, madhab });
}

/** Track referral share */
export function trackReferralShare(method: string) {
  trackEvent('share', { method, content_type: 'referral' });
}
