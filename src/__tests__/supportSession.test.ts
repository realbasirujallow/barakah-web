import { describe, it, expect, beforeEach } from 'vitest';
import {
  setSupportToken,
  clearSupportToken,
  getSupportToken,
  getSupportMeta,
  isInSupportMode,
  REASON_CODES,
  reasonCodeLabel,
} from '../lib/supportSession';

describe('supportSession lib', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('roundtrips token + meta through sessionStorage', () => {
    setSupportToken('eyJ.test', {
      sessionId: 1,
      targetUserId: 99,
      targetEmail: 'user@example.com',
      reasonCode: 'customer_support',
      mode: 'VIEW_ONLY',
      startedAt: 1_000,
      expiresAt: 9_999_999_999_999,
    });
    expect(getSupportToken()).toBe('eyJ.test');
    const meta = getSupportMeta();
    expect(meta).not.toBeNull();
    expect(meta!.sessionId).toBe(1);
    expect(meta!.targetUserId).toBe(99);
    expect(meta!.reasonCode).toBe('customer_support');
    expect(isInSupportMode()).toBe(true);
  });

  it('clearSupportToken removes both token and meta', () => {
    setSupportToken('eyJ.test', {
      sessionId: 1, targetUserId: 99, reasonCode: 'customer_support',
      mode: 'VIEW_ONLY', startedAt: 1_000, expiresAt: 9_999_999_999_999,
    });
    clearSupportToken();
    expect(getSupportToken()).toBeNull();
    expect(getSupportMeta()).toBeNull();
    expect(isInSupportMode()).toBe(false);
  });

  it('getSupportMeta auto-clears + returns null when token has expired client-side', () => {
    setSupportToken('eyJ.test', {
      sessionId: 1, targetUserId: 99, reasonCode: 'customer_support',
      mode: 'VIEW_ONLY', startedAt: 1_000, expiresAt: 1,
    });
    expect(getSupportMeta()).toBeNull();
    expect(getSupportToken()).toBeNull();
  });

  it('REASON_CODES matches the backend enum exactly', () => {
    expect(REASON_CODES).toEqual([
      'customer_support', 'onboarding_help', 'billing_help',
      'bug_reproduction', 'accessibility_help', 'family_setup_help',
      'other_with_note_required',
    ]);
  });

  it('reasonCodeLabel renders human-friendly labels for every code', () => {
    for (const code of REASON_CODES) {
      const label = reasonCodeLabel(code);
      expect(label).not.toBe(code);
      expect(label.length).toBeGreaterThan(3);
    }
  });

  it('reasonCodeLabel falls back to the raw code for unknown values', () => {
    expect(reasonCodeLabel('made_up_reason')).toBe('made_up_reason');
  });

  it('isInSupportMode returns false when nothing is in storage', () => {
    expect(isInSupportMode()).toBe(false);
  });
});
