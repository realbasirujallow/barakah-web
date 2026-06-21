import { describe, it, expect } from 'vitest';
import {
  PRICING,
  FREE_FEATURES,
  PLUS_FEATURES,
  FAMILY_FEATURES,
  COMPETITOR_COMPARISON,
} from '../lib/pricing';

// pricing.ts is the single source of truth for plan prices. These tests lock
// the MONETIZATION INVARIANTS that were previously violated (see the 2026-05-08
// note in pricing.ts: a Plus-monthly→Family-annual price inversion let users
// save money by "upgrading"). A regression here costs real revenue/trust.

const dollars = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ''));

describe('pricing invariants', () => {
  const plusM = dollars(PRICING.plus.monthly);
  const plusY = dollars(PRICING.plus.yearly);
  const famM = dollars(PRICING.family.monthly);
  const famY = dollars(PRICING.family.yearly);

  it('parses the configured prices', () => {
    expect(plusM).toBeCloseTo(9.99, 2);
    expect(plusY).toBeCloseTo(99, 2);
    expect(famM).toBeCloseTo(14.99, 2);
    expect(famY).toBeCloseTo(149, 2);
  });

  it('annual billing is actually cheaper than 12× monthly (both plans)', () => {
    expect(plusY).toBeLessThan(plusM * 12);
    expect(famY).toBeLessThan(famM * 12);
  });

  it('no cross-tier inversion: Family annual > Plus annualized-monthly (the 2026-05-08 fix)', () => {
    // Family annual must sit ABOVE Plus monthly×12, else a Plus-monthly user
    // saves money by switching to Family annual — the exact bug that was fixed.
    expect(famY).toBeGreaterThan(plusM * 12);
  });

  it('tier ordering holds: Family costs more than Plus at each interval', () => {
    expect(famM).toBeGreaterThan(plusM);
    expect(famY).toBeGreaterThan(plusY);
  });

  it('the "Save 17%" claim matches the real discount within tolerance', () => {
    const plusSaving = 1 - plusY / (plusM * 12);
    const famSaving = 1 - famY / (famM * 12);
    expect(plusSaving).toBeGreaterThan(0.13);
    expect(plusSaving).toBeLessThan(0.20);
    expect(famSaving).toBeGreaterThan(0.13);
    expect(famSaving).toBeLessThan(0.20);
    expect(PRICING.plus.yearlySaving).toMatch(/17%/);
    expect(PRICING.family.yearlySaving).toMatch(/17%/);
  });
});

describe('competitor table stays consistent with PRICING (no public-number drift)', () => {
  const row = (feature: string) => COMPETITOR_COMPARISON.find((r) => r.feature === feature);

  it("barakah's competitor-table prices equal the PRICING source of truth", () => {
    expect(row('Monthly price')?.barakah).toBe(PRICING.plus.monthly); // $9.99
    expect(String(row('Annual price')?.barakah)).toContain(dollars(PRICING.plus.yearly).toString()); // 99
  });

  it('the comparison advertises the 30-day no-card trial', () => {
    expect(String(row('Free trial')?.barakah)).toMatch(/30 days/);
    expect(String(row('Free trial')?.barakah)).toMatch(/no card/i);
  });
});

describe('feature-list sanity', () => {
  it('each tier lists features and Family builds on Plus', () => {
    expect(FREE_FEATURES.length).toBeGreaterThan(0);
    expect(PLUS_FEATURES.length).toBeGreaterThan(0);
    expect(FAMILY_FEATURES.length).toBeGreaterThan(0);
    expect(FAMILY_FEATURES[0]).toMatch(/Everything in Plus/i);
  });
});
