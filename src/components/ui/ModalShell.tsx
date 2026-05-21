'use client';
import { useEffect, type ReactNode, type MouseEvent } from 'react';

/**
 * Standard modal backdrop: closes on outside-click and Escape; clicks inside
 * the content do not close. Locks body scroll while open. Replaces the
 * ad-hoc `<div className="fixed inset-0 bg-black/50 ...">` wrappers.
 */
export default function ModalShell({
  onClose,
  children,
  className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
}: {
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className={className} onClick={onClose}>
      <div style={{ display: 'contents' }} onClick={(e: MouseEvent) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
