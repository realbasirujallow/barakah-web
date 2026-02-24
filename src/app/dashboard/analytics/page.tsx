'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [allPeriods, setAllPeriods] = useState<{ week: Summary | null; month: Summary | null; year: Summary | null }>({
    week: null, month: null, year: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getTransactionSummary('week'),
      api.getTransactionSummary('month'),
      api.getTransactionSummary('year'),
    ])
      .then(([week, month, year]) => {
        setAllPeriods({ week, month, year });
        setSummary(month);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allPeriods[period as keyof typeof allPeriods]) {
      setSummary(allPeriods[period as keyof typeof allPeriods]);
    }
  }, [period, allPeriods]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

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

  const trendData = [
    {
      name: 'Week',
      income: allPeriods.week?.totalIncome || 0,
      expenses: allPeriods.week?.totalExpenses || 0,
    },
    {
      name: 'Month',
      income: allPeriods.month?.totalIncome || 0,
      expenses: allPeriods.month?.totalExpenses || 0,
    },
    {
      name: 'Year',
      income: allPeriods.year?.totalIncome || 0,
      expenses: allPeriods.year?.totalExpenses || 0,
    },
  ];

  const netIncome = summary?.netIncome || 0;
  const savingsRate =
    summary && summary.totalIncome > 0
      ? ((summary.netIncome / summary.totalIncome) * 100).toFixed(1)
      : '0.0';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#1B5E20]">📊 Analytics</h1>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p.value
                  ? 'bg-[#1B5E20] text-white'
                  : 'bg-white text-[#1B5E20] border border-green-200 hover:bg-green-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

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

      {/* Charts Row 1: Overview Bar + Income vs Expense Trend */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expense Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Income vs Expenses</h2>
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

        {/* Trend Line */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Trend Overview</h2>
          {trendData.every((d) => d.income === 0 && d.expenses === 0) ? (
            <p className="text-gray-400 text-center py-12">No transaction data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#374151', fontSize: 13 }} />
                <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => fmt(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#1B5E20"
                  strokeWidth={3}
                  dot={{ fill: '#1B5E20', r: 5 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 5 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2: Pie Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Expense Breakdown</h2>
          {expenseData.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No expenses in this period</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmt(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {expenseData.map((d, i) => (
                  <span
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs text-gray-600"
                  >
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {d.name}: {fmt(d.value)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Income Breakdown</h2>
          {incomeData.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No income in this period</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {incomeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmt(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {incomeData.map((d, i) => (
                  <span
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs text-gray-600"
                  >
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {d.name}: {fmt(d.value)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Categories Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Top Spending Categories</h2>
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
                {expenseData
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
                          <span className="font-medium text-gray-800">{d.name}</span>
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
    </div>
  );
}
