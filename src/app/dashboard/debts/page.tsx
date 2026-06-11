'use client';
import Link from 'next/link';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { api } from '../../../lib/api';
import { hasPaidSyncAccess } from '../../../lib/subscription';
import { useAuth } from '../../../context/AuthContext';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import EmptyState from '../../../components/EmptyState';
import ModalShell from '../../../components/ui/ModalShell';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { SkeletonPage } from '../SkeletonCard';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { useI18n, t as tStandalone, tFmt as tFmtStandalone } from '../../../lib/i18n';

interface DebtItem {
  id: number;
  name: string;
  type: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  ribaFree: boolean;
  lender: string;
  status: string;
  linkedSource?: string | null;
  linkedAccountId?: number | null;
  utilizationPercentage?: number;
  revolving?: boolean;
  readOnly?: boolean;
  notes?: string | null;
  accountMask?: string | null;
  accountSubtype?: string | null;
  lastSyncedAt?: number | null;
}

const TYPES = ['islamic_mortgage', 'conventional_mortgage', 'personal_loan', 'student_loan', 'car_loan', 'qard_hasan', 'credit_card', 'business_loan', 'other'];
const ISLAMIC_TYPES = ['islamic_mortgage', 'qard_hasan'];
const TYPE_LABEL_KEYS: Record<string, string> = {
  islamic_mortgage: 'debtTypeIslamicMortgage',
  conventional_mortgage: 'debtTypeConventionalMortgage',
  personal_loan: 'debtTypePersonalLoan',
  student_loan: 'debtTypeStudentLoan',
  car_loan: 'debtTypeCarLoan',
  qard_hasan: 'debtTypeQardHasan',
  credit_card: 'debtTypeCreditCard',
  business_loan: 'debtTypeBusinessLoan',
  other: 'debtTypeOther',
};

const emptyForm = { name: '', type: 'qard_hasan', totalAmount: '', remainingAmount: '', monthlyPayment: '', interestRate: '0', lender: '', ribaFree: true };

interface SubscriptionStatus {
  plan: 'free' | 'plus' | 'family';
  status: string;
  hasSubscription: boolean;
}

// Debt-burden intelligence — backed by DebtInsightService.java.
interface DebtBurden {
  currency: string;
  debtCount: number;
  totalRemainingDebt: number;
  ribaBearingRemaining: number;
  ribaFreeRemaining: number;
  ribaBearingDebtCount: number;
  totalMonthlyDebtPayment: number;
  ribaBearingMonthly: number;
  ribaFreeMonthly: number;
  ribaShareOfPayments: number;
  detectedMonthlyIncome: number;
  debtToIncomeRatio: number | null;
  dtiBand: 'healthy' | 'moderate' | 'elevated' | 'unknown';
}

/**
 * 2026-05-10 — shape of the GET /api/debts/payoff-strategies response.
 * Both `snowball` and `avalanche` carry: monthsToDebtFree (null if
 * the simulator hit its 600-month cap), totalInterestPaid, perDebt
 * payoff month, and a `monthlySeries` for the stacked-bar timeline.
 */
interface BackendStrategyResult {
  strategy: 'snowball' | 'avalanche';
  startingBalance: number;
  minimumsTotal: number;
  extraMonthly: number;
  monthsToDebtFree: number | null;
  monthsSimulated: number;
  totalInterestPaid: number;
  cappedAtMaxMonths: boolean;
  debtFreeAt: number | null;
  debts: Array<{ id: number; name: string; startingBalance: number; minimumPayment: number; annualRate: number; ribaFree: boolean }>;
  perDebtPayoffMonth: Array<{ id: number; name: string; monthPaidOff: number | null }>;
  monthlySeries: Array<{
    month: number;
    totalRemaining: number;
    debts: Array<{ id: number; remaining: number }>;
  }>;
}
interface BackendStrategiesResponse {
  activeDebts: number;
  snowball: BackendStrategyResult;
  avalanche: BackendStrategyResult;
  comparison: {
    totalInterestDelta: number;
    monthsDelta: number | null;
    recommended: 'snowball' | 'avalanche';
  };
}

/* ── Payoff simulation ──────────────────────────────────────────── */

function simulatePayoff(rawDebts: DebtItem[], extra = 0, strategy: 'avalanche' | 'snowball' = 'avalanche') {
  if (!rawDebts.length) return { months: 0, totalInterest: 0, schedule: [] };

  type SimDebtCents = { id: number; name: string; balanceCents: number; monthlyPaymentCents: number; rate: number };
  let debts: SimDebtCents[] = rawDebts.map(d => ({
    id: d.id,
    name: d.name,
    balanceCents: Math.round((d.remainingAmount || 0) * 100),
    monthlyPaymentCents: Math.round((d.monthlyPayment || 0) * 100),
    rate: d.interestRate || 0,
  }));

  const extraCents = Math.round(extra * 100);

  const capacityCents = debts.reduce((s, d) => s + d.monthlyPaymentCents, 0) + extraCents;
  if (capacityCents <= 0) return { months: 0, totalInterest: 0 };

  if (strategy === 'avalanche') debts = [...debts].sort((a, b) => b.rate - a.rate);
  else debts = [...debts].sort((a, b) => a.balanceCents - b.balanceCents);

  let month = 0;
  let totalInterestCents = 0;
  const MAX = 600;

  while (debts.some(d => d.balanceCents > 0) && month < MAX) {
    month++;
    let paidCentsThisMonth = 0;
    debts.forEach(d => {
      if (d.balanceCents > 0) {
        const interestCents = Math.round((d.balanceCents * d.rate) / 1200);
        d.balanceCents += interestCents;
        totalInterestCents += interestCents;
      }
    });
    debts.forEach(d => {
      if (d.balanceCents > 0) {
        const payCents = Math.min(d.monthlyPaymentCents, d.balanceCents);
        d.balanceCents -= payCents;
        paidCentsThisMonth += payCents;
      }
    });
    let leftCents = extraCents;
    for (const d of debts) {
      if (d.balanceCents > 0 && leftCents > 0) {
        const payCents = Math.min(leftCents, d.balanceCents);
        d.balanceCents -= payCents;
        leftCents -= payCents;
        paidCentsThisMonth += payCents;
      }
    }
    if (paidCentsThisMonth <= 0) break;
  }
  return { months: month, totalInterest: totalInterestCents / 100 };
}

