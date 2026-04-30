'use client';
import { useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import Link from 'next/link';

type Period = 'week' | 'month' | 'year' | 'all';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'week',  label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year',  label: 'Last Year' },
  { value: 'all',   label: 'All Time' },
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
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState<string | null>(null);

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

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Reports & Exports"
        icon="📄"
        subtitle="Generate professional financial reports and download your data"
      />

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
