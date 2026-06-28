/**
 * Regression guard for the 2026-06-28 boring-bug-hunt finding:
 *
 * The /pricing annual-toggle savings badge (PricingToggle → t('saveRange'))
 * read a stale "17-34%" range in fr/ar/ur ("Économisez 17 à 34 %", "وفّر 17-34٪",
 * "17-34٪ بچائیں") while English (and the canonical PRICING.*.yearlySaving) said
 * "Save 17%". No tier saves 34% — Plus saves ~17.4% ($99 vs $119.88), Family
 * ~17.2% ($149 vs $179.88) — so the localized copy was an overclaim.
 *
 * These tests pin the contract so a stale savings range can't regress into any
 * locale silently.
 */

import { describe, it, expect } from 'vitest';
import { en } from '../lib/i18n/dictionaries/en';
import { ar } from '../lib/i18n/dictionaries/ar';
import { ur } from '../lib/i18n/dictionaries/ur';
import { fr } from '../lib/i18n/dictionaries/fr';
import { PRICING } from '../lib/pricing';

const DICTS = { en, ar, ur, fr } as const;

describe('pricing claim consistency — saveRange across locales', () => {
  it('canonical yearlySaving is a single 17% for both tiers', () => {
    expect(PRICING.plus.yearlySaving).toBe('Save 17%');
    expect(PRICING.family.yearlySaving).toBe('Save 17%');
  });

  for (const [locale, dict] of Object.entries(DICTS)) {
    it(`[${locale}] saveRange exists and is a single value (not a stale range)`, () => {
      const v = dict.saveRange;
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
      // Must mention 17. Must NOT mention 34 (the old overclaim ceiling) or any
      // range separator joining two savings percentages.
      expect(v).toMatch(/17/);
      expect(v).not.toMatch(/34/);
      expect(v).not.toMatch(/17\s*(à|to|-|–|—|تا)\s*\d/i);
    });
  }
});
