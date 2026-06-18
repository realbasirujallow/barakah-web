'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Briefcase, Download, FileText } from 'lucide-react';
import { api } from '../../../../lib/api';
import { useCurrency } from '../../../../lib/useCurrency';
import { logError } from '../../../../lib/logError';
import { useToast } from '../../../../lib/toast';
import { useI18n, t as tStandalone } from '../../../../lib/i18n';
import { PageHeader } from '../../../../components/dashboard/PageHeader';
import { SkeletonPage } from '../../SkeletonCard';
import { trackFeatureUse } from '../../../../lib/analytics';
import { SideHustle, SideHustleSummary, isLocked, sideHustleSlug, monthOptions } from '../../../../lib/sideHustle';

// Mirrors the transactions page helper: prefer the localized `txnCat_<code>`
// label, else title-case the raw category slug.
function categoryLabel(code: string): string {
  const key = `txnCat_${code}`;
  const translated = tStandalone(key);
  if (translated !== key) return translated;
  return code.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
}

// Year picker spans the current fiscal year back a few years — jurisdiction-
// neutral, no assumption about which calendar the user files under. The label
// is the FY start year per the hustle's taxYearStartMonth.
const YEARS_BACK = 6;

export default function SideHustleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hustleId = Number(id);
  const { fmt, locale } = useCurrency();
  const { toast } = useToast();
  const { t, tFmt } = useI18n();

  const [hustle, setHustle] = useState<SideHustle | null>(null);
  const [summary, setSummary] = useState<SideHustleSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Load the hustle once. Non-Family users get a {locked} payload (the layout
  // PlanGate normally intercepts first); treat it as not-found rather than
  // rendering raw JSON.
  useEffect(() => {
    if (!Number.isFinite(hustleId)) { setNotFound(true); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getSideHustle(hustleId);
        if (cancelled) return;
        if (isLocked(res)) { setNotFound(true); setLoading(false); return; }
        const found = (res as { sideHustle?: SideHustle })?.sideHustle ?? null;
        if (!found) { setNotFound(true); setLoading(false); return; }
        setHustle(found);
      } catch (e) {
        logError(e, { tags: { area: 'side-hustle-detail.load' } });
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hustleId]);

  // (Re)load the summary whenever the hustle is known or the selected year
  // changes. `year === undefined` lets the backend default to the current
  // fiscal year; we then adopt the year it reports so the picker reflects it.
  useEffect(() => {
    if (!hustle) return;
    let cancelled = false;
    setSummaryLoading(true);
    (async () => {
      try {
        const res = await api.getSideHustleSummary(hustle.id, year);
        if (cancelled) return;
        if (isLocked(res)) { setSummary(null); return; }
        const s = res as SideHustleSummary;
        setSummary(s);
        if (year === undefined && typeof s?.year === 'number') setYear(s.year);
      } catch (e) {
        logError(e, { tags: { area: 'side-hustle-detail.summary' } });
        if (!cancelled) toast(t('sideHustlesSummaryFailed'), 'error');
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hustle, year, t, toast]);

  const handleExportCsv = async () => {
    if (!hustle) return;
    setExportingCsv(true);
    try { trackFeatureUse('export_side_hustle_csv'); } catch { /* GA4 unavailable */ }
    try {
      await api.downloadSideHustleCsv(hustle.id, sideHustleSlug(hustle.name), year);
    } catch (e) {
      logError(e, { context: 'side-hustle-detail.exportCsv' });
      toast(e instanceof Error ? e.message : t('sideHustlesCsvFailed'), 'error');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    if (!hustle) return;
    setExportingPdf(true);
    try { trackFeatureUse('export_side_hustle_pdf'); } catch { /* GA4 unavailable */ }
    try {
      await api.downloadSideHustlePdf(hustle.id, sideHustleSlug(hustle.name), year);
    } catch (e) {
      logError(e, { context: 'side-hustle-detail.exportPdf' });
      toast(e instanceof Error ? e.message : t('sideHustlesPdfFailed'), 'error');
    } finally {
      setExportingPdf(false);
    }
  };

  if (loading) return <SkeletonPage summaryCount={3} listCount={4} />;

  if (notFound || !hustle) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <PageHeader title={t('sideHustlesNotFoundTitle')} />
        <p className="text-sm text-gray-500 mt-4">{t('sideHustlesNotFoundBody')}</p>
        <Link href="/dashboard/side-hustles" className="text-primary hover:underline text-sm mt-4 inline-block">← {t('sideHustlesBackToList')}</Link>
      </div>
    );
  }

  const months = monthOptions(locale);
  const fiscalStartLabel = months[(hustle.taxYearStartMonth || 1) - 1]?.label || '';
  // FY start year options — newest first.
  const nowYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: YEARS_BACK }, (_, i) => nowYear - i);

  const incomeEntries = Object.entries(summary?.incomeByCategory ?? {}).sort((a, b) => b[1] - a[1]);
  const expenseEntries = Object.entries(summary?.expensesByCategory ?? {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href="/dashboard/side-hustles" className="text-sm text-primary hover:underline">← {t('sideHustlesBackToList')}</Link>

      <PageHeader
        title={hustle.name}
        subtitle={[
          hustle.hustleType || null,
          tFmt('sideHustlesFiscalStartFmt', [fiscalStartLabel]),
        ].filter(Boolean).join(' • ')}
        icon={<Briefcase className="w-6 h-6 text-primary" />}
        className="mb-2"
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="sh-year" className="sr-only">{t('sideHustlesYearLabel')}</label>
            <select
              id="sh-year"
              value={year ?? ''}
              onChange={e => setYear(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm text-gray-900"
            >
              {/* If the backend reported a year outside our window, keep it selectable. */}
              {(year !== undefined && !yearOptions.includes(year)) && (
                <option value={year}>{tFmt('sideHustlesFiscalYearFmt', [String(year)])}</option>
              )}
              {yearOptions.map(y => (
                <option key={y} value={y}>{tFmt('sideHustlesFiscalYearFmt', [String(y)])}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Summary cells */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{t('sideHustlesIncome')}</p>
          <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">{fmt(summary?.totalIncome ?? 0)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{t('sideHustlesExpenses')}</p>
          <p className="text-2xl font-bold text-rose-700 tabular-nums mt-1">{fmt(summary?.totalExpenses ?? 0)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{t('sideHustlesNet')}</p>
          <p className="text-2xl font-bold text-primary tabular-nums mt-1">{fmt(summary?.netIncome ?? 0)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          {summaryLoading
            ? t('sideHustlesSummaryLoading')
            : tFmt('sideHustlesTxnCountFmt', [String(summary?.transactionCount ?? 0), summary?.currency ?? ''])}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exportingCsv}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {exportingCsv ? <span className="animate-spin w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full inline-block" /> : <Download className="w-4 h-4" />}
            {t('sideHustlesExportCsv')}
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {exportingPdf ? <span className="animate-spin w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full inline-block" /> : <FileText className="w-4 h-4" />}
            {t('sideHustlesExportPdf')}
          </button>
        </div>
      </div>

      {/* Income / expenses by category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-primary mb-3">{t('sideHustlesIncomeByCategory')}</h2>
          {incomeEntries.length === 0 ? (
            <p className="text-sm text-gray-400">{t('sideHustlesNoData')}</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {incomeEntries.map(([cat, amt]) => (
                <li key={cat} className="py-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate">{categoryLabel(cat)}</span>
                  <span className="text-sm font-semibold tabular-nums text-emerald-700">{fmt(amt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-primary mb-3">{t('sideHustlesExpensesByCategory')}</h2>
          {expenseEntries.length === 0 ? (
            <p className="text-sm text-gray-400">{t('sideHustlesNoData')}</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {expenseEntries.map(([cat, amt]) => (
                <li key={cat} className="py-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate">{categoryLabel(cat)}</span>
                  <span className="text-sm font-semibold tabular-nums text-rose-700">{fmt(amt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Jurisdiction-neutral, non-advice footnote — mirrors the PDF footnote.
          We never compute tax or zakat here. */}
      <p className="text-xs text-gray-400 leading-relaxed">{t('sideHustlesNonAdviceNote')}</p>
    </div>
  );
}
