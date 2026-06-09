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
import ModalShell from '../../../components/ui/ModalShell';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { FormHelp } from '../../../components/dashboard/FormHelp';
import { useI18n } from '../../../lib/i18n';

interface Goal { id: number; name: string; category: string; targetAmount: number; currentAmount: number; description: string; deadline: number | null; }
const CATS = ['hajj', 'umrah', 'emergency', 'education', 'wedding', 'home', 'vehicle', 'business', 'retirement', 'other'];
const CAT_KEYS: Record<string, string> = {
  hajj: 'savingsCatHajj', umrah: 'savingsCatUmrah', emergency: 'savingsCatEmergency',
  education: 'savingsCatEducation', wedding: 'savingsCatWedding', home: 'savingsCatHome',
  vehicle: 'savingsCatVehicle', business: 'savingsCatBusiness', retirement: 'savingsCatRetirement',
  other: 'savingsCatOther',
};

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
  const { t, tFmt } = useI18n();
  const catLabel = (c: string) => CAT_KEYS[c] ? t(CAT_KEYS[c]) : c.charAt(0).toUpperCase() + c.slice(1);
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
  // 2026-05-02: lock body scroll while modal/confirm is open.
  useBodyScrollLock(showForm || contModal !== null || confirmAction !== null);
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
        toast(tFmt('savingsMilestone100ToastFmt', [g.name]), 'success');
      } else if (milestone === '75') {
        toast(tFmt('savingsMilestone75ToastFmt', [g.name]), 'info');
      } else {
        toast(tFmt('savingsMilestone50ToastFmt', [g.name]), 'info');
      }
    });
  };

  // 2026-06-08 (UX-WEB-LISTS-NORETRY-1): persistent error + retry.
  const [loadError, setLoadError] = useState<string | null>(null);
  const load = () => {
    setLoading(true);
    setLoadError(null);
    api.getSavingsGoals()
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          setLoadError(d.error as string);
          return;
        }
        const items: Goal[] = Array.isArray(d?.goals) ? d.goals : Array.isArray(d) ? d : [];
        setGoals(items);
        checkMilestones(items);
      })
      .catch(() => {
        const msg = t('savingsLoadError');
        toast(msg, 'error');
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    if (!form.name.trim()) { toast(t('savingsNameRequiredError'), 'error'); setSaving(false); return; }
    try {
      const target = parseFloat(form.targetAmount);
      // Validate target: must be finite and positive
      if (!Number.isFinite(target) || target <= 0) {
        toast(t('savingsTargetPositiveError'), 'error');
        setSaving(false);
        return;
      }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (target > MAX_VALUE) {
        toast(tFmt('savingsTargetMaxErrorFmt', [`${symbol}${MAX_VALUE.toLocaleString()}`]), 'error');
        setSaving(false);
        return;
      }
      // Check decimal precision (max 2 decimal places)
      if (!/^\d+(\.\d{1,2})?$/.test(form.targetAmount.trim())) {
        toast(t('savingsTargetDecimalError'), 'error');
        setSaving(false);
        return;
      }
      await api.addSavingsGoal({ ...form, name: form.name.trim(), targetAmount: target });
      setShowForm(false); setForm({ name: '', category: 'emergency', targetAmount: '', description: '' }); load();
      toast(t('savingsCreatedToast'), 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('savingsCreateError');
      toast(msg, 'error');
    }
    setSaving(false);
  };

  const handleContribute = async () => {
    if (!contModal) return;
    setSaving(true); setContError(null);
    try {
      const contrib = parseFloat(contAmount);
      if (!Number.isFinite(contrib) || contrib <= 0) {
        const msg = t('savingsContribPositiveError');
        setContError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      const MAX_VALUE = 1_000_000_000;
      if (contrib > MAX_VALUE) {
        // 2026-06-08 (CUR-SAVINGS-DOLLAR-1): use the resolved symbol
        // (target-max sibling toast already does), not a hardcoded `$`.
        const msg = tFmt('savingsContribMaxErrorFmt', [`${symbol}${MAX_VALUE.toLocaleString()}`]);
        setContError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(contAmount.trim())) {
        const msg = t('savingsContribDecimalError');
        setContError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      await api.contributeSavingsGoal(contModal.id, contrib);
      setContModal(null); setContAmount('');
      load(); // re-check milestones after contribution
      toast(t('savingsContribAddedToast'), 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('savingsContribError');
      toast(msg, 'error');
    }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setConfirmAction({
      message: t('savingsDeleteConfirm'),
      action: async () => {
        setDeletingId(id);
        try {
          await api.deleteSavingsGoal(id);
          toast(t('savingsDeletedToast'), 'success');
        } catch (err) {
          const msg = err instanceof Error ? err.message : t('savingsDeleteError');
          toast(msg, 'error');
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
  const isFreePlan = !user || !hasAccess(user.plan, 'plus', user.planExpiresAt, user.isAdmin);

  if (isFreePlan) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center px-4">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('savingsGateTitle')}</h1>
        <p className="text-gray-600 mb-6">
          {t('savingsGateIntro')}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-left space-y-2">
          <p className="font-semibold text-green-800 text-sm">{t('savingsGateFeature1')}</p>
          <p className="font-semibold text-green-800 text-sm">{t('savingsGateFeature2')}</p>
          <p className="font-semibold text-green-800 text-sm">{t('savingsGateFeature3')}</p>
          <p className="font-semibold text-green-800 text-sm">{t('savingsGateFeature4')}</p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition"
        >
          {t('savingsGateUpgradeBtn')}
        </Link>
        <p className="text-xs text-gray-400 mt-3">{tFmt('savingsTrialNoCardFmt', [DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL])}</p>
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
        title={t('savingsTitle')}
        subtitle={t('savingsSubtitle')}
        actions={
          <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('savingsNewGoalBtn')}</button>
        }
      />

      {/* 2026-06-08 (UX-WEB-LISTS-NORETRY-1): persistent error + retry. */}
      {loadError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-800 flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={load}
            className="shrink-0 bg-yellow-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-800 transition"
          >
            {t('zktRetry')}
          </button>
        </div>
      )}

      {/* ── Aggregate banner ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-blue-100 text-sm">{t('savingsTotalSaved')}</p>
        <p className="text-4xl font-bold">{fmt(totalSaved)}</p>
        <p className="text-blue-200 text-sm mt-1">{tFmt(goals.length === 1 ? 'savingsTargetAcrossFmt' : 'savingsTargetAcrossPluralFmt', [fmt(totalTarget), goals.length])}</p>
        {totalTarget > 0 && (
          <div className="w-full bg-blue-900/40 rounded-full h-3 mt-3">
            <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }} />
          </div>
        )}
      </div>

      {/* ── Hajj prompt ────────────────────────────────────────────────────── */}
      {showHajjPrompt && !goals.some(g => g.category === 'hajj') && (
        <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-5 text-white mb-6 relative">
          <button type="button" aria-label={t('savingsDismissPromptAria')} onClick={() => setShowHajjPrompt(false)} className="absolute top-3 right-3 text-white/70 hover:text-white text-lg leading-none">✕</button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🕋</span>
            <div>
              <p className="font-bold text-lg">{t('savingsHajjPromptTitle')}</p>
              <p className="text-amber-100 text-sm">{t('savingsHajjPromptBody')}</p>
            </div>
          </div>
          <button onClick={() => {
            setForm({ name: t('savingsHajjGoalName'), category: 'hajj', targetAmount: '10000', description: t('savingsHajjGoalDesc') });
            setShowForm(true);
          }} className="bg-white text-amber-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-50 transition">
            {t('savingsHajjPromptBtn')}
          </button>
        </div>
      )}

      {/* ── Umrah prompt ───────────────────────────────────────────────────── */}
      {showUmrahPrompt && !goals.some(g => g.category === 'umrah') && (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-5 text-white mb-6 relative">
          <button type="button" aria-label={t('savingsDismissPromptAria')} onClick={() => setShowUmrahPrompt(false)} className="absolute top-3 right-3 text-white/70 hover:text-white text-lg leading-none">✕</button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🕌</span>
            <div>
              <p className="font-bold text-lg">{t('savingsUmrahPromptTitle')}</p>
              <p className="text-teal-100 text-sm">{t('savingsUmrahPromptBody')}</p>
            </div>
          </div>
          <button onClick={() => {
            setForm({ name: t('savingsUmrahGoalName'), category: 'umrah', targetAmount: '3000', description: t('savingsUmrahGoalDesc') });
            setShowForm(true);
          }} className="bg-white text-teal-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-teal-50 transition">
            {t('savingsUmrahPromptBtn')}
          </button>
        </div>
      )}

      {/* ── Goals list or empty state ───────────────────────────────────────── */}
      {goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
            const done = pct >= 100;
            // 2026-05-03 (Monarch parity, Section B): richer milestone
            // visualization. We render a 4-step ladder (25/50/75/100)
            // beneath the bar so the user can see how close the next
            // milestone is, plus a CSS-only celebration sparkle layer
            // when the goal is fully funded.
            const nextMilestone = pct >= 75 ? 100 : pct >= 50 ? 75 : pct >= 25 ? 50 : 25;
            const remainingToNext = Math.max(0, (g.targetAmount * nextMilestone) / 100 - g.currentAmount);
            return (
              <div
                key={g.id}
                className={`bg-white rounded-xl p-4 relative overflow-hidden ${done ? 'border-l-4 border-green-500' : ''}`}
              >
                {/* Sparkle celebration overlay — only renders when goal is met.
                    Pure CSS animation, no deps. Three emojis float up + fade
                    on different delays so it reads as a tiny burst, not
                    confetti spam. aria-hidden so it doesn't bother SR users. */}
                {done && (
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <span className="absolute top-2 left-[20%] text-xl animate-sparkle-1">✨</span>
                    <span className="absolute top-3 left-[55%] text-xl animate-sparkle-2">🎉</span>
                    <span className="absolute top-2 right-[20%] text-xl animate-sparkle-3">🕌</span>
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-primary flex items-center gap-1.5">
                      {g.name}
                      {done && <span className="text-green-600 text-sm inline-block animate-checkmark-pop">✅</span>}
                    </p>
                    <p className="text-sm text-gray-500">{catLabel(g.category)}{g.description ? ` • ${g.description}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setContModal(g); setContAmount(''); }} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">{t('savingsAddContribBtn')}</button>
                    <button type="button" onClick={() => handleDelete(g.id)} disabled={deletingId === g.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === g.id ? t('savingsDeletingBtn') : t('savingsDelBtn')}</button>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{fmt(g.currentAmount)}</span>
                  <span className="text-gray-700 font-medium">{fmt(g.targetAmount)}</span>
                </div>
                {/* Progress track + milestone tick marks. The ticks live on
                    a relatively-positioned wrapper; the fill is the only
                    element that grows. Ticks at 25/50/75 are absolute and
                    never move. 100% is at the right edge so we don't draw
                    a tick there (it'd clip). */}
                <div className="relative w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${done ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                  {/* Tick markers — sit on top of both fill and track. */}
                  {[25, 50, 75].map(tick => (
                    <span
                      key={tick}
                      aria-hidden="true"
                      className={`absolute top-0 bottom-0 w-px ${pct >= tick ? 'bg-white/80' : 'bg-gray-300'}`}
                      style={{ left: `${tick}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <p className="text-gray-400">{tFmt('savingsPercentCompleteFmt', [pct.toFixed(0)])}</p>
                  {done ? (
                    <p className="font-bold text-green-600">{t('savingsGoalCompleted')}</p>
                  ) : (
                    <p className="text-gray-500">
                      {tFmt('savingsRemainingToNextFmt', [fmt(remainingToNext), nextMilestone])}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          illustration="calendar"
          title={t('savingsEmptyTitle')}
          description={t('savingsEmptyDesc')}
          actions={[{ label: t('savingsEmptyAction'), onClick: () => setShowForm(true), primary: true }]}
          preview={
            <div className="space-y-2">
              {[
                { name: t('savingsPreviewHajj'), target: fmt(8500), progress: fmt(2400), pct: 28 },
                { name: t('savingsPreviewEmergency'), target: fmt(15000), progress: fmt(11200), pct: 75 },
                { name: t('savingsPreviewWedding'), target: fmt(25000), progress: fmt(5600), pct: 22 },
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
        <ModalShell onClose={() => setShowForm(false)}>
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{t('savingsModalNewTitle')}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('savingsFieldName')}</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('savingsNamePlaceholder')} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('savingsFieldCategory')}</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATS.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                </select></div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  {t('savingsFieldTarget')}
                  <FormHelp ariaLabel={t('savingsHelpTarget')}>
                    {t('savingsHelpTargetBody')}
                  </FormHelp>
                </label>
                <input type="number" step="0.01" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="10000" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('savingsFieldDescription')}</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" aria-label={t('savingsCloseNewModalAria')} onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('savingsCancelBtn')}</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name || !form.targetAmount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('savingsSavingBtn') : t('savingsCreateBtn')}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ── Contribute modal ───────────────────────────────────────────────── */}
      {contModal && (
        <ModalShell onClose={() => setContModal(null)}>
          <div
            ref={contModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-2">{t('savingsModalContribTitle')}</h2>
            <p className="text-gray-500 text-sm mb-4">{tFmt('savingsContribSummaryFmt', [contModal.name, fmt(contModal.currentAmount), fmt(contModal.targetAmount)])}</p>
            {contError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-2">{contError}</div>}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('savingsFieldAmount')}</label>
              <input type="number" step="0.01" value={contAmount} onChange={e => { setContAmount(e.target.value); setContError(null); }} className={`w-full border rounded-lg px-3 py-2 text-gray-900 ${contError ? 'border-red-400' : ''}`} placeholder="100" /></div>
            <div className="flex gap-3 mt-6">
              <button type="button" aria-label={t('savingsCloseContribModalAria')} onClick={() => setContModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('savingsCancelBtn')}</button>
              <button type="button" onClick={handleContribute} disabled={saving || !contAmount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('savingsSavingBtn') : t('savingsContributeBtn')}</button>
            </div>
          </div>
        </ModalShell>
      )}
      {confirmAction && (
        <ModalShell onClose={() => setConfirmAction(null)}>
          <div
            ref={confirmModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <p id="modal-title" className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" aria-label={t('savingsCloseConfirmModalAria')} onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('savingsCancelBtn')}</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('savingsConfirmBtn')}</button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
