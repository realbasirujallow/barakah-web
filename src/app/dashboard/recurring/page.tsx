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

// ── Consolidated month overview (GET /api/recurring/overview) ────────────────
interface OverviewTile {
  expected?: number; received?: number;   // income tiles
  total?: number; paid?: number;          // expense / credit-card tiles
  remaining: number;
  count: number; totalCount: number; pendingCount: number;
}
interface OverviewItem {
  id: number;
  name: string;
  date: number;             // epoch millis of this occurrence
  paymentAccount: string | null;
  category: string;
  amount: number;
  group: 'income' | 'expense' | 'credit_card';
  frequency: string;
  paid: boolean;            // cleared (date already passed) / explicitly paid
  readOnly: boolean;
  source: string;
}
interface Overview {
  month: string;            // "YYYY-MM"
  currency: string;
  income: OverviewTile;
  expenses: OverviewTile;
  creditCards: OverviewTile;
  items: OverviewItem[];
  net: number;
}

function formatDate(epoch: number) {
  const ms = epoch < 1e12 ? epoch * 1000 : epoch;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Date helpers for the month navigator ──────────────────────────────────────
function currentMonthString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, (m - 1) + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/**
 * 2026-06-15 (Monarch parity): real summary tile fed by the backend overview
 * endpoint — shows the headline amount, a cleared/remaining progress bar, and
 * the "N of M pending" statement count. Replaces the old client-side heuristic
 * pillars (which faked the credit-card bucket via a description regex and had a
 * binary progress bar).
 */
function OverviewTileCard({
  label, headline, sub, foot, pct, color, fmt,
}: {
  label: string;
  headline: number;
  sub: string;
  foot: string;
  pct: number;
  color: 'emerald' | 'rose' | 'slate';
  fmt: (n: number) => string;
}) {
  const colors = {
    emerald: { dot: 'bg-emerald-600', bar: 'bg-emerald-500', amt: 'text-emerald-700 dark:text-emerald-400' },
    rose: { dot: 'bg-rose-600', bar: 'bg-rose-500', amt: 'text-rose-700 dark:text-rose-400' },
    slate: { dot: 'bg-slate-700 dark:bg-slate-300', bar: 'bg-slate-500', amt: 'text-foreground' },
  }[color];
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
        </div>
        <p className={`text-sm font-bold tabular-nums ${colors.amt}`}>{fmt(headline)}</p>
      </div>
      <div className="relative h-1.5 bg-muted/50 rounded-full overflow-hidden mb-1.5">
        <div
          className={`absolute inset-y-0 left-0 ${colors.bar} rounded-full transition-all`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{sub}</span>
        <span>{foot}</span>
      </div>
    </div>
  );
}

// Defined outside RecurringPage to avoid recreating the component type on every render.
interface TxRowProps {
  tx: RecurringTx;
  fmt: (v: number) => string;
  toggling: number | null;
  onToggle: (id: number) => void;
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
 */
function RecurringCalendar({
  transactions,
  fmt,
}: {
  transactions: RecurringTx[];
  fmt: (n: number) => string;
}) {
  const { t, tFmt } = useI18n();
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

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number; rows: RecurringTx[] } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, rows: byDay.get(d) ?? [] });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const calMonthLabel = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
        {tFmt('recurringCalendarCaptionFmt', [calMonthLabel])}
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
  const [activeView, setActiveView]     = useState<'list' | 'calendar'>('list');
  const [editTx, setEditTx]             = useState<RecurringTx | null>(null);
  const [editFrequency, setEditFrequency] = useState<string>('monthly');
  const [savingEdit, setSavingEdit]     = useState(false);
  // 2026-06-15 (Monarch parity): consolidated month overview + month navigator.
  const [month, setMonth]               = useState<string>(currentMonthString());
  const [overview, setOverview]         = useState<Overview | null>(null);
  const { toast } = useToast();
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  useEffect(() => {
    if (editTx) setEditFrequency(editTx.frequency || 'monthly');
  }, [editTx]);

  type Detected = { name: string; cycle: string; amount: number; href: string };
  const [detected, setDetected] = useState<Detected[]>([]);

  const loadDetected = useCallback(async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2026-06-15: month overview fetch — re-runs whenever the navigator month
  // changes. Mount-fired + secondary, so suppressUnauthorized is handled in api.
  const loadOverview = useCallback(async (m: string) => {
    try {
      const data = await api.getRecurringOverview(m) as Overview | null;
      setOverview(data ?? null);
    } catch {
      setOverview(null);
    }
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editTx) return;
    setSavingEdit(true);
    try {
      await api.updateTransaction(editTx.id, { frequency: editFrequency, recurring: true });
      setTransactions(prev => prev.map(r => r.id === editTx.id ? { ...r, frequency: editFrequency } : r));
      toast(t('recurringFrequencyUpdated'), 'success');
      setEditTx(null);
      void loadDetected();
      void loadOverview(month);
    } catch {
      toast(t('recurringFrequencyUpdateFailed'), 'error');
    } finally {
      setSavingEdit(false);
    }
  }, [editTx, editFrequency, toast, t, loadDetected, loadOverview, month]);

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
    if (!editTx) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !savingEdit) setEditTx(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editTx, savingEdit]);

  useEffect(() => {
    void load();
    void loadDetected();
  }, [load, loadDetected]);

  // Refetch the overview whenever the selected month changes.
  useEffect(() => {
    void loadOverview(month);
  }, [month, loadOverview]);

  const handleToggle = async (id: number) => {
    setToggling(id);
    try {
      await api.toggleRecurring(id);
      await Promise.all([load(), loadDetected(), loadOverview(month)]);
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
      await Promise.all([load(), loadDetected(), loadOverview(month)]);
    } catch {
      toast(t('recurringProcessError'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Relative-day label for an occurrence date ("Today", "in 3 days", "cleared").
  const relLabel = useCallback((epochMs: number, paid: boolean): string => {
    const now = Date.now();
    const days = Math.round((epochMs - now) / (24 * 60 * 60 * 1000));
    if (paid && epochMs <= now) return t('recurringRelClearedTag');
    if (days === 0) return t('recurringRelToday');
    if (days === 1) return t('recurringRelInOneDay');
    if (days > 1) return tFmt('recurringRelInDaysFmt', [days]);
    return tFmt('recurringRelDaysAgoFmt', [Math.abs(days)]);
  }, [t, tFmt]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const active   = transactions.filter(tx => tx.recurringActive);
  const inactive = transactions.filter(tx => !tx.recurringActive);

  // Overview tile math (cleared progress %). Income → received/expected; the
  // expense/credit-card tiles → paid/total.
  const incExpected = overview?.income.expected ?? 0;
  const incReceived = overview?.income.received ?? 0;
  const expTotal = overview?.expenses.total ?? 0;
  const expPaid = overview?.expenses.paid ?? 0;
  const ccTotal = overview?.creditCards.total ?? 0;
  const ccPaid = overview?.creditCards.paid ?? 0;
  const pctOf = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);
  const isThisMonth = month === currentMonthString();

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

      {/* 2026-06-15 (Monarch parity): month navigator. */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">{monthLabel(month)}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth(m => shiftMonth(m, -1))}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/50"
          >‹</button>
          <button
            type="button"
            onClick={() => setMonth(currentMonthString())}
            disabled={isThisMonth}
            className="px-3 h-8 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 disabled:opacity-40"
          >{t('recurringTodayBtn')}</button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth(m => shiftMonth(m, 1))}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted/50"
          >›</button>
        </div>
      </div>

      {/* Real 3-tile overview fed by /api/recurring/overview. */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <OverviewTileCard
            label={t('recurringPillarIncome')}
            headline={incExpected}
            sub={tFmt('recurringReceivedRemainingFmt', [fmt(incReceived), fmt(Math.max(0, incExpected - incReceived))])}
            foot={tFmt(
              (overview?.income.totalCount ?? 0) === 1 ? 'recurringSourceFootFmt' : 'recurringSourceFootPluralFmt',
              [overview?.income.totalCount ?? 0],
            )}
            pct={pctOf(incReceived, incExpected)}
            color="emerald"
            fmt={fmt}
          />
          <OverviewTileCard
            label={t('recurringPillarExpenses')}
            headline={expTotal}
            sub={tFmt('recurringPaidRemainingFmt', [fmt(expPaid), fmt(Math.max(0, expTotal - expPaid))])}
            foot={(overview?.expenses.pendingCount ?? 0) > 0
              ? tFmt('recurringPendingOfFmt', [overview?.expenses.pendingCount ?? 0, overview?.expenses.totalCount ?? 0])
              : t('recurringAllClear')}
            pct={pctOf(expPaid, expTotal)}
            color="rose"
            fmt={fmt}
          />
          <OverviewTileCard
            label={t('recurringPillarCreditCards')}
            headline={ccTotal}
            sub={tFmt('recurringPaidRemainingFmt', [fmt(ccPaid), fmt(Math.max(0, ccTotal - ccPaid))])}
            foot={(overview?.creditCards.pendingCount ?? 0) > 0
              ? tFmt('recurringPendingOfFmt', [overview?.creditCards.pendingCount ?? 0, overview?.creditCards.totalCount ?? 0])
              : t('recurringAllClear')}
            pct={pctOf(ccPaid, ccTotal)}
            color="slate"
            fmt={fmt}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{t('recurringNetThisMonth')}</p>
          <p className={`text-base font-bold tabular-nums ${(overview?.net ?? 0) >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {(overview?.net ?? 0) >= 0 ? '+' : ''}{fmt(overview?.net ?? 0)}
          </p>
        </div>
      </div>

      {/* Unified "this month" list — every income / bill / card occurrence,
          date-sorted. The Monarch single-list layout: name, date, account,
          category, amount. */}
      <div className="bg-card rounded-2xl border border-border mb-5 overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">{t('recurringUpcomingTitle')}</h2>
        </div>
        {(overview?.items?.length ?? 0) === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">{t('recurringEmptyMonth')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {(overview?.items ?? []).map((it, i) => {
              const income = it.group === 'income';
              return (
                <li key={`${it.group}-${it.id}-${i}`} className={`flex items-center gap-3 px-5 py-3 ${it.paid ? 'opacity-60' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <CategoryIcon category={it.category} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{it.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatDate(it.date)} <span className="opacity-70">· {relLabel(it.date, it.paid)}</span>
                      {it.paymentAccount ? <span className="opacity-70"> · {it.paymentAccount}</span> : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold tabular-nums ${income ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                      {income ? '+' : ''}{fmt(it.amount)}
                    </p>
                    <p className="text-[11px] text-muted-foreground capitalize">{it.category}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Review-now banner for paused recurring rows. */}
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

      {/* Manage recurring rules — the editable list (pause/resume + edit cadence). */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-primary">{t('recurringManageRulesTitle')}</h2>
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

      {transactions.length === 0 && (overview?.items?.length ?? 0) === 0 && (
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

      {/* Edit-frequency modal. */}
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
