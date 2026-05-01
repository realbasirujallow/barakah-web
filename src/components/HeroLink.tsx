/**
 * Hero-style link — a Next.js `<Link>` that wraps navigation in the
 * browser's CSS View Transitions API + sets a matching
 * `view-transition-name` so a destination element with the same name
 * morphs from this source.
 *
 * R41 (2026-05-01): replaces the bare-Link → instant-navigation
 * pattern on dashboard cards that point to detail pages. The user
 * sees the card visually fly into place as the detail page hero
 * (when the browser supports it; older browsers just navigate
 * instantly with no jank).
 *
 * Usage on the dashboard:
 *
 *   <HeroLink href="/dashboard/net-worth" heroName="net-worth-hero">
 *     <KpiCard ... />
 *   </HeroLink>
 *
 * On the destination page (`/dashboard/net-worth/page.tsx`):
 *
 *   <div style={{ viewTransitionName: 'net-worth-hero' }}>
 *     <h1>Your net worth</h1>
 *     ...
 *   </div>
 *
 * The browser will animate matching `viewTransitionName` elements
 * between the two DOM trees. Each name must be unique on a page —
 * don't reuse the same `heroName` for two different elements.
 *
 * Why this over a custom <a>?
 *   • Preserves Next.js prefetching (warm route segments)
 *   • Keyboard + screen-reader semantics from <Link>
 *   • One prop opt-in instead of every consumer wiring useViewTransition
 */

'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { useViewTransition } from '../lib/useViewTransition';

interface HeroLinkProps extends Omit<ComponentProps<typeof Link>, 'onClick' | 'onKeyDown'> {
  /**
   * Shared `view-transition-name`. Must match the destination page's
   * hero element. Pick a unique slug per pairing (e.g.
   * "net-worth-hero", "spending-hero", "zakat-card-hero").
   *
   * R42 (2026-05-01): now OPTIONAL. When the link sits INSIDE a parent
   * element that already carries the source-side `viewTransitionName`
   * (e.g. a card wrapper with `style={{viewTransitionName: 'budget-hero'}}`
   * containing both the headline and a "Manage budgets →" link),
   * setting the same name on the inner link too creates a duplicate
   * and the browser silently aborts the transition. In that case omit
   * `heroName` — you still get the view-transition wrapper around
   * `router.push`, the parent provides the morph target. When omitted,
   * HeroLink behaves exactly like a plain `<Link>` plus a wrapped
   * navigation.
   */
  heroName?: string;

  /**
   * R43 (2026-05-01): synchronous side-effect to run BEFORE the
   * wrapped `router.push` fires. Useful for callsites like the
   * dashboard sidebar where the consumer needs to close a mobile
   * drawer or fire an analytics event before the navigation kicks
   * off. Runs only on the intercepted-left-click path (i.e. when
   * navigate() is actually about to be called) — modifier-key clicks
   * that fall through to default browser behaviour bypass it. Keep
   * the callback fast; it runs on the click handler's hot path.
   */
  onBeforeNavigate?: () => void;

  children: ReactNode;
}

export default function HeroLink({
  heroName,
  href,
  children,
  className,
  onBeforeNavigate,
  ...rest
}: HeroLinkProps) {
  const { navigate } = useViewTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Respect modifier keys (cmd-click → new tab, etc.) and middle/right
    // mouse buttons. Only intercept plain left clicks.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    e.preventDefault();
    onBeforeNavigate?.();
    navigate(href.toString());
  };

  // Keyboard activation (Enter on a focused link) should also use the
  // view-transition path so screen-reader users get the same UX.
  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onBeforeNavigate?.();
      navigate(href.toString());
    }
  };

  return (
    <Link
      {...rest}
      href={href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
      // Inline style so the consumer doesn't have to wire Tailwind's
      // arbitrary-value syntax for view-transition-name. The browser
      // ignores unknown properties so this is safe in unsupported
      // browsers. When `heroName` is omitted (R42), we don't set the
      // attribute at all — the parent wrapper owns the morph target.
      style={{
        ...((rest as { style?: React.CSSProperties }).style ?? {}),
        ...(heroName ? { viewTransitionName: heroName } : {}),
      }}
    >
      {children}
    </Link>
  );
}
