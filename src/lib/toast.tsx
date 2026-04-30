'use client';

/**
 * Phase 2.5 (Apr 27 2026) — toast layer migrated to Sonner.
 *
 * Public API is unchanged so the 45 call sites that already do
 * `const { toast } = useToast(); toast('saved', 'success')` keep
 * working. Under the hood we now render a single <Toaster richColors />
 * (provided by `src/components/ui/sonner.tsx`) instead of the hand-
 * rolled fixed-positioning <div> + setTimeout cleanup.
 *
 * Why bother:
 *   • Sonner stacks/animates better, handles dismiss + keyboard.
 *   • `richColors` gives semantic green/red/blue without us authoring
 *     three more className branches.
 *   • Built-in screen-reader semantics — Round-22's manual
 *     role="alert" for errors, role="status" for success/info is now
 *     handled by Sonner's `type` attribute.
 *   • One <Toaster /> in the layout, no provider boilerplate per route.
 *
 * The `ToastProvider` symbol is kept as a transparent passthrough so
 * existing layouts that wrap `<ToastProvider>{children}</ToastProvider>`
 * don't need to change. Removing the provider entirely would force a
 * broader sweep of layout files for no real benefit.
 */

import { useCallback, type ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';

type ToastType = 'error' | 'success' | 'info';

interface ToastApi {
  toast: (message: string, type?: ToastType) => void;
}

/** Pass-through provider — the actual toast surface is mounted globally
 *  in app/layout.tsx via <Toaster richColors />. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Identical signature to the pre-Sonner hook so call sites don't change. */
export function useToast(): ToastApi {
  const toast = useCallback((message: string, type: ToastType = 'error') => {
    if (type === 'error') {
      sonnerToast.error(message);
    } else if (type === 'success') {
      sonnerToast.success(message);
    } else {
      sonnerToast.info(message);
    }
  }, []);
  return { toast };
}
