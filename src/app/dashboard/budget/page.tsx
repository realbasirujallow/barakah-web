'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface BudgetItem { id: number; category: string; monthlyLimit: number; spent: number; month: number; year: number; color: string; }
const CATEGORIES = ['food', 'transportation', 'shopping', 'utilities', 'housing', 'healthcare', 'education', 'entertainment', 'charity', 'other'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BudgetPage() {
  const now = new Date();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState({ category: 'food', monthlyLimit: '', month: String(now.getMonth() + 1), year: String(now.getFullYear()) });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getBudgets().then(d => setBudgets(d?.budgets || d || [])).catch((err) => { console.error(err); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const openAdd = () => { setEditItem(null); setForm({ category: 'food', monthlyLimit: '', month: String(now.getMonth() + 1), year: String(now.getFullYear()) }); setShowForm(true); };
  const openEdit = (b: BudgetItem) => { setEditItem(b); setForm({ category: b.category, monthlyLimit: String(b.monthlyLimit), month: String(b.month), year: String(b.year) }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { category: form.category, monthlyLimit: parseFloat(form.monthlyLimit), month: parseInt(form.month), year: parseInt(form.year) };
      if (editItem) await api.updateBudget(editItem.id, data);
      else await api.addBudget(data);
      setShowForm(false); load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this budget?')) return;
    await api.deleteBudget(id).catch((err) => { console.error(err); }); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalBudget = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Budget Planning</h1>
        <button onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Budget</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Budget</p><p className="text-2xl font-bold text-[#1B5E20]">{fmt(totalBudget)}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Spent</p><p className="text-2xl font-bold text-orange-600">{fmt(totalSpent)}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Remaining</p><p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(totalBudget - totalSpent)}</p></div>
      </div>

      {budgets.length > 0 ? (
        <div className="space-y-3">
          {budgets.map(b => {
            const pct = b.monthlyLimit > 0 ? Math.min((b.spent / b.monthlyLimit) * 100, 100) : 0;
            const over = b.spent > b.monthlyLimit;
            return (
              <div key={b.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{b.category}</p>
                    <p className="text-xs text-gray-500">{MONTHS[b.month - 1]} {b.year}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm"><span className={over ? 'text-red-600 font-bold' : 'text-gray-700'}>{fmt(b.spent)}</span> / {fmt(b.monthlyLimit)}</p>
                    <button onClick={() => openEdit(b)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${over ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-[#1B5E20]'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📋</p><p>No budgets set. Create your first budget.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editItem ? 'Edit Budget' : 'Add Budget'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit</label>
                <input type="number" step="0.01" value={form.monthlyLimit} onChange={e => setForm({ ...form, monthlyLimit: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="500.00" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {MONTHS.map((m, i) => <option key={i} value={String(i + 1)}>{m}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.monthlyLimit} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : editItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
