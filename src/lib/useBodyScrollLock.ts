'use client';

import { useEffect } from 'react';

/**
 * Body-scroll lock for modals.
 *
 * 2026-05-02: founder reported (multiple times) that opening a modal
 * left the underlying page still scrollable. This hook locks
 * `document.body` scroll while a modal is mounted and restores the
 * previous overflow value on unmount.
 *
 * 2026-05-02 (later, after a freeze report): SIMPLIFIED. The earlier
 * version tried to (a) compensate for the disappearing scrollbar with
 * paddingRight and (b) restore exact scroll position via
 * `window.scrollTo({ behavior: 'instant' })`. Both were sources of
 * subtle bugs:
 *   • The dashboard scroll lives on `<main className="overflow-auto">`
 *     not `document.body`, so `window.scrollY` was ~0 and scrollTo
 *     accomplished nothing useful.
 *   • `behavior: 'instant'` is not standardised; older Safari throws
 *     or silently coerces, which interacted badly with the modal
 *     mount path on /dashboard/admin and /dashboard/analytics and
 *     caused the modal to either not render or appear frozen.
 *
 * The simplified version only saves+restores `body.overflow`. That's
 * the smallest change that delivers the actual goal (parent page
 * doesn't scroll while modal is open) without touching scroll
 * position or layout. The dashboard's `<main>` keeps its own scroll
 * state so the user lands back where they were when the modal closes.
 *
 * Usage:
 *   useBodyScrollLock(true);  // inside the modal component body
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
