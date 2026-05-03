'use client';

/**
 * PR 3 of 5 in the Monarch-style Cash Flow series.
 *
 * Web counterpart to the Flutter Cash Flow screen shipped in PR 2
 * (`barakah_app/lib/screens/cash_flow_screen.dart`). Same backend
 * (`/api/cashflow/months` + `/api/cashflow/breakdown` from PR 1) so
 * the data shape and the four-pillar model (Income / Expenses /
 * Sadaqah-Zakat / Savings) are identical.
 *
 * This PR ships:
 *   • 13-month bar chart (income green / expenses red back-to-back)
 *     with click-to-select month
 *   • Four-pillar stat strip below
 *   • Breakdown placeholder card (replaced in PR 4 with the real
 *     income/expenses/sadaqah-zakat lists with category/merchant
 *     tab switcher and tap-to-drill-down)
 *
 * Web has more screen real estate than mobile. We use a 2-column
 * layout on lg+ — chart left, stat strip right — instead of the
 * stacked mobile pattern. That'll continue when breakdowns land
 * in PR 4 (income/expenses side-by-side on lg+, stacked on mobile).
 */

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { CategoryIcon } from '../../../lib/categoryIcon';
import {
  Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  ReferenceLine, ComposedChart, Line, Sankey, Layer, Rectangle,
} from 'recharts';

interface MonthRow {
  month: string;        // "2026-03"
  income: number;
  expenses: number;
  sadaqahZakat: number;
  savings: number;
}

interface BreakdownRow {
  key: string;
  label: string;
  amount: number;
  pct: number;
}

interface BreakdownResponse {
  month: string;
  dimension: 'category' | 'merchant';
  totals: { income: number; expenses: number; sadaqahZakat: number; savings: number };
  income: BreakdownRow[];
  expenses: BreakdownRow[];
  sadaqahZakat: BreakdownRow[];
}

type Dimension = 'category' | 'merchant';
type TimeView = 'monthly' | 'quarterly' | 'yearly';
type ChartView = 'bars' | 'sankey';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthShort(yyyyMM: string): string {
  if (!yyyyMM || yyyyMM.length < 7) return yyyyMM;
  const m = parseInt(yyyyMM.slice(5, 7), 10);
  return MONTH_NAMES[Math.max(0, Math.min(11, m - 1))];
}

