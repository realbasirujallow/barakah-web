'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { hasPaidSyncAccess } from '../../../lib/subscription';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import EmptyState from '../../../components/EmptyState';
import ModalShell from '../../../components/ui/ModalShell';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n, t as tStandalone } from '../../../lib/i18n';
import { CATEGORIES, categoriesForType, txPresentation } from '../../../lib/transactionPresentation';
import { Pencil, Trash2, RefreshCw, Search, CheckCircle2, Split as SplitIcon, EyeOff, Landmark, Columns3, Briefcase, Paperclip, Download } from 'lucide-react';
import { type ReceiptMeta, isLocked as isLockedReceipt, isAcceptedReceiptType, formatReceiptSize, RECEIPT_MAX_BYTES, RECEIPT_ACCEPT } from '../../../lib/receipts';
import { TransactionUsageMeter } from '../../../components/TransactionUsageMeter';
import { SyncBanksButton } from '../../../components/SyncBanksButton';
import { SkeletonPage } from '../SkeletonCard';
import { trackFeatureUse } from '../../../lib/analytics';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { prettifyDescription } from '../../../lib/prettifyDescription';
import { MerchantLogo } from '../../../components/MerchantLogo';

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
const PAGE_SIZE_OPTIONS = [20, 50, 100];

interface Tx {
  id: number; type: string; category: string; amount: number;
  description: string; currency: string; timestamp: number; originalDate?: number | null;
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
  recurring?: boolean | null;
  /** 2026-06-11 (Monarch parity): serialized in every txn map. Excluded
   *  rows stay visible in the list but are left out of totals, budgets,
   *  and reports. Toggled via PUT /api/transactions/{id} (single) or
   *  PATCH /api/transactions/bulk (multi). */
  excludedFromReports?: boolean | null;
  /** 2026-06-12 (parity W1): optional user-owned asset link. Backend
   *  ownership-gates via resolveOwnedAssetId; mobile has had the picker
   *  since launch. */
  assetId?: number | null;
  /** 2026-06-18 (Side Hustle Phase 1): optional user-owned "Side Hustle"
   *  link. Internal wire field is `businessId` (parallels `assetId`);
   *  user-facing label is always "Side Hustle". Backend ownership-gates
   *  via resolveOwnedBusinessId; sentinel 0 = unlink on update. */
  businessId?: number | null;
  /** 2026-06-18 (Side Hustle Phase 3): ownership-scoped count of receipts
   *  attached to this transaction (countByUserIdAndTransactionId — never
   *  loads any blob). Emitted on every serialized transaction; used as the
   *  "has receipt" row indicator. */
  receiptCount?: number | null;
}

interface SubscriptionStatus {
  plan: 'free' | 'plus' | 'family';
  status: string;
  hasSubscription: boolean;
}

// Friendly amount string for a transaction, respecting its OWN stored currency.
// 2026-06-13 (TXN-ROW-CURRENCY-IGNORED): previously this used the preferred-
// currency `fmt`, so a GBP £50 row rendered as "$50.00" for a USD-preferred
// user — wrong currency, not just wrong rate. Now each row formats with its own
// currency symbol (no FX conversion — we show the native amount honestly). The
// preferred-currency `fmt` is the fast path when the row matches.
export function txAmount(
  tx: Tx,
  fmt: (n: number) => string,
  numberLocale: string | undefined,
  preferredCurrency: string,
): string {
  const ccy = tx.currency || preferredCurrency;
  if (ccy === preferredCurrency) return fmt(tx.amount);
  try {
    return new Intl.NumberFormat(numberLocale, { style: 'currency', currency: ccy }).format(tx.amount);
  } catch {
    return fmt(tx.amount); // unknown currency code → fall back to preferred fmt
  }
}

