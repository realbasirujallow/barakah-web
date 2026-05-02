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
  ReferenceLine, ComposedChart, Line,
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
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
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
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                {timeView === 'monthly' ? '13-month overview' : timeView === 'quarterly' ? 'By quarter' : 'By year'}
              </p>
              {/* Monthly · Quarterly · Yearly tabs (Monarch parity).
                  Backend is month-granular; quarterly/yearly are
                  client-side roll-ups so the chart is consistent. */}
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
            </div>
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
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                  formatter={(value, name) => [fmt(Number(value)), String(name)] as [string, string]}
                  labelFormatter={(label, payload) => {
                    const row = payload?.[0]?.payload as { sourceMonth?: string; bucket?: string } | undefined;
                    if (!row) return String(label);
                    if (timeView === 'monthly' && row.sourceMonth) return monthLong(row.sourceMonth);
                    return row.bucket ?? String(label);
                  }}
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
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
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              Click any bar to see the breakdown for that period
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
