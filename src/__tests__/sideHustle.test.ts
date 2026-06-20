import { describe, it, expect } from 'vitest';
import {
  isLocked,
  sideHustleSlug,
  monthOptions,
  type SideHustleSummary,
} from '../lib/sideHustle';

describe('isLocked', () => {
  it('is true only for the backend locked sentinel {locked:true,...}', () => {
    expect(isLocked({ locked: true, requiredPlan: 'family' })).toBe(true);
  });

  it('is false when locked is missing or falsy', () => {
    expect(isLocked({ locked: false })).toBe(false);
    expect(isLocked({})).toBe(false);
    expect(isLocked({ requiredPlan: 'family' })).toBe(false);
  });

  it('requires strict boolean true (not a truthy string/number)', () => {
    // The guard uses `=== true`, so a stringified or numeric flag must NOT pass.
    expect(isLocked({ locked: 'true' })).toBe(false);
    expect(isLocked({ locked: 1 })).toBe(false);
  });

  it('is false for non-objects and null/undefined', () => {
    expect(isLocked(null)).toBe(false);
    expect(isLocked(undefined)).toBe(false);
    expect(isLocked('locked')).toBe(false);
    expect(isLocked(42)).toBe(false);
    expect(isLocked([])).toBe(false);
  });

  it('is false for a real summary payload (so data is not mistaken for a lock)', () => {
    const summary: SideHustleSummary = {
      sideHustleId: 1,
      name: '5931 Cedar Lake',
      currency: 'USD',
      year: 2026,
      taxYearStartMonth: 1,
      periodStart: 0,
      periodEnd: 0,
      period: '2026',
      totalIncome: 0,
      totalExpenses: 0,
      totalTransfers: 0,
      netIncome: 0,
      incomeByCategory: {},
      expensesByCategory: {},
      transactionCount: 0,
    };
    expect(isLocked(summary)).toBe(false);
  });
});

describe('sideHustleSlug', () => {
  it('lowercases and collapses non-alphanumerics to single underscores', () => {
    expect(sideHustleSlug('5931 Cedar Lake')).toBe('5931_cedar_lake');
    expect(sideHustleSlug('Roof Repair')).toBe('roof_repair');
    expect(sideHustleSlug('a   b')).toBe('a_b');
    expect(sideHustleSlug('a---b')).toBe('a_b');
  });

  it('trims leading/trailing underscores produced by punctuation', () => {
    expect(sideHustleSlug('  Roof Repair!! ')).toBe('roof_repair');
    expect(sideHustleSlug('!!!hello!!!')).toBe('hello');
  });

  it('falls back to "side_hustle" when the result would be empty', () => {
    expect(sideHustleSlug('')).toBe('side_hustle');
    expect(sideHustleSlug('   ')).toBe('side_hustle');
    expect(sideHustleSlug('!!!')).toBe('side_hustle');
  });

  it('handles null/undefined-ish input without throwing', () => {
    // The impl guards with `(name || '')`, so a falsy name yields the fallback.
    expect(sideHustleSlug(undefined as unknown as string)).toBe('side_hustle');
    expect(sideHustleSlug(null as unknown as string)).toBe('side_hustle');
  });

  it('always returns a non-empty [a-z0-9_] slug with no leading/trailing underscore', () => {
    for (const input of ['5931 Cedar Lake', 'Café Münchën', '  weird---name!! ', '123', 'A_B_C']) {
      const slug = sideHustleSlug(input);
      expect(slug.length).toBeGreaterThan(0);
      expect(slug).toMatch(/^[a-z0-9_]+$/);
      expect(slug.startsWith('_')).toBe(false);
      expect(slug.endsWith('_')).toBe(false);
    }
  });
});

describe('monthOptions', () => {
  it('returns 12 entries with values 1..12 in order', () => {
    const opts = monthOptions('en');
    expect(opts).toHaveLength(12);
    expect(opts.map((o) => o.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('labels every month with a non-empty string', () => {
    for (const o of monthOptions('en')) {
      expect(typeof o.label).toBe('string');
      expect(o.label.length).toBeGreaterThan(0);
    }
  });

  it('uses English month names for the en locale', () => {
    const opts = monthOptions('en');
    expect(opts[0].label).toBe('January');
    expect(opts[11].label).toBe('December');
  });

  it('defaults to English when locale is undefined', () => {
    expect(monthOptions(undefined)).toEqual(monthOptions('en'));
  });
});
