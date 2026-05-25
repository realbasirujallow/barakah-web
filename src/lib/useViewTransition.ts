/**
 * View Transitions wrapper for Next.js navigation.
 *
 * R41 (2026-05-01): closes the "hero animations dashboard → detail"
 * Monarch-parity gap. Uses the browser-native CSS View Transitions
 * API instead of a 50KB framer-motion dependency. Progressive
 * enhancement — supported browsers (Chrome 111+, Edge 111+, Safari
 * 18) get a smooth shared-element morph between the dashboard card
 * and the detail-page hero. Unsupported browsers (older Safari,
 * Firefox) fall through to a plain instant navigation.
 *
 * The pattern:
 *   1. Source element (e.g. the Net Worth KPI card on the dashboard)
 *      sets `style={{ viewTransitionName: 'net-worth-card' }}`.
 *   2. Target element (the hero on /dashboard/net-worth) sets the
 *      same `viewTransitionName`.
 *   3. Navigation goes through `useViewTransition().navigate(href)`
 *      which wraps `router.push` in `document.startViewTransition`.
 *   4. Browser interpolates the matching named elements between the
 *      old + new DOM trees.
 *
 * Why not `framer-motion`?
 *   • +50KB gzipped for a feature that's now native to the platform
 *   • View Transitions API works across full-page navigations, which
 *     framer-motion does NOT (its layoutId only works inside one
 *     React tree — page navigation unmounts and remounts).
 *   • Falls back gracefully — older browsers just navigate instantly.
 *
 * Browser support (as of 2026-05-01):
 *   • Chrome / Edge 111+ — full
 *   • Safari 18 — full
 *   • Firefox — pending
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useViewTransition() {
  const router = useRouter();

  /**
   * Navigate to `href`.
   *
   * 2026-05-25 (FREEZE FIX): we previously wrapped `router.push` in
   * `document.startViewTransition(() => router.push(href))`. That is a
   * freeze trap with the Next.js App Router, especially on mobile:
   *
   *   1. startViewTransition snapshots the WHOLE current page and lays
   *      that screenshot over the live DOM.
   *   2. `router.push` is async/fire-and-forget — it starts an RSC fetch
   *      + render and returns immediately, BEFORE the new page paints.
   *   3. The browser keeps the frozen screenshot on top, swallowing taps
   *      and scroll, until the transition resolves. Over a slow mobile
   *      connection on a data-heavy page (budget, transactions, …) that
   *      gap is seconds — the page looks "frozen."
   *   4. Because push returns before the destination renders, the morph
   *      usually animates old→old anyway, so we paid the freeze cost for
   *      an animation that didn't even land.
   *
   * Since every dashboard sidebar link goes through HeroLink → navigate,
   * this froze a large fraction of navigations. The browser-native shared-
   * element morph simply isn't reliable across full-page App Router
   * navigations, so we navigate plainly. The hook + HeroLink API stay
   * intact so call sites don't change; this is purely the navigation
   * mechanism. (A future re-enable would need to await the route commit
   * before ending the transition — e.g. React's experimental
   * `unstable_ViewTransition` — not a bare push wrapper.)
   */
  const navigate = useCallback(
    (href: string) => {
      if (typeof window === 'undefined') return;
      router.push(href);
    },
    [router],
  );

  /**
   * Same as `navigate` but uses `router.replace` so the navigation
   * doesn't push onto the history stack. Useful for "swap detail
   * for another detail" flows where back-button shouldn't restore.
   */
  const replace = useCallback(
    (href: string) => {
      if (typeof window === 'undefined') return;
      router.replace(href);
    },
    [router],
  );

  return { navigate, replace };
}