function calcPayoffMonths(balance: number, monthlyPayment: number, annualRate: number): number {
  if (balance <= 0 || monthlyPayment <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0 || monthlyPayment >= balance) {
    return Math.ceil(balance / monthlyPayment);
  }
  if (monthlyPayment <= balance * r) return Infinity;
  return Math.ceil(-Math.log(1 - (r * balance) / monthlyPayment) / Math.log(1 + r));
}

function addMonths(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

/* ── Component ─────────────────────────────────────────────────── */
export default function DebtsPage() {
  const { t, tFmt } = useI18n();
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDebt, setEditDebt] = useState<DebtItem | null>(null);
  useBodyScrollLock(showForm);
  const [payModal, setPayModal] = useState<DebtItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [payAmount, setPayAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [tab, setTab] = useState<'debts' | 'projector'>('debts');
  const [extra, setExtra] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [burden, setBurden] = useState<DebtBurden | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ transactionId: number; debtId: number; debtName: string; amount: number; principalPreview: number; profitPreview: number; description?: string; date: number }>>([]);
  const [applyingSug, setApplyingSug] = useState<number | null>(null);
  const [dismissedSug, setDismissedSug] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const { symbol, fmt, locale: dateLocale } = useCurrency();
  const { user } = useAuth();

  const load = useCallback(() => {
    setLoading(true);
    Promise.allSettled([api.getDebts(), api.subscriptionStatus(), api.getDebtBurden(), api.getDebtPaymentSuggestions()])
      .then(results => {
        const debtResult = results[0].status === 'fulfilled' ? results[0].value : null;
        const subscriptionResult = results[1].status === 'fulfilled' ? results[1].value : null;
        const burdenResult = results[2].status === 'fulfilled' ? results[2].value : null;
        const sugResult = results[3].status === 'fulfilled' ? results[3].value : null;
        setSuggestions(Array.isArray(sugResult?.suggestions) ? sugResult.suggestions : []);
        setSubscriptionStatus(
          subscriptionResult
            ? (subscriptionResult as SubscriptionStatus)
            : { plan: 'free', status: 'inactive', hasSubscription: false },
        );
        setBurden(burdenResult && !burdenResult.error ? (burdenResult as DebtBurden) : null);
        if (debtResult?.error) {
          toast(debtResult.error as string, 'error');
          return;
        }
        setDebts(Array.isArray(debtResult?.debts) ? debtResult.debts : Array.isArray(debtResult) ? debtResult : []);
      })
      .catch(() => { toast(tStandalone('debtFailedLoad'), 'error'); })
      .finally(() => setLoading(false));
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditDebt(null); setForm(emptyForm); setSaveError(null); setShowForm(true); };
  const openEdit = (d: DebtItem) => {
    setEditDebt(d);
    setForm({ name: d.name, type: d.type, totalAmount: String(d.totalAmount), remainingAmount: String(d.remainingAmount), monthlyPayment: String(d.monthlyPayment), interestRate: String(d.interestRate), lender: d.lender || '', ribaFree: d.ribaFree });
    setSaveError(null); setShowForm(true);
  };

  const applySuggestion = async (s: { transactionId: number; debtId: number; debtName: string; amount: number; principalPreview: number; date: number }) => {
    setApplyingSug(s.transactionId);
    try {
      const res = await api.makeDebtPayment(s.debtId, s.amount, s.date);
      if (res?.error) { toast(res.error as string, 'error'); return; }
      toast(tFmt('debtSuggestionAppliedFmt', [fmt(s.principalPreview), s.debtName]), 'success');
      setDismissedSug(prev => new Set(prev).add(s.transactionId));
      load();
    } catch { toast(tStandalone('debtFailedLoad'), 'error'); }
    finally { setApplyingSug(null); }
  };

  const isIslamic = ISLAMIC_TYPES.includes(form.type);
  const isHalal = isIslamic || form.ribaFree;

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      const totalAmt = parseFloat(form.totalAmount);
      if (!Number.isFinite(totalAmt) || totalAmt <= 0) { const msg = tStandalone('debtValTotalPositive'); setSaveError(msg); toast(msg, 'error'); setSaving(false); return; }
      const MAX_VALUE = 1_000_000_000;
      if (totalAmt > MAX_VALUE) { const msg = tFmtStandalone('debtValMaxFmt', [`${symbol}${MAX_VALUE.toLocaleString()}`]); setSaveError(msg); toast(msg, 'error'); setSaving(false); return; }
      if (!/^\d+(\.\d{1,2})?$/.test(form.totalAmount.trim())) {
        const msg = tStandalone('debtValDecimals');
        setSaveError(msg); toast(msg, 'error');
        setSaving(false);
        return;
      }
      const monthlyPay = parseFloat(form.monthlyPayment || '0');
      if (!Number.isFinite(monthlyPay) || monthlyPay < 0) { const msg = tStandalone('debtValMonthlyNonNeg'); setSaveError(msg); toast(msg, 'error'); setSaving(false); return; }
      const remainingAmt = parseFloat(form.remainingAmount || form.totalAmount);
      if (!Number.isFinite(remainingAmt) || remainingAmt < 0) { const msg = tStandalone('debtValRemainingNonNeg'); setSaveError(msg); toast(msg, 'error'); setSaving(false); return; }
      const intRate = parseFloat(form.interestRate || '0');
      if (!Number.isFinite(intRate) || intRate < 0) { const msg = tStandalone('debtValInterestNonNeg'); setSaveError(msg); toast(msg, 'error'); setSaving(false); return; }
      const payload = { ...form, totalAmount: totalAmt, remainingAmount: remainingAmt, monthlyPayment: monthlyPay, interestRate: intRate, ribaFree: isHalal };
      const result = editDebt ? await api.updateDebt(editDebt.id, payload) : await api.addDebt(payload);
      if (result?.error) throw new Error(result.error);
      setShowForm(false); setForm(emptyForm); load();
    } catch (err: unknown) { setSaveError(err instanceof Error ? err.message : tStandalone('debtValFailedSave')); }
    setSaving(false);
  };

  const payingRef = React.useRef(false);

  const handlePay = async () => {
    if (!payModal || payingRef.current) return;
    const amount = parseFloat(payAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setPayError(tStandalone('debtValAmountPositive'));
      return;
    }
    payingRef.current = true;
    setSaving(true); setPayError(null);
    try {
      const result = await api.makeDebtPayment(payModal.id, amount);
      if (result?.error) throw new Error(result.error);
      setPayModal(null); setPayAmount(''); load();
    } catch (err: unknown) { setPayError(err instanceof Error ? err.message : tStandalone('debtValFailedPay')); }
    setSaving(false);
    setTimeout(() => { payingRef.current = false; }, 2000);
  };

  const handleDelete = (id: number) => {
    const debt = debts.find(item => item.id === id);
    if (debt?.readOnly) {
      toast(tStandalone('debtPlaidReadOnlyToast'), 'error');
      return;
    }
    setConfirmAction({
      message: tStandalone('debtConfirmDelete'),
      action: async () => {
        setDeletingId(id);
        try {
          await api.deleteDebt(id);
          toast(tStandalone('debtDeleted'), 'success');
        } catch (err) {
          logError(err, { context: 'Failed to delete debt' });
          toast(tStandalone('debtFailedDelete'), 'error');
        } finally {
          setDeletingId(null);
          load();
        }
      }
    });
  };

  const toggleSelect = (id: number) => setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === deletableActiveDebts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(deletableActiveDebts.map(d => d.id)));
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    setConfirmAction({
      message: count === 1 ? tFmtStandalone('debtConfirmBulkDeleteSingularFmt', [count]) : tFmtStandalone('debtConfirmBulkDeletePluralFmt', [count]),
      action: async () => {
        setBulkDeleting(true);
        try {
          await api.bulkDeleteDebts(Array.from(selectedIds));
          setSelectedIds(new Set());
          load();
          toast(count === 1 ? tFmtStandalone('debtBulkDeletedSingularFmt', [count]) : tFmtStandalone('debtBulkDeletedPluralFmt', [count]), 'success');
        } catch (err) {
          const msg = err instanceof Error ? err.message : tStandalone('debtFailedBulkDelete');
          toast(msg, 'error');
        }
        setBulkDeleting(false);
      }
    });
  };

  const handleDeleteAll = () => {
    setConfirmAction({
      message: tFmtStandalone('debtConfirmDeleteAllFmt', [debts.length]),
      action: async () => {
        setBulkDeleting(true);
        try {
          await api.deleteAllDebts();
          setSelectedIds(new Set());
          load();
          toast(tStandalone('debtAllDeleted'), 'success');
        } catch (err) {
          const msg = err instanceof Error ? err.message : tStandalone('debtFailedDeleteAll');
          toast(msg, 'error');
        }
        setBulkDeleting(false);
      }
    });
  };

  const totalMinPayment = useMemo(() => debts.reduce((s, d) => s + (d.monthlyPayment || 0), 0), [debts]);
  const clientProjBase       = useMemo(() => simulatePayoff(debts, 0, 'avalanche'), [debts]);
  const clientProjAvalanche  = useMemo(() => simulatePayoff(debts, extra, 'avalanche'), [debts, extra]);
  const clientProjSnowball   = useMemo(() => simulatePayoff(debts, extra, 'snowball'), [debts, extra]);

  const [backendStrategies, setBackendStrategies] = useState<BackendStrategiesResponse | null>(null);
  useEffect(() => {
    if (!debts.some(d => d.remainingAmount > 0 && d.monthlyPayment > 0)) {
      setBackendStrategies(null);
      return;
    }
    const timer = setTimeout(() => {
      api.getDebtPayoffStrategies(extra)
        .then((r: BackendStrategiesResponse & { error?: string }) => {
          if (r?.error) return;
          setBackendStrategies(r);
        })
        .catch(() => { /* fall back to client-side sim */ });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extra, debts.length]);

  const projBase = clientProjBase;
  const projAvalanche = backendStrategies?.avalanche
    ? {
        months: Number(backendStrategies.avalanche.monthsToDebtFree) || clientProjAvalanche.months,
        totalInterest: Number(backendStrategies.avalanche.totalInterestPaid) || 0,
      }
    : clientProjAvalanche;
  const projSnowball = backendStrategies?.snowball
    ? {
        months: Number(backendStrategies.snowball.monthsToDebtFree) || clientProjSnowball.months,
        totalInterest: Number(backendStrategies.snowball.totalInterestPaid) || 0,
      }
    : clientProjSnowball;

  if (loading) return <SkeletonPage />;

  const totalDebt  = debts.reduce((s, d) => s + d.remainingAmount, 0);
  const paidOffDebts = debts.filter(d => d.remainingAmount === 0);
  const activeDebts = debts.filter(d => d.remainingAmount > 0);
  const deletableActiveDebts = activeDebts.filter(d => !d.readOnly);
  const ribaDebts  = activeDebts.filter(d => !d.ribaFree && !ISLAMIC_TYPES.includes(d.type));
  const hasLinkedPlaidDebts = debts.some(d => d.linkedSource === 'plaid' || d.readOnly);
  const plaidSyncAccess = hasPaidSyncAccess(subscriptionStatus) || (user?.plan === 'plus' || user?.plan === 'family');
  const monthsSavedAvalanche  = projBase.months - projAvalanche.months;
  const interestSavedAvalanche = projBase.totalInterest - projAvalanche.totalInterest;
  const monthsSavedSnowball   = projBase.months - projSnowball.months;
  const interestSavedSnowball  = projBase.totalInterest - projSnowball.totalInterest;

  return (
    <div>
      <PageHeader
        title={t('debtPageTitle')}
        subtitle={t('debtPageSubtitle')}
        className="mb-4"
        actions={
          <button type="button" onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('debtAddBtn')}</button>
        }
      />

      <div className="flex gap-2 mb-6">
        {(['debts', 'projector'] as const).map(tabKey => (
          <button key={tabKey} type="button" onClick={() => setTab(tabKey)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === tabKey ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {tabKey === 'debts' ? `📋 ${t('debtTabMyDebts')}` : `🔮 ${t('debtTabProjector')}`}
          </button>
        ))}
      </div>

      <div className={`mb-4 rounded-2xl border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${
        plaidSyncAccess ? 'bg-[#F7FBF7] border-green-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <p className={`text-sm font-semibold ${plaidSyncAccess ? 'text-primary' : 'text-amber-900'}`}>
            {hasLinkedPlaidDebts
              ? (plaidSyncAccess ? t('debtPlaidKeepFresh') : t('debtPlaidPaused'))
              : t('debtPlaidConnectPrompt')}
          </p>
          <p className={`text-sm mt-1 ${plaidSyncAccess ? 'text-gray-600' : 'text-amber-800'}`}>
            {hasLinkedPlaidDebts
              ? (plaidSyncAccess
                ? t('debtPlaidRefreshHelp')
                : t('debtPlaidUpgradeHelp'))
              : (plaidSyncAccess
                ? t('debtPlaidLinkHelp')
                : t('debtPlaidNowOnPaid'))}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/import"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              plaidSyncAccess ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {hasLinkedPlaidDebts ? t('debtPlaidManageBtn') : t('debtPlaidConnectBtn')}
          </Link>
          {!plaidSyncAccess && (
            <Link
              href="/dashboard/billing"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              {t('debtPlaidUpgradeBtn')}
            </Link>
          )}
        </div>
      </div>

      {/* ── DEBTS TAB ── */}
      {tab === 'debts' && (
        <>
          {/* 2026-05-21: auto-apply suggestions — detected debt_payment txns
              matched to a manual debt, with the principal/profit split preview.
              User confirms (Apply) → principal-split makePayment. */}
          {suggestions.filter(s => !dismissedSug.has(s.transactionId)).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">{t('debtSuggestionsHeading')}</p>
              <div className="space-y-2">
                {suggestions.filter(s => !dismissedSug.has(s.transactionId)).map(s => (
                  <div key={s.transactionId} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-800">
                      {tFmt('debtSuggestionLineFmt', [fmt(s.amount), s.debtName, fmt(s.principalPreview), fmt(s.profitPreview)])}
                    </span>
                    <span className="flex items-center gap-2 flex-shrink-0">
                      <button type="button" disabled={applyingSug === s.transactionId}
                        onClick={() => applySuggestion(s)}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs disabled:opacity-50">
                        {applyingSug === s.transactionId ? '…' : t('debtSuggestionApplyBtn')}
                      </button>
                      <button type="button" aria-label="dismiss"
                        onClick={() => setDismissedSug(prev => new Set(prev).add(s.transactionId))}
                        className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {ribaDebts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
              ⚠️ {tFmt('debtRibaWarningFmt', [ribaDebts.length])}
            </div>
          )}

          {debts.some(d => d.linkedSource === 'plaid') && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-sm text-emerald-800">
              {t('debtPlaidReadOnlyNotePrefix')} <Link href="/dashboard/import" className="font-semibold underline">{t('debtImportLinkText')}</Link> {t('debtPlaidReadOnlyNoteSuffix')}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">{t('debtTotalRemaining')}</p><p className="text-2xl font-bold text-red-600">{fmt(totalDebt)}</p></div>
            <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">{t('debtMonthlyPayments')}</p><p className="text-2xl font-bold text-orange-600">{fmt(totalMinPayment)}</p></div>
          </div>

          {burden && burden.debtCount > 0 && (
            <DebtBurdenPanel burden={burden} fmt={fmt} />
          )}

          {totalMinPayment === 0 && debts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700 flex items-start gap-2">
              <span className="mt-0.5">💡</span>
              <span>{t('debtAddMonthlyHint')}</span>
            </div>
          )}

          {activeDebts.length > 0 && (
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" checked={selectedIds.size === deletableActiveDebts.length && deletableActiveDebts.length > 0} onChange={toggleSelectAll} className="w-4 h-4 accent-[#1B5E20] rounded" />
                {selectedIds.size === deletableActiveDebts.length && deletableActiveDebts.length > 0 ? t('debtDeselectAll') : t('debtSelectAll')}
              </label>
              {selectedIds.size > 0 && (
                <>
                  <span className="text-sm text-gray-500">{tFmt('debtSelectedCountFmt', [selectedIds.size])}</span>
                  <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting} className="bg-red-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {bulkDeleting ? t('debtBulkDeleting') : tFmt('debtBulkDeleteFmt', [selectedIds.size])}
                  </button>
                  <button type="button" onClick={() => setSelectedIds(new Set())} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg">{t('debtClear')}</button>
                </>
              )}
              {selectedIds.size === 0 && deletableActiveDebts.length > 1 && (
                <button type="button" onClick={handleDeleteAll} disabled={bulkDeleting} className="ml-auto text-xs text-red-500 hover:text-red-700 disabled:opacity-50">{t('debtDeleteAll')}</button>
              )}
            </div>
          )}
          {activeDebts.length > 0 ? (
            <div className="space-y-3">
              {activeDebts.map((d: DebtItem) => {
                const pct = d.totalAmount > 0 ? ((d.totalAmount - d.remainingAmount) / d.totalAmount) * 100 : 0;
                // 2026-05-21: revolving credit (cards) shows utilization
                // (balance/limit, lower is better) instead of the always-0
                // "% paid". Backend sends utilizationPercentage + revolving.
                // 2026-06-10: `revolving` is only stamped on Plaid-linked maps,
                // so MANUAL credit cards still showed the misleading "0%" —
                // treat every credit_card as revolving regardless of source.
                const isRevolving = !!d.revolving || d.type === 'credit_card';
                const hasUtil = typeof d.utilizationPercentage === 'number';
                const barPct = hasUtil ? (d.utilizationPercentage as number) : pct;
                const showBar = !isRevolving || hasUtil; // revolving w/o a credit limit → no misleading bar
                const barColor = hasUtil
                  ? (barPct >= 70 ? 'bg-red-500' : barPct >= 30 ? 'bg-amber-500' : 'bg-emerald-600')
                  : 'bg-primary';
                const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
                return (
                  <div key={d.id} className="flex items-start gap-3">
                    <input type="checkbox" checked={selectedIds.has(d.id)} disabled={d.readOnly} onChange={() => toggleSelect(d.id)} className="mt-4 w-4 h-4 accent-[#1B5E20] rounded flex-shrink-0 disabled:opacity-40" />
                    <div className={`flex-1 bg-white rounded-xl p-4 border ${halal ? 'border-transparent' : 'border-red-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{d.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${halal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{halal ? t('debtHalalBadge') : t('debtRibaBadge')}</span>
                          {d.readOnly && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{t('debtLinkedPlaidBadge')}</span>}
                        </div>
                        <p className="text-sm text-gray-500">{TYPE_LABEL_KEYS[d.type] ? t(TYPE_LABEL_KEYS[d.type]) : d.type}{d.lender ? ` • ${d.lender}` : ''} • {tFmt('debtMonthlyPerMoFmt', [fmt(d.monthlyPayment)])}</p>
                        {d.readOnly && (
                          <p className="text-xs text-gray-500">
                            {[d.accountSubtype, d.accountMask ? `••${d.accountMask}` : null].filter(Boolean).join(' • ')}
                            {d.lastSyncedAt ? ` • ${tFmt('debtSyncedAtFmt', [new Date(d.lastSyncedAt).toLocaleDateString(dateLocale)])}` : ''}
                          </p>
                        )}
                        {d.monthlyPayment > 0 && d.remainingAmount > 0 && (
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            {(() => {
                              const mo = calcPayoffMonths(d.remainingAmount, d.monthlyPayment, d.interestRate || 0);
                              return mo === Infinity ? t('debtPaymentTooLow') : tFmt('debtMonthsToPayoffFmt', [mo]);
                            })()}
                          </p>
                        )}
                        {d.interestRate > 0 && (
                          <p className={`text-xs font-bold mt-0.5 ${halal ? 'text-green-700' : 'text-red-700'}`}>
                            {ISLAMIC_TYPES.includes(d.type) ? tFmt('debtProfitRateFmt', [d.interestRate]) : tFmt('debtInterestRateFmt', [d.interestRate])}
                          </p>
                        )}
                        {halal && d.type === 'credit_card' && !ISLAMIC_TYPES.includes(d.type) && (
                          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1.5 leading-snug">
                            <span aria-hidden="true">⚠️ </span>
                            {t('debtCreditCardHalalCaveat')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!d.readOnly ? (
                          <>
                            <button type="button" onClick={() => { setPayModal(d); setPayAmount(String(d.monthlyPayment)); }} className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm hover:bg-primary/90">{t('debtPayBtn')}</button>
                            <button type="button" onClick={() => openEdit(d)} className="text-gray-500 hover:text-primary text-sm border border-gray-300 px-3 py-1 rounded-lg">{t('debtEditBtn')}</button>
                            <button type="button" onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === d.id ? t('debtDeleting') : t('debtDeleteShort')}</button>
                          </>
                        ) : (
                          <Link href="/dashboard/import" className="text-gray-500 hover:text-primary text-sm border border-gray-300 px-3 py-1 rounded-lg">{t('debtManageBtn')}</Link>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      {isRevolving ? (
                        <span className="text-gray-700 font-medium">
                          {hasUtil
                            ? tFmt('debtUtilizationFmt', [fmt(d.remainingAmount), barPct.toFixed(0)])
                            : tFmt('debtBalanceFmt', [fmt(d.remainingAmount)])}
                        </span>
                      ) : (
                        <>
                          <span className="text-gray-500">{tFmt('debtPaidFmt', [fmt(d.totalAmount - d.remainingAmount)])}</span>
                          <span className="text-gray-700 font-medium">{tFmt('debtRemainingLeftFmt', [fmt(d.remainingAmount), pct.toFixed(0)])}</span>
                        </>
                      )}
                    </div>
                    {showBar && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${barColor} h-2 rounded-full`} style={{ width: `${Math.min(barPct, 100)}%` }} />
                      </div>
                    )}
                  </div>
                  </div>
                );
              })}
            </div>
          ) : paidOffDebts.length > 0 ? (
            <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🎉</p><p className="text-lg font-semibold text-green-700">{t('debtNoActiveDebts')}</p><p className="text-sm mt-1">{t('debtSeePaidOffBelow')}</p></div>
          ) : (
            <EmptyState
              icon="🎉"
              title={t('debtEmptyTitle')}
              description={t('debtEmptyDesc')}
              variant="bare"
            />
          )}

          {paidOffDebts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-green-700 mb-3">{t('debtPaidOffHeading')}</h2>
              <p className="text-sm text-gray-600 mb-4">{t('debtPaidOffCongrats')}</p>
              <div className="space-y-3">
                {paidOffDebts.map((d: DebtItem) => {
                  const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
                  return (
                    <div key={d.id} className="flex items-start gap-3 opacity-60">
                      <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-600 line-through">{d.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{t('debtPaidOffBadge')}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${halal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{halal ? t('debtHalalBadge') : t('debtRibaBadge')}</span>
                              {d.readOnly && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{t('debtLinkedPlaidBadge')}</span>}
                            </div>
                            <p className="text-sm text-gray-500">{TYPE_LABEL_KEYS[d.type] ? t(TYPE_LABEL_KEYS[d.type]) : d.type}{d.lender ? ` • ${d.lender}` : ''}</p>
                          </div>
                          {!d.readOnly && (
                            <button type="button" onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === d.id ? t('debtDeleting') : t('debtDeleteShort')}</button>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{t('debtTotalPaidLabel')} <span className="font-semibold text-gray-700">{fmt(d.totalAmount)}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PROJECTOR TAB ── */}
      {tab === 'projector' && (
        <div className="space-y-6">
          {debts.length === 0 ? (
            <EmptyState
              icon="🔮"
              title={t('debtProjEmptyTitle')}
              description={t('debtProjEmptyDesc')}
              actions={[{ label: t('debtProjAddCta'), href: '#', primary: true }]}
              preview={
                <div className="space-y-2">
                  {[
                    { name: t('debtProjSample1Name'), balance: fmt(18400), payoff: tFmt('debtProjSample1PayoffFmt', [fmt(200)]) },
                    { name: t('debtProjSample2Name'), balance: fmt(3200), payoff: tFmt('debtProjSample2PayoffFmt', [fmt(200)]) },
                  ].map((d) => (
                    <div key={d.name} className="bg-white rounded-xl p-3 text-left text-sm">
                      <p className="font-medium text-gray-700">{d.name}</p>
                      <p className="text-xs text-gray-400">{tFmt('debtProjSampleBalanceFmt', [d.balance, d.payoff])}</p>
                    </div>
                  ))}
                </div>
              }
            />
          ) : (
            <>
              {/* Extra payment slider */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-primary text-lg mb-1">{t('debtProjExtraTitle')}</h2>
                <p className="text-sm text-gray-500 mb-4">{t('debtProjExtraSubtitle')}</p>
                <div className="flex items-center gap-4">
                  <input type="range" min={0} max={2000} step={25} value={extra}
                    onChange={e => setExtra(Number(e.target.value))}
                    className="flex-1 accent-[#1B5E20]"
                    aria-label={t('debtProjExtraTitle')} />
                  <span className="text-xl font-bold text-primary w-24 text-right">{fmt(extra)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{symbol}0</span><span>{symbol}500</span><span>{symbol}1,000</span><span>{symbol}1,500</span><span>{symbol}2,000</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {tFmt('debtProjTotalMonthlyFmt', [fmt(totalMinPayment + extra), fmt(totalMinPayment), fmt(extra)])}
                </p>
              </div>

              {/* Strategy comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Avalanche */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-primary">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🏔️</span>
                    <div>
                      <p className="font-bold text-primary">{t('debtProjAvalanche')}</p>
                      <p className="text-xs text-gray-500">{t('debtProjAvalancheSub')}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('debtProjDebtFreeDate')}</span>
                      <span className="font-bold text-gray-900">{projAvalanche.months === 0 ? '—' : addMonths(projAvalanche.months)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('debtProjMonthsPayoff')}</span>
                      <span className="font-bold text-gray-900">{projAvalanche.months}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('debtProjTotalInterest')}</span>
                      <span className="font-bold text-red-600">{fmt(projAvalanche.totalInterest)}</span>
                    </div>
                    {extra > 0 && (
                      <div className="bg-green-50 rounded-xl p-3 mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">{t('debtProjMonthsSaved')}</span>
                          <span className="font-bold text-green-700">{monthsSavedAvalanche > 0 ? tFmt('debtProjMonthsCountFmt', [monthsSavedAvalanche]) : '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">{t('debtProjInterestSaved')}</span>
                          <span className="font-bold text-green-700">{interestSavedAvalanche > 0 ? fmt(interestSavedAvalanche) : '—'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Snowball */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⛄</span>
                    <div>
                      <p className="font-bold text-blue-600">{t('debtProjSnowball')}</p>
                      <p className="text-xs text-gray-500">{t('debtProjSnowballSub')}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('debtProjDebtFreeDate')}</span>
                      <span className="font-bold text-gray-900">{projSnowball.months === 0 ? '—' : addMonths(projSnowball.months)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('debtProjMonthsPayoff')}</span>
                      <span className="font-bold text-gray-900">{projSnowball.months}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('debtProjTotalInterest')}</span>
                      <span className="font-bold text-red-600">{fmt(projSnowball.totalInterest)}</span>
                    </div>
                    {extra > 0 && (
                      <div className="bg-blue-50 rounded-xl p-3 mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">{t('debtProjMonthsSaved')}</span>
                          <span className="font-bold text-blue-700">{monthsSavedSnowball > 0 ? tFmt('debtProjMonthsCountFmt', [monthsSavedSnowball]) : '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">{t('debtProjInterestSaved')}</span>
                          <span className="font-bold text-blue-700">{interestSavedSnowball > 0 ? fmt(interestSavedSnowball) : '—'}</span>
                        </div>
                      </div>
                    )}
                    {extra > 0 && projAvalanche.months < projSnowball.months && (
                      <div className="mt-2 text-xs text-gray-400">
                        ℹ️ {tFmt('debtProjAvalancheBeatsFmt', [projSnowball.months - projAvalanche.months, fmt(projSnowball.totalInterest - projAvalanche.totalInterest)])}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {backendStrategies && (
                <PayoffTimelineChart
                  result={backendStrategies[backendStrategies.comparison.recommended] || backendStrategies.avalanche}
                  recommended={backendStrategies.comparison.recommended}
                  fmt={fmt}
                />
              )}

              {/* Per-debt breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-primary mb-4">{t('debtProjGlanceTitle')}</h2>
                <div className="space-y-3">
                  {[...debts].sort((a, b) => b.interestRate - a.interestRate).map(d => {
                    const monthsLeft = d.monthlyPayment > 0 && d.remainingAmount > 0
                      ? calcPayoffMonths(d.remainingAmount, d.monthlyPayment, d.interestRate || 0)
                      : null;
                    const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
                    return (
                      <div key={d.id} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">{d.name}</p>
                            {!halal && <span className="text-xs bg-red-100 text-red-700 px-1.5 rounded">{t('debtRibaBadge')}</span>}
                          </div>
                          <p className="text-xs text-gray-500">{tFmt('debtProjGlanceRateFmt', [fmt(d.monthlyPayment), d.interestRate])}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900">{fmt(d.remainingAmount)}</p>
                          <p className="text-xs text-gray-500">{monthsLeft === null ? '—' : monthsLeft === Infinity ? '∞' : tFmt('debtProjGlanceMonthsFmt', [monthsLeft])}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  ⚠️ {t('debtProjGlanceFootnote')}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <ModalShell onClose={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary mb-4">{editDebt ? t('debtModalEdit') : t('debtModalAdd')}</h2>
            <div className="space-y-4">
              {/* 2026-06-08 (A11Y-DASHBOARD-FORM-LABELS-1): htmlFor + id
                  pairs so screen readers announce the field's label when
                  focused, instead of just "edit text". */}
              <div><label htmlFor="debt-form-name" className="block text-sm font-medium text-gray-700 mb-1">{t('debtFormName')}</label>
                <input id="debt-form-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('debtFormNamePh')} /></div>
              <div><label htmlFor="debt-form-type" className="block text-sm font-medium text-gray-700 mb-1">{t('debtFormType')}</label>
                <select id="debt-form-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value, ribaFree: ISLAMIC_TYPES.includes(e.target.value) ? true : form.ribaFree })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(typeKey => <option key={typeKey} value={typeKey}>{t(TYPE_LABEL_KEYS[typeKey])}</option>)}
                </select></div>
              {isIslamic && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">✅ {t('debtFormIslamicHalal')}</div>}
              <div><label htmlFor="debt-form-total" className="block text-sm font-medium text-gray-700 mb-1">{t('debtFormTotal')}</label>
                <input id="debt-form-total" type="number" step="0.01" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label htmlFor="debt-form-remaining" className="block text-sm font-medium text-gray-700 mb-1">{t('debtFormRemaining')}</label>
                <input id="debt-form-remaining" type="number" step="0.01" value={form.remainingAmount} onChange={e => setForm({ ...form, remainingAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('debtFormRemainingPh')} /></div>
              <div><label htmlFor="debt-form-monthly-payment" className="block text-sm font-medium text-gray-700 mb-1">{t('debtFormMonthlyPayment')}</label>
                <input id="debt-form-monthly-payment" type="number" step="0.01" value={form.monthlyPayment} onChange={e => setForm({ ...form, monthlyPayment: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label htmlFor="debt-form-rate" className="block text-sm font-medium text-gray-700 mb-1">{isIslamic ? t('debtFormProfitRate') : t('debtFormInterestRate')}</label>
                <input id="debt-form-rate" type="number" step="0.1" value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label htmlFor="debt-form-lender" className="block text-sm font-medium text-gray-700 mb-1">{t('debtFormLender')}</label>
                <input id="debt-form-lender" value={form.lender} onChange={e => setForm({ ...form, lender: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('debtFormLenderPh')} /></div>
              {!isIslamic && <div className="flex items-center gap-2"><input type="checkbox" checked={form.ribaFree} onChange={e => setForm({ ...form, ribaFree: e.target.checked })} className="w-4 h-4" /><label className="text-sm text-gray-700">{t('debtFormRibaFree')}</label></div>}
              {!isHalal && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">⚠️ {t('debtFormRibaWarning')}</div>}
            </div>
            {saveError && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{saveError}</div>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('debtFormCancel')}</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name || !form.totalAmount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('debtFormSaving') : editDebt ? t('debtFormUpdate') : t('debtFormSave')}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Pay Modal */}
      {payModal && (
        <ModalShell onClose={() => setPayModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-primary mb-2">{t('debtPayModalTitle')}</h2>
            <p className="text-gray-500 text-sm mb-4">{tFmt('debtPayModalSubtitleFmt', [payModal.name, fmt(payModal.remainingAmount)])}</p>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('debtPayAmount')}</label>
              <input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            {payError && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{payError}</div>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setPayModal(null); setPayError(null); }} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('debtFormCancel')}</button>
              <button type="button" onClick={handlePay} disabled={saving || !payAmount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('debtPayProcessing') : t('debtPayBtnGo')}</button>
            </div>
          </div>
        </ModalShell>
      )}
      {confirmAction && (
        <ModalShell onClose={() => setConfirmAction(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('debtFormCancel')}</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('debtConfirmBtn')}</button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function PayoffTimelineChart({
  result,
  recommended,
  fmt,
}: {
  result: BackendStrategyResult;
  recommended: 'snowball' | 'avalanche';
  fmt: (n: number) => string;
}) {
  const series = result.monthlySeries || [];
  if (series.length === 0) return null;

  const TICKS = 36;
  const step = Math.max(1, Math.ceil(series.length / TICKS));
  const sampled = series.filter((_, i) => i % step === 0 || i === series.length - 1);

  const maxTotal = Math.max(...sampled.map(s => s.totalRemaining), 1);
  const palette = ['#1B5E20', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#db2777'];
  const debtColors = new Map<number, string>();
  result.debts.forEach((d, i) => debtColors.set(d.id, palette[i % palette.length]));

  const recommendedLabel = recommended === 'avalanche' ? tStandalone('debtProjAvalanche') : tStandalone('debtProjSnowball');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div>
          <h2 className="font-bold text-primary">{tStandalone('debtTimelineTitle')}</h2>
          <p className="text-xs text-gray-500">
            {tFmtStandalone('debtTimelineRecommendedPrefixFmt', [recommendedLabel])}
            {result.monthsToDebtFree
              ? tFmtStandalone('debtTimelineClearsInFmt', [result.monthsToDebtFree, fmt(result.totalInterestPaid)])
              : tStandalone('debtTimelineTooLong')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.debts.map(d => (
            <span key={d.id} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-sm" style={{ background: debtColors.get(d.id) }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-[2px] h-40 mt-4 border-b border-gray-200">
        {sampled.map(tick => {
          const segs = (tick.debts || []).filter(d => d.remaining > 0);
          const heightPct = (tick.totalRemaining / maxTotal) * 100;
          return (
            <div
              key={tick.month}
              className="flex-1 flex flex-col-reverse justify-end relative group min-w-[3px]"
              style={{ height: `${heightPct}%` }}
              title={tFmtStandalone('debtTimelineHoverFmt', [tick.month, fmt(tick.totalRemaining)])}
            >
              {segs.map(s => {
                const segHeight = tick.totalRemaining > 0 ? (s.remaining / tick.totalRemaining) * 100 : 0;
                return (
                  <div
                    key={s.id}
                    style={{
                      height: `${segHeight}%`,
                      background: debtColors.get(s.id) || '#9ca3af',
                    }}
                    className="w-full"
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>{tFmtStandalone('debtTimelineMonthFmt', [1])}</span>
        <span>{tFmtStandalone('debtTimelineMonthFmt', [result.monthsToDebtFree ?? result.monthsSimulated])}</span>
      </div>

      <div className="mt-4 space-y-1">
        {result.perDebtPayoffMonth
          .filter(p => p.monthPaidOff !== null)
          .sort((a, b) => (a.monthPaidOff ?? 999) - (b.monthPaidOff ?? 999))
          .map(p => (
            <div key={p.id} className="flex items-center gap-2 text-xs text-gray-700">
              <span className="w-3 h-3 rounded-sm" style={{ background: debtColors.get(p.id) || '#9ca3af' }} />
              <span className="font-medium">{p.name}</span>
              <span className="text-gray-500">{tFmtStandalone('debtTimelineClearedAtFmt', [p.monthPaidOff ?? 0])}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

function DebtBurdenPanel({
  burden,
  fmt,
}: {
  burden: DebtBurden;
  fmt: (n: number) => string;
}) {
  const dtiPct = burden.debtToIncomeRatio != null ? Math.round(burden.debtToIncomeRatio * 100) : null;
  const ribaPct = Math.round(burden.ribaShareOfPayments * 100);
  const bandStyle: Record<DebtBurden['dtiBand'], { labelKey: string; cls: string }> = {
    healthy: { labelKey: 'debtBurdenHealthy', cls: 'text-emerald-700' },
    moderate: { labelKey: 'debtBurdenModerate', cls: 'text-amber-700' },
    elevated: { labelKey: 'debtBurdenElevated', cls: 'text-red-600' },
    unknown: { labelKey: '', cls: '' },
  };
  const band = bandStyle[burden.dtiBand];
  const bandLabel = band.labelKey ? tStandalone(band.labelKey) : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <h2 className="text-lg font-bold text-primary mb-1">{tStandalone('debtBurdenHeading')}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {tStandalone('debtBurdenSubtitle')}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">{tStandalone('debtBurdenDTI')}</p>
          {dtiPct != null && burden.dtiBand !== 'unknown' ? (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {dtiPct}% <span className={`text-base font-semibold ${band.cls}`}>· {bandLabel}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {tFmtStandalone('debtBurdenDTIDetailFmt', [fmt(burden.totalMonthlyDebtPayment), fmt(burden.detectedMonthlyIncome)])}
                {' '}{tStandalone('debtBurdenDTIComfortable')}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              {tStandalone('debtBurdenDTIUnknown')}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">{tStandalone('debtBurdenRibaHeading')}</p>
          {burden.ribaBearingDebtCount === 0 ? (
            <p className="text-sm text-emerald-700 mt-1 font-medium">
              {tStandalone('debtBurdenAllRibaFree')}
            </p>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {ribaPct}% <span className="text-base font-semibold text-red-600">{tStandalone('debtBurdenRibaBearingLabel')}</span>
              </p>
              <div className="mt-2 flex h-2 rounded-full overflow-hidden bg-gray-200">
                <div className="bg-red-500" style={{ width: `${ribaPct}%` }} />
                <div className="bg-emerald-500" style={{ width: `${100 - ribaPct}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {tFmtStandalone('debtBurdenRibaSplitFmt', [fmt(burden.ribaBearingMonthly), fmt(burden.ribaFreeMonthly)])}
                {' '}<Link href="/dashboard/riba" className="text-primary underline">{tStandalone('debtBurdenRibaJourneyLink')}</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
