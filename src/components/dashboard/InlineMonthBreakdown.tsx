// 2026-05-03 (Step 5): in-page drilldown for cash-flow / analytics.
//
// When the user clicks a month bar / quarter bar / year bar / table
// row, instead of routing them to /dashboard/cash-flow?month=X (which
// loses context and reflows the entire page), we expand an inline
// breakdown right below the chart on the SAME page. Mirrors Monarch's
// behavior — "you stay where you are, the detail panel just appears."
//
// Pulls /api/cashflow/breakdown for the selected month (dimension =
// 'category'). Renders three columns: Income / Expenses / Sadaqah-
// Zakat with sortable rows + category bars.
//
// 2026-05-06: clicking a category row stays inside this panel instead
// of routing to /dashboard/transactions?category=… — that route change
// was the same break-of-context Monarch deliberately avoids. Now we
// fetch the underlying transactions for (category × month) and render
// them inline below the columns; a "← Back to breakdown" button
// dismisses the inner detail. Power-users still have "View full Cash
// Flow →" at the footer if they want the full /dashboard/cash-flow.

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useCurrency } from '../../lib/useCurrency';
// 2026-06-11 (i18n bug cluster): panel copy was hardcoded English. Reuses
// the cashFlow* keys (this panel mirrors /dashboard/cash-flow) plus new
// imb* keys. `t as tStandalone` is for non-hook contexts (catch handlers),
// same pattern as transactions/page.tsx.
import { useI18n, t as tStandalone } from '../../lib/i18n';

type BreakdownRow = {
  key: string;
  label?: string;
  amount: number;
  pct?: number;
};

interface BreakdownResponse {
  income?: BreakdownRow[];
  expenses?: BreakdownRow[];
  sadaqahZakat?: BreakdownRow[];
  totals?: {
    income?: number;
    expenses?: number;
    sadaqahZakat?: number;
    savings?: number;
  };
}

type CategoryTx = {
  id: number;
  type: string;
  category: string;
  amount: number;
  description: string;
  merchantName?: string;
  /** Backend returns epoch millis on `timestamp`. Older endpoints used
   *  `date` as 'YYYY-MM-DD'. Accept both so the filter is robust. */
  timestamp?: number;
  date?: string;
  currency?: string;
};

interface SelectedCategory {
  /** Backend category key, e.g. 'food', 'shopping' */
  key: string;
  /** Display label */
  label: string;
  /** Tone for the header pill */
  tone: 'income' | 'expense' | 'sadaqah';
  /** Section total amount (so we can show "Showing 12 of 18 in $487.42") */
  total: number;
}

