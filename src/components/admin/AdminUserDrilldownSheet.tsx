/**
 * Admin user-drilldown sheet — opens when an admin clicks one of the
 * activity-count cards on AdminUserDetailModal. Today supports two
 * drilldowns:
 *   • transactions  — last 200 of the user's transactions, paged
 *   • zakatPayments — last 100 of the user's zakat payments
 *
 * Phase R37 (2026-04-30): closes the founder feedback "I am not able
 * to click on transactions and see who all added transactions and
 * zakat etc." The previous admin UI showed COUNTS only — this gives
 * the rows.
 *
 * Side-effects: the backend audits each admin read of user data via
 * `auditService.log`. Kept the row count modest (200) so a single
 * admin click can't dump an entire transactions table for a heavy
 * user. Pagination via "Load 100 more" mirrors the pattern used in
 * the user-list export.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import { api } from '../../lib/api';

export type DrilldownKind = 'transactions' | 'zakatPayments';

interface TransactionRow {
  id: number;
  type: string;
  category: string;
  amount: number;
  description: string | null;
  currency: string;
  timestamp: number;
  source_account_name: string | null;
  source_institution_name: string | null;
  merchant_name: string | null;
  recurring: boolean;
  frequency: string | null;
}

interface ZakatPaymentRow {
  id: number;
  amount: number;
  paid_at: number;
  recipient: string | null;
  notes: string | null;
  currency: string;
}

interface AdminUserDrilldownSheetProps {
  userId: number;
  userEmail: string;
  kind: DrilldownKind;
  onClose: () => void;
}

function fmtTs(ts: number | null | undefined): string {
  if (!ts) return '—';
  const ms = ts < 1e12 ? ts * 1000 : ts;
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fmtMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function AdminUserDrilldownSheet({
  userId,
  userEmail,
  kind,
  onClose,
}: AdminUserDrilldownSheetProps) {
  // 2026-05-02: lock body scroll while the drilldown sheet is open
  // so the parent admin page (and the underlying user-detail modal)
  // don't scroll while reading. Same fix applied to every modal.
  useBodyScrollLock(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [zakatPayments, setZakatPayments] = useState<ZakatPaymentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (replace: boolean) => {
    if (replace) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      if (kind === 'transactions') {
        const data = (await api.adminGetUserTransactions(
          userId,
          100,
          replace ? 0 : offset,
        )) as {
          error?: string;
          total?: number;
          transactions?: TransactionRow[];
        } | null;
        if (data?.error) {
          setError(data.error);
        } else {
          setTotal(data?.total ?? 0);
          setTransactions(prev =>
            replace ? data?.transactions ?? [] : [...prev, ...(data?.transactions ?? [])],
          );
          setOffset((replace ? 0 : offset) + (data?.transactions?.length ?? 0));
        }
      } else {
        const data = (await api.adminGetUserZakatPayments(userId)) as {
          error?: string;
          payments?: ZakatPaymentRow[];
        } | null;
        if (data?.error) {
          setError(data.error);
        } else {
          setZakatPayments(data?.payments ?? []);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load drilldown');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [kind, userId, offset]);

  useEffect(() => {
    void load(true);
    // Intentionally only depend on userId+kind here so reopening the
    // sheet for a different user starts fresh; the load() identity
    // changes when offset increments and we don't want that to refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, kind]);

  const title = kind === 'transactions' ? 'Transactions' : 'Zakat Payments';
  const subtitle = kind === 'transactions'
    ? `${total} total · ${userEmail}`
    : `${zakatPayments.length} total · ${userEmail}`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-drilldown-title"
    >
      <div
        className="w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-start">
          <div>
            <h3 id="admin-drilldown-title" className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100"
            aria-label="Close drilldown"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-500 text-sm">Loading {title.toLowerCase()}…</div>
        )}
        {error && (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        )}

        {!loading && !error && kind === 'transactions' && (
          transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">This user has no transactions.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="px-5 py-3 flex justify-between items-start gap-3 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tx.description || tx.merchant_name || `(no description) · ${tx.category}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <span className={tx.type === 'income' ? 'text-green-600 font-semibold' : tx.type === 'expense' ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                        {tx.type}
                      </span>
                      {' · '}
                      <span className="capitalize">{tx.category.replace(/_/g, ' ')}</span>
                      {tx.source_account_name ? ` · ${tx.source_account_name}` : ''}
                      {tx.recurring && tx.frequency ? ` · 🔁 ${tx.frequency}` : ''}
                    </p>
                    {tx.source_institution_name && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{tx.source_institution_name}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-700' : 'text-gray-900'}`}>
                      {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                      {fmtMoney(tx.amount, tx.currency)}
                    </p>
                    <p className="text-[11px] text-gray-400">{fmtTs(tx.timestamp)}</p>
                  </div>
                </div>
              ))}
              {transactions.length < total && (
                <div className="px-5 py-4 text-center">
                  <button
                    onClick={() => void load(false)}
                    disabled={loadingMore}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading…' : `Load 100 more (${total - transactions.length} left)`}
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {!loading && !error && kind === 'zakatPayments' && (
          zakatPayments.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">This user has no zakat payments.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {zakatPayments.map((p) => (
                <div key={p.id} className="px-5 py-3 flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {p.recipient || 'Recipient not specified'}
                    </p>
                    {p.notes && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.notes}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-700">
                      {fmtMoney(p.amount, p.currency)}
                    </p>
                    <p className="text-[11px] text-gray-400">{fmtTs(p.paid_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
