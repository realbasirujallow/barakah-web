import { useEffect, RefObject } from 'react';

/**
 * Trap Tab / Shift+Tab focus within `ref` while `active` is true.
 *
 * Modal accessibility checklist already implemented sitewide:
 *   • role="dialog" + aria-modal="true" + aria-labelledby
 *   • Escape handler that closes the modal
 *   • Focus trap (this hook — Round 27)
 *
 * Why we need this: a modal with role="dialog" that does not trap focus
 * will leak Tab to the underlying page. Keyboard-only users end up
 * interacting with elements they can't see, and screen readers announce
 * cards and nav items from behind the overlay. This is a recurring gap
 * on every modal we ship — the cheapest fix is a shared hook.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(ref, isOpen);
 *   return isOpen ? <div ref={ref} role="dialog" aria-modal="true">...</div> : null;
 *
 * Implementation notes:
 *   • Queries focusable descendants of `ref` on each Tab so newly-mounted
 *     children (e.g. error messages) are reachable without re-initializing.
 *   • Focuses the first focusable child when `active` flips to true, and
 *     restores focus to whatever had it previously when `active` flips off.
 *   • No-op on SSR (`window` guard).
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;

    const container = ref.current;
    if (!container) return;

    // Remember what had focus before the modal opened so we can restore
    // it on close — important for keyboard users navigating back.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the first focusable child on open so keyboard users enter
    // the dialog immediately instead of still being on the page behind.
    const initialFocusables = getFocusable(container);
    if (initialFocusables.length > 0) {
      initialFocusables[0].focus();
    } else {
      // Nothing focusable? Make the container itself focusable so Tab
      // doesn't escape on the very first press.
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = getFocusable(container);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      // Shift+Tab on first → wrap to last.
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
        return;
      }
      // Tab on last → wrap to first.
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Restore prior focus so the keyboard user resumes where they were.
      try { previouslyFocused?.focus(); } catch { /* element gone */ }
    };
  }, [active, ref]);
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
}
