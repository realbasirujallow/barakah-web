'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { validateStripeUrl } from '../../../lib/validateUrl';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import ModalShell from '../../../components/ui/ModalShell';
import { useI18n } from '../../../lib/i18n';
import { SkeletonPage } from '../SkeletonCard';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';

interface SadaqahItem { id: number; amount: number; recipientName: string; category: string; date: number; description: string; recurring: boolean; anonymous: boolean; }
interface Stats { totalDonated: number; donationCount: number; thisMonthTotal: number; topCategory: string; }

// Giving-pattern intelligence — backed by SadaqahInsightService.java.
interface RecurringGift { recipient: string; averageAmount: number; occurrences: number; lastDate: number; nextExpected: number; }
interface TopRecipient { recipient: string; total: number; count: number; }
interface GivingInsights {
  currency: string;
  thisMonthTotal: number;
  lastMonthTotal: number;
  thisYearTotal: number;
  monthlyAverage: number;
  trend: 'up' | 'down' | 'flat' | 'none';
  givingStreakMonths: number;
  monthsActiveLast12: number;
  lastGift: { amount: number; recipient: string; date: number } | null;
  recurringGiving: RecurringGift[];
  topRecipients: TopRecipient[];
}

// Map backend stats response fields to frontend Stats interface
function mapStats(raw: Record<string, unknown>): Stats | null {
  if (!raw) return null;
  // Backend may use totalAllTime/totalDonated, totalDonations/donationCount, thisMonth/thisMonthTotal
  const totalDonated = Number(raw.totalDonated ?? raw.totalAllTime ?? 0);
  const donationCount = Number(raw.donationCount ?? raw.totalDonations ?? 0);
  const thisMonthTotal = Number(raw.thisMonthTotal ?? raw.thisMonth ?? 0);
  let topCategory = String(raw.topCategory || 'N/A');
  // Derive top category from byCategory map if not provided directly
  if (topCategory === 'N/A' && raw.byCategory && typeof raw.byCategory === 'object') {
    const entries = Object.entries(raw.byCategory) as [string, number][];
    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      topCategory = entries[0][0].toLowerCase();
    }
  }
  return { totalDonated, donationCount, thisMonthTotal, topCategory };
}
const CATS = ['food', 'clothing', 'education', 'medical', 'shelter', 'water', 'general', 'orphan', 'mosque', 'disaster_relief', 'dawah', 'other'];

// Preset donation amounts in dollars
const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

