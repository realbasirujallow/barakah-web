import { describe, it, expect, beforeEach } from 'vitest';
import { setRefreshToken } from '../lib/api';

/**
 * Pins the refresh-token sessionStorage fallback that was silently
 * removed in commit 8334bad and reintroduced the "logged out within
 * seconds" UX bug. See lib/api.ts for the full rationale.
 *
 * If these tests start failing, DO NOT just delete them — verify that
 * cookies are reliably set by /auth/login and /auth/refresh in the
 * production deployment chain (Railway internal routing → CDN → Next.js
 * rewrites) BEFORE removing the fallback.
 */
describe('refresh-token sessionStorage fallback', () => {
  const KEY = 'barakah_refresh_fallback';

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('persists a non-empty token to sessionStorage', () => {
    setRefreshToken('rt_abc123');
    expect(window.sessionStorage.getItem(KEY)).toBe('rt_abc123');
  });

  it('clears the fallback when called with null', () => {
    window.sessionStorage.setItem(KEY, 'rt_old');
    setRefreshToken(null);
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });

  it('clears the fallback when called with an empty string', () => {
    window.sessionStorage.setItem(KEY, 'rt_old');
    setRefreshToken('');
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });

  it('clears the fallback when called with whitespace-only', () => {
    window.sessionStorage.setItem(KEY, 'rt_old');
    setRefreshToken('   ');
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });

  it('overwrites existing token on rotation', () => {
    setRefreshToken('rt_first');
    setRefreshToken('rt_second_rotated');
    expect(window.sessionStorage.getItem(KEY)).toBe('rt_second_rotated');
  });

  it('does not throw if sessionStorage throws (private browsing / quota)', () => {
    const original = window.sessionStorage.setItem;
    window.sessionStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    try {
      // Must not propagate the error — caller should silently fall back
      // to the cookie-only path.
      expect(() => setRefreshToken('rt_xyz')).not.toThrow();
    } finally {
      window.sessionStorage.setItem = original;
    }
  });
});
