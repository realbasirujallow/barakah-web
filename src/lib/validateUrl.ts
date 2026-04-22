/**
 * Validates that a URL points to a legitimate Stripe domain over HTTPS.
 * Prevents open-redirect attacks via malicious API responses.
 *
 * R11 audit M-1 (2026-04-22): removed the `hostname.endsWith('.stripe.com')`
 * catch-all. That accepted any subdomain of stripe.com, including
 * hypothetical dangling/stale test subdomains that could become targets
 * of a subdomain-takeover attack at the CDN or DNS layer. We only ever
 * want to send users to `checkout.stripe.com` or `billing.stripe.com`
 * (the customer portal). Anything else is either a product we don't use
 * or a surprise — better to reject and surface the case during review.
 */
const STRIPE_HOST_ALLOWLIST = new Set<string>([
  'checkout.stripe.com',
  'billing.stripe.com',
]);

export function validateStripeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:') return false;
    return STRIPE_HOST_ALLOWLIST.has(urlObj.hostname);
  } catch {
    return false;
  }
}
