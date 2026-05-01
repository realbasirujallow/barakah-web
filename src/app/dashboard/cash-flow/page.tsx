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
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

interface MonthRow {
  month: string;        // "2026-03"
  income: number;
  expenses: number;
  sadaqahZakat: number;
  savings: number;
}

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
  const [months, setMonths] = React.useState<MonthRow[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
        // Default-select the most recent month.
        setSelectedMonth(list.length > 0 ? list[list.length - 1].month : '');
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load cash flow');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selected = months.find(m => m.month === selectedMonth);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Cash Flow"
        subtitle="Where your money came from and where it went, month by month."
        className="mb-6"
      />

      {loading && (
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Loading your cash flow…</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Chart — 2/3 width on lg+, full on mobile */}
          <section className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
              13-month overview
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={months.map(m => ({
                  ...m,
                  shortLabel: monthShort(m.month),
                  isSelected: m.month === selectedMonth,
                }))}
                onClick={(e) => {
                  // Recharts' onClick payload is loosely typed; cast through unknown.
                  const ev = e as unknown as { activePayload?: Array<{ payload?: MonthRow }> };
                  const payload = ev?.activePayload?.[0]?.payload;
                  if (payload?.month) setSelectedMonth(payload.month);
                }}
                margin={{ top: 8, right: 4, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  tick={(props) => {
                    const { x, y, payload, index } = props as {
                      x: number;
                      y: number;
                      payload: { value: string };
                      index: number;
                    };
                    const isSelected = months[index]?.month === selectedMonth;
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
                    const m = payload?.[0]?.payload as MonthRow | undefined;
                    return m ? monthLong(m.month) : String(label);
                  }}
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="var(--chart-income, #2E7D32)"
                  radius={[3, 3, 0, 0]}
                  cursor="pointer"
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="var(--chart-expenses, #C62828)"
                  radius={[3, 3, 0, 0]}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              Click any month bar to see the breakdown for that month
            </p>
          </section>

          {/* Stat strip — 1/3 width on lg+, full below chart on mobile */}
          {selected && (
            <section className="bg-card rounded-2xl p-5 border border-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
                Selected month
              </p>
              <p className="text-base font-bold text-foreground mb-4">
                {monthLong(selected.month)}
              </p>
              <StatRow
                label="Income"
                amount={selected.income}
                color="bg-emerald-600"
                amountClass="text-emerald-700 dark:text-emerald-400"
                fmt={fmt}
              />
              <StatRow
                label="Expenses"
                amount={selected.expenses}
                color="bg-rose-600"
                amountClass="text-rose-700 dark:text-rose-400"
                fmt={fmt}
              />
              <StatRow
                label="Sadaqah / Zakat given"
                amount={selected.sadaqahZakat}
                color="bg-amber-500"
                amountClass="text-amber-700 dark:text-amber-400"
                fmt={fmt}
              />
              <StatRow
                label="Savings"
                amount={selected.savings}
                color="bg-gray-700 dark:bg-gray-300"
                amountClass="text-foreground"
                tooltip="Income − Expenses − Sadaqah/Zakat = Savings (the cash residue after household outflows and given charity)."
                fmt={fmt}
              />
            </section>
          )}
        </div>
      )}

      {/* Breakdown placeholder (PR 4) */}
      {!loading && !error && months.length > 0 && (
        <div className="bg-card rounded-2xl p-8 border border-dashed border-border text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm font-semibold text-foreground mb-1">
            Category &amp; merchant breakdown coming next release
          </p>
          <p className="text-xs text-muted-foreground">
            Tap a month bar above for now to update the stat strip. PR 4 adds Income / Expenses /
            Sadaqah-Zakat lists with Category &amp; Merchant lenses below this.
          </p>
        </div>
      )}
    </div>
  );
}

function StatRow({
  label, amount, color, amountClass, tooltip, fmt,
}: {
  label: string;
  amount: number;
  color: string;
  amountClass: string;
  tooltip?: string;
  fmt: (n: number) => string;
}) {
  const row = (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} aria-hidden="true" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span
        className={`text-base font-semibold tabular-nums ${amountClass} ${tooltip ? 'border-b border-dashed border-current cursor-help' : ''}`}
      >
        {fmt(amount)}
      </span>
    </div>
  );
  if (tooltip) {
    return <div title={tooltip}>{row}</div>;
  }
  return row;
}
