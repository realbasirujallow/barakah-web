'use client';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';

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
  readOnly?: boolean;
  notes?: string | null;
  accountMask?: string | null;
  accountSubtype?: string | null;
  lastSyncedAt?: number | null;
}

const TYPES = ['islamic_mortgage', 'conventional_mortgage', 'personal_loan', 'student_loan', 'car_loan', 'qard_hasan', 'credit_card', 'business_loan', 'other'];
const ISLAMIC_TYPES = ['islamic_mortgage', 'qard_hasan'];
const TYPE_LABELS: Record<string, string> = {
  islamic_mortgage: 'Islamic Mortgage', conventional_mortgage: 'Conventional Mortgage', personal_loan: 'Personal Loan', student_loan: 'Student Loan',
  car_loan: 'Car Loan', qard_hasan: "Qard Hasan (Interest-Free)", credit_card: 'Credit Card', business_loan: 'Business Loan', other: 'Other',
};

const emptyForm = { name: '', type: 'qard_hasan', totalAmount: '', remainingAmount: '', monthlyPayment: '', interestRate: '0', lender: '', ribaFree: true };

/* ── Payoff simulation ──────────────────────────────────────────── */
interface SimDebt { id: number; name: string; balance: number; monthlyPayment: number; rate: number; }

function simulatePayoff(rawDebts: DebtItem[], extra = 0, strategy: 'avalanche' | 'snowball' = 'avalanche') {
  if (!rawDebts.length) return { months: 0, totalInterest: 0, schedule: [] };
  let debts: SimDebt[] = rawDebts.map(d => ({
    id: d.id, name: d.name,
    balance: d.remainingAmount,
    monthlyPayment: d.monthlyPayment || 0,
    rate: d.interestRate || 0,
  }));

  if (strategy === 'avalanche') debts = [...debts].sort((a, b) => b.rate - a.rate);
  else debts = [...debts].sort((a, b) => a.balance - b.balance);

  let month = 0;
  let totalInterest = 0;
  const MAX = 600; // 50 years cap

  while (debts.some(d => d.balance > 0.01) && month < MAX) {
    month++;
    // Accrue monthly interest
    debts.forEach(d => {
      if (d.balance > 0) {
        const interest = d.balance * (d.rate / 100 / 12);
        const roundedInterest = parseFloat(interest.toFixed(2));
        d.balance = parseFloat((d.balance + roundedInterest).toFixed(2));
        totalInterest += roundedInterest;
      }
    });
    // Pay minimums
    debts.forEach(d => {
      if (d.balance > 0) {
        const pay = Math.min(d.monthlyPayment, d.balance);
        d.balance = Math.max(0, d.balance - pay);
      }
    });
    // Apply extra to first debt in sorted order
    let left = extra;
    for (const d of debts) {
      if (d.balance > 0 && left > 0) {
        const pay = Math.min(left, d.balance);
        d.balance = Math.max(0, d.balance - pay);
        left -= pay;
      }
    }
  }
  return { months: month, totalInterest };
}

