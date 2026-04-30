'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL } from '../../../lib/trial';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { SkeletonPage } from '../SkeletonCard';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import EmptyState from '../../../components/EmptyState';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { PageHeader } from '../../../components/dashboard/PageHeader';

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
  const { user } = useAuth();
  const { fmt, symbol } = useCurrency();
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
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const [contError, setContError] = useState<string | null>(null);
  const { toast } = useToast();

  // ── Modal accessibility: focus trap + Escape close ──────────────────────
  const formModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(formModalRef, showForm);
  const contModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(contModalRef, contModal !== null);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(confirmModalRef, confirmAction !== null);
  useEffect(() => {
    if (!showForm) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowForm(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showForm]);
  useEffect(() => {
    if (!contModal) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setContModal(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [contModal]);
  useEffect(() => {
    if (!confirmAction) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmAction(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [confirmAction]);

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
      // Validate target: must be finite and positive
      if (!Number.isFinite(target) || target <= 0) {
        toast('Target amount must be a positive number', 'error');
        setSaving(false);
        return;
      }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (target > MAX_VALUE) {
        toast(`Target amount cannot exceed ${symbol}${MAX_VALUE.toLocaleString()}`, 'error');
        setSaving(false);
        return;
      }
      // Check decimal precision (max 2 decimal places)
      if (!/^\d+(\.\d{1,2})?$/.test(form.targetAmount.trim())) {
        toast('Please enter a target with up to 2 decimal places', 'error');
        setSaving(false);
        return;
      }
      await api.addSavingsGoal({ ...form, name: form.name.trim(), targetAmount: target });
      setShowForm(false); setForm({ name: '', category: 'emergency', targetAmount: '', description: '' }); load();
      toast('Savings goal created', 'success');
    } catch { toast('Failed to create savings goal', 'error'); }
    setSaving(false);
  };

  const handleContribute = async () => {
    if (!contModal) return;
    setSaving(true); setContError(null);
    try {
      const contrib = parseFloat(contAmount);
      if (!Number.isFinite(contrib) || contrib <= 0) {
        const msg = 'Contribution amount must be a positive number';
        setContError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      const MAX_VALUE = 1_000_000_000;
      if (contrib > MAX_VALUE) {
        const msg = `Contribution cannot exceed $${MAX_VALUE.toLocaleString()}`;
        setContError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(contAmount.trim())) {
        const msg = 'Please enter an amount with up to 2 decimal places';
        setContError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      await api.contributeSavingsGoal(contModal.id, contrib);
      setContModal(null); setContAmount('');
      load(); // re-check milestones after contribution
      toast('Contribution added', 'success');
    } catch { toast('Failed to add contribution', 'error'); }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setConfirmAction({
      message: 'Delete this savings goal?',
      action: async () => {
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
      }
    });
  };

  // ── Plus plan gate ──────────────────────────────────────────────────────────
  // MEDIUM BUG FIX: check plan gate BEFORE skeleton so free users never see a
  // skeleton flash before the upgrade prompt. Skeleton was previously rendered
  // first, causing a jarring UI flicker on every visit for non-paying users.
  const isFreePlan = !user || !hasAccess(user.plan, 'plus', user.planExpiresAt);

  if (isFreePlan) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center px-4">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Savings Goals</h1>
        <p className="text-gray-600 mb-6">
          Set goals for Hajj, emergency fund, education, and more — and track your progress toward each one.
          Available on Barakah Plus.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-left space-y-2">
          <p className="font-semibold text-green-800 text-sm">✓ Set unlimited savings goals</p>
          <p className="font-semibold text-green-800 text-sm">✓ Track progress with milestone alerts</p>
          <p className="font-semibold text-green-800 text-sm">✓ Categories: Hajj, Umrah, Education, Home, and more</p>
          <p className="font-semibold text-green-800 text-sm">✓ Contribute and see remaining balance at a glance</p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition"
        >
          Upgrade to Plus — from $9.99/mo
        </Link>
        <p className="text-xs text-gray-400 mt-3">{DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free trial · No credit card or debit card required</p>
      </div>
    );
  }

  // ── Skeleton loading (after plan gate so free users never see the flash) ────
  if (loading) return <SkeletonPage summaryCount={1} listCount={3} />;

  const totalSaved  = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <div>
      <PageHeader
        title="Savings Goals"
        subtitle="Track progress toward Hajj, emergency fund, and other halal goals"
        actions={
          <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">+ New Goal</button>
        }
      />

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
                    <p className="font-semibold text-primary flex items-center gap-1.5">
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
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{pct.toFixed(0)}% complete</p>
                  {done && <p className="text-xs font-bold text-green-600">Goal Completed!</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="🎯"
          title="Set your first savings goal"
          description="Track progress toward Hajj, Umrah, a wedding, an emergency fund, or anything that matters to your household."
          actions={[{ label: '+ Set your first goal', onClick: () => setShowForm(true), primary: true }]}
          preview={
            <div className="space-y-2">
              {[
                { name: 'Hajj 2027', target: '$8,500', progress: '$2,400', pct: 28 },
                { name: 'Emergency fund', target: '$15,000', progress: '$11,200', pct: 75 },
                { name: 'Wedding', target: '$25,000', progress: '$5,600', pct: 22 },
              ].map((g) => (
                <div key={g.name} className="bg-white rounded-xl p-3 text-left text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-700">{g.name}</p>
                    <span className="text-xs text-gray-500">{g.progress} / {g.target}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          }
        />
      )}

      {/* ── New goal modal ─────────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">New Savings Goal</h2>
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
              <button type="button" aria-label="Close new goal modal" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name || !form.targetAmount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? 'Saving...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contribute modal ───────────────────────────────────────────────── */}
      {contModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={contModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-2">Contribute</h2>
            <p className="text-gray-500 text-sm mb-4">{contModal.name} • {fmt(contModal.currentAmount)} / {fmt(contModal.targetAmount)}</p>
            {contError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-2">{contError}</div>}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input type="number" step="0.01" value={contAmount} onChange={e => { setContAmount(e.target.value); setContError(null); }} className={`w-full border rounded-lg px-3 py-2 text-gray-900 ${contError ? 'border-red-400' : ''}`} placeholder="100" /></div>
            <div className="flex gap-3 mt-6">
              <button type="button" aria-label="Close contribute modal" onClick={() => setContModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleContribute} disabled={saving || !contAmount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? 'Saving...' : 'Contribute'}</button>
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
