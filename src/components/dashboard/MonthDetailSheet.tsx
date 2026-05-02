/**
 * Drill-down sheet shown when the user clicks a bar in any monthly
 * income/expense chart. Calls /api/transactions/monthly-detail and
 * renders income broken down by source account + category (paycheck
 * vs rental vs business etc), plus the matching expense breakdown.
 *
 * Phase 24c (2026-04-30): introduced inline on /dashboard/summary.
 * R39 (2026-05-01): extracted to shared component so /dashboard/analytics
 * can re-use the exact same drilldown without duplicating the markup.
 *
 * Founder feedback that this addresses:
 *   "when we click on a month, it doesnt break it down as this was
 *    income from paycheck from this account, this was business or
 *    rental income etc."
 *   "Analytics still doesnt show break down of items and it looks
 *    like you're not able to click by month to drill down."
 */
'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CategoryIcon } from '../../lib/categoryIcon';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';

export interface MonthlyDetailSource {
  category: string;
  account: string;
  sample: string;
  institution: string;
  amount: number;
  count: number;
}

export interface MonthlyDetailBucket {
  total: number;
  byCategory: Record<string, number>;
  bySource: MonthlyDetailSource[];
}

export interface MonthlyDetail {
  month: string;
  income: MonthlyDetailBucket;
  expenses: MonthlyDetailBucket;
}

export function MonthDetailSheet({
  month,
  monthLabel,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
  fmt,
}: {
  month: string;
  monthLabel: string;
  onClose: () => void;
  /**
   * 2026-05-02: Monarch parity — let the user flick between months
   * inline without closing the sheet. When the parent passes
   * onNavigate, the sheet shows prev/next arrows in the header.
   * Direction = -1 (older) or +1 (newer). hasPrev/hasNext disable
   * the buttons at the edges of the available range.
   */
  onNavigate?: (direction: -1 | 1) => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  fmt: (n: number) => string;
}) {
  // 2026-05-02: lock body scroll while the sheet is open. Same fix
  // pattern PR #95 applied to the admin modal — prevents the parent
  // analytics page from scrolling underneath while drilling.
  useBodyScrollLock(true);
  const [detail, setDetail] = useState<MonthlyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getMonthlyDetail(month);
        if (!cancelled) {
          if ((result as { error?: string })?.error) {
            setError((result as { error: string }).error);
          } else {
            setDetail(result as MonthlyDetail);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load month detail');
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [month]);

  // 2026-05-02: keyboard navigation — Esc closes, ← / → flicks
  // through adjacent months when onNavigate is wired. Mirrors how
  // Monarch handles month-detail sheets: the user never has to
  // touch the mouse to compare consecutive months.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onNavigate && hasPrev) {
        e.preventDefault();
        onNavigate(-1);
      } else if (e.key === 'ArrowRight' && onNavigate && hasNext) {
        e.preventDefault();
        onNavigate(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="month-detail-title"
    >
      <div
        className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            {/* 2026-05-02: Monarch-style prev/next month arrows. Lets
                the user flick between adjacent months without
                closing+reopening the sheet. Hidden when no
                onNavigate is provided (preserves the 1-month-only
                surfaces that don't have a series to navigate). */}
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  disabled={!hasPrev}
                  className="text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition rounded-full p-1 hover:bg-gray-100"
                  aria-label="Previous month"
                  title="Previous month"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  disabled={!hasNext}
                  className="text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition rounded-full p-1 hover:bg-gray-100"
                  aria-label="Next month"
                  title="Next month"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div>
              <h3 id="month-detail-title" className="font-semibold text-gray-900 text-lg">{monthLabel}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {onNavigate ? 'Use ← → to flick between months' : 'Income broken down by source account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100 shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-500 text-sm">Loading {monthLabel} detail…</div>
        )}
        {error && (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        )}
        {!loading && !error && detail && (
          <div className="p-5 space-y-6">
            {/* Income section */}
            <section>
              <div className="flex justify-between items-baseline mb-3">
                <h4 className="font-semibold text-green-700 text-base">Income</h4>
                <span className="font-bold text-green-700 text-lg">{fmt(detail.income.total)}</span>
              </div>
              {detail.income.bySource.length === 0 ? (
                <p className="text-gray-400 text-sm py-3 text-center bg-gray-50 rounded-lg">No income recorded for this month.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.income.bySource.map((src, idx) => (
                    <li key={`${src.category}|${src.account}|${idx}`} className="flex justify-between items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CategoryIcon category={src.category} className="w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-900 capitalize">{src.category.replace(/_/g, ' ')}</span>
                          <span className="text-xs text-gray-400">· {src.count} txn{src.count === 1 ? '' : 's'}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          From <span className="font-medium text-gray-800">{src.account}</span>
                          {src.institution && <span className="text-gray-400"> · {src.institution}</span>}
                        </p>
                        {src.sample && src.sample !== src.category && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">e.g. {src.sample}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-green-700 whitespace-nowrap">{fmt(src.amount)}</p>
                        <p className="text-xs text-gray-400">
                          {detail.income.total > 0
                            ? ((src.amount / detail.income.total) * 100).toFixed(0)
                            : '0'}% of income
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Expenses section */}
            <section>
              <div className="flex justify-between items-baseline mb-3">
                <h4 className="font-semibold text-red-700 text-base">Expenses</h4>
                <span className="font-bold text-red-700 text-lg">{fmt(detail.expenses.total)}</span>
              </div>
              {detail.expenses.bySource.length === 0 ? (
                <p className="text-gray-400 text-sm py-3 text-center bg-gray-50 rounded-lg">No expenses recorded for this month.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.expenses.bySource.slice(0, 12).map((src, idx) => (
                    <li key={`${src.category}|${src.account}|${idx}`} className="flex justify-between items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-red-50 to-white border border-red-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CategoryIcon category={src.category} className="w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-900 capitalize">{src.category.replace(/_/g, ' ')}</span>
                          <span className="text-xs text-gray-400">· {src.count} txn{src.count === 1 ? '' : 's'}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          From <span className="font-medium text-gray-800">{src.account}</span>
                        </p>
                      </div>
                      <p className="text-sm font-bold text-red-700 whitespace-nowrap">{fmt(src.amount)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Net summary */}
            <div className={`rounded-xl p-4 text-center ${
              detail.income.total - detail.expenses.total >= 0
                ? 'bg-gradient-to-br from-green-100 to-emerald-50 text-green-900'
                : 'bg-gradient-to-br from-orange-100 to-amber-50 text-orange-900'
            }`}>
              <p className="text-xs uppercase tracking-wide opacity-80">Net for {monthLabel}</p>
              <p className="text-2xl font-bold mt-1">{fmt(detail.income.total - detail.expenses.total)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Convenience hook + Recharts onClick handler. Drop into any chart that
 * has a `data` array with `monthKey` (YYYY-MM) and `label` fields:
 *
 *   const { detailMonth, setDetailMonth, handleChartClick } = useMonthDrilldown();
 *   <BarChart onClick={handleChartClick} ...>
 *   {detailMonth && <MonthDetailSheet ... />}
 */
export function useMonthDrilldown() {
  const [detailMonth, setDetailMonth] = useState<{ key: string; label: string } | null>(null);
  const handleChartClick = (state: unknown) => {
    const data = state as { activePayload?: Array<{ payload?: { monthKey?: string; label?: string } }> } | null;
    const point = data?.activePayload?.[0]?.payload;
    if (point?.monthKey) {
      setDetailMonth({ key: point.monthKey, label: point.label || point.monthKey });
    }
  };
  return { detailMonth, setDetailMonth, handleChartClick };
}
