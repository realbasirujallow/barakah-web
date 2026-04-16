'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { SkeletonPage } from '../SkeletonCard';

interface BudgetItem { id: number; category: string; monthlyLimit: number; spent: number; month: number; year: number; color: string; }
const CATEGORIES = [
  'food', 'dining', 'groceries', 'coffee',
  'transportation', 'fuel', 'parking',
  'housing', 'rent', 'utilities', 'home_maintenance', 'insurance',
  'shopping', 'clothing', 'electronics',
  'healthcare', 'fitness', 'pharmacy',
  'education', 'kids', 'childcare',
  'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets',
  'savings', 'debt_payment', 'taxes',
  'charity', 'zakat', 'sadaqah',
  'business', 'other',
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function catLabel(cat: string) { return cat.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase()); }

function getCategoryIcon(cat: string): string {
  const categoryMap: Record<string, string> = {
    'food': '🛒', 'dining': '🛒', 'groceries': '🛒', 'coffee': '🛒',
    'housing': '🏠', 'rent': '🏠', 'home_maintenance': '🏠', 'utilities': '⚡', 'insurance': '🛡️',
    'transportation': '🚗', 'fuel': '🚗', 'parking': '🚗', 'public_transit': '🚗',
    'healthcare': '💊', 'fitness': '💪', 'pharmacy': '💊',
    'education': '📚', 'kids': '👶', 'childcare': '👶',
    'entertainment': '🎬', 'subscriptions': '🎬', 'travel': '✈️', 'gifts': '🎁', 'personal_care': '💄', 'pets': '🐕',
    'shopping': '🛍️', 'clothing': '👔', 'electronics': '💻',
    'savings': '💰', 'debt_payment': '💳', 'taxes': '📋', 'transfer': '🔄',
    'charity': '🤲', 'zakat': '🕌', 'sadaqah': '🤲',
    'business': '💼', 'investment': '📈', 'income': '💵',
    'other': '📦',
  };
  return categoryMap[cat] || '📦';
}

