'use client';

import { useState } from 'react';

const CURRENCY_KEY = 'barakah_preferred_currency';

/**
 * Returns a currency formatter bound to the user's preferred currency.
 *
 * Usage in any dashboard page/component:
 *   const { fmt, currency } = useCurrency();
 *   <p>{fmt(1234.56)}</p>   // → "$1,234.56" (or "€1,234.56", etc.)
 *
 * The currency preference is read from localStorage (key: barakah_preferred_currency).
 * It gets saved there by the profile page whenever the user's profile is loaded.
 * Defaults to 'USD' if no preference is stored.
 */
export function useCurrency(): { fmt: (n: number) => string; currency: string; symbol: string } {
  const [currency] = useState<string>(() => {
    if (typeof window === 'undefined') return 'USD';
    return localStorage.getItem(CURRENCY_KEY) ?? 'USD';
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

  // Extract the currency symbol (e.g., "$", "€", "£", "﷼")
  const symbol = new Intl.NumberFormat('en-US', { style: 'currency', currency })
    .formatToParts(0)
    .find(p => p.type === 'currency')?.value ?? currency;

  return { fmt, currency, symbol };
}

/**
 * Save the user's preferred currency to localStorage.
 * Call this after loading/updating the user profile.
 */
export function saveCurrencyPreference(currency: string): void {
  if (typeof window !== 'undefined' && currency) {
    localStorage.setItem(CURRENCY_KEY, currency);
  }
}
