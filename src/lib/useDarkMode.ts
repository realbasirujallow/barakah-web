'use client';

import { useSyncExternalStore } from 'react';

// ── Dark-mode external store helpers ────────────────────────────────────────
// These feed useSyncExternalStore so any component can react to class changes
// on <html>. Reading the `dark` class directly (instead of mirroring it in
// React state) avoids the react-hooks/set-state-in-effect lint warning and
// guarantees we never drift from the DOM's view — which is already the
// authoritative source because the class is applied by a bootstrap script
// before hydration to prevent FOUC.

/** Subscribe to class-attribute mutations on <html>. */
export function darkModeSubscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/** Client snapshot — reads the authoritative DOM state. */
export function darkModeSnapshot(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/** Server snapshot — always false so SSR output is deterministic. The
 *  bootstrap script flips the class before hydration so client/server match. */
export function darkModeServerSnapshot(): boolean {
  return false;
}

/** Read the current dark-mode flag via useSyncExternalStore. */
export function useDarkMode(): boolean {
  return useSyncExternalStore(darkModeSubscribe, darkModeSnapshot, darkModeServerSnapshot);
}

/** Toggle dark mode: flips the class on <html> and persists to localStorage.
 *  The MutationObserver in darkModeSubscribe wakes subscribers so React
 *  re-renders with the new value. */
export function toggleDarkMode(): void {
  if (typeof document === 'undefined') return;
  const next = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', next);
  try { localStorage.setItem('barakah_dark_mode', String(next)); } catch {}
}
