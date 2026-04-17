'use client';

// HIGH BUG FIX (H-2): This component always displays USD because it's used on
// public SEO / marketing pages (/zakat-calculator, /learn/*) where we don't
// know the viewer's locale, and authoritative nisab-threshold copy needs to
// match the USD figures quoted on the page content. Authenticated dashboard
// pages should NOT use this component; they should use useCurrency() so the
// display matches the user's configured display currency.
//
// Verified 2026-04-16: no authenticated page (src/app/dashboard/**) imports
// this component or any of its named exports. If a future author imports it
// inside /dashboard, migrate that caller to a currency-aware variant instead.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { api } from '../lib/api';

interface NisabData {
  goldPricePerGram: number;
  silverPricePerGram: number;
  nisabGoldGrams: number;
  nisabSilverGrams: number;
  nisabGoldThreshold: number;
  nisabSilverThreshold: number;
  goldPriceSource?: string;
  silverPriceSource?: string;
  priceAgeMs?: number;
  staleWarning?: boolean;
}

// Shared hook so multiple components on the same page share one fetch.
// TTL keeps cached data fresh — after 5 minutes we re-fetch to reflect
// live market price changes (gold/silver spot prices move intraday).
const CACHE_TTL_MS = 5 * 60 * 1000;
let _cache: { data: NisabData; at: number } | null = null;
let _promise: Promise<NisabData | null> | null = null;
const _cacheListeners = new Set<() => void>();

function notifyCacheListeners() {
  for (const cb of _cacheListeners) cb();
}

function fetchNisab(): Promise<NisabData | null> {
  if (_cache && Date.now() - _cache.at < CACHE_TTL_MS) {
    return Promise.resolve(_cache.data);
  }
  if (_promise) return _promise;
  _promise = api.getNisabInfo()
    .then((data: NisabData | null) => {
      if (data) {
        _cache = { data, at: Date.now() };
        notifyCacheListeners();
      }
      return data;
    })
    .catch(() => null)
    .finally(() => { _promise = null; });
  return _promise;
}

// useSyncExternalStore helpers — read the module cache without touching
// time/state during render (keeps react-hooks/purity + react-hooks/set-state-in-effect happy).
function subscribeCache(cb: () => void): () => void {
  _cacheListeners.add(cb);
  return () => { _cacheListeners.delete(cb); };
}

function getCachedSnapshot(): NisabData | null {
  return _cache ? _cache.data : null;
}

function getCachedServerSnapshot(): NisabData | null {
  return null;
}

