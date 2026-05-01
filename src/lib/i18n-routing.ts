/**
 * Phase 21 (Apr 30 2026) — single source of truth for locale routing.
 *
 * The full route migration (`app/{route}/page.tsx` → `app/[lang]/{route}/page.tsx`)
 * is documented in `research/MULTILINGUAL-ROUTING-SCOPE-2026-04-30.md` and
 * NOT yet shipped — it's a 1-week focused PR that needs eyes-on QA across
 * 4 locales × 8 priority routes.
 *
 * What IS shipped:
 *   • This constants module (so future PRs have one import).
 *   • `src/middleware.ts` matching pattern (currently no-op pass-through;
 *     ready to swap to redirect logic when routes split).
 *   • Reflected in `src/app/sitemap.ts` `alternateRefs` (commented-out
 *     scaffold; uncomment when routes ship).
 *
 * Locked decisions per the brief (D1-D4):
 *   D1 Path (`/ar/...`) — not subdomain
 *   D2 All 4 locales (en/ar/ur/fr)
 *   D3 Authenticated routes stay flat (`/dashboard/*` doesn't get `[lang]`)
 *   D4 301 redirect from bare paths to `/{defaultLocale}/...`
 */

export const SUPPORTED_LOCALES = ['en', 'ar', 'ur', 'fr'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

/** RTL locales — used by the dashboard layout's `dir` attribute. */
export const RTL_LOCALES: ReadonlySet<SupportedLocale> = new Set(['ar', 'ur']);

/** Routes that should NEVER be locale-prefixed (auth, API, admin). */
export const LOCALE_EXEMPT_PREFIXES: readonly string[] = [
  '/api',           // backend / Next.js API routes
  '/_next',         // Next.js internals
  '/dashboard',     // authenticated app — locale comes from user profile
  '/admin',         // founder/staff
  '/login',
  '/signup',
  '/verify',
  '/verify-email',
  '/reset-password',
  '/setup',
  '/seo',           // /seo/indexnow
  '/.well-known',   // apple-app-site-association etc.
];

/** True if `pathname` starts with any locale-exempt prefix. */
export function isLocaleExempt(pathname: string): boolean {
  return LOCALE_EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** True if `pathname` starts with `/${locale}/` for any supported locale. */
export function hasLocalePrefix(pathname: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

/** Strip the locale prefix from a path. Returns the original path if none. */
export function stripLocale(pathname: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    const prefix = `/${locale}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}
