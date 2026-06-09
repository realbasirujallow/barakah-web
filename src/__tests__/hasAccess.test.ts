/**
 * 2026-06-09 (SEC-ADMIN-CLIENT-1): regression coverage for the
 * hasAccess(isAdmin) short-circuit and the planExpiresAt expiry check.
 * The backend independently re-validates admin + plan on every gated
 * endpoint (AuthHelper.requirePlusPlan / requireFamilyPlan), so this
 * test guards the *UI* invariant only.
 */
import { describe, it, expect } from 'vitest';
import { hasAccess } from '../context/AuthContext';

const FUTURE = Math.floor(Date.now() / 1000) + 24 * 3600;
const EXPIRED = Math.floor(Date.now() / 1000) - 24 * 3600;

describe('hasAccess', () => {
  it('grants admin regardless of plan or expiry', () => {
    expect(hasAccess('free', 'plus', null, true)).toBe(true);
    expect(hasAccess('free', 'family', null, true)).toBe(true);
    expect(hasAccess('plus', 'plus', EXPIRED, true)).toBe(true);
  });

  it('denies free users', () => {
    expect(hasAccess('free', 'plus', null, false)).toBe(false);
    expect(hasAccess(undefined, 'plus', null, false)).toBe(false);
  });

  it('denies expired plus/family even if plan field still says paid', () => {
    expect(hasAccess('plus', 'plus', EXPIRED, false)).toBe(false);
    expect(hasAccess('family', 'family', EXPIRED, false)).toBe(false);
  });

  it('grants non-expired plus access', () => {
    expect(hasAccess('plus', 'plus', FUTURE, false)).toBe(true);
    expect(hasAccess('family', 'plus', FUTURE, false)).toBe(true); // family ≥ plus
  });

  it('grants family-only feature only to family plan', () => {
    expect(hasAccess('plus', 'family', FUTURE, false)).toBe(false);
    expect(hasAccess('family', 'family', FUTURE, false)).toBe(true);
  });

  it('treats null planExpiresAt as no expiry (manual grant)', () => {
    expect(hasAccess('plus', 'plus', null, false)).toBe(true);
    expect(hasAccess('family', 'family', undefined, false)).toBe(true);
  });
});
