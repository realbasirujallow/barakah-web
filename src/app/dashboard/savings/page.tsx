'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { SkeletonPage } from '../SkeletonCard';

interface Goal { id: number; name: string; category: string; targetAmount: number; currentAmount: number; description: string; deadline: number | null; }
const CATS = ['hajj', 'umrah', 'emergency', 'education', 'wedding', 'home', 'vehicle', 'business', 'retirement', 'other'];

// Milestone buckets that trigger toasts (50%, 75%, 100%)
function getMilestone(pct: number): '50' | '75' | '100' | null {
  if (pct >= 100) return '100';
  if (pct >= 75)  return '75';
  if (pct >= 50)  return '50';
  return null;
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contModal, setContModal] = useState<Goal | null>(null);
  const [form, setForm] = useState({ name: '', category: 'emergency', targetAmount: '', description: '' });
  const [contAmount, setContAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [showHajjPrompt, setShowHajjPrompt] = useState(true);
  const [showUmrahPrompt, setShowUmrahPrompt] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Once-per-session milestone guard
  const milestonesRef = useRef<Set<string>>(new Set());

  const checkMilestones = (items: Goal[]) => {
    items.forEach(g => {
      const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      const milestone = getMilestone(pct);
      if (!milestone) return;
      const key = `${g.id}_${milestone}`;
      if (milestonesRef.current.has(key)) return;
      milestonesRef.current.add(key);
      if (milestone === '100') {
        toast(`🎉 "${g.name}" goal achieved! Alhamdulillah! 🕌`, 'success');
      } else if (milestone === '75') {
        toast(`🎯 "${g.name}" is 75% complete — almost there!`, 'info');
      } else {
        toast(`💪 "${g.name}" is halfway to your goal!`, 'info');
      }
    });
  };

  const load = () => {
    setLoading(true);
    api.getSavingsGoals()
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          return;
        }
        const items: Goal[] = Array.isArray(d?.goals) ? d.goals : Array.isArray(d) ? d : [];
        setGoals(items);
        checkMilestones(items);
      })
      .catch(() => { toast('Failed to load savings goals', 'error'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    if (!form.name.trim()) { toast('Please enter a goal name', 'error'); setSaving(false); return; }
    try {
      const target = parseFloat(form.targetAmount);
      if (!target || target <= 0) { toast('Target amount must be greater than zero', 'error'); setSaving(false); return; }
      await api.addSavingsGoal({ ...form, name: form.name.trim(), targetAmount: target });
      setShowForm(false); setForm({ name: '', category: 'emergency', targetAmount: '', description: '' }); load();
      toast('Savings goal created', 'success');
    } catch { toast('Failed to create savings goal', 'error'); }
    setSaving(false);
  };

  const handleContribute = async () => {
    if (!contModal) return;
    setSaving(true);
    try {
      const contrib = parseFloat(contAmount);
      if (!contrib || contrib <= 0) { alert('Contribution amount must be greater than zero'); setSaving(false); return; }
      await api.contributeSavingsGoal(contModal.id, contrib);
      setContModal(null); setContAmount('');
      load(); // re-check milestones after contribution
      toast('Contribution added', 'success');
    } catch { toast('Failed to add contribution', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this savings goal?')) return;
    setDeletingId(id);
    try {
      await api.deleteSavingsGoal(id);
      toast('Savings goal deleted', 'success');
    } catch {
      toast('Failed to delete savings goal', 'error');
    } finally {
      setDeletingId(null);
      load();
    }
  };

  // ── Skeleton loading ────────────────────────────────────────────────────────
  if (loading) return <SkeletonPage summaryCount={1} listCount={3} />;

  const totalSaved  = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Savings Goals</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ New Goal</button>
      </div>

      {/* ── Aggregate banner ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-blue-100 text-sm">Total Saved</p>
        <p className="text-4xl font-bold">{fmt(totalSaved)}</p>
        <p className="text-blue-200 text-sm mt-1">of {fmt(totalTarget)} target across {goals.length} goal{goals.length !== 1 ? 's' : ''}</p>
        {totalTarget > 0 && (
          <div className="w-full bg-blue-900/40 rounded-full h-3 mt-3">
            <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }} />
          </div>
        )}
      </div>

      {/* ── Hajj prompt ────────────────────────────────────────────────────── */}
      {showHajjPrompt && !goals.some(g => g.category === 'hajj') && (
        <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-5 text-white mb-6 relative">
          <button type="button" onClick={() => setShowHajjPrompt(false)} className="absolute top-3 right-3 text-white/70 hover:text-white text-lg leading-none">✕</button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🕋</span>
            <div>
              <p className="font-bold text-lg">Save for Hajj</p>
              <p className="text-amber-100 text-sm">Hajj is obligatory once in a lifetime for those who are able. Start saving today.</p>
            </div>
          </div>
          <button onClick={() => {
            setForm({ name: 'Hajj Savings', category: 'hajj', targetAmount: '10000', description: 'Saving for the obligatory pilgrimage to Makkah — may Allah accept it.' });
            setShowForm(true);
          }} className="bg-white text-amber-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-50 transition">
            🕋 Start Hajj Savings Goal
          </button>
        </div>
      )}

      {/* ── Umrah prompt ───────────────────────────────────────────────────── */}
      {showUmrahPrompt && !goals.some(g => g.category === 'umrah') && (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-5 text-white mb-6 relative">
          <button type="button" onClick={() => setShowUmrahPrompt(false)} className="absolute top-3 right-3 text-white/70 hover:text-white text-lg leading-none">✕</button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🕌</span>
            <div>
              <p className="font-bold text-lg">Save for Umrah</p>
              <p className="text-teal-100 text-sm">Umrah is a blessed Sunnah you can perform any time of year. Start saving today.</p>
            </div>
          </div>
          <button onClick={() => {
            setForm({ name: 'Umrah Savings', category: 'umrah', targetAmount: '3000', description: 'Saving for the blessed journey to Makkah and Madinah — may Allah grant acceptance.' });
            setShowForm(true);
          }} className="bg-white text-teal-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-teal-50 transition">
            🕌 Start Umrah Savings Goal
          </button>
        </div>
      )}

      {/* ── Goals list or empty state ───────────────────────────────────────── */}
      {goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
            const done = pct >= 100;
            return (
              <div key={g.id} className={`bg-white rounded-xl p-4 ${done ? 'border-l-4 border-green-500' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-[#1B5E20] flex items-center gap-1.5">
                      {g.name}{done && <span className="text-green-600 text-sm">✅</span>}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{g.category}{g.description ? ` • ${g.description}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setContModal(g); setContAmount(''); }} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">+ Add</button>
                    <button type="button" onClick={() => handleDelete(g.id)} disabled={deletingId === g.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === g.id ? 'Deleting...' : 'Del'}</button>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{fmt(g.currentAmount)}</span>
                  <span className="text-gray-700 font-medium">{fmt(g.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${done ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{pct.toFixed(0)}% complete</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl">
          <p className="text-5xl mb-4">🎯</p>
          <p className="text-gray-600 font-semibold text-lg mb-1">No savings goals yet</p>
          <p className="text-gray-400 text-sm mb-6">Set a goal for Hajj, Umrah, an emergency fund, or anything that matters to you.</p>
          <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-xl hover:bg-[#2E7D32] font-medium text-sm">
            + New Goal
          </button>
        </div>
      )}

      {/* ── New goal modal ─────────────────────────────────────────────────── */}
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
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name || !form.targetAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contribute modal ───────────────────────────────────────────────── */}
      {contModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Contribute</h2>
            <p className="text-gray-500 text-sm mb-4">{contModal.name} • {fmt(contModal.currentAmount)} / {fmt(contModal.targetAmount)}</p>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" step="0.01" value={contAmount} onChange={e => setContAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="100" /></div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setContModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleContribute} disabled={saving || !contAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Contribute'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
