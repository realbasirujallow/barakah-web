'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { useCurrency } from '../../../lib/useCurrency';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { CategoryIcon } from '../../../lib/categoryIcon';

/**
 * 2026-05-02 (Monarch parity): Reports surface with Spending, Income,
 * and Trends tabs. Reference screenshots in `Monarch Screenshots/` —
 * the Reports page Monarch ships at app.monarch.com/reports.
 *
 * Backend: reuses /api/cashflow/months and /api/cashflow/breakdown
 * (no new endpoints). Spending donut + Income donut pull a single
 * month's category breakdown. Trends fetches 13 months in parallel.
 */

type Period = 'week' | 'month' | 'year' | 'all';
type Tab = 'spending' | 'income' | 'trends' | 'exports';
type SubView = 'breakdown' | 'trends';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'week',  label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year',  label: 'Last Year' },
  { value: 'all',   label: 'All Time' },
];

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

interface MonthRow {
  month: string;
  income: number;
  expenses: number;
  sadaqahZakat: number;
  savings: number;
}

const DONUT_PALETTE = [
  '#2E7D32', '#1565C0', '#F9A825', '#C62828', '#6A1B9A',
  '#00838F', '#EF6C00', '#558B2F', '#AD1457', '#283593',
  '#37474F', '#7B1FA2', '#0277BD', '#D84315', '#33691E',
];

const REPORT_TYPES = [
  {
    id: 'zakat',
    title: 'Zakat Statement',
    emoji: '🕌',
    desc: 'Full zakat calculation breakdown with nisab, assets, and amount due',
    badge: 'PDF',
    badgeColor: 'bg-green-100 text-green-800',
    periodPicker: false,
  },
  {
    id: 'transactions-pdf',
    title: 'Transaction History',
    emoji: '📋',
    desc: 'Formatted PDF of your income, expenses, and categories',
    badge: 'PDF',
    badgeColor: 'bg-green-100 text-green-800',
    periodPicker: true,
  },
  {
    id: 'transactions-csv',
    title: 'Export to Spreadsheet',
    emoji: '📊',
    desc: 'Download transactions as a CSV file for Excel, Google Sheets, or accounting software',
    badge: 'CSV',
    badgeColor: 'bg-blue-100 text-blue-800',
    periodPicker: true,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Summary',
    emoji: '💰',
    desc: 'View your asset holdings, allocation breakdown, and total wealth',
    badge: 'View',
    badgeColor: 'bg-purple-100 text-purple-800',
    periodPicker: false,
    href: '/dashboard/assets',
  },
];

