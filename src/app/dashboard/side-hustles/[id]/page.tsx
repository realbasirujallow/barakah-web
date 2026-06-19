'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Briefcase, Download, FileText, Plus } from 'lucide-react';
import { api } from '../../../../lib/api';
import ModalShell from '../../../../components/ui/ModalShell';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../../../lib/constants';
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
  const { locale } = useCurrency();
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
  // Add-transaction modal — web parity with the mobile side-hustle sheet: posts
  // a transaction pre-tagged to this hustle, with an optional Labor line for the
  // same job. (New strings are EN literals pending i18n dictionary keys.)
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [addForm, setAddForm] = useState({
    type: 'expense', category: 'materials', amount: '', labor: '', description: '', date: '',
  });

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
        // Lost Family access mid-session (e.g. trial downgrade) → treat like
        // not-found and show the back-to-list block, instead of a silent all-zero
        // page with a live (will-403) Add button. Mirrors mobile's bounce-to-hub.
        if (isLocked(res)) { setNotFound(true); return; }
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
  }, [hustle, year, refreshKey, t, toast]);

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

  // Post a transaction pre-tagged to this hustle, in the hustle's resolved base
  // currency. An optional Labor amount posts a SECOND 'labor' expense for the
  // same job — atomic-safe: if the materials line fails nothing is persisted; if
  // only the labor line fails we keep materials and surface a clear partial note
  // (never a false total failure that would trap a retry on the dup-guard).
  const handleAddTransaction = async () => {
    if (!hustle) return;
    const amt = parseFloat(addForm.amount);
    if (!Number.isFinite(amt) || amt <= 0) { toast('Enter an amount greater than 0.', 'error'); return; }
    const laborAmt = addForm.type === 'expense' ? parseFloat(addForm.labor) : NaN;
    const hasLabor = Number.isFinite(laborAmt) && laborAmt > 0;
    const currency = summary?.currency || hustle.defaultCurrency || 'USD';
    const timestamp = addForm.date ? new Date(addForm.date + 'T12:00:00').getTime() : Date.now();
    const desc = addForm.description.trim();
    setAdding(true);
    try {
      await api.addTransaction({
        type: addForm.type, direction: addForm.type === 'income' ? 'inflow' : 'outflow',
        category: addForm.category, amount: amt, description: desc,
        currency, timestamp, businessId: hustle.id,
      });
    } catch (e) {
      logError(e, { context: 'side-hustle-detail.addPrimary' });
      toast(e instanceof Error ? e.message : 'Could not add the transaction.', 'error');
      setAdding(false);
      return;
    }
    let laborFailed = false;
    if (hasLabor) {
      try {
        await api.addTransaction({
          type: 'expense', direction: 'outflow', category: 'labor',
          amount: laborAmt, description: desc, currency, timestamp, businessId: hustle.id,
        });
      } catch (e) {
        laborFailed = true;
        logError(e, { context: 'side-hustle-detail.addLabor' });
      }
    }
    setAdding(false);
    setShowAdd(false);
    setAddForm({ type: 'expense', category: 'materials', amount: '', labor: '', description: '', date: '' });
    setRefreshKey(k => k + 1);
    toast(
      laborFailed
        ? 'Materials saved, but the Labor line failed — add it from Transactions.'
        : 'Transaction added.',
      laborFailed ? 'error' : 'success',
    );
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
  // Side-hustle amounts are in the hustle's BASE currency (summary.currency), not
  // the viewer's preferred currency — format with the base so the symbol matches
  // the values (the shared `fmt` always uses the preferred currency).
  const shCurrency = summary?.currency || hustle.defaultCurrency || 'USD';
  const fmtBase = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: shCurrency }).format(n);

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
          <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">{fmtBase(summary?.totalIncome ?? 0)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{t('sideHustlesExpenses')}</p>
          <p className="text-2xl font-bold text-rose-700 tabular-nums mt-1">{fmtBase(summary?.totalExpenses ?? 0)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{t('sideHustlesNet')}</p>
          <p className="text-2xl font-bold text-primary tabular-nums mt-1">{fmtBase(summary?.netIncome ?? 0)}</p>
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
            onClick={() => { setAddForm(f => ({ ...f, date: new Date().toISOString().slice(0, 10) })); setShowAdd(true); }}
            className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add transaction
          </button>
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
                  <span className="text-sm font-semibold tabular-nums text-emerald-700">{fmtBase(amt)}</span>
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
                  <span className="text-sm font-semibold tabular-nums text-rose-700">{fmtBase(amt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Jurisdiction-neutral, non-advice footnote — mirrors the PDF footnote.
          We never compute tax or zakat here. */}
      <p className="text-xs text-gray-400 leading-relaxed">{t('sideHustlesNonAdviceNote')}</p>

      {showAdd && (
        <ModalShell onClose={() => { if (!adding) setShowAdd(false); }} ariaLabel="Add transaction">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Add transaction</h2>
              <button type="button" onClick={() => { if (!adding) setShowAdd(false); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Briefcase className="w-3.5 h-3.5" /> <span className="truncate">{hustle.name}</span>
            </div>
            <label className="block">
              <span className="text-xs text-gray-500">Type</span>
              <select
                value={addForm.type}
                onChange={e => { const ty = e.target.value; setAddForm(f => { const cats = ty === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES; return { ...f, type: ty, category: (cats as readonly string[]).includes(f.category) ? f.category : cats[0] }; }); }}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
              >
                <option value="expense">{t('sideHustlesExpenses')}</option>
                <option value="income">{t('sideHustlesIncome')}</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Category</span>
              <select
                value={addForm.category}
                onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
              >
                {(addForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <option key={c} value={c}>{categoryLabel(c)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Amount</span>
              <input type="number" inputMode="decimal" min="0" step="0.01" value={addForm.amount}
                onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900" />
            </label>
            {addForm.type === 'expense' && (
              <label className="block">
                <span className="text-xs text-gray-500">Labor (optional)</span>
                <input type="number" inputMode="decimal" min="0" step="0.01" value={addForm.labor}
                  onChange={e => setAddForm(f => ({ ...f, labor: e.target.value }))}
                  placeholder="0.00" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900" />
                <span className="block text-[11px] text-gray-400 mt-1">Adds a separate Labor line for the same job (e.g. a contractor charge).</span>
              </label>
            )}
            <label className="block">
              <span className="text-xs text-gray-500">Description</span>
              <input type="text" value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Roof repair" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900" />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Date</span>
              <input type="date" value={addForm.date}
                onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} disabled={adding}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button type="button" onClick={handleAddTransaction} disabled={adding}
                className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5">
                {adding && <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full inline-block" />}
                Add
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
