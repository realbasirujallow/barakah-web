'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const CURRENCY_KEY = 'barakah_preferred_currency';
const LOCALE_KEY = 'barakah_locale';
const CURRENCY_CHANGE_EVENT = 'barakah:currency-change';

// ── External store helpers ─────────────────────────────────────────────────
// These feed useSyncExternalStore so any mounted component re-renders when
// the preferred currency changes — whether the change happens in this tab
// (via the custom event) or in another tab (via the storage event).

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === CURRENCY_KEY || e.key === LOCALE_KEY) cb();
  };
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

function localeSnapshot(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  // Round 23: locale preference can come from 3 sources, in priority
  // order:
  //   1. `barakah_locale` localStorage (explicit user override)
  //   2. `navigator.language` (browser default — matches OS locale)
  //   3. undefined → `Intl.NumberFormat` picks the user-agent default
  // We NEVER hardcode `en-US` anymore. A French user in Paris with
  // their browser set to fr-FR sees `1 234,56 €` for EUR instead of
  // `€1,234.56`; Arabic users see `١٬٢٣٤٫٥٦ د.إ` for AED.
  return (
    localStorage.getItem(LOCALE_KEY) ||
    (typeof navigator !== 'undefined' ? navigator.language : undefined) ||
    undefined
  );
}

function localeServerSnapshot(): string | undefined {
  // On the server there's no navigator and no localStorage. Returning
  // undefined lets Intl.NumberFormat use its default (which on the
  // server is typically en-US via Node). The first client render will
  // swap to the real browser locale.
  return undefined;
}

/**
 * Returns a currency formatter bound to the user's preferred currency
 * AND the user's browser locale (for digit grouping, decimal separator,
 * RTL symbol placement, native-digit rendering).
 *
 * Usage in any dashboard page/component:
 *   const { fmt, currency } = useCurrency();
 *   <p>{fmt(1234.56)}</p>   // → "$1,234.56" (en-US)
 *                           // → "1 234,56 €" (fr-FR)
 *                           // → "١٬٢٣٤٫٥٦ د.إ" (ar-AE)
 *
 * The currency preference is read from localStorage (key:
 * `barakah_preferred_currency`); the locale from `barakah_locale` or
 * the browser default. Defaults to USD / user-agent locale if none
 * are stored.
 */
export function useCurrency(): {
  fmt: (n: number) => string;
  currency: string;
  symbol: string;
  /** Current locale used for formatting — exposed for other helpers
   *  (e.g. `toLocaleDateString`) so the whole app speaks one locale. */
  locale: string | undefined;
} {
  const currency = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const locale = useSyncExternalStore(subscribe, localeSnapshot, localeServerSnapshot);

  const fmt = useCallback(
    (n: number) =>
      new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n),
    [currency, locale]
  );

  // Extract the currency symbol (e.g., "$", "€", "£", "﷼"). The locale
  // affects which script the symbol renders in (Arabic vs Latin), so
  // we resolve it here with the locale too.
  const symbol = useMemo(
    () =>
      new Intl.NumberFormat(locale, { style: 'currency', currency })
        .formatToParts(0)
        .find(p => p.type === 'currency')?.value ?? currency,
    [currency, locale]
  );

  return { fmt, currency, symbol, locale };
}

/**
 * Save the user's preferred currency to localStorage and notify all subscribers
 * (mounted components using `useCurrency`) so they repaint without a full reload.
 * Call this after loading/updating the user profile.
 */
export function saveCurrencyPreference(currency: string): void {
  if (typeof window !== 'undefined' && currency) {
    // Round 26: try/catch around setItem. In iOS Safari private mode or
    // when storage is full, setItem throws QuotaExceededError. Profile
    // page calls this between a successful server-side save and the
    // success toast — so a thrown exception would turn "saved" into
    // "failed" from the user's POV and skip the state update, even
    // though the backend already accepted the change. Same safety
    // pattern as the Round 24 `safeSetItem` used elsewhere.
    try {
      localStorage.setItem(CURRENCY_KEY, currency);
    } catch { /* quota / private mode — accept silently */ }
    // Notify same-tab subscribers — the native `storage` event only fires in
    // other tabs, so we dispatch a custom event for the current tab.
    window.dispatchEvent(new Event(CURRENCY_CHANGE_EVENT));
  }
}

/**
 * Round 23: explicit locale override, persisted to localStorage. Most
 * users never need this — `useCurrency` defaults to `navigator.language`
 * which matches the OS locale on all modern browsers. Use this only if
 * we add a "Language" dropdown in Settings later.
 */
export function saveLocalePreference(locale: string): void {
  if (typeof window !== 'undefined' && locale) {
    // Round 26: same safeSetItem treatment as saveCurrencyPreference.
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch { /* quota / private mode — accept silently */ }
    window.dispatchEvent(new Event(CURRENCY_CHANGE_EVENT));
  }
}
