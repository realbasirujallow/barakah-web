/**
 * Validates that a URL points to a legitimate Stripe domain over HTTPS.
 * Prevents open-redirect attacks via malicious API responses.
 */
export function validateStripeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:') return false;
    const hostname = urlObj.hostname;
    return hostname === 'stripe.com' || hostname === 'checkout.stripe.com' || hostname.endsWith('.stripe.com');
  } catch {
    return false;
  }
}
