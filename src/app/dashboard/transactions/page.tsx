'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Tx { id: number; type: string; category: string; amount: number; description: string; currency: string; timestamp: number; }
const CATEGORIES = ['food', 'transportation', 'shopping', 'utilities', 'housing', 'healthcare', 'education', 'entertainment', 'charity', 'income', 'investment', 'other'];

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: 'food', amount: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    api.getTransactions(filter === 'all' ? undefined : filter).then(d => setTxs(d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addTransaction({ ...form, amount: parseFloat(form.amount) });
      setShowForm(false); setForm({ type: 'expense', category: 'food', amount: '', description: '' }); load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    await api.deleteTransaction(id).catch(() => {}); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Transactions</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4"><p className="text-gray-500 text-xs">Income</p><p className="text-xl font-bold text-green-600">{fmt(income)}</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-gray-500 text-xs">Expenses</p><p className="text-xl font-bold text-red-600">{fmt(expense)}</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-gray-500 text-xs">Net</p><p className={`text-xl font-bold ${income - expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(income - expense)}</p></div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'income', 'expense'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{f}</button>
        ))}
      </div>

      {txs.length > 0 ? (
        <div className="space-y-2">
          {txs.map(tx => (
            <div key={tx.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{tx.description || tx.category}</p>
                <p className="text-sm text-gray-500 capitalize">{tx.category} • {new Date(tx.timestamp).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </p>
                <button onClick={() => handleDelete(tx.id)} className="text-gray-400 hover:text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📊</p><p>No transactions yet.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Transaction</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  <option value="income">Income</option><option value="expense">Expense</option>
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Groceries" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
