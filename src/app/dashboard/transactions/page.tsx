'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { hasPaidSyncAccess } from '../../../lib/subscription';
import { useAuth } from '../../../context/AuthContext';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import { TransactionUsageMeter } from '../../../components/TransactionUsageMeter';
import { SyncBanksButton } from '../../../components/SyncBanksButton';
import { SkeletonPage } from '../SkeletonCard';
import { trackFeatureUse } from '../../../lib/analytics';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { prettifyDescription } from '../../../lib/prettifyDescription';

// ── Supported currencies ──────────────────────────────────────────────────────
const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'SAR', 'AED', 'MYR', 'IDR',
  'TRY', 'PKR', 'BDT', 'NGN', 'EGP', 'INR', 'CAD', 'AUD',
];
const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', SAR: 'Saudi Riyal',
  AED: 'UAE Dirham', MYR: 'Malaysian Ringgit', IDR: 'Indonesian Rupiah',
  TRY: 'Turkish Lira', PKR: 'Pakistani Rupee', BDT: 'Bangladeshi Taka',
  NGN: 'Nigerian Naira', EGP: 'Egyptian Pound', INR: 'Indian Rupee',
  CAD: 'Canadian Dollar', AUD: 'Australian Dollar',
};
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', SAR: '﷼', AED: 'د.إ', MYR: 'RM',
  IDR: 'Rp', TRY: '₺', PKR: '₨', BDT: '৳', NGN: '₦', EGP: 'E£',
  INR: '₹', CAD: 'C$', AUD: 'A$',
};

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'food', 'dining', 'groceries', 'coffee',
  'transportation', 'fuel', 'parking', 'public_transit',
  'housing', 'utilities', 'rent', 'home_maintenance', 'insurance',
  'shopping', 'clothing', 'electronics',
  'healthcare', 'fitness', 'pharmacy',
  'education', 'kids', 'childcare',
  'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets',
  'income', 'investment', 'savings', 'debt_payment', 'taxes', 'transfer',
  'charity', 'zakat', 'sadaqah',
  'business', 'other',
];
const TRANSFER_CATEGORIES = ['transfer', 'savings', 'investment', 'debt_payment', 'other'];
const PAGE_SIZE_OPTIONS = [20, 50, 100];

interface Tx {
  id: number; type: string; category: string; amount: number;
  description: string; currency: string; timestamp: number;
  direction?: string;
  importSource?: string | null;
  linkedAccountId?: number | null;
  sourceAccountName?: string | null;
  sourceInstitutionName?: string | null;
  sourceAccountType?: string | null;
  externalAccountId?: string | null;
  merchantName?: string | null;
  tags?: string | null;
  notes?: string | null;
  reviewStatus?: string | null;
  /** R44 (2026-05-01): backend already exposes this via the transactions
   *  endpoint; the UI just hadn't surfaced it. Toggled via
   *  api.toggleRecurring(id). */
  isRecurring?: boolean | null;
}

interface SubscriptionStatus {
  plan: 'free' | 'plus' | 'family';
  status: string;
  hasSubscription: boolean;
}

// Friendly amount string for a transaction, respecting its own stored currency
function txAmount(tx: Tx, fmt: (n: number) => string): string {
  return fmt(tx.amount);
}

function categoriesForType(type: string) {
  if (type === 'income') return CATEGORIES.filter(c => ['income', 'investment', 'savings', 'transfer', 'business', 'other', 'charity', 'gift', 'gifts', 'taxes'].includes(c) || ['salary'].includes(c));
  if (type === 'transfer') return TRANSFER_CATEGORIES;
  return CATEGORIES.filter(c => !['income', 'investment', 'savings'].includes(c));
}

