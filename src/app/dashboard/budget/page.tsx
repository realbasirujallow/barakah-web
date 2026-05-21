'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { SkeletonPage } from '../SkeletonCard';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';
import { FormHelp } from '../../../components/dashboard/FormHelp';
import EmptyState from '../../../components/EmptyState';

// 2026-05-02 (Monarch parity gap #4): the backend now exposes
// rolloverStrategy (NONE / REFILL / ACCUMULATE) and categoryKind
// (FIXED / FLEX) on every budget. Mirror them here so the UI can
// group sticky-vs-flex budgets and let users toggle rollover from
// the edit modal.
type RolloverStrategy = 'NONE' | 'REFILL' | 'ACCUMULATE';
type CategoryKind = 'FIXED' | 'FLEX';
interface BudgetItem {
  id: number;
  category: string;
  monthlyLimit: number;
  spent: number;
  month: number;
  year: number;
  color: string;
  rolledOverAmount?: number;
  effectiveLimit?: number;
  allowRollover?: boolean;
  rolloverStrategy?: RolloverStrategy;
  categoryKind?: CategoryKind;
}
const CATEGORIES = [
  'food', 'dining', 'groceries', 'coffee',
  'transportation', 'fuel', 'parking',
  'housing', 'rent', 'utilities', 'home_maintenance', 'insurance',
  'shopping', 'clothing', 'electronics',
  'healthcare', 'fitness', 'pharmacy',
  'education', 'kids', 'childcare',
  'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets',
  'savings', 'debt_payment', 'taxes',
  'charity', 'zakat', 'sadaqah',
  'business', 'other',
];
const MONTH_KEYS = ['budgetMonJan', 'budgetMonFeb', 'budgetMonMar', 'budgetMonApr', 'budgetMonMay', 'budgetMonJun', 'budgetMonJul', 'budgetMonAug', 'budgetMonSep', 'budgetMonOct', 'budgetMonNov', 'budgetMonDec'];

function catLabel(cat: string) { return cat.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase()); }

function getCategoryIcon(cat: string): string {
  const categoryMap: Record<string, string> = {
    'food': '🛒', 'dining': '🛒', 'groceries': '🛒', 'coffee': '🛒',
    'housing': '🏠', 'rent': '🏠', 'home_maintenance': '🏠', 'utilities': '⚡', 'insurance': '🛡️',
    'transportation': '🚗', 'fuel': '🚗', 'parking': '🚗', 'public_transit': '🚗',
    'healthcare': '💊', 'fitness': '💪', 'pharmacy': '💊',
    'education': '📚', 'kids': '👶', 'childcare': '👶',
    'entertainment': '🎬', 'subscriptions': '🎬', 'travel': '✈️', 'gifts': '🎁', 'personal_care': '💄', 'pets': '🐕',
    'shopping': '🛍️', 'clothing': '👔', 'electronics': '💻',
    'savings': '💰', 'debt_payment': '💳', 'taxes': '📋', 'transfer': '🔄',
    'charity': '🤲', 'zakat': '🕌', 'sadaqah': '🤲',
    'business': '💼', 'investment': '📈', 'income': '💵',
    'other': '📦',
  };
  return categoryMap[cat] || '📦';
}

