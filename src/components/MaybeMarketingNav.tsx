'use client';

import { usePathname } from 'next/navigation';
import { MarketingNav } from './MarketingNav';

/**
 * Renders <MarketingNav /> on every PUBLIC marketing page automatically,
 * so we don't have to remember to import + mount it on each page.
 *
 * 2026-05-01 — added after the founder reported that /compare had its
 * own custom nav (with the old "Home / Compare Apps" breadcrumb pattern)
 * while /pricing had MarketingNav. Inconsistent chrome. The right fix is
 * to mount MarketingNav once at the root layout and skip it on the
 * surfaces that have their own chrome (/dashboard) or shouldn't have any
 * (/login, /signup, etc.).
 *
 * Denylist over allowlist: the public marketing surface is large and
 * grows organically as new SEO pages get added. Adding a new public page
 * should "just work" — the dev shouldn't have to remember to opt in.
 */

const HIDE_ON_PREFIXES = [
  '/dashboard',
  '/setup',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/verify-email',
  '/email-capture',
  '/plaid', // OAuth callback — full-screen flow, no chrome
];

export function MaybeMarketingNav() {
  const pathname = usePathname();
  if (!pathname) return null;
  for (const prefix of HIDE_ON_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return null;
  }
  return <MarketingNav />;
}
