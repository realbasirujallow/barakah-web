'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';

interface SadaqahItem { id: number; amount: number; recipientName: string; category: string; date: number; description: string; recurring: boolean; anonymous: boolean; }
interface Stats { totalDonated: number; donationCount: number; thisMonthTotal: number; topCategory: string; }

// Map backend stats response fields to frontend Stats interface
function mapStats(raw: any): Stats | null {
  if (!raw) return null;
  // Backend may use totalAllTime/totalDonated, totalDonations/donationCount, thisMonth/thisMonthTotal
  const totalDonated = raw.totalDonated ?? raw.totalAllTime ?? 0;
  const donationCount = raw.donationCount ?? raw.totalDonations ?? 0;
  const thisMonthTotal = raw.thisMonthTotal ?? raw.thisMonth ?? 0;
  let topCategory = raw.topCategory || 'N/A';
  // Derive top category from byCategory map if not provided directly
  if (topCategory === 'N/A' && raw.byCategory && typeof raw.byCategory === 'object') {
    const entries = Object.entries(raw.byCategory) as [string, number][];
    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      topCategory = entries[0][0].toLowerCase();
    }
  }
  return { totalDonated, donationCount, thisMonthTotal, topCategory };
}
const CATS = ['food', 'clothing', 'education', 'medical', 'shelter', 'water', 'general', 'orphan', 'mosque', 'disaster_relief', 'dawah', 'other'];

// Preset donation amounts in dollars
const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

function SadaqahContent() {
  const [items, setItems] = useState<SadaqahItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', recipientName: '', category: 'general', description: '', anonymous: false, recurring: false });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { toast } = useToast();

  // Donate-to-Barakah state
  const [donateAmount, setDonateAmount] = useState<number | null>(25);
  const [donateCustom, setDonateCustom] = useState('');
  const [donatePurpose, setDonatePurpose] = useState('general');
  const [donating, setDonating] = useState(false);

  const searchParams = useSearchParams();

  const load = () => {
    setLoading(true);
    Promise.allSettled([api.getSadaqah(), api.getSadaqahStats()])
      .then((results) => {
        const d = results[0].status === 'fulfilled' ? results[0].value : null;
        const s = results[1].status === 'fulfilled' ? results[1].value : null;
        if (d?.error) { toast(d.error, 'error'); return; }
        setItems(Array.isArray(d?.donations) ? d.donations : Array.isArray(d) ? d : []);
        setStats(mapStats(s));
      })
      .catch(() => { toast('Failed to load sadaqah records', 'error'); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  // Show success toast if redirected back from Stripe
  useEffect(() => {
    if (searchParams.get('donated') === 'true') {
      toast('JazakAllahu Khayran! Your sadaqah has been received. May Allah accept it.', 'success');
    }
  }, [searchParams]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const amt = parseFloat(form.amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        toast('Amount must be a positive number', 'error');
        setSaving(false);
        return;
      }
      await api.addSadaqah({ ...form, amount: amt });
      setShowForm(false); setForm({ amount: '', recipientName: '', category: 'general', description: '', anonymous: false, recurring: false }); load();
      toast('Sadaqah recorded', 'success');
    } catch (err: any) { toast(err?.message || 'Failed to save sadaqah', 'error'); }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteSadaqah = async () => {
    if (deleteConfirmId === null) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await api.deleteSadaqah(id);
      toast('Sadaqah record deleted', 'success');
      load();
    } catch {
      toast('Failed to delete record', 'error');
    }
  };

  const handleDonate = async () => {
    const dollars = donateAmount ?? parseFloat(donateCustom);
    if (!Number.isFinite(dollars) || dollars <= 0) { toast('Please enter a valid amount', 'error'); return; }
    const cents = Math.round(dollars * 100);
    setDonating(true);
    try {
      const purposeLabel = donatePurpose.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
      const res = await api.donateToBarakah(cents, `Sadaqah – ${purposeLabel}`);
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast('Could not initiate donation. Please try again.', 'error');
      }
    } catch (err: any) { toast(err?.message || 'Failed to process donation', 'error'); }
    setDonating(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const effectiveAmount = donateAmount ?? (donateCustom ? parseFloat(donateCustom) : 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Sadaqah Tracker</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Give Sadaqah</button>
      </div>

      {/* Stats banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-teal-100 text-sm">Total Donated</p>
        <p className="text-4xl font-bold">{fmt(stats?.totalDonated || 0)}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div><p className="text-teal-200 text-xs">Donations</p><p className="text-xl font-semibold">{stats?.donationCount || 0}</p></div>
          <div><p className="text-teal-200 text-xs">This Month</p><p className="text-xl font-semibold">{fmt(stats?.thisMonthTotal || 0)}</p></div>
          <div><p className="text-teal-200 text-xs">Top Category</p><p className="text-xl font-semibold capitalize">{stats?.topCategory || 'N/A'}</p></div>
        </div>
      </div>

      {/* ── Donate via Barakah ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌿</span>
          <div>
            <h2 className="text-lg font-bold text-[#1B5E20]">Give Sadaqah via Barakah</h2>
            <p className="text-sm text-gray-500">We collect your donation and distribute it to verified causes on your behalf. Secure payment via Stripe.</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cause</label>
          <select
            value={donatePurpose}
            onChange={e => setDonatePurpose(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
          >
            {CATS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_AMOUNTS.map(amt => (
              <button
                key={amt}
                onClick={() => { setDonateAmount(amt); setDonateCustom(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  donateAmount === amt
                    ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B5E20]'
                }`}
              >
                ${amt}
              </button>
            ))}
            <button
              onClick={() => setDonateAmount(null)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                donateAmount === null
                  ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B5E20]'
              }`}
            >
              Custom
            </button>
          </div>
          {donateAmount === null && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="Enter amount"
                value={donateCustom}
                onChange={e => setDonateCustom(e.target.value)}
                className="w-full border rounded-lg pl-8 pr-3 py-2 text-gray-900"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleDonate}
          disabled={donating || effectiveAmount <= 0}
          className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
        >
          {donating ? 'Redirecting to payment…' : `Donate ${effectiveAmount > 0 ? `$${effectiveAmount}` : ''} via Barakah`}
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          Processed securely by Stripe · Barakah distributes to verified Islamic causes
        </p>
      </div>

      {/* ── My Sadaqah records ────────────────────────────────────────────── */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">My Sadaqah Records</h3>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{item.recipientName || item.category}</p>
                <p className="text-sm text-gray-500 capitalize">{item.category} • {new Date(item.date < 1e12 ? item.date * 1000 : item.date).toLocaleDateString()}
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
        <div className="text-center py-12 text-gray-400"><p className="text-4xl mb-3">💝</p><p>No sadaqah recorded. Every act of kindness is sadaqah.</p></div>
      )}

      {/* Add Sadaqah modal */}
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
              <button onClick={() => setShowForm(false)} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Record'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🗑️</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Delete sadaqah record?</h3>
                <p className="text-sm text-gray-600 mt-1">This record will be permanently deleted.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDeleteSadaqah} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SadaqahPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>}>
      <SadaqahContent />
    </Suspense>
  );
}
