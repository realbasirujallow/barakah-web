'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Asset { id: number; name: string; type: string; value: number; }
const TYPES = ['cash', 'gold', 'silver', 'crypto', 'stocks', 'property', 'business', 'other'];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Asset | null>(null);
  const [form, setForm] = useState({ name: '', type: 'cash', value: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.getAssets(), api.getAssetTotal()])
      .then(([a, t]) => { setAssets(a || []); setTotal(t); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const openAdd = () => { setEditItem(null); setForm({ name: '', type: 'cash', value: '' }); setShowForm(true); };
  const openEdit = (a: Asset) => { setEditItem(a); setForm({ name: a.name, type: a.type, value: String(a.value) }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { name: form.name, type: form.type, value: parseFloat(form.value) };
      if (editItem) await api.updateAsset(editItem.id, data);
      else await api.addAsset(data);
      setShowForm(false); load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset?')) return;
    await api.deleteAsset(id).catch(() => {}); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Assets</h1>
        <button onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Asset</button>
      </div>

      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-green-100 text-sm">Total Wealth</p>
        <p className="text-4xl font-bold">{fmt((total?.totalWealth as number) || 0)}</p>
        <p className="text-green-200 text-sm mt-1">Zakat {(total?.zakatEligible as boolean) ? 'Eligible' : 'Below Nisab'} • Due: {fmt((total?.zakatDue as number) || 0)}</p>
      </div>

      {assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div><p className="font-semibold text-[#1B5E20]">{a.name}</p><p className="text-sm text-gray-500 capitalize">{a.type}</p></div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-[#1B5E20]">{fmt(a.value)}</p>
                <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">💰</p><p>No assets yet. Add your first asset.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editItem ? 'Edit Asset' : 'Add Asset'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Savings Account" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Value (USD)</label>
                <input type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.value} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : editItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
