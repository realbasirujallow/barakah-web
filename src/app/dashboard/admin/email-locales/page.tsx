'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';

/**
 * Per-locale transactional email kill switch.
 *
 * When a locale is toggled OFF, users who have that locale set on their
 * profile still receive every email — but rendered in English via the
 * bundle fallback. Used when a translation regresses in prod and we need
 * to roll back without a redeploy.
 *
 * Backend: GET / PUT /admin/settings/email-locales.
 */

interface LocaleRow {
  locale: string;
  enabled: boolean;
  canDisable: boolean;
}

const LOCALE_LABELS: Record<string, { name: string; native: string }> = {
  en: { name: 'English', native: 'English' },
  ar: { name: 'Arabic', native: 'العربية' },
  ur: { name: 'Urdu', native: 'اردو' },
  fr: { name: 'French', native: 'Français' },
};

export default function EmailLocalesPage() {
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<LocaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  const reload = useCallback(async () => {
    if (isAuthLoading || !user || !isAdmin) return;
    setLoading(true);
    try {
      const res = await api.getAdminEmailLocales() as { locales: LocaleRow[] };
      setRows(res.locales);
    } catch (err) {
      logError(err, { context: 'Failed to load email locale settings' });
      toast('Failed to load email locale settings', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isAuthLoading, toast, user]);

  useEffect(() => { void reload(); }, [reload]);

  const toggle = async (locale: string, enabled: boolean) => {
    setSaving(locale);
    try {
      await api.setAdminEmailLocale(locale, enabled);
      setRows(prev => prev.map(r => r.locale === locale ? { ...r, enabled } : r));
      toast(`${LOCALE_LABELS[locale]?.name ?? locale} emails ${enabled ? 'enabled' : 'disabled'}`, 'success');
    } catch (err) {
      logError(err, { context: 'Failed to toggle email locale' });
      toast('Failed to update locale. Try again?', 'error');
    } finally {
      setSaving(null);
    }
  };

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-4"
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Transactional email locales</h1>
          <p className="text-sm text-gray-600 mt-1">
            Each toggle controls whether transactional emails render in that locale for users who have it set on their profile. When disabled, affected users still receive emails — but in English via the bundle fallback. Use this as a kill switch if a translation regresses in prod.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            English can&apos;t be disabled — it&apos;s the floor fallback for every locale.
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-600 shadow-sm">
            Loading…
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {rows.map(row => {
                const label = LOCALE_LABELS[row.locale];
                const name = label?.name ?? row.locale;
                const native = label?.native ?? row.locale;
                return (
                  <li key={row.locale} className="flex items-center justify-between p-4 sm:p-5">
                    <div>
                      <p className="font-semibold text-primary flex items-center gap-2">
                        {name}
                        <span className="text-gray-500 text-sm font-normal">{native}</span>
                        <span className="font-mono text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5">{row.locale}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {row.enabled
                          ? `Users with locale=${row.locale} receive emails rendered from messages_${row.locale}.properties`
                          : `Users with locale=${row.locale} fall back to English until re-enabled`}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={row.enabled}
                      disabled={!row.canDisable || saving === row.locale}
                      onClick={() => row.canDisable && toggle(row.locale, !row.enabled)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                        row.enabled ? 'bg-[#1B5E20]' : 'bg-gray-300'
                      } ${!row.canDisable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                          row.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <p className="text-sm text-blue-900">
            <strong>How the kill switch works:</strong> the backend reads <code className="bg-white px-1 rounded">users.locale</code> on every scheduled or async transactional send. If that locale is toggled OFF here, the bundle lookup falls back to English automatically — there is no redeploy and no per-user change. Flip it back on once the translation is fixed.
          </p>
        </div>
      </div>
    </div>
  );
}
