import { describe, it, expect, beforeEach } from 'vitest';
import { setRefreshToken } from '../lib/api';

/**
 * R8 audit (2026-04-21): the web refresh-token sessionStorage fallback
 * was intentionally removed. Browsers now rely on httpOnly cookies only;
 * mobile remains the only client that receives bearer tokens in JSON
 * bodies. These tests pin the new browser-safe behavior so we don't
 * silently reintroduce a JS-readable refresh token later.
 */
describe('refresh-token web storage hardening', () => {
  const KEY = 'barakah_refresh_fallback';

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('does not persist a non-empty token to sessionStorage', () => {
    setRefreshToken('rt_abc123');
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
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

  it('wipes any legacy stored token on subsequent calls', () => {
    window.sessionStorage.setItem(KEY, 'rt_first');
    setRefreshToken('rt_second_rotated');
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });

  it('does not throw if sessionStorage cleanup throws (private browsing / quota)', () => {
    const original = window.sessionStorage.removeItem;
    window.sessionStorage.removeItem = () => {
      throw new Error('QuotaExceededError');
    };
    try {
      // Must not propagate the error — caller should silently fall back
      // to the cookie-only path.
      expect(() => setRefreshToken('rt_xyz')).not.toThrow();
    } finally {
      window.sessionStorage.removeItem = original;
    }
  });
});
