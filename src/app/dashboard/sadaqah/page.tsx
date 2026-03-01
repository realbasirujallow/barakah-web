'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface SadaqahItem { id: number; amount: number; recipientName: string; category: string; date: number; description: string; recurring: boolean; anonymous: boolean; }
interface Stats { totalDonated: number; donationCount: number; thisMonthTotal: number; topCategory: string; }
const CATS = ['food', 'education', 'healthcare', 'orphans', 'masjid', 'disaster_relief', 'water', 'dawah', 'general', 'other'];

export default function SadaqahPage() {
  const [items, setItems] = useState<SadaqahItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', recipientName: '', category: 'general', description: '', anonymous: false, recurring: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.getSadaqah(), api.getSadaqahStats()])
      .then(([d, s]) => { setItems(d?.donations || d || []); setStats(s); })
      .catch((err) => { console.error(err); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addSadaqah({ ...form, amount: parseFloat(form.amount) });
      setShowForm(false); setForm({ amount: '', recipientName: '', category: 'general', description: '', anonymous: false, recurring: false }); load();
    } catch (err: any) { console.error(err); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this record?')) return;
    await api.deleteSadaqah(id).catch((err) => { console.error(err); }); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Sadaqah Tracker</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Give Sadaqah</button>
      </div>

      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-teal-100 text-sm">Total Donated</p>
        <p className="text-4xl font-bold">{fmt(stats?.totalDonated || 0)}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div><p className="text-teal-200 text-xs">Donations</p><p className="text-xl font-semibold">{stats?.donationCount || 0}</p></div>
          <div><p className="text-teal-200 text-xs">This Month</p><p className="text-xl font-semibold">{fmt(stats?.thisMonthTotal || 0)}</p></div>
          <div><p className="text-teal-200 text-xs">Top Category</p><p className="text-xl font-semibold capitalize">{stats?.topCategory || 'N/A'}</p></div>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{item.recipientName || item.category}</p>
                <p className="text-sm text-gray-500 capitalize">{item.category} • {new Date(item.date).toLocaleDateString()}
                  {item.recurring && <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>}
                  {item.anonymous && <span className="ml-1 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Anonymous</span>}
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
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">💝</p><p>No sadaqah recorded. Every act of kindness is sadaqah.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Record Sadaqah</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="50.00" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <input value={form.recipientName} onChange={e => setForm({ ...form, recipientName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Local Masjid" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} className="w-4 h-4" /> Anonymous</label>
                <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.recurring} onChange={e => setForm({ ...form, recurring: e.target.checked })} className="w-4 h-4" /> Recurring</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Record'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
