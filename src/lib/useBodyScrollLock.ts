'use client';

import { useEffect } from 'react';

/**
 * Body-scroll lock for modals.
 *
 * 2026-05-02: founder reported (multiple times) that opening a modal
 * on the admin /dashboard/admin user list left the underlying page
 * still scrollable, and the modal sometimes appeared "below the
 * fold." Two compounding issues:
 *
 *   1. Without scroll-lock, the user can scroll the backdrop list
 *      while the modal is open, so the modal feels disconnected
 *      from the user's reading position.
 *   2. On iOS Safari + some Android Chrome configurations, the
 *      address-bar collapse behaviour means `100vh` measures TALLER
 *      than the visible viewport. A modal sized at `max-h-[90vh]`
 *      can end up below the actual visible area until the address
 *      bar collapses.
 *
 * This hook locks `document.body` scroll while the modal is mounted
 * AND preserves the user's scroll position so closing the modal
 * lands them back on the same row in the list. It also restores any
 * existing inline body styles on unmount so it can stack with other
 * scroll-locking libraries (rare but defensive).
 *
 * Usage:
 *   useBodyScrollLock(true);  // inside the modal component body
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    // Capture the current scroll position so we can restore it on
    // unmount. Setting `position: fixed` on body would scroll the
    // document to top — preserving + restoring is what makes the
    // close-modal experience feel native.
    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Compensate for the disappearing scrollbar so layout doesn't
    // shift when scroll-lock kicks in. Without this, the page
    // visibly "jumps" when the modal opens.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      // Restore exact scroll position. Using `instant` so the page
      // doesn't smooth-scroll when closing — feels like the modal
      // simply disappears.
      window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
    };
  }, [active]);
}
