'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { PageHeader } from '../../../components/dashboard/PageHeader';

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
  { value: 'any_text', label: 'Any text' },
  { value: 'description', label: 'Description' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'category', label: 'Imported category' },
  { value: 'account', label: 'Account name' },
  { value: 'institution', label: 'Institution' },
  { value: 'import_source', label: 'Import source' },
];

const OPERATORS = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Exactly matches' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'regex', label: 'Regex' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'Keep current type' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
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

function formatType(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : 'Unknown';
}

function formatCategory(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
}

export default function CategorizePage() {
  const { fmt } = useCurrency();
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
        : 'Failed to load suggestions';
      toast(`Suggestions: ${msg}`, 'error');
    }
    if (ruleResult.status === 'fulfilled') {
      setRules(ruleResult.value?.rules || []);
    } else {
      const msg = ruleResult.reason instanceof Error
        ? ruleResult.reason.message
        : 'Failed to load rules';
      toast(`Rules: ${msg}`, 'error');
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
      toast(result?.message || 'Changes applied', 'success');
    } catch (err) {
      // 2026-05-02 fix: surface the actual error message (e.g. "Plus
      // plan required", "Server unavailable, please try again later")
      // instead of the generic "Failed to apply transaction rules"
      // that masked every backend signal.
      const msg = err instanceof Error ? err.message : 'Failed to apply transaction rules';
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
        toast('Rule updated', 'success');
      } else {
        await api.createTransactionRule(payload);
        toast('Rule saved', 'success');
      }
      resetRuleForm();
      await loadAll();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save rule', 'error');
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
    if (!confirm('Delete this transaction rule?')) return;
    try {
      await api.deleteTransactionRule(id);
      toast('Rule deleted', 'success');
      if (editingRuleId === id) resetRuleForm();
      await loadAll();
    } catch {
      toast('Failed to delete rule', 'error');
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
      toast('Transaction updated', 'success');
    } catch {
      toast('Failed to update transaction', 'error');
    } finally {
      setConfirming(null);
    }
  };

  const prefillRuleFromSuggestion = (suggestion: CategorySuggestion) => {
    const seedText = suggestion.description.split('—')[0].trim();
    setEditingRuleId(null);
    setRuleForm({
      name: `${formatType(suggestion.suggestedType)} ${formatCategory(suggestion.suggestedCategory)} rule`,
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
    toast('Rule form prefilled from transaction', 'success');
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
        title="Transaction Rules"
        subtitle="Review imported activity, save matching rules, and keep transfers, income, and expenses clean automatically."
        className="mb-0"
        actions={
          <button
            onClick={loadAll}
            className="border border-primary text-primary px-4 py-2 rounded-xl hover:bg-green-50 font-medium text-sm"
          >
            Refresh
          </button>
        }
      />

      <div className="bg-gradient-to-r from-indigo-700 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start gap-6 flex-wrap">
          <div>
            <p className="text-indigo-100 mb-1">Transactions Scanned</p>
            <p className="text-4xl font-bold">{suggestions.length}</p>
            <p className="text-indigo-100 text-sm mt-2">
              {actionableSuggestions.length} suggestions are ready to apply at {minConfidence}% confidence or higher.
            </p>
          </div>
          <div className="min-w-[260px] bg-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-indigo-100 text-xs">Minimum confidence</span>
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
              <span>Broader</span>
              <span>Stricter</span>
            </div>
            <button
              onClick={handleApply}
              disabled={applying || actionableSuggestions.length === 0}
              className="mt-4 w-full bg-white text-indigo-700 px-4 py-3 rounded-xl font-semibold hover:bg-indigo-50 disabled:opacity-50"
            >
              {applying ? 'Applying…' : `Apply ${actionableSuggestions.length} Suggestions`}
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
                  toast(result?.message || 'Re-categorization complete', 'success');
                } catch (err) {
                  toast(err instanceof Error ? err.message : 'Failed to re-categorize', 'error');
                }
              }}
              className="mt-2 w-full bg-indigo-700/30 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700/40 border border-white/20"
              title="Apply latest categorization rules to ALL existing transactions (tax refund, interest, cashback, P2P detection)"
            >
              🔄 Re-categorize my existing transactions
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-primary">Rule Builder</h2>
              <p className="text-sm text-gray-500">Set one rule and Barakah will keep applying it to future matches.</p>
            </div>
            {editingRuleId && (
              <button onClick={resetRuleForm} className="text-sm text-gray-500 hover:text-gray-700">
                Clear form
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Rule name">
              <input value={ruleForm.name} onChange={e => setRuleForm({ ...ruleForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Incoming Zelle transfers" />
            </Field>
            <Field label="Priority">
              <input type="number" min={1} max={9999} value={ruleForm.priority} onChange={e => setRuleForm({ ...ruleForm, priority: Number(e.target.value) || 100 })} className="w-full border rounded-lg px-3 py-2 text-gray-900" />
            </Field>
            <Field label="Match field">
              <select value={ruleForm.matchField} onChange={e => setRuleForm({ ...ruleForm, matchField: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {MATCH_FIELDS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </Field>
            <Field label="Operator">
              <select value={ruleForm.matchOperator} onChange={e => setRuleForm({ ...ruleForm, matchOperator: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {OPERATORS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </Field>
            <Field label="Match text">
              <input value={ruleForm.matchValue} onChange={e => setRuleForm({ ...ruleForm, matchValue: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. zelle payment from" />
            </Field>
            <Field label="Enabled">
              <label className="flex items-center gap-3 border rounded-lg px-3 py-2 text-sm text-gray-700">
                <input type="checkbox" checked={ruleForm.enabled} onChange={e => setRuleForm({ ...ruleForm, enabled: e.target.checked })} />
                Apply this rule automatically
              </label>
            </Field>
            <Field label="Minimum amount">
              <input type="number" step="0.01" min="0" value={ruleForm.minAmount} onChange={e => setRuleForm({ ...ruleForm, minAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Optional" />
            </Field>
            <Field label="Maximum amount">
              <input type="number" step="0.01" min="0" value={ruleForm.maxAmount} onChange={e => setRuleForm({ ...ruleForm, maxAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Optional" />
            </Field>
            <Field label="Set type to">
              <select value={ruleForm.typeOverride} onChange={e => setRuleForm({ ...ruleForm, typeOverride: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </Field>
            <Field label="Set category to">
              <select value={ruleForm.categoryOverride} onChange={e => setRuleForm({ ...ruleForm, categoryOverride: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {CATEGORY_OPTIONS.map(option => <option key={option || 'blank'} value={option}>{option ? formatCategory(option) : 'Keep current category'}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSaveRule}
              disabled={savingRule}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {savingRule ? 'Saving…' : editingRuleId ? 'Update Rule' : 'Save Rule'}
            </button>
            {editingRuleId && (
              <button onClick={resetRuleForm} className="border border-gray-300 px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-primary mb-1">Saved Rules</h2>
          <p className="text-sm text-gray-500 mb-4">Rules run from the smallest priority number to the largest.</p>
          {rules.length === 0 ? (
            <EmptyState
              variant="bare"
              icon="🎯"
              title="No auto-categorize rules yet"
              description="Rules run on every new transaction. Use them for payroll, transfers, sadaqah patterns, or any recurring merchant."
              preview={
                <div className="space-y-2">
                  {[
                    { name: 'Payroll → Income', match: 'description contains "payroll"' },
                    { name: 'Sadaqah → masjid', match: 'merchant equals "Local masjid"' },
                    { name: 'Transfers → Internal', match: 'description starts with "Transfer to"' },
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
                          {rule.enabled ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {MATCH_FIELDS.find(option => option.value === rule.matchField)?.label || rule.matchField} {OPERATORS.find(option => option.value === rule.matchOperator)?.label?.toLowerCase() || rule.matchOperator} &quot;{rule.matchValue || 'any value'}&quot;
                      </p>
                      {(rule.typeOverride || rule.categoryOverride) && (
                        <p className="text-xs text-primary mt-1">
                          Applies: {rule.typeOverride ? formatType(rule.typeOverride) : 'keep type'}
                          {' • '}
                          {rule.categoryOverride ? formatCategory(rule.categoryOverride) : 'keep category'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditRule(rule)} className="text-sm text-primary hover:underline">Edit</button>
                      <button onClick={() => handleDeleteRule(rule.id)} className="text-sm text-red-600 hover:underline">Delete</button>
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
            <h2 className="text-lg font-semibold text-primary">Review Suggestions</h2>
            <p className="text-sm text-gray-500">Transfers, income, expenses, and saved-rule matches all show up here before you apply them.</p>
          </div>
          <span className="text-sm text-gray-500">
            {suggestions.length === 0
              ? '0 scanned'
              : `Showing ${visibleStart}–${visibleEnd} of ${suggestions.length}`}
          </span>
        </div>

        {suggestions.length > 0 ? pagedSuggestions.map(s => (
          <div key={s.transactionId} className={`bg-white rounded-xl p-4 ${s.wouldChange ? 'border-l-4 border-indigo-400' : 'border border-gray-100'}`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold text-gray-900">{s.icon} {s.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{formatType(s.currentType)}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{formatCategory(s.currentCategory || 'other')}</span>
                  {s.wouldChange && (
                    <>
                      <span>→</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">{formatType(s.suggestedType)}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{formatCategory(s.suggestedCategory)}</span>
                    </>
                  )}
                  {s.matchedRuleName && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">Rule: {s.matchedRuleName}</span>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="font-medium text-gray-700">{fmt(Math.abs(s.amount))}</p>
                <span className={`text-xs ${s.confidence >= 80 ? 'text-green-600' : s.confidence >= 60 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {s.confidence}% confident
                </span>
                {s.wouldChange ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => prefillRuleFromSuggestion(s)}
                      className="text-xs border border-indigo-200 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50"
                    >
                      Make Rule
                    </button>
                    <button
                      onClick={() => handleConfirmOne(s)}
                      disabled={confirming === s.transactionId}
                      className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {confirming === s.transactionId ? 'Saving…' : 'Confirm'}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-green-600">✓ Already aligned</span>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🏷️</p>
            <p>No transactions to categorize yet.</p>
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
              ← Prev
            </button>
            <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
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
