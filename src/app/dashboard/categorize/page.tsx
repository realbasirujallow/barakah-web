'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';

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
    try {
      const [reviewData, ruleData] = await Promise.all([
        api.reviewCategories(),
        api.getTransactionRules(),
      ]);
      setSuggestions(reviewData?.transactions || []);
      setRules(ruleData?.rules || []);
    } catch {
      toast('Failed to load transaction automation', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = async () => {
    setApplying(true);
    try {
      const result = await api.applyCategories(minConfidence);
      await loadAll();
      toast(result?.message || 'Changes applied', 'success');
    } catch {
      toast('Failed to apply transaction rules', 'error');
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

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1B5E20]">Transaction Rules</h1>
          <p className="text-sm text-gray-500 mt-1">Review imported activity, save matching rules, and keep transfers, income, and expenses clean automatically.</p>
        </div>
        <button
          onClick={loadAll}
          className="border border-[#1B5E20] text-[#1B5E20] px-4 py-2 rounded-xl hover:bg-green-50 font-medium text-sm"
        >
          Refresh
        </button>
      </div>

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
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1B5E20]">Rule Builder</h2>
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
              className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2E7D32] disabled:opacity-50"
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
          <h2 className="text-lg font-semibold text-[#1B5E20] mb-1">Saved Rules</h2>
          <p className="text-sm text-gray-500 mb-4">Rules run from the smallest priority number to the largest.</p>
          {rules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              No rules yet. Create your first one for transfers, payroll, reimbursements, or any other recurring pattern.
            </div>
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
                        <p className="text-xs text-[#1B5E20] mt-1">
                          Applies: {rule.typeOverride ? formatType(rule.typeOverride) : 'keep type'}
                          {' • '}
                          {rule.categoryOverride ? formatCategory(rule.categoryOverride) : 'keep category'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditRule(rule)} className="text-sm text-[#1B5E20] hover:underline">Edit</button>
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
            <h2 className="text-lg font-semibold text-[#1B5E20]">Review Suggestions</h2>
            <p className="text-sm text-gray-500">Transfers, income, expenses, and saved-rule matches all show up here before you apply them.</p>
          </div>
          <span className="text-sm text-gray-500">{suggestions.length} scanned</span>
        </div>

        {suggestions.length > 0 ? suggestions.slice(0, 75).map(s => (
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
