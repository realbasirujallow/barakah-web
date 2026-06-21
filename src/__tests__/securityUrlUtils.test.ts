import { beforeEach, describe, expect, it } from 'vitest';
import { isSafeInternalPath } from '../lib/safePath';
import { validateStripeUrl } from '../lib/validateUrl';
import { scrubTokenFromUrl, readTokenFromUrl } from '../lib/scrubUrlToken';

// These three modules are SECURITY-critical (open-redirect, path safety,
// one-time-token leak). Locked-in tests guard against silent regressions.

describe('isSafeInternalPath (open-redirect guard)', () => {
  it('accepts plain internal paths', () => {
    expect(isSafeInternalPath('/dashboard')).toBe(true);
    expect(isSafeInternalPath('/')).toBe(true);
    expect(isSafeInternalPath('/a/b/c?q=1#h')).toBe(true);
    expect(isSafeInternalPath('/foo//bar')).toBe(true); // internal double-slash is fine
  });

  it('rejects protocol-relative and backslash-prefixed paths (external redirect tricks)', () => {
    expect(isSafeInternalPath('//evil.com')).toBe(false);
    expect(isSafeInternalPath('/\\evil.com')).toBe(false);
  });

  it('rejects host-qualified URLs', () => {
    expect(isSafeInternalPath('https://evil.com')).toBe(false);
    expect(isSafeInternalPath('http://evil.com')).toBe(false);
    expect(isSafeInternalPath('javascript:alert(1)')).toBe(false);
  });

  it('rejects relative paths without a leading slash, and empty/nullish', () => {
    expect(isSafeInternalPath('dashboard')).toBe(false);
    expect(isSafeInternalPath('')).toBe(false);
    expect(isSafeInternalPath(null)).toBe(false);
    expect(isSafeInternalPath(undefined)).toBe(false);
  });
});

describe('validateStripeUrl (open-redirect guard for billing)', () => {
  it('accepts the two allowlisted Stripe hosts over https', () => {
    expect(validateStripeUrl('https://checkout.stripe.com/c/pay/cs_test_123')).toBe(true);
    expect(validateStripeUrl('https://billing.stripe.com/p/session/abc')).toBe(true);
  });

  it('normalizes uppercase scheme/host and ignores an explicit 443 port', () => {
    expect(validateStripeUrl('HTTPS://CHECKOUT.STRIPE.COM/x')).toBe(true);
    expect(validateStripeUrl('https://checkout.stripe.com:443/c/pay')).toBe(true);
  });

  it('rejects non-https', () => {
    expect(validateStripeUrl('http://checkout.stripe.com')).toBe(false);
    expect(validateStripeUrl('ftp://checkout.stripe.com')).toBe(false);
  });

  it('rejects non-allowlisted hosts incl. other stripe subdomains and look-alikes (R11 fix)', () => {
    expect(validateStripeUrl('https://stripe.com')).toBe(false);
    expect(validateStripeUrl('https://api.stripe.com')).toBe(false);
    expect(validateStripeUrl('https://evil.stripe.com')).toBe(false);
    expect(validateStripeUrl('https://checkout.stripe.com.evil.com')).toBe(false);
    expect(validateStripeUrl('https://evil.com')).toBe(false);
  });

  it('rejects unparseable input', () => {
    expect(validateStripeUrl('not a url')).toBe(false);
    expect(validateStripeUrl('')).toBe(false);
  });
});

describe('readTokenFromUrl / scrubTokenFromUrl (one-time-token leak guard)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/reset-password');
  });

  it('reads a token from the query string', () => {
    window.history.replaceState({}, '', '/reset-password?token=qtok');
    expect(readTokenFromUrl()).toBe('qtok');
  });

  it('reads a token from the URL fragment', () => {
    window.history.replaceState({}, '', '/verify-email#token=htok');
    expect(readTokenFromUrl()).toBe('htok');
  });

  it('prefers the fragment over the query (R8 rollout)', () => {
    window.history.replaceState({}, '', '/family/join?token=qtok#token=htok');
    expect(readTokenFromUrl()).toBe('htok');
  });

  it('supports a custom param name and returns null when absent', () => {
    window.history.replaceState({}, '', '/x?invite=INV');
    expect(readTokenFromUrl('invite')).toBe('INV');
    expect(readTokenFromUrl('token')).toBeNull();
  });

  it('scrubs the token from the query string', () => {
    window.history.replaceState({}, '', '/reset-password?token=secret&keep=1');
    scrubTokenFromUrl();
    expect(window.location.search).not.toContain('token=');
    expect(window.location.search).toContain('keep=1'); // other params preserved
    expect(readTokenFromUrl()).toBeNull();
  });

  it('scrubs the token from the fragment', () => {
    window.history.replaceState({}, '', '/verify-email#token=secret');
    scrubTokenFromUrl();
    expect(window.location.hash).toBe('');
    expect(readTokenFromUrl()).toBeNull();
  });

  it('is a no-op when there is no token', () => {
    window.history.replaceState({}, '', '/reset-password?other=1');
    scrubTokenFromUrl();
    expect(window.location.search).toContain('other=1');
  });
});
