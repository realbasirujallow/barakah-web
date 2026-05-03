'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { useCurrency } from '../../../lib/useCurrency';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageHeader } from '../../../components/dashboard/PageHeader';
// 2026-05-03: removed MonthDetailSheet import — analytics drilldowns
// now navigate to /dashboard/cash-flow rather than opening a modal.
// MonthDetailSheet still exists for /dashboard/summary which uses it.
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Summary {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  transactionCount: number;
}

interface MonthlyPoint {
  month: string;    // "2025-12"
  income: number;
  expenses: number;
  net: number;
}

interface HalalBreakdown {
  category: string; amount: number; percentage: number; status: string; transactionCount: number;
}
interface HalalAnalysis {
  period: string; totalSpending: number; halalSpending: number; reviewSpending: number;
  halalRatio: number; halalTransactions: number; reviewTransactions: number;
  totalTransactions: number; breakdown: HalalBreakdown[]; insights: string[];
}

// Converts a snake_case slug into Title Case for display (e.g. "debt_payment" → "Debt Payment")
// Tolerates null/undefined input so callers don't need to guard with `?? ''`.
function formatCategoryLabel(slug?: string | null): string {
  if (!slug) return '';
  return slug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const COLORS = [
  '#1B5E20', '#388E3C', '#4CAF50', '#81C784', '#A5D6A7',
  '#C8E6C9', '#2E7D32', '#43A047', '#66BB6A', '#E8F5E9',
  '#FFA000', '#FF6F00', '#F57C00', '#FB8C00', '#FFB300',
];

const periods = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

function AnalyticsPageContent() {
  const { fmt, symbol } = useCurrency();
  const router = useRouter();
  const [period, setPeriod] = useState('month');
  const [allPeriods, setAllPeriods] = useState<{ week: Summary | null; month: Summary | null; year: Summary | null }>({
    week: null, month: null, year: null,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
  const [halalAnalysis, setHalalAnalysis] = useState<HalalAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'mom' | 'trend'>('mom');

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      Promise.allSettled([
        api.getTransactionSummary('week'),
        api.getTransactionSummary('month'),
        api.getTransactionSummary('year'),
        api.getMonthlySummary(13),
        api.getHalalAnalysis('month'),
      ])
        .then((results) => {
          if (cancelled) return;
          const week = results[0].status === 'fulfilled' ? results[0].value : null;
          const month = results[1].status === 'fulfilled' ? results[1].value : null;
          const year = results[2].status === 'fulfilled' ? results[2].value : null;
          const monthly = results[3].status === 'fulfilled' ? results[3].value : null;
          const halal = results[4].status === 'fulfilled' ? results[4].value : null;
          setAllPeriods({ week, month, year });
          setMonthlyData(monthly?.months || []);
          if (halal) setHalalAnalysis(halal as HalalAnalysis);
        })
        .catch((err) => { logError(err, { context: 'Failed to load analytics data' }); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 0);

    return () => { cancelled = true; window.clearTimeout(timeoutId); };
  }, []);

  const summary = useMemo(
    () => allPeriods[period as keyof typeof allPeriods],
    [allPeriods, period],
  );

  const fmtShort = (n: number) => {
    if (Math.abs(n) >= 1000) return symbol + (n / 1000).toFixed(1) + 'k';
    return fmt(n);
  };

  // 2026-05-03: cowork removed MonthDetailSheet drilldown from
  // analytics in favor of routing to /cash-flow. The hook
  // destructure was left behind — gone now to keep the analyzer
  // happy.

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-[#1B5E20]" />
      </div>
    );
  }

  const expenseData = summary
    ? Object.entries(summary.expensesByCategory).map(([name, value]) => ({ name, value }))
    : [];
  const incomeData = summary
    ? Object.entries(summary.incomeByCategory).map(([name, value]) => ({ name, value }))
    : [];

  const overviewData = [
    { name: 'Income', amount: summary?.totalIncome || 0 },
    { name: 'Expenses', amount: summary?.totalExpenses || 0 },
    { name: 'Net', amount: summary?.netIncome || 0 },
  ];

  const netIncome = summary?.netIncome || 0;

  // Cap extreme percentages so users aren't alarmed by values like "-2783%".
  const capPct = (pct: string): string => {
    const n = parseFloat(pct);
    if (Number.isNaN(n)) return pct;
    if (n > 999) return '>999';
    if (n < -999) return '<-999';
    return pct;
  };

  const savingsRate = capPct(
    summary && summary.totalIncome > 0
      ? ((summary.netIncome / summary.totalIncome) * 100).toFixed(1)
      : '0.0'
  );

  // Month-over-month change (last 2 months)
  const momChange = monthlyData.length >= 2
    ? monthlyData[monthlyData.length - 1].expenses - monthlyData[monthlyData.length - 2].expenses
    : 0;
  const momPct = capPct(
    monthlyData.length >= 2 && monthlyData[monthlyData.length - 2].expenses > 0
      ? ((momChange / monthlyData[monthlyData.length - 2].expenses) * 100).toFixed(1)
      : '0.0'
  );

  // Format month label: "2025-12" → "Dec '25"
  const fmtMonth = (m: string) => {
    const [y, mo] = m.split('-');
    const d = new Date(parseInt(y), parseInt(mo) - 1, 1);
    return d.toLocaleDateString(undefined, { month: 'short' }) + " '" + y.slice(2);
  };

  const momDisplayData = monthlyData.map(d => ({
    ...d,
    label: fmtMonth(d.month),
    // R39 (2026-05-01): expose YYYY-MM as `monthKey` so the Recharts
    // onClick handler can pull the same key the /monthly-detail
    // backend expects. Founder feedback: "Analytics still doesnt show
    // break down of items and it looks like you're not able to click
    // by month to drill down."
    monthKey: d.month,
  }));

  // useMonthDrilldown is hoisted above the early-loading return — see fmtShort.
  // Year-over-Year: group monthly data by calendar year
  const yoyData = (() => {
    const byYear: Record<string, { income: number; expenses: number; net: number; months: number }> = {};
    for (const d of monthlyData) {
      const yr = d.month.split('-')[0];
      if (!byYear[yr]) byYear[yr] = { income: 0, expenses: 0, net: 0, months: 0 };
      byYear[yr].income   += d.income;
      byYear[yr].expenses += d.expenses;
      byYear[yr].net      += d.net;
      byYear[yr].months++;
    }
    return Object.entries(byYear).sort(([a], [b]) => a.localeCompare(b)).map(([year, v]) => ({ year, ...v }));
  })();

  return (
    <div role="main">
      <PageHeader
        title="Analytics"
        subtitle="Income vs spending trends across periods, with halal/haram breakdowns"
        actions={
          <div className="flex gap-2" role="tablist" aria-label="Period selection">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                role="tab"
                aria-selected={period === p.value}
                aria-label={`Select ${p.label}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  period === p.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-primary border border-green-200 hover:bg-green-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-green-600 rounded-2xl p-5 text-white">
          <p className="text-green-200 text-xs font-medium uppercase tracking-wide">Total Income</p>
          <p className="text-2xl font-bold mt-1">{fmt(summary?.totalIncome || 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-400 rounded-2xl p-5 text-white">
          <p className="text-red-200 text-xs font-medium uppercase tracking-wide">Total Expenses</p>
          <p className="text-2xl font-bold mt-1">{fmt(summary?.totalExpenses || 0)}</p>
        </div>
        <div className={`bg-gradient-to-br rounded-2xl p-5 text-white ${
          netIncome >= 0 ? 'from-teal-600 to-cyan-500' : 'from-orange-600 to-amber-500'
        }`}>
          <p className="text-xs font-medium uppercase tracking-wide opacity-80">Net Income</p>
          <p className="text-2xl font-bold mt-1">{fmt(netIncome)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl p-5 text-white">
          <p className="text-purple-200 text-xs font-medium uppercase tracking-wide">Savings Rate</p>
          <p className="text-2xl font-bold mt-1">{savingsRate}%</p>
          <p className="text-purple-200 text-xs mt-1">{summary?.transactionCount || 0} transactions</p>
        </div>
      </div>

      {/* Month-over-Month section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Month-over-Month</h2>
            <p className="text-xs text-gray-500 mt-0.5">Last 13 months — income vs spending trends</p>
          </div>
          <div className="flex gap-2" role="tablist" aria-label="Chart type selection">
            <button
              onClick={() => setActiveChart('mom')}
              role="tab"
              aria-selected={activeChart === 'mom'}
              aria-label="Bar chart view"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeChart === 'mom' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Bar
            </button>
            <button
              onClick={() => setActiveChart('trend')}
              role="tab"
              aria-selected={activeChart === 'trend'}
              aria-label="Line chart view"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeChart === 'trend' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Line
            </button>
          </div>
        </div>

        {/* MoM change badge + drill-down hint */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {monthlyData.length >= 2 && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              momChange <= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {momChange <= 0 ? '↓' : '↑'} Expenses {momChange <= 0 ? 'down' : 'up'} {momPct.replace(/^[<>-]/, '')}% vs last month
            </div>
          )}
          <span className="text-xs text-gray-500">
            Tap any bar to drill into the full breakdown by category &amp; merchant →
          </span>
        </div>

        {momDisplayData.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No monthly data available yet</p>
        ) : monthlyData.length < 2 ? (
          <p className="text-gray-400 text-center py-12">Insufficient data for trend analysis — need at least 2 months of data</p>
        ) : activeChart === 'mom' ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={momDisplayData}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              // 2026-05-03 fix: route bar clicks to /dashboard/cash-flow
              // ?month=YYYY-MM for the proper inline drilldown — KPI
              // cards + Income/Expenses by Category/Merchant + Sadaqah
              // section, matching the Monarch UX from the walkthrough
              // video (frame f_022). The earlier MonthDetailSheet
              // modal pop-up was the wrong pattern; the founder wants
              // the cash-flow inline breakdown experience.
              onClick={(e) => {
                const ev = e as unknown as { activePayload?: Array<{ payload?: { monthKey?: string } }> };
                const point = ev?.activePayload?.[0]?.payload;
                if (point?.monthKey) {
                  router.push(`/dashboard/cash-flow?month=${point.monthKey}`);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Phase 24d (2026-04-30): gradients + larger radius for the
                  Monarch-tier polish pass. Same visual language as the
                  summary chart so the dashboard reads as one product. */}
              <defs>
                <linearGradient id="ana-incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#22C55E" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#1B5E20" stopOpacity={0.95} />
                </linearGradient>
                <linearGradient id="ana-expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#F87171" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.95} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fill: '#374151', fontSize: 11 }} />
              <YAxis tickFormatter={fmtShort} tick={{ fill: '#374151', fontSize: 11 }} />
              {/* 2026-05-03 (Monarch parity): "Explain this change"-
                  style tooltip. Hovering a month shows the income +
                  expense values, the delta vs the prior month for
                  expenses (the most-watched line), and a one-liner
                  hint that opens the drilldown on click. Replaces the
                  plain Recharts default tooltip. */}
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  // Recharts payload entries each have name/value/color/payload.
                  const incomeEntry = payload.find(p => p.dataKey === 'income');
                  const expenseEntry = payload.find(p => p.dataKey === 'expenses');
                  const income = (incomeEntry?.value as number) ?? 0;
                  const expenses = (expenseEntry?.value as number) ?? 0;
                  const net = income - expenses;
                  const point = payload[0].payload as { monthKey?: string };
                  // Find the prior month in the source series for the delta.
                  const idx = monthlyData.findIndex(m => m.month === point?.monthKey);
                  const prior = idx > 0 ? monthlyData[idx - 1] : null;
                  const expDelta = prior ? expenses - prior.expenses : null;
                  const expDeltaPct = prior && prior.expenses > 0
                    ? ((expenses - prior.expenses) / prior.expenses) * 100
                    : null;
                  return (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[200px] text-sm">
                      <p className="font-bold text-gray-900 mb-1">{label}</p>
                      <div className="flex justify-between gap-4 mb-0.5">
                        <span className="text-emerald-700">Income</span>
                        <span className="font-semibold tabular-nums">{fmt(income)}</span>
                      </div>
                      <div className="flex justify-between gap-4 mb-0.5">
                        <span className="text-rose-700">Expenses</span>
                        <span className="font-semibold tabular-nums">{fmt(expenses)}</span>
                      </div>
                      <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-gray-100">
                        <span className="text-gray-500 text-xs">Net</span>
                        <span className={`font-semibold tabular-nums text-xs ${net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {fmt(net)}
                        </span>
                      </div>
                      {expDelta != null && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">
                            Spending change vs prior month
                          </p>
                          <p className={`text-xs font-medium mt-0.5 ${expDelta <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {expDelta <= 0 ? '▼' : '▲'} {fmt(Math.abs(expDelta))}
                            {expDeltaPct != null && (
                              <span className="text-gray-500 font-normal">
                                {' '}({Math.abs(expDeltaPct) > 999 ? '>999' : Math.abs(expDeltaPct).toFixed(1)}%)
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      <p className="text-[11px] text-[#FF6B35] mt-2 font-medium">
                        Click to see the full breakdown →
                      </p>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="url(#ana-incomeFill)"
                radius={[6,6,0,0]}
                cursor="pointer"
                onClick={(barData: unknown) => {
                  // Bar-level onClick gets the row payload directly,
                  // sidestepping Recharts' flaky BarChart-level
                  // activePayload propagation. 2026-05-03: navigate
                  // to /dashboard/cash-flow?month=YYYY-MM for the
                  // proper inline drilldown UI (Monarch parity, frame
                  // f_022).
                  const d = barData as { payload?: { monthKey?: string }; monthKey?: string };
                  const monthKey = d?.payload?.monthKey ?? d?.monthKey;
                  if (monthKey) {
                    router.push(`/dashboard/cash-flow?month=${monthKey}`);
                  }
                }}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="url(#ana-expenseFill)"
                radius={[6,6,0,0]}
                cursor="pointer"
                onClick={(barData: unknown) => {
                  const d = barData as { payload?: { monthKey?: string }; monthKey?: string };
                  const monthKey = d?.payload?.monthKey ?? d?.monthKey;
                  if (monthKey) {
                    router.push(`/dashboard/cash-flow?month=${monthKey}`);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={momDisplayData}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              // 2026-05-03 fix: same as BarChart — navigate to
              // /dashboard/cash-flow?month=YYYY-MM for the inline
              // drilldown rather than opening a modal sheet.
              onClick={(e) => {
                const ev = e as unknown as { activePayload?: Array<{ payload?: { monthKey?: string } }> };
                const monthKey = ev?.activePayload?.[0]?.payload?.monthKey;
                if (monthKey) {
                  router.push(`/dashboard/cash-flow?month=${monthKey}`);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fill: '#374151', fontSize: 11 }} />
              <YAxis tickFormatter={fmtShort} tick={{ fill: '#374151', fontSize: 11 }} />
              {/* 2026-05-03: same "Explain this change"-style tooltip
                  as the BarChart variant above so the user gets the
                  same delta-vs-prior-month breakdown when they toggle
                  to the Line view. */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const incomeEntry = payload.find(p => p.dataKey === 'income');
                  const expenseEntry = payload.find(p => p.dataKey === 'expenses');
                  const netEntry = payload.find(p => p.dataKey === 'net');
                  const income = (incomeEntry?.value as number) ?? 0;
                  const expenses = (expenseEntry?.value as number) ?? 0;
                  const net = (netEntry?.value as number) ?? (income - expenses);
                  const point = payload[0].payload as { monthKey?: string };
                  const idx = monthlyData.findIndex(m => m.month === point?.monthKey);
                  const prior = idx > 0 ? monthlyData[idx - 1] : null;
                  const expDelta = prior ? expenses - prior.expenses : null;
                  const expDeltaPct = prior && prior.expenses > 0
                    ? ((expenses - prior.expenses) / prior.expenses) * 100
                    : null;
                  return (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[200px] text-sm">
                      <p className="font-bold text-gray-900 mb-1">{label}</p>
                      <div className="flex justify-between gap-4 mb-0.5">
                        <span className="text-emerald-700">Income</span>
                        <span className="font-semibold tabular-nums">{fmt(income)}</span>
                      </div>
                      <div className="flex justify-between gap-4 mb-0.5">
                        <span className="text-rose-700">Expenses</span>
                        <span className="font-semibold tabular-nums">{fmt(expenses)}</span>
                      </div>
                      <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-gray-100">
                        <span className="text-gray-500 text-xs">Net</span>
                        <span className={`font-semibold tabular-nums text-xs ${net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {fmt(net)}
                        </span>
                      </div>
                      {expDelta != null && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">
                            Spending change vs prior month
                          </p>
                          <p className={`text-xs font-medium mt-0.5 ${expDelta <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {expDelta <= 0 ? '▼' : '▲'} {fmt(Math.abs(expDelta))}
                            {expDeltaPct != null && (
                              <span className="text-gray-500 font-normal">
                                {' '}({Math.abs(expDeltaPct) > 999 ? '>999' : Math.abs(expDeltaPct).toFixed(1)}%)
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Legend />
              {/* Phase 24d: thicker strokes + animated draw-in for line charts */}
              <Line type="monotone" dataKey="income"   name="Income"   stroke="#1B5E20" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#B91C1C" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="net"      name="Net"      stroke="#0D9488" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Monthly breakdown table (last 6 months).
            2026-05-02 fix: founder reported (multiple times) that there
            was no way to drill from the analytics page into a specific
            month's breakdown. The bar chart had a click handler but
            Recharts' bar-level click was unreliable; the table rows
            had none. Now each row navigates to /dashboard/cash-flow
            with ?month=YYYY-MM, which loads the full category +
            merchant breakdown for that month. The arrow on hover is
            the Monarch-style affordance — same pattern used on the
            cash-flow Sankey nodes in PR #91. Keyboard-accessible:
            tab to a row, Enter to drill. */}
        {monthlyData.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-gray-500">Month</th>
                  <th className="text-right py-2 px-2 text-gray-500">Income</th>
                  <th className="text-right py-2 px-2 text-gray-500">Expenses</th>
                  <th className="text-right py-2 px-2 text-gray-500">Net</th>
                  <th className="text-right py-2 px-2 text-gray-500">vs Prior</th>
                  <th className="w-6 py-2 px-2" />
                </tr>
              </thead>
              <tbody>
                {[...monthlyData].reverse().slice(0, 6).map((row, i, arr) => {
                  const prior = arr[i + 1];
                  const expChange = prior && prior.expenses > 0
                    ? ((row.expenses - prior.expenses) / prior.expenses * 100).toFixed(0)
                    : null;
                  // 2026-05-03: navigate to /dashboard/cash-flow with
                  // ?month=YYYY-MM so the user lands on the proper
                  // inline drilldown UI (KPI cards + Income/Expenses
                  // by Category/Merchant + Sadaqah). Same pattern
                  // Monarch uses on its Cash Flow page.
                  const drillTo = () => {
                    router.push(`/dashboard/cash-flow?month=${row.month}`);
                  };
                  return (
                    <tr
                      key={row.month}
                      className="border-b border-gray-50 hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                      onClick={drillTo}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          drillTo();
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${fmtMonth(row.month)} income and expense breakdown`}
                    >
                      <td className="py-2 px-2 font-medium text-gray-700">{fmtMonth(row.month)}</td>
                      <td className="py-2 px-2 text-right text-green-700">{fmtShort(row.income)}</td>
                      <td className="py-2 px-2 text-right text-red-600">{fmtShort(row.expenses)}</td>
                      <td className={`py-2 px-2 text-right font-semibold ${row.net >= 0 ? 'text-teal-700' : 'text-orange-600'}`}>{fmtShort(row.net)}</td>
                      <td className="py-2 px-2 text-right">
                        {expChange !== null && (
                          <span className={`text-xs font-medium ${parseFloat(expChange) <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {parseFloat(expChange) <= 0 ? '↓' : '↑'}{Math.abs(parseFloat(expChange))}%
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-300 group-hover:text-emerald-600 transition-colors" aria-hidden="true">
                        →
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 text-[11px] text-gray-400 text-center">
              Click any row (or bar) to see income & expense breakdown by category and merchant.
            </p>
          </div>
        )}
      </div>

      {/* Charts Row 1: Overview Bar + Period Comparison */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expense Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" role="region" aria-label="Income vs Expenses chart">
          <h2 className="text-lg font-semibold text-primary mb-4">Income vs Expenses</h2>
          {overviewData.every((d) => d.amount === 0) ? (
            <p className="text-gray-400 text-center py-12">No transaction data for this period</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#374151', fontSize: 13 }} />
                <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => fmt(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {overviewData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? '#1B5E20' : i === 1 ? '#EF4444' : '#0D9488'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Period Comparison Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" role="region" aria-label="Period Comparison chart">
          <h2 className="text-lg font-semibold text-primary mb-4">Period Comparison</h2>
          {[allPeriods.week, allPeriods.month, allPeriods.year].every(p => !p || (p.totalIncome === 0 && p.totalExpenses === 0)) ? (
            <p className="text-gray-400 text-center py-12">No transaction data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Week', income: allPeriods.week?.totalIncome || 0, expenses: allPeriods.week?.totalExpenses || 0 },
                { name: 'Month', income: allPeriods.month?.totalIncome || 0, expenses: allPeriods.month?.totalExpenses || 0 },
                { name: 'Year', income: allPeriods.year?.totalIncome || 0, expenses: allPeriods.year?.totalExpenses || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#374151', fontSize: 13 }} />
                <YAxis tickFormatter={fmtShort} tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => fmt(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="income"   name="Income"   fill="#1B5E20" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>


      {/* Year-over-Year Comparison */}
      {yoyData.length >= 2 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-primary mb-1">Year-over-Year</h2>
          <p className="text-xs text-gray-500 mb-4">Annual income vs spending — based on imported data</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Year</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Income</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Expenses</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Net</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">vs Prior Year</th>
                </tr>
              </thead>
              <tbody>
                {yoyData.map((yr, i) => {
                  const prev = yoyData[i - 1];
                  const expChange = prev && prev.expenses !== 0 ? ((yr.expenses - prev.expenses) / Math.abs(prev.expenses) * 100) : null;
                  const isCurrentYear = yr.year === String(new Date().getFullYear());
                  return (
                    <tr key={yr.year} className={`border-b border-gray-100 ${isCurrentYear ? 'bg-green-50' : ''}`}>
                      <td className="py-3 px-3 font-semibold text-gray-800">
                        {yr.year} {isCurrentYear && <span className="text-xs text-primary font-normal ml-1">(YTD)</span>}
                      </td>
                      <td className="py-3 px-3 text-right text-green-700 font-medium">{fmt(yr.income)}</td>
                      <td className="py-3 px-3 text-right text-red-600 font-medium">{fmt(yr.expenses)}</td>
                      <td className={`py-3 px-3 text-right font-semibold ${yr.net >= 0 ? 'text-teal-600' : 'text-orange-600'}`}>
                        {fmt(yr.net)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {expChange !== null ? (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            expChange <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {expChange <= 0 ? '↓' : '↑'} {Math.abs(expChange).toFixed(1)}% spend
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts Row 2: Pie Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary mb-4">Expense Breakdown</h2>
          {expenseData.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No expenses in this period</p>
          ) : (
            <div className="flex flex-col items-center">
              {/*
                R44 (2026-05-01): donut labels removed.
                Founder feedback: "The expense breakdown also has the
                E under education hidden." Recharts inline pie labels
                overlap each other on small slices and clip the start
                of long category names against neighbouring slices.
                Fix: render the pie WITHOUT inline labels; the legend
                grid below (which already lists every category with
                its colour swatch + dollar amount) and the hover
                tooltip cover the same need without overlap. Matches
                Monarch / Linear pattern (hover-revealed labels, big
                legend). Centre of donut now shows the total — gives
                the at-a-glance number that inline labels were trying
                to communicate, just without the overlap risk.
              */}
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [fmt(Number(value)), formatCategoryLabel(String(name))]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="-mt-[150px] mb-[110px] text-center pointer-events-none">
                <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 tabular-nums">
                  {fmt(expenseData.reduce((s, d) => s + d.value, 0))}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 w-full">
                {expenseData.map((d, i) => {
                  const total = expenseData.reduce((s, x) => s + x.value, 0);
                  const pct = total > 0 ? (d.value / total) * 100 : 0;
                  return (
                    <div
                      key={d.name}
                      className="flex items-center justify-between gap-2 text-xs text-gray-700 min-w-0"
                    >
                      <span className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="truncate">{formatCategoryLabel(d.name)}</span>
                      </span>
                      <span className="text-gray-500 tabular-nums flex-shrink-0">
                        {pct.toFixed(0)}% · {fmt(d.value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary mb-4">Income Breakdown</h2>
          {incomeData.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No income in this period</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {incomeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [fmt(Number(value)), formatCategoryLabel(String(name))]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="-mt-[150px] mb-[110px] text-center pointer-events-none">
                <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 tabular-nums">
                  {fmt(incomeData.reduce((s, d) => s + d.value, 0))}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 w-full">
                {incomeData.map((d, i) => {
                  const total = incomeData.reduce((s, x) => s + x.value, 0);
                  const pct = total > 0 ? (d.value / total) * 100 : 0;
                  return (
                    <div
                      key={d.name}
                      className="flex items-center justify-between gap-2 text-xs text-gray-700 min-w-0"
                    >
                      <span className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="truncate">{formatCategoryLabel(d.name)}</span>
                      </span>
                      <span className="text-gray-500 tabular-nums flex-shrink-0">
                        {pct.toFixed(0)}% · {fmt(d.value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Halal Spending Analysis ────────────────────────────────────────── */}
      {halalAnalysis && halalAnalysis.totalTransactions > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Halal Spending Analysis</h2>

          {/* Ratio Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary">{halalAnalysis.halalRatio}%</p>
              <p className="text-xs text-gray-600 mt-1">Halal Ratio</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-green-700">{fmt(halalAnalysis.halalSpending)}</p>
              <p className="text-xs text-gray-600 mt-1">Halal ({halalAnalysis.halalTransactions} txns)</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/riba')}
              className="bg-amber-50 rounded-xl p-4 text-center hover:bg-amber-100 transition cursor-pointer w-full"
              title="View Riba detector for categories that need Islamic compliance review"
            >
              <p className="text-xl font-bold text-amber-700">{fmt(halalAnalysis.reviewSpending)}</p>
              <p className="text-xs text-gray-600 mt-1">Needs Review ({halalAnalysis.reviewTransactions} txns) →</p>
            </button>
          </div>

          {/* Halal ratio bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Halal</span><span>Needs Review</span>
            </div>
            <div className="w-full h-4 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${halalAnalysis.halalRatio}%` }} />
            </div>
          </div>

          {/* Insights */}
          {halalAnalysis.insights.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 mb-4 space-y-2">
              {halalAnalysis.insights.map((insight, i) => (
                <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">{i === 0 ? '💡' : '📌'}</span> {insight}
                </p>
              ))}
            </div>
          )}

          {/* Breakdown table */}
          {halalAnalysis.breakdown.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Category</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">Amount</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">%</th>
                    <th className="text-center py-2 px-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {halalAnalysis.breakdown.slice(0, 10).map((b) => (
                    <tr key={b.category} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium text-gray-800">{formatCategoryLabel(b.category)}</td>
                      <td className="py-2 px-3 text-right text-gray-700">{fmt(b.amount)}</td>
                      <td className="py-2 px-3 text-right text-gray-500">{b.percentage}%</td>
                      <td className="py-2 px-3 text-center">
                        {b.status === 'halal' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ✓ Halal
                          </span>
                        ) : (
                          <button
                            // Round 30: deep-link with filter=needs_review AND category
                            // pre-filled into search so the user lands directly on the
                            // items requiring review — not on the full transactions list
                            // where they have to hunt for it.
                            onClick={() => router.push(
                              `/dashboard/transactions?filter=needs_review&category=${encodeURIComponent(b.category)}`
                            )}
                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition cursor-pointer"
                            title={`Review ${formatCategoryLabel(b.category)} transactions for Islamic compliance`}
                          >
                            ⚠ Review →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Top Categories Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary mb-4">Top Spending Categories</h2>
        {expenseData.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No expense data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">% of Total</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium w-1/3">Share</th>
                </tr>
              </thead>
              <tbody>
                {[...expenseData]
                  .sort((a, b) => b.value - a.value)
                  .map((d, i) => {
                    const pct =
                      summary && summary.totalExpenses > 0
                        ? ((d.value / summary.totalExpenses) * 100).toFixed(1)
                        : '0';
                    return (
                      <tr key={d.name} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-800">{formatCategoryLabel(d.name)}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-800">{fmt(d.value)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{pct}%</td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2026-05-03: removed inline MonthDetailSheet from /analytics.
          The drilldown UX now consistently routes to /dashboard/cash-flow
          ?month=YYYY-MM where the inline period-detail breakdown
          (KPI cards + Income/Expenses by Category/Merchant + Sadaqah)
          provides the proper Monarch-style "click a bar, see the
          period detail in place" experience. The sheet is still used
          by /dashboard/summary for that page's drilldown affordance. */}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ErrorBoundary>
      <AnalyticsPageContent />
    </ErrorBoundary>
  );
}
