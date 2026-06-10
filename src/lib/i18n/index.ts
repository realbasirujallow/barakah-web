// 2026-06-10 (intl SEO round 3 / audit M2-1): the four locale dictionaries
// were extracted to ./dictionaries/{en,ar,ur,fr}.ts — the original single
// i18n.ts was 1.1MB and tripped Babel's 500KB style-deopt on every build.
// Public import surface ('@/lib/i18n') and runtime behavior are unchanged.
import { useSyncExternalStore, useCallback, useMemo } from 'react';
import type { Translations } from './types';
import { en } from './dictionaries/en';
import { ar } from './dictionaries/ar';
import { ur } from './dictionaries/ur';
import { fr } from './dictionaries/fr';

const dictionaries: Record<string, Translations> = { en, ar, ur, fr };

/** localStorage key for persisted locale selection. Must match the pre-paint
 *  script in app/layout.tsx that reads this to set <html dir="rtl"> before
 *  paint (avoids RTL-flash on cold loads for Arabic / Urdu users). */
export const LOCALE_STORAGE_KEY = 'barakah_locale';

/** Locales that render right-to-left. */
const RTL_LOCALES = new Set(['ar', 'ur', 'fa', 'he']);

function readStoredLocale(): string {
  if (typeof window === 'undefined') return 'en';
  // ?lang=xx query override (BUG-PUBSITE-LOCALE 2026-05-26): anonymous
  // visitors landing from paid-ad links with ?lang=fr/ar/ur must see the
  // requested locale before the language switcher is ever clicked.
  try {
    const params = new URLSearchParams(window.location.search);
    const qp = params.get('lang');
    if (qp && dictionaries[qp]) {
      try { window.localStorage.setItem(LOCALE_STORAGE_KEY, qp); } catch {}
      return qp;
    }
  } catch {
    /* SSR safety */
  }
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && dictionaries[stored]) return stored;
  } catch {
    /* private-mode / SSR */
  }
  return 'en';
}

let currentLocale = readStoredLocale();
const listeners = new Set<() => void>();

function emitLocaleChange() {
  for (const listener of listeners) listener();
}

function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function localeSnapshot() {
  return currentLocale;
}

function localeServerSnapshot() {
  return 'en';
}

/** Set the active locale. Persists to localStorage and updates the
 *  <html dir> attribute so RTL scripts align correctly. */
export function setLocale(locale: string) {
  currentLocale = dictionaries[locale] ? locale : 'en';
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale);
    } catch {
      /* quota / private mode — non-fatal */
    }
    try {
      document.documentElement.dir = RTL_LOCALES.has(currentLocale) ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLocale;
    } catch {
      /* DOM not ready — pre-paint script has us covered */
    }
    // LOC-1 (2026-05-21): number/date formatting now follows the UI language
    // (see useCurrency.localeSnapshot). Notify useCurrency subscribers in this
    // tab so amounts/dates repaint immediately on a language switch, not just
    // on the next reload.
    try {
      window.dispatchEvent(new Event('barakah:currency-change'));
    } catch {
      /* SSR safety */
    }
  }
  emitLocaleChange();
}

/** Get the current locale. */
export function getLocale(): string {
  return currentLocale;
}

/** Whether a locale is right-to-left. */
export function isRtl(locale: string = currentLocale): boolean {
  return RTL_LOCALES.has(locale);
}

/** Translate a key. Falls back to English if key is missing in current locale. */
export function t(key: string, locale: string = currentLocale): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
}

/**
 * Translate a key with positional placeholders. Each {0}, {1}, ... in the
 * resolved string is replaced with the corresponding stringified argument.
 * Args left undefined are rendered as empty strings.
 */
export function tFmt(key: string, args: ReadonlyArray<string | number>, locale: string = currentLocale): string {
  const raw = t(key, locale);
  return raw.replace(/\{(\d+)\}/g, (_, n) => {
    const v = args[Number(n)];
    return v === undefined || v === null ? '' : String(v);
  });
}

/** Available locales with display names. */
export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
  { code: 'fr', label: 'Français' },
] as const;

export function useI18n() {
  const locale = useSyncExternalStore(subscribeLocale, localeSnapshot, localeServerSnapshot);
  // 2026-06-06 (BUG-PROD-AUDIT-LOAD): memoize `t` and `tFmt` so their
  // references are stable across renders for a given locale. Previously
  // every useI18n() call returned a fresh inline arrow — and any
  // component that listed `t` in a useEffect dependency array (e.g.
  // /dashboard/admin/audit-log/page.tsx) would re-run that effect on
  // every render, causing setLoading(true)/fetch loops that never
  // resolved to a render of the loaded data. The audit-log page was
  // stuck on "Loading…" forever on prod even though the API returned
  // 200 in <500ms.
  const tCb = useCallback((key: string) => t(key, locale), [locale]);
  const tFmtCb = useCallback(
    (key: string, args: ReadonlyArray<string | number>) => tFmt(key, args, locale),
    [locale],
  );
  // Memoize the returned object too so destructuring callers that depend
  // on the whole hook return value (rare but possible) don't re-render.
  return useMemo(
    () => ({
      locale,
      t: tCb,
      tFmt: tFmtCb,
      setLocale,
      isRtl: isRtl(locale),
      locales: SUPPORTED_LOCALES,
    }),
    [locale, tCb, tFmtCb],
  );
}
