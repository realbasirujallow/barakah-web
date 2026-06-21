import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  RTL_LOCALES,
  isLocaleExempt,
  hasLocalePrefix,
  stripLocale,
} from '../lib/i18n-routing';

// Locale routing is SEO-critical (hreflang, /ar /ur /fr islands, 301 plan).
// The boundary cases (/ardvark must NOT count as the /ar locale) are exactly
// what a naive prefix check gets wrong.

describe('locale config', () => {
  it('has the 4 launch locales with en default and ar/ur RTL', () => {
    expect([...SUPPORTED_LOCALES]).toEqual(['en', 'ar', 'ur', 'fr']);
    expect(DEFAULT_LOCALE).toBe('en');
    expect(RTL_LOCALES.has('ar')).toBe(true);
    expect(RTL_LOCALES.has('ur')).toBe(true);
    expect(RTL_LOCALES.has('fr')).toBe(false);
    expect(RTL_LOCALES.has('en')).toBe(false);
  });
});

describe('isLocaleExempt', () => {
  it('exempts auth/admin/api/internal routes', () => {
    for (const p of ['/api/x', '/_next/static', '/dashboard', '/dashboard/zakat',
                     '/admin', '/login', '/signup', '/verify-email', '/reset-password',
                     '/setup', '/seo/indexnow', '/.well-known/aasa']) {
      expect(isLocaleExempt(p)).toBe(true);
    }
  });

  it('does not exempt public marketing/content routes', () => {
    for (const p of ['/', '/learn/halal-stocks', '/pricing', '/ar/learn/zakat-on-gold']) {
      expect(isLocaleExempt(p)).toBe(false);
    }
  });
});

describe('hasLocalePrefix', () => {
  it('detects an exact locale root or a locale-prefixed path', () => {
    expect(hasLocalePrefix('/ar')).toBe(true);
    expect(hasLocalePrefix('/ar/learn')).toBe(true);
    expect(hasLocalePrefix('/fr/')).toBe(true);
    expect(hasLocalePrefix('/ur/zakat')).toBe(true);
    expect(hasLocalePrefix('/en')).toBe(true);
  });

  it('is not fooled by paths that merely START with locale letters (boundary)', () => {
    expect(hasLocalePrefix('/ardvark')).toBe(false); // not the /ar locale
    expect(hasLocalePrefix('/article')).toBe(false);
    expect(hasLocalePrefix('/friends')).toBe(false); // not /fr
    expect(hasLocalePrefix('/learn')).toBe(false);
    expect(hasLocalePrefix('/')).toBe(false);
  });
});

describe('stripLocale', () => {
  it('removes a leading locale segment', () => {
    expect(stripLocale('/ar/learn/zakat-on-gold')).toBe('/learn/zakat-on-gold');
    expect(stripLocale('/en/dashboard')).toBe('/dashboard');
    expect(stripLocale('/ur/x/y')).toBe('/x/y');
  });

  it('maps a bare locale root to "/"', () => {
    expect(stripLocale('/ar')).toBe('/');
    expect(stripLocale('/fr/')).toBe('/');
  });

  it('leaves non-localized paths untouched, including boundary look-alikes', () => {
    expect(stripLocale('/learn')).toBe('/learn');
    expect(stripLocale('/')).toBe('/');
    expect(stripLocale('/ardvark')).toBe('/ardvark'); // must NOT become /dvark
  });
});
