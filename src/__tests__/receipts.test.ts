import { describe, it, expect } from 'vitest';
import {
  isAcceptedReceiptType,
  formatReceiptSize,
  RECEIPT_MAX_BYTES,
  RECEIPT_ACCEPT,
  isLocked,
} from '../lib/receipts';

describe('isAcceptedReceiptType', () => {
  it('accepts any image/* type', () => {
    expect(isAcceptedReceiptType('image/jpeg')).toBe(true);
    expect(isAcceptedReceiptType('image/png')).toBe(true);
    expect(isAcceptedReceiptType('image/heic')).toBe(true);
    expect(isAcceptedReceiptType('image/webp')).toBe(true);
  });

  it('accepts application/pdf (exact)', () => {
    expect(isAcceptedReceiptType('application/pdf')).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isAcceptedReceiptType('application/octet-stream')).toBe(false);
    expect(isAcceptedReceiptType('text/html')).toBe(false);
    expect(isAcceptedReceiptType('video/mp4')).toBe(false);
  });

  it('rejects empty/null/undefined', () => {
    expect(isAcceptedReceiptType('')).toBe(false);
    expect(isAcceptedReceiptType(null)).toBe(false);
    expect(isAcceptedReceiptType(undefined)).toBe(false);
  });

  it('is an exact match for pdf — a parameterized type fails this fast-check (backend re-validates)', () => {
    // Browsers report File.type as bare 'application/pdf'; this is only a client
    // fast-fail, and the server re-checks magic bytes + base content-type.
    expect(isAcceptedReceiptType('application/pdf; charset=utf-8')).toBe(false);
  });
});

describe('formatReceiptSize (en locale, deterministic)', () => {
  it('formats bytes under 1 KB as B', () => {
    expect(formatReceiptSize(0, 'en')).toBe('0 B');
    expect(formatReceiptSize(640, 'en')).toBe('640 B');
  });

  it('formats KB with no decimals', () => {
    expect(formatReceiptSize(1024, 'en')).toBe('1 KB');
    expect(formatReceiptSize(3 * 1024, 'en')).toBe('3 KB');
    expect(formatReceiptSize(812 * 1024, 'en')).toBe('812 KB');
  });

  it('formats MB with one decimal', () => {
    expect(formatReceiptSize(1024 * 1024, 'en')).toBe('1 MB');
    expect(formatReceiptSize(2.4 * 1024 * 1024, 'en')).toBe('2.4 MB');
  });

  it('keeps an ASCII unit suffix even for a localized (non-en) number', () => {
    // Only the number is localized; the unit suffix is hardcoded ASCII.
    expect(formatReceiptSize(2.4 * 1024 * 1024, 'ar').endsWith(' MB')).toBe(true);
    expect(formatReceiptSize(640, 'fr').endsWith(' B')).toBe(true);
  });

  it('defaults to en when locale is undefined and never throws', () => {
    expect(formatReceiptSize(2 * 1024 * 1024, undefined)).toBe('2 MB');
  });
});

describe('receipt constants', () => {
  it('caps uploads at 10 MB', () => {
    expect(RECEIPT_MAX_BYTES).toBe(10 * 1024 * 1024);
  });

  it('accept filter mirrors the backend (images + pdf)', () => {
    expect(RECEIPT_ACCEPT).toBe('image/*,application/pdf');
  });
});

describe('isLocked re-export', () => {
  it('re-exports the shared lock guard so receipt callers branch identically', () => {
    expect(isLocked({ locked: true, requiredPlan: 'family' })).toBe(true);
    expect(isLocked({ receipts: [], count: 0 })).toBe(false);
  });
});
