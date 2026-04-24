'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';

/**
 * Admin email-template preview.
 *
 * Pairs with /dashboard/admin/email-locales — the review workflow is:
 *   1. Pick a template in the left column.
 *   2. See it rendered in all 4 locales side-by-side (or pick one to zoom).
 *   3. Confirm the ar / ur / fr copy looks right before flipping the kill
 *      switch on.
 *
 * Backend: GET /admin/settings/email-preview?template=<id>&locale=<code>.
 * The backend explicitly BYPASSES the kill switch so a disabled locale is
 * still previewable here — otherwise the review flow would always show
 * English for the off locales and the whole screen would be useless.
 */

interface PreviewData {
  templateId: string;
  locale: string;
  subject: string;
  html: string;
}

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
  { code: 'fr', label: 'Français' },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

const TEMPLATE_GROUPS: Array<{ label: string; templates: string[] }> = [
  {
    label: 'Auth & account',
    templates: [
      'welcome',
      'verify',
      'passwordReset',
      'passwordChanged',
      'emailChanged',
      'accountDeleted',
    ],
  },
  {
    label: 'Zakat & Islamic',
    templates: [
      'hawlCompletion',
      'zakatLockConfirmation',
      'zakatDue',
      'wasiyyahReminder',
    ],
  },
  {
    label: 'Finance nudges',
    templates: [
      'billDueReminder',
      'dailyBalance',
      'bankReauth',
      'halalStatusHalal',
      'halalStatusHaram',
      'weeklyDigest',
    ],
  },
  {
    label: 'Engagement',
    templates: [
      'day3Nudge',
      'day7Nudge',
      'day30CheckIn',
      'day60WinBack',
      'day90LastChance',
      'winBack14dPaid',
      'winBack45dFree',
    ],
  },
  {
    label: 'Trial & billing',
    templates: [
      'trialGrantedPlus',
      'trialGrantedFamily',
      'trialExpiringPlus',
      'trialExpiringFamily',
      'trialEndedPlus',
      'trialEndedFamily',
      'annualRenewalPlus',
      'annualRenewalFamily',
      'paymentFailed',
    ],
  },
  {
    label: 'Family',
    templates: ['familyInvite', 'familyJoinedOwner'],
  },
];

function humanize(id: string): string {
  return id
    .replace(/([A-Z])/g, ' $1')
    .replace(/(\d+)/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim();
}

export default function EmailPreviewPage() {
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [zoomLocale, setZoomLocale] = useState<LocaleCode | 'all'>('all');
  const [cache, setCache] = useState<Record<string, PreviewData>>({});
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  const cacheKey = (template: string, locale: string) => `${template}::${locale}`;

  const fetchPreview = useCallback(
    async (template: string, locale: LocaleCode): Promise<PreviewData | null> => {
      const key = cacheKey(template, locale);
      if (cache[key]) return cache[key];
      try {
        const res = (await api.getAdminEmailPreview(template, locale)) as PreviewData;
        setCache(prev => ({ ...prev, [key]: res }));
        return res;
      } catch (err) {
        logError(err, { context: `Failed to preview ${template}/${locale}` });
        return null;
      }
    },
    [cache],
  );

  useEffect(() => {
    if (isAuthLoading || !user || !isAdmin) return;
    let cancelled = false;
    setLoading(true);
    const localesToLoad: LocaleCode[] =
      zoomLocale === 'all' ? LOCALES.map(l => l.code) : [zoomLocale];
    Promise.all(localesToLoad.map(l => fetchPreview(selectedTemplate, l)))
      .then(() => { if (!cancelled) setLoading(false); })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedTemplate, zoomLocale, fetchPreview, isAdmin, isAuthLoading, user]);

  const localesOnScreen: LocaleCode[] = useMemo(
    () => (zoomLocale === 'all' ? LOCALES.map(l => l.code) : [zoomLocale]),
    [zoomLocale],
  );

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-6">
      <div className="max-w-[1600px] mx-auto">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B5E20] hover:underline mb-3"
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B5E20]">Email template preview</h1>
          <p className="text-sm text-gray-600 mt-1">
            Every transactional email rendered with sample data in every supported locale. Use this to sanity-check <code className="bg-gray-100 rounded px-1">ar</code>, <code className="bg-gray-100 rounded px-1">ur</code>, and <code className="bg-gray-100 rounded px-1">fr</code> translations before flipping a locale on via{' '}
            <Link href="/dashboard/admin/email-locales" className="text-[#1B5E20] underline">email locales</Link>.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Locale kill switch is <em>bypassed</em> in this view — disabled locales are still rendered so you can review what you&apos;re about to turn on.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3 bg-white rounded-xl shadow-sm p-3 h-fit md:sticky md:top-4">
            <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Template</p>
            <nav className="max-h-[75vh] overflow-y-auto">
              {TEMPLATE_GROUPS.map(group => (
                <div key={group.label} className="mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 px-2 mb-1">
                    {group.label}
                  </p>
                  <ul>
                    {group.templates.map(id => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setSelectedTemplate(id)}
                          className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                            selectedTemplate === id
                              ? 'bg-[#1B5E20] text-white font-medium'
                              : 'text-gray-700 hover:bg-green-50'
                          }`}
                        >
                          {humanize(id)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <section className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-xl shadow-sm p-3 mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray-500">Template</p>
                <p className="font-mono text-sm text-[#1B5E20] font-semibold">{selectedTemplate}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setZoomLocale('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    zoomLocale === 'all'
                      ? 'bg-[#1B5E20] text-white'
                      : 'bg-white text-[#1B5E20] border border-[#1B5E20] hover:bg-green-50'
                  }`}
                >
                  All 4
                </button>
                {LOCALES.map(l => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => setZoomLocale(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      zoomLocale === l.code
                        ? 'bg-[#1B5E20] text-white'
                        : 'bg-white text-[#1B5E20] border border-[#1B5E20] hover:bg-green-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="bg-white rounded-xl p-6 text-center text-gray-600 shadow-sm">
                Rendering…
              </div>
            )}

            <div
              className={`grid gap-3 ${
                zoomLocale === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {localesOnScreen.map(code => {
                const preview = cache[cacheKey(selectedTemplate, code)];
                const localeLabel = LOCALES.find(l => l.code === code)?.label ?? code;
                const isRtl = code === 'ar' || code === 'ur';
                return (
                  <div
                    key={code}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                  >
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          {localeLabel} · <span className="font-mono">{code}</span>
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5" dir={isRtl ? 'rtl' : 'ltr'}>
                          {preview?.subject ?? '—'}
                        </p>
                      </div>
                      {preview && (
                        <button
                          type="button"
                          onClick={() => {
                            const w = window.open('', '_blank');
                            if (w) { w.document.write(preview.html); w.document.close(); }
                          }}
                          className="text-xs px-2 py-1 bg-white border border-[#1B5E20] text-[#1B5E20] rounded hover:bg-green-50"
                        >
                          Open
                        </button>
                      )}
                    </div>
                    {preview ? (
                      <iframe
                        title={`${selectedTemplate} ${code}`}
                        srcDoc={preview.html}
                        className="w-full bg-white"
                        style={{ height: zoomLocale === 'all' ? '520px' : '820px', border: 0 }}
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