function ReportsPageContent() {
  const { toast } = useToast();
  const { fmt } = useCurrency();
  const [tab, setTab] = useState<Tab>('spending');
  const [subView, setSubView] = useState<SubView>('breakdown');
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState<string | null>(null);

  // Months list + selected month for the donuts.
  const [months, setMonths] = useState<MonthRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [breakdown, setBreakdown] = useState<BreakdownResponse | null>(null);

  // Trends data: 13 months × per-category. Fetched lazily when the
  // user opens the Trends sub-view to avoid 13 wasted API calls.
  const [trendData, setTrendData] = useState<Array<Record<string, number | string>>>([]);
  const [trendCategories, setTrendCategories] = useState<string[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);

  // Initial: months list.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = (await api.getCashflowMonths(13)) as { months?: MonthRow[] };
        if (cancelled) return;
        const list = r?.months ?? [];
        setMonths(list);
        if (list.length > 0) setSelectedMonth(list[list.length - 1].month);
      } catch {
        if (!cancelled) toast('Failed to load report data', 'error');
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  // Single-month breakdown for Spending/Income donuts.
  useEffect(() => {
    if (!selectedMonth) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await api.getCashflowBreakdown(selectedMonth, 'category');
        if (!cancelled) setBreakdown(r as BreakdownResponse);
      } catch {
        if (!cancelled) setBreakdown(null);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedMonth]);

  // Trends: 13 months of expense-by-category data, pulled in parallel.
  useEffect(() => {
    if (subView !== 'trends' || months.length === 0 || trendData.length > 0) return;
    let cancelled = false;
    setTrendsLoading(true);
    (async () => {
      try {
        const all = await Promise.all(
          months.map(m =>
            api.getCashflowBreakdown(m.month, 'category')
              .then(r => ({ month: m.month, breakdown: r as BreakdownResponse }))
              .catch(() => ({ month: m.month, breakdown: null as BreakdownResponse | null }))
          )
        );
        if (cancelled) return;

        // Pick the top 7 categories across all months by total spend.
        const totals: Record<string, number> = {};
        all.forEach(({ breakdown }) => {
          breakdown?.expenses?.forEach((row: BreakdownRow) => {
            totals[row.label] = (totals[row.label] ?? 0) + row.amount;
          });
        });
        const top = Object.entries(totals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)
          .map(([k]) => k);
        setTrendCategories(top);

        // Build chart data: one row per month, columns are the top
        // categories + an "Other" bucket for everything else.
        const data = all.map(({ month, breakdown }) => {
          const row: Record<string, number | string> = { month: month.slice(5) };
          let other = 0;
          breakdown?.expenses?.forEach((r: BreakdownRow) => {
            if (top.includes(r.label)) {
              row[r.label] = (row[r.label] as number ?? 0) + r.amount;
            } else {
              other += r.amount;
            }
          });
          if (other > 0) row['Other'] = other;
          return row;
        });
        setTrendData(data);
      } finally {
        if (!cancelled) setTrendsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subView, months, trendData.length]);

  const handleGenerate = async (id: string) => {
    setLoading(id);
    try {
      if (id === 'zakat') {
        await api.downloadZakatReport();
        toast('Zakat statement downloaded', 'success');
      } else if (id === 'transactions-pdf') {
        await api.downloadTransactionsPdf(period);
        toast('Transaction report downloaded', 'success');
      } else if (id === 'transactions-csv') {
        await api.downloadTransactionsCsv(period);
        toast('CSV exported', 'success');
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Export failed. Please try again.', 'error');
    } finally {
      setLoading(null);
    }
  };

  // Derived donut data for the current tab.
  const donutData = useMemo(() => {
    if (!breakdown) return [] as Array<{ label: string; amount: number; pct: number; color: string }>;
    const rows = tab === 'spending' ? breakdown.expenses : breakdown.income;
    return rows.map((r, i) => ({
      label: r.label,
      amount: r.amount,
      pct: r.pct,
      color: DONUT_PALETTE[i % DONUT_PALETTE.length],
    }));
  }, [breakdown, tab]);
  const donutTotal = donutData.reduce((s, r) => s + r.amount, 0);

  function monthLong(m: string): string {
    if (!m || m.length < 7) return m;
    const y = parseInt(m.slice(0, 4), 10);
    const mo = parseInt(m.slice(5, 7), 10);
    // 2026-05-03: timeZone:'UTC' avoids the off-by-one render where
    // Date.UTC anchors midnight UTC and toLocaleDateString defaults
    // to local TZ — west-of-UTC users saw "March 2026" for the YYYY-MM
    // key "2026-04". See cash-flow/page.tsx for the canonical fix.
    return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Reports"
        icon="📊"
        subtitle="Spending, income, and trends across your data — plus exports."
      />

      {/* Tab strip — Monarch parity: Spending / Income / Trends / Exports */}
      <div className="border-b border-gray-200 mb-5">
        <nav className="flex gap-6" aria-label="Reports tabs">
          {([
            { id: 'spending', label: 'Spending' },
            { id: 'income', label: 'Income' },
            { id: 'trends', label: 'Trends' },
            { id: 'exports', label: 'Exports' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                if (t.id === 'trends') setSubView('trends');
                else setSubView('breakdown');
              }}
              className={`px-1 py-3 text-sm font-medium transition border-b-2 ${
                tab === t.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* SPENDING / INCOME tabs share the donut layout */}
      {(tab === 'spending' || tab === 'income') && (
        <div>
          {/* Sub-view toggle (Breakdown / Trends) — only Breakdown for income */}
          {tab === 'spending' && (
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="inline-flex rounded-full bg-muted/40 p-0.5 text-[12px] font-medium">
                {(['breakdown', 'trends'] as SubView[]).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSubView(v)}
                    className={`px-3 py-1 rounded-full transition-colors capitalize ${
                      subView === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {subView === 'breakdown' && months.length > 0 && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card"
                >
                  {months.map(m => (
                    <option key={m.month} value={m.month}>{monthLong(m.month)}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {tab === 'income' && months.length > 0 && (
            <div className="mb-4 flex justify-end">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card"
              >
                {months.map(m => (
                  <option key={m.month} value={m.month}>{monthLong(m.month)}</option>
                ))}
              </select>
            </div>
          )}

          {/* DONUT BREAKDOWN view */}
          {subView === 'breakdown' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {donutData.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  {breakdown ? `No ${tab} for ${monthLong(selectedMonth)}.` : 'Loading breakdown…'}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="amount"
                          nameKey="label"
                          innerRadius={75}
                          outerRadius={120}
                          paddingAngle={1}
                          stroke="white"
                          strokeWidth={2}
                        >
                          {donutData.map((entry) => (
                            <Cell key={entry.label} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [fmt(Number(value ?? 0)), String(name)] as [string, string]}
                          contentStyle={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-bold text-foreground tabular-nums">{fmt(donutTotal)}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {donutData.map((row) => (
                      <li key={row.label} className="flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: row.color }}
                            aria-hidden="true"
                          />
                          <CategoryIcon category={row.label} className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate capitalize text-foreground">{row.label.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{row.pct.toFixed(1)}%</span>
                        <span className="text-sm font-medium tabular-nums text-foreground">{fmt(row.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TRENDS sub-view: stacked bar by month and top categories */}
          {subView === 'trends' && tab === 'spending' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {trendsLoading && trendData.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">Loading trends…</div>
              ) : trendData.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">No trend data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={trendData} margin={{ top: 8, right: 12, left: 4, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value, name) => [fmt(Number(value ?? 0)), String(name)] as [string, string]}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
                    {[...trendCategories, 'Other'].map((cat, i) => (
                      <Bar
                        key={cat}
                        dataKey={cat}
                        stackId="spending"
                        fill={DONUT_PALETTE[i % DONUT_PALETTE.length]}
                        radius={i === [...trendCategories, 'Other'].length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      )}

      {/* TRENDS tab (top-level — same chart but always visible) */}
      {tab === 'trends' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {trendsLoading && trendData.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading trends…</div>
          ) : trendData.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No trend data yet.</div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                Spending by category, last 13 months
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={trendData} margin={{ top: 8, right: 12, left: 4, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value, name) => [fmt(Number(value ?? 0)), String(name)] as [string, string]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
                  {[...trendCategories, 'Other'].map((cat, i) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="spending"
                      fill={DONUT_PALETTE[i % DONUT_PALETTE.length]}
                      radius={i === [...trendCategories, 'Other'].length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      )}

      {/* EXPORTS tab (the original Reports page content) */}
      {tab === 'exports' && (
        <>
          {/* Period selector — for time-based reports */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Time Period</p>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                    period === p.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Applies to Transaction History and CSV Export</p>
          </div>

          {/* Report cards */}
          <div className="space-y-4 mb-8">
            {REPORT_TYPES.map(r => {
              const isLoading = loading === r.id;
              const content = (
                <div
                  className={`bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 transition ${
                    r.href ? 'cursor-pointer hover:shadow-md' : ''
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-3xl flex-shrink-0">
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-semibold text-gray-900">{r.title}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.badgeColor}`}>
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{r.desc}</p>
                    {r.periodPicker && (
                      <p className="text-xs text-primary font-medium mt-1">
                        Period: {PERIODS.find(p => p.value === period)?.label}
                      </p>
                    )}
                  </div>
                  {!r.href && (
                    <button
                      type="button"
                      onClick={() => handleGenerate(r.id)}
                      disabled={isLoading}
                      className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium transition"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating…
                        </span>
                      ) : (
                        <>⬇ Download</>
                      )}
                    </button>
                  )}
                  {r.href && (
                    <span className="flex-shrink-0 text-primary text-lg">→</span>
                  )}
                </div>
              );

              return r.href ? (
                <Link key={r.id} href={r.href}>{content}</Link>
              ) : (
                <div key={r.id}>{content}</div>
              );
            })}
          </div>

          {/* Info note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-500 text-lg flex-shrink-0">ℹ️</span>
            <div className="text-sm text-amber-900">
              <strong>Reports are for personal record-keeping.</strong> For tax purposes or legal matters, consult a qualified accountant or Islamic finance advisor.
              Your data is never shared with third parties.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ErrorBoundary>
      <ReportsPageContent />
    </ErrorBoundary>
  );
}