function addMonths(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/* ── Component ─────────────────────────────────────────────────── */
export default function DebtsPage() {
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDebt, setEditDebt] = useState<DebtItem | null>(null);
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
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  const { symbol } = useCurrency();

  const load = () => {
    setLoading(true);
    api.getDebts()
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          return;
        }
        setDebts(Array.isArray(d?.debts) ? d.debts : Array.isArray(d) ? d : []);
      })
      .catch(() => { toast('Failed to load debts', 'error'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditDebt(null); setForm(emptyForm); setSaveError(null); setShowForm(true); };
  const openEdit = (d: DebtItem) => {
    setEditDebt(d);
    setForm({ name: d.name, type: d.type, totalAmount: String(d.totalAmount), remainingAmount: String(d.remainingAmount), monthlyPayment: String(d.monthlyPayment), interestRate: String(d.interestRate), lender: d.lender || '', ribaFree: d.ribaFree });
    setSaveError(null); setShowForm(true);
  };

  const isIslamic = ISLAMIC_TYPES.includes(form.type);
  const isHalal = isIslamic || form.ribaFree;

  const handleSave = async () => {
    setSaving(true); setSaveError(null); setFormError(null);
    try {
      const totalAmt = parseFloat(form.totalAmount);
      if (!Number.isFinite(totalAmt) || totalAmt <= 0) { const msg = 'Total amount must be a positive number'; setFormError(msg); toast(msg, 'error'); setSaving(false); return; }
      const MAX_VALUE = 1_000_000_000;
      if (totalAmt > MAX_VALUE) { const msg = `Debt amount cannot exceed ${symbol}${MAX_VALUE.toLocaleString()}`; setFormError(msg); toast(msg, 'error'); setSaving(false); return; }
      if (!/^\d+(\.\d{1,2})?$/.test(form.totalAmount.trim())) {
        const msg = 'Please enter an amount with up to 2 decimal places';
        setFormError(msg); toast(msg, 'error');
        setSaving(false);
        return;
      }
      const monthlyPay = parseFloat(form.monthlyPayment || '0');
      if (!Number.isFinite(monthlyPay) || monthlyPay < 0) { const msg = 'Monthly payment must be a non-negative number'; setFormError(msg); toast(msg, 'error'); setSaving(false); return; }
      const remainingAmt = parseFloat(form.remainingAmount || form.totalAmount);
      if (!Number.isFinite(remainingAmt) || remainingAmt < 0) { const msg = 'Remaining amount must be non-negative'; setFormError(msg); toast(msg, 'error'); setSaving(false); return; }
      const intRate = parseFloat(form.interestRate || '0');
      if (!Number.isFinite(intRate) || intRate < 0) { const msg = 'Interest rate must be non-negative'; setFormError(msg); toast(msg, 'error'); setSaving(false); return; }
      const payload = { ...form, totalAmount: totalAmt, remainingAmount: remainingAmt, monthlyPayment: monthlyPay, interestRate: intRate, ribaFree: isHalal };
      const result = editDebt ? await api.updateDebt(editDebt.id, payload) : await api.addDebt(payload);
      if (result?.error) throw new Error(result.error);
      setShowForm(false); setForm(emptyForm); load();
    } catch (err: unknown) { setSaveError(err instanceof Error ? err.message : 'Failed to save debt. Please try again.'); }
    setSaving(false);
  };

  // Debounce ref prevents double-clicks on the Pay button from creating
  // duplicate transactions (BUG 4 in QA report).
  const payingRef = React.useRef(false);

  const handlePay = async () => {
    if (!payModal || payingRef.current) return;
    const amount = parseFloat(payAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setPayError('Please enter a valid positive amount');
      return;
    }
    payingRef.current = true;
    setSaving(true); setPayError(null);
    try {
      const result = await api.makeDebtPayment(payModal.id, amount);
      if (result?.error) throw new Error(result.error);
      setPayModal(null); setPayAmount(''); load();
    } catch (err: unknown) { setPayError(err instanceof Error ? err.message : 'Failed to record payment. Please try again.'); }
    setSaving(false);
    // Allow another payment after a 2-second cooldown
    setTimeout(() => { payingRef.current = false; }, 2000);
  };

  const handleDelete = (id: number) => {
    const debt = debts.find(item => item.id === id);
    if (debt?.readOnly) {
      toast('Linked Plaid liabilities are read-only here. Manage them from Import instead.', 'error');
      return;
    }
    setConfirmAction({
      message: 'Delete this debt?',
      action: async () => {
        setDeletingId(id);
        try {
          await api.deleteDebt(id);
          toast('Debt deleted', 'success');
        } catch (err) {
          logError(err, { context: 'Failed to delete debt' });
          toast('Failed to delete debt', 'error');
        } finally {
          setDeletingId(null);
          load();
        }
      }
    });
  };

  const toggleSelect = (id: number) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === deletableActiveDebts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(deletableActiveDebts.map(d => d.id)));
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    setConfirmAction({
      message: `Delete ${count} debt${count !== 1 ? 's' : ''}? This cannot be undone.`,
      action: async () => {
        setBulkDeleting(true);
        try {
          await api.bulkDeleteDebts(Array.from(selectedIds));
          setSelectedIds(new Set());
          load();
          toast(`${count} debt${count !== 1 ? 's' : ''} deleted`, 'success');
        } catch { toast('Failed to delete debts', 'error'); }
        setBulkDeleting(false);
      }
    });
  };

  const handleDeleteAll = () => {
    setConfirmAction({
      message: `Delete ALL ${debts.length} debts? This cannot be undone.`,
      action: async () => {
        setBulkDeleting(true);
        try {
          await api.deleteAllDebts();
          setSelectedIds(new Set());
          load();
          toast('All debts deleted', 'success');
        } catch { toast('Failed to delete all debts', 'error'); }
        setBulkDeleting(false);
      }
    });
  };

  // Projector calculations
  const totalMinPayment = useMemo(() => debts.reduce((s, d) => s + (d.monthlyPayment || 0), 0), [debts]);
  const projBase       = useMemo(() => simulatePayoff(debts, 0, 'avalanche'), [debts]);
  const projAvalanche  = useMemo(() => simulatePayoff(debts, extra, 'avalanche'), [debts, extra]);
  const projSnowball   = useMemo(() => simulatePayoff(debts, extra, 'snowball'), [debts, extra]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalDebt  = debts.reduce((s, d) => s + d.remainingAmount, 0);
  const paidOffDebts = debts.filter(d => d.remainingAmount === 0);
  const activeDebts = debts.filter(d => d.remainingAmount > 0);
  const deletableActiveDebts = activeDebts.filter(d => !d.readOnly);
  const ribaDebts  = activeDebts.filter(d => !d.ribaFree && !ISLAMIC_TYPES.includes(d.type));
  const monthsSavedAvalanche  = projBase.months - projAvalanche.months;
  const interestSavedAvalanche = projBase.totalInterest - projAvalanche.totalInterest;
  const monthsSavedSnowball   = projBase.months - projSnowball.months;
  const interestSavedSnowball  = projBase.totalInterest - projSnowball.totalInterest;

  return (
    <div>
      {/* Header + tabs */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Debt Tracker</h1>
        <button type="button" onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Debt</button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['debts', 'projector'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {t === 'debts' ? '📋 My Debts' : '🔮 Payoff Projector'}
          </button>
        ))}
      </div>

      {/* ── DEBTS TAB ── */}
      {tab === 'debts' && (
        <>
          {ribaDebts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
              ⚠️ <strong>{ribaDebts.length} debt(s)</strong> involve riba (interest). Consider Islamic alternatives.
            </div>
          )}

          {debts.some(d => d.linkedSource === 'plaid') && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-sm text-emerald-800">
              Linked Plaid credit and loan balances now appear here as read-only liabilities. Use <Link href="/dashboard/import" className="font-semibold underline">Import</Link> to resync or manage linked accounts.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Remaining</p><p className="text-2xl font-bold text-red-600">{fmt(totalDebt)}</p></div>
            <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Monthly Payments</p><p className="text-2xl font-bold text-orange-600">{fmt(totalMinPayment)}</p></div>
          </div>

          {totalMinPayment === 0 && debts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700 flex items-start gap-2">
              <span className="mt-0.5">💡</span>
              <span>Add monthly payment amounts to your debts to unlock the <strong>Payoff Projector</strong> and see when you&apos;ll be debt-free.</span>
            </div>
          )}

          {activeDebts.length > 0 && (
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input type="checkbox" checked={selectedIds.size === deletableActiveDebts.length && deletableActiveDebts.length > 0} onChange={toggleSelectAll} className="w-4 h-4 accent-[#1B5E20] rounded" />
                {selectedIds.size === deletableActiveDebts.length && deletableActiveDebts.length > 0 ? 'Deselect all' : 'Select all'}
              </label>
              {selectedIds.size > 0 && (
                <>
                  <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
                  <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting} className="bg-red-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}`}
                  </button>
                  <button type="button" onClick={() => setSelectedIds(new Set())} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg">Clear</button>
                </>
              )}
              {selectedIds.size === 0 && deletableActiveDebts.length > 1 && (
                <button type="button" onClick={handleDeleteAll} disabled={bulkDeleting} className="ml-auto text-xs text-red-500 hover:text-red-700 disabled:opacity-50">Delete all</button>
              )}
            </div>
          )}
          {activeDebts.length > 0 ? (
            <div className="space-y-3">
              {activeDebts.map((d: DebtItem) => {
                const pct = d.totalAmount > 0 ? ((d.totalAmount - d.remainingAmount) / d.totalAmount) * 100 : 0;
                const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
                return (
                  <div key={d.id} className="flex items-start gap-3">
                    <input type="checkbox" checked={selectedIds.has(d.id)} disabled={d.readOnly} onChange={() => toggleSelect(d.id)} className="mt-4 w-4 h-4 accent-[#1B5E20] rounded flex-shrink-0 disabled:opacity-40" />
                    <div className={`flex-1 bg-white rounded-xl p-4 border ${halal ? 'border-transparent' : 'border-red-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{d.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${halal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{halal ? 'Halal' : 'Riba'}</span>
                          {d.readOnly && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Linked via Plaid</span>}
                        </div>
                        <p className="text-sm text-gray-500">{TYPE_LABELS[d.type] || d.type}{d.lender ? ` • ${d.lender}` : ''} • {fmt(d.monthlyPayment)}/mo</p>
                        {d.readOnly && (
                          <p className="text-xs text-gray-500">
                            {[d.accountSubtype, d.accountMask ? `••${d.accountMask}` : null].filter(Boolean).join(' • ')}
                            {d.lastSyncedAt ? ` • Synced ${new Date(d.lastSyncedAt).toLocaleDateString()}` : ''}
                          </p>
                        )}
                        {d.monthlyPayment > 0 && d.remainingAmount > 0 && (
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            ~{Math.ceil(d.remainingAmount / d.monthlyPayment)} months to payoff
                          </p>
                        )}
                        {d.interestRate > 0 && (
                          <p className={`text-xs font-bold mt-0.5 ${halal ? 'text-green-700' : 'text-red-700'}`}>
                            {ISLAMIC_TYPES.includes(d.type) ? `Profit Rate: ${d.interestRate}% (Halal)` : `Interest: ${d.interestRate}% (Riba)`}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!d.readOnly ? (
                          <>
                            <button type="button" onClick={() => { setPayModal(d); setPayAmount(String(d.monthlyPayment)); }} className="bg-[#1B5E20] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#2E7D32]">Pay</button>
                            <button type="button" onClick={() => openEdit(d)} className="text-gray-500 hover:text-[#1B5E20] text-sm border border-gray-300 px-3 py-1 rounded-lg">Edit</button>
                            <button type="button" onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === d.id ? 'Deleting...' : 'Del'}</button>
                          </>
                        ) : (
                          <Link href="/dashboard/import" className="text-gray-500 hover:text-[#1B5E20] text-sm border border-gray-300 px-3 py-1 rounded-lg">Manage</Link>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Paid: {fmt(d.totalAmount - d.remainingAmount)}</span>
                      <span className="text-gray-700 font-medium">{fmt(d.remainingAmount)} left • {pct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#1B5E20] h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          ) : paidOffDebts.length > 0 ? (
            <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🎉</p><p className="text-lg font-semibold text-green-700">No active debts!</p><p className="text-sm mt-1">See paid-off debts below</p></div>
          ) : (
            <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🎉</p><p>No debts — Alhamdulillah!</p></div>
          )}

          {paidOffDebts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-green-700 mb-3">Paid Off</h2>
              <p className="text-sm text-gray-600 mb-4">Congratulations on completing these debts!</p>
              <div className="space-y-3">
                {paidOffDebts.map((d: DebtItem) => {
                  const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
                  return (
                    <div key={d.id} className="flex items-start gap-3 opacity-60">
                      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-600 line-through">{d.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Paid Off</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${halal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{halal ? 'Halal' : 'Riba'}</span>
                              {d.readOnly && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Linked via Plaid</span>}
                            </div>
                            <p className="text-sm text-gray-500">{TYPE_LABELS[d.type] || d.type}{d.lender ? ` • ${d.lender}` : ''}</p>
                          </div>
                          {!d.readOnly && (
                            <button type="button" onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === d.id ? 'Deleting...' : 'Del'}</button>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Total paid: <span className="font-semibold text-gray-700">{fmt(d.totalAmount)}</span></div>
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
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔮</p>
              <p className="font-medium">Add some debts first to see payoff projections.</p>
            </div>
          ) : (
            <>
              {/* Extra payment slider */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1B5E20] text-lg mb-1">Extra Monthly Payment</h2>
                <p className="text-sm text-gray-500 mb-4">How much extra can you put toward debt each month, beyond minimums?</p>
                <div className="flex items-center gap-4">
                  <input type="range" min={0} max={2000} step={25} value={extra}
                    onChange={e => setExtra(Number(e.target.value))}
                    className="flex-1 accent-[#1B5E20]" />
                  <span className="text-xl font-bold text-[#1B5E20] w-24 text-right">{fmt(extra)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{symbol}0</span><span>{symbol}500</span><span>{symbol}1,000</span><span>{symbol}1,500</span><span>{symbol}2,000</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Total monthly payment: <strong className="text-gray-700">{fmt(totalMinPayment + extra)}</strong>
                  &nbsp;({fmt(totalMinPayment)} minimums + {fmt(extra)} extra)
                </p>
              </div>

              {/* Strategy comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Avalanche */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-[#1B5E20]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🏔️</span>
                    <div>
                      <p className="font-bold text-[#1B5E20]">Avalanche</p>
                      <p className="text-xs text-gray-500">Highest interest rate first — saves the most money</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Debt-free date</span>
                      <span className="font-bold text-gray-900">{projAvalanche.months === 0 ? '—' : addMonths(projAvalanche.months)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Months to payoff</span>
                      <span className="font-bold text-gray-900">{projAvalanche.months}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total interest</span>
                      <span className="font-bold text-red-600">{fmt(projAvalanche.totalInterest)}</span>
                    </div>
                    {extra > 0 && (
                      <div className="bg-green-50 rounded-xl p-3 mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">Months saved</span>
                          <span className="font-bold text-green-700">{monthsSavedAvalanche > 0 ? `${monthsSavedAvalanche} months` : '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">Interest saved</span>
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
                      <p className="font-bold text-blue-600">Snowball</p>
                      <p className="text-xs text-gray-500">Smallest balance first — builds momentum &amp; motivation</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Debt-free date</span>
                      <span className="font-bold text-gray-900">{projSnowball.months === 0 ? '—' : addMonths(projSnowball.months)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Months to payoff</span>
                      <span className="font-bold text-gray-900">{projSnowball.months}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total interest</span>
                      <span className="font-bold text-red-600">{fmt(projSnowball.totalInterest)}</span>
                    </div>
                    {extra > 0 && (
                      <div className="bg-blue-50 rounded-xl p-3 mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Months saved</span>
                          <span className="font-bold text-blue-700">{monthsSavedSnowball > 0 ? `${monthsSavedSnowball} months` : '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Interest saved</span>
                          <span className="font-bold text-blue-700">{interestSavedSnowball > 0 ? fmt(interestSavedSnowball) : '—'}</span>
                        </div>
                      </div>
                    )}
                    {extra > 0 && projAvalanche.months < projSnowball.months && (
                      <div className="mt-2 text-xs text-gray-400">
                        ℹ️ Avalanche finishes {projSnowball.months - projAvalanche.months} month(s) sooner and saves {fmt(projSnowball.totalInterest - projAvalanche.totalInterest)} more interest
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Per-debt breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1B5E20] mb-4">Your Debts at a Glance</h2>
                <div className="space-y-3">
                  {[...debts].sort((a, b) => b.interestRate - a.interestRate).map(d => {
                    const monthsLeft = d.monthlyPayment > 0 && d.remainingAmount > 0 ? Math.ceil(d.remainingAmount / d.monthlyPayment) : null;
                    const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
                    return (
                      <div key={d.id} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">{d.name}</p>
                            {!halal && <span className="text-xs bg-red-100 text-red-700 px-1.5 rounded">Riba</span>}
                          </div>
                          <p className="text-xs text-gray-500">{fmt(d.monthlyPayment)}/mo · {d.interestRate}% rate</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900">{fmt(d.remainingAmount)}</p>
                          <p className="text-xs text-gray-500">{monthsLeft ? `~${monthsLeft} mo` : '—'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  ⚠️ Projections are estimates based on current balances and payment amounts. Actual payoff dates may vary.
                  For Islamic debts, the &quot;interest&quot; figure represents profit rate payments, which are halal.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editDebt ? 'Edit Debt' : 'Add Debt'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Home Mortgage" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, ribaFree: ISLAMIC_TYPES.includes(e.target.value) ? true : form.ribaFree })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                </select></div>
              {isIslamic && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">✅ This type uses a profit rate, not interest. It is Halal.</div>}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input type="number" step="0.01" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Remaining Amount</label>
                <input type="number" step="0.01" value={form.remainingAmount} onChange={e => setForm({ ...form, remainingAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Same as total if new" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
                <input type="number" step="0.01" value={form.monthlyPayment} onChange={e => setForm({ ...form, monthlyPayment: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isIslamic ? 'Profit Rate (%)' : 'Interest Rate (%)'}</label>
                <input type="number" step="0.1" value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Lender</label>
                <input value={form.lender} onChange={e => setForm({ ...form, lender: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Islamic Bank" /></div>
              {!isIslamic && <div className="flex items-center gap-2"><input type="checkbox" checked={form.ribaFree} onChange={e => setForm({ ...form, ribaFree: e.target.checked })} className="w-4 h-4" /><label className="text-sm text-gray-700">Riba-Free (Halal)</label></div>}
              {!isHalal && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">⚠️ This debt involves Riba (interest), which is prohibited in Islam. Consider refinancing with an Islamic alternative.</div>}
            </div>
            {saveError && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{saveError}</div>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name || !form.totalAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : editDebt ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Make Payment</h2>
            <p className="text-gray-500 text-sm mb-4">{payModal.name} • Remaining: {fmt(payModal.remainingAmount)}</p>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
              <input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            {payError && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{payError}</div>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setPayModal(null); setPayError(null); }} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handlePay} disabled={saving || !payAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Processing...' : 'Pay'}</button>
            </div>
          </div>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
