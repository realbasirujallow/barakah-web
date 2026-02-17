'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface HawlItem { id: number; assetName: string; assetType: string; amount: number; nisabThreshold: number; zakatAmount: number; hawlStartDate: number; hawlEndDate: number; zakatPaid: boolean; active: boolean; }
const TYPES = ['cash', 'gold', 'silver', 'crypto', 'stocks', 'business', 'other'];

export default function HawlPage() {
  const [items, setItems] = useState<HawlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetName: '', assetType: 'cash', amount: '', nisabThreshold: '5000' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getHawl().then(d => setItems(d?.trackers || d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addHawl({ assetName: form.assetName, assetType: form.assetType, amount: parseFloat(form.amount), nisabThreshold: parseFloat(form.nisabThreshold) });
      setShowForm(false); setForm({ assetName: '', assetType: 'cash', amount: '', nisabThreshold: '5000' }); load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleMarkPaid = async (id: number) => {
    await api.markHawlPaid(id).catch(() => {}); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this tracker?')) return;
    await api.deleteHawl(id).catch(() => {}); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const zakatDue = items.filter(i => !i.zakatPaid && i.hawlEndDate && i.hawlEndDate < Date.now());
  const pending = items.filter(i => !i.zakatPaid && (!i.hawlEndDate || i.hawlEndDate >= Date.now()));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Hawl Tracker</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Track Asset</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Tracking</p><p className="text-2xl font-bold text-[#1B5E20]">{items.length}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Zakat Due</p><p className="text-2xl font-bold text-amber-600">{zakatDue.length}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Zakat</p><p className="text-2xl font-bold text-red-600">{fmt(zakatDue.reduce((s, i) => s + i.zakatAmount, 0))}</p></div>
      </div>

      {zakatDue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-amber-700 mb-3">Zakat Due — Hawl Complete</h2>
          <div className="space-y-2">
            {zakatDue.map(item => (
              <div key={item.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[#1B5E20]">{item.assetName}</p>
                  <p className="text-sm text-gray-500">{item.assetType} • {fmt(item.amount)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-amber-600">{fmt(item.zakatAmount)}</p>
                  <button onClick={() => handleMarkPaid(item.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Paid</button>
                  <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Pending</h2>
          <div className="space-y-2">
            {pending.map(item => {
              const start = item.hawlStartDate || Date.now();
              const end = item.hawlEndDate || start + 354.37 * 86400000;
              const total = end - start;
              const elapsed = Date.now() - start;
              const pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);
              const daysLeft = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
              return (
                <div key={item.id} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-[#1B5E20]">{item.assetName}</p>
                      <p className="text-sm text-gray-500">{item.assetType} • {fmt(item.amount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{daysLeft}d left</span>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#1B5E20] h-2 rounded-full" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📅</p><p>No assets tracked. Start tracking Hawl for zakat eligibility.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Track New Asset</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input value={form.assetName} onChange={e => setForm({ ...form, assetName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Gold Savings" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.assetType} onChange={e => setForm({ ...form, assetType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nisab Threshold</label>
                <input type="number" step="0.01" value={form.nisabThreshold} onChange={e => setForm({ ...form, nisabThreshold: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.assetName || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Track'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
