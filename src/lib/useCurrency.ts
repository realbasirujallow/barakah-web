'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const CURRENCY_KEY = 'barakah_preferred_currency';
const CURRENCY_CHANGE_EVENT = 'barakah:currency-change';

// ── External store helpers ─────────────────────────────────────────────────
// These feed useSyncExternalStore so any mounted component re-renders when
// the preferred currency changes — whether the change happens in this tab
// (via the custom event) or in another tab (via the storage event).

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (e: StorageEvent) => { if (e.key === CURRENCY_KEY) cb(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CURRENCY_CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CURRENCY_CHANGE_EVENT, cb);
  };
}

function snapshot(): string {
  if (typeof window === 'undefined') return 'USD';
  return localStorage.getItem(CURRENCY_KEY) || 'USD';
}

function serverSnapshot(): string {
  return 'USD';
}

/**
 * Returns a currency formatter bound to the user's preferred currency.
 *
 * Usage in any dashboard page/component:
 *   const { fmt, currency } = useCurrency();
 *   <p>{fmt(1234.56)}</p>   // → "$1,234.56" (or "€1,234.56", etc.)
 *
 * The currency preference is read from localStorage (key: barakah_preferred_currency).
 * It gets saved there by the profile page whenever the user's profile is loaded
 * or updated, and subscribers are notified via a custom event so already-mounted
 * pages repaint without a full reload.
 * Defaults to 'USD' if no preference is stored.
 */
export function useCurrency(): { fmt: (n: number) => string; currency: string; symbol: string } {
  const currency = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  const fmt = useCallback(
    (n: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n),
    [currency]
  );

  // Extract the currency symbol (e.g., "$", "€", "£", "﷼")
  const symbol = useMemo(
    () =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency })
        .formatToParts(0)
        .find(p => p.type === 'currency')?.value ?? currency,
    [currency]
  );

  return { fmt, currency, symbol };
}

/**
 * Save the user's preferred currency to localStorage and notify all subscribers
 * (mounted components using `useCurrency`) so they repaint without a full reload.
 * Call this after loading/updating the user profile.
 */
export function saveCurrencyPreference(currency: string): void {
  if (typeof window !== 'undefined' && currency) {
    localStorage.setItem(CURRENCY_KEY, currency);
    // Notify same-tab subscribers — the native `storage` event only fires in
    // other tabs, so we dispatch a custom event for the current tab.
    window.dispatchEvent(new Event(CURRENCY_CHANGE_EVENT));
  }
}