// Localized display label for a static UI category code. Falls back to a
// title-cased version of the raw code if no translation key exists (e.g.
// for categories surfaced from data that aren't in our static list).
function categoryLabel(code: string): string {
  const key = `txnCat_${code}`;
  const translated = tStandalone(key);
  if (translated !== key) return translated;
  return code.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
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
  // Summary KPIs are server-side aggregates over the full dataset for the
  // period, not the visible page. Without this, the page KPI sums only
  // the 20 currently-rendered rows — which gave Income=$0 for any user
  // whose first page didn't happen to include a payroll row.
  const [summary, setSummary] = useState<{ totalIncome: number; totalExpenses: number; totalTransfers: number; period: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx]     = useState<Tx | null>(null);
  // 2026-05-10 — split transaction state. When non-null, the split modal
  // is open and editing this parent transaction.
  const [splitTx, setSplitTx] = useState<Tx | null>(null);
  // Transactions known to have splits (for the "split" icon on the row).
  // Refreshed alongside the transactions list on every load.
  const [txnIdsWithSplits, setTxnIdsWithSplits] = useState<Set<number>>(new Set());
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

  // ── Feature 1: SHIFT+CLICK RANGE SELECT ──────────────────────────────────
  // Tracks the flat index (in the rendered monthFilteredTxs order) of the
  // last row the user clicked in bulk-select mode, so shift-click can fill
  // the contiguous range between last click and current click.
  const lastClickedIndexRef = useRef<number | null>(null);

  // ── Feature 2: CUSTOM COLUMN VISIBILITY ──────────────────────────────────
  const COL_VIS_KEY = 'barakah_txn_columns';
  const defaultColVis = { category: true, account: true, owner: true };
  const [colVis, setColVis] = useState<{ category: boolean; account: boolean; owner: boolean }>(() => {
    if (typeof window === 'undefined') return defaultColVis;
    try {
      const stored = localStorage.getItem(COL_VIS_KEY);
      if (stored) return { ...defaultColVis, ...JSON.parse(stored) };
    } catch { /* ignore corrupt storage */ }
    return defaultColVis;
  });
  const [colMenuOpen, setColMenuOpen] = useState(false);

  const toggleCol = useCallback((col: keyof typeof defaultColVis) => {
    setColVis(prev => {
      const next = { ...prev, [col]: !prev[col] };
      try { localStorage.setItem(COL_VIS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // ── Feature 3: RIGHT-CLICK QUICK-TAG ─────────────────────────────────────
  // When non-null, the quick-tag popover is open for this transaction.
  const [quickTag, setQuickTag] = useState<{ tx: Tx; x: number; y: number } | null>(null);
  const [quickTagInput, setQuickTagInput] = useState('');
  const [quickTagSaving, setQuickTagSaving] = useState(false);
  const quickTagRef = useRef<HTMLDivElement>(null);

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
  // 2026-06-11 (Monarch parity): exclude-from-reports spinners — one for
  // the bulk-bar action, one for the edit-modal checkbox.
  const [bulkExcluding, setBulkExcluding] = useState(false);
  const [togglingExcluded, setTogglingExcluded] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [reviewCount, setReviewCount] = useState(0);

  const { currency: preferredCurrency, fmt, locale: dateLocale } = useCurrency();

  // Local-date YYYY-MM-DD so the picker pre-fills "today" in the user's zone,
  // not UTC. Previously toISOString() gave UTC, which from US Eastern after
  // 8pm rolled the date forward — a 5/15 transaction was filed as 5/16.
  const localToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  // #6 (2026-06-04): local-calendar YYYY-MM-DD for an existing timestamp, so the
  // edit modal, the list grouping, and the month filter all agree with the date
  // shown on the row. toISOString() returned UTC, which from US Eastern after
  // ~8pm rolled a transaction forward a day (off-by-one between list + edit).
  // Standard convention = the user's local date.
  const localDateKey = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [form, setForm] = useState({
    type: 'expense', direction: 'outflow', category: 'food', amount: '', description: '', currency: 'USD',
    date: localToday(),
    tags: '', notes: '',
    // 2026-06-08: explicit recurring frequency picker (founder report:
    // "when marking or editing a transaction for recurring, i don't see
    // option to mark it biweekly"). Backend already supports
    // daily/weekly/biweekly/monthly/yearly per VALID_FREQUENCIES;
    // mobile already exposes the picker; web modal was the gap. Default
    // 'monthly' mirrors backend toggleRecurring fallback.
    frequency: 'monthly',
    // 2026-06-12 (parity W1/W3): optional asset link (select value as
    // string, '' = none) and recurring-on-create (edit mode keeps the
    // immediate-save toggle instead).
    assetId: '',
    // 2026-06-18 (Side Hustle Phase 1): optional "Side Hustle" link (select
    // value as string, '' = none). Wire field is `businessId`.
    businessId: '',
    recurring: false,
  });
  // parity W1: user's assets for the link-to-asset picker + row chips.
  const [assetOptions, setAssetOptions] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    // suppressUnauthorized default — mount-fired background call must not
    // bounce the session (see backgroundPollsDoNotLogout.test). size=200 so a
    // user with >50 assets can still link any of them (the list endpoint
    // defaults to 50; backend clamps to 200).
    api.getAssets(true, 200)
      .then((res: { assets?: { id: number; name: string }[] } | { id: number; name: string }[]) => {
        const list = Array.isArray(res) ? res : (res.assets ?? []);
        setAssetOptions(list.map(a => ({ id: a.id, name: a.name })));
      })
      .catch(() => setAssetOptions([]));
  }, []);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync form currency with user's preferred currency on first load
  useEffect(() => {
    if (preferredCurrency) setForm(f => ({ ...f, currency: preferredCurrency }));
  }, [preferredCurrency]);

  const { toast } = useToast();
  const { user } = useAuth();
  const { t, tFmt } = useI18n();

  // 2026-06-18 (Side Hustle Phase 1): the picker + bulk "Attribute to" + row
  // chip are Family-only. Gate the WHOLE surface client-side so non-Family
  // users never see it (don't render-then-403). The backend also returns a
  // {locked} payload for non-Family reads — guarded below — but computing
  // access up front means we never even fire the list call for free/Plus users.
  const hasSideHustleAccess = !!user && hasAccess(user.plan, 'family', user.planExpiresAt, user.isAdmin);
  const [sideHustleOptions, setSideHustleOptions] = useState<{ id: number; name: string }[]>([]);
  const [bulkSideHustleMenuOpen, setBulkSideHustleMenuOpen] = useState(false);
  const [bulkAttributing, setBulkAttributing] = useState(false);
  useEffect(() => {
    if (!hasSideHustleAccess) { setSideHustleOptions([]); return; }
    // suppressUnauthorized default (true) — mount-fired background read must
    // not bounce the session, same convention as getAssets above.
    api.getSideHustles()
      .then((res: { sideHustles?: { id: number; name: string }[]; locked?: boolean }) => {
        if (res?.locked) { setSideHustleOptions([]); return; }
        setSideHustleOptions((res?.sideHustles ?? []).map(h => ({ id: h.id, name: h.name })));
      })
      .catch(() => setSideHustleOptions([]));
  }, [hasSideHustleAccess]);

  // ── 2026-06-18 (Side Hustle Phase 3): transaction receipts ───────────────
  // Receipts (photo/PDF proof for tax) are Family-only, same gate as the
  // side-hustle picker above. The list/upload/delete UI lives inside the
  // edit modal (only meaningful for an existing transaction). Loaded lazily
  // when the modal opens for a Family user; the row indicator uses the
  // receiptCount already on the txn payload (no extra fetch).
  const [receipts, setReceipts] = useState<ReceiptMeta[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [deletingReceiptId, setDeletingReceiptId] = useState<number | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const loadReceipts = useCallback((txId: number) => {
    setReceiptsLoading(true);
    // suppressUnauthorized default (true) — the modal-open read must not
    // bounce the session, same convention as the other reads. A {locked}
    // payload (non-Family) just yields an empty list.
    api.listTransactionReceipts(txId)
      .then((res: unknown) => {
        if (isLockedReceipt(res)) { setReceipts([]); return; }
        const r = res as { receipts?: ReceiptMeta[] } | null;
        setReceipts(Array.isArray(r?.receipts) ? r!.receipts : []);
      })
      .catch(() => setReceipts([]))
      .finally(() => setReceiptsLoading(false));
  }, []);

  // Load receipts whenever the edit modal opens on a transaction (Family
  // users only — non-Family never see the section, and we skip the call so
  // free/Plus users don't even fire the read).
  useEffect(() => {
    if (editTx && hasSideHustleAccess) {
      loadReceipts(editTx.id);
    } else {
      setReceipts([]);
    }
  }, [editTx, hasSideHustleAccess, loadReceipts]);

  // Keep the txn list's receiptCount in sync after an upload/delete so the
  // row paperclip updates without a full reload.
  const bumpReceiptCount = useCallback((txId: number, delta: number) => {
    setTxs(prev => prev.map(tx =>
      tx.id === txId
        ? { ...tx, receiptCount: Math.max(0, (tx.receiptCount ?? 0) + delta) }
        : tx,
    ));
    setEditTx(prev => prev && prev.id === txId
      ? { ...prev, receiptCount: Math.max(0, (prev.receiptCount ?? 0) + delta) }
      : prev);
  }, []);

  const handleReceiptUpload = async (txId: number, file: File) => {
    // Client-side fast-fail (the backend re-checks both): wrong type or
    // oversize → instant localized error, no round-trip.
    if (!isAcceptedReceiptType(file.type)) {
      toast(t('receiptsErrorType'), 'error');
      return;
    }
    if (file.size > RECEIPT_MAX_BYTES) {
      toast(t('receiptsErrorTooLarge'), 'error');
      return;
    }
    if (file.size === 0) {
      toast(t('receiptsErrorEmpty'), 'error');
      return;
    }
    setReceiptUploading(true);
    try {
      const res = await api.uploadTransactionReceipt(txId, file);
      const created = (res as { receipt?: ReceiptMeta } | null)?.receipt;
      if (created) {
        // Prepend (list is createdAt DESC) for instant feedback, then bump
        // the row indicator.
        setReceipts(prev => [created, ...prev]);
        bumpReceiptCount(txId, 1);
      } else {
        // Defensive: re-fetch if the response shape was unexpected.
        loadReceipts(txId);
      }
      toast(t('receiptsUploaded'), 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : t('receiptsUploadFailed'), 'error');
    } finally {
      setReceiptUploading(false);
    }
  };

  const handleReceiptDownload = async (txId: number, receipt: ReceiptMeta) => {
    try {
      await api.downloadTransactionReceipt(txId, receipt.id, receipt.filename);
    } catch (err) {
      toast(err instanceof Error ? err.message : t('receiptsDownloadFailed'), 'error');
    }
  };

  const handleReceiptDelete = async (txId: number, receiptId: number) => {
    setDeletingReceiptId(receiptId);
    try {
      await api.deleteTransactionReceipt(txId, receiptId);
      setReceipts(prev => prev.filter(r => r.id !== receiptId));
      bumpReceiptCount(txId, -1);
      toast(t('receiptsDeleted'), 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : t('receiptsDeleteFailed'), 'error');
    } finally {
      setDeletingReceiptId(null);
    }
  };

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

  // 2026-06-08 (founder report: page froze 2× while making changes):
  // every load() used to fire 4 parallel API calls (transactions +
  // subscription + review queue + summary), every time, with no
  // cancellation. Each filter switch, page change, or save triggered
  // a fresh quartet. Under rapid clicking (e.g. cycling filters or
  // hitting Save repeatedly), 6-8 loads pile up = 24-32 in-flight
  // requests; Chrome caps 6 concurrent per origin, so the rest queue
  // and the page LOOKS frozen. Also, older responses could overwrite
  // newer ones with stale data — making the freeze "stick" because
  // the UI never converged on the right list.
  //
  // Fix: (a) only fetch the heavy non-transaction stuff when its
  // inputs change — subscription only on mount, summary on filter
  // change, review queue tied to filter switches; (b) AbortController
  // cancels the previous in-flight transactions fetch when a new
  // load() starts; (c) a generation counter guarantees only the
  // newest fetch's setState actually lands.
  const loadGenRef = useRef(0);
  const subscriptionFetchedRef = useRef(false);

  const load = () => {
    setLoading(true);
    setError(null);

    // Bump the generation so any older still-in-flight fetch's
    // setState is dropped when it eventually resolves. Cheaper than
    // wiring AbortController through every api.* helper (those don't
    // accept signal today) and equally effective for the freeze
    // symptom — the user only cares that the NEWEST data lands.
    const myGen = ++loadGenRef.current;

    const txPromise = filter === 'needs_review'
      ? api.getReviewQueue(page, pageSize)
      : api.getTransactions(filter === 'all' ? undefined : filter, page, pageSize, searchDebounce || undefined);
    // Only fetch subscription once per session. Free + plus state
    // rarely flips inside a single transactions session; the rare
    // upgrade reloads the dashboard anyway.
    const subPromise = subscriptionFetchedRef.current
      ? Promise.resolve(null)
      : api.subscriptionStatus().then((r) => { subscriptionFetchedRef.current = true; return r; });
    // 2026-06-08 (STALE-SUMMARY-WEB-TXN-1, robustness sweep): the
    // filter-cached summary made hero KPI cards (Income / Expenses /
    // Transfers / Net) stay STALE after save / edit / delete because
    // `filter` didn't change between mutation and the load() that
    // followed it. The whole reason summary is server-aggregated is
    // that the visible page may not include all month rows; caching
    // it across mutations defeats that. Drop the cache — every
    // load() refreshes summary. Review-queue count too.
    const summaryPromise = api.getTransactionSummary('month');
    const reviewPromise = api.getReviewQueue(0, 1);

    Promise.allSettled([
      txPromise,
      subPromise,
      reviewPromise,
      summaryPromise,
    ])
      .then(results => {
        // Drop results from superseded fetches — a slower previous
        // load() must not overwrite the newest data with stale rows.
        if (myGen !== loadGenRef.current) return;
        const transactionsResult = results[0].status === 'fulfilled' ? results[0].value : null;
        const subscriptionResult = results[1].status === 'fulfilled' ? results[1].value : null;
        const reviewResult = results[2].status === 'fulfilled' ? results[2].value : null;
        const summaryResult = results[3].status === 'fulfilled' ? results[3].value : null;
        if (summaryResult && typeof summaryResult === 'object' && 'totalIncome' in summaryResult) {
          setSummary(summaryResult as { totalIncome: number; totalExpenses: number; totalTransfers: number; period: string });
        }
        if (subscriptionResult) {
          setSubscriptionStatus(subscriptionResult as SubscriptionStatus);
        }
        if (reviewResult?.totalElements != null) {
          setReviewCount(reviewResult.totalElements);
        }
        if (transactionsResult?.error) {
          toast(transactionsResult.error, 'error');
          setError(transactionsResult.error);
          return;
        }
        const txList: Tx[] = Array.isArray(transactionsResult?.transactions)
          ? transactionsResult.transactions
          : [];
        setTxs(txList);
        setTotalPages(transactionsResult?.totalPages || 0);
        setTotalElements(transactionsResult?.totalElements || 0);
        // 2026-05-10 — batch-fetch which transactions have splits so the
        // row icon renders amber. Best-effort: on failure, just clear the
        // set; the icon falls back to "no splits" appearance.
        const ids = txList.map(t => t.id).filter(Boolean);
        if (ids.length > 0) {
          api.getTransactionSplitsSummary(ids)
            .then((r: { idsWithSplits?: number[]; error?: string }) => {
              if (r?.error) return;
              setTxnIdsWithSplits(new Set(r.idsWithSplits ?? []));
            })
            .catch(() => setTxnIdsWithSplits(new Set()));
        } else {
          setTxnIdsWithSplits(new Set());
        }
      })
      .catch(() => {
        toast(t('txnLoadFailed'), 'error');
        setError(t('txnLoadFailedRetry'));
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

  // ── Feature 3: close quick-tag popover on outside click / Escape ─────────
  useEffect(() => {
    if (!quickTag) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setQuickTag(null); setQuickTagInput(''); } };
    const handleClick = (e: MouseEvent) => {
      if (quickTagRef.current && !quickTagRef.current.contains(e.target as Node)) {
        setQuickTag(null);
        setQuickTagInput('');
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [quickTag]);

  const handleQuickTagSave = async () => {
    if (!quickTag || !quickTagInput.trim()) return;
    const tx = quickTag.tx;
    const newTag = quickTagInput.trim();
    // Merge with existing tags (comma-separated). Deduplicate.
    const existingTags = (tx.tags || '').split(',').map(s => s.trim()).filter(Boolean);
    if (existingTags.includes(newTag)) { setQuickTag(null); setQuickTagInput(''); return; }
    const merged = [...existingTags, newTag].join(', ');
    setQuickTagSaving(true);
    try {
      // User-triggered → no suppressUnauthorized needed.
      await api.updateTransaction(tx.id, { tags: merged });
      // Optimistically update the local list so the tag chip appears immediately.
      setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, tags: merged } : t));
      toast(t('txnQuickTagSaved'), 'success');
      setQuickTag(null);
      setQuickTagInput('');
    } catch {
      toast(t('txnQuickTagFailed'), 'error');
    } finally {
      setQuickTagSaving(false);
    }
  };

  const openAdd = () => {
    setEditTx(null);
    setForm({ type: 'expense', direction: 'outflow', category: 'food', amount: '', description: '', currency: preferredCurrency || 'USD', date: localToday(), tags: '', notes: '', frequency: 'monthly', assetId: '', businessId: '', recurring: false });
    // BUG FIX: clear any stale validation error from a previous (failed) save
    // so it does not immediately show when the modal opens on a fresh attempt.
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (tx: Tx) => {
    setEditTx(tx);
    const txDate = localDateKey(tx.timestamp);
    setForm({ type: tx.type, direction: tx.direction || (tx.type === 'income' ? 'inflow' : tx.type === 'transfer' ? 'neutral' : 'outflow'), category: tx.category, amount: String(tx.amount), description: tx.description, currency: tx.currency || preferredCurrency || 'USD', date: txDate, tags: tx.tags || '', notes: tx.notes || '', frequency: (tx as Tx & { frequency?: string }).frequency || 'monthly', assetId: tx.assetId ? String(tx.assetId) : '', businessId: tx.businessId ? String(tx.businessId) : '', recurring: false });
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
        const msg = t('txnAmountGtZero');
        setFormError(msg);
        toast(msg, 'error');
        setSaving(false);
        return;
      }
      if (amt > 100_000_000) {
        // 2026-05-08 (Bug G + L cascade): client-side cap was hardcoded
        // at $100,000, which (a) doesn't match the backend's new
        // 100,000,000 native ceiling, and (b) hardcoded "$" in the error
        // text bled the dollar sign into a non-USD user's UI. The
        // backend's USD-equivalent sanity layer ($1M USD-equiv) is the
        // primary defense for fat-finger typos.
        const msg = t('txnAmountMax');
        setFormError(msg);
        toast(msg, 'error');
        setSaving(false);
        return;
      }
      // #6: epoch millis at LOCAL noon, so the stored instant's local calendar
      // day equals exactly the date the user picked (matches localDateKey on
      // read). Noon avoids any DST edge. Was 'T12:00:00Z' (UTC) which could land
      // a chosen date on the previous/next local day.
      const timestamp = form.date ? new Date(form.date + 'T12:00:00').getTime() : Date.now();
      // Round 30: strip `date` before send. The DTO expects a numeric
      // `timestamp` (Long); sending the raw ISO-date string caused
      // Jackson to fail "invalid request body" when the user edited a
      // Zelle / transfer transaction. Prior to this we spread the whole
      // form which included both `date: "YYYY-MM-DD"` and `timestamp: Long`.
      const { date: _date, assetId: formAssetId, businessId: formBusinessId, recurring: formRecurring, ...formWithoutDate } = form;
      void _date;
      const payload: Record<string, unknown> = { ...formWithoutDate, amount: amt, timestamp };
      // parity W1: asset link. A chosen id links/changes. '' = "No asset":
      // on CREATE we just omit it; on EDIT of a txn that already had a link we
      // must send the unlink sentinel (0), because the backend treats an absent
      // assetId as "no change" — so omitting it would leave the old link stuck.
      if (formAssetId) payload.assetId = Number(formAssetId);
      else if (editTx?.assetId != null) payload.assetId = 0;
      // 2026-06-18 (Side Hustle Phase 1): identical sentinel convention for the
      // `businessId` link. A chosen id links/changes; '' = "No side hustle" —
      // on CREATE we omit it, on EDIT of a txn that already had a link we send
      // the unlink sentinel (0). Only wire it for Family users with the picker
      // visible so a non-Family edit never sends a stray businessId.
      if (hasSideHustleAccess) {
        if (formBusinessId) payload.businessId = Number(formBusinessId);
        else if (editTx?.businessId != null) payload.businessId = 0;
      }
      // parity W3: recurring-on-create. Edit mode keeps the immediate-save
      // checkbox (handleToggleRecurring), so only the create path sends it.
      if (!editTx && formRecurring) payload.recurring = true;
      if (editTx) {
        await api.updateTransaction(editTx.id, payload);
        toast(t('txnUpdated'), 'success');
      } else {
        await api.addTransaction(payload);
        toast(t('txnAdded'), 'success');
      }
      setShowForm(false);
      setEditTx(null);
      setForm({ type: 'expense', direction: 'outflow', category: 'food', amount: '', description: '', currency: preferredCurrency || 'USD', date: localToday(), tags: '', notes: '', frequency: 'monthly', assetId: '', businessId: '', recurring: false });
      load();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (editTx ? t('txnUpdateFailed') : t('txnAddFailed'));
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
    const next = !tx.recurring;
    setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, recurring: next } : t));
    // 2026-05-01: also update editTx so the modal's checkbox flips
    // immediately when toggled from inside the modal. Without this,
    // editTx is a snapshot from openEdit() and stays stale after toggle.
    setEditTx(prev => prev && prev.id === tx.id ? { ...prev, recurring: next } : prev);
    try {
      await api.toggleRecurring(tx.id);
      toast(next ? t('txnMarkedRecurring') : t('txnRecurringRemoved'), 'success');
    } catch {
      // Revert optimistic update on both states.
      setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, recurring: !next } : t));
      setEditTx(prev => prev && prev.id === tx.id ? { ...prev, recurring: !next } : prev);
      toast(t('txnRecurringUpdateFailed'), 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation || deleteConfirmation.type !== 'single' || deleteConfirmation.id === undefined) return;
    const id = deleteConfirmation.id;
    setDeleteConfirmation(null);
    try {
      await api.deleteTransaction(id);
      setTxs(prev => prev.filter(t => t.id !== id));
      toast(t('txnDeleted'), 'success');
      load();
    } catch {
      toast(t('txnDeleteFailed'), 'error');
    }
  };

  const toggleSelect = (id: number, rowIndex?: number, shiftHeld?: boolean) => {
    setSelectAllPages(false);
    // ── Feature 1: SHIFT+CLICK RANGE SELECT ────────────────────────────────
    // When shift is held and we have a previous click anchor, select/deselect
    // the entire contiguous range between the two indices. The resulting
    // selection state (select or deselect) mirrors what the anchor row did:
    // if the anchor was a SELECT, range rows are added; if DESELECT, removed.
    if (shiftHeld && rowIndex != null && lastClickedIndexRef.current != null) {
      const lo = Math.min(lastClickedIndexRef.current, rowIndex);
      const hi = Math.max(lastClickedIndexRef.current, rowIndex);
      // Determine intent from the anchor row: if anchor is currently selected
      // the range should be selected; if deselected, range should be deselected.
      // We read the anchor's state BEFORE mutating (selectedIds is closed over).
      const anchorId = flatTxListRef.current[lastClickedIndexRef.current];
      const selecting = anchorId != null ? !selectedIds.has(anchorId) : true;
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (let i = lo; i <= hi; i++) {
          const rangeId = flatTxListRef.current[i];
          if (rangeId == null) continue;
          if (selecting) next.add(rangeId); else next.delete(rangeId);
        }
        return next;
      });
      lastClickedIndexRef.current = rowIndex;
      return;
    }
    if (rowIndex != null) lastClickedIndexRef.current = rowIndex;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Flat ordered list of transaction ids in render order, kept in sync with
  // the current page's filtered+grouped rows. Required by range-select so
  // we can map an index back to an id when computing the shift-click range.
  const flatTxListRef = useRef<number[]>([]);

  // Feature 1 (shift-click range select): keep the flat id list in sync with
  // the rendered rows. Written in an effect — never during render — because
  // mutating a ref mid-render is unsafe under concurrent rendering
  // (react-hooks/refs). txs + urlMonth are the real inputs; localDateKey is a
  // stable pure formatter, so it's intentionally not a dependency.
  useEffect(() => {
    flatTxListRef.current = (urlMonth
      ? txs.filter(t => localDateKey(t.timestamp).startsWith(urlMonth))
      : txs
    ).map(t => t.id);
  }, [txs, urlMonth]);

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
    lastClickedIndexRef.current = null;
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
    const noun = count === 1 ? t('txnNounSingular') : t('txnNounPlural');
    setDeleteConfirmation(null);
    setBulkDeleting(true);
    try {
      if (selectAllPages) {
        const typeParam = filter === 'all' ? undefined : filter;
        const result = await api.deleteAllTransactions(typeParam);
        toast(tFmt('txnDeletedCountFmt', [result?.deleted ?? count, noun]), 'success');
      } else {
        const result = await api.bulkDeleteTransactions(Array.from(selectedIds));
        toast(tFmt('txnDeletedCountFmt', [result?.deleted ?? count, noun]), 'success');
      }
      exitSelectMode();
      setPage(0);
      load();
    } catch {
      toast(t('txnDeleteBulkFailed'), 'error');
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
      const noun = updated === 1 ? t('txnNounSingular') : t('txnNounPlural');
      toast(tFmt('txnRecategorizedFmt', [updated, noun, categoryLabel(category)]), 'success');
      exitSelectMode();
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('txnRecategorizeFailed'), 'error');
    } finally {
      setBulkCategorizing(false);
    }
  };

  /**
   * 2026-05-10 founder report fix: confirm "auto-tag is correct" without
   * forcing a category overwrite. Per-row variant (single id) + bulk-bar
   * variant (selected ids). Uses the new POST /api/transactions/mark-reviewed
   * endpoint.
   */
  const handleMarkReviewed = async (ids: number[]) => {
    if (ids.length === 0) return;
    setBulkCategorizing(true);
    try {
      const result = await api.markReviewed(ids);
      const updated = (result as { updated?: number })?.updated ?? ids.length;
      const noun = updated === 1 ? t('txnNounSingular') : t('txnNounPlural');
      toast(tFmt('txnMarkedReviewedFmt', [updated, noun]), 'success');
      if (selectMode) exitSelectMode();
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('txnMarkReviewedFailed'), 'error');
    } finally {
      setBulkCategorizing(false);
    }
  };

  /**
   * 2026-06-11 (Monarch parity): single-transaction "Exclude from reports"
   * toggle. Optimistically flips the local row + the open edit-modal
   * snapshot (same pattern as handleToggleRecurring), then reloads so the
   * server-side summary KPIs drop/regain the row — unlike recurring, this
   * flag changes totals.
   */
  const handleToggleExcluded = async (tx: Tx) => {
    const next = !tx.excludedFromReports;
    setTogglingExcluded(true);
    setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, excludedFromReports: next } : t));
    setEditTx(prev => prev && prev.id === tx.id ? { ...prev, excludedFromReports: next } : prev);
    try {
      await api.updateTransaction(tx.id, { excludedFromReports: next });
      const noun = t('txnNounSingular');
      toast(tFmt(next ? 'txnExcludedToastFmt' : 'txnIncludedToastFmt', [1, noun]), 'success');
      load();
    } catch {
      // Revert optimistic update on both states.
      setTxs(prev => prev.map(t => t.id === tx.id ? { ...t, excludedFromReports: !next } : t));
      setEditTx(prev => prev && prev.id === tx.id ? { ...prev, excludedFromReports: !next } : prev);
      toast(t('txnExcludeFailed'), 'error');
    } finally {
      setTogglingExcluded(false);
    }
  };

  /**
   * 2026-06-11 (Monarch parity): bulk exclude/include from reports.
   * selectAllPages mode is not supported — the PATCH /api/transactions/bulk
   * endpoint takes an explicit ids[] payload, same constraint as
   * bulk-categorize / mark-reviewed above, and the UI hides the button
   * when "Select all pages" is on.
   */
  const handleBulkExclude = async (exclude: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkExcluding(true);
    try {
      const result = await api.bulkUpdateTransactions(ids, { excludedFromReports: exclude });
      const updated = (result as { updated?: number })?.updated ?? ids.length;
      const noun = updated === 1 ? t('txnNounSingular') : t('txnNounPlural');
      toast(tFmt(exclude ? 'txnExcludedToastFmt' : 'txnIncludedToastFmt', [updated, noun]), 'success');
      exitSelectMode();
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('txnExcludeFailed'), 'error');
    } finally {
      setBulkExcluding(false);
    }
  };

  /**
   * 2026-06-18 (Side Hustle Phase 1): bulk "Attribute to Side Hustle". Clones
   * the bulk-recategorize / bulk-exclude pattern — explicit ids[] via PATCH
   * /api/transactions/bulk with a `businessId` delta. `businessId: 0` is the
   * unlink sentinel ("Not attributed"); any other id is ownership-gated server-
   * side (foreign/non-existent id → 400). Hidden when selectAllPages is on
   * (same ids[]-only constraint as the sibling bulk actions) and Family-only.
   */
  const handleBulkAttribute = async (businessId: number) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkSideHustleMenuOpen(false);
    setBulkAttributing(true);
    try {
      const result = await api.bulkUpdateTransactions(ids, { businessId });
      const updated = (result as { updated?: number })?.updated ?? ids.length;
      const noun = updated === 1 ? t('txnNounSingular') : t('txnNounPlural');
      const linked = sideHustleOptions.find(h => h.id === businessId);
      toast(
        businessId === 0
          ? tFmt('sideHustlesBulkUnattributedFmt', [updated, noun])
          : tFmt('sideHustlesBulkAttributedFmt', [updated, noun, linked?.name ?? '']),
        'success',
      );
      exitSelectMode();
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('sideHustlesBulkAttributeFailed'), 'error');
    } finally {
      setBulkAttributing(false);
    }
  };

  const handleExportCsv = async () => {
    setExportingCsv(true); setExportError(null);
    // trackFeatureUse fires on every click (not scoped to first-use) so
    // paid-acquisition dashboards can read repeat-use as an engagement
    // signal. Backend also emits metrics.recordExport('csv').
    try { trackFeatureUse('export_transactions_csv'); } catch { /* GA4 unavailable */ }
    try { await api.downloadTransactionsCsv(); }
    catch (err) { logError(err, { context: 'transactions.exportCsv' }); toast(t('txnCsvFailed'), 'error'); setExportError(t('txnCsvFailedRetry')); }
    setExportingCsv(false);
  };

  const handleExportPdf = async () => {
    setExportingPdf(true); setExportError(null);
    try { trackFeatureUse('export_transactions_pdf'); } catch { /* GA4 unavailable */ }
    try { await api.downloadTransactionsPdf(); }
    catch (err) { logError(err, { context: 'transactions.exportPdf' }); toast(t('txnPdfFailed'), 'error'); setExportError(t('txnPdfFailedRetry')); }
    setExportingPdf(false);
  };

  // ── Skeleton loading ──────────────────────────────────────────────────────
  if (loading) return <SkeletonPage summaryCount={3} listCount={6} />;

  if (error) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">⚠️</p>
      <p className="text-red-600 font-medium mb-4">{error}</p>
      <button onClick={load} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium">
        {t('txnRetry')}
      </button>
    </div>
  );

  // Only sum transactions whose currency matches the user's preferred display
  // currency. Mixing USD + GBP amounts in a single total is misleading because
  // each transaction stores its amount in its own currency; we can't add them
  // without FX conversion. Show a note if other-currency transactions exist.
  const sameCurrencyTxns = txs.filter(t => (t.currency || 'USD') === (preferredCurrency || 'USD'));
  const mixedCurrencyCount = txs.length - sameCurrencyTxns.length;
  // Use server-side summary aggregates (whole month) when available;
  // fall back to current-page sums only if the summary fetch failed.
  const income  = summary?.totalIncome    ?? sameCurrencyTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = summary?.totalExpenses  ?? sameCurrencyTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const transfers = summary?.totalTransfers ?? sameCurrencyTxns.filter(t => t.type === 'transfer').reduce((s, t) => s + t.amount, 0);
  const allPageSelected = txs.length > 0 && selectedIds.size === txs.length;
  // 2026-06-11 (Monarch parity): the bulk exclude button flips to "Include
  // in reports" when every selected row is already excluded.
  const selectedTxs = txs.filter(tx => selectedIds.has(tx.id));
  const allSelectedExcluded = selectedTxs.length > 0 && selectedTxs.every(tx => Boolean(tx.excludedFromReports));
  const hasMorePages = totalPages > 1;
  const hasLinkedPlaidTransactions = txs.some(tx => tx.importSource === 'plaid');
  const plaidSyncAccess = hasPaidSyncAccess(subscriptionStatus) || (user?.plan === 'plus' || user?.plan === 'family');

  return (
    <div>
      <PageHeader
        title={t('txTitle')}
        subtitle={t('txSubtitle')}
        actions={
          <>
            <SyncBanksButton onSynced={load} label={t('txnSyncBanks')} />
            <button onClick={handleExportCsv} disabled={exportingCsv}
              className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium disabled:opacity-50 flex items-center gap-1">
              {exportingCsv ? <span className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full inline-block" /> : '📥'} {t('txnExportCsv')}
            </button>
            <button onClick={handleExportPdf} disabled={exportingPdf}
              className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium disabled:opacity-50 flex items-center gap-1">
              {exportingPdf ? <span className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full inline-block" /> : '📄'} {t('txnExportPdf')}
            </button>
            {txs.length > 0 && (
              selectMode
                ? <button onClick={exitSelectMode} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">{t('txnCancel')}</button>
                : <button onClick={() => setSelectMode(true)} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">{t('txnSelect')}</button>
            )}
            <button onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('txnAdd')}</button>
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
              ? (plaidSyncAccess ? t('txnBannerKeepAlive') : t('txnBannerSyncPaused'))
              : t('txnBannerConnect')}
          </p>
          <p className={`text-sm mt-1 ${plaidSyncAccess ? 'text-gray-600' : 'text-amber-800'}`}>
            {hasLinkedPlaidTransactions
              ? (plaidSyncAccess
                ? t('txnBannerResync')
                : t('txnBannerUpgradeBody'))
              : (plaidSyncAccess
                ? t('txnBannerLiveLedger')
                : t('txnBannerPlaidPaid'))}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/import"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              plaidSyncAccess ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {hasLinkedPlaidTransactions ? t('txnManageLinked') : t('txnConnectAccounts')}
          </Link>
          {!plaidSyncAccess && (
            <Link
              href="/dashboard/billing"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              {t('txnUpgradeToSync')}
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
          <p className="text-green-200 text-[10px] uppercase tracking-wide font-semibold">{t('txnKpiIncome')}</p>
          <p className="text-xl font-bold mt-1">{fmt(income)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-400 rounded-xl p-4 text-white shadow-sm">
          <p className="text-red-200 text-[10px] uppercase tracking-wide font-semibold">{t('txnKpiExpenses')}</p>
          <p className="text-xl font-bold mt-1">{fmt(expense)}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-xl p-4 text-white shadow-sm">
          <p className="text-cyan-100 text-[10px] uppercase tracking-wide font-semibold">{t('txnKpiTransfers')}</p>
          <p className="text-xl font-bold mt-1">{fmt(transfers)}</p>
        </div>
        <div className={`rounded-xl p-4 text-white shadow-sm bg-gradient-to-br ${income - expense >= 0 ? 'from-teal-600 to-cyan-500' : 'from-orange-600 to-amber-500'}`}>
          <p className="opacity-80 text-[10px] uppercase tracking-wide font-semibold">{t('txnKpiNet')}</p>
          <p className="text-xl font-bold mt-1">{fmt(income - expense)}</p>
        </div>
      </div>
      {/* KPI-1 fix: when this-month is empty but the list has prior-month
          rows visible, surface a hint so the four $0 KPIs don't read as
          "broken" to a user mid-month with rich historical data. */}
      {income === 0 && expense === 0 && transfers === 0 && totalElements > 0 && (
        <p className="text-xs text-gray-500 -mt-3 mb-4">
          {tFmt(totalElements === 1 ? 'txnNoActivityMonthSingularFmt' : 'txnNoActivityMonthFmt', [totalElements])}
        </p>
      )}
      {/* 2026-05-08 (Bug B): only surface the mixed-currency note when the
          user genuinely has cross-currency transactions AND meaningful
          activity in their preferred currency. Previously this fired even
          for a fresh non-USD user whose transactions ALL match their
          preferred currency — because the prior summary defaulted to USD
          server-side and the entire ledger looked "mixed" relative to it.
          With AuthContext now syncing user.preferredCurrency to the hook
          on login, the filter at line 523 lines up correctly and this
          message only appears when it's actually true. */}
      {mixedCurrencyCount > 0 && sameCurrencyTxns.length > 0 && (
        <p className="text-xs text-gray-500 mb-4 -mt-2">
          {tFmt('txnMixedCurrencyFmt', [mixedCurrencyCount, mixedCurrencyCount === 1 ? '' : 's'])}
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
            placeholder={t('txnSearchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-shadow shadow-sm"
            aria-label={t('txnSearchAria')}
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
              aria-label={t('txnClearSearch')}
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
                  aria-label={t('txnPrevMonth')}
                  title={t('txnPrevMonthTitle')}
                >
                  ←
                </button>
                <span className="font-bold tabular-nums">{monthLabel}</span>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="p-1 rounded-full hover:bg-emerald-100 text-emerald-800"
                  aria-label={t('txnNextMonth')}
                  title={t('txnNextMonthTitle')}
                >
                  →
                </button>
              </div>
            );
          })()}
          {urlCategory && urlMonth && <span className="text-emerald-400">·</span>}
          {urlCategory && (
            <span className="font-medium">
              {t('txnCategoryLabelFmt').split('{0}')[0]}<span className="font-bold capitalize">{categoryLabel(urlCategory)}</span>{t('txnCategoryLabelFmt').split('{0}')[1] ?? ''}
            </span>
          )}
          <div className="ms-auto flex items-center gap-3">
            {urlCategory && (
              <a
                href={`/dashboard/transactions${urlMonth ? `?month=${urlMonth}` : ''}`}
                className="text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline text-xs"
              >
                {t('txnClearCategory')}
              </a>
            )}
            {urlMonth && (
              <a
                href={`/dashboard/transactions${urlCategory ? `?category=${urlCategory}` : ''}`}
                className="text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline text-xs"
              >
                {t('txnClearMonth')}
              </a>
            )}
            {(urlCategory || urlMonth) && (
              <a
                href="/dashboard/transactions"
                className="text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline text-xs font-medium"
              >
                {t('txnClearAll')}
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Filter + page-size row ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {([['all', 'txnFilterAll'], ['income', 'txnFilterIncome'], ['expense', 'txnFilterExpense'], ['transfer', 'txnFilterTransfer']] as const).map(([f, key]) => (
          <button key={f} onClick={() => { setFilter(f); setPage(0); exitSelectMode(); }}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{t(key)}</button>
        ))}
        <button onClick={() => { setFilter('needs_review'); setPage(0); exitSelectMode(); }}
          className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5 ${filter === 'needs_review' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
          {t('txnFilterNeedsReview')}
          {reviewCount > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${filter === 'needs_review' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'}`}>
              {reviewCount}
            </span>
          )}
        </button>
        {totalElements > 0 && <span className="text-sm text-gray-500">{tFmt('txnTotalCountFmt', [totalElements])}</span>}
        <div className="ms-auto flex items-center gap-1.5">
          {/* ── Feature 2: CUSTOM COLUMN VISIBILITY ──────────────────────── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setColMenuOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={colMenuOpen}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
            >
              <Columns3 className="w-3.5 h-3.5" />
              {t('txnColumnsBtn')}
            </button>
            {colMenuOpen && (
              <>
                <button
                  type="button"
                  aria-hidden="true"
                  tabIndex={-1}
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() => setColMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 z-40 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                >
                  {([
                    ['category', 'txnColCategory'],
                    ['account', 'txnColAccount'],
                    ['owner', 'txnColOwner'],
                  ] as const).map(([col, labelKey]) => (
                    <label
                      key={col}
                      role="menuitemcheckbox"
                      aria-checked={colVis[col]}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={colVis[col]}
                        onChange={() => toggleCol(col)}
                        className="w-3.5 h-3.5 accent-[#1B5E20] rounded"
                      />
                      {t(labelKey)}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="text-xs text-gray-500">{t('txnShow')}</span>
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
              {allPageSelected ? t('txnDeselectPage') : t('txnSelectPage')}
            </label>
            <span className="text-sm text-gray-500">{selectAllPages ? tFmt('txnAllSelectedFmt', [totalElements]) : tFmt('txnNSelectedFmt', [selectedIds.size])}</span>
            {/* 2026-05-03 (Monarch parity): bulk recategorize. The
                walkthrough showed Monarch's "Edit multiple" toolbar
                surfaces a category picker in this position. Hidden when
                "Select all pages" is on because the underlying endpoint
                only accepts an explicit ids[] payload (max 500). */}
            {selectedIds.size > 0 && !selectAllPages && (
              <div className="relative ms-auto">
                <button
                  type="button"
                  onClick={() => setBulkCategoryMenuOpen(o => !o)}
                  disabled={bulkCategorizing}
                  className="bg-[#1B5E20] text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-[#164a18] disabled:opacity-40 flex items-center gap-1.5"
                  aria-haspopup="menu"
                  aria-expanded={bulkCategoryMenuOpen}
                >
                  {bulkCategorizing ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : '🏷️'}
                  {tFmt('txnRecategorizeFmt', [selectedIds.size])}
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
                      onKeyDown={(e) => {
                        const menu = e.currentTarget;
                        const items = Array.from(
                          menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])')
                        );
                        const idx = items.indexOf(document.activeElement as HTMLButtonElement);
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          items[(idx + 1) % items.length]?.focus();
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          items[(idx - 1 + items.length) % items.length]?.focus();
                        } else if (e.key === 'Home') {
                          e.preventDefault();
                          items[0]?.focus();
                        } else if (e.key === 'End') {
                          e.preventDefault();
                          items[items.length - 1]?.focus();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          setBulkCategoryMenuOpen(false);
                        }
                      }}
                    >
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          role="menuitem"
                          onClick={() => handleBulkCategorize(cat)}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {categoryLabel(cat)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* 2026-05-10: Mark-reviewed bulk action.
                Founder report — when clicking Review tab to confirm
                auto-tags, there was no button to say "looks right,
                done". Now: select rows + click this to flip
                reviewStatus to "reviewed" without changing categories.
                Hidden when selectAllPages is on (same reason as
                Recategorize — the underlying endpoint takes explicit
                ids[]). */}
            {selectedIds.size > 0 && !selectAllPages && (
              <button
                type="button"
                onClick={() => handleMarkReviewed(Array.from(selectedIds))}
                disabled={bulkCategorizing}
                className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 flex items-center gap-1.5"
                aria-label={tFmt('txnMarkNReviewedAria', [selectedIds.size])}
              >
                {bulkCategorizing ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : '✓'}
                {tFmt('txnMarkReviewedBtnFmt', [selectedIds.size])}
              </button>
            )}
            {/* 2026-06-11 (Monarch parity): bulk exclude/include from
                reports. Follows the Recategorize / Mark-reviewed pattern —
                hidden when selectAllPages is on because the PATCH bulk
                endpoint takes explicit ids[]. */}
            {selectedIds.size > 0 && !selectAllPages && (
              <button
                type="button"
                onClick={() => handleBulkExclude(!allSelectedExcluded)}
                disabled={bulkExcluding}
                className="bg-slate-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1.5"
              >
                {bulkExcluding ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : <EyeOff className="w-3.5 h-3.5" />}
                {allSelectedExcluded ? tFmt('txnBulkIncludeFmt', [selectedIds.size]) : tFmt('txnBulkExcludeFmt', [selectedIds.size])}
              </button>
            )}
            {/* 2026-06-18 (Side Hustle Phase 1): bulk "Attribute to Side
                Hustle". Family-only (hidden entirely for non-Family — do not
                render-then-403) and only when the user has at least one side
                hustle. Same ids[]-only constraint as the sibling bulk actions,
                so hidden when selectAllPages is on. Clones the Recategorize
                dropdown structure (keyboard-navigable menu). */}
            {hasSideHustleAccess && sideHustleOptions.length > 0 && selectedIds.size > 0 && !selectAllPages && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBulkSideHustleMenuOpen(o => !o)}
                  disabled={bulkAttributing}
                  className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-1.5"
                  aria-haspopup="menu"
                  aria-expanded={bulkSideHustleMenuOpen}
                >
                  {bulkAttributing ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : <Briefcase className="w-3.5 h-3.5" />}
                  {tFmt('sideHustlesBulkAttributeBtnFmt', [selectedIds.size])}
                </button>
                {bulkSideHustleMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setBulkSideHustleMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1 z-40 w-56 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                      onKeyDown={(e) => {
                        const menu = e.currentTarget;
                        const items = Array.from(
                          menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])')
                        );
                        const idx = items.indexOf(document.activeElement as HTMLButtonElement);
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          items[(idx + 1) % items.length]?.focus();
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          items[(idx - 1 + items.length) % items.length]?.focus();
                        } else if (e.key === 'Home') {
                          e.preventDefault();
                          items[0]?.focus();
                        } else if (e.key === 'End') {
                          e.preventDefault();
                          items[items.length - 1]?.focus();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          setBulkSideHustleMenuOpen(false);
                        }
                      }}
                    >
                      {sideHustleOptions.map(h => (
                        <button
                          key={h.id}
                          type="button"
                          role="menuitem"
                          onClick={() => handleBulkAttribute(h.id)}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 truncate"
                        >
                          {h.name}
                        </button>
                      ))}
                      {/* Unlink sentinel (businessId: 0) — "Not attributed". */}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleBulkAttribute(0)}
                        className="w-full text-left px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
                      >
                        {t('sideHustlesBulkUnattribute')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            <button onClick={handleBulkDelete}
              disabled={(selectAllPages ? totalElements : selectedIds.size) === 0 || bulkDeleting}
              className={`${selectedIds.size > 0 && !selectAllPages ? '' : 'ms-auto'} bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5`}>
              {bulkDeleting ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" /> : '🗑️'}
              {selectAllPages ? tFmt('txnDeleteAllFmt', [totalElements]) : selectedIds.size > 0 ? tFmt('txnDeleteNFmt', [selectedIds.size]) : t('txnDelete')}
            </button>
          </div>
          {allPageSelected && hasMorePages && !selectAllPages && (
            <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
              {/* 2026-06-08 (EDGE-PLURAL-TXN-1): pick singular variant
                  when count is exactly 1. */}
              <span>{tFmt(txs.length === 1 ? 'txnAllPageSelectedSingularFmt' : 'txnAllPageSelectedFmt', [txs.length])}</span>
              <button onClick={() => setSelectAllPages(true)} className="font-semibold underline hover:no-underline">
                {tFmt(totalElements === 1 ? 'txnSelectAllSingularFmt' : 'txnSelectAllFmt', [totalElements])}
              </button>
            </div>
          )}
          {selectAllPages && (
            <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
              <span>{tFmt(totalElements === 1 ? 'txnAllSelectedBannerSingularFmt' : 'txnAllSelectedBannerFmt', [totalElements])}</span>
              <button onClick={() => { setSelectAllPages(false); setSelectedIds(new Set(txs.map(t => t.id))); }} className="font-semibold underline hover:no-underline">
                {t('txnSelectOnlyPage')}
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
          {t('txnLoadingList')}
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
              ? txs.filter(t => localDateKey(t.timestamp).startsWith(urlMonth))
              : txs;
          for (const t of monthFilteredTxs) {
            const d = new Date(t.timestamp);
            // #6: bucket by the LOCAL calendar date so the group a row lands in
            // matches the date shown on the row + in the edit modal; render a
            // friendlier locale-formatted label below.
            const key = localDateKey(t.timestamp);
            let g = byKey[key];
            if (!g) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const dCmp = new Date(d);
              dCmp.setHours(0, 0, 0, 0);
              const diffDays = Math.round((today.getTime() - dCmp.getTime()) / 86400000);
              // 2026-05-09 (B-DT-FMT): pass user's locale (en-GB / fr-FR /
              // ar-SA / ur-PK) so en-GB users see "Friday, 31 January 2025"
              // not the US-style "Friday, January 31, 2025". `undefined`
              // would fall back to browser default which on most QA
              // machines is en-US.
              const label = diffDays === 0
                ? tFmt('txnTodayFmt', [d.toLocaleDateString(dateLocale, { month: 'long', day: 'numeric' })])
                : diffDays === 1
                  ? tFmt('txnYesterdayFmt', [d.toLocaleDateString(dateLocale, { month: 'long', day: 'numeric' })])
                  : d.toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric', year: today.getFullYear() === d.getFullYear() ? undefined : 'numeric' });
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

          // Running flat index across all groups; incremented per row.
          let flatRowIndex = -1;

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
                      // Capture current flat index for this row (closure-safe).
                      const rowIdx = ++flatRowIndex;
                      return (
            <div key={tx.id}
              onClick={(e) => {
                if (selectMode) {
                  // Event handler (not render): reading flatTxListRef inside
                  // toggleSelect here is the correct, safe ref-usage pattern.
                  // eslint-disable-next-line react-hooks/refs
                  toggleSelect(tx.id, rowIdx, e.shiftKey);
                } else {
                  openEdit(tx);
                }
              }}
              // ── Feature 3: RIGHT-CLICK QUICK-TAG ───────────────────────
              onContextMenu={(e) => {
                if (selectMode) return; // don't interrupt bulk select
                e.preventDefault();
                setQuickTag({ tx, x: e.clientX, y: e.clientY });
                setQuickTagInput('');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (selectMode) toggleSelect(tx.id, rowIdx, false); else openEdit(tx);
                }
              }}
              aria-label={tFmt('txnRowAria', [tx.description || categoryLabel(tx.category), selectMode ? t('txnRowActionSelect') : t('txnRowActionEdit')])}
              className={`group bg-card rounded-xl p-4 flex justify-between items-center cursor-pointer border border-transparent transition-all hover:border-primary/20 hover:bg-accent/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selectMode && (selectedIds.has(tx.id) || selectAllPages) ? 'ring-2 ring-primary bg-primary/5' : ''} ${tx.excludedFromReports ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                {selectMode && (
                  <input type="checkbox" checked={selectedIds.has(tx.id) || selectAllPages}
                    onChange={(e) => toggleSelect(tx.id, rowIdx, e.nativeEvent instanceof MouseEvent ? (e.nativeEvent as MouseEvent).shiftKey : false)}
                    onClick={e => e.stopPropagation()}
                    aria-label={tFmt('txnSelectRowFmt', [tx.description || categoryLabel(tx.category)])}
                    className="w-4 h-4 accent-[#1B5E20] rounded flex-shrink-0" />
                )}
                {/* 2026-05-06 (founder report): row avatar shows the MERCHANT
                    logo (Amazon, Costco, Starbucks…), NOT the issuing bank
                    (Chase, Wells Fargo). Old keying on sourceInstitutionName
                    made every Chase-card purchase look like a bank
                    transaction. MerchantLogo tries merchant first
                    (tx.merchantName, falling back to a prettified description),
                    then institution as a last resort for bank-to-bank moves
                    (Zelle, internal transfer), then the initial bubble. */}
                {!selectMode && (
                  <MerchantLogo
                    merchantName={tx.merchantName ?? (tx.description ? prettifyDescription(tx.description) : null)}
                    institutionFallback={tx.sourceInstitutionName}
                    category={tx.category}
                    size={32}
                  />
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
                            {/* 2026-06-08 (EDGE-OVERFLOW-TXN-1): truncate
                                long merchant+description so the daily
                                total stays aligned right of the row. */}
                            <span className="font-bold truncate">{tx.merchantName}</span>
                            {tx.description && tx.description !== tx.merchantName
                              ? <span className="font-normal text-gray-500 text-sm ms-1 truncate">— {prettifyDescription(tx.description)}</span>
                              : ''}
                          </>
                        : (prettifyDescription(tx.description) || categoryLabel(tx.category))}
                      {tx.notes && <span className="ms-1 text-sm" title={tx.notes}>📝</span>}
                    </p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${presentation.badgeClass}`}>
                      {presentation.badge}
                    </span>
                    {tx.reviewStatus === 'needs_review' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {t('txnReviewPill')}
                      </span>
                    )}
                    {tx.importSource === 'plaid' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {t('txnLinkedViaPlaid')}
                      </span>
                    )}
                    {tx.recurring && (
                      // R44 (2026-05-01): "Recurring" pill — visible
                      // confirmation that this row is in the recurring
                      // set, mirrors the bills/recurring page styling.
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 inline-flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        {t('txnRecurringPill')}
                      </span>
                    )}
                    {tx.excludedFromReports && (
                      // 2026-06-11 (Monarch parity): subtle mark — paired
                      // with the row-level reduced opacity — showing this
                      // row is left out of totals/budgets/reports.
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 inline-flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        {t('txnExcludedBadge')}
                      </span>
                    )}
                    {tx.assetId != null && (() => {
                      // 2026-06-12 (parity W1): linked-asset chip, named when
                      // the asset list has loaded.
                      const linked = assetOptions.find(a => a.id === tx.assetId);
                      return (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center gap-1" title={linked?.name || t('txnFieldLinkAsset')}>
                          <Landmark className="w-3 h-3" />
                          {linked?.name || t('txnLinkedAssetBadge')}
                        </span>
                      );
                    })()}
                    {/* 2026-06-18 (Side Hustle Phase 1): attributed-side-hustle
                        chip. Family-only — non-Family users never receive a
                        businessId on the wire, but guard the chip too. */}
                    {hasSideHustleAccess && tx.businessId != null && (() => {
                      const linked = sideHustleOptions.find(h => h.id === tx.businessId);
                      return (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 inline-flex items-center gap-1" title={linked?.name || t('sideHustlesFieldLink')}>
                          <Briefcase className="w-3 h-3" />
                          {linked?.name || t('sideHustlesLinkedBadge')}
                        </span>
                      );
                    })()}
                    {/* 2026-06-18 (Side Hustle Phase 3): "has receipt"
                        indicator — paperclip + count. Family-only (the
                        count is server-emitted on every txn but the feature
                        is gated; guard the chip too so non-Family never see
                        it). receiptCount is ownership-scoped server-side. */}
                    {hasSideHustleAccess && (tx.receiptCount ?? 0) > 0 && (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 inline-flex items-center gap-1"
                        title={tFmt('receiptsRowCountFmt', [tx.receiptCount ?? 0])}
                      >
                        <Paperclip className="w-3 h-3" />
                        {tx.receiptCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">
                    {/* 2026-05-12 overnight QA (TX-002): transfer rows
                        already carry a "Transfer In/Out" pill in the
                        header. Repeating the Plaid auto-classifier's
                        category here led to nonsense like "Income" on a
                        negative "Transfer Out" row (admin's Wells Fargo
                        CARD transfer on May 10). Hide the category
                        subtitle for transfers — the pill already says
                        what it is — and just show the date.
                        Feature 2 (2026-06-17): also respect colVis.category
                        toggle — if hidden, omit the category prefix. */}
                    {colVis.category && tx.type !== 'transfer' && (
                      <>{categoryLabel(tx.category)} • </>
                    )}
                    {new Date(tx.timestamp).toLocaleDateString(dateLocale)}
                    {tx.currency && tx.currency !== preferredCurrency && (
                      <span className="ms-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">{tx.currency}</span>
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
                  {/* Feature 2 (2026-06-17): account line gated by colVis.account;
                      owner (institution) gated by colVis.owner. Either flag off
                      hides that piece of the combined line. */}
                  {(colVis.account || colVis.owner) && (tx.sourceInstitutionName || tx.sourceAccountName) && (
                    <p className="text-xs text-emerald-700 mt-1">
                      {[
                        colVis.owner ? tx.sourceInstitutionName : null,
                        colVis.account ? tx.sourceAccountName : null,
                        colVis.account ? tx.sourceAccountType : null,
                      ].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-bold tabular-nums ${presentation.amountClass}`}>
                  {presentation.sign}{txAmount(tx, fmt, dateLocale, preferredCurrency)}
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
                    {/* 2026-05-10 (founder report): per-row 'Mark reviewed'
                        button. Only renders when the transaction is in
                        the needs-review queue. Confirms the auto-tag
                        without forcing a category overwrite. */}
                    {tx.reviewStatus === 'needs_review' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMarkReviewed([tx.id]); }}
                        aria-label={tFmt('txnMarkRowReviewedAria', [tx.description || categoryLabel(tx.category)])}
                        title={t('txnMarkRowReviewedTitle')}
                        className="p-1.5 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {/* 2026-05-10: Split transaction — for cross-category
                        purchases (Costco = groceries + household + kids).
                        Only meaningful on expenses; income/transfer rows
                        hide the icon. */}
                    {tx.type === 'expense' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSplitTx(tx); }}
                        aria-label={tFmt('txnSplitRowAria', [tx.description || categoryLabel(tx.category)])}
                        title={txnIdsWithSplits.has(tx.id) ? t('txnEditSplitsTitle') : t('txnSplitIntoTitle')}
                        className={`p-1.5 rounded-md transition-colors ${
                          txnIdsWithSplits.has(tx.id)
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'text-muted-foreground hover:text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        <SplitIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleRecurring(tx); }}
                      aria-label={tx.recurring ? tFmt('txnRemoveRecurringAria', [tx.description || categoryLabel(tx.category)]) : tFmt('txnMarkRecurringAria', [tx.description || categoryLabel(tx.category)])}
                      title={tx.recurring ? t('txnRemoveRecurringTitle') : t('txnMarkRecurringTitle')}
                      className={`p-1.5 rounded-md transition-colors ${tx.recurring ? 'text-violet-700 bg-violet-50 hover:bg-violet-100' : 'text-muted-foreground hover:text-violet-700 hover:bg-violet-50'}`}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openEdit(tx); }}
                      aria-label={tFmt('txnEditRowAria', [tx.description || categoryLabel(tx.category)])}
                      title={t('txnEditTitle')}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                      aria-label={tFmt('txnDeleteRowAria', [tx.description || categoryLabel(tx.category)])}
                      title={t('txnDeleteTitle')}
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
          title={t('txnEmptyTitle')}
          description={t('txnEmptyDesc')}
          actions={[
            { label: t('txnEmptyAddBtn'), onClick: openAdd, primary: true },
            { label: t('txnEmptyConnectBtn'), href: '/dashboard/import' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { desc: 'Whole Foods Market', cat: categoryLabel('groceries'), amt: `−${fmt(84.31)}`, date: t('txnSampleToday') },
                { desc: 'Salary — Acme Corp', cat: categoryLabel('income'), amt: `+${fmt(5400)}`, date: 'Apr 25' },
                { desc: 'Sadaqah · Local masjid', cat: categoryLabel('sadaqah'), amt: `−${fmt(50)}`, date: 'Apr 24' },
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
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">{t('txnPagePrev')}</button>
          <span className="text-sm text-gray-600">{tFmt('txnPageOfFmt', [page + 1, totalPages])}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">{t('txnPageNext')}</button>
        </div>
      )}

      {/* ── Add Transaction modal ─────────────────────────────────────────────
           2026-05-02 (revert): centered pattern; useBodyScrollLock
           handles the page-scroll-behind-modal complaint without any
           structural change. */}
      {showForm && (
        <ModalShell onClose={() => setShowForm(false)}>
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{editTx ? t('txnModalEditTitle') : t('txnModalAddTitle')}</h2>
            <div className="space-y-4">
              {/* Type */}
              {/* 2026-06-08 (A11Y-DASHBOARD-FORM-LABELS-1 part 2/6):
                  htmlFor + id pairs across the transactions modal so
                  screen readers announce each field correctly. */}
              <div>
                <label htmlFor="txn-form-type" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldType')}</label>
                <select id="txn-form-type" value={form.type} onChange={e => {
                  const nextType = e.target.value;
                  setForm({
                    ...form,
                    type: nextType,
                    direction: nextType === 'income' ? 'inflow' : nextType === 'expense' ? 'outflow' : 'neutral',
                    category: categoriesForType(nextType).includes(form.category) ? form.category : categoriesForType(nextType)[0],
                  });
                }} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  <option value="income">{t('txnTypeIncome')}</option>
                  <option value="expense">{t('txnTypeExpense')}</option>
                  <option value="transfer">{t('txnTypeTransfer')}</option>
                </select>
              </div>
              {form.type === 'transfer' && (
                <div>
                  <label htmlFor="txn-form-direction" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldDirection')}</label>
                  <select id="txn-form-direction" value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    <option value="inflow">{t('txnDirInflow')}</option>
                    <option value="outflow">{t('txnDirOutflow')}</option>
                    <option value="neutral">{t('txnDirNeutral')}</option>
                  </select>
                </div>
              )}
              {/* Category */}
              <div>
                <label htmlFor="txn-form-category" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldCategory')}</label>
                <select id="txn-form-category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {categoriesForType(form.type).map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
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
                  <label htmlFor="txn-form-amount" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldAmount')}</label>
                  <input id="txn-form-amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={e => { setForm({ ...form, amount: e.target.value }); setFormError(null); }}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 ${formError ? 'border-red-400' : ''}`} placeholder={t('txnAmountPlaceholder')} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldCurrency')}</label>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm">
                    {CURRENCIES.map(c => (
                      <option key={c} value={c}>{CURRENCY_SYMBOLS[c] || ''} {c} — {CURRENCY_NAMES[c]}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Description */}
              <div>
                <label htmlFor="txn-form-description" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldDescription')}</label>
                <input id="txn-form-description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('txnDescPlaceholder')} />
              </div>
              {/* Date — the EFFECTIVE date: drives which month's budget & cash-flow
                  this counts toward. Forward-dating is allowed (set a future
                  budget month); the original posted date is kept separately.
                  2026-06-06 founder feedback: the explanatory hint used to only
                  appear when originalDate was non-null, so manually-created
                  transactions (no posted date) had no signal at all that the
                  date controlled budget month. Now the hint always appears,
                  with the original-posted line added when known. */}
              <div>
                {/* 2026-06-08 founder: "Still no option to edit transaction
                    so that it can be applied to another month". The field
                    DID exist but the label said only "Date" and the
                    explanation was tiny gray-500 hardcoded English. Users
                    didn't realize editing this moves the transaction to a
                    different month. Now: explicit label, prominent
                    amber-bg helper block, fully localized. */}
                <label htmlFor="txn-form-date" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('txnFieldEffectiveDateLabel')}
                </label>
                <input id="txn-form-date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  max={new Date(Date.now() + 400 * 86400000).toISOString().slice(0, 10)}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" />
                <div className="mt-2 flex gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  <span aria-hidden="true">💡</span>
                  <div className="flex-1 text-amber-900">
                    {t('txnFieldEffectiveDateHelper')}
                    {editTx?.originalDate != null && (
                      <span className="block mt-1 text-amber-800">
                        {tFmt('txnFieldEffectiveDateOriginalFmt', [new Date(editTx.originalDate).toLocaleDateString(dateLocale)])}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Tags */}
              <div>
                <label htmlFor="txn-form-tags" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldTags')}</label>
                <input id="txn-form-tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('txnTagsPlaceholder')} />
              </div>
              {/* Notes */}
              <div>
                <label htmlFor="txn-form-notes" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldNotes')}</label>
                <textarea id="txn-form-notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 resize-none" placeholder={t('txnNotesPlaceholder')} />
              </div>
              {/* 2026-06-12 (parity W1): link to asset — mobile has had this
                  picker since launch; backend ownership-gates the id. */}
              {assetOptions.length > 0 && (
                <div>
                  <label htmlFor="txn-form-asset" className="block text-sm font-medium text-gray-700 mb-1">{t('txnFieldLinkAsset')}</label>
                  <select id="txn-form-asset" value={form.assetId}
                    onChange={e => setForm({ ...form, assetId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    <option value="">{t('txnNoAsset')}</option>
                    {assetOptions.map(a => (
                      <option key={a.id} value={String(a.id)}>{a.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* 2026-06-18 (Side Hustle Phase 1): attribute this transaction to
                  a Side Hustle. Family-only (hidden entirely for non-Family —
                  do not render-then-403) and only when the user has at least
                  one side hustle. Backend ownership-gates the id; '' here = the
                  "No side hustle" sentinel handled in handleSave. */}
              {hasSideHustleAccess && sideHustleOptions.length > 0 && (
                <div>
                  <label htmlFor="txn-form-side-hustle" className="block text-sm font-medium text-gray-700 mb-1">{t('sideHustlesFieldLink')}</label>
                  <select id="txn-form-side-hustle" value={form.businessId}
                    onChange={e => setForm({ ...form, businessId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    <option value="">{t('sideHustlesNone')}</option>
                    {sideHustleOptions.map(h => (
                      <option key={h.id} value={String(h.id)}>{h.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* 2026-06-12 (parity W3): recurring-on-create. The backend
                  create DTO now accepts recurring+frequency; edit mode keeps
                  the immediate-save toggle below instead. */}
              {!editTx && (
                <div className="border-t border-gray-200 pt-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.recurring}
                      onChange={e => setForm({ ...form, recurring: e.target.checked })}
                      className="mt-0.5 w-4 h-4 accent-primary rounded flex-shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {t('txnMarkRecurringLabel')}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {t('txnMarkRecurringHint')}
                      </span>
                    </span>
                  </label>
                  {form.recurring && (
                    <div className="mt-3 ms-7">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('txnFrequencyLabel')}
                      </label>
                      <select
                        value={form.frequency}
                        onChange={e => setForm({ ...form, frequency: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
                      >
                        <option value="daily">{t('txnFreqDaily')}</option>
                        <option value="weekly">{t('txnFreqWeekly')}</option>
                        <option value="biweekly">{t('txnFreqBiweekly')}</option>
                        <option value="monthly">{t('txnFreqMonthly')}</option>
                        <option value="yearly">{t('txnFreqYearly')}</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
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
                      checked={Boolean(editTx.recurring)}
                      onChange={() => handleToggleRecurring(editTx)}
                      className="mt-0.5 w-4 h-4 accent-primary rounded flex-shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {t('txnMarkRecurringLabel')}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {t('txnMarkRecurringHint')}
                      </span>
                    </span>
                    {Boolean(editTx.recurring) && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 flex-shrink-0">
                        {t('txnRecurringPill')}
                      </span>
                    )}
                  </label>
                  {/* 2026-06-08: founder feedback "I don't see biweekly option
                      when marking transaction as recurring". Backend supports
                      daily/weekly/biweekly/monthly/yearly via VALID_FREQUENCIES;
                      mobile already showed all five. This dropdown closes the
                      web gap. Sent through the existing PATCH /api/transactions
                      `frequency` field, which TransactionController.update
                      validates against VALID_FREQUENCIES and uses to bump
                      nextOccurrence. */}
                  {Boolean(editTx.recurring) && (
                    <div className="mt-3 ms-7">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('txnFrequencyLabel')}
                      </label>
                      <select
                        value={form.frequency}
                        onChange={e => setForm({ ...form, frequency: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900"
                      >
                        <option value="daily">{t('txnFreqDaily')}</option>
                        <option value="weekly">{t('txnFreqWeekly')}</option>
                        <option value="biweekly">{t('txnFreqBiweekly')}</option>
                        <option value="monthly">{t('txnFreqMonthly')}</option>
                        <option value="yearly">{t('txnFreqYearly')}</option>
                      </select>
                    </div>
                  )}
                  {/* 2026-06-11 (Monarch parity): exclude-from-reports
                      toggle. Saves immediately (like the recurring
                      checkbox above) via handleToggleExcluded, which
                      also refreshes the list + summary since this flag
                      changes totals. */}
                  <label className="flex items-start gap-3 cursor-pointer select-none mt-3 pt-3 border-t border-gray-200">
                    <input
                      type="checkbox"
                      checked={Boolean(editTx.excludedFromReports)}
                      onChange={() => handleToggleExcluded(editTx)}
                      disabled={togglingExcluded}
                      className="mt-0.5 w-4 h-4 accent-primary rounded flex-shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {t('txnExcludeFromReports')}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {t('txnExcludeFromReportsHint')}
                      </span>
                    </span>
                    {Boolean(editTx.excludedFromReports) && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 flex-shrink-0">
                        {t('txnExcludedBadge')}
                      </span>
                    )}
                  </label>
                </div>
              )}
              {/* 2026-06-18 (Side Hustle Phase 3): Receipts — attach proof
                  (photo/PDF) to a transaction for tax substantiation. Edit
                  mode only (the transaction must exist to attach to) and
                  Family-only — hidden entirely for non-Family (don't
                  render-then-403); the upload/delete WRITES would 403 and
                  the list READ returns a {locked} payload we treat as empty.
                  Files are validated client-side (image/* or PDF, <10 MB)
                  before the round-trip; the backend re-checks both. */}
              {editTx && hasSideHustleAccess && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 inline-flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      {t('receiptsSectionTitle')}
                      {receipts.length > 0 && (
                        <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                          {receipts.length}
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{t('receiptsSectionHint')}</p>

                  {/* Hidden native input + a styled trigger button so the
                      control matches the rest of the modal. accept mirrors
                      the backend (image/* or PDF). */}
                  <input
                    ref={receiptInputRef}
                    type="file"
                    accept={RECEIPT_ACCEPT}
                    className="hidden"
                    aria-hidden="true"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      // Reset the input value so re-selecting the same file
                      // fires onChange again.
                      e.target.value = '';
                      if (file && editTx) handleReceiptUpload(editTx.id, file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => receiptInputRef.current?.click()}
                    disabled={receiptUploading}
                    className="w-full border border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {receiptUploading
                      ? <><span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full inline-block" />{t('receiptsUploading')}</>
                      : <><Paperclip className="w-4 h-4" />{t('receiptsAddBtn')}</>}
                  </button>

                  {/* Receipt list — filename + size + download + delete. */}
                  {receiptsLoading ? (
                    <p className="text-xs text-gray-500 mt-3">{t('receiptsLoading')}</p>
                  ) : receipts.length === 0 ? (
                    <p className="text-xs text-gray-400 mt-3">{t('receiptsEmpty')}</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {receipts.map(r => (
                        <li
                          key={r.id}
                          className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2"
                        >
                          <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate" title={r.filename}>{r.filename}</p>
                            <p className="text-xs text-gray-500">{formatReceiptSize(r.sizeBytes, dateLocale)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => editTx && handleReceiptDownload(editTx.id, r)}
                            aria-label={tFmt('receiptsDownloadAria', [r.filename])}
                            title={t('receiptsDownload')}
                            className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md flex-shrink-0"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => editTx && handleReceiptDelete(editTx.id, r.id)}
                            disabled={deletingReceiptId === r.id}
                            aria-label={tFmt('receiptsDeleteAria', [r.filename])}
                            title={t('receiptsDelete')}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md disabled:opacity-50 flex-shrink-0"
                          >
                            {deletingReceiptId === r.id
                              ? <span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full inline-block" />
                              : <Trash2 className="w-4 h-4" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button aria-label={t('txnCloseAddModalAria')} onClick={() => { setShowForm(false); setEditTx(null); setFormError(null); }} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('txnCancel')}</button>
              <button onClick={handleSave} disabled={saving || !form.amount}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">
                {saving ? t('txnSaving') : (editTx ? t('txnSaveChanges') : t('txnAddBtn'))}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deleteConfirmation && (
        <ModalShell onClose={() => setDeleteConfirmation(null)}>
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
                <h3 id="modal-title" className="font-bold text-gray-900">{t('txnDeleteConfirmTitle')}</h3>
                {deleteConfirmation.type === 'single' && (
                  <p className="text-sm text-gray-600 mt-1">{t('txnDeleteSingleBody')}</p>
                )}
                {deleteConfirmation.type === 'bulk' && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectAllPages
                      ? tFmt('txnDeleteAllBodyFmt', [totalElements, totalElements !== 1 ? 's' : ''])
                      : tFmt('txnDeleteBulkBodyFmt', [deleteConfirmation.count ?? 0, (deleteConfirmation.count ?? 0) > 1 ? 's' : ''])}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                aria-label={t('txnCloseDeleteModalAria')}
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 font-medium"
              >
                {t('txnCancel')}
              </button>
              <button
                onClick={deleteConfirmation.type === 'single' ? confirmDelete : confirmBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {bulkDeleting ? t('txnDeleting') : t('txnDelete')}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ── Feature 3: RIGHT-CLICK QUICK-TAG POPOVER (2026-06-17) ──────────
           A small fixed-position menu that appears at the cursor when the
           user right-clicks a transaction row. Lets them add a tag without
           opening the full edit drawer. The browser's native context menu is
           suppressed via onContextMenu → e.preventDefault() on the row.
           Calls api.updateTransaction (PUT /api/transactions/{id}) which
           already accepts a `tags` field — no new endpoint needed.
           Dismissed by clicking outside, pressing Escape, or submitting. */}
      {quickTag && (
        <div
          ref={quickTagRef}
          role="dialog"
          aria-modal="false"
          aria-label={t('txnQuickTagTitle')}
          style={{
            position: 'fixed',
            left: Math.min(quickTag.x, window.innerWidth - 240),
            top: Math.min(quickTag.y, window.innerHeight - 140),
            zIndex: 9999,
          }}
          className="w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">
              🏷️ {t('txnQuickTagTitle')}
            </span>
            <button
              type="button"
              aria-label={t('txnQuickTagClose')}
              onClick={() => { setQuickTag(null); setQuickTagInput(''); }}
              className="text-gray-400 hover:text-gray-600 text-base leading-none"
            >×</button>
          </div>
          <p className="text-[11px] text-gray-500 mb-2 truncate" title={quickTag.tx.description || ''}>
            {quickTag.tx.merchantName || quickTag.tx.description || ''}
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); handleQuickTagSave(); }}
            className="flex gap-1.5"
          >
            <input
              autoFocus
              type="text"
              value={quickTagInput}
              onChange={e => setQuickTagInput(e.target.value)}
              placeholder={t('txnQuickTagPlaceholder')}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={!quickTagInput.trim() || quickTagSaving}
              className="bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-40"
            >
              {quickTagSaving
                ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" />
                : t('txnQuickTagAdd')
              }
            </button>
          </form>
          {quickTag.tx.tags && quickTag.tx.tags.trim() && (
            <div className="flex flex-wrap gap-1 mt-2">
              {quickTag.tx.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
                <span key={i} className="text-[11px] px-1.5 py-0.5 rounded-full bg-green-100 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Split transaction modal (2026-05-10) ─────────────────────────── */}
      {splitTx && (
        <SplitTransactionModal
          tx={splitTx}
          fmt={fmt}
          onClose={() => setSplitTx(null)}
          onSaved={(hadSplits) => {
            setTxnIdsWithSplits(prev => {
              const next = new Set(prev);
              if (hadSplits) next.add(splitTx.id); else next.delete(splitTx.id);
              return next;
            });
            setSplitTx(null);
            toast(hadSplits ? t('txnSplitsSaved') : t('txnSplitsCleared'), 'success');
          }}
          onError={(msg) => toast(msg, 'error')}
        />
      )}
    </div>
  );
}

// ─── Split modal component ──────────────────────────────────────────────
// Founder competitive audit 2026-05-10: every serious budgeter splits
// Costco. A parent transaction stays as the payment record; splits are
// child rows that budget aggregation attributes to per-category budgets.
// Sum of splits must equal the parent amount within $0.01.
interface SplitLine {
  category: string;
  amount: string; // string while editing — parsed to number on submit
  description: string;
}
function SplitTransactionModal({
  tx,
  fmt,
  onClose,
  onSaved,
  onError,
}: {
  tx: Tx;
  fmt: (n: number) => string;
  onClose: () => void;
  onSaved: (hadSplits: boolean) => void;
  onError: (msg: string) => void;
}) {
  const { t, tFmt } = useI18n();
  const [lines, setLines] = useState<SplitLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const parentAmount = Number(tx.amount) || 0;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getTransactionSplits(tx.id)
      .then((r: { splits?: Array<{ category: string; amount: number | string; description?: string }>; error?: string }) => {
        if (cancelled) return;
        if (r?.error) {
          onError(r.error);
          return;
        }
        const existing = (r?.splits ?? []).map(s => ({
          category: s.category,
          amount: String(s.amount),
          description: s.description || '',
        }));
        // Default: if no existing splits, seed with the parent's category
        // taking the full amount + one empty line ready for the user.
        if (existing.length === 0) {
          setLines([
            { category: tx.category, amount: parentAmount.toFixed(2), description: '' },
            { category: '', amount: '', description: '' },
          ]);
        } else {
          setLines(existing);
        }
      })
      .catch(() => onError(t('txnSplitLoadFailed')))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx.id]);

  const sum = lines.reduce((acc, l) => {
    const n = Number(l.amount);
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);
  const diff = parentAmount - sum;
  const balanced = Math.abs(diff) < 0.005;
  const canSubmit = !saving && balanced && lines.every(l => l.category.trim() !== '' && Number(l.amount) > 0);

  const addLine = () => setLines(prev => [...prev, { category: '', amount: '', description: '' }]);
  const removeLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i));
  const updateLine = (i: number, patch: Partial<SplitLine>) =>
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  // Auto-fill an empty line with the remaining diff (one-click balance).
  // If every line already has a non-zero amount, append a new line for the diff.
  const autoBalance = () => {
    const emptyIdx = lines.findIndex(l => !l.amount || Number(l.amount) === 0);
    if (emptyIdx < 0) {
      setLines(prev => [...prev, { category: '', amount: diff.toFixed(2), description: '' }]);
      return;
    }
    setLines(prev => prev.map((l, i) => {
      if (i !== emptyIdx) return l;
      const current = Number(l.amount) || 0;
      return { ...l, amount: (current + diff).toFixed(2) };
    }));
  };

  const submit = async (clear = false) => {
    setSaving(true);
    try {
      if (clear) {
        const r = await api.clearTransactionSplits(tx.id);
        if (r?.error) { onError(r.error); return; }
        onSaved(false);
        return;
      }
      const payload = lines
        .filter(l => l.category.trim() !== '' && Number(l.amount) > 0)
        .map(l => ({
          category: l.category.trim(),
          amount: Number(l.amount),
          description: l.description.trim() || undefined,
        }));
      const r = await api.setTransactionSplits(tx.id, payload);
      if (r?.error) { onError(r.error); return; }
      onSaved(payload.length > 0);
    } catch (e) {
      onError(e instanceof Error ? e.message : t('txnSplitSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="split-modal-title"
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-5 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id="split-modal-title" className="font-bold text-gray-900 text-lg">{t('txnSplitTitle')}</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md">
                {t('txnSplitDescPre')} <strong>{tx.description || categoryLabel(tx.category)}</strong> {t('txnSplitDescPost')}
              </p>
            </div>
            <button onClick={onClose} aria-label={t('txnClose')} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {loading ? (
            <p className="text-center text-gray-400 py-6">{t('txnLoadingSplits')}</p>
          ) : (
            <>
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder={t('txnSplitCategoryPlaceholder')}
                    value={line.category}
                    onChange={e => updateLine(i, { category: e.target.value })}
                    className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t('txnAmountPlaceholder')}
                    value={line.amount}
                    onChange={e => updateLine(i, { amount: e.target.value })}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                  <input
                    type="text"
                    placeholder={t('txnSplitNotePlaceholder')}
                    value={line.description}
                    onChange={e => updateLine(i, { description: e.target.value })}
                    className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    aria-label={t('txnRemoveSplit')}
                    className="col-span-1 text-gray-400 hover:text-rose-600 text-lg leading-none"
                  >×</button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={addLine}
                  className="text-xs font-semibold text-[#1B5E20] hover:underline"
                >
                  {t('txnAddSplit')}
                </button>
                {!balanced && diff !== 0 && (
                  <button
                    type="button"
                    onClick={autoBalance}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    {tFmt('txnAutoBalanceFmt', [`${diff > 0 ? '+' : ''}${fmt(diff)}`])}
                  </button>
                )}
              </div>
              <div className={`mt-4 rounded-lg p-3 text-sm ${balanced ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                <div className="flex justify-between">
                  <span>{t('txnParentTotal')}</span>
                  <strong>{fmt(parentAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('txnSplitTotal')}</span>
                  <strong>{fmt(sum)}</strong>
                </div>
                {!balanced && (
                  <div className="flex justify-between mt-1 border-t border-amber-200 pt-1">
                    <span>{diff > 0 ? t('txnRemaining') : t('txnOverBy')}</span>
                    <strong>{fmt(Math.abs(diff))}</strong>
                  </div>
                )}
                {balanced && (
                  <p className="mt-1 text-xs">{t('txnSplitsBalanced')}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="p-5 border-t flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={saving}
            className="text-xs text-rose-700 hover:text-rose-900 disabled:opacity-40"
          >
            {t('txnClearAllSplits')}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              {t('txnCancel')}
            </button>
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={!canSubmit}
              className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-semibold hover:bg-[#1B5E20]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? t('txnSavingEllipsis') : t('txnSaveSplits')}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
