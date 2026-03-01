'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Goal { id: number; name: string; category: string; targetAmount: number; currentAmount: number; description: string; deadline: number | null; }
const CATS = ['hajj', 'umrah', 'emergency', 'education', 'wedding', 'home', 'vehicle', 'business', 'retirement', 'other'];

export default function SavingsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contModal, setContModal] = useState<Goal | null>(null);
  const [form, setForm] = useState({ name: '', category: 'emergency', targetAmount: '', description: '' });
  const [contAmount, setContAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getSavingsGoals().then(d => setGoals(d?.goals || d || [])).catch((err) => { console.error(err); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addSavingsGoal({ ...form, targetAmount: parseFloat(form.targetAmount) });
      setShowForm(false); setForm({ name: '', category: 'emergency', targetAmount: '', description: '' }); load();
    } catch (err: any) { console.error(err); }
    setSaving(false);
  };

  const handleContribute = async () => {
    if (!contModal) return;
    setSaving(true);
    try {
      await api.contributeSavingsGoal(contModal.id, parseFloat(contAmount));
      setContModal(null); setContAmount(''); load();
    } catch (err: any) { console.error(err); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this savings goal?')) return;
    await api.deleteSavingsGoal(id).catch((err) => { console.error(err); }); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Savings Goals</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ New Goal</button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-blue-100 text-sm">Total Saved</p>
        <p className="text-4xl font-bold">{fmt(totalSaved)}</p>
        <p className="text-blue-200 text-sm mt-1">of {fmt(totalTarget)} target across {goals.length} goals</p>
        {totalTarget > 0 && (
          <div className="w-full bg-blue-900/40 rounded-full h-3 mt-3">
            <div className="bg-white h-3 rounded-full" style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }} />
          </div>
        )}
      </div>

      {goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
            return (
              <div key={g.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-[#1B5E20]">{g.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{g.category}{g.description ? ` • ${g.description}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setContModal(g); setContAmount(''); }} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">+ Add</button>
                    <button onClick={() => handleDelete(g.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{fmt(g.currentAmount)}</span>
                  <span className="text-gray-700 font-medium">{fmt(g.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{pct.toFixed(0)}% complete</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🎯</p><p>No savings goals yet. Set your first goal!</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">New Savings Goal</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Hajj Fund" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                <input type="number" step="0.01" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="10000" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.targetAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {contModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Contribute</h2>
            <p className="text-gray-500 text-sm mb-4">{contModal.name} • {fmt(contModal.currentAmount)} / {fmt(contModal.targetAmount)}</p>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" step="0.01" value={contAmount} onChange={e => setContAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="100" /></div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setContModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleContribute} disabled={saving || !contAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Contribute'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
