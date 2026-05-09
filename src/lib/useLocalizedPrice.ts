'use client';

/**
 * Localized-price display helper for the pricing surfaces.
 *
 * Background (item K of the 2026-05-08 multilingual audit): Barakah's
 * pricing tiles on `/pricing`, `/dashboard/billing`, `/dashboard/profile`,
 * the press page and the comparison pages all hardcoded USD prices like
 * "$9.99/mo". A non-USD user sees those dollar signs even though Stripe
 * charges them in their local currency at checkout — the displayed price
 * never matched the price on their card.
 *
 * Stripe handles the actual cross-currency conversion via per-currency
 * Price IDs configured in the Stripe Dashboard. Those local prices may
 * not match a pure FX conversion (Stripe rounds to "round" local-currency
 * prices for marketing reasons — e.g. £9.99 instead of £7.91). So we
 * cannot pretend to predict Stripe's exact price.
 *
 * What this helper does instead:
 *   • For USD-currency users → returns the USD price verbatim.
 *   • For non-USD users → returns the USD price converted via current
 *     FX rates with a `~` prefix to flag that it's approximate, plus an
 *     `approximate: true` flag so the UI can show a "Final price in
 *     your local currency at checkout" caption.
 *
 * The conversion is best-effort: if the FX endpoint is unreachable, the
 * helper returns the USD price unchanged so the pricing page still
 * renders something. Caching is in-memory + sessionStorage so a single
 * fetch covers a session.
 *
 * Usage:
 *   const { localized, currency, approximate } = useLocalizedPrice('$9.99');
 *   // USD user:    localized="$9.99"  currency="USD"  approximate=false
 *   // UK user:     localized="~£7.91" currency="GBP"  approximate=true
 *
 *   {localized}{approximate && (
 *     <p className="text-xs text-gray-500">
 *       Charged in your local currency at checkout.
 *     </p>
 *   )}
 */

import { useEffect, useState } from 'react';
import { api } from './api';
import { useCurrency } from './useCurrency';

interface FxRates { base: string; rates: Record<string, number>; updatedAt?: string }

/** sessionStorage cache key — single fetch per browser session is enough.
 *  FX moves <1% intra-day for major Muslim-world currencies; the user
 *  isn't going to notice a 0.5% drift while comparing pricing tiles. */
const FX_CACHE_KEY = 'barakah_fx_rates_session';

let inFlight: Promise<FxRates | null> | null = null;

async function fetchRates(): Promise<FxRates | null> {
  // Try sessionStorage first.
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(FX_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as FxRates;
        if (parsed && parsed.rates && parsed.base) return parsed;
      }
    } catch { /* corrupt cache — fall through and re-fetch */ }
  }

  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const data = await api.getCurrencyRates() as FxRates;
      if (data && data.rates && data.base && typeof window !== 'undefined') {
        try { sessionStorage.setItem(FX_CACHE_KEY, JSON.stringify(data)); } catch { /* quota */ }
      }
      return data;
    } catch {
      inFlight = null; // retry next caller
      return null;
    }
  })();
  return inFlight;
}

function parseUsd(price: string): number | null {
  // Accepts "$9.99", "$99", "$14.99", "$149"
  const m = price.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

interface LocalizedPrice {
  /** Display string — pre-formatted in the user's locale + currency.
   *  Prefixed with "~" when approximate. */
  localized: string;
  /** ISO 4217 currency code that {@code localized} is denominated in. */
  currency: string;
  /** True when the displayed price was FX-converted (so it may differ
   *  from what Stripe actually charges at checkout). */
  approximate: boolean;
  /** True until the FX fetch settles. UI can show the USD price during
   *  this window and swap once we know the local equivalent. */
  loading: boolean;
}

/**
 * Hook: convert a USD price string ("$9.99") to the user's preferred
 * currency for display. Returns the USD price verbatim if the user is
 * USD, the conversion is unavailable, or the input doesn't parse.
 */
export function useLocalizedPrice(usdPrice: string): LocalizedPrice {
  const { currency, locale } = useCurrency();
  const [rates, setRates] = useState<FxRates | null>(null);
  // 2026-05-08: derive loading directly from (currency, rates) instead of
  // calling setLoading(false) synchronously inside the effect — that
  // pattern triggers a cascading re-render and the React lint rule
  // (react-hooks/set-state-in-effect) flags it. Computing loading on the
  // fly avoids the cascade and is functionally identical.
  const loading = currency !== 'USD' && rates === null;

  useEffect(() => {
    if (currency === 'USD') return;
    let cancelled = false;
    fetchRates().then((value) => {
      if (cancelled) return;
      setRates(value);
    });
    return () => { cancelled = true; };
  }, [currency]);

  if (currency === 'USD') {
    return { localized: usdPrice, currency: 'USD', approximate: false, loading: false };
  }

  const usd = parseUsd(usdPrice);
  if (usd === null) {
    return { localized: usdPrice, currency, approximate: false, loading };
  }
  if (!rates || !rates.rates) {
    // No FX yet — show USD as best-effort with the "approximate" flag
    // so the call site can still render the disclaimer caption.
    return { localized: usdPrice, currency, approximate: true, loading };
  }
  // The /api/currency/rates endpoint returns rates relative to a base
  // currency (typically USD). When base !== USD we need to bridge.
  let convertedAmount: number;
  if (rates.base === 'USD') {
    const r = rates.rates[currency];
    if (!r) return { localized: usdPrice, currency, approximate: true, loading };
    convertedAmount = usd * r;
  } else {
    const usdRate = rates.rates['USD'];
    const targetRate = rates.rates[currency];
    if (!usdRate || !targetRate) return { localized: usdPrice, currency, approximate: true, loading };
    convertedAmount = (usd / usdRate) * targetRate;
  }

  // Round to a sensible display value:
  //   - For currencies with very small unit (JPY/IDR/VND/KRW): round to whole units
  //   - For everything else: 2 decimals
  const noFractionCurrencies = new Set(['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'HUF']);
  const display = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: noFractionCurrencies.has(currency) ? 0 : 2,
    maximumFractionDigits: noFractionCurrencies.has(currency) ? 0 : 2,
  }).format(convertedAmount);

  return {
    localized: `~${display}`,
    currency,
    approximate: true,
    loading: false,
  };
}
