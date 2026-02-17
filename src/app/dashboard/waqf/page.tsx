'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface WaqfItem { id: number; organizationName: string; type: string; purpose: string; amount: number; date: number; recurring: boolean; status: string; }
const PURPOSES = ['education', 'healthcare', 'masjid', 'water', 'housing', 'general', 'other'];
const TYPES = ['cash', 'property', 'equipment', 'land', 'other'];

export default function WaqfPage() {
  const [items, setItems] = useState<WaqfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getWaqf().then(d => setItems(d?.contributions || d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addWaqf({ ...form, amount: parseFloat(form.amount) });
      setShowForm(false); setForm({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false }); load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contribution?')) return;
    await api.deleteWaqf(id).catch(() => {}); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalWaqf = items.reduce((s, i) => s + i.amount, 0);
  const byPurpose = items.reduce((acc, i) => { acc[i.purpose] = (acc[i.purpose] || 0) + i.amount; return acc; }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Waqf (Endowment)</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Contribution</button>
      </div>

      <div className="bg-gradient-to-r from-cyan-700 to-teal-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-cyan-100 text-sm">Total Waqf Contributions</p>
        <p className="text-4xl font-bold">{fmt(totalWaqf)}</p>
        <p className="text-cyan-200 text-sm mt-1">{items.length} contributions</p>
      </div>

      {Object.keys(byPurpose).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(byPurpose).sort((a, b) => b[1] - a[1]).map(([p, amt]) => (
            <span key={p} className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-lg text-sm font-medium capitalize">{p}: {fmt(amt)}</span>
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{item.organizationName || item.purpose}</p>
                <p className="text-sm text-gray-500 capitalize">{item.purpose} • {item.type} • {new Date(item.date).toLocaleDateString()}
                  {item.recurring && <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-[#1B5E20]">{fmt(item.amount)}</p>
                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🕌</p><p>No waqf contributions yet.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Waqf Contribution</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input value={form.organizationName} onChange={e => setForm({ ...form, organizationName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Islamic Relief" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {PURPOSES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.recurring} onChange={e => setForm({ ...form, recurring: e.target.checked })} className="w-4 h-4" /> Recurring</label>
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
