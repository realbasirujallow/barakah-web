'use client';
import { useCallback, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { CategoryIcon } from '../../../lib/categoryIcon';
import { useI18n } from '../../../lib/i18n';

interface RecurringTx {
  id: number;
  description: string;
  amount: number;
  category: string;
  type: string;
  timestamp: number; // backend field name (was: date)
  recurring: boolean;
  recurringActive: boolean;
  frequency?: string;
}

// Phase 24f (2026-04-30): emoji map removed in favour of the
// centralized <CategoryIcon /> Lucide component (lib/categoryIcon.tsx).
// Cross-platform consistent rendering, brand-coloured icons per category,
// no duplication across the recurring/notifications/summary/etc pages.

function formatDate(epoch: number) {
  const ms = epoch < 1e12 ? epoch * 1000 : epoch;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * 2026-05-02 (Monarch parity): one of the three header pillars on the
 * Recurring page. Shows count, total, and a thin progress bar.
 * Visual reference: Monarch's `/recurring` 3-pillar header.
 */
function PillarCard({
  label, count, total, fmt, color, labelTotal, foot,
}: {
  label: string;
  count: number;
  total: number;
  fmt: (n: number) => string;
  color: 'emerald' | 'rose' | 'slate';
  labelTotal: string;
  foot: string;
}) {
  const colors = {
    emerald: { dot: 'bg-emerald-600', bar: 'bg-emerald-500', amt: 'text-emerald-700 dark:text-emerald-400' },
    rose: { dot: 'bg-rose-600', bar: 'bg-rose-500', amt: 'text-rose-700 dark:text-rose-400' },
    slate: { dot: 'bg-slate-700 dark:bg-slate-300', bar: 'bg-slate-500', amt: 'text-foreground' },
  }[color];
  // The progress bar shows count visually (we don't have a paid/remaining
  // split for our data model the way Monarch does for cleared statements,
  // so we render proportional density: full bar means there are recurring
  // rows in this pillar, empty means none).
  const pct = count > 0 ? 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
        </div>
        <p className={`text-sm font-bold tabular-nums ${colors.amt}`}>{fmt(total)}</p>
      </div>
      <div className="relative h-1.5 bg-muted/50 rounded-full overflow-hidden mb-1.5">
        <div
          className={`absolute inset-y-0 left-0 ${colors.bar} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{labelTotal}</span>
        <span>{foot}</span>
      </div>
    </div>
  );
}

// Defined outside RecurringPage to avoid recreating the component type on every render.
// Recreating causes React to unmount/remount on each parent re-render, losing focus/state.
interface TxRowProps {
  tx: RecurringTx;
  fmt: (v: number) => string;
  toggling: number | null;
  onToggle: (id: number) => void;
  // 2026-06-08: founder reported "/dashboard/recurring i cant click any of
  // the recurring charges/transactions so i can edit them to say monthly
  // weekly or biweekly". The row used to only expose the on/off toggle —
  // no path to change the frequency. Now: click anywhere on the row
  // EXCEPT the toggle opens an edit modal. The toggle still pauses/resumes.
  onEdit: (tx: RecurringTx) => void;
}
function TxRow({ tx, fmt, toggling, onToggle, onEdit }: TxRowProps) {
  const { t, tFmt } = useI18n();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(tx)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit(tx); } }}
      className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${!tx.recurringActive ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <CategoryIcon category={tx.category} className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{tx.description || t('recurringNoDescription')}</p>
          <p className="text-xs text-gray-500 capitalize">
            {tx.category} • {tFmt('recurringLastFmt', [formatDate(tx.timestamp)])}
            {tx.frequency && <span className="ml-1">• {tx.frequency}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {tx.type === 'income' ? '+' : '-'}{fmt(Math.abs(tx.amount))}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(tx.id); }}
          disabled={toggling === tx.id}
          title={tx.recurringActive ? t('recurringPauseTitle') : t('recurringResumeTitle')}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
            tx.recurringActive ? 'bg-primary' : 'bg-gray-300'
          } disabled:opacity-60`}
        >
          <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
            tx.recurringActive ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
}

/**
 * 2026-05-03 (Section B·5): month-grid view of recurring transactions.
 *
 * The backend stores `tx.timestamp` as the LAST-seen epoch for each
 * recurring row, so we use day-of-month from that as a proxy for
 * "this is the day each cycle the user gets charged." Good enough
 * for the visualization — the user can still edit the row from the
 * list view if the day shifts. We render the current calendar month
 * with each day showing a dot per recurring row hitting that day,
 * coloured emerald (income) or rose (expense), plus a count badge
 * if more than one row lands on the same day. Hover tooltip lists
 * the rows + amounts.
 */
function RecurringCalendar({
  transactions,
  fmt,
}: {
  transactions: RecurringTx[];
  fmt: (n: number) => string;
}) {
  const { t, tFmt } = useI18n();
  // Group rows by day-of-month (1..31).
  const byDay = useMemo(() => {
    const map = new Map<number, RecurringTx[]>();
    transactions.forEach(tx => {
      const ms = tx.timestamp < 1e12 ? tx.timestamp * 1000 : tx.timestamp;
      const day = new Date(ms).getDate();
      const arr = map.get(day) ?? [];
      arr.push(tx);
      map.set(day, arr);
    });
    return map;
  }, [transactions]);

  // Build the current month's grid: 7 cols × N rows, with leading
  // blanks so day 1 lands on the correct weekday column.
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number; rows: RecurringTx[] } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, rows: byDay.get(d) ?? [] });
  }
  // Pad to a multiple of 7 so the last row aligns.
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
        {tFmt('recurringCalendarCaptionFmt', [monthLabel])}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wide text-gray-400 mb-1">
        {[t('recurringDowSun'), t('recurringDowMon'), t('recurringDowTue'), t('recurringDowWed'), t('recurringDowThu'), t('recurringDowFri'), t('recurringDowSat')].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="aspect-square" />;
          const isToday = cell.day === today.getDate();
          const incomeRows = cell.rows.filter(r => r.type === 'income');
          const expenseRows = cell.rows.filter(r => r.type !== 'income');
          const total = cell.rows.reduce((s, r) => s + (r.type === 'income' ? r.amount : -r.amount), 0);
          const tooltipText = cell.rows.length > 0
            ? cell.rows.map(r => `${r.type === 'income' ? '+' : '-'}${fmt(Math.abs(r.amount))} · ${r.description || r.category}`).join('\n')
            : '';
          return (
            <div
              key={i}
              title={tooltipText}
              className={`aspect-square rounded-md border text-[11px] flex flex-col p-1 ${
                isToday
                  ? 'border-primary bg-primary/5'
                  : cell.rows.length > 0
                  ? 'border-gray-200 bg-white hover:border-gray-300'
                  : 'border-transparent bg-gray-50/40'
              }`}
            >
              <span className={`font-medium ${isToday ? 'text-primary' : 'text-gray-700'}`}>{cell.day}</span>
              {cell.rows.length > 0 && (
                <div className="mt-auto space-y-0.5">
                  <div className="flex items-center gap-0.5 flex-wrap">
                    {incomeRows.slice(0, 3).map((_r, idx) => (
                      <span key={`i${idx}`} className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    ))}
                    {expenseRows.slice(0, 3).map((_r, idx) => (
                      <span key={`e${idx}`} className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                    ))}
                    {cell.rows.length > 6 && (
                      <span className="text-[9px] text-gray-500 ml-0.5">+{cell.rows.length - 6}</span>
                    )}
                  </div>
                  <p className={`text-[9px] tabular-nums truncate ${total >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {total >= 0 ? '+' : ''}{fmt(total)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {t('recurringLegendIncome')}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> {t('recurringLegendExpense')}</span>
      </div>
    </div>
  );
}

export default function RecurringPage() {
  const [transactions, setTransactions] = useState<RecurringTx[]>([]);
  const [loading, setLoading]           = useState(true);
  const [processing, setProcessing]     = useState(false);
  const [toggling, setToggling]         = useState<number | null>(null);
  // 2026-05-03 (Section B·5): list ↔ calendar toggle on Active rows.
  const [activeView, setActiveView]     = useState<'list' | 'calendar'>('list');
  // 2026-06-08 (founder): edit-frequency modal for a recurring row.
  // Clicking anywhere on a TxRow except the toggle opens this modal.
  const [editTx, setEditTx]             = useState<RecurringTx | null>(null);
  const [editFrequency, setEditFrequency] = useState<string>('monthly');
  const [savingEdit, setSavingEdit]     = useState(false);
  const { toast } = useToast();
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  // 2026-06-08 (founder): when the user clicks a row, seed the edit
  // modal's frequency from the row's current value. Declared AFTER
  // toast + t so the save handler below can close over them.
  useEffect(() => {
    if (editTx) setEditFrequency(editTx.frequency || 'monthly');
  }, [editTx]);
  const handleSaveEdit = useCallback(async () => {
    if (!editTx) return;
    setSavingEdit(true);
    try {
      await api.updateTransaction(editTx.id, { frequency: editFrequency, recurring: true });
      // Optimistic local update so the row reflects the new frequency
      // immediately even if a load() refresh is debounced.
      setTransactions(prev => prev.map(r => r.id === editTx.id ? { ...r, frequency: editFrequency } : r));
      toast(t('recurringFrequencyUpdated'), 'success');
      setEditTx(null);
    } catch {
      toast(t('recurringFrequencyUpdateFailed'), 'error');
    } finally {
      setSavingEdit(false);
    }
  }, [editTx, editFrequency, toast, t]);

  // RCR-1 fix (2026-05-15): surface what the backend already auto-detected
  // (recurring income streams + subscription charges) so the empty state
  // doesn't lie when /dashboard/cash-flow + /dashboard/subscriptions are
  // showing detected patterns. User can jump to the source page to act.
  type Detected = { name: string; cycle: string; amount: number; href: string };
  const [detected, setDetected] = useState<Detected[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRecurringTransactions();
      setTransactions(data?.transactions || data || []);
    } catch {
      toast(t('recurringLoadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    void load();
    // Best-effort fetch of auto-detected items in parallel; failures are
    // silent so the page still renders the manually-marked list.
    (async () => {
      try {
        const [streams, subs] = await Promise.allSettled([
          api.getIncomeStreams(),
          api.detectSubscriptions(),
        ]);
        const items: Detected[] = [];
        if (streams.status === 'fulfilled' && streams.value) {
          const s = streams.value as { streams?: Array<{ merchantName?: string; cadence?: string; averageAmount?: number; monthlyAmount?: number }> };
          (s?.streams ?? []).forEach(st => {
            items.push({
              name: st.merchantName ?? t('recurringDetectedIncomeStream'),
              cycle: st.cadence ?? t('recurringDetectedRecurringIncome'),
              amount: st.averageAmount ?? st.monthlyAmount ?? 0,
              href: '/dashboard/cash-flow',
            });
          });
        }
        if (subs.status === 'fulfilled' && subs.value) {
          const v = subs.value as { subscriptions?: Array<{ displayName?: string; name?: string; frequency?: string; amount?: number }> };
          (v?.subscriptions ?? []).forEach(s => {
            items.push({
              name: s.displayName ?? s.name ?? t('recurringDetectedSubscription'),
              cycle: s.frequency ?? t('recurringDetectedRecurring'),
              amount: s.amount ?? 0,
              href: '/dashboard/subscriptions',
            });
          });
        }
        setDetected(items);
      } catch {
        /* silent */
      }
    })();
  }, [load, t]);

  const handleToggle = async (id: number) => {
    setToggling(id);
    try {
      await api.toggleRecurring(id);
      await load();
      toast(t('recurringStatusUpdated'), 'success');
    } catch {
      toast(t('recurringStatusUpdateError'), 'error');
    } finally {
      setToggling(null);
    }
  };

  const handleProcessNow = async () => {
    setProcessing(true);
    try {
      const result = await api.processRecurring();
      const count = result?.processedCount ?? result?.processed ?? 0;
      toast(tFmt(count === 1 ? 'recurringProcessedFmt' : 'recurringProcessedPluralFmt', [count]), 'success');
      await load();
    } catch {
      toast(t('recurringProcessError'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const active   = transactions.filter(tx => tx.recurringActive);
  const inactive = transactions.filter(tx => !tx.recurringActive);

  const monthlyImpact = active.reduce((sum, tx) => {
    const amt = tx.type === 'income' ? tx.amount : -tx.amount;
    return sum + amt;
  }, 0);

  // 2026-05-02 (Monarch parity): 3-pillar header — Income / Expenses /
  // Credit cards. Recurring transactions don't have a "credit card" tag
  // in our data model, so we approximate it as the subset of expenses
  // that match Monarch's credit-card patterns (description includes
  // "credit", "card", "card payment", "minimum payment", "statement").
  // Where the heuristic doesn't fire, those rows fall back into the
  // Expenses pillar — which is correct in Monarch too.
  const isCreditCardLike = (tx: RecurringTx) => {
    if (tx.type === 'income') return false;
    const blob = `${tx.description ?? ''} ${tx.category ?? ''}`.toLowerCase();
    return /\b(credit\s*card|card\s*payment|minimum\s*payment|statement|amex|chase\s*card|capital\s*one)\b/.test(blob);
  };
  const incomeTxs = active.filter(tx => tx.type === 'income');
  const ccTxs = active.filter(isCreditCardLike);
  const expenseTxs = active.filter(tx => tx.type !== 'income' && !isCreditCardLike(tx));
  const sumAbs = (rows: RecurringTx[]) => rows.reduce((s, r) => s + Math.abs(r.amount), 0);
  const incomeTotal = sumAbs(incomeTxs);
  const expenseTotal = sumAbs(expenseTxs);
  const ccTotal = sumAbs(ccTxs);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title={t('recurringTitle')}
        subtitle={t('recurringSubtitle')}
        actions={
          <button
            onClick={handleProcessNow}
            disabled={processing || active.length === 0}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 font-medium"
          >
            {processing ? t('recurringProcessingBtn') : t('recurringProcessNowBtn')}
          </button>
        }
      />

      {/* 2026-05-03 (Monarch parity, second pass): orange "review now"
          banner surfacing paused recurring patterns. Monarch's recurring
          page lights up an orange strip whenever there are merchants
          the user hasn't actioned ("There are 13 new recurring merchants
          and accounts for you to review."). We don't have a separate
          "detected but unconfirmed" inbox yet, so the banner pulls
          double duty for inactive (paused) recurring rows — same
          behaviour shape: count + CTA that scrolls to the relevant
          section. Hidden when there's nothing to review.
          Visual reference: monarch-walkthrough.mov frame f_035. */}
      {inactive.length > 0 && (
        <a
          href="#paused-recurring"
          className="flex items-center justify-between gap-3 bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-xl px-4 py-3 mb-4 transition shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm" aria-hidden="true">
              {inactive.length}
            </span>
            <span className="text-sm font-medium truncate">
              {inactive.length === 1
                ? t('recurringReviewOneFmt')
                : tFmt('recurringReviewManyFmt', [inactive.length])}
            </span>
          </div>
          <span className="text-sm font-semibold underline-offset-2 hover:underline whitespace-nowrap">
            {t('recurringReviewNowCta')}
          </span>
        </a>
      )}

      {/* Monarch-parity 3-pillar header card.
          Income · Expenses · Credit cards. Each pillar shows the count
          of recurring rows ("X / Y statements"-style label), the
          received-vs-remaining split, and a thin progress bar.
          Visual reference: marketing/Monarch Screenshots screenshot
          captured 2026-05-01 22:36. */}
      {transactions.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PillarCard
              label={t('recurringPillarIncome')}
              count={incomeTxs.length}
              total={incomeTotal}
              fmt={fmt}
              color="emerald"
              labelTotal={tFmt('recurringExpectedFmt', [fmt(incomeTotal)])}
              foot={tFmt(incomeTxs.length === 1 ? 'recurringSourceFootFmt' : 'recurringSourceFootPluralFmt', [incomeTxs.length])}
            />
            <PillarCard
              label={t('recurringPillarExpenses')}
              count={expenseTxs.length}
              total={expenseTotal}
              fmt={fmt}
              color="rose"
              labelTotal={tFmt('recurringExpectedFmt', [fmt(expenseTotal)])}
              foot={tFmt(expenseTxs.length === 1 ? 'recurringExpenseFootFmt' : 'recurringExpenseFootPluralFmt', [expenseTxs.length])}
            />
            <PillarCard
              label={t('recurringPillarCreditCards')}
              count={ccTxs.length}
              total={ccTotal}
              fmt={fmt}
              color="slate"
              labelTotal={ccTotal > 0 ? tFmt('recurringDueFmt', [fmt(ccTotal)]) : t('recurringNoCardPayments')}
              foot={tFmt(ccTxs.length === 1 ? 'recurringCardFootFmt' : 'recurringCardFootPluralFmt', [ccTxs.length])}
            />
          </div>
          {/* Net monthly impact strip */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{t('recurringMonthlyImpact')}</p>
            <p className={`text-base font-bold tabular-nums ${monthlyImpact >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {monthlyImpact >= 0 ? '+' : ''}{fmt(monthlyImpact)}
            </p>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-800">
        <p className="font-semibold mb-1">{t('recurringInfoTitle')}</p>
        <p>{t('recurringInfoBodyPrefix')} <strong>{t('recurringInfoBodyEmphasis')}</strong> {t('recurringInfoBodySuffix')}</p>
      </div>

      {/* Active — list ↔ calendar view toggle (Section B·5).
          Calendar view groups recurring rows by day-of-month based on
          the last-seen date and surfaces them as dots on a 7-column
          month grid. Same data, different shape — list is best for
          editing, calendar is best for "when does my money move."
          Visual reference: monarch-walkthrough.mov frame f_038. */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-primary">{tFmt('recurringActiveHeadingFmt', [active.length])}</h2>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${activeView === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('recurringViewList')}
              </button>
              <button
                type="button"
                onClick={() => setActiveView('calendar')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${activeView === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('recurringViewCalendar')}
              </button>
            </div>
          </div>
          {activeView === 'list' ? (
            active.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} toggling={toggling} onToggle={handleToggle} onEdit={setEditTx} />)
          ) : (
            <RecurringCalendar transactions={active} fmt={fmt} />
          )}
        </div>
      )}

      {/* Paused */}
      {inactive.length > 0 && (
        <div id="paused-recurring" className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden scroll-mt-6">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-500">{tFmt('recurringPausedHeadingFmt', [inactive.length])}</h2>
          </div>
          {inactive.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} toggling={toggling} onToggle={handleToggle} onEdit={setEditTx} />)}
        </div>
      )}

      {transactions.length === 0 && detected.length > 0 && (
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-border">
            <h2 className="font-semibold text-gray-700 dark:text-foreground">{tFmt('recurringDetectedHeadingFmt', [detected.length])}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('recurringDetectedSubtitle')}
            </p>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-border">
            {detected.slice(0, 8).map((d, i) => (
              <li key={`${d.name}-${i}`} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-foreground truncate">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.cycle}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {d.amount > 0 && <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-foreground">{fmt(d.amount)}</p>}
                  <Link href={d.href} className="text-xs text-primary font-medium hover:underline">{t('recurringManageCta')}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {transactions.length === 0 && (
        <EmptyState
          illustration="receipt"
          title={detected.length > 0 ? t('recurringEmptyTitleManual') : t('recurringEmptyTitle')}
          description={t('recurringEmptyDesc')}
          actions={[
            { label: t('recurringEmptyAction'), href: '/dashboard/transactions', primary: true },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { name: t('recurringPreviewNetflix'), cat: t('recurringPreviewCatSubscriptions'), cycle: tFmt('recurringPreviewCycleFmt', [fmt(15.49)]) },
                { name: t('recurringPreviewGym'), cat: t('recurringPreviewCatHealth'), cycle: tFmt('recurringPreviewCycleFmt', [fmt(39)]) },
                { name: t('recurringPreviewIcloud'), cat: t('recurringPreviewCatSubscriptions'), cycle: tFmt('recurringPreviewCycleFmt', [fmt(2.99)]) },
              ].map((r) => (
                <div key={r.name} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-700">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.cat}</p>
                  </div>
                  <span className="text-xs text-gray-500">{r.cycle}</span>
                </div>
              ))}
            </div>
          }
        />
      )}

      {/* 2026-06-08 (founder): edit-frequency modal. Single-purpose: change
          the cadence of an existing recurring row. Other fields (amount,
          description, category) live on /dashboard/transactions and would
          bloat this modal. */}
      {editTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recurring-edit-title"
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !savingEdit && setEditTx(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="recurring-edit-title" className="text-lg font-semibold text-gray-900 mb-1">
              {t('recurringEditTitle')}
            </h2>
            <p className="text-sm text-gray-600 mb-4 truncate">
              {editTx.description || t('recurringNoDescription')}
            </p>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('txnFrequencyLabel')}
            </label>
            <select
              value={editFrequency}
              onChange={(e) => setEditFrequency(e.target.value)}
              disabled={savingEdit}
              className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 mb-6"
            >
              <option value="daily">{t('txnFreqDaily')}</option>
              <option value="weekly">{t('txnFreqWeekly')}</option>
              <option value="biweekly">{t('txnFreqBiweekly')}</option>
              <option value="monthly">{t('txnFreqMonthly')}</option>
              <option value="yearly">{t('txnFreqYearly')}</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setEditTx(null)}
                disabled={savingEdit}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {t('txnCancel')}
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {savingEdit ? t('txnSaving') : t('txnSaveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
