import { describe, it, expect } from 'vitest';
import { fmt, toHijri, formatHijriLocalized } from '@/lib/format';

/**
 * Characterization tests for the money-display + Hijri-rendering seams
 * (audit recommendation #5 — flows 1 & 2: multi-currency display and
 * zakat/Hijri rendering). These assert LOCALE-STABLE invariants rather
 * than exact formatted strings, so they don't flake on the test runner's
 * default ICU locale while still failing if the behavior regresses.
 */

describe('fmt — currency formatting (multi-currency display correctness)', () => {
  it('formats a USD amount with the dollar glyph and the numeric value', () => {
    const out = fmt(1234.56, 'USD');
    expect(out).toMatch(/\$/);
    // grouping separator is locale-dependent; assert the significant
    // digits survive in order, plus the two-decimal cents.
    expect(out.replace(/[^0-9.]/g, '')).toContain('1234.56');
  });

  it('treats NaN and Infinity as zero (never renders "NaN"/"∞" to a user)', () => {
    const zero = fmt(0, 'USD');
    expect(fmt(NaN, 'USD')).toBe(zero);
    expect(fmt(Infinity, 'USD')).toBe(zero);
    expect(fmt(-Infinity, 'USD')).toBe(zero);
    expect(fmt(NaN, 'USD')).not.toMatch(/nan/i);
  });

  it('honors the requested currency — different codes produce different output', () => {
    expect(fmt(100, 'EUR')).not.toBe(fmt(100, 'USD'));
    expect(fmt(100, 'PKR')).not.toBe(fmt(100, 'USD'));
    // SAR / GBP are real user currencies — must not throw and must format.
    expect(() => fmt(5000, 'SAR')).not.toThrow();
    expect(fmt(5000, 'GBP')).toMatch(/[0-9]/);
  });

  it('defaults to USD when no currency is given', () => {
    expect(fmt(100)).toBe(fmt(100, 'USD'));
  });

  it('renders negative amounts (debts / outflows) distinctly from positive', () => {
    expect(fmt(-50, 'USD')).not.toBe(fmt(50, 'USD'));
    expect(fmt(-50, 'USD')).toMatch(/50/);
  });
});

describe('toHijri — Gregorian→Hijri (server is authoritative; this is the client fallback)', () => {
  const MONTHS = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
  ];

  it('returns in-range fields for a known modern date', () => {
    const h = toHijri(new Date('2026-06-10T12:00:00Z'));
    expect(h.month).toBeGreaterThanOrEqual(1);
    expect(h.month).toBeLessThanOrEqual(12);
    expect(h.day).toBeGreaterThanOrEqual(1);
    expect(h.day).toBeLessThanOrEqual(30);
    // 2026 CE falls in Hijri year 1447–1448.
    expect(h.year).toBeGreaterThanOrEqual(1447);
    expect(h.year).toBeLessThanOrEqual(1448);
    expect(MONTHS).toContain(h.monthName);
  });

  it('advances monotonically across a year (later Gregorian → later Hijri)', () => {
    const a = toHijri(new Date('2026-01-01T00:00:00Z'));
    const b = toHijri(new Date('2026-12-31T00:00:00Z'));
    const aAbs = a.year * 12 + a.month;
    const bAbs = b.year * 12 + b.month;
    expect(bAbs).toBeGreaterThan(aAbs);
  });
});

describe('formatHijriLocalized — Arabic-numeral rendering (ar-locale zakat/dashboard)', () => {
  const EN_FALLBACK = '9 Ramadan 1447';

  it('passes through the English string unchanged for non-Arabic locales', () => {
    expect(formatHijriLocalized(EN_FALLBACK, 9, 9, 1447, 'en')).toBe(EN_FALLBACK);
    expect(formatHijriLocalized(EN_FALLBACK, 9, 9, 1447, 'fr-FR')).toBe(EN_FALLBACK);
    expect(formatHijriLocalized(EN_FALLBACK, 9, 9, 1447, 'ur')).toBe(EN_FALLBACK);
  });

  it('renders Arabic numerals + Arabic month name for ar', () => {
    const out = formatHijriLocalized(EN_FALLBACK, 9, 9, 1447, 'ar-SA');
    expect(out).toContain('رمضان');        // month 9 in Arabic
    expect(out).toContain('١٤٤٧');          // 1447 in Eastern Arabic numerals
    expect(out).not.toContain('Ramadan');   // no Latin leakage
    expect(out).not.toMatch(/[0-9]/);       // no Western digits
  });

  it('falls back to the English string when month is missing or out of range', () => {
    expect(formatHijriLocalized(EN_FALLBACK, 9, undefined, 1447, 'ar')).toBe(EN_FALLBACK);
    expect(formatHijriLocalized(EN_FALLBACK, 9, 13, 1447, 'ar')).toBe(EN_FALLBACK);
    expect(formatHijriLocalized(EN_FALLBACK, undefined, 9, 1447, 'ar')).toBe(EN_FALLBACK);
  });
});