function SadaqahContent() {
  const { fmt, locale: dateLocale } = useCurrency();
  const { t, tFmt } = useI18n();
  const CAT_KEY: Record<string, string> = {
    food: 'sadaqahCatFood', clothing: 'sadaqahCatClothing', education: 'sadaqahCatEducation',
    medical: 'sadaqahCatMedical', shelter: 'sadaqahCatShelter', water: 'sadaqahCatWater',
    general: 'sadaqahCatGeneral', orphan: 'sadaqahCatOrphan', mosque: 'sadaqahCatMosque',
    disaster_relief: 'sadaqahCatDisasterRelief', dawah: 'sadaqahCatDawah', other: 'sadaqahCatOther',
  };
  const catLabel = (c: string) => t(CAT_KEY[c] || 'sadaqahCatOther');
  const [items, setItems] = useState<SadaqahItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [giving, setGiving] = useState<GivingInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', recipientName: '', category: 'general', description: '', anonymous: false, recurring: false });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  // 2026-05-02: lock body scroll while modal/confirm is open.
  useBodyScrollLock(showForm || deleteConfirmId !== null);
  const [displayCount, setDisplayCount] = useState(10);
  const { toast } = useToast();

  // Donate-to-Barakah state
  const [donateAmount, setDonateAmount] = useState<number | null>(25);
  const [donateCustom, setDonateCustom] = useState('');
  const [donatePurpose, setDonatePurpose] = useState('general');
  const [donating, setDonating] = useState(false);

  const searchParams = useSearchParams();

  const load = useCallback(() => {
    setLoading(true);
    Promise.allSettled([api.getSadaqah(), api.getSadaqahStats(), api.getSadaqahInsights()])
      .then((results) => {
        const d = results[0].status === 'fulfilled' ? results[0].value : null;
        const s = results[1].status === 'fulfilled' ? results[1].value : null;
        // Insights are additive — a failure here must not block the page.
        const g = results[2].status === 'fulfilled' ? results[2].value : null;
        if (d?.error) { toast(d.error, 'error'); return; }
        setItems(Array.isArray(d?.donations) ? d.donations : Array.isArray(d) ? d : []);
        setStats(mapStats(s));
        setGiving(g && !g.error ? (g as GivingInsights) : null);
      })
      .catch(() => { toast(t('sadaqahLoadError'), 'error'); }).finally(() => setLoading(false));
    // `t` is a fresh identity each render; including it would make `load` a new
    // function every render and the `[load]` effect refire forever. Keep `toast`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  // Show success toast if redirected back from Stripe
  useEffect(() => {
    if (searchParams.get('donated') === 'true') {
      toast(t('sadaqahDonatedToast'), 'success');
    }
    // `t` is a fresh identity each render; including it would refire this toast
    // effect every render. It depends only on the `donated` search param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, toast]);

  const handleSave = async () => {
    // Round 21: validate BEFORE flipping `saving` so the button doesn't
    // briefly show a "saving" state when the submit is obviously invalid.
    // Matches the contact-form ordering fix from Round 18.
    const amt = parseFloat(form.amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast(t('sadaqahAmountError'), 'error');
      return;
    }
    setSaving(true);
    try {
      await api.addSadaqah({ ...form, amount: amt });
      setShowForm(false); setForm({ amount: '', recipientName: '', category: 'general', description: '', anonymous: false, recurring: false }); load();
      toast(t('sadaqahRecordedToast'), 'success');
    } catch (err: unknown) { toast(err instanceof Error ? err.message : t('sadaqahSaveError'), 'error'); }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteSadaqah = async () => {
    if (deleteConfirmId === null) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await api.deleteSadaqah(id);
      toast(t('sadaqahDeletedToast'), 'success');
      load();
    } catch {
      toast(t('sadaqahDeleteError'), 'error');
    }
  };

  const handleDonate = async () => {
    const dollars = donateAmount ?? parseFloat(donateCustom);
    if (!Number.isFinite(dollars) || dollars <= 0) { toast(t('sadaqahAmountValidError'), 'error'); return; }
    const cents = Math.round(dollars * 100);
    setDonating(true);
    try {
      const purposeLabel = catLabel(donatePurpose);
      const res = await api.donateToBarakah(cents, `${t('sadaqahSadaqahPrefix')}${purposeLabel}`);
      if (res?.url) {
        // Validate the redirect URL against the Stripe domain whitelist
        // (prevents open-redirect attacks via a malicious API response).
        if (!validateStripeUrl(res.url)) {
          toast(t('sadaqahCheckoutError'), 'error');
          return;
        }
        window.location.href = res.url;
      } else {
        toast(t('sadaqahInitError'), 'error');
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : t('sadaqahProcessError'), 'error');
    } finally {
      setDonating(false);
    }
  };

  // R38 (2026-04-30): SkeletonPage shimmer instead of bare spinner.
  if (loading) return <SkeletonPage />;

  const effectiveAmount = donateAmount ?? (donateCustom ? parseFloat(donateCustom) : 0);

  return (
    <div>
      <PageHeader
        title={t('sadaqahTitle')}
        subtitle={t('sadaqahSubtitle')}
        actions={
          <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('sadaqahGiveBtn')}</button>
        }
      />

      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-900 mb-6 space-y-3">
        <h3 className="font-bold text-base">{t('sadaqahGuidanceHeading')}</h3>
        <p>
          <strong>{t('sadaqahWhatIsLabel')}</strong> {t('sadaqahWhatIsBody')}
        </p>
        <p>
          {t('sadaqahHadithIntro')} <em>{t('sadaqahHadith1Text')}</em> — <strong>{t('sadaqahHadith1Citation')}</strong>
        </p>
        <p>
          {t('sadaqahHadithIntro')} <em>{t('sadaqahHadith2Text')}</em> — <strong>{t('sadaqahHadith2Citation')}</strong>
        </p>
      </div>

      {/* Stats banner — combines manual sadaqah log + bank-synced charity.
          Prefer the giving-insights aggregate (which already includes both)
          for the headline; fall back to manual-only stats when insights
          aren't available. Without this, users who only have bank-synced
          giving (like Basiru's $2,000/mo via Zelle) saw a misleading
          "$0.00 Total Donated" hero next to a $850/mo monthly average
          panel right below. */}
      {(() => {
        const insightsThisMonth = giving?.thisMonthTotal ?? 0;
        const manualThisMonth = stats?.thisMonthTotal ?? 0;
        const thisMonth = Math.max(insightsThisMonth, manualThisMonth);
        const insightsYearTotal = giving?.thisYearTotal ?? 0;
        const manualTotal = stats?.totalDonated ?? 0;
        const headline = Math.max(insightsYearTotal, manualTotal);
        return (
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white mb-6">
            <p className="text-teal-100 text-sm">
              {insightsYearTotal > manualTotal ? t('sadaqahHeroGivenYear') : t('sadaqahHeroTotalDonated')}
            </p>
            <p className="text-4xl font-bold">{fmt(headline)}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div><p className="text-teal-200 text-xs">{t('sadaqahHeroManual')}</p><p className="text-xl font-semibold">{stats?.donationCount || 0}</p></div>
              <div><p className="text-teal-200 text-xs">{t('sadaqahHeroThisMonth')}</p><p className="text-xl font-semibold">{fmt(thisMonth)}</p></div>
              <div><p className="text-teal-200 text-xs">{t('sadaqahHeroTopCategory')}</p><p className="text-xl font-semibold">{stats?.topCategory ? catLabel(stats.topCategory) : (giving?.topRecipients?.length ? t('sadaqahSeeBelow') : t('sadaqahNA'))}</p></div>
            </div>
          </div>
        );
      })()}

      {/* Giving patterns — auto-detected from the unified charity-transaction
          history (manual sadaqah + bank-synced giving). Only shown when
          there's something meaningful to surface. */}
      {giving && (giving.givingStreakMonths > 0 || giving.recurringGiving.length > 0 || giving.topRecipients.length > 0) && (
        <GivingPatternsPanel giving={giving} fmt={fmt} t={t} tFmt={tFmt} />
      )}

      {/* ── Donate via Barakah ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌿</span>
          <div>
            <h2 className="text-lg font-bold text-primary">{t('sadaqahDonateTitle')}</h2>
            <p className="text-sm text-gray-500">{t('sadaqahDonateSubtitle')}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('sadaqahCauseLabel')}</label>
          <select
            value={donatePurpose}
            onChange={e => setDonatePurpose(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
          >
            {CATS.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('sadaqahAmountLabel')}</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_AMOUNTS.map(amt => (
              <button
                key={amt}
                onClick={() => { setDonateAmount(amt); setDonateCustom(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  donateAmount === amt
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                {fmt(amt)}
              </button>
            ))}
            <button
              onClick={() => setDonateAmount(null)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                donateAmount === null
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {t('sadaqahCustomBtn')}
            </button>
          </div>
          {donateAmount === null && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder={t('sadaqahCustomPlaceholder')}
                value={donateCustom}
                onChange={e => setDonateCustom(e.target.value)}
                className="w-full border rounded-lg pl-8 pr-3 py-2 text-gray-900"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleDonate}
          disabled={donating || effectiveAmount <= 0}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
        >
          {donating ? t('sadaqahRedirectingBtn') : (effectiveAmount > 0 ? tFmt('sadaqahDonateBtnFmt', [fmt(effectiveAmount)]) : t('sadaqahDonateBtnNoAmt'))}
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          {t('sadaqahDonateDisclaimer')}
        </p>
      </div>

      {/* ── My Sadaqah records ────────────────────────────────────────────── */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('sadaqahMyRecords')}</h3>
      {items.length > 0 ? (
        <>
          <div className="space-y-2">
            {items.slice(0, displayCount).map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-primary">{item.recipientName || catLabel(item.category)}</p>
                  <p className="text-sm text-gray-500">{catLabel(item.category)} • {new Date(item.date < 1e12 ? item.date * 1000 : item.date).toLocaleDateString(dateLocale)}
                    {item.recurring && <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">{t('sadaqahRecurringBadge')}</span>}
                    {item.anonymous && <span className="ml-1 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{t('sadaqahAnonymousBadge')}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-primary">{fmt(item.amount)}</p>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 text-sm">{t('sadaqahDeleteBtn')}</button>
                </div>
              </div>
            ))}
          </div>
          {displayCount < items.length && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setDisplayCount(displayCount + 10)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
              >
                {t('sadaqahShowMore')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400"><p className="text-4xl mb-3">💝</p><p>{t('sadaqahEmptyBody')}</p></div>
      )}

      {/* Add Sadaqah modal */}
      {showForm && (
        <ModalShell onClose={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-primary mb-4">{t('sadaqahModalTitle')}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('sadaqahFieldAmount')}</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('sadaqahAmountPlaceholder')} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('sadaqahFieldRecipient')}</label>
                <input value={form.recipientName} onChange={e => setForm({ ...form, recipientName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('sadaqahRecipientPlaceholder')} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('sadaqahFieldCategory')}</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATS.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('sadaqahFieldDescription')}</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} className="w-4 h-4" /> {t('sadaqahCheckAnonymous')}</label>
                <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.recurring} onChange={e => setForm({ ...form, recurring: e.target.checked })} className="w-4 h-4" /> {t('sadaqahCheckRecurring')}</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('sadaqahCancel')}</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('sadaqahSaving') : t('sadaqahRecord')}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────── */}
      {deleteConfirmId !== null && (
        <ModalShell onClose={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🗑️</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{t('sadaqahDeleteTitle')}</h3>
                <p className="text-sm text-gray-600 mt-1">{t('sadaqahDeleteBody')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('sadaqahCancel')}</button>
              <button onClick={confirmDeleteSadaqah} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('sadaqahDelete')}</button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

export default function SadaqahPage() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <SadaqahContent />
    </Suspense>
  );
}

/**
 * Giving-patterns panel — turns the raw charity-transaction history into a
 * legible picture of *how* the household gives: a streak to keep going, a
 * trend vs. the running average, consistency over the year, recurring gifts,
 * and the recipients they return to most.
 *
 * The streak is celebratory only — there is no "you missed a month" state.
 * Consistency of giving is a quiet good in Islam; the panel reflects that
 * back without ever turning into a guilt prompt.
 */
function GivingPatternsPanel({
  giving,
  fmt,
  t,
  tFmt,
}: {
  giving: GivingInsights;
  fmt: (n: number) => string;
  t: (key: string) => string;
  tFmt: (key: string, args: ReadonlyArray<string | number>) => string;
}) {
  // SAD-2 fix: when this-month is exactly 0, the trend comparison reads
  // "below average" or worse — but the more accurate copy is "haven't
  // given yet this month".
  const trendLabel =
    giving.thisMonthTotal === 0
      ? t('sadaqahTrendNone')
      : giving.trend === 'up' ? t('sadaqahTrendUp') :
        giving.trend === 'down' ? t('sadaqahTrendDown') :
        giving.trend === 'flat' ? t('sadaqahTrendFlat') :
        null;
  const fmtDay = (ms: number) =>
    ms ? new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '';

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-primary mb-1">{t('sadaqahPatternsTitle')}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {t('sadaqahPatternsSubtitle')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {giving.givingStreakMonths > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-2xl font-bold text-amber-700">🔥 {giving.givingStreakMonths}</p>
            <p className="text-xs text-amber-800 mt-0.5">
              {giving.givingStreakMonths === 1
                ? tFmt('sadaqahStreakSingleFmt', [giving.givingStreakMonths])
                : tFmt('sadaqahStreakPluralFmt', [giving.givingStreakMonths])}
            </p>
          </div>
        )}
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
          <p className="text-2xl font-bold text-gray-800">{fmt(giving.thisMonthTotal)}</p>
          <p className="text-xs text-gray-600 mt-0.5">{t('sadaqahGivenThisMonth')}</p>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
          <p className="text-2xl font-bold text-gray-800">{giving.monthsActiveLast12}<span className="text-base text-gray-500">/12</span></p>
          <p className="text-xs text-gray-600 mt-0.5">{t('sadaqahMonthsActive')}</p>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
          <p className="text-2xl font-bold text-gray-800">{fmt(giving.monthlyAverage)}</p>
          <p className="text-xs text-gray-600 mt-0.5">{t('sadaqahMonthlyAvg')}</p>
        </div>
      </div>

      {trendLabel && (
        <p className="text-sm text-gray-600 mb-4">
          {tFmt('sadaqahTrendLineFmt', [trendLabel.toLowerCase()])}
        </p>
      )}

      {giving.recurringGiving.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">{t('sadaqahRecurringHeading')}</p>
          <ul className="space-y-1.5">
            {giving.recurringGiving.map((r, i) => (
              <li key={`${r.recipient}-${i}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-800 truncate capitalize">{r.recipient}</span>
                <span className="text-gray-500 flex-shrink-0 tabular-nums">
                  {tFmt('sadaqahRecurringDetailFmt', [fmt(r.averageAmount), fmtDay(r.nextExpected)])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {giving.topRecipients.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">{t('sadaqahTopHeading')}</p>
          <ul className="space-y-1.5">
            {giving.topRecipients.map((r, i) => (
              <li key={`${r.recipient}-${i}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-800 truncate capitalize">{r.recipient}</span>
                <span className="text-gray-500 flex-shrink-0 tabular-nums">
                  {r.count === 1
                    ? tFmt('sadaqahTopDetailSingleFmt', [fmt(r.total), r.count])
                    : tFmt('sadaqahTopDetailPluralFmt', [fmt(r.total), r.count])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
