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

  useEffect(() => {
    // Remember the element that had focus before the dialog opened so
    // we can restore it on close (WAI-ARIA dialog pattern).
    restoreFocusToRef.current = (document.activeElement as HTMLElement) || null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
      try { restoreFocusToRef.current?.focus({ preventScroll: true }); } catch { /* no-op */ }
    };
  }, [onClose]);

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
      onClick={onClose}
    >
      <div style={{ display: 'contents' }} onClick={(e: MouseEvent) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
