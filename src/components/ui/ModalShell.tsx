'use client';
import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';

/**
 * Standard modal backdrop: closes on outside-click and Escape; clicks inside
 * the content do not close. Locks body scroll while open. Replaces the
 * ad-hoc `<div className="fixed inset-0 bg-black/50 ...">` wrappers.
 *
 * 2026-06-06 A11Y-DIALOG-1 (overnight R1b a11y dimension):
 *   - Root carries role="dialog" + aria-modal="true" — screen readers now
 *     announce the dialog and treat siblings as inert.
 *   - `aria-labelledby` / `aria-describedby` props let consumers point at
 *     their own heading + paragraph for the accessible name + description
 *     (the React community a11y pattern). Both are optional; consumers
 *     that don't supply them still get a usable dialog (screen readers
 *     fall back to the visible text inside).
 *   - Focus is moved into the dialog on open (the dialog root has
 *     tabIndex={-1} as a fallback target). Focus is restored to the
 *     element that opened the dialog on close.
 *   - A tab-key handler implements a basic focus-trap: tabbing past the
 *     last focusable element wraps to the first, shift-tab from the first
 *     wraps to the last. Prevents screen-reader/keyboard users from
 *     escaping the dialog into the (now-inert) page behind.
 */
export default function ModalShell({
  onClose,
  children,
  className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
}: {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Element id whose visible text is the dialog's accessible name (preferred). */
  ariaLabelledBy?: string;
  /** Element id whose visible text is the dialog's accessible description. */
  ariaDescribedBy?: string;
  /** Fallback when no heading exists to point at — a literal string. */
  ariaLabel?: string;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusToRef = useRef<HTMLElement | null>(null);

  // 2026-06-08 (FREEZE-MODAL-1, founder report — clicking a few txn rows
  // then scrolling froze /dashboard/transactions): the prior effect's
  // dep array was [onClose]. Consumers pass an inline `() => setX(false)`
  // arrow which is a NEW function every parent render. That made the
  // entire effect (capture focus → add keydown listener → lock body
  // overflow → move focus into dialog) tear down + re-run on EVERY
  // parent re-render while the modal was open. The "move focus into
  // dialog" step yanks the cursor mid-scroll, the listener add/remove
  // churns, and on big trees React's reconciliation thrashes — the
  // page reads as frozen.
  //
  // Split: onClose lives in a ref so the keydown handler sees the
  // latest closure, but the setup/teardown effect runs ONLY on mount
  // and unmount.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    // Remember the element that had focus before the dialog opened so
    // we can restore it on close (WAI-ARIA dialog pattern).
    restoreFocusToRef.current = (document.activeElement as HTMLElement) || null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      // Basic focus trap: cycle Tab/Shift+Tab among interactive descendants.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    // Lock body scroll while the dialog is open — preserves the pre-open
    // value so a nested modal doesn't accidentally re-enable scroll on close.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog. Try to focus the first interactive child;
    // fall back to the dialog root itself (tabIndex={-1} makes that legal).
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables && focusables.length > 0) {
      focusables[0].focus({ preventScroll: true });
    } else if (dialogRef.current) {
      dialogRef.current.focus({ preventScroll: true });
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      // Restore focus to the trigger on close so keyboard users don't get
      // dumped at the top of the document.
      // 2026-06-08 (DESIGN-MODAL-1): guard against restoring focus to a
      // detached node — that would silently yank scroll position. Only
      // restore when the trigger is still attached.
      const target = restoreFocusToRef.current;
      if (target && document.contains(target)) {
        try { target.focus({ preventScroll: true }); } catch { /* no-op */ }
      }
    };
    // Empty deps: setup once on mount, tear down on unmount. Latest
    // onClose closure is reached via onCloseRef.
     
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      tabIndex={-1}
      className={className}
      onClick={() => onCloseRef.current()}
    >
      <div style={{ display: 'contents' }} onClick={(e: MouseEvent) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
