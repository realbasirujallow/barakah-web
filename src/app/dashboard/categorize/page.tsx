'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';

interface CategorySuggestion {
  transactionId: number;
  description: string;
  amount: number;
  currentCategory: string;
  currentType: string;
  suggestedCategory: string;
  suggestedType: string;
  confidence: number;
  icon: string;
  wouldChange: boolean;
  matchedRuleId?: number | null;
  matchedRuleName?: string | null;
}

interface TransactionRule {
  id: number;
  name: string;
  enabled: boolean;
  priority: number;
  matchField: string;
  matchOperator: string;
  matchValue?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  typeOverride?: string | null;
  categoryOverride?: string | null;
}

const MATCH_FIELDS = [
  { value: 'any_text', labelKey: 'catMatchFieldAnyText' },
  { value: 'description', labelKey: 'catMatchFieldDescription' },
  { value: 'merchant', labelKey: 'catMatchFieldMerchant' },
  { value: 'category', labelKey: 'catMatchFieldCategory' },
  { value: 'account', labelKey: 'catMatchFieldAccount' },
  { value: 'institution', labelKey: 'catMatchFieldInstitution' },
  { value: 'import_source', labelKey: 'catMatchFieldImportSource' },
];

const OPERATORS = [
  { value: 'contains', labelKey: 'catOpContains' },
  { value: 'equals', labelKey: 'catOpEquals' },
  { value: 'starts_with', labelKey: 'catOpStartsWith' },
  { value: 'regex', labelKey: 'catOpRegex' },
];

const TYPE_OPTIONS = [
  { value: '', labelKey: 'catTypeKeep' },
  { value: 'income', labelKey: 'catTypeIncome' },
  { value: 'expense', labelKey: 'catTypeExpense' },
  { value: 'transfer', labelKey: 'catTypeTransfer' },
];

// Use canonical categories from DomainConstants (single source of truth)
import { TRANSACTION_CATEGORIES } from '../../../lib/constants';
import EmptyState from '../../../components/EmptyState';
const CATEGORY_OPTIONS = ['', ...TRANSACTION_CATEGORIES];

const DEFAULT_RULE_FORM = {
  name: '',
  enabled: true,
  priority: 100,
  matchField: 'description',
  matchOperator: 'contains',
  matchValue: '',
  minAmount: '',
  maxAmount: '',
  typeOverride: '',
  categoryOverride: '',
};

function formatCategory(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
}