function txPresentation(tx: Tx) {
  if (tx.type === 'income') {
    return { amountClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-700', badge: 'Income', sign: '+' };
  }
  if (tx.type === 'transfer') {
    const inflow = tx.direction === 'inflow';
    const outflow = tx.direction === 'outflow';
    return {
      amountClass: 'text-cyan-700',
      badgeClass: 'bg-cyan-100 text-cyan-700',
      badge: inflow ? 'Transfer In' : outflow ? 'Transfer Out' : 'Transfer',
      sign: inflow ? '↔ +' : outflow ? '↔ −' : '↔',
    };
  }
  return { amountClass: 'text-red-600', badgeClass: 'bg-red-100 text-red-700', badge: 'Expense', sign: '−' };
}

export default function TransactionsPage() {
  const reviewedTrackedRef = useRef(false);
  // Round 30: read URL params so /dashboard/analytics "Review" button can
  // deep-link into a pre-filtered transactions view instead of dumping the
  // user on the full list to go needle-in-a-haystack hunting. Recognized
  // query params:
  //   ?category=xxx        — pre-fills the search box (text match)
  //   ?filter=needs_review — jumps straight to the needs-review tab
  //   ?filter=income|expense|transfer — jumps to that tab
  const searchParams = useSearchParams();
  const urlCategory = searchParams?.get('category') ?? '';
  const urlFilter = searchParams?.get('filter') ?? '';
  // 2026-05-02 polish (Monarch parity gap #5): the cash-flow Sankey +
  // breakdown drilldowns send `?month=YYYY-MM`. Honor it as a
  // client-side filter on the loaded transactions so users land on the
  // right slice instead of the whole feed. Validated to YYYY-MM
  // shape so a malformed query string can't poison the filter.
  const urlMonthRaw = searchParams?.get('month') ?? '';
  const urlMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(urlMonthRaw) ? urlMonthRaw : '';

  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx]     = useState<Tx | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState(() => {
    // Accept only known filter values from the URL.
    const allowed = new Set(['all', 'income', 'expense', 'transfer', 'needs_review']);
    return allowed.has(urlFilter) ? urlFilter : 'all';
  });
  const [search, setSearch] = useState(urlCategory);
  const [searchDebounce, setSearchDebounce] = useState(urlCategory);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: 'single' | 'bulk'; id?: number; count?: number } | null>(null);
  // 2026-05-03 (Monarch parity): bulk recategorize. The backend has had
  // /api/transactions/bulk-categorize for a while and api.bulkCategorize
  // wraps it, but the transactions page never wired up the UI. Monarch's
  // "Edit multiple" toolbar (frame f_020 of the walkthrough) lets the
  // user recategorize a multi-selection in one shot — same primitive
  // we're surfacing here. Local state for the dropdown menu + spinner.
  const [bulkCategorizing, setBulkCategorizing] = useState(false);
  const [bulkCategoryMenuOpen, setBulkCategoryMenuOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [reviewCount, setReviewCount] = useState(0);

  const { currency: preferredCurrency, fmt } = useCurrency();

  const [form, setForm] = useState({
    type: 'expense', direction: 'outflow', category: 'food', amount: '', description: '', currency: 'USD',
    date: new Date().toISOString().slice(0, 10),
    tags: '', notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Sync form currency with user's preferred currency on first load
  useEffect(() => {
    if (preferredCurrency) setForm(f => ({ ...f, currency: preferredCurrency }));
  }, [preferredCurrency]);

  const { toast } = useToast();
  const { user } = useAuth();

  // ── Modal accessibility: focus trap + Escape close ──────────────────────
  const formModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(formModalRef, showForm);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(deleteModalRef, deleteConfirmation !== null);
  // 2026-05-02: lock body scroll while either the add/edit form
  // or the delete-confirm modal is open. Same fix the admin panel
  // received in PR #95 — keeps the underlying tx list anchored.
  useBodyScrollLock(showForm || deleteConfirmation !== null);
  useEffect(() => {
    if (!showForm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowForm(false); setEditTx(null); setFormError(null); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showForm]);
  useEffect(() => {
    if (deleteConfirmation === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeleteConfirmation(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [deleteConfirmation]);

  // 2026-05-02 (Monarch parity): when the page is filtered to a
  // specific month via ?month=YYYY-MM, ← and → flick to the previous /
  // next month inline. Skipped while typing in inputs so we don't
  // hijack the search box. Skipped while a modal is open so the
  // arrow keys still belong to the modal's focus trap.
  useEffect(() => {
    if (!urlMonth) return;
    const handler = (e: KeyboardEvent) => {
      if (showForm || deleteConfirmation !== null) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const [y, m] = urlMonth.split('-').map(Number);
      const next = new Date(y, (m || 1) - 1 + (e.key === 'ArrowLeft' ? -1 : 1), 1);
      const ym = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
      const params = new URLSearchParams();
      if (urlCategory) params.set('category', urlCategory);
      params.set('month', ym);
      const filterParam = searchParams?.get('filter');
      if (filterParam) params.set('filter', filterParam);
      window.location.href = `/dashboard/transactions?${params.toString()}`;
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [urlMonth, urlCategory, searchParams, showForm, deleteConfirmation]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => { setSearchDebounce(search); setPage(0); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = () => {
    setLoading(true);
    setError(null);
    const txPromise = filter === 'needs_review'
      ? api.getReviewQueue(page, pageSize)
      : api.getTransactions(filter === 'all' ? undefined : filter, page, pageSize, searchDebounce || undefined);
    Promise.allSettled([
      txPromise,
      api.subscriptionStatus(),
      api.getReviewQueue(0, 1),
    ])
      .then(results => {
        const transactionsResult = results[0].status === 'fulfilled' ? results[0].value : null;
        const subscriptionResult = results[1].status === 'fulfilled' ? results[1].value : null;
        const reviewResult = results[2].status === 'fulfilled' ? results[2].value : null;
        setSubscriptionStatus(
          subscriptionResult
            ? (subscriptionResult as SubscriptionStatus)
            : { plan: 'free', status: 'inactive', hasSubscription: false },
        );
        if (reviewResult?.totalElements != null) {
          setReviewCount(reviewResult.totalElements);
        }
        if (transactionsResult?.error) {
          toast(transactionsResult.error, 'error');
          setError(transactionsResult.error);
          return;
        }
        setTxs(Array.isArray(transactionsResult?.transactions) ? transactionsResult.transactions : []);
        setTotalPages(transactionsResult?.totalPages || 0);
        setTotalElements(transactionsResult?.totalElements || 0);
      })
      .catch(() => {
        toast('Failed to load transactions', 'error');
        setError('Failed to load transactions. Please try again.');
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter, page, pageSize, searchDebounce]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (reviewedTrackedRef.current || txs.length === 0) return;
    reviewedTrackedRef.current = true;
    api.lifecycleTrackEvent('transactions_reviewed', {
      transactionCount: txs.length,
    }, 'web_transactions').catch(() => {});
  }, [txs]);

  const openAdd = () => {
    setEditTx(null);
    setForm({ type: 'expense', direction: 'outflow', category: 'food', amount: '', description: '', currency: preferredCurrency || 'USD', date: new Date().toISOString().slice(0, 10), tags: '', notes: '' });
    // BUG FIX: clear any stale validation error from a previous (failed) save
    // so it does not immediately show when the modal opens on a fresh attempt.
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (tx: Tx) => {
    setEditTx(tx);
    const txDate = new Date(tx.timestamp).toISOString().slice(0, 10);
    setForm({ type: tx.type, direction: tx.direction || (tx.type === 'income' ? 'inflow' : tx.type === 'transfer' ? 'neutral' : 'outflow'), category: tx.category, amount: String(tx.amount), description: tx.description, currency: tx.currency || preferredCurrency || 'USD', date: txDate, tags: tx.tags || '', notes: tx.notes || '' });
    // BUG FIX: clear stale form error when editing a different transaction
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const amt = parseFloat(form.amount);
      if (!amt || amt <= 0) {
        const msg = 'Transaction amount must be greater than zero';
        setFormError(msg);
        toast(msg, 'error');
        setSaving(false);
        return;
      }
      if (amt > 100000) {
        const msg = 'Transaction amount cannot exceed $100,000';
        setFormError(msg);
        toast(msg, 'error');
        setSaving(false);
        return;
      }
      // Convert date string to epoch milliseconds (noon UTC to avoid timezone edge cases)
      const timestamp = form.date ? new Date(form.date + 'T12:00:00Z').getTime() : Date.now();
      // Round 30: strip `date` before send. The DTO expects a numeric
      // `timestamp` (Long); sending the raw ISO-date string caused
      // Jackson to fail "invalid request body" when the user edited a
      // Zelle / transfer transaction. Prior to this we spread the whole
      // form which included both `date: "YYYY-MM-DD"` and `timestamp: Long`.
      const { date: _date, ...formWithoutDate } = form;
      void _date;
      const payload = { ...formWithoutDate, amount: amt, timestamp };
      if (editTx) {
        await api.updateTransaction(editTx.id, payload);
        toast('Transaction updated', 'success');
      } else {
        await api.addTransaction(payload);
        toast('Transaction added', 'success');
      }
      setShowForm(false);
      setEditTx(null);
      setForm({ type: 'expense', direction: 'outflow', category: 'food', amount: '', description: '', currency: preferredCurrency || 'USD', date: new Date().toISOString().slice(0, 10), tags: '', notes: '' });
      load();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (editTx ? 'Failed to update transaction' : 'Failed to add transaction');
      setFormError(errorMsg);
      toast(errorMsg, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirmation({ type: 'single', id });
  };

  /*
    R44 (2026-05-01): expose the existing api.toggleRecurring(id)
    endpoint via a row-level "Mark as recurring" action. Founder
    feedback: "I dont see an option to mark transaction as
    recurring, fix that." Optimistically flips the local row state
    so the badge appears instantly, with a toast for confirmation.
    On API failure, the optimistic update is reverted.
  */
  const handleToggleRecurring = async (tx: Tx) => {
    const next = !tx.isRecurring;
    setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, isRecurring: next } : t));
    // 2026-05-01: also update editTx so the modal's checkbox flips
    // immediately when toggled from inside the modal. Without this,
    // editTx is a snapshot from openEdit() and stays stale after toggle.
    setEditTx(prev => prev && prev.id === tx.id ? { ...prev, isRecurring: next } : prev);
    try {
      await api.toggleRecurring(tx.id);
      toast(next ? 'Marked as recurring' : 'Recurring removed', 'success');
    } catch {
      // Revert optimistic update on both states.
      setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, isRecurring: !next } : t));
      setEditTx(prev => prev && prev.id === tx.id ? { ...prev, isRecurring: !next } : prev);
      toast('Failed to update recurring status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation || deleteConfirmation.type !== 'single' || deleteConfirmation.id === undefined) return;
    const id = deleteConfirmation.id;
    setDeleteConfirmation(null);
    try {
      await api.deleteTransaction(id);
      toast('Transaction deleted', 'success');
      setPage(0);
    } catch {
      toast('Failed to delete transaction', 'error');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectAllPages(false);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === txs.length) {
      setSelectedIds(new Set());
      setSelectAllPages(false);
    } else {
      setSelectedIds(new Set(txs.map(t => t.id)));
      setSelectAllPages(false);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setSelectAllPages(false);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
    exitSelectMode();
  };

  const handleBulkDelete = async () => {
    const count = selectAllPages ? totalElements : selectedIds.size;
    if (count === 0) return;
    setDeleteConfirmation({ type: 'bulk', count });
  };

  const confirmBulkDelete = async () => {
    if (!deleteConfirmation || deleteConfirmation.type !== 'bulk') return;
    const count = deleteConfirmation.count ?? 0;
    const noun = count === 1 ? 'transaction' : 'transactions';
    setDeleteConfirmation(null);
    setBulkDeleting(true);
    try {
      if (selectAllPages) {
        const typeParam = filter === 'all' ? undefined : filter;
        const result = await api.deleteAllTransactions(typeParam);
        toast(`${result?.deleted ?? count} ${noun} deleted`, 'success');
      } else {
        const result = await api.bulkDeleteTransactions(Array.from(selectedIds));
        toast(`${result?.deleted ?? count} ${noun} deleted`, 'success');
      }
      exitSelectMode();
      setPage(0);
      load();
    } catch {
      toast('Failed to delete transactions', 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  // 2026-05-03 (Monarch parity): bulk-categorize handler. Tied to the
  // dropdown rendered inside the bulk-action bar. selectAllPages mode
  // is intentionally not supported here — the bulk-categorize endpoint
  // takes an explicit ids[] payload (max 500) and there's no
  // server-side "all matching this filter" variant yet. UI hides the
  // button when selectAllPages is on so users don't get stuck.
  const handleBulkCategorize = async (category: string) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkCategoryMenuOpen(false);
    setBulkCategorizing(true);
    try {
      const result = await api.bulkCategorize(ids, category);
      const updated = (result as { updated?: number })?.updated ?? ids.length;
      const noun = updated === 1 ? 'transaction' : 'transactions';
      toast(`${updated} ${noun} recategorized as ${category.replace(/_/g, ' ')}`, 'success');
      exitSelectMode();
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to recategorize transactions', 'error');
    } finally {
      setBulkCategorizing(false);
    }
  };

  const handleExportCsv = async () => {
    setExportingCsv(true); setExportError(null);
    // trackFeatureUse fires on every click (not scoped to first-use) so
    // paid-acquisition dashboards can read repeat-use as an engagement
    // signal. Backend also emits metrics.recordExport('csv').
    try { trackFeatureUse('export_transactions_csv'); } catch { /* GA4 unavailable */ }
    try { await api.downloadTransactionsCsv(); }
    catch (err) { logError(err, { context: 'transactions.exportCsv' }); toast('CSV export failed', 'error'); setExportError('CSV export failed. Please try again.'); }
    setExportingCsv(false);
  };

  const handleExportPdf = async () => {
    setExportingPdf(true); setExportError(null);
    try { trackFeatureUse('export_transactions_pdf'); } catch { /* GA4 unavailable */ }
    try { await api.downloadTransactionsPdf(); }
    catch (err) { logError(err, { context: 'transactions.exportPdf' }); toast('PDF export failed', 'error'); setExportError('PDF export failed. Please try again.'); }
    setExportingPdf(false);
  };

  // ── Skeleton loading ──────────────────────────────────────────────────────
  if (loading) return <SkeletonPage summaryCount={3} listCount={6} />;

  if (error) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">⚠️</p>
      <p className="text-red-600 font-medium mb-4">{error}</p>
      <button onClick={load} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium">
        Retry
      </button>
    </div>
  );

  // Only sum transactions whose currency matches the user's preferred display
  // currency. Mixing USD + GBP amounts in a single total is misleading because
  // each transaction stores its amount in its own currency; we can't add them
  // without FX conversion. Show a note if other-currency transactions exist.
  const sameCurrencyTxns = txs.filter(t => (t.currency || 'USD') === (preferredCurrency || 'USD'));
  const mixedCurrencyCount = txs.length - sameCurrencyTxns.length;
  const income  = sameCurrencyTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = sameCurrencyTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const transfers = sameCurrencyTxns.filter(t => t.type === 'transfer').reduce((s, t) => s + t.amount, 0);
  const allPageSelected = txs.length > 0 && selectedIds.size === txs.length;
  const hasMorePages = totalPages > 1;
  const hasLinkedPlaidTransactions = txs.some(tx => tx.importSource === 'plaid');
  const plaidSyncAccess = hasPaidSyncAccess(subscriptionStatus) || (user?.plan === 'plus' || user?.plan === 'family');

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Income, expenses, and transfers across every linked account"
        actions={
          <>
            <SyncBanksButton onSynced={load} label="Sync banks" />
            <button onClick={handleExportCsv} disabled={exportingCsv}
              className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium disabled:opacity-50 flex items-center gap-1">
              {exportingCsv ? <span className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full inline-block" /> : '📥'} CSV
            </button>
            <button onClick={handleExportPdf} disabled={exportingPdf}
              className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium disabled:opacity-50 flex items-center gap-1">
              {exportingPdf ? <span className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full inline-block" /> : '📄'} PDF
            </button>
            {txs.length > 0 && (
              selectMode
                ? <button onClick={exitSelectMode} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">Cancel</button>
                : <button onClick={() => setSelectMode(true)} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">Select</button>
            )}
            <button onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">+ Add</button>
          </>
        }
      />

      {exportError && <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">{exportError}</div>}

      <div className={`mb-4 rounded-2xl border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${
        plaidSyncAccess ? 'bg-[#F7FBF7] border-green-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <p className={`text-sm font-semibold ${plaidSyncAccess ? 'text-primary' : 'text-amber-900'}`}>
            {hasLinkedPlaidTransactions
              ? (plaidSyncAccess ? 'Keep your transaction feed alive.' : 'Your imported feed is visible, but syncing is paused.')
              : 'Connect your accounts to stop manual ledger work.'}
          </p>
          <p className={`text-sm mt-1 ${plaidSyncAccess ? 'text-gray-600' : 'text-amber-800'}`}>
            {hasLinkedPlaidTransactions
              ? (plaidSyncAccess
                ? 'Open Import to resync fresh bank activity, salaries, subscriptions, and transfers.'
                : 'Upgrade to Plus or Family to keep your linked activity syncing after trial access ends.')
              : (plaidSyncAccess
                ? 'Plaid turns this page into a live ledger instead of a manual list.'
                : 'Plaid syncing now lives on Plus and Family. Upgrade when you want fresh balances and transaction flow here.')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/import"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              plaidSyncAccess ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {hasLinkedPlaidTransactions ? 'Manage Linked Accounts' : 'Connect Accounts'}
          </Link>
          {!plaidSyncAccess && (
            <Link
              href="/dashboard/billing"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Upgrade to Keep Syncing
            </Link>
          )}
        </div>
      </div>

      {/*
        Summary cards.
        R39 (2026-05-01): upgraded from bare `bg-white rounded-xl` to
        gradient KPI cards matching the /summary and /analytics
        pattern. Founder feedback: "transactions page still looks
        non polish to me." The visual language now reads as one
        product across the three reporting surfaces.
        R42 (2026-05-01): viewTransitionName matches the dashboard's
        Recent Transactions card so the morph completes on arrival.
      */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        style={{ viewTransitionName: 'transactions-hero' }}
      >
        <div className="bg-gradient-to-br from-[#1B5E20] to-green-500 rounded-xl p-4 text-white shadow-sm">
          <p className="text-green-200 text-[10px] uppercase tracking-wide font-semibold">Income</p>
          <p className="text-xl font-bold mt-1">{fmt(income)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-400 rounded-xl p-4 text-white shadow-sm">
          <p className="text-red-200 text-[10px] uppercase tracking-wide font-semibold">Expenses</p>
          <p className="text-xl font-bold mt-1">{fmt(expense)}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-xl p-4 text-white shadow-sm">
          <p className="text-cyan-100 text-[10px] uppercase tracking-wide font-semibold">Transfers</p>
          <p className="text-xl font-bold mt-1">{fmt(transfers)}</p>
        </div>
        <div className={`rounded-xl p-4 text-white shadow-sm bg-gradient-to-br ${income - expense >= 0 ? 'from-teal-600 to-cyan-500' : 'from-orange-600 to-amber-500'}`}>
          <p className="opacity-80 text-[10px] uppercase tracking-wide font-semibold">Net</p>
          <p className="text-xl font-bold mt-1">{fmt(income - expense)}</p>
        </div>
      </div>
      {mixedCurrencyCount > 0 && (
        <p className="text-xs text-gray-500 mb-4 -mt-2">
          Mixed-currency transactions ({mixedCurrencyCount}) not shown in totals above. Switch display currency in Settings to view them.
        </p>
      )}

      {/* ── Free plan transaction usage meter ──────────────────────────────── */}
      <TransactionUsageMeter />

      {/* ── Search row (Monarch-style: prominent, top of list) ──────────────
          R44 (2026-05-01): the search input used to live on the same
          row as filter pills, where it was visually cramped and easy
          to miss. Founder feedback: "Nothing is searchable also."
          Promoting to its own row with a leading icon, full-width
          flex layout, and a ⌘K shortcut hint mirrors how Monarch /
          Linear / Stripe handle dashboard search. The Cmd+K key
          binding was already in place (dashboard layout listener
          jumps focus to #tx-search). */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
          <input
            id="tx-search"
            type="text"
            placeholder="Search by merchant, description, category, tag, or notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-shadow shadow-sm"
            aria-label="Search transactions"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* 2026-05-02 (Monarch parity): active-filter breadcrumb with
          inline navigation. When the user lands here from a cash-flow
          Sankey, breakdown click, or month-detail sheet, they can:
            • See exactly what's filtered (category + month)
            • Flick to prev/next month without going back
            • Clear individual filters or all of them
          Founder feedback: "user can navigate to another month or
          expense without remaining on 1 page is annoying — Monarch
          has this in a nice way."  This is the Monarch-style nav. */}
      {(urlMonth || urlCategory) && (
        <div className="mb-3 flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          {urlMonth && (() => {
            const [y, m] = urlMonth.split('-').map(Number);
            const monthLabel = new Date(y, (m || 1) - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
            const shiftMonth = (delta: -1 | 1) => {
              const next = new Date(y, (m || 1) - 1 + delta, 1);
              const ym = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
              const params = new URLSearchParams();
              if (urlCategory) params.set('category', urlCategory);
              params.set('month', ym);
              const filterParam = searchParams?.get('filter');
              if (filterParam) params.set('filter', filterParam);
              window.location.href = `/dashboard/transactions?${params.toString()}`;
            };
            return (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="p-1 rounded-full hover:bg-emerald-100 text-emerald-800"
                  aria-label="Previous month"
                  title="Previous month (←)"
                >
                  ←
                </button>
                <span className="font-bold tabular-nums">{monthLabel}</span>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="p-1 rounded-full hover:bg-emerald-100 text-emerald-800"
                  aria-label="Next month"
                  title="Next month (→)"
                >
                  →
                </button>
              </div>
            );
          })()}
          {urlCategory && urlMonth && <span className="text-emerald-400">·</span>}
          {urlCategory && (
            <span className="font-medium">
              Category: <span className="font-bold capitalize">{urlCategory.replace(/_/g, ' ')}</span>
            </span>
          )}
          <div className="ml-auto flex items-center gap-3">
            {urlCategory && (
              <a
                href={`/dashboard/transactions${urlMonth ? `?month=${urlMonth}` : ''}`}
                className="text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline text-xs"
              >
                Clear category
              </a>
            )}
            {urlMonth && (
              <a
                href={`/dashboard/transactions${urlCategory ? `?category=${urlCategory}` : ''}`}
                className="text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline text-xs"
              >
                Clear month
              </a>
            )}
            {(urlCategory || urlMonth) && (
              <a
                href="/dashboard/transactions"
                className="text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline text-xs font-medium"
              >
                Clear all
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Filter + page-size row ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {['all', 'income', 'expense', 'transfer'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(0); exitSelectMode(); }}
            className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{f}</button>
        ))}
        <button onClick={() => { setFilter('needs_review'); setPage(0); exitSelectMode(); }}
          className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5 ${filter === 'needs_review' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
          Needs Review
          {reviewCount > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${filter === 'needs_review' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'}`}>
              {reviewCount}
            </span>
          )}
        </button>
        {totalElements > 0 && <span className="text-sm text-gray-500">{totalElements} total</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Show:</span>
          {PAGE_SIZE_OPTIONS.map(n => (
            <button key={n} onClick={() => handlePageSizeChange(n)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${pageSize === n ? 'bg-primary text-primary-foreground border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{n}</button>
          ))}
        </div>
      </div>

      {/* ── Bulk select bar ─────────────────────────────────────────────────── */}
      {selectMode && (
        <div className="mb-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="w-4 h-4 accent-[#1B5E20] rounded" />
              {allPageSelected ? 'Deselect page' : 'Select page'}
            </label>
            <span className="text-sm text-gray-500">{selectAllPages ? `All ${totalElements} selected` : `${selectedIds.size} selected`}</span>
            {/* 2026-05-03 (Monarch parity): bulk recategorize. The
                walkthrough showed Monarch's "Edit multiple" toolbar
                surfaces a category picker in this position. Hidden when
                "Select all pages" is on because the underlying endpoint
                only accepts an explicit ids[] payload (max 500). */}
            {selectedIds.size > 0 && !selectAllPages && (
              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => setBulkCategoryMenuOpen(o => !o)}
                  disabled={bulkCategorizing}
                  className="bg-[#1B5E20] text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-[#164a18] disabled:opacity-40 flex items-center gap-1.5"
                  aria-haspopup="menu"
                  aria-expanded={bulkCategoryMenuOpen}
                >
                  {bulkCategorizing ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : '🏷️'}
                  Recategorize ({selectedIds.size})
                </button>
                {bulkCategoryMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setBulkCategoryMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1 z-40 w-56 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                    >
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          role="menuitem"
                          onClick={() => handleBulkCategorize(cat)}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 capitalize"
                        >
                          {cat.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <button onClick={handleBulkDelete}
              disabled={(selectAllPages ? totalElements : selectedIds.size) === 0 || bulkDeleting}
              className={`${selectedIds.size > 0 && !selectAllPages ? '' : 'ml-auto'} bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5`}>
              {bulkDeleting ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : '🗑️'}
              Delete {selectAllPages ? `all ${totalElements}` : selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </button>
          </div>
          {allPageSelected && hasMorePages && !selectAllPages && (
            <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
              <span>All {txs.length} transactions on this page are selected.</span>
              <button onClick={() => setSelectAllPages(true)} className="font-semibold underline hover:no-underline">
                Select all {totalElements} transactions
              </button>
            </div>
          )}
          {selectAllPages && (
            <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
              <span>All {totalElements} transactions are selected.</span>
              <button onClick={() => { setSelectAllPages(false); setSelectedIds(new Set(txs.map(t => t.id))); }} className="font-semibold underline hover:no-underline">
                Select only this page
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Transaction list or empty state ────────────────────────────────── */}
      {loading && txs.length === 0 ? (
        // Gate on loading so the empty-state banner doesn't flash for the
        // one render cycle between initial mount and the first API response.
        // Regression QA caught this — "No transactions yet" appeared for
        // users who had data in the DB.
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">
          <p className="text-4xl mb-3">⏳</p>
          Loading your transactions…
        </div>
      ) : txs.length > 0 ? (
        // R44 (2026-05-01): group rows by date with a daily-total
        // header — closes the gap with Monarch's transactions page.
        // Rows already arrive sorted by timestamp desc from the API,
        // so a streaming reduce preserves order while bucketing into
        // [{ key, label, total, rows[] }, ...].
        //
        // 2026-05-02: when ?month=YYYY-MM is present (drill-down from
        // cash-flow Sankey or breakdown), narrow the displayed rows to
        // that month before grouping. The pagination loaded everything
        // in the page; we filter client-side so the day-grouping math
        // is correct for the selected window.
        (() => {
          type Group = { key: string; label: string; rows: Tx[]; net: number };
          const groups: Group[] = [];
          const byKey: Record<string, Group> = {};
          const monthFilteredTxs = urlMonth
              ? txs.filter(t => {
                  const iso = new Date(t.timestamp).toISOString();
                  return iso.startsWith(urlMonth);
                })
              : txs;
          for (const t of monthFilteredTxs) {
            const d = new Date(t.timestamp);
            // Use ISO date as the stable bucketing key (independent of
            // user locale) but render a friendlier label below.
            const key = d.toISOString().slice(0, 10);
            let g = byKey[key];
            if (!g) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const dCmp = new Date(d);
              dCmp.setHours(0, 0, 0, 0);
              const diffDays = Math.round((today.getTime() - dCmp.getTime()) / 86400000);
              const label = diffDays === 0
                ? `Today, ${d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`
                : diffDays === 1
                  ? `Yesterday, ${d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`
                  : d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: today.getFullYear() === d.getFullYear() ? undefined : 'numeric' });
              g = { key, label, rows: [], net: 0 };
              groups.push(g);
              byKey[key] = g;
            }
            g.rows.push(t);
            // Running daily net: income +, expense −, transfer skipped.
            // Mirrors how Monarch's date-section totals net out for the
            // user — no double-counting transfer in/out within the day.
            if (t.type === 'income') g.net += t.amount;
            else if (t.type === 'expense') g.net -= t.amount;
          }

          return (
            <div className="space-y-3">
              {groups.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                    <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{group.label}</h3>
                    <span className={`text-xs tabular-nums font-medium ${group.net > 0 ? 'text-emerald-600' : group.net < 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                      {group.net === 0 ? '—' : `${group.net > 0 ? '+' : '−'}${fmt(Math.abs(group.net))}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.rows.map((tx) => {
                      const presentation = txPresentation(tx);
                      return (
            <div key={tx.id}
              onClick={selectMode ? () => toggleSelect(tx.id) : () => openEdit(tx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (selectMode) toggleSelect(tx.id); else openEdit(tx);
                }
              }}
              aria-label={`${tx.description || tx.category} — click to ${selectMode ? 'select' : 'edit'}`}
              className={`group bg-card rounded-xl p-4 flex justify-between items-center cursor-pointer border border-transparent transition-all hover:border-primary/20 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selectMode && (selectedIds.has(tx.id) || selectAllPages) ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
              <div className="flex items-center gap-3">
                {selectMode && (
                  <input type="checkbox" checked={selectedIds.has(tx.id) || selectAllPages}
                    onChange={() => toggleSelect(tx.id)} onClick={e => e.stopPropagation()}
                    aria-label={`Select ${tx.description || tx.category}`}
                    className="w-4 h-4 accent-[#1B5E20] rounded flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* 2026-05-03: prettifyDescription compresses raw
                        ACH/POS/Zelle blobs ("ORIG CO NAME:IN 529 Dir
                        ACH CO ENTRY DESCR:CONTRIB SEC:WEB IND ID:...")
                        down to readable merchant names ("IN 529").
                        Live transaction-list smoke test before the
                        investor demo surfaced these as the worst-
                        looking rows. The original description is kept
                        as a tooltip so the underlying bank text is
                        still recoverable. */}
                    <p className="font-semibold text-gray-900" title={tx.description || ''}>
                      {tx.merchantName
                        ? <>
                            <span className="font-bold">{tx.merchantName}</span>
                            {tx.description && tx.description !== tx.merchantName
                              ? <span className="font-normal text-gray-500 text-sm ml-1">— {prettifyDescription(tx.description)}</span>
                              : ''}
                          </>
                        : (prettifyDescription(tx.description) || tx.category)}
                      {tx.notes && <span className="ml-1 text-sm" title={tx.notes}>📝</span>}
                    </p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${presentation.badgeClass}`}>
                      {presentation.badge}
                    </span>
                    {tx.reviewStatus === 'needs_review' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Review
                      </span>
                    )}
                    {tx.importSource === 'plaid' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Linked via Plaid
                      </span>
                    )}
                    {tx.isRecurring && (
                      // R44 (2026-05-01): "Recurring" pill — visible
                      // confirmation that this row is in the recurring
                      // set, mirrors the bills/recurring page styling.
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 inline-flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Recurring
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">
                    {tx.category?.replace(/_/g, ' ')} • {new Date(tx.timestamp).toLocaleDateString()}
                    {tx.currency && tx.currency !== preferredCurrency && (
                      <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">{tx.currency}</span>
                    )}
                  </p>
                  {tx.tags && tx.tags.trim() !== '' && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tx.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
                        <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {(tx.sourceInstitutionName || tx.sourceAccountName) && (
                    <p className="text-xs text-emerald-700 mt-1">
                      {[tx.sourceInstitutionName, tx.sourceAccountName, tx.sourceAccountType].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-bold tabular-nums ${presentation.amountClass}`}>
                  {presentation.sign}{txAmount(tx, fmt)}
                </p>
                {!selectMode && (
                  // Inline actions — always visible on touch (no group-hover
                  // gating), but de-emphasized via opacity until the row is
                  // hovered/focused on desktop. Click stops propagation so
                  // hitting these doesn't ALSO fire the row-level edit.
                  // (Note: the `group` Tailwind class on the row still
                  // points at the row itself, not the date-section
                  // wrapper, because group-hover styles target the
                  // closest ancestor with `class="group"`.)
                  <div className="flex items-center gap-1 sm:opacity-60 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleRecurring(tx); }}
                      aria-label={tx.isRecurring ? `Remove recurring on ${tx.description || tx.category}` : `Mark ${tx.description || tx.category} as recurring`}
                      title={tx.isRecurring ? 'Remove recurring' : 'Mark as recurring'}
                      className={`p-1.5 rounded-md transition-colors ${tx.isRecurring ? 'text-violet-700 bg-violet-50 hover:bg-violet-100' : 'text-muted-foreground hover:text-violet-700 hover:bg-violet-50'}`}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openEdit(tx); }}
                      aria-label={`Edit ${tx.description || tx.category}`}
                      title="Edit"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                      aria-label={`Delete ${tx.description || tx.category}`}
                      title="Delete"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      ) : (
        <EmptyState
          illustration="receipt"
          title="No transactions yet"
          description="Add your first income, expense, or transfer manually — or connect your bank to import the last 90 days automatically."
          actions={[
            { label: '+ Add transaction', onClick: openAdd, primary: true },
            { label: 'Connect bank', href: '/dashboard/import' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { desc: 'Whole Foods Market', cat: 'Groceries', amt: '−$84.31', date: 'Today' },
                { desc: 'Salary — Acme Corp', cat: 'Income', amt: '+$5,400.00', date: 'Apr 25' },
                { desc: 'Sadaqah · Local masjid', cat: 'Sadaqah', amt: '−$50.00', date: 'Apr 24' },
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-700">{t.desc}</p>
                    <p className="text-xs text-gray-400">{t.cat} · {t.date}</p>
                  </div>
                  <span className={t.amt.startsWith('+') ? 'font-semibold text-emerald-600' : 'font-semibold text-gray-700'}>{t.amt}</span>
                </div>
              ))}
            </div>
          }
        />
      )}

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
          <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
        </div>
      )}

      {/* ── Add Transaction modal ─────────────────────────────────────────────
           2026-05-02 (revert): centered pattern; useBodyScrollLock
           handles the page-scroll-behind-modal complaint without any
           structural change. */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{editTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => {
                  const nextType = e.target.value;
                  setForm({
                    ...form,
                    type: nextType,
                    direction: nextType === 'income' ? 'inflow' : nextType === 'expense' ? 'outflow' : 'neutral',
                    category: categoriesForType(nextType).includes(form.category) ? form.category : categoriesForType(nextType)[0],
                  });
                }} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              {form.type === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                  <select value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    <option value="inflow">Transfer In</option>
                    <option value="outflow">Transfer Out</option>
                    <option value="neutral">Internal / Neutral</option>
                  </select>
                </div>
              )}
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {categoriesForType(form.type).map(c => <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>)}
                </select>
              </div>
              {/* Inline form error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                  ⚠️ {formError}
                </div>
              )}
              {/* Amount + Currency (side by side) */}
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input type="number" step="0.01" min="0.01" value={form.amount} onChange={e => { setForm({ ...form, amount: e.target.value }); setFormError(null); }}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 ${formError ? 'border-red-400' : ''}`} placeholder="0.00" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm">
                    {CURRENCIES.map(c => (
                      <option key={c} value={c}>{CURRENCY_SYMBOLS[c] || ''} {c} — {CURRENCY_NAMES[c]}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Groceries" />
              </div>
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" />
              </div>
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Tags (comma-separated, e.g. ramadan, groceries)" />
              </div>
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 resize-none" placeholder="Notes (optional)" />
              </div>
              {/* Mark as recurring (edit mode only — doesn't make sense for
                  a transaction that doesn't exist yet). 2026-05-01: founder
                  asked "where do I mark this as recurring?" — the row-level
                  RefreshCw icon shipped in R44 was non-discoverable. This
                  brings the same toggle into the edit modal where users
                  naturally look for it. */}
              {editTx && (
                <div className="border-t border-gray-200 pt-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(editTx.isRecurring)}
                      onChange={() => handleToggleRecurring(editTx)}
                      className="mt-0.5 w-4 h-4 accent-primary rounded flex-shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        Mark as recurring
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        Adds this to your Recurring view (Bills + subscriptions). Toggle off any time.
                      </span>
                    </span>
                    {Boolean(editTx.isRecurring) && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 flex-shrink-0">
                        Recurring
                      </span>
                    )}
                  </label>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button aria-label="Close add transaction modal" onClick={() => { setShowForm(false); setEditTx(null); setFormError(null); }} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">
                {saving ? 'Saving...' : (editTx ? 'Save Changes' : 'Add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🗑️</span>
              <div className="flex-1">
                <h3 id="modal-title" className="font-bold text-gray-900">Delete transaction?</h3>
                {deleteConfirmation.type === 'single' && (
                  <p className="text-sm text-gray-600 mt-1">This transaction will be permanently deleted and cannot be undone.</p>
                )}
                {deleteConfirmation.type === 'bulk' && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectAllPages
                      ? `This will permanently delete ALL ${totalElements} transaction${totalElements !== 1 ? 's' : ''} across all pages and cannot be undone.`
                      : `This will permanently delete ${deleteConfirmation.count} selected transaction${(deleteConfirmation.count ?? 0) > 1 ? 's' : ''} and cannot be undone.`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                aria-label="Close delete confirmation modal"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirmation.type === 'single' ? confirmDelete : confirmBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {bulkDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
