'use client';

import { useSyncExternalStore } from 'react';

/**
 * Phase 6.3 (Apr 27 2026) — typed media-query hook.
 *
 * Used to switch between desktop modal patterns (centered Dialog) and
 * mobile-native bottom-sheet patterns (Drawer) without a flash of
 * incorrect chrome on first render.
 *
 * SSR-safe: returns `defaultValue` (false) until the client mounts and
 * the matchMedia listener attaches. The first paint matches what the
 * server rendered, then the value updates if the media query is true.
 *
 * Standard breakpoints:
 *   "(min-width: 640px)"  — Tailwind sm
 *   "(min-width: 768px)"  — Tailwind md (recommended for "is desktop?")
 *   "(min-width: 1024px)" — Tailwind lg
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {};
      }

      const mql = window.matchMedia(query);
      const handler = () => onStoreChange();
      // addEventListener is supported in all evergreen browsers; older
      // Safari only supports addListener but Tailwind v4 already requires
      // a modern target so we skip the polyfill.
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    },
    () =>
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia(query).matches
        : defaultValue,
    () => defaultValue,
  );
}

/** Convenience: returns true on screens ≥ 768px. SSR returns false. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)', false);
}
