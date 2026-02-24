'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Beneficiary { id: number; beneficiaryName: string; relationship: string; sharePercentage: number; shareType: string; notes: string; }

export default function WasiyyahPage() {
  const [items, setItems] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ beneficiaryName: '', relationship: '', sharePercentage: '', shareType: 'percentage', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getWasiyyah().then(d => setItems(d?.beneficiaries || d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addWasiyyah({ ...form, sharePercentage: parseFloat(form.sharePercentage) });
      setShowForm(false); setForm({ beneficiaryName: '', relationship: '', sharePercentage: '', shareType: 'percentage', notes: '' }); load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this beneficiary?')) return;
    await api.deleteWasiyyah(id).catch(() => {}); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalShare = items.reduce((s, b) => s + (b.sharePercentage || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Wasiyyah (Islamic Will)</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Beneficiary</button>
      </div>

      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-2xl p-6 text-white mb-6">
        <p className="text-purple-200 text-sm">Total Share Allocated</p>
        <p className="text-4xl font-bold">{totalShare.toFixed(1)}%</p>
        <p className="text-purple-200 text-sm mt-1">{totalShare <= 33.3 ? '✅ Within the 1/3 Sunnah limit' : '⚠️ Exceeds the 1/3 Sunnah limit'}</p>
        <div className="w-full bg-purple-900/40 rounded-full h-3 mt-3">
          <div className={`h-3 rounded-full ${totalShare <= 33.3 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${Math.min(totalShare, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-purple-300 mt-1"><span>0%</span><span>33.3%</span><span>100%</span></div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
        <strong>Islamic Guidance:</strong> Wasiyyah for non-heirs should not exceed one-third (Bukhari & Muslim).
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(b => (
            <div key={b.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{b.beneficiaryName}</p>
                <p className="text-sm text-gray-500">{b.relationship}{b.notes ? ` • ${b.notes}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-purple-600">{b.sharePercentage}%</p>
                <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📜</p><p>No beneficiaries yet. Planning your estate is a Sunnah.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Beneficiary</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.beneficiaryName} onChange={e => setForm({ ...form, beneficiaryName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Full name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Nephew, Charity" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Share Percentage</label>
                <input type="number" step="0.1" min="0" max="100" value={form.sharePercentage} onChange={e => setForm({ ...form, sharePercentage: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="10" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.beneficiaryName || !form.sharePercentage} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
