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

// CSS View Transitions API — feature detection.
type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  };
};

export function useViewTransition() {
  const router = useRouter();

  /**
   * Navigate to `href`. When the browser supports View Transitions,
   * wraps `router.push` in `document.startViewTransition` so any
   * matching `viewTransitionName` elements morph between pages.
   * Falls through to plain `router.push` otherwise.
   */
  const navigate = useCallback(
    (href: string) => {
      if (typeof window === 'undefined') return;
      const doc = document as DocumentWithVT;
      if (!doc.startViewTransition) {
        router.push(href);
        return;
      }
      doc.startViewTransition(() => {
        router.push(href);
      });
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
      const doc = document as DocumentWithVT;
      if (!doc.startViewTransition) {
        router.replace(href);
        return;
      }
      doc.startViewTransition(() => {
        router.replace(href);
      });
    },
    [router],
  );

  return { navigate, replace };
}