function monthLong(yyyyMM: string): string {
  if (!yyyyMM || yyyyMM.length < 7) return yyyyMM;
  const y = parseInt(yyyyMM.slice(0, 4), 10);
  const m = parseInt(yyyyMM.slice(5, 7), 10);
  // 2026-05-03: format in UTC. Constructing the Date with `Date.UTC`
  // anchors midnight at the start of the target month UTC, which in
  // any timezone west of UTC (e.g. America/New_York) renders as the
  // PREVIOUS day in local time — and toLocaleDateString picks up the
  // local TZ by default, so April 2026 was rendering as "March 2026"
  // for any user east of GMT-?. Pinning the formatter to UTC keeps
  // the month string consistent with the YYYY-MM key the API returns.
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function CashFlowPage() {
  const { fmt } = useCurrency();
  // 2026-05-01: ?month=YYYY-MM URL param for deep-link from /dashboard/analytics
  // chart drills. When present, that month is selected on first paint instead
  // of defaulting to "most recent." Validated against the loaded months list
  // — invalid/stale month falls back to most-recent.
  const searchParams = useSearchParams();
  const urlMonth = searchParams?.get('month') ?? '';

  const [months, setMonths] = React.useState<MonthRow[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // PR 4 (2026-05-01): per-month breakdown + dimension toggle
  // (Category / Merchant). Re-fetches when month or dimension changes.
  const [dimension, setDimension] = React.useState<Dimension>('category');
  const [breakdown, setBreakdown] = React.useState<BreakdownResponse | null>(null);
  const [breakdownLoading, setBreakdownLoading] = React.useState(false);

  // 2026-05-02: Monarch-parity time-view selector. Backend only returns
  // monthly buckets; quarterly/yearly are client-side roll-ups so the
  // chart can show the same data three different ways without a new API.
  const [timeView, setTimeView] = React.useState<TimeView>('monthly');

  // 2026-05-02: Bars vs Sankey. Sankey shows the selected month's
  // breakdown as flow from income sources → income total → expense
  // categories + Sadaqah/Zakat + Savings. Same surface Monarch ships
  // at /reports/cash-flow → "Breakdown" sub-view.
  const [chartView, setChartView] = React.useState<ChartView>('bars');

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = (await api.getCashflowMonths(13)) as { months?: MonthRow[] };
        if (cancelled) return;
        const list = result?.months ?? [];
        setMonths(list);
        // Pre-select the URL-param month if it's in the loaded set;
        // otherwise default to the most recent month.
        const urlInList = urlMonth && list.some(m => m.month === urlMonth);
        setSelectedMonth(
          urlInList ? urlMonth :
          list.length > 0 ? list[list.length - 1].month :
          ''
        );
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load cash flow');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [urlMonth]);

  // Re-fetch breakdown whenever month or dimension changes.
  React.useEffect(() => {
    if (!selectedMonth) {
      setBreakdown(null);
      return;
    }
    let cancelled = false;
    setBreakdownLoading(true);
    (async () => {
      try {
        const result = await api.getCashflowBreakdown(selectedMonth, dimension);
        if (!cancelled) setBreakdown(result as BreakdownResponse);
      } catch {
        // Don't error the whole page on a breakdown failure — chart + strip
        // already rendered from the months call. Just blank the lists.
        if (!cancelled) setBreakdown(null);
      } finally {
        if (!cancelled) setBreakdownLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedMonth, dimension]);

  const selected = months.find(m => m.month === selectedMonth);

  // 2026-05-02: client-side roll-up of months → quarters/years.
  // Keeps the bar-chart UI identical regardless of view; only the
  // bucket label and span change. Backend stays month-granular.
  const chartBuckets = React.useMemo(() => {
    if (timeView === 'monthly') {
      return months.map((m) => ({
        bucket: m.month,
        label: monthShort(m.month),
        income: m.income,
        expenses: m.expenses,
        sadaqahZakat: m.sadaqahZakat,
        savings: m.savings,
        net: m.income - m.expenses - m.sadaqahZakat,
        sourceMonth: m.month,
      }));
    }
    if (timeView === 'quarterly') {
      const map = new Map<string, MonthRow & { bucket: string }>();
      months.forEach((m) => {
        const y = m.month.slice(0, 4);
        const monthNum = parseInt(m.month.slice(5, 7), 10);
        const q = Math.ceil(monthNum / 3);
        const bucket = `${y}-Q${q}`;
        const existing = map.get(bucket);
        if (existing) {
          existing.income += m.income;
          existing.expenses += m.expenses;
          existing.sadaqahZakat += m.sadaqahZakat;
          existing.savings += m.savings;
        } else {
          map.set(bucket, {
            bucket,
            month: m.month,
            income: m.income,
            expenses: m.expenses,
            sadaqahZakat: m.sadaqahZakat,
            savings: m.savings,
          });
        }
      });
      return Array.from(map.values()).map((b) => ({
        bucket: b.bucket,
        label: b.bucket.slice(5),
        income: b.income,
        expenses: b.expenses,
        sadaqahZakat: b.sadaqahZakat,
        savings: b.savings,
        net: b.income - b.expenses - b.sadaqahZakat,
        sourceMonth: b.month,
      }));
    }
    // yearly
    const map = new Map<string, MonthRow & { bucket: string }>();
    months.forEach((m) => {
      const y = m.month.slice(0, 4);
      const existing = map.get(y);
      if (existing) {
        existing.income += m.income;
        existing.expenses += m.expenses;
        existing.sadaqahZakat += m.sadaqahZakat;
        existing.savings += m.savings;
      } else {
        map.set(y, {
          bucket: y,
          month: m.month,
          income: m.income,
          expenses: m.expenses,
          sadaqahZakat: m.sadaqahZakat,
          savings: m.savings,
        });
      }
    });
    return Array.from(map.values()).map((b) => ({
      bucket: b.bucket,
      label: b.bucket,
      income: b.income,
      expenses: b.expenses,
      sadaqahZakat: b.sadaqahZakat,
      savings: b.savings,
      net: b.income - b.expenses - b.sadaqahZakat,
      sourceMonth: b.month,
    }));
  }, [months, timeView]);

  // Year-divider markers for the bar chart (Monarch shows
  // "← 2024 | 2025 → | 2025 | 2026 →" on month boundaries).
  const yearMarkers = React.useMemo(() => {
    if (timeView !== 'monthly') return [] as Array<{ index: number; year: string }>;
    const result: Array<{ index: number; year: string }> = [];
    let prevYear = '';
    chartBuckets.forEach((b, i) => {
      const y = b.bucket.slice(0, 4);
      if (y !== prevYear) {
        result.push({ index: i, year: y });
        prevYear = y;
      }
    });
    return result;
  }, [chartBuckets, timeView]);

  // Savings rate % — Monarch's 4th stat. Floor at 0 to avoid the
  // confusing "negative savings rate" that a single overspending
  // month produces; we already show negative savings as the dollar
  // figure in the third card.
  const savingsRatePct = selected && selected.income > 0
    ? Math.max(0, Math.round((selected.savings / selected.income) * 100))
    : 0;

  // 2026-05-02: Sankey data — income sources → "Income" → outflows.
  // Built from the same breakdown payload that powers the category
  // lists below, so flipping bars↔sankey is free (no extra API call).
  // Recharts expects { nodes: [{name}], links: [{source, target, value}] }.
  //
  // Polish round (Monarch parity gap #5): nodes carry the matching
  // breakdown key so SankeyNode can navigate to the filtered
  // transactions list when clicked. Also stash totalIn / totalOut on
  // each node so the tooltip can show "% of income" / "% of expenses".
  const sankeyData = React.useMemo(() => {
    if (!breakdown) return null;
    // Take top 6 incomes + top 8 expenses to keep the Sankey readable.
    const topIncomes = [...breakdown.income].sort((a, b) => b.amount - a.amount).slice(0, 6);
    const topExpenses = [...breakdown.expenses].sort((a, b) => b.amount - a.amount).slice(0, 8);
    // Aggregate the rest into "Other".
    const otherIncome = breakdown.income.slice(6).reduce((s, r) => s + r.amount, 0);
    const otherExpense = breakdown.expenses.slice(8).reduce((s, r) => s + r.amount, 0);
    const incomeRows = otherIncome > 0
      ? [...topIncomes, { key: '__other_income', label: 'Other income', amount: otherIncome, pct: 0 }]
      : topIncomes;
    const expenseRows = otherExpense > 0
      ? [...topExpenses, { key: '__other_expense', label: 'Other expenses', amount: otherExpense, pct: 0 }]
      : topExpenses;
    if (incomeRows.length === 0 && expenseRows.length === 0) return null;

    const totalIncome = incomeRows.reduce((s, r) => s + r.amount, 0);
    const totalOutflow =
        expenseRows.reduce((s, r) => s + r.amount, 0)
      + (breakdown.totals.sadaqahZakat > 0 ? breakdown.totals.sadaqahZakat : 0)
      + (breakdown.totals.savings > 0 ? breakdown.totals.savings : 0);

    // Node order: income sources, then "Income", then outflow buckets.
    type SkNode = {
      name: string;
      kind: 'income' | 'hub' | 'outflow';
      // Drill-down key — empty for the hub and aggregated rows since we
      // can't filter the transactions page by "everything". Click-through
      // is suppressed when this is empty.
      categoryKey?: string;
      // For tooltip percentage. Income nodes get % of total inflow;
      // outflow nodes get % of total outflow. Hub is omitted.
      percentOfSide?: number;
    };
    const nodes: SkNode[] = [];
    incomeRows.forEach(r => nodes.push({
      name: r.label,
      kind: 'income',
      categoryKey: r.key.startsWith('__other_') ? undefined : r.key,
      percentOfSide: totalIncome > 0 ? (r.amount / totalIncome) * 100 : 0,
    }));
    const hubIdx = nodes.length;
    nodes.push({ name: 'Income', kind: 'hub' });
    expenseRows.forEach(r => nodes.push({
      name: r.label,
      kind: 'outflow',
      categoryKey: r.key.startsWith('__other_') ? undefined : r.key,
      percentOfSide: totalOutflow > 0 ? (r.amount / totalOutflow) * 100 : 0,
    }));
    const sadaqahIdx = nodes.length;
    if (breakdown.totals.sadaqahZakat > 0) {
      nodes.push({
        name: 'Sadaqah / Zakat',
        kind: 'outflow',
        // Sadaqah / Zakat is a synthetic bucket aggregated server-side —
        // the transactions page doesn't filter on it directly today, so
        // leave categoryKey unset to keep the row non-clickable.
        percentOfSide: totalOutflow > 0 ? (breakdown.totals.sadaqahZakat / totalOutflow) * 100 : 0,
      });
    }
    const savingsIdx = nodes.length;
    if (breakdown.totals.savings > 0) {
      nodes.push({
        name: 'Savings',
        kind: 'outflow',
        // Savings is income minus all outflow, also synthetic.
        percentOfSide: totalOutflow > 0 ? (breakdown.totals.savings / totalOutflow) * 100 : 0,
      });
    }

    const links: Array<{ source: number; target: number; value: number }> = [];
    incomeRows.forEach((row, i) => {
      if (row.amount > 0) links.push({ source: i, target: hubIdx, value: row.amount });
    });
    expenseRows.forEach((row, i) => {
      if (row.amount > 0) links.push({ source: hubIdx, target: hubIdx + 1 + i, value: row.amount });
    });
    if (breakdown.totals.sadaqahZakat > 0) {
      links.push({ source: hubIdx, target: sadaqahIdx, value: breakdown.totals.sadaqahZakat });
    }
    if (breakdown.totals.savings > 0) {
      links.push({ source: hubIdx, target: savingsIdx, value: breakdown.totals.savings });
    }

    if (links.length === 0) return null;
    return { nodes, links };
  }, [breakdown]);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Cash Flow"
        subtitle="Where your money came from and where it went, month by month."
        className="mb-6"
      />

      {loading && (
        // PR 5 (2026-05-01): shaped skeletons sized to the real layout.
        // No layout shift when data lands — same heights and column
        // structure as the populated state so the page doesn't jump.
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border animate-pulse">
            <div className="h-3 w-32 bg-muted rounded mb-3" />
            <div className="h-[260px] bg-muted/40 rounded" />
            <div className="h-3 w-48 bg-muted rounded mt-3 mx-auto" />
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border animate-pulse">
            <div className="h-3 w-24 bg-muted rounded mb-2" />
            <div className="h-5 w-40 bg-muted rounded mb-4" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 text-center">
          <p className="text-rose-700 dark:text-rose-300 font-medium mb-3">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && months.length === 0 && (
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-base font-semibold text-foreground mb-1">No cash flow yet</p>
          <p className="text-sm text-muted-foreground">
            Add a transaction to start seeing your monthly income, expenses, and savings.
          </p>
        </div>
      )}

      {!loading && !error && months.length > 0 && (
        <>
          {/* Chart card — full-width like Monarch's Cash Flow page.
              Stat strip moves underneath as a 4-card horizontal row. */}
          <section className="bg-card rounded-2xl p-5 border border-border mb-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  {chartView === 'sankey'
                    ? `Cash flow · ${selected ? monthLong(selected.month) : ''}`
                    : timeView === 'monthly' ? '13-month overview' : timeView === 'quarterly' ? 'By quarter' : 'By year'}
                </p>
                {/* Bars / Sankey toggle (Monarch parity). */}
                <div className="inline-flex rounded-full bg-muted/40 p-0.5 text-[12px] font-medium">
                  {(['bars', 'sankey'] as ChartView[]).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setChartView(v)}
                      className={`px-3 py-1 rounded-full transition-colors capitalize ${
                        chartView === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              {/* Monthly · Quarterly · Yearly tabs (Monarch parity).
                  Hidden in Sankey view since it's a single-month chart. */}
              {chartView === 'bars' && (
                <div
                  role="tablist"
                  aria-label="Time view"
                  className="inline-flex rounded-full bg-muted/40 p-0.5 text-[12px] font-medium"
                >
                  {(['monthly', 'quarterly', 'yearly'] as TimeView[]).map((v) => (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={timeView === v}
                      type="button"
                      onClick={() => setTimeView(v)}
                      className={`px-3 py-1 rounded-full transition-colors capitalize ${
                        timeView === v
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* 2026-05-03 (Section B·3): when every bucket has zero
                income AND zero expenses, the bar chart renders as a blank
                grid which reads as broken. Show an explicit empty state
                instead so brand-new users see "this is normal, here's
                what to do" rather than a confused-looking chart. The
                Sankey view has its own empty hint at line 651, so we
                only need this branch for `bars`. */}
            {chartView === 'bars' && chartBuckets.length > 0 && chartBuckets.every(b => (b.income ?? 0) === 0 && (b.expenses ?? 0) === 0) ? (
              <div className="h-[260px] flex flex-col items-center justify-center text-center px-6">
                <p className="text-3xl mb-2" aria-hidden="true">📊</p>
                <p className="text-sm font-semibold text-foreground mb-1">No transactions in this window yet</p>
                <p className="text-xs text-muted-foreground max-w-md">
                  Bars and trend line will fill in as you add or import transactions.
                  Try linking a bank from the <Link href="/dashboard/transactions" className="underline underline-offset-2">Transactions page</Link> or
                  importing a CSV to seed the chart.
                </p>
              </div>
            ) : chartView === 'bars' ? (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart
                data={chartBuckets}
                onClick={(e) => {
                  const ev = e as unknown as { activePayload?: Array<{ payload?: { sourceMonth?: string } }> };
                  const payload = ev?.activePayload?.[0]?.payload;
                  if (payload?.sourceMonth) setSelectedMonth(payload.sourceMonth);
                }}
                margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={(props) => {
                    const { x, y, payload, index } = props as {
                      x: number;
                      y: number;
                      payload: { value: string };
                      index: number;
                    };
                    const bucketRow = chartBuckets[index];
                    const isSelected = bucketRow?.sourceMonth === selectedMonth;
                    return (
                      <text
                        x={x}
                        y={y + 14}
                        textAnchor="middle"
                        className={`text-[11px] ${isSelected ? 'font-bold fill-primary' : 'fill-muted-foreground'}`}
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                {/* 2026-05-03 (Monarch parity, frame f_030): rich
                    hover tooltip with Income / Expenses / Savings /
                    Savings Rate. Replaces the default Recharts tooltip. */}
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0].payload as {
                      sourceMonth?: string;
                      bucket?: string;
                      income?: number;
                      expenses?: number;
                      sadaqahZakat?: number;
                      savings?: number;
                      net?: number;
                    };
                    const labelOut = timeView === 'monthly' && row.sourceMonth
                      ? monthLong(row.sourceMonth)
                      : (row.bucket ?? '');
                    const income = row.income ?? 0;
                    const expenses = row.expenses ?? 0;
                    const savings = (row.savings ?? row.net ?? 0);
                    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
                    return (
                      <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2 text-xs min-w-[180px]">
                        <p className="font-semibold mb-1.5 text-foreground">{labelOut}</p>
                        <div className="space-y-1 tabular-nums">
                          <div className="flex justify-between gap-4">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" />
                              <span className="text-muted-foreground">Income</span>
                            </span>
                            <span className="font-semibold text-emerald-700">{fmt(income)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-600" aria-hidden="true" />
                              <span className="text-muted-foreground">Expenses</span>
                            </span>
                            <span className="font-semibold text-rose-700">{fmt(expenses)}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-border">
                            <span className="text-muted-foreground">Savings</span>
                            <span className={`font-semibold ${savings >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{fmt(savings)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Savings Rate</span>
                            <span className={`font-semibold ${savingsRate >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {savingsRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                {/* Year-divider lines on month-view (Monarch parity). */}
                {yearMarkers.slice(1).map((m) => (
                  <ReferenceLine
                    key={m.year}
                    x={chartBuckets[m.index]?.label}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="2 4"
                    strokeOpacity={0.3}
                    label={{
                      value: m.year,
                      position: 'top',
                      fill: 'var(--muted-foreground)',
                      fontSize: 10,
                    }}
                  />
                ))}
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="var(--chart-income, #2E7D32)"
                  radius={[3, 3, 0, 0]}
                  cursor="pointer"
                  fillOpacity={0.85}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="var(--chart-expenses, #C62828)"
                  radius={[3, 3, 0, 0]}
                  cursor="pointer"
                  fillOpacity={0.85}
                />
                {/* Net trend line over bars (Monarch parity) */}
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net"
                  stroke="#0f172a"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            ) : (
              <div>
                {sankeyData ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <Sankey
                      data={sankeyData}
                      nodePadding={20}
                      nodeWidth={12}
                      linkCurvature={0.5}
                      iterations={64}
                      node={(props: unknown) => <SankeyNode {...(props as SankeyNodeProps)} fmt={fmt} month={selectedMonth} />}
                      link={{ stroke: '#94a3b8', strokeOpacity: 0.25 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [fmt(Number(value ?? 0)), String(name)] as [string, string]}
                        contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      />
                    </Sankey>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    {breakdownLoading ? 'Loading flow…' : 'No data for this period yet.'}
                  </div>
                )}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              {chartView === 'bars'
                ? 'Click any bar to see the breakdown for that period'
                : 'Income sources flow into the central Income node, then split into expense categories, sadaqah/zakat, and savings'}
            </p>
          </section>

          {/* Stat strip — 4-card horizontal row (Monarch parity).
              Income / Expenses / Savings / Savings Rate. The Sadaqah row
              moves into the breakdown header where it lives alongside
              its category list. This keeps the headline strip 4-up and
              readable while preserving the four-pillar story. */}
          {selected && (
            <section className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-bold text-foreground">
                  {monthLong(selected.month)}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                  Selected period
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                  label="Income"
                  value={fmt(selected.income)}
                  valueClass="text-emerald-700 dark:text-emerald-400"
                  dotClass="bg-emerald-600"
                />
                <StatCard
                  label="Expenses"
                  value={fmt(selected.expenses)}
                  valueClass="text-rose-700 dark:text-rose-400"
                  dotClass="bg-rose-600"
                />
                <StatCard
                  label="Total savings"
                  value={fmt(selected.savings)}
                  valueClass="text-foreground"
                  dotClass="bg-slate-700 dark:bg-slate-300"
                  tooltip="Income − Expenses − Sadaqah/Zakat = Savings (the cash residue after household outflows and given charity)."
                />
                <StatCard
                  label="Savings rate"
                  value={`${savingsRatePct}%`}
                  valueClass={savingsRatePct >= 20 ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}
                  dotClass="bg-amber-500"
                  tooltip="Savings ÷ Income — Monarch's 4th Cash Flow stat. 20%+ is generally considered healthy."
                />
              </div>
              {selected.sadaqahZakat > 0 && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  Includes <span className="font-semibold">{fmt(selected.sadaqahZakat)}</span> in Sadaqah / Zakat given this period — see breakdown below.
                </p>
              )}
            </section>
          )}
        </>
      )}

      {/* Breakdown (PR 4 — Income / Expenses / Sadaqah-Zakat) */}
      {!loading && !error && months.length > 0 && (
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Breakdown · {selected ? monthLong(selected.month) : ''}
            </p>
            {/* Dimension toggle (Category / Merchant). v1 skips Group
                per spec — Category + Merchant covers the 90% case
                without forcing a category-grouping decision. */}
            <div className="inline-flex rounded-lg border border-border overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => setDimension('category')}
                className={`px-3 py-1.5 transition-colors ${dimension === 'category' ? 'bg-primary text-primary-foreground font-semibold' : 'bg-card text-muted-foreground hover:bg-muted/40'}`}
              >
                Category
              </button>
              <button
                type="button"
                onClick={() => setDimension('merchant')}
                className={`px-3 py-1.5 transition-colors ${dimension === 'merchant' ? 'bg-primary text-primary-foreground font-semibold' : 'bg-card text-muted-foreground hover:bg-muted/40'}`}
              >
                Merchant
              </button>
            </div>
          </div>

          {breakdownLoading && !breakdown && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Loading breakdown…
            </div>
          )}

          {breakdown && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <BreakdownSection
                title="Income"
                tone="income"
                rows={breakdown.income}
                total={breakdown.totals.income}
                fmt={fmt}
                month={selectedMonth}
                dimension={dimension}
              />
              <BreakdownSection
                title="Expenses"
                tone="expense"
                rows={breakdown.expenses}
                total={breakdown.totals.expenses}
                fmt={fmt}
                month={selectedMonth}
                dimension={dimension}
              />
              <BreakdownSection
                title="Sadaqah / Zakat given"
                tone="sadaqah"
                rows={breakdown.sadaqahZakat}
                total={breakdown.totals.sadaqahZakat}
                fmt={fmt}
                month={selectedMonth}
                dimension={dimension}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * One of the three breakdown sections (Income / Expenses / Sadaqah-Zakat).
 * Renders rows with a colored bar segment on the left sized proportional
 * to the row's amount vs. the section's total — matches Monarch's
 * visual heatmap pattern.
 *
 * Each row links to /dashboard/transactions pre-filtered by the row's
 * key (category name or merchant name) — uses the existing ?category=
 * URL-param hook on the transactions page (R30 wiring).
 */
function BreakdownSection({
  title,
  tone,
  rows,
  total,
  fmt,
  month,
  dimension,
}: {
  title: string;
  tone: 'income' | 'expense' | 'sadaqah';
  rows: BreakdownRow[];
  total: number;
  fmt: (n: number) => string;
  month: string;
  dimension: Dimension;
}) {
  const barColor =
    tone === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
    tone === 'expense' ? 'bg-rose-100 dark:bg-rose-900/30' :
    'bg-amber-100 dark:bg-amber-900/30';
  const amountColor =
    tone === 'income' ? 'text-emerald-700 dark:text-emerald-400' :
    tone === 'expense' ? 'text-rose-700 dark:text-rose-400' :
    'text-amber-700 dark:text-amber-400';

  if (rows.length === 0) {
    return (
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
        <p className="text-xs text-muted-foreground italic py-3">
          No {tone === 'sadaqah' ? 'charity given' : tone} this month.
        </p>
      </div>
    );
  }

  // For row bar widths — relative to the LARGEST row in this section, not
  // to the section total. This makes the largest row bar = 100% width,
  // every other row bar < 100%. Matches Monarch's visual style.
  const maxAmount = Math.max(...rows.map(r => r.amount));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className={`text-sm font-bold tabular-nums ${amountColor}`}>{fmt(total)}</p>
      </div>
      <ul className="space-y-1.5">
        {rows.map((row) => {
          const widthPct = maxAmount > 0 ? (row.amount / maxAmount) * 100 : 0;
          // Drill-down: pre-filter the transactions page by category or
          // merchant. The ?category=X URL param is honoured by the
          // transactions page (R30) — pre-fills the search box for
          // text-match. Same param works for merchant since it's a
          // free-form text match. Adding ?month=YYYY-MM is a follow-up
          // (transactions page doesn't yet honour it but the param is
          // a no-op when ignored).
          const href = `/dashboard/transactions?category=${encodeURIComponent(row.key)}&month=${encodeURIComponent(month)}`;
          return (
            <li key={row.key}>
              <Link
                href={href}
                className="relative block rounded-md hover:bg-muted/40 transition-colors px-2 py-1.5 group"
                title={`View ${dimension === 'merchant' ? 'transactions for' : 'category'} "${row.label}" in ${month}`}
              >
                {/* Background bar — size proportional to amount */}
                <span
                  className={`absolute inset-y-1 left-0 rounded ${barColor} pointer-events-none transition-all`}
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
                <span className="relative flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    {dimension === 'category' ? (
                      <CategoryIcon category={row.key} className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <span className="text-base flex-shrink-0" aria-hidden="true">🏷️</span>
                    )}
                    <span className="text-sm text-foreground truncate capitalize">
                      {row.label.replace(/_/g, ' ')}
                    </span>
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground flex-shrink-0">
                    {fmt(row.amount)} · {row.pct.toFixed(1)}%
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Custom Sankey node renderer with category-tone color + amount label.
 * Replaces the default flat rectangle so the diagram reads at-a-glance:
 * income green, hub navy, outflow rose. Monarch-parity for the labels
 * sitting beside their nodes.
 *
 * 2026-05-02 polish (gap #5):
 *  - Click-through to /dashboard/transactions filtered by category +
 *    month when the node carries a categoryKey. Hub and aggregated
 *    "Other" rows stay non-clickable.
 *  - Tooltip text % shows share of the matching side (income or
 *    outflow) so the diagram is readable without squinting.
 *  - Hover affordance: cursor turns into a pointer on clickable nodes
 *    and the rectangle brightens slightly.
 */
interface SankeyNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: {
    name: string;
    value: number;
    kind?: 'income' | 'hub' | 'outflow';
    categoryKey?: string;
    percentOfSide?: number;
  };
}
function SankeyNode({
  x, y, width, height, index, payload, fmt, month,
}: SankeyNodeProps & { fmt: (n: number) => string; month: string }) {
  const isOutOnRight = x > 100;
  const fill =
    payload.kind === 'income' ? '#2E7D32' :
    payload.kind === 'hub' ? '#1B5E20' :
    payload.name === 'Sadaqah / Zakat' ? '#F59E0B' :
    payload.name === 'Savings' ? '#64748B' :
    '#C62828';

  const clickable = !!payload.categoryKey;
  const handleClick = () => {
    if (!clickable || !payload.categoryKey) return;
    // Mirrors the BreakdownSection link so the two views drill the
    // same way. month is forwarded so the transactions page can
    // narrow to the period when it learns to honor that param.
    const url = `/dashboard/transactions?category=${encodeURIComponent(payload.categoryKey)}&month=${encodeURIComponent(month)}`;
    window.location.href = url;
  };
  const pctLabel = payload.percentOfSide && payload.percentOfSide > 0
      ? ` · ${payload.percentOfSide.toFixed(0)}%`
      : '';

  return (
    <Layer key={`SankeyNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={clickable ? 0.95 : 0.85}
        onClick={handleClick}
        style={clickable ? { cursor: 'pointer' } : undefined}
      />
      {clickable && (
        // Invisible hit target — the actual rectangle is only 12px wide,
        // which is hard to click cleanly on a touch device. Widening the
        // hit area to the surrounding label text + 8px buffer makes the
        // affordance match Monarch.
        <Rectangle
          x={isOutOnRight ? x - 80 : x}
          y={y - 4}
          width={80 + width}
          height={height + 8}
          fill="transparent"
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
      )}
      <text
        textAnchor={isOutOnRight ? 'end' : 'start'}
        x={isOutOnRight ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize={11}
        fontWeight={600}
        fill="var(--foreground)"
        dominantBaseline="middle"
        style={clickable ? { cursor: 'pointer' } : undefined}
        onClick={handleClick}
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOutOnRight ? 'end' : 'start'}
        x={isOutOnRight ? x - 6 : x + width + 6}
        y={y + height / 2 + 12}
        fontSize={10}
        fill="var(--muted-foreground)"
        dominantBaseline="middle"
        style={clickable ? { cursor: 'pointer' } : undefined}
        onClick={handleClick}
      >
        {fmt(payload.value)}{pctLabel}
      </text>
    </Layer>
  );
}

/**
 * Monarch-parity 4-up stat card. Used by the Cash Flow page's
 * top strip — same horizontal layout (Income · Expenses · Total
 * Savings · Savings Rate) Monarch ships on its Cash Flow page.
 */
function StatCard({
  label, value, valueClass, dotClass, tooltip,
}: {
  label: string;
  value: string;
  valueClass: string;
  dotClass: string;
  tooltip?: string;
}) {
  const card = (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} aria-hidden="true" />
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{label}</span>
      </div>
      <p
        className={`text-2xl font-bold tabular-nums ${valueClass} ${tooltip ? 'border-b border-dashed border-current cursor-help inline-block' : ''}`}
      >
        {value}
      </p>
    </div>
  );
  if (tooltip) return <div title={tooltip}>{card}</div>;
  return card;
}