export default function BudgetPage() {
  const now = new Date();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState({ category: 'food', monthlyLimit: '', month: String(now.getMonth() + 1), year: String(now.getFullYear()) });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copyingMonth, setCopyingMonth] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  // Monthly navigation — view budgets for a specific month
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-indexed
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const goToPrevMonth = () => { if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); } else { setViewMonth(m => m - 1); } };
  const goToNextMonth = () => { if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); } else { setViewMonth(m => m + 1); } };
  const { toast } = useToast();

  // Once-per-session alert guard — prevents re-toasting on every re-render / reload
  const alertedRef = useRef<Set<string>>(new Set());

  const checkBudgetAlerts = (items: BudgetItem[]) => {
    items.forEach(b => {
      if (b.monthlyLimit <= 0) return;
      const key = `${b.category}_${b.month}_${b.year}`;
      if (alertedRef.current.has(key)) return;
      const pct = (b.spent / b.monthlyLimit) * 100;
      if (b.spent >= b.monthlyLimit) {
        toast(`🚨 ${catLabel(b.category)} budget exceeded! (${fmt(b.spent)} / ${fmt(b.monthlyLimit)})`, 'error');
        alertedRef.current.add(key);
      } else if (pct >= 80) {
        toast(`⚠️ ${catLabel(b.category)} is at ${Math.round(pct)}% of budget`, 'info');
        alertedRef.current.add(key);
      }
    });
  };

  const load = () => {
    setLoading(true);
    // BUG FIX: pass the viewed month/year so the API returns only those
    // budgets instead of all history — was fetching entire budget history and
    // filtering client-side, which grows with each month the user has data.
    api.getBudgets(viewMonth, viewYear)
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          return;
        }
        const items: BudgetItem[] = Array.isArray(d?.budgets) ? d.budgets : Array.isArray(d) ? d : [];
        setBudgets(items);
        checkBudgetAlerts(items);
      })
      .catch(() => { toast('Failed to load budgets', 'error'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [viewMonth, viewYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    setEditItem(null);
    setForm({ category: 'food', monthlyLimit: '', month: String(viewMonth), year: String(viewYear) });
    setSaveError(null); setShowForm(true);
  };
  const openEdit = (b: BudgetItem) => {
    setEditItem(b);
    setForm({ category: b.category, monthlyLimit: String(b.monthlyLimit), month: String(b.month), year: String(b.year) });
    setSaveError(null); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      const limit = parseFloat(form.monthlyLimit);
      if (!form.monthlyLimit.trim() || !Number.isFinite(limit) || limit <= 0) {
        setSaveError('Monthly limit must be a positive number');
        setSaving(false);
        return;
      }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (limit > MAX_VALUE) {
        setSaveError(`Budget limit cannot exceed $${MAX_VALUE.toLocaleString()}`);
        setSaving(false);
        return;
      }
      // Check decimal precision (max 2 decimal places for currency)
      if (!/^\d+(\.\d{1,2})?$/.test(form.monthlyLimit.trim())) {
        setSaveError('Please enter a limit with up to 2 decimal places');
        setSaving(false);
        return;
      }
      const data = { category: form.category, monthlyLimit: limit, month: parseInt(form.month, 10), year: parseInt(form.year, 10) };
      let result;
      if (editItem) result = await api.updateBudget(editItem.id, data);
      else result = await api.addBudget(data);
      if (result?.error) throw new Error(result.error);
      setShowForm(false); load();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save budget. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setConfirmAction({
      message: 'Delete this budget?',
      action: async () => {
        await api.deleteBudget(id).catch(() => { toast('Failed to delete budget', 'error'); });
        load();
      }
    });
  };

  const handleCopyMonth = () => {
    // Compute "previous month" relative to the currently-viewed month, not today
    const prev = viewMonth === 1
      ? { month: 12, year: viewYear - 1 }
      : { month: viewMonth - 1, year: viewYear };
    setConfirmAction({
      message: `Copy all budgets from ${MONTHS[prev.month - 1]} ${prev.year} to ${MONTHS[viewMonth - 1]} ${viewYear}?`,
      action: async () => {
        setCopyingMonth(true);
        try {
          const result = await api.copyBudget(prev.month, prev.year, viewMonth, viewYear);
          if (result?.copied === 0) {
            toast(`No budget found for ${MONTHS[prev.month - 1]} ${prev.year}. Add a budget first, then copy it next month.`, 'error');
          } else {
            load();
            toast(`${result?.copied ?? 'All'} budget(s) copied from ${MONTHS[prev.month - 1]}`, 'success');
          }
        } catch { toast('Failed to copy budgets', 'error'); }
        setCopyingMonth(false);
      }
    });
  };

  // ── Skeleton loading ────────────────────────────────────────────────────────
  if (loading) return <SkeletonPage summaryCount={3} listCount={4} />;

  const filteredBudgets = budgets.filter(b => b.month === viewMonth && b.year === viewYear);
  const totalBudget = filteredBudgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalSpent  = filteredBudgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Budget Planning</h1>
        <div className="flex gap-2">
          <button type="button" onClick={handleCopyMonth} disabled={copyingMonth}
            className="px-3 py-2 text-sm border border-[#1B5E20] text-[#1B5E20] rounded-lg hover:bg-green-50 transition disabled:opacity-50">
            {copyingMonth ? 'Copying...' : '📋 Copy Last Month'}
          </button>
          <button type="button" onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Budget</button>
        </div>
      </div>

      {/* ── Month Navigation ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button type="button" onClick={goToPrevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">← Prev</button>
        <span className="text-lg font-semibold text-gray-800">{MONTHS[viewMonth - 1]} {viewYear}</span>
        <button type="button" onClick={goToNextMonth}
          disabled={viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear()}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Budget</p><p className="text-2xl font-bold text-[#1B5E20]">{fmt(totalBudget)}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Spent</p><p className="text-2xl font-bold text-orange-600">{fmt(totalSpent)}</p></div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">Remaining</p>
          <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(totalBudget - totalSpent)}</p>
        </div>
      </div>

      {/* ── Budget list or empty state ──────────────────────────────────────── */}
      {filteredBudgets.length > 0 ? (
        <div className="space-y-3">
          {filteredBudgets.map(b => {
            const pct = b.monthlyLimit > 0 ? Math.min((b.spent / b.monthlyLimit) * 100, 100) : 0;
            const over = b.spent > b.monthlyLimit;
            const criticalWarn = pct >= 90;
            const warn = !over && !criticalWarn && pct >= 75;
            const overage = Math.max(0, b.spent - b.monthlyLimit);
            return (
              <div key={b.id} className={`bg-white rounded-xl p-4 ${over ? 'border-l-4 border-red-500' : criticalWarn ? 'border-l-4 border-red-400' : warn ? 'border-l-4 border-amber-400' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(b.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{catLabel(b.category)}</p>
                      <p className="text-xs text-gray-500">{MONTHS[b.month - 1]} {b.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {over && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Over {fmt(overage)}</span>}
                    {criticalWarn && !over && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{Math.round(pct)}% - Critical</span>}
                    {warn && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{Math.round(pct)}% - Warning</span>}
                    <p className="text-sm"><span className={over ? 'text-red-600 font-bold' : criticalWarn ? 'text-red-600' : 'text-gray-700'}>{fmt(b.spent)}</span> / {fmt(b.monthlyLimit)}</p>
                    <button type="button" onClick={() => openEdit(b)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                    <button type="button" onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${over ? 'bg-red-600' : pct >= 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-[#1B5E20]'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-gray-700 font-semibold text-lg mb-2">No budgets set up yet</p>
          <p className="text-gray-500 text-sm mb-6">{viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear() ? 'No budgets set up yet. Create your first budget to start managing your spending.' : 'No budgets were set for this month. Use "Copy Last Month" or create a new one.'}</p>
          <button type="button" onClick={openAdd} className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-xl hover:bg-[#2E7D32] font-medium text-sm">
            + Create Your First Budget
          </button>
        </div>
      )}

      {/* ── Add / Edit modal ────────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editItem ? 'Edit Budget' : 'Add Budget'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit</label>
                <input type="number" step="0.01" value={form.monthlyLimit} onChange={e => setForm({ ...form, monthlyLimit: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="500.00" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {MONTHS.map((m, i) => <option key={i} value={String(i + 1)}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" />
                </div>
              </div>
            </div>
            {saveError && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{saveError}</div>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.monthlyLimit}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">
                {saving ? 'Saving...' : editItem ? 'Update' : 'Add'}
              </button>
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
