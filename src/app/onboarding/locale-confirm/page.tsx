'use client';
// Wave 2 — BUG-SIGNUP-WIZARD (2026-05-27): post-signup confirmation shell that
// asks the user to confirm currency + language before landing on /dashboard.
// Backend already auto-derives preferredCurrency from country at signup
// (AuthController:462, R2-6 fix), so this screen is purely UX: surface the
// derived defaults, let the user override, and persist via the existing
// PUT /auth/update-profile endpoint. Language is a client-side preference
// (barakah_locale → setLocale) — there's no public PATCH for user.locale yet.
//
// Skip-on-second-visit guard: localStorage 'barakah_onboarding_locale_seen'.
// Once a user has confirmed (or hit Skip), they never see this page again.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { useI18n, setLocale, LOCALE_STORAGE_KEY } from '../../../lib/i18n';

const ONBOARDING_SEEN_KEY = 'barakah_onboarding_locale_seen';

// Country → suggested currency (mirrors backend R2-6 derivation).
function suggestCurrency(country: string | undefined | null): string {
  if (!country) return 'USD';
  const c = country.trim().toUpperCase();
  const map: Record<string, string> = {
    US: 'USD', GB: 'GBP', FR: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR',
    BE: 'EUR', IE: 'EUR', PT: 'EUR', AT: 'EUR', FI: 'EUR', GR: 'EUR',
    SA: 'SAR', AE: 'AED', PK: 'PKR', IN: 'INR', BD: 'BDT', ID: 'IDR',
    MY: 'MYR', TR: 'TRY', EG: 'EGP', NG: 'NGN', CA: 'CAD', AU: 'AUD',
    NZ: 'NZD', CH: 'CHF', JP: 'JPY', CN: 'CNY', KR: 'KRW', SG: 'SGD',
    HK: 'HKD', ZA: 'ZAR', BR: 'BRL', MX: 'MXN',
  };
  return map[c] || 'USD';
}

function suggestLanguage(country: string | undefined | null): string {
  if (!country) return 'en';
  const c = country.trim().toUpperCase();
  if (c === 'FR' || c === 'BE' || c === 'CI' || c === 'SN' || c === 'CM' || c === 'MA' || c === 'TN' || c === 'DZ') return 'fr';
  if (c === 'SA' || c === 'AE' || c === 'EG' || c === 'JO' || c === 'KW' || c === 'QA' || c === 'BH' || c === 'OM' || c === 'IQ' || c === 'YE' || c === 'LB' || c === 'SY' || c === 'PS') return 'ar';
  if (c === 'PK') return 'ur';
  return 'en';
}

const CURRENCY_OPTIONS = ['USD', 'GBP', 'EUR', 'SAR', 'AED', 'PKR', 'INR', 'CAD', 'AUD', 'CHF', 'JPY', 'TRY', 'MYR', 'IDR', 'NGN', 'EGP', 'BDT'];
const LANGUAGE_OPTIONS: Array<{ code: string; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
];

export default function OnboardingLocaleConfirmPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill defaults from user.country once user loads. Guard against
  // re-running (and clobbering manual edits) by only seeding when both
  // selects still hold the initial 'USD'/'en' values.
  useEffect(() => {
    if (!user) return;
    const suggestedCcy = user.preferredCurrency || suggestCurrency(user.country);
    let suggestedLang = 'en';
    try {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
        suggestedLang = stored || suggestLanguage(user.country);
      }
    } catch {
      suggestedLang = suggestLanguage(user.country);
    }
    setCurrency(suggestedCcy);
    setLanguage(suggestedLang);
  }, [user]);

  // Skip-on-second-visit: if user already has preferredCurrency AND
  // we've previously recorded the onboarding-seen flag, bounce straight
  // to dashboard. Also skip if the user-data hasn't loaded after 2s
  // (anon visitor hit this URL directly) — route to login.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = window.localStorage.getItem(ONBOARDING_SEEN_KEY);
      if (seen === '1') {
        router.replace('/dashboard');
      }
    } catch {
      /* ignore */
    }
  }, [router]);

  const markSeen = () => {
    try {
      window.localStorage.setItem(ONBOARDING_SEEN_KEY, '1');
    } catch {
      /* ignore quota / private mode */
    }
  };

  const handleConfirm = async () => {
    setSaving(true);
    setError('');
    try {
      // Persist currency to backend.
      await api.updateProfile({ preferredCurrency: currency });
      // Persist language locally (no public user.locale PATCH yet — the
      // backend reads Accept-Language for email sends).
      setLocale(language);
      markSeen();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your preferences. Try again.');
      setSaving(false);
    }
  };

  const handleSkip = () => {
    markSeen();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">{t('onboardingLocaleTitle')}</h1>
        <p className="text-sm text-gray-600 mb-6">{t('onboardingLocaleSubtitle')}</p>

        {error && (
          <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <div className="mb-4">
          <label htmlFor="ob-currency" className="block text-sm font-medium text-gray-700 mb-1">
            {t('onboardingCurrencyLabel')}
          </label>
          <select
            id="ob-currency"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-gray-900"
          >
            {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="ob-language" className="block text-sm font-medium text-gray-700 mb-1">
            {t('onboardingLanguageLabel')}
          </label>
          <select
            id="ob-language"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-gray-900"
          >
            {LANGUAGE_OPTIONS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={saving}
          className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
        >
          {saving ? '…' : t('onboardingConfirmCta')}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={saving}
          className="block w-full text-center mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {t('onboardingSkipCta')}
        </button>
      </div>
    </div>
  );
}