export default function CategorizePage() {
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  const formatTypeLabel2 = (value: string) => {
    switch (value) {
      case 'income': return t('catTypeIncome');
      case 'expense': return t('catTypeExpense');
      case 'transfer': return t('catTypeTransfer');
      case '': return t('catTypeKeep');
      default: return t('catTypeUnknown');
    }
  };
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [rules, setRules] = useState<TransactionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [savingRule, setSavingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [minConfidence, setMinConfidence] = useState(60);
  const [ruleForm, setRuleForm] = useState(DEFAULT_RULE_FORM);
  const { toast } = useToast();

  const loadAll = async () => {
    setLoading(true);
    // Round 30: Promise.allSettled so one failure doesn't hide the other.
    // Also surface the specific error message instead of a generic toast —
    // a user reported "failed to load transaction automation" with no hint
    // whether suggestions, rules, or both were the problem.
    const [reviewResult, ruleResult] = await Promise.allSettled([
      api.reviewCategories(),
      api.getTransactionRules(),
    ]);
    if (reviewResult.status === 'fulfilled') {
      setSuggestions(reviewResult.value?.transactions || []);
    } else {
      const msg = reviewResult.reason instanceof Error
        ? reviewResult.reason.message
        : t('catLoadSuggestionsFallback');
      toast(`${t('catLoadSuggestionsErrorPrefix')}${msg}`, 'error');
    }
    if (ruleResult.status === 'fulfilled') {
      setRules(ruleResult.value?.rules || []);
    } else {
      const msg = ruleResult.reason instanceof Error
        ? ruleResult.reason.message
        : t('catLoadRulesFallback');
      toast(`${t('catLoadRulesErrorPrefix')}${msg}`, 'error');
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = async () => {
    setApplying(true);
    try {
      const result = await api.applyCategories(minConfidence);
      // 2026-05-02 fix: the previous version swallowed `result.error`
      // entirely — an apiFetch that returned `{ error: "..." }` was
      // treated as success and silently no-op'd the user's click.
      // Now we surface the server error so the user knows why apply
      // failed (plan gate, optimistic-lock conflict, etc.).
      if (result?.error) {
        toast(String(result.error), 'error');
        return;
      }
      await loadAll();
      toast(result?.message || t('catApplied'), 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('catApplyError');
      toast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  const resetRuleForm = () => {
    setEditingRuleId(null);
    setRuleForm(DEFAULT_RULE_FORM);
  };

  const handleSaveRule = async () => {
    setSavingRule(true);
    try {
      const payload = {
        ...ruleForm,
        minAmount: ruleForm.minAmount ? Number(ruleForm.minAmount) : null,
        maxAmount: ruleForm.maxAmount ? Number(ruleForm.maxAmount) : null,
      };
      if (editingRuleId) {
        await api.updateTransactionRule(editingRuleId, payload);
        toast(t('catRuleUpdated'), 'success');
      } else {
        await api.createTransactionRule(payload);
        toast(t('catRuleSaved'), 'success');
      }
      resetRuleForm();
      await loadAll();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('catRuleSaveError'), 'error');
    } finally {
      setSavingRule(false);
    }
  };

  const handleEditRule = (rule: TransactionRule) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      name: rule.name,
      enabled: rule.enabled,
      priority: rule.priority,
      matchField: rule.matchField,
      matchOperator: rule.matchOperator,
      matchValue: rule.matchValue || '',
      minAmount: rule.minAmount?.toString() || '',
      maxAmount: rule.maxAmount?.toString() || '',
      typeOverride: rule.typeOverride || '',
      categoryOverride: rule.categoryOverride || '',
    });
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm(t('catDeleteConfirm'))) return;
    try {
      await api.deleteTransactionRule(id);
      toast(t('catRuleDeleted'), 'success');
      if (editingRuleId === id) resetRuleForm();
      await loadAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('catRuleDeleteError');
      toast(msg, 'error');
    }
  };

  const handleConfirmOne = async (suggestion: CategorySuggestion) => {
    setConfirming(suggestion.transactionId);
    try {
      await api.updateTransaction(suggestion.transactionId, {
        category: suggestion.suggestedCategory,
        type: suggestion.suggestedType,
      });
      await loadAll();
      toast(t('catTransactionUpdated'), 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('catTransactionUpdateError');
      toast(msg, 'error');
    } finally {
      setConfirming(null);
    }
  };

  const prefillRuleFromSuggestion = (suggestion: CategorySuggestion) => {
    const seedText = suggestion.description.split('—')[0].trim();
    setEditingRuleId(null);
    setRuleForm({
      name: `${formatTypeLabel2(suggestion.suggestedType)} ${formatCategory(suggestion.suggestedCategory)}${t('catRuleNameSuffix')}`,
      enabled: true,
      priority: 100,
      matchField: 'description',
      matchOperator: 'contains',
      matchValue: seedText,
      minAmount: '',
      maxAmount: '',
      typeOverride: suggestion.suggestedType,
      categoryOverride: suggestion.suggestedCategory,
    });
    toast(t('catPrefillToast'), 'success');
  };

  const actionableSuggestions = useMemo(
    () => suggestions.filter(s => s.wouldChange && s.confidence >= minConfidence),
    [minConfidence, suggestions],
  );

  // Pagination for the Review Suggestions list. Was silently sliced to
  // first 75 with no UI indicator that more existed; users with bigger
  // ledgers couldn't reach suggestions 76+. Page size of 25 keeps each
  // page short enough to scan without scrolling endlessly.
  const PAGE_SIZE = 25;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(suggestions.length / PAGE_SIZE));
  // Reset to first page whenever the underlying suggestions change
  // (e.g., after Apply, Refresh, or Confirm trims the list).
  useEffect(() => { setPage(0); }, [suggestions.length]);
  const pagedSuggestions = useMemo(
    () => suggestions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [page, suggestions],
  );
  const visibleStart = suggestions.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const visibleEnd = Math.min((page + 1) * PAGE_SIZE, suggestions.length);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('categorizeTitle')}
        subtitle={t('categorizeSubtitle')}
        className="mb-0"
        actions={
          <button
            onClick={loadAll}
            className="border border-primary text-primary px-4 py-2 rounded-xl hover:bg-green-50 font-medium text-sm"
          >
            {t('catRefresh')}
          </button>
        }
      />

      <div className="bg-gradient-to-r from-indigo-700 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start gap-6 flex-wrap">
          <div>
            <p className="text-indigo-100 mb-1">{t('catScannedLabel')}</p>
            <p className="text-4xl font-bold">{suggestions.length}</p>
            <p className="text-indigo-100 text-sm mt-2">
              {tFmt('catReadyMsgFmt', [actionableSuggestions.length, minConfidence])}
            </p>
          </div>
          <div className="min-w-[260px] bg-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-indigo-100 text-xs">{t('catMinConfidence')}</span>
              <span className="font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minConfidence}
              onChange={e => setMinConfidence(Number(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-indigo-200 text-xs mt-1">
              <span>{t('catBroader')}</span>
              <span>{t('catStricter')}</span>
            </div>
            <button
              onClick={handleApply}
              disabled={applying || actionableSuggestions.length === 0}
              className="mt-4 w-full bg-white text-indigo-700 px-4 py-3 rounded-xl font-semibold hover:bg-indigo-50 disabled:opacity-50"
            >
              {applying ? t('catApplyingBtn') : tFmt('catApplyBtnFmt', [actionableSuggestions.length])}
            </button>
            {/* Round 32: backfill action — re-apply the Round 30 keyword
                overrides (tax refund / interest / cashback / P2P / refund)
                to existing transactions. Only touches rows still on the
                loose "income" / "uncategorized" / "transfer" buckets, so
                user-curated categories are left alone. Rate-limited
                server-side to 5/hour. */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const result = await api.recategorizeMyTransactions();
                  await loadAll();
                  toast(result?.message || t('catRecategorized'), 'success');
                } catch (err) {
                  toast(err instanceof Error ? err.message : t('catRecategorizeError'), 'error');
                }
              }}
              className="mt-2 w-full bg-indigo-700/30 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700/40 border border-white/20"
              title={t('catRecategorizeTitle')}
            >
              {t('catRecategorizeBtn')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-primary">{t('catRuleBuilderHeading')}</h2>
              <p className="text-sm text-gray-500">{t('catRuleBuilderSubtitle')}</p>
            </div>
            {editingRuleId && (
              <button onClick={resetRuleForm} className="text-sm text-gray-500 hover:text-gray-700">
                {t('catClearForm')}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t('catFieldRuleName')}>
              <input value={ruleForm.name} onChange={e => setRuleForm({ ...ruleForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('catRuleNamePlaceholder')} />
            </Field>
            <Field label={t('catFieldPriority')}>
              <input type="number" min={1} max={9999} value={ruleForm.priority} onChange={e => setRuleForm({ ...ruleForm, priority: Number(e.target.value) || 100 })} className="w-full border rounded-lg px-3 py-2 text-gray-900" />
            </Field>
            <Field label={t('catFieldMatchField')}>
              <select value={ruleForm.matchField} onChange={e => setRuleForm({ ...ruleForm, matchField: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {MATCH_FIELDS.map(option => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
              </select>
            </Field>
            <Field label={t('catFieldOperator')}>
              <select value={ruleForm.matchOperator} onChange={e => setRuleForm({ ...ruleForm, matchOperator: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {OPERATORS.map(option => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
              </select>
            </Field>
            <Field label={t('catFieldMatchText')}>
              <input value={ruleForm.matchValue} onChange={e => setRuleForm({ ...ruleForm, matchValue: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('catMatchTextPlaceholder')} />
            </Field>
            <Field label={t('catFieldEnabled')}>
              <label className="flex items-center gap-3 border rounded-lg px-3 py-2 text-sm text-gray-700">
                <input type="checkbox" checked={ruleForm.enabled} onChange={e => setRuleForm({ ...ruleForm, enabled: e.target.checked })} />
                {t('catEnabledLabel')}
              </label>
            </Field>
            <Field label={t('catFieldMinAmount')}>
              <input type="number" step="0.01" min="0" value={ruleForm.minAmount} onChange={e => setRuleForm({ ...ruleForm, minAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('catOptional')} />
            </Field>
            <Field label={t('catFieldMaxAmount')}>
              <input type="number" step="0.01" min="0" value={ruleForm.maxAmount} onChange={e => setRuleForm({ ...ruleForm, maxAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('catOptional')} />
            </Field>
            <Field label={t('catFieldSetType')}>
              <select value={ruleForm.typeOverride} onChange={e => setRuleForm({ ...ruleForm, typeOverride: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
              </select>
            </Field>
            <Field label={t('catFieldSetCategory')}>
              <select value={ruleForm.categoryOverride} onChange={e => setRuleForm({ ...ruleForm, categoryOverride: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {CATEGORY_OPTIONS.map(option => <option key={option || 'blank'} value={option}>{option ? formatCategory(option) : t('catKeepCategory')}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSaveRule}
              disabled={savingRule}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {savingRule ? t('catSavingBtn') : editingRuleId ? t('catUpdateRule') : t('catSaveRule')}
            </button>
            {editingRuleId && (
              <button onClick={resetRuleForm} className="border border-gray-300 px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                {t('catCancel')}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-primary mb-1">{t('catSavedRulesHeading')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('catSavedRulesSubtitle')}</p>
          {rules.length === 0 ? (
            <EmptyState
              variant="bare"
              icon="🎯"
              title={t('catEmptyTitle')}
              description={t('catEmptyDesc')}
              preview={
                <div className="space-y-2">
                  {[
                    { name: t('catSampleRule1Name'), match: t('catSampleRule1Match') },
                    { name: t('catSampleRule2Name'), match: t('catSampleRule2Match') },
                    { name: t('catSampleRule3Name'), match: t('catSampleRule3Match') },
                  ].map((r) => (
                    <div key={r.name} className="bg-white rounded-xl p-3 border border-gray-100 text-sm text-left">
                      <p className="font-medium text-gray-700">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.match}</p>
                    </div>
                  ))}
                </div>
              }
            />
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{rule.name}</p>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {rule.enabled ? t('catActive') : t('catPaused')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {(() => { const f = MATCH_FIELDS.find(o => o.value === rule.matchField); return f ? t(f.labelKey) : rule.matchField; })()} {(() => { const o = OPERATORS.find(opt => opt.value === rule.matchOperator); return o ? t(o.labelKey).toLowerCase() : rule.matchOperator; })()} &quot;{rule.matchValue || t('catAnyValue')}&quot;
                      </p>
                      {(rule.typeOverride || rule.categoryOverride) && (
                        <p className="text-xs text-primary mt-1">
                          {tFmt('catAppliesFmt', [
                            rule.typeOverride ? formatTypeLabel2(rule.typeOverride) : t('catKeepType'),
                            rule.categoryOverride ? formatCategory(rule.categoryOverride) : t('catKeepCategoryShort'),
                          ])}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditRule(rule)} className="text-sm text-primary hover:underline">{t('catEditAction')}</button>
                      <button onClick={() => handleDeleteRule(rule.id)} className="text-sm text-red-600 hover:underline">{t('catDeleteAction')}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">{t('catReviewHeading')}</h2>
            <p className="text-sm text-gray-500">{t('catReviewSubtitle')}</p>
          </div>
          <span className="text-sm text-gray-500">
            {suggestions.length === 0
              ? t('catScannedFmt')
              : tFmt('catShowingFmt', [visibleStart, visibleEnd, suggestions.length])}
          </span>
        </div>

        {suggestions.length > 0 ? pagedSuggestions.map(s => (
          <div key={s.transactionId} className={`bg-white rounded-xl p-4 ${s.wouldChange ? 'border-l-4 border-indigo-400' : 'border border-gray-100'}`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold text-gray-900">{s.icon} {s.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{formatTypeLabel2(s.currentType)}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{formatCategory(s.currentCategory || 'other')}</span>
                  {s.wouldChange && (
                    <>
                      <span>→</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">{formatTypeLabel2(s.suggestedType)}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{formatCategory(s.suggestedCategory)}</span>
                    </>
                  )}
                  {s.matchedRuleName && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">{t('catRulePrefix')}{s.matchedRuleName}</span>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="font-medium text-gray-700">{fmt(Math.abs(s.amount))}</p>
                <span className={`text-xs ${s.confidence >= 80 ? 'text-green-600' : s.confidence >= 60 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {tFmt('catConfidenceFmt', [s.confidence])}
                </span>
                {s.wouldChange ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => prefillRuleFromSuggestion(s)}
                      className="text-xs border border-indigo-200 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50"
                    >
                      {t('catMakeRule')}
                    </button>
                    <button
                      onClick={() => handleConfirmOne(s)}
                      disabled={confirming === s.transactionId}
                      className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {confirming === s.transactionId ? t('catSavingShort') : t('catConfirm')}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-green-600">{t('catAligned')}</span>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🏷️</p>
            <p>{t('catNoTxEmpty')}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('catPrev')}
            </button>
            <span className="text-sm text-gray-600">{tFmt('catPageOfFmt', [page + 1, totalPages])}</span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('catNext')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  );
}
