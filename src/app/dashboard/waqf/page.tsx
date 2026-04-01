'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';

interface WaqfItem { id: number; organizationName: string; type: string; purpose: string; amount: number; date: number; recurring: boolean; status: string; }
interface Beneficiary { id: number; name: string; category: string; percentage: number; contact?: string; notes?: string; calculatedAmount: number; }

const PURPOSES = ['education', 'healthcare', 'mosque', 'water', 'orphanage', 'general', 'other'];
const TYPES = ['cash', 'property', 'equipment', 'books', 'land', 'other'];
const CATEGORIES = ['masjid', 'charity', 'family', 'education', 'healthcare', 'water', 'general', 'other'];
const CATEGORY_COLORS: Record<string, string> = {
  masjid: 'bg-emerald-100 text-emerald-800', charity: 'bg-teal-100 text-teal-800',
  family: 'bg-blue-100 text-blue-800', education: 'bg-indigo-100 text-indigo-800',
  healthcare: 'bg-pink-100 text-pink-800', water: 'bg-cyan-100 text-cyan-800',
  general: 'bg-gray-100 text-gray-700', other: 'bg-amber-100 text-amber-800',
};

export default function WaqfPage() {
  const [tab, setTab] = useState<'contributions' | 'distribution'>('contributions');

  // contributions
  const [items, setItems] = useState<WaqfItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false });
  const [editItem, setEditItem] = useState<WaqfItem | null>(null);
  const [saving, setSaving] = useState(false);

  // distribution
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [totalWaqf, setTotalWaqf] = useState(0);
  const [allocatedPct, setAllocatedPct] = useState(0);
  const [loadingDist, setLoadingDist] = useState(false);
  const [showBenefForm, setShowBenefForm] = useState(false);
  const [editBenef, setEditBenef] = useState<Beneficiary | null>(null);
  const [benefForm, setBenefForm] = useState({ name: '', category: 'general', percentage: '', contact: '', notes: '' });
  const [savingBenef, setSavingBenef] = useState(false);

  const { toast } = useToast();

  const loadItems = useCallback(() => {
    setLoadingItems(true);
    api.getWaqf().then(d => {
      if (d?.error) { toast(d.error, 'error'); return; }
      const items = d?.contributions ?? d;
      setItems(Array.isArray(items) ? items : []);
    }).catch(() => toast('Failed to load waqf data', 'error')).finally(() => setLoadingItems(false));
  }, []);

  const loadDistribution = useCallback(() => {
    setLoadingDist(true);
    api.getWaqfDistribution().then(d => {
      if (d?.error) { toast(d.error, 'error'); return; }
      const b = d?.beneficiaries;
      setBeneficiaries(Array.isArray(b) ? b : []);
      setTotalWaqf(d?.totalWaqf || 0);
      setAllocatedPct(d?.allocatedPercentage || 0);
    }).catch(() => toast('Failed to load distribution', 'error')).finally(() => setLoadingDist(false));
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { if (tab === 'distribution') loadDistribution(); }, [tab, loadDistribution]);

  const openAdd = () => { setEditItem(null); setForm({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false }); setShowForm(true); };
  const openEdit = (item: WaqfItem) => {
    setEditItem(item);
    setForm({ organizationName: item.organizationName || '', type: item.type || 'cash', purpose: item.purpose || 'education', amount: item.amount?.toString() || '', description: (item as any).description || '', recurring: item.recurring || false });
    setShowForm(true);
  };
  const handleSave = async () => {
    setSaving(true);
    const amt = parseFloat(form.amount);
    if (!form.organizationName.trim()) { toast('Please enter an organization name', 'error'); setSaving(false); return; }
    if (!amt || amt <= 0) { toast('Amount must be greater than zero', 'error'); setSaving(false); return; }
    try {
      if (editItem) await api.updateWaqf(editItem.id, { ...form, amount: amt });
      else await api.addWaqf({ ...form, amount: amt });
      setShowForm(false); setEditItem(null);
      setForm({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false });
      loadItems(); toast('Waqf contribution saved', 'success');
    } catch { toast('Failed to save contribution', 'error'); }
    setSaving(false);
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contribution?')) return;
    try {
      await api.deleteWaqf(id);
      toast('Waqf contribution deleted', 'success');
      loadItems();
    } catch {
      toast('Failed to delete contribution', 'error');
    }
  };

  const openAddBenef = () => { setEditBenef(null); setBenefForm({ name: '', category: 'general', percentage: '', contact: '', notes: '' }); setShowBenefForm(true); };
  const openEditBenef = (b: Beneficiary) => {
    setEditBenef(b);
    setBenefForm({ name: b.name, category: b.category, percentage: b.percentage.toString(), contact: b.contact || '', notes: b.notes || '' });
    setShowBenefForm(true);
  };
  const handleSaveBenef = async () => {
    setSavingBenef(true);
    if (!benefForm.name.trim()) { toast('Please enter a beneficiary name', 'error'); setSavingBenef(false); return; }
    const pct = parseFloat(benefForm.percentage) || 0;
    if (pct <= 0 || pct > 100) { toast('Percentage must be between 0 and 100', 'error'); setSavingBenef(false); return; }
    try {
      const payload = { ...benefForm, percentage: pct };
      if (editBenef) await api.updateWaqfBeneficiary(editBenef.id, payload);
      else await api.addWaqfBeneficiary(payload);
      setShowBenefForm(false); setEditBenef(null);
      loadDistribution(); toast('Beneficiary saved', 'success');
    } catch { toast('Failed to save beneficiary', 'error'); }
    setSavingBenef(false);
  };
  const handleDeleteBenef = async (id: number) => {
    if (!confirm('Remove this beneficiary?')) return;
    try {
      await api.deleteWaqfBeneficiary(id);
      toast('Beneficiary removed', 'success');
      loadDistribution();
    } catch {
      toast('Failed to delete beneficiary', 'error');
    }
  };

  const totalContribs = items.reduce((s, i) => s + i.amount, 0);
  const byPurpose = items.reduce((acc, i) => { acc[i.purpose] = (acc[i.purpose] || 0) + i.amount; return acc; }, {} as Record<string, number>);
  const unallocatedPct = Math.max(0, 100 - allocatedPct);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Waqf (Endowment)</h1>
        {tab === 'contributions' && <button onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Contribution</button>}
        {tab === 'distribution' && <button onClick={openAddBenef} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Beneficiary</button>}
      </div>

      <div className="bg-gradient-to-r from-cyan-700 to-teal-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-cyan-100 text-sm">Total Waqf Contributions</p>
        <p className="text-4xl font-bold">{fmt(totalContribs)}</p>
        <p className="text-cyan-200 text-sm mt-1">{items.length} contributions</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {(['contributions', 'distribution'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-[#1B5E20] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'contributions' ? '🕌 Contributions' : '📊 Distribution'}
          </button>
        ))}
      </div>

      {/* CONTRIBUTIONS */}
      {tab === 'contributions' && (
        <>
          {Object.keys(byPurpose).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(byPurpose).sort((a, b) => b[1] - a[1]).map(([p, amt]) => (
                <span key={p} className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-lg text-sm font-medium capitalize">{p}: {fmt(amt)}</span>
              ))}
            </div>
          )}
          {loadingItems
            ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>
            : items.length > 0
              ? <div className="space-y-2">{items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#1B5E20]">{item.organizationName || item.purpose}</p>
                      <p className="text-sm text-gray-500 capitalize">{item.purpose} • {item.type} • {new Date(item.date < 1e12 ? item.date * 1000 : item.date).toLocaleDateString()}
                        {item.recurring && <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-[#1B5E20]">{fmt(item.amount)}</p>
                      <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                    </div>
                  </div>
                ))}</div>
              : <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🕌</p><p>No waqf contributions yet.</p></div>
          }
        </>
      )}

      {/* DISTRIBUTION */}
      {tab === 'distribution' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#1B5E20]">{allocatedPct.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Allocated</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${unallocatedPct > 0 ? 'text-amber-600' : 'text-[#1B5E20]'}`}>{unallocatedPct.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Unallocated</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-teal-700">{beneficiaries.length}</p>
              <p className="text-xs text-gray-500 mt-1">Beneficiaries</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Allocation progress</span><span>{allocatedPct.toFixed(1)} / 100%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className={`h-3 rounded-full transition-all ${allocatedPct >= 100 ? 'bg-[#1B5E20]' : 'bg-teal-500'}`} style={{ width: `${Math.min(allocatedPct, 100)}%` }} />
            </div>
            {unallocatedPct > 0 && <p className="text-xs text-amber-600 mt-2">⚠ {unallocatedPct.toFixed(1)}% unallocated — add a beneficiary or increase an existing share.</p>}
            {allocatedPct >= 100 && <p className="text-xs text-[#1B5E20] mt-2">✓ 100% of your Waqf is fully distributed.</p>}
          </div>

          {loadingDist
            ? <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>
            : beneficiaries.length > 0
              ? <div className="space-y-3">{beneficiaries.map(b => (
                  <div key={b.id} className="bg-white rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{b.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[b.category] || 'bg-gray-100 text-gray-700'}`}>{b.category}</span>
                        </div>
                        {b.contact && <p className="text-xs text-gray-500 mt-0.5">{b.contact}</p>}
                        {b.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{b.notes}</p>}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-[#1B5E20]">{b.percentage}%</p>
                        {totalWaqf > 0 && <p className="text-sm text-teal-700 font-medium">{fmt(b.calculatedAmount)}</p>}
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-teal-400" style={{ width: `${b.percentage}%` }} />
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                      <button onClick={() => openEditBenef(b)} className="text-xs text-gray-400 hover:text-blue-600">Edit</button>
                      <button onClick={() => handleDeleteBenef(b.id)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
                    </div>
                  </div>
                ))}</div>
              : <div className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">📊</p>
                  <p className="font-medium text-gray-600 mb-1">No beneficiaries yet</p>
                  <p className="text-sm">Add beneficiaries and assign percentage shares to see how your Waqf will be distributed.</p>
                </div>
          }

          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-4">
            <p className="text-sm text-teal-800 font-medium mb-1">📖 About Waqf Distribution</p>
            <p className="text-xs text-teal-700">A Waqf can be designated to one or multiple beneficiaries according to the donor's niyyah (intention). Ensure beneficiaries meet the conditions of eligibility under Islamic law and consult a scholar for complex distributions.</p>
          </div>
        </>
      )}

      {/* Contribution modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editItem ? 'Edit Waqf Contribution' : 'Add Waqf Contribution'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input value={form.organizationName} onChange={e => setForm({ ...form, organizationName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Islamic Relief" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {PURPOSES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.recurring} onChange={e => setForm({ ...form, recurring: e.target.checked })} className="w-4 h-4" /> Recurring</label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : editItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Beneficiary modal */}
      {showBenefForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editBenef ? 'Edit Beneficiary' : 'Add Beneficiary'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name / Organisation</label>
                <input value={benefForm.name} onChange={e => setBenefForm({ ...benefForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Local Masjid, Sister Fatima" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={benefForm.category} onChange={e => setBenefForm({ ...benefForm, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Share (%)</label>
                  <input type="number" min="0" max="100" step="0.1" value={benefForm.percentage} onChange={e => setBenefForm({ ...benefForm, percentage: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. 25" /></div>
              </div>
              {benefForm.percentage && totalWaqf > 0 && (
                <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2">= {fmt(totalWaqf * (parseFloat(benefForm.percentage) || 0) / 100)} from your total Waqf of {fmt(totalWaqf)}</p>
              )}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact (optional)</label>
                <input value={benefForm.contact} onChange={e => setBenefForm({ ...benefForm, contact: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Email or phone" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea value={benefForm.notes} onChange={e => setBenefForm({ ...benefForm, notes: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2 text-gray-900 resize-none" placeholder="Specific intentions or conditions…" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBenefForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveBenef} disabled={savingBenef || !benefForm.name || !benefForm.percentage} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{savingBenef ? 'Saving...' : editBenef ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
