'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useFocusTrap } from '../../../lib/useFocusTrap';

interface WaqfItem { id: number; organizationName: string; type: string; purpose: string; amount: number; date: number; recurring: boolean; status: string; description?: string; }
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
  const { symbol, fmt } = useCurrency();

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
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);

  // ── Modal accessibility: focus trap + Escape close ──────────────────────
  const formModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(formModalRef, showForm);
  const benefModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(benefModalRef, showBenefForm);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(confirmModalRef, confirmAction !== null);
  useEffect(() => {
    if (!showForm) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowForm(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showForm]);
  useEffect(() => {
    if (!showBenefForm) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowBenefForm(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showBenefForm]);
  useEffect(() => {
    if (!confirmAction) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmAction(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [confirmAction]);

  const loadItems = useCallback(() => {
    setLoadingItems(true);
    api.getWaqf().then(d => {
      if (d?.error) { toast(d.error, 'error'); return; }
      const items = d?.contributions ?? d;
      setItems(Array.isArray(items) ? items : []);
    }).catch(() => toast('Failed to load waqf data', 'error')).finally(() => setLoadingItems(false));
  }, [toast]);

  const loadDistribution = useCallback(() => {
    setLoadingDist(true);
    api.getWaqfDistribution().then(d => {
      if (d?.error) { toast(d.error, 'error'); return; }
      const b = d?.beneficiaries;
      setBeneficiaries(Array.isArray(b) ? b : []);
      setTotalWaqf(d?.totalWaqf || 0);
      setAllocatedPct(d?.allocatedPercentage || 0);
    }).catch(() => toast('Failed to load distribution', 'error')).finally(() => setLoadingDist(false));
  }, [toast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadItems();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadItems]);
  useEffect(() => {
    if (tab !== 'distribution') return;
    const timeoutId = window.setTimeout(() => {
      loadDistribution();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [tab, loadDistribution]);

  const openAdd = () => { setEditItem(null); setForm({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false }); setShowForm(true); };
  const openEdit = (item: WaqfItem) => {
    setEditItem(item);
    setForm({ organizationName: item.organizationName || '', type: item.type || 'cash', purpose: item.purpose || 'education', amount: item.amount?.toString() || '', description: item.description || '', recurring: item.recurring || false });
    setShowForm(true);
  };
  const handleSave = async () => {
    setSaving(true);
    const amt = parseFloat(form.amount);
    // Validate organization name
    if (!form.organizationName.trim()) {
      toast('Please enter an organization name', 'error');
      setSaving(false);
      return;
    }
    // Validate amount: must be finite and positive
    if (!Number.isFinite(amt) || amt <= 0) {
      toast('Amount must be a positive number', 'error');
      setSaving(false);
      return;
    }
    const MAX_VALUE = 1_000_000_000; // 1 billion max
    if (amt > MAX_VALUE) {
      toast(`Waqf amount cannot exceed ${symbol}${MAX_VALUE.toLocaleString()}`, 'error');
      setSaving(false);
      return;
    }
    // Check decimal precision (max 2 decimal places)
    if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
      toast('Please enter an amount with up to 2 decimal places', 'error');
      setSaving(false);
      return;
    }
    try {
      if (editItem) await api.updateWaqf(editItem.id, { ...form, amount: amt });
      else await api.addWaqf({ ...form, amount: amt });
      setShowForm(false); setEditItem(null);
      setForm({ organizationName: '', type: 'cash', purpose: 'education', amount: '', description: '', recurring: false });
      loadItems(); toast('Waqf contribution saved', 'success');
    } catch { toast('Failed to save contribution', 'error'); }
    setSaving(false);
  };
  const handleDelete = (id: number) => {
    setConfirmAction({
      message: 'Delete this contribution?',
      action: async () => {
        try {
          await api.deleteWaqf(id);
          toast('Waqf contribution deleted', 'success');
          loadItems();
        } catch {
          toast('Failed to delete contribution', 'error');
        }
      }
    });
  };

  const openAddBenef = () => { setEditBenef(null); setBenefForm({ name: '', category: 'general', percentage: '', contact: '', notes: '' }); setShowBenefForm(true); };
  const openEditBenef = (b: Beneficiary) => {
    setEditBenef(b);
    setBenefForm({ name: b.name, category: b.category, percentage: b.percentage.toString(), contact: b.contact || '', notes: b.notes || '' });
    setShowBenefForm(true);
  };
  const handleSaveBenef = async () => {
    setSavingBenef(true);
    if (!benefForm.name.trim()) {
      toast('Please enter a beneficiary name', 'error');
      setSavingBenef(false);
      return;
    }
    const pct = parseFloat(benefForm.percentage) || 0;
    // Validate percentage: must be finite, positive, and max 100
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      toast('Percentage must be a number between 0 and 100', 'error');
      setSavingBenef(false);
      return;
    }
    try {
      const payload = { ...benefForm, percentage: pct };
      if (editBenef) await api.updateWaqfBeneficiary(editBenef.id, payload);
      else await api.addWaqfBeneficiary(payload);
      setShowBenefForm(false); setEditBenef(null);
      loadDistribution(); toast('Beneficiary saved', 'success');
    } catch { toast('Failed to save beneficiary', 'error'); }
    setSavingBenef(false);
  };
  const handleDeleteBenef = (id: number) => {
    setConfirmAction({
      message: 'Remove this beneficiary?',
      action: async () => {
        try {
          await api.deleteWaqfBeneficiary(id);
          toast('Beneficiary removed', 'success');
          loadDistribution();
        } catch {
          toast('Failed to delete beneficiary', 'error');
        }
      }
    });
  };

  const totalContribs = items.reduce((s, i) => s + i.amount, 0);
  const byPurpose = items.reduce((acc, i) => { acc[i.purpose] = (acc[i.purpose] || 0) + i.amount; return acc; }, {} as Record<string, number>);
  const unallocatedPct = Math.max(0, 100 - allocatedPct);

  return (
    <div>
      <PageHeader
        title="Endowment"
        subtitle="Waqf — perpetual charity assets (properties, books, water wells)"
        actions={
          <>
            {tab === 'contributions' && <button onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">+ Add Contribution</button>}
            {tab === 'distribution' && <button onClick={openAddBenef} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">+ Add Beneficiary</button>}
          </>
        }
      />

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-sm text-indigo-900 mb-6 space-y-3">
        <h3 className="font-bold text-base">📖 Islamic Guidance on Waqf</h3>
        <p>
          <strong>What is Waqf?</strong> An Islamic endowment — a permanent charitable donation whose benefits continue perpetually.
        </p>
        <p>
          The Prophet (&#65018;) said: <em>&quot;When a person dies, all their deeds cease except three: ongoing charity (sadaqah jariyah), knowledge that benefits others, and a righteous child who prays for them.&quot;</em> — <strong>Sahih Muslim 1631</strong>
        </p>
        <p>
          <strong>How it works:</strong> Track your waqf contributions to masajid, schools, wells, and other permanent charitable projects.
        </p>
      </div>

      <div className="bg-gradient-to-r from-cyan-700 to-teal-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-cyan-100 text-sm">Total Waqf Contributions</p>
        <p className="text-4xl font-bold">{fmt(totalContribs)}</p>
        <p className="text-cyan-200 text-sm mt-1">{items.length} contributions</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {(['contributions', 'distribution'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
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
            ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
            : items.length > 0
              ? <div className="space-y-2">{items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-primary">{item.organizationName || item.purpose}</p>
                      <p className="text-sm text-gray-500 capitalize">{item.purpose} • {item.type} • {new Date(item.date < 1e12 ? item.date * 1000 : item.date).toLocaleDateString()}
                        {item.recurring && <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-primary">{fmt(item.amount)}</p>
                      <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                    </div>
                  </div>
                ))}</div>
              : <EmptyState
                  illustration="mosque"
                  title="Begin your waqf legacy"
                  description="Waqf is a perpetual endowment — sadaqah jariyah that continues to benefit you and others long after a single act of giving."
                  actions={[{ label: '+ New contribution', onClick: openAdd, primary: true }]}
                  preview={
                    <div className="space-y-2">
                      {[
                        { org: 'Local masjid expansion', purpose: 'Mosque', amt: '$500.00' },
                        { org: 'Yatim orphanage waqf', purpose: 'Orphans', amt: '$250.00' },
                        { org: 'Islamic library endowment', purpose: 'Education', amt: '$100.00' },
                      ].map((w) => (
                        <div key={w.org} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium text-gray-700">{w.org}</p>
                            <p className="text-xs text-gray-400">{w.purpose}</p>
                          </div>
                          <span className="font-semibold text-primary">{w.amt}</span>
                        </div>
                      ))}
                    </div>
                  }
                />
          }
        </>
      )}

      {/* DISTRIBUTION */}
      {tab === 'distribution' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{allocatedPct.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Allocated</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${unallocatedPct > 0 ? 'text-amber-600' : 'text-primary'}`}>{unallocatedPct.toFixed(1)}%</p>
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
              <div className={`h-3 rounded-full transition-all ${allocatedPct >= 100 ? 'bg-primary' : 'bg-teal-500'}`} style={{ width: `${Math.min(allocatedPct, 100)}%` }} />
            </div>
            {unallocatedPct > 0 && <p className="text-xs text-amber-600 mt-2">⚠ {unallocatedPct.toFixed(1)}% unallocated — add a beneficiary or increase an existing share.</p>}
            {allocatedPct >= 100 && <p className="text-xs text-primary mt-2">✓ 100% of your Waqf is fully distributed.</p>}
          </div>

          {loadingDist
            ? <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
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
                        <p className="text-xl font-bold text-primary">{b.percentage}%</p>
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
            <p className="text-xs text-teal-700">A Waqf can be designated to one or multiple beneficiaries according to the donor&apos;s niyyah (intention). Ensure beneficiaries meet the conditions of eligibility under Islamic law and consult a scholar for complex distributions.</p>
          </div>
        </>
      )}

      {/* Contribution modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{editItem ? 'Edit Waqf Contribution' : 'Add Waqf Contribution'}</h2>
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
              <button aria-label="Close contribution modal" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? 'Saving...' : editItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Beneficiary modal */}
      {showBenefForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={benefModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{editBenef ? 'Edit Beneficiary' : 'Add Beneficiary'}</h2>
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
              <button aria-label="Close beneficiary modal" onClick={() => setShowBenefForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveBenef} disabled={savingBenef || !benefForm.name || !benefForm.percentage} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{savingBenef ? 'Saving...' : editBenef ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={confirmModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <p id="modal-title" className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" aria-label="Close confirmation modal" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