/** Hook to get live nisab data from the backend API. */
export function useNisabData() {
  // Subscribe to the module cache so any consumer repaints instantly when a
  // fresh fetch completes, without us needing setState-in-effect.
  const data = useSyncExternalStore(subscribeCache, getCachedSnapshot, getCachedServerSnapshot);
  const [loading, setLoading] = useState(data === null);

  useEffect(() => {
    let cancelled = false;
    fetchNisab().then(d => {
      if (cancelled) return;
      if (d) setLoading(false);
      else setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/** Format a number as USD currency. */
function usd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function usdDecimal(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ── Inline value components ────────────────────────────────────────────────
// These render a single live value inline (e.g. inside a paragraph). They
// show a subtle loading skeleton while the API call is in flight.

function Skeleton({ width = 'w-16' }: { width?: string }) {
  return <span className={`inline-block ${width} h-4 bg-gray-200 rounded animate-pulse align-middle`} />;
}

/** Renders the live gold price per gram, e.g. "$97.50" */
export function GoldPricePerGram() {
  const { data, loading } = useNisabData();
  if (loading) return <Skeleton width="w-14" />;
  if (!data) return <span className="text-gray-500">—</span>;
  return <strong>{usdDecimal(data.goldPricePerGram)}</strong>;
}

/** Renders the live silver price per gram, e.g. "$1.05" */
export function SilverPricePerGram() {
  const { data, loading } = useNisabData();
  if (loading) return <Skeleton width="w-12" />;
  if (!data) return <span className="text-gray-500">—</span>;
  return <strong>{usdDecimal(data.silverPricePerGram)}</strong>;
}

/** Renders the live gold nisab threshold in USD, e.g. "$8,288" */
export function GoldNisabUSD() {
  const { data, loading } = useNisabData();
  if (loading) return <Skeleton width="w-16" />;
  if (!data) return <span className="text-gray-500">—</span>;
  return <strong>{usd(data.nisabGoldThreshold)}</strong>;
}

/** Renders the live silver nisab threshold in USD, e.g. "$626" */
export function SilverNisabUSD() {
  const { data, loading } = useNisabData();
  if (loading) return <Skeleton width="w-16" />;
  if (!data) return <span className="text-gray-500">—</span>;
  return <strong>{usd(data.nisabSilverThreshold)}</strong>;
}

// ── Full nisab card ────────────────────────────────────────────────────────
// Standalone card showing all four live values. Drop it into any page.

interface NisabLivePricesProps {
  /** Show the comparison table variant (for nisab-threshold page). */
  variant?: 'card' | 'table';
}

export default function NisabLivePrices({ variant = 'card' }: NisabLivePricesProps) {
  const { data, loading } = useNisabData();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-200 rounded-xl p-6 my-6 animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-6 text-center text-amber-800 text-sm">
        Live prices are temporarily unavailable. Visit our{' '}
        <a href="/dashboard/zakat" className="underline font-semibold">zakat dashboard</a>{' '}
        for current nisab thresholds.
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="overflow-x-auto my-6">
        <table className="w-full border border-gray-300">
          <thead className="bg-[#1B5E20] text-white">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Aspect</th>
              <th className="border border-gray-300 p-3 text-left">Gold ({data.nisabGoldGrams}g)</th>
              <th className="border border-gray-300 p-3 text-left">Silver ({data.nisabSilverGrams}g)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-gray-300 p-3 font-semibold">Weight</td>
              <td className="border border-gray-300 p-3">{data.nisabGoldGrams} grams</td>
              <td className="border border-gray-300 p-3">{data.nisabSilverGrams} grams</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">Price per Gram</td>
              <td className="border border-gray-300 p-3">{usdDecimal(data.goldPricePerGram)}</td>
              <td className="border border-gray-300 p-3">{usdDecimal(data.silverPricePerGram)}</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-3 font-semibold">Current Nisab (USD)</td>
              <td className="border border-gray-300 p-3 font-bold text-[#1B5E20]">{usd(data.nisabGoldThreshold)}</td>
              <td className="border border-gray-300 p-3 font-bold text-amber-700">{usd(data.nisabSilverThreshold)}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">Recommended by</td>
              <td className="border border-gray-300 p-3">AMJA, Contemporary Scholars</td>
              <td className="border border-gray-300 p-3">Hanafi Madhab (Traditional)</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-3 font-semibold">Price Availability</td>
              <td className="border border-gray-300 p-3">Widely published daily</td>
              <td className="border border-gray-300 p-3">Less commonly quoted</td>
            </tr>
          </tbody>
        </table>
        {data.staleWarning && (
          <p className="text-xs text-amber-600 mt-2">⚠️ Prices may be delayed. Check back later for the latest rates.</p>
        )}
      </div>
    );
  }

  const goldSource = data.goldPriceSource ?? 'live';
  const silverSource = data.silverPriceSource ?? 'live';
  const usingBackupSource = goldSource !== 'live' || silverSource !== 'live';
  const ageMinutes = typeof data.priceAgeMs === 'number'
    ? Math.max(0, Math.round(data.priceAgeMs / 60000))
    : null;

  let freshnessLabel = 'Updated automatically from live market data';
  if (usingBackupSource) {
    freshnessLabel = 'Using a backup pricing source while the live feed refreshes';
  } else if (ageMinutes != null && ageMinutes > 0) {
    freshnessLabel = `Updated automatically from market data · ${ageMinutes} min ago`;
  }

  // Default: card variant
  return (
    <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-200 rounded-xl p-6 my-6">
      <h3 className="font-bold text-[#1B5E20] mb-1 text-lg">Live Nisab Thresholds</h3>
      <p className="text-xs text-gray-500 mb-4">{freshnessLabel}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Gold ({data.nisabGoldGrams}g)</p>
          <p className="text-2xl font-bold text-[#1B5E20]">{usd(data.nisabGoldThreshold)}</p>
          <p className="text-xs text-gray-500">{usdDecimal(data.goldPricePerGram)} / gram</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Silver ({data.nisabSilverGrams}g)</p>
          <p className="text-2xl font-bold text-amber-700">{usd(data.nisabSilverThreshold)}</p>
          <p className="text-xs text-gray-500">{usdDecimal(data.silverPricePerGram)} / gram</p>
        </div>
      </div>
      {usingBackupSource && (
        <p className="text-xs text-amber-700 mt-3">
          Gold source: {goldSource}. Silver source: {silverSource}.
        </p>
      )}
      {data.staleWarning && (
        <p className="text-xs text-amber-600 mt-3">⚠️ Prices may be delayed. Check back later for the latest rates.</p>
      )}
    </div>
  );
}