export default function BudgetPage() {
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  const mon = (idx: number) => t(MONTH_KEYS[idx]);
  const now = new Date();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  // 2026-05-02: lock body scroll while the add/edit form is open so
  // the budget list doesn't scroll behind the modal. Same fix the
  // admin panel just received.
  useBodyScrollLock(showForm);
  const [form, setForm] = useState<{
    category: string;
    monthlyLimit: string;
    month: string;
    year: string;
    rolloverStrategy: RolloverStrategy;
    categoryKind: CategoryKind;
  }>({
    category: 'food',
    monthlyLimit: '',
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    rolloverStrategy: 'REFILL',
    categoryKind: 'FLEX',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copyingMonth, setCopyingMonth] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  // Monthly navigation — view budgets for a specific month
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-indexed
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const goToPrevMonth = () => { if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); } else { setViewMonth(m => m - 1); } };
  const goToNextMonth = () => { if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); } else { setViewMonth(m => m + 1); } };
  const { toast } = useToast();

  // Once-per-session alert guard — prevents re-toasting on every re-render / reload.
  // Persisted to sessionStorage so remounts within the same session don't retrigger alerts.
  const alertedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('budget_alerted_keys');
      if (stored) {
        const keys: string[] = JSON.parse(stored);
        alertedRef.current = new Set(keys);
      }
    } catch { /* ignore parse or storage errors */ }
  }, []);

  const addAlertedKey = (key: string) => {
    alertedRef.current.add(key);
    try {
      sessionStorage.setItem('budget_alerted_keys', JSON.stringify(Array.from(alertedRef.current)));
    } catch { /* ignore storage errors */ }
  };

  const checkBudgetAlerts = (items: BudgetItem[]) => {
    items.forEach(b => {
      if (b.monthlyLimit <= 0) return;
      const key = `${b.category}_${b.month}_${b.year}`;
      if (alertedRef.current.has(key)) return;
      const pct = (b.spent / b.monthlyLimit) * 100;
      // 2026-05-12 overnight QA (BG-003): celebrate over-charity instead
      // of flagging it as overspending. Same detection rule as the row
      // rendering below.
      const cat = (b.category ?? '').toLowerCase();
      const isCharity = (
        cat.includes('charity') || cat.includes('sadaqah') || cat.includes('zakat')
        || cat.includes('donation') || cat.includes('masjid')
      );
      if (b.spent >= b.monthlyLimit) {
        if (isCharity) {
          toast(tFmt('budgetGenerousToastFmt', [fmt(b.spent - b.monthlyLimit), catLabel(b.category)]), 'success');
        } else {
          toast(tFmt('budgetExceededToastFmt', [catLabel(b.category), fmt(b.spent), fmt(b.monthlyLimit)]), 'error');
        }
        addAlertedKey(key);
      } else if (pct >= 80) {
        toast(tFmt('budgetWarnToastFmt', [catLabel(b.category), Math.round(pct)]), 'info');
        addAlertedKey(key);
      }
    });
  };

  const load = () => {
    setLoading(true);
    // BUG FIX: pass the viewed month/year so the API returns only those
    // budgets instead of all history — was fetching entire budget history and
    // filtering client-side, which grows with each month the user has data.
    api.getBudgets(viewMonth, viewYear)
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          return;
        }
        const items: BudgetItem[] = Array.isArray(d?.budgets) ? d.budgets : Array.isArray(d) ? d : [];
        setBudgets(items);
        checkBudgetAlerts(items);
      })
      .catch(() => { toast(t('budgetLoadError'), 'error'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [viewMonth, viewYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    setEditItem(null);
    setForm({
      category: 'food',
      monthlyLimit: '',
      month: String(viewMonth),
      year: String(viewYear),
      rolloverStrategy: 'REFILL',
      categoryKind: 'FLEX',
    });
    setSaveError(null); setShowForm(true);
  };
  const openEdit = (b: BudgetItem) => {
    setEditItem(b);
    setForm({
      category: b.category,
      monthlyLimit: String(b.monthlyLimit),
      month: String(b.month),
      year: String(b.year),
      rolloverStrategy: b.rolloverStrategy ?? (b.allowRollover ? 'ACCUMULATE' : 'NONE'),
      categoryKind: b.categoryKind ?? 'FLEX',
    });
    setSaveError(null); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      const limit = parseFloat(form.monthlyLimit);
      if (!form.monthlyLimit.trim() || !Number.isFinite(limit) || limit <= 0) {
        setSaveError(t('budgetLimitPositiveError'));
        setSaving(false);
        return;
      }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (limit > MAX_VALUE) {
        setSaveError(tFmt('budgetLimitMaxErrorFmt', [`$${MAX_VALUE.toLocaleString()}`]));
        setSaving(false);
        return;
      }
      // Check decimal precision (max 2 decimal places for currency)
      if (!/^\d+(\.\d{1,2})?$/.test(form.monthlyLimit.trim())) {
        setSaveError(t('budgetDecimalError'));
        setSaving(false);
        return;
      }
      const data = {
        category: form.category,
        monthlyLimit: limit,
        month: parseInt(form.month, 10),
        year: parseInt(form.year, 10),
        rolloverStrategy: form.rolloverStrategy,
        categoryKind: form.categoryKind,
      };
      let result;
      if (editItem) result = await api.updateBudget(editItem.id, data);
      else result = await api.addBudget(data);
      if (result?.error) throw new Error(result.error);
      setShowForm(false); load();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : t('budgetSaveError'));
    }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setConfirmAction({
      message: t('budgetDeleteConfirm'),
      action: async () => {
        await api.deleteBudget(id).catch(() => { toast(t('budgetDeleteError'), 'error'); });
        load();
      }
    });
  };

  const handleCopyMonth = () => {
    // Compute "previous month" relative to the currently-viewed month, not today
    const prev = viewMonth === 1
      ? { month: 12, year: viewYear - 1 }
      : { month: viewMonth - 1, year: viewYear };
    setConfirmAction({
      message: tFmt('budgetCopyConfirmFmt', [mon(prev.month - 1), prev.year, mon(viewMonth - 1), viewYear]),
      action: async () => {
        setCopyingMonth(true);
        try {
          const result = await api.copyBudget(prev.month, prev.year, viewMonth, viewYear);
          if (result?.copied === 0) {
            toast(tFmt('budgetNoneForCopyFmt', [mon(prev.month - 1), prev.year]), 'error');
          } else {
            load();
            if (typeof result?.copied === 'number') {
              toast(tFmt('budgetCopiedFmt', [result.copied, mon(prev.month - 1)]), 'success');
            } else {
              toast(tFmt('budgetCopiedAllFmt', [mon(prev.month - 1)]), 'success');
            }
          }
        } catch { toast(t('budgetCopyError'), 'error'); }
        setCopyingMonth(false);
      }
    });
  };

  // ── Skeleton loading ────────────────────────────────────────────────────────
  if (loading) return <SkeletonPage summaryCount={3} listCount={4} />;

  // 2026-05-12 overnight QA (BG-001): the previous render order was
  // whatever the API returned (typically createdAt asc), which buried
  // the meaningful rows ("Charity over budget", "Housing 6%
  // utilized") behind 8–10 untouched $0 categories. First-glance read
  // was "every category is $0, the math is broken." Sort by activity:
  //   1. Over-budget categories first (spent >= limit, biggest %% over)
  //   2. Then categories with spend, by % utilized descending
  //   3. Then untouched categories, alphabetically
  // The Total Spent / Total Budget summary stays accurate regardless
  // because we don't change the underlying array length or values.
  const filteredBudgets = budgets
    .filter(b => b.month === viewMonth && b.year === viewYear)
    .slice() // copy before sort to avoid mutating state
    .sort((a, b) => {
      const aPct = a.monthlyLimit > 0 ? a.spent / a.monthlyLimit : 0;
      const bPct = b.monthlyLimit > 0 ? b.spent / b.monthlyLimit : 0;
      const aOver = aPct >= 1;
      const bOver = bPct >= 1;
      if (aOver !== bOver) return aOver ? -1 : 1;          // over-budget first
      const aActive = a.spent > 0;
      const bActive = b.spent > 0;
      if (aActive !== bActive) return aActive ? -1 : 1;     // any spend next
      if (aActive && bActive) return bPct - aPct;           // descending %
      return (a.category ?? '').localeCompare(b.category ?? '');
    });
  const totalBudget = filteredBudgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalSpent  = filteredBudgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div>
      <PageHeader
        title={t('budgetTitle')}
        subtitle={tFmt('budgetSubtitleFmt', [mon(viewMonth - 1), viewYear])}
        actions={
          <>
            <button type="button" onClick={handleCopyMonth} disabled={copyingMonth}
              className="px-3 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-green-50 transition disabled:opacity-50">
              {copyingMonth ? t('budgetCopyingBtn') : t('budgetCopyBtn')}
            </button>
            <button type="button" onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('budgetAddBtn')}</button>
          </>
        }
      />

      {/* ── Month Navigation ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button type="button" onClick={goToPrevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">{t('budgetPrev')}</button>
        <span className="text-lg font-semibold text-gray-800">{mon(viewMonth - 1)} {viewYear}</span>
        <button type="button" onClick={goToNextMonth}
          disabled={viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear()}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">{t('budgetNext')}</button>
      </div>

      {/* ── Summary cards.
          R42 (2026-05-01): viewTransitionName matches the dashboard's
          Budget Overview card so the morph completes when arriving
          from /dashboard. */}
      <div
        className="grid md:grid-cols-3 gap-4 mb-6"
        style={{ viewTransitionName: 'budget-hero' }}
      >
        {/* 2026-05-11 (Bug-A3): when both Budget and Spent are 0 (empty
            state) the orange/green semantics read as "you spent zero (bad),
            remaining zero (good)" which is meaningless. Drop the semantic
            color in the empty state. */}
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">{t('budgetTotal')}</p><p className="text-2xl font-bold text-primary">{fmt(totalBudget)}</p></div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">{t('budgetSpent')}</p>
          <p className={`text-2xl font-bold ${totalBudget === 0 && totalSpent === 0 ? 'text-gray-400' : 'text-orange-600'}`}>{fmt(totalSpent)}</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">{t('budgetRemaining')}</p>
          <p className={`text-2xl font-bold ${
            totalBudget === 0 && totalSpent === 0
              ? 'text-gray-400'
              : totalBudget - totalSpent >= 0
                ? 'text-green-600'
                : 'text-red-600'
          }`}>{fmt(totalBudget - totalSpent)}</p>
        </div>
      </div>

      {/* ── Budget list or empty state ──────────────────────────────────────── */}
      {filteredBudgets.length > 0 ? (
        <div className="space-y-3">
          {filteredBudgets.map(b => {
            // 2026-05-02 (gap #4): include rolled-over amount in the
            // visible "ceiling" so the user sees their true spending
            // limit. effectiveLimit comes from the backend; falls back
            // to monthlyLimit for legacy responses.
            const effectiveLimit = b.effectiveLimit ?? b.monthlyLimit;
            const rolled = b.rolledOverAmount ?? 0;
            const pct = effectiveLimit > 0 ? Math.min((b.spent / effectiveLimit) * 100, 100) : 0;
            const over = b.spent > effectiveLimit;
            const criticalWarn = pct >= 90;
            const warn = !over && !criticalWarn && pct >= 75;
            const overage = Math.max(0, b.spent - effectiveLimit);
            // 2026-05-12 overnight QA (BG-003): for Barakah's Muslim
            // audience, exceeding a Sadaqah / Zakat / Charity budget is
            // praiseworthy — not a failure. Treat over-budget on
            // charity-tagged categories as a positive ("generous") signal
            // instead of the red alarm. Detection is case-insensitive
            // substring match against the category slug because the
            // backend stores it lower-case (charity, sadaqah, zakat,
            // donation, masjid) but pretty-print may capitalize.
            const charityCategorySlug = (b.category ?? '').toLowerCase();
            const isCharityCategory = (
              charityCategorySlug.includes('charity')
              || charityCategorySlug.includes('sadaqah')
              || charityCategorySlug.includes('zakat')
              || charityCategorySlug.includes('donation')
              || charityCategorySlug.includes('masjid')
            );
            const isGenerous = over && isCharityCategory;
            const kindLabel = b.categoryKind === 'FIXED' ? t('budgetKindFixed') : t('budgetKindFlex');
            const strategyLabel = b.rolloverStrategy === 'ACCUMULATE'
              ? t('budgetStrategyAccumulating') : b.rolloverStrategy === 'NONE' ? t('budgetStrategyNone') : t('budgetStrategyRefills');
            return (
              <div key={b.id} className={`bg-white rounded-xl p-4 ${isGenerous ? 'border-l-4 border-emerald-500' : over ? 'border-l-4 border-red-500' : criticalWarn ? 'border-l-4 border-red-400' : warn ? 'border-l-4 border-amber-400' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(b.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{catLabel(b.category)}</p>
                      <p className="text-xs text-gray-500">
                        {mon(b.month - 1)} {b.year}
                        <span className="ml-1.5 inline-flex items-center gap-1">
                          <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${b.categoryKind === 'FIXED' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>
                            {kindLabel}
                          </span>
                          <span className="text-[10px] text-gray-400" title={strategyLabel}>· {strategyLabel}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isGenerous && (
                      <span
                        className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium"
                        title={t('budgetGenerousBadgeTitle')}
                      >
                        {tFmt('budgetGenerousBadgeFmt', [fmt(overage)])}
                      </span>
                    )}
                    {over && !isGenerous && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{tFmt('budgetOverBadgeFmt', [fmt(overage)])}</span>}
                    {criticalWarn && !over && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{tFmt('budgetCriticalBadgeFmt', [Math.round(pct)])}</span>}
                    {warn && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{tFmt('budgetWarningBadgeFmt', [Math.round(pct)])}</span>}
                    <p className="text-sm"><span className={isGenerous ? 'text-emerald-700 font-bold' : over ? 'text-red-600 font-bold' : criticalWarn ? 'text-red-600' : 'text-gray-700'}>{fmt(b.spent)}</span> / {fmt(effectiveLimit)}</p>
                    <button type="button" onClick={() => openEdit(b)} className="text-gray-400 hover:text-blue-600 text-sm">{t('budgetEdit')}</button>
                    <button type="button" onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">{t('budgetDel')}</button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${isGenerous ? 'bg-emerald-500' : over ? 'bg-red-600' : pct >= 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                </div>
                {rolled > 0 && (
                  // Show the carry-over breakdown so users understand
                  // why their effective limit isn't a round number.
                  // gray-700/600 auto-map to lighter shades in dark via globals.css.
                  // Emerald has no auto-map, so dark:text-emerald-400 is set explicitly.
                  <p className="text-xs text-gray-700 mt-1.5">
                    {tFmt('budgetRolledOverFmt', [fmt(rolled)])}
                    <span className="text-gray-600">{tFmt('budgetRolledOverBaseFmt', [fmt(b.monthlyLimit), fmt(rolled)])}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Phase 24e (2026-04-30): swap the inline empty state for the
        // shared <EmptyState /> with a sample-preview row so users see
        // what a populated budget looks like before they create one —
        // matches Monarch / Linear's "show, don't tell" empty UX.
        <EmptyState
          icon="📋"
          title={viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear() ? t('budgetEmptyTitleCurrent') : t('budgetEmptyTitleOther')}
          description={
            viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear()
              ? t('budgetEmptyDescCurrent')
              : t('budgetEmptyDescOther')
          }
          actions={
            viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear()
              ? [{ label: t('budgetEmptyActionCreate'), onClick: openAdd, primary: true }]
              : [
                  { label: t('budgetEmptyActionCreateAlt'), onClick: openAdd, primary: true },
                  { label: t('budgetEmptyActionCopy'), onClick: handleCopyMonth },
                ]
          }
          preview={
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🍽️</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t('budgetPreviewFood')}</p>
                    <p className="text-[10px] text-gray-500">{mon(viewMonth - 1)} {viewYear}</p>
                  </div>
                </div>
                <p className="text-xs"><span className="text-gray-700">{fmt(320)}</span> / {fmt(500)}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '64%' }} />
              </div>
            </div>
          }
        />
      )}

      {/* ── Add / Edit modal ────────────────────────────────────────────────── */}
      {/* 2026-05-02 (revert): centered pattern + max-h on inner box.
          The earlier outer-scroll restructure caused freeze reports;
          see useBodyScrollLock for the surviving fix. */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary mb-4">{editItem ? t('budgetModalEditTitle') : t('budgetModalAddTitle')}</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  {t('budgetFieldCategory')}
                  <FormHelp ariaLabel={t('budgetHelpCategory')}>
                    {t('budgetHelpCategoryBody')}
                  </FormHelp>
                </label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  {t('budgetFieldMonthlyLimit')}
                  <FormHelp ariaLabel={t('budgetHelpLimit')}>
                    {t('budgetHelpLimitBody')}
                  </FormHelp>
                </label>
                {/*
                  Round 36 (2026-04-30): switch from type="number" to
                  type="text" + inputMode="decimal". type="number" with
                  step="0.01" has well-known controlled-input bugs:
                    • iOS Safari sometimes drops the second character
                      because valueAsNumber isn't kept in sync with the
                      string value during rapid typing.
                    • Android Chrome strips trailing dots ("1." → "1")
                      mid-typing when the user is heading toward "1.5",
                      visually losing the intermediate keystroke.
                    • Browsers that don't recognize the user's locale
                      decimal separator silently reject keystrokes.
                  type="text" + inputMode="decimal" gives the same
                  numeric keyboard on mobile but lets us own the value
                  state. The pattern attribute keeps mobile keyboard
                  validation hints. Validation still runs on save.
                */}
                <input type="text" inputMode="decimal" pattern="[0-9]*\.?[0-9]*"
                  value={form.monthlyLimit}
                  onChange={e => setForm({ ...form, monthlyLimit: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('budgetLimitPlaceholder')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('budgetFieldMonth')}</label>
                  <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {MONTH_KEYS.map((mk, i) => <option key={i} value={String(i + 1)}>{t(mk)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('budgetFieldYear')}</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4}
                    value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900" />
                </div>
              </div>

              {/* 2026-05-02 (Monarch parity gap #4): sticky/flex + rollover
                  controls. Sticky for fixed obligations (rent, subs) where
                  any leftover should expire each month; flex for variable
                  spend where rolling unspent forward is useful. The
                  rollover strategy is independent — power users can
                  pick FIXED + ACCUMULATE for an "annual rebate fund"
                  pattern. */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                    {t('budgetFieldCategoryType')}
                    <FormHelp ariaLabel={t('budgetHelpType')}>
                      <strong>{t('budgetHelpTypeBodyPrefix')}</strong> {t('budgetHelpTypeBodyMid')} <strong>{t('budgetHelpTypeBodyFlexLabel')}</strong> {t('budgetHelpTypeBodySuffix')}
                    </FormHelp>
                  </label>
                  <select
                    value={form.categoryKind}
                    onChange={e => {
                      const next = e.target.value as CategoryKind;
                      // Sensible default: FIXED → REFILL, FLEX → REFILL.
                      // Don't auto-flip ACCUMULATE because the user may
                      // have intentionally chosen it.
                      setForm(f => ({
                        ...f,
                        categoryKind: next,
                        rolloverStrategy: next === 'FIXED' && f.rolloverStrategy === 'ACCUMULATE'
                          ? 'REFILL' : f.rolloverStrategy,
                      }));
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  >
                    <option value="FLEX">{t('budgetCatKindFlexOpt')}</option>
                    <option value="FIXED">{t('budgetCatKindFixedOpt')}</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                    {t('budgetFieldRollover')}
                    <FormHelp ariaLabel={t('budgetHelpRollover')}>
                      <strong>{t('budgetHelpRolloverRefillLabel')}</strong> {t('budgetHelpRolloverRefillBody')}
                      <strong> {t('budgetHelpRolloverAccumulateLabel')}</strong> {t('budgetHelpRolloverAccumulateBody')}
                      <strong> {t('budgetHelpRolloverNoneLabel')}</strong> {t('budgetHelpRolloverNoneBody')}
                    </FormHelp>
                  </label>
                  <select
                    value={form.rolloverStrategy}
                    onChange={e => setForm({ ...form, rolloverStrategy: e.target.value as RolloverStrategy })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  >
                    <option value="REFILL">{t('budgetRolloverRefillOpt')}</option>
                    <option value="ACCUMULATE">{t('budgetRolloverAccumulateOpt')}</option>
                    <option value="NONE">{t('budgetRolloverNoneOpt')}</option>
                  </select>
                </div>
              </div>
            </div>
            {saveError && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{saveError}</div>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('budgetCancel')}</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.monthlyLimit}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">
                {saving ? t('budgetSaving') : editItem ? t('budgetUpdate') : t('budgetAdd')}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('budgetCancel')}</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('budgetConfirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
