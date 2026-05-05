/**
 * Admin user-drilldown sheet — opens when an admin clicks one of the
 * activity-count cards on AdminUserDetailModal, or the "Journey" /
 * "Assets" buttons in the modal footer.
 *
 * Supported drilldown kinds:
 *   • transactions   — last 200 of the user's transactions, paged.
 *                      Inline Edit + Delete actions per row so support
 *                      can fix mis-categorized rows or kill duplicates
 *                      without making the user do it.
 *   • zakatPayments  — last 100 of the user's zakat payments (read-only).
 *   • journey        — full lifecycle timeline (signup, plan changes,
 *                      payment events, milestones), paginated.
 *   • assets         — list a user's assets with inline Edit so admin
 *                      can correct typo'd values or wrong type
 *                      classification.
 *
 * 2026-05-05 (founder ask "admin has to be very robust"): added
 *   journey + assets kinds and inline write actions on transactions
 *   and assets. Every write hits a backend endpoint that audit-logs the
 *   admin id, target user id, and changed fields.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import { api } from '../../lib/api';

export type DrilldownKind = 'transactions' | 'zakatPayments' | 'journey' | 'assets';

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

interface JourneyEvent {
  id: number;
  eventType: string;
  source: string | null;
  createdAt: number;
  metadata: Record<string, unknown>;
}

interface AssetRow {
  id: number;
  name: string;
  type: string;
  value: number;
  currency: string;
  address: string | null;
  created_at: number;
  updated_at: number;
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

function fmtTsLong(ts: number | null | undefined): string {
  if (!ts) return '—';
  const ms = ts < 1e12 ? ts * 1000 : ts;
  return new Date(ms).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
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

// Lifecycle event types are kebab/snake; pretty-print them. Color-code
// the high-signal events (signups, plan changes, payment failures) so
// support can scan a long timeline quickly.
function formatEventType(eventType: string): string {
  return eventType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function eventToneClass(eventType: string): string {
  if (eventType.startsWith('subscription_past_due') || eventType.includes('payment_failed') || eventType === 'cancel_started') {
    return 'bg-red-50 border-red-200 text-red-700';
  }
  if (eventType === 'signup' || eventType === 'first_zakat_calculated' || eventType === 'first_upgrade_completed' || eventType === 'plan_changed' || eventType === 'trial_granted') {
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  }
  if (eventType.includes('paywall') || eventType.includes('upgrade')) {
    return 'bg-amber-50 border-amber-200 text-amber-700';
  }
  return 'bg-gray-50 border-gray-200 text-gray-600';
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
  const [journey, setJourney] = useState<JourneyEvent[]>([]);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Inline edit state — shared between transactions & assets, only one
  // row in edit mode at a time so we can keep the UI simple.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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
      } else if (kind === 'zakatPayments') {
        const data = (await api.adminGetUserZakatPayments(userId)) as {
          error?: string;
          payments?: ZakatPaymentRow[];
        } | null;
        if (data?.error) {
          setError(data.error);
        } else {
          setZakatPayments(data?.payments ?? []);
        }
      } else if (kind === 'journey') {
        const data = (await api.adminGetUserJourney(
          userId,
          100,
          replace ? 0 : offset,
        )) as {
          error?: string;
          total?: number;
          events?: JourneyEvent[];
        } | null;
        if (data?.error) {
          setError(data.error);
        } else {
          setTotal(data?.total ?? 0);
          setJourney(prev =>
            replace ? data?.events ?? [] : [...prev, ...(data?.events ?? [])],
          );
          setOffset((replace ? 0 : offset) + (data?.events?.length ?? 0));
        }
      } else if (kind === 'assets') {
        const data = (await api.adminGetUserAssets(userId)) as {
          error?: string;
          assets?: AssetRow[];
        } | null;
        if (data?.error) {
          setError(data.error);
        } else {
          setAssets(data?.assets ?? []);
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

  const startEdit = (id: number, fields: Record<string, unknown>) => {
    setEditingId(id);
    setEditDraft(fields);
    setActionError(null);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
    setActionError(null);
  };

  const saveTxnEdit = async (txnId: number) => {
    setSaving(true);
    setActionError(null);
    try {
      const result = (await api.adminUpdateUserTransaction(userId, txnId, editDraft)) as {
        error?: string; ok?: boolean;
      } | null;
      if (result?.error) {
        setActionError(result.error);
      } else {
        setTransactions(prev => prev.map(t =>
          t.id === txnId ? { ...t, ...editDraft as Partial<TransactionRow> } : t));
        cancelEdit();
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteTxn = async (txnId: number) => {
    if (!confirm('Delete this transaction? The user can\'t recover it from here.')) return;
    setSaving(true);
    setActionError(null);
    try {
      const result = (await api.adminDeleteUserTransaction(userId, txnId)) as {
        error?: string; ok?: boolean;
      } | null;
      if (result?.error) {
        setActionError(result.error);
      } else {
        setTransactions(prev => prev.filter(t => t.id !== txnId));
        setTotal(t => Math.max(0, t - 1));
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const saveAssetEdit = async (assetId: number) => {
    setSaving(true);
    setActionError(null);
    try {
      const result = (await api.adminUpdateUserAsset(userId, assetId, editDraft)) as {
        error?: string; ok?: boolean;
      } | null;
      if (result?.error) {
        setActionError(result.error);
      } else {
        setAssets(prev => prev.map(a =>
          a.id === assetId ? { ...a, ...editDraft as Partial<AssetRow> } : a));
        cancelEdit();
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const titles: Record<DrilldownKind, string> = {
    transactions: 'Transactions',
    zakatPayments: 'Zakat Payments',
    journey: 'Lifecycle Journey',
    assets: 'Assets',
  };
  const title = titles[kind];
  const subtitle = (() => {
    switch (kind) {
      case 'transactions': return `${total} total · ${userEmail}`;
      case 'zakatPayments': return `${zakatPayments.length} total · ${userEmail}`;
      case 'journey': return `${total} events · ${userEmail}`;
      case 'assets': return `${assets.length} assets · ${userEmail}`;
    }
  })();

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
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-start z-10">
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

        {actionError && (
          <div className="mx-5 mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">{actionError}</div>
        )}

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
              {transactions.map((tx) => {
                const isEditing = editingId === tx.id;
                if (isEditing) {
                  return (
                    <div key={tx.id} className="px-5 py-3 bg-emerald-50/40 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Type</span>
                          <select
                            value={(editDraft.type as string) ?? tx.type}
                            onChange={(e) => setEditDraft({ ...editDraft, type: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="income">income</option>
                            <option value="expense">expense</option>
                            <option value="transfer">transfer</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Category</span>
                          <input
                            type="text"
                            value={(editDraft.category as string) ?? tx.category}
                            onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Amount</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(editDraft.amount as number) ?? tx.amount}
                            onChange={(e) => setEditDraft({ ...editDraft, amount: parseFloat(e.target.value) })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Description</span>
                          <input
                            type="text"
                            value={(editDraft.description as string) ?? tx.description ?? ''}
                            onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </label>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => void saveTxnEdit(tx.id)}
                          disabled={saving}
                          className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={tx.id} className="px-5 py-3 flex justify-between items-start gap-3 hover:bg-gray-50 transition group">
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
                      <div className="flex gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => startEdit(tx.id, {
                            type: tx.type, category: tx.category, amount: tx.amount, description: tx.description ?? '',
                          })}
                          className="px-2 py-0.5 text-[11px] border border-gray-300 rounded hover:bg-emerald-50 hover:border-emerald-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => void deleteTxn(tx.id)}
                          disabled={saving}
                          className="px-2 py-0.5 text-[11px] border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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

        {!loading && !error && kind === 'journey' && (
          journey.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No lifecycle events for this user yet.</div>
          ) : (
            <div className="px-5 py-4 space-y-2">
              {journey.map((ev) => (
                <div
                  key={ev.id}
                  className={`px-3 py-2.5 border rounded-lg text-sm ${eventToneClass(ev.eventType)}`}
                >
                  <div className="flex justify-between items-baseline gap-3">
                    <p className="font-semibold">{formatEventType(ev.eventType)}</p>
                    <p className="text-[11px] opacity-75 shrink-0">{fmtTsLong(ev.createdAt)}</p>
                  </div>
                  {ev.source && (
                    <p className="text-[11px] opacity-75 mt-0.5">via {ev.source}</p>
                  )}
                  {Object.keys(ev.metadata).length > 0 && (
                    <pre className="mt-1.5 text-[11px] bg-white/60 px-2 py-1 rounded overflow-x-auto">
                      {JSON.stringify(ev.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
              {journey.length < total && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => void load(false)}
                    disabled={loadingMore}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading…' : `Load 100 more (${total - journey.length} left)`}
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {!loading && !error && kind === 'assets' && (
          assets.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">This user has no assets.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {assets.map((a) => {
                const isEditing = editingId === a.id;
                if (isEditing) {
                  return (
                    <div key={a.id} className="px-5 py-3 bg-emerald-50/40 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Name</span>
                          <input
                            type="text"
                            value={(editDraft.name as string) ?? a.name}
                            onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Type</span>
                          <input
                            type="text"
                            value={(editDraft.type as string) ?? a.type}
                            onChange={(e) => setEditDraft({ ...editDraft, type: e.target.value })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Value</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(editDraft.value as number) ?? a.value}
                            onChange={(e) => setEditDraft({ ...editDraft, value: parseFloat(e.target.value) })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wide">Currency</span>
                          <input
                            type="text"
                            maxLength={3}
                            value={((editDraft.currency as string) ?? a.currency).toUpperCase()}
                            onChange={(e) => setEditDraft({ ...editDraft, currency: e.target.value.toUpperCase() })}
                            className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm uppercase"
                          />
                        </label>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => void saveAssetEdit(a.id)}
                          disabled={saving}
                          className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={a.id} className="px-5 py-3 flex justify-between items-start gap-3 hover:bg-gray-50 transition group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="capitalize">{a.type.replace(/_/g, ' ')}</span>
                        {a.address ? ` · ${a.address}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">{fmtMoney(a.value, a.currency)}</p>
                      <p className="text-[11px] text-gray-400">Updated {fmtTs(a.updated_at)}</p>
                      <div className="flex gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => startEdit(a.id, {
                            name: a.name, type: a.type, value: a.value, currency: a.currency,
                          })}
                          className="px-2 py-0.5 text-[11px] border border-gray-300 rounded hover:bg-emerald-50 hover:border-emerald-400"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