function monthLong(yyyyMM: string): string {
  if (!yyyyMM || yyyyMM.length < 7) return yyyyMM;
  const y = parseInt(yyyyMM.slice(0, 4), 10);
  const m = parseInt(yyyyMM.slice(5, 7), 10);
  // timeZone:'UTC' avoids the off-by-one render where Date.UTC anchors
  // midnight UTC and toLocaleDateString defaults to local TZ. Same fix
  // we made on cash-flow/page.tsx.
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface InlineMonthBreakdownProps {
  /** YYYY-MM key. When null/empty the panel renders nothing. */
  month: string;
  /** Called when the user taps the close (×) button. */
  onClose?: () => void;
}

export function InlineMonthBreakdown({ month, onClose }: InlineMonthBreakdownProps) {
  const { fmt } = useCurrency();
  const { t } = useI18n();
  const [data, setData] = useState<BreakdownResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2026-05-06: in-panel category drilldown — when set, the columns
  // hide and we show that category's transactions inline.
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  const [categoryTxs, setCategoryTxs] = useState<CategoryTx[] | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!month) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.getCashflowBreakdown(month, 'category')
      .then((d: unknown) => {
        if (cancelled) return;
        setData(d as BreakdownResponse);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : tStandalone('imbLoadError'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [month]);

  // Reset category drilldown whenever the month changes — the
  // previously-selected category may not exist or have transactions
  // in the new month, and surfacing stale rows is worse than empty.
  useEffect(() => {
    setSelectedCategory(null);
    setCategoryTxs(null);
    setCategoryError(null);
  }, [month]);

  // Fetch transactions for the selected category × month. Uses the
  // existing /api/transactions/list search (matches description /
  // merchantName / notes / category, case-insensitive) then filters
  // client-side by exact category key + month so we don't surface
  // false positives from text-search hits in other categories.
  useEffect(() => {
    if (!selectedCategory || !month) return;
    let cancelled = false;
    setCategoryLoading(true);
    setCategoryError(null);
    setCategoryTxs(null);
    const txType = selectedCategory.tone === 'income' ? 'income' : 'expense';
    api.getTransactions(txType, 0, 100, selectedCategory.key)
      .then((res: unknown) => {
        if (cancelled) return;
        const list = (res as { transactions?: CategoryTx[] })?.transactions ?? [];
        const wantKey = selectedCategory.key.toLowerCase();
        // Convert "YYYY-MM" → [startMs, endMs) so we can match either
        // legacy `date` strings or current `timestamp` epoch-millis from
        // the backend. UTC anchors to keep month edges stable across
        // timezones (same approach as monthLong above).
        const [yStr, mStr] = month.split('-');
        const yy = parseInt(yStr, 10);
        const mm = parseInt(mStr, 10);
        const startMs = Date.UTC(yy, mm - 1, 1);
        const endMs = Date.UTC(yy, mm, 1);
        const filtered = list.filter(t => {
          if (!t || typeof t !== 'object') return false;
          const cat = String(t.category ?? '').toLowerCase();
          if (cat !== wantKey) return false;
          if (typeof t.timestamp === 'number') {
            return t.timestamp >= startMs && t.timestamp < endMs;
          }
          if (typeof t.date === 'string') {
            return t.date.startsWith(month);
          }
          return false;
        });
        setCategoryTxs(filtered);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setCategoryError(e instanceof Error ? e.message : tStandalone('txnLoadFailed'));
      })
      .finally(() => {
        if (!cancelled) setCategoryLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedCategory, month]);

  const totals = data?.totals ?? {};
  const income = totals.income ?? 0;
  const expenses = totals.expenses ?? 0;
  // Backend returns expenses INCLUSIVE of sadaqah/zakat as of 2026-05-04
  // (founder feedback: "charity/sadaqah/zakat taken out should be an
  // expense"). Savings is therefore just income − expenses; no extra
  // sadaqah subtraction.
  const savings = totals.savings ?? (income - expenses);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const sections = useMemo(() => ([
    { title: t('cashFlowIncome'),       tone: 'income',   rows: data?.income ?? [],       total: totals.income ?? 0 },
    { title: t('cashFlowExpenses'),     tone: 'expense',  rows: data?.expenses ?? [],     total: totals.expenses ?? 0 },
    { title: t('cashFlowSadaqahZakat'), tone: 'sadaqah',  rows: data?.sadaqahZakat ?? [], total: totals.sadaqahZakat ?? 0 },
  ]), [data, totals.income, totals.expenses, totals.sadaqahZakat, t]);

  if (!month) return null;

  return (
    <section className="bg-card rounded-2xl border border-border p-5 mt-4">
      {/* Header — month + close button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{t('cashFlowSelectedPeriod')}</p>
          <p className="text-xl font-bold text-foreground">{monthLong(month)}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('imbCloseAria')}
            className="text-gray-500 hover:text-gray-800 transition rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            ×
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {t('cashFlowLoadingBreakdown')}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* 4-stat KPI strip — Income / Expenses / Savings / Savings Rate */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <Stat label={t('cashFlowIncome')}       value={fmt(income)}     dotClass="bg-emerald-600" valueClass="text-emerald-700" />
            <Stat label={t('cashFlowExpenses')}     value={fmt(expenses)}   dotClass="bg-rose-600"    valueClass="text-rose-700" />
            <Stat label={t('cashFlowTotalSavings')} value={fmt(savings)}    dotClass="bg-slate-700"   valueClass="text-foreground" />
            <Stat label={t('cashFlowSavingsRate')}  value={`${savingsRate}%`} dotClass="bg-amber-500" valueClass={savingsRate >= 20 ? 'text-emerald-700' : 'text-foreground'} />
          </div>

          {selectedCategory ? (
            <CategoryDrilldown
              category={selectedCategory}
              month={month}
              transactions={categoryTxs}
              loading={categoryLoading}
              error={categoryError}
              fmt={fmt}
              onBack={() => setSelectedCategory(null)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {sections.map(s => (
                <BreakdownColumn
                  key={s.title}
                  title={s.title}
                  tone={s.tone as 'income' | 'expense' | 'sadaqah'}
                  rows={s.rows}
                  total={s.total}
                  fmt={fmt}
                  onSelectCategory={(row) => setSelectedCategory({
                    key: row.key,
                    label: row.label ?? row.key,
                    tone: s.tone as 'income' | 'expense' | 'sadaqah',
                    // Per-category total (e.g. Shopping = $244.99), NOT
                    // the parent section total ($385.19 for all expenses).
                    total: row.amount,
                  })}
                />
              ))}
            </div>
          )}

          {/* Footer — link to full Cash Flow page for power-users */}
          <div className="mt-4 pt-4 border-t border-border text-right">
            <Link
              href={`/dashboard/cash-flow?month=${month}`}
              className="text-sm text-primary font-semibold hover:underline"
            >
              {t('imbViewFullCashFlow')}
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ label, value, dotClass, valueClass }: {
  label: string;
  value: string;
  dotClass: string;
  valueClass: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} aria-hidden="true" />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className={`text-xl font-bold tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function BreakdownColumn({ title, tone, rows, total, fmt, onSelectCategory }: {
  title: string;
  tone: 'income' | 'expense' | 'sadaqah';
  rows: BreakdownRow[];
  total: number;
  fmt: (n: number) => string;
  /** Tap a row to drill down inside this same panel (Monarch parity). */
  onSelectCategory: (row: BreakdownRow) => void;
}) {
  const { t, tFmt } = useI18n();
  const colorClass =
    tone === 'income'   ? 'text-emerald-700' :
    tone === 'expense'  ? 'text-rose-700' :
                          'text-amber-700';
  const barClass =
    tone === 'income'   ? 'bg-emerald-500' :
    tone === 'expense'  ? 'bg-rose-500' :
                          'bg-amber-500';

  if (rows.length === 0) {
    const emptyKey =
      tone === 'income'  ? 'cashFlowNoIncomeMonth' :
      tone === 'expense' ? 'cashFlowNoExpensesMonth' :
                           'cashFlowNoCharityMonth';
    return (
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
        <p className="text-xs text-muted-foreground italic py-3">
          {t(emptyKey)}
        </p>
      </div>
    );
  }

  const maxAmount = Math.max(...rows.map(r => r.amount));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className={`text-sm font-bold tabular-nums ${colorClass}`}>{fmt(total)}</p>
      </div>
      <ul className="space-y-1.5">
        {rows.map(row => {
          const widthPct = maxAmount > 0 ? (row.amount / maxAmount) * 100 : 0;
          return (
            <li key={row.key}>
              <button
                type="button"
                onClick={() => onSelectCategory(row)}
                className="w-full text-start block py-1.5 px-1 hover:bg-accent/40 rounded transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label={tFmt('imbDrillAriaFmt', [(row.label ?? row.key).replace(/_/g, ' ')])}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="capitalize text-foreground">{(row.label ?? row.key).replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-foreground tabular-nums">{fmt(row.amount)}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-1">
                  <div className={`h-1 rounded-full ${barClass}`} style={{ width: `${widthPct}%` }} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CategoryDrilldown({
  category,
  month,
  transactions,
  loading,
  error,
  fmt,
  onBack,
}: {
  category: SelectedCategory;
  month: string;
  transactions: CategoryTx[] | null;
  loading: boolean;
  error: string | null;
  fmt: (n: number) => string;
  onBack: () => void;
}) {
  const { t, tFmt } = useI18n();
  const tonePill =
    category.tone === 'income'  ? 'bg-emerald-50 text-emerald-700' :
    category.tone === 'expense' ? 'bg-rose-50 text-rose-700' :
                                  'bg-amber-50 text-amber-700';
  const amountClass =
    category.tone === 'income' ? 'text-emerald-700' : 'text-rose-700';
  const toneLabel =
    category.tone === 'income'  ? t('txnBadgeIncome') :
    category.tone === 'expense' ? t('txnBadgeExpense') :
                                  t('sadaqah');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/40 rounded px-1"
          aria-label={t('imbBackToBreakdown')}
        >
          {t('imbBackToBreakdown')}
        </button>
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${tonePill}`}>
          {category.label.replace(/_/g, ' ')} · {toneLabel}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <p className="text-base font-semibold text-foreground capitalize">
          {category.label.replace(/_/g, ' ')}
        </p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {t('imbTotalLabel')} <span className="font-bold text-foreground">{fmt(category.total)}</span>
        </p>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {t('imbLoadingTransactions')}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-8 text-rose-700 text-sm">{error}</div>
      )}

      {!loading && !error && transactions && transactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {tFmt('imbNoTransactionsFmt', [monthLong(month)])}
        </div>
      )}

      {!loading && !error && transactions && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-start">
                <th className="py-2 px-2 text-xs font-medium text-muted-foreground">{t('ledgerColDate')}</th>
                <th className="py-2 px-2 text-xs font-medium text-muted-foreground">{t('ledgerColDescription')}</th>
                <th className="py-2 px-2 text-xs font-medium text-muted-foreground">{t('importColMerchant')}</th>
                <th className="py-2 px-2 text-xs font-medium text-muted-foreground text-right">{t('ledgerColAmount')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => {
                const dateStr = typeof t.timestamp === 'number'
                  ? new Date(t.timestamp).toISOString().slice(0, 10)
                  : (t.date ? String(t.date).slice(0, 10) : '');
                return (
                <tr key={t.id} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="py-2 px-2 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                    {dateStr}
                  </td>
                  <td className="py-2 px-2 text-foreground">
                    {t.description || '—'}
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">
                    {t.merchantName || '—'}
                  </td>
                  <td className={`py-2 px-2 text-right font-semibold tabular-nums ${amountClass}`}>
                    {fmt(t.amount)}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {tFmt(transactions.length === 1 ? 'imbShowingOneFmt' : 'imbShowingManyFmt', [transactions.length, monthLong(month)])}
          </p>
        </div>
      )}
    </div>
  );
}
