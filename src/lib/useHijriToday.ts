/**
 * R44 (2026-05-01) — shared Hijri-date hook with module-level cache.
 *
 * Founder feedback: "I need '14 Dhul Qadah 1447' to be up where the
 * Gregorian date is located." The Hijri date already lived in the
 * dashboard PAGE subtitle, but pages like /dashboard/analytics show
 * only the Gregorian date in the topbar. Lifting the fetch into the
 * dashboard LAYOUT makes the Hijri date visible on every dashboard
 * subpage.
 *
 * Why a module-level cache: the Hijri date is server-authoritative
 * (per the project's Halal-finance domain rules — Hijri must come
 * from the backend's hijri-converter, not client computation). It
 * also doesn't change within a session except at midnight, so a
 * single fetch per page-session is plenty. Each consumer gets the
 * cached promise rather than firing N parallel HTTP calls.
 */

'use client';

import { useEffect, useState } from 'react';
import { api } from './api';

export interface HijriToday {
  hijriDate: string;       // e.g. "14 Dhul Qadah 1447"
  hijriMonthName: string;
  isRamadan: boolean;
}

// Module-level cache of the in-flight or resolved promise. First caller
// pays the network cost; everyone else awaits the same promise. Cache
// lives for the entire client session — fine for a value that's stable
// across the day. Cleared automatically on full-page reload.
let cachedPromise: Promise<HijriToday | null> | null = null;

function fetchHijriOnce(): Promise<HijriToday | null> {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    try {
      const raw = await api.getIslamicCalendarToday();
      if (!raw || typeof raw !== 'object') return null;
      const data = raw as Partial<HijriToday>;
      if (!data.hijriDate) return null;
      return {
        hijriDate: data.hijriDate,
        hijriMonthName: data.hijriMonthName ?? '',
        isRamadan: Boolean(data.isRamadan),
      };
    } catch {
      // Don't keep a rejected promise pinned — let the next consumer
      // retry. We expose null so the UI can fall back to "Gregorian
      // only" if the backend is briefly unavailable, which is fine.
      cachedPromise = null;
      return null;
    }
  })();
  return cachedPromise;
}

export function useHijriToday(): HijriToday | null {
  const [data, setData] = useState<HijriToday | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchHijriOnce().then((value) => {
      if (!cancelled) setData(value);
    });
    return () => { cancelled = true; };
  }, []);
  return data;
}
