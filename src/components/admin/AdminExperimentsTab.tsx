'use client';

/**
 * Admin Experiments tab — internal replacement for PostHog's feature-flag
 * dashboard. Reads from /admin/feature-flags + /{name}/results endpoints
 * that the FeatureFlagService exposes, and lets the team:
 *
 *   1. List every flag (active / draft / ended).
 *   2. Create a new flag with variants + weights + optional segment.
 *   3. Transition draft→active→ended with one click.
 *   4. Drill into per-variant cohort size + conversion on a chosen
 *      lifecycle outcome event (e.g. `first_upgrade_completed`).
 *
 * The funnel data here is the same LifecycleEvent data powering the
 * existing /admin/funnel + /admin/growth dashboards — so every metric
 * you already care about is segmentable by variant for free.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast';
import type {
  AdminFeatureFlag,
  FeatureFlagResults,
  FeatureFlagVariantRow,
} from './adminTypes';

// Most-useful outcome events to analyze conversion against. Each one maps
// to a constant in backend/com/barakah/service/LifecycleEventType.java.
const OUTCOME_EVENTS: { key: string; label: string }[] = [
  { key: 'first_upgrade_completed', label: 'Upgraded to paid' },
  { key: 'trial_granted',           label: 'Started trial' },
  { key: 'paywall_shown',           label: 'Hit paywall' },
  { key: 'first_zakat_calculated',  label: 'Calculated zakat' },
  { key: 'first_transaction_added', label: 'Added a transaction' },
  { key: 'bank_account_linked',     label: 'Linked bank' },
  { key: 'family_member_joined',    label: 'Family member joined' },
  { key: 'cancel_started',          label: 'Started cancel flow' },
  { key: 'save_offer_accepted',     label: 'Accepted save offer' },
];

interface VariantForm {
  key: string;
  weight: number;
}

export function AdminExperimentsTab() {
  const { toast } = useToast();

  const [flags, setFlags] = useState<AdminFeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<AdminFeatureFlag | null>(null);
  const [outcomeEvent, setOutcomeEvent] = useState<string>('first_upgrade_completed');
  const [results, setResults] = useState<FeatureFlagResults | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  const loadFlags = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.listAdminFeatureFlags()) as { flags: AdminFeatureFlag[] };
      setFlags(res.flags ?? []);
    } catch (err) {
      toast('Failed to load experiments', 'error');
      console.warn('listAdminFeatureFlags error', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  const loadResults = useCallback(
    async (flag: AdminFeatureFlag, eventKey: string) => {
      setResultsLoading(true);
      try {
        const res = (await api.getAdminFeatureFlagResults(flag.name, eventKey)) as FeatureFlagResults;
        setResults(res);
      } catch (err) {
        toast('Failed to load variant results', 'error');
        console.warn('getAdminFeatureFlagResults error', err);
      } finally {
        setResultsLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (selected) loadResults(selected, outcomeEvent);
  }, [selected, outcomeEvent, loadResults]);

  const handleStatusChange = async (
    flag: AdminFeatureFlag,
    status: 'draft' | 'active' | 'ended',
  ) => {
    try {
      await api.updateAdminFeatureFlagStatus(flag.name, status);
      toast(`Flag ${flag.name} → ${status}`, 'success');
      await loadFlags();
    } catch (err) {
      toast('Failed to change status', 'error');
      console.warn('updateAdminFeatureFlagStatus error', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1B5E20]">🧪 Experiments</h2>
          <p className="text-sm text-gray-600 mt-1">
            A/B tests + feature flags. Replaces PostHog. Every variant segments
            the funnel automatically via the <code>feature_flag_assigned</code>{' '}
            lifecycle event.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#154A17] text-sm font-semibold"
        >
          + New experiment
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : flags.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <div className="grid gap-3">
          {flags.map(flag => (
            <FlagRow
              key={flag.name}
              flag={flag}
              selected={selected?.name === flag.name}
              onSelect={() => setSelected(flag)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {selected && (
        <ResultsPanel
          flag={selected}
          results={results}
          loading={resultsLoading}
          outcomeEvent={outcomeEvent}
          onOutcomeEventChange={setOutcomeEvent}
          onClose={() => {
            setSelected(null);
            setResults(null);
          }}
        />
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false);
            await loadFlags();
          }}
        />
      )}
    </div>
  );
}

// ── UI bits ────────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
      <div className="text-4xl mb-3">🧪</div>
      <p className="text-gray-700 mb-1 font-semibold">No experiments yet</p>
      <p className="text-gray-500 text-sm mb-5">
        Kick off your first A/B test. Good first one: pricing_test_q2
        (control $9.99 vs treatment $12.99).
      </p>
      <button
        onClick={onCreate}
        className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Create experiment
      </button>
    </div>
  );
}

function FlagRow({
  flag,
  selected,
  onSelect,
  onStatusChange,
}: {
  flag: AdminFeatureFlag;
  selected: boolean;
  onSelect: () => void;
  onStatusChange: (f: AdminFeatureFlag, s: 'draft' | 'active' | 'ended') => void;
}) {
  const variants = useMemo<VariantForm[]>(() => {
    try {
      return JSON.parse(flag.variants) as VariantForm[];
    } catch {
      return [];
    }
  }, [flag.variants]);

  const statusColour =
    flag.status === 'active'
      ? 'bg-green-100 text-green-800'
      : flag.status === 'draft'
      ? 'bg-gray-100 text-gray-700'
      : 'bg-amber-100 text-amber-800';

  return (
    <div
      onClick={onSelect}
      className={`bg-white border rounded-xl p-4 cursor-pointer transition ${
        selected ? 'border-[#1B5E20] shadow-md' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-semibold text-gray-900">{flag.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${statusColour}`}>{flag.status}</span>
          </div>
          {flag.description && (
            <p className="text-sm text-gray-600 mb-2">{flag.description}</p>
          )}
          <div className="flex gap-3 flex-wrap text-xs text-gray-500">
            {variants.map(v => (
              <span key={v.key} className="bg-gray-50 border px-2 py-0.5 rounded">
                {v.key}: {v.weight}%
              </span>
            ))}
            <span>default: {flag.defaultVariant}</span>
          </div>
        </div>
        <div className="flex gap-2 ml-4" onClick={e => e.stopPropagation()}>
          {flag.status === 'draft' && (
            <button
              onClick={() => onStatusChange(flag, 'active')}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Activate
            </button>
          )}
          {flag.status === 'active' && (
            <button
              onClick={() => onStatusChange(flag, 'ended')}
              className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700"
            >
              End
            </button>
          )}
          {flag.status === 'ended' && (
            <span className="text-xs text-gray-500">Ended — assignments retained</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsPanel({
  flag,
  results,
  loading,
  outcomeEvent,
  onOutcomeEventChange,
  onClose,
}: {
  flag: AdminFeatureFlag;
  results: FeatureFlagResults | null;
  loading: boolean;
  outcomeEvent: string;
  onOutcomeEventChange: (e: string) => void;
  onClose: () => void;
}) {
  const topRate = results
    ? results.variants.reduce((a, b) => Math.max(a, b.conversionRate), 0)
    : 0;

  return (
    <div className="bg-white border border-[#1B5E20] rounded-xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1B5E20]">Results · {flag.name}</h3>
          <p className="text-xs text-gray-500">
            Outcome measured: <code>{outcomeEvent}</code> triggered on/after the
            assignment timestamp.
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm">
          ✕ Close
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <label className="text-sm text-gray-600">Measure conversion on:</label>
        <select
          value={outcomeEvent}
          onChange={e => onOutcomeEventChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {OUTCOME_EVENTS.map(e => (
            <option key={e.key} value={e.key}>
              {e.label} ({e.key})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading variant results…</div>
      ) : !results || results.variants.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No assignments yet. Once the flag is active + users are bucketed, results
          appear here.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 text-xs uppercase">
            <tr>
              <th className="py-2">Variant</th>
              <th className="py-2">Cohort</th>
              <th className="py-2">Converted</th>
              <th className="py-2">Rate</th>
              <th className="py-2">Lift vs top</th>
            </tr>
          </thead>
          <tbody>
            {results.variants.map((row: FeatureFlagVariantRow) => {
              const lift = topRate > 0 ? (row.conversionRate - topRate) / topRate : 0;
              return (
                <tr key={row.variant} className="border-t">
                  <td className="py-2 font-mono text-[#1B5E20] font-semibold">{row.variant}</td>
                  <td className="py-2">{row.cohort}</td>
                  <td className="py-2">{row.converted}</td>
                  <td className="py-2">{(row.conversionRate * 100).toFixed(2)}%</td>
                  <td className="py-2 text-gray-500">
                    {row.conversionRate === topRate ? '—' : `${(lift * 100).toFixed(1)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Cohort counts users assigned to the variant. Converted counts distinct
        users in that cohort who subsequently triggered the outcome event.
        Raw numbers — no p-value or CI math applied — so interpret small
        cohorts with care.
      </p>
    </div>
  );
}

function CreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<VariantForm[]>([
    { key: 'control',   weight: 50 },
    { key: 'treatment', weight: 50 },
  ]);
  const [defaultVariant, setDefaultVariant] = useState('control');
  const [segmentCountry, setSegmentCountry] = useState('');
  const [segmentPlan, setSegmentPlan] = useState('');
  const [newUsersOnly, setNewUsersOnly] = useState(false);
  const [saving, setSaving] = useState(false);

  const weightSum = variants.reduce((a, b) => a + (Number(b.weight) || 0), 0);
  const valid =
    /^[a-z0-9_]{3,64}$/.test(name) &&
    weightSum === 100 &&
    variants.every(v => /^[a-z0-9_]{1,32}$/.test(v.key)) &&
    variants.some(v => v.key === defaultVariant);

  const addVariant = () =>
    setVariants([...variants, { key: `variant_${variants.length + 1}`, weight: 0 }]);

  const removeVariant = (idx: number) =>
    setVariants(variants.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!valid) {
      toast('Check inputs: name format, weights sum to 100, default in list', 'error');
      return;
    }
    setSaving(true);
    try {
      const segment: Record<string, unknown> = {};
      if (segmentCountry) segment.country = segmentCountry.toUpperCase();
      if (segmentPlan) segment.plan = segmentPlan;
      if (newUsersOnly) segment.onlyNewSignupsAfterMs = Date.now();

      await api.createAdminFeatureFlag({
        name,
        description: description || undefined,
        variants,
        segment: Object.keys(segment).length > 0 ? segment : null,
        defaultVariant,
      });
      toast('Experiment created as draft. Activate when ready.', 'success');
      onCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create experiment';
      toast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-[#1B5E20] mb-4">New experiment</h3>

        <div className="space-y-3">
          <Field label="Name (snake_case, 3-64 chars)" hint="e.g. pricing_test_q2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="pricing_test_q2"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
            />
          </Field>

          <Field label="Description" hint="For your own future self.">
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Testing $9.99 vs $12.99 monthly Plus price for new US signups"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </Field>

          <div>
            <label className="text-sm font-semibold text-gray-800">Variants</label>
            <p className="text-xs text-gray-500 mb-2">
              Weights must sum to 100. Current sum: <b>{weightSum}</b>
            </p>
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={v.key}
                  onChange={e => {
                    const next = [...variants];
                    next[i] = { ...next[i], key: e.target.value };
                    setVariants(next);
                  }}
                  placeholder="variant key"
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm font-mono"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={v.weight}
                  onChange={e => {
                    const next = [...variants];
                    next[i] = { ...next[i], weight: Number(e.target.value) };
                    setVariants(next);
                  }}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <button
                  onClick={() => removeVariant(i)}
                  disabled={variants.length <= 1}
                  className="text-red-500 text-xs px-2 disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addVariant}
              className="text-xs text-[#1B5E20] hover:underline mt-1"
            >
              + Add variant
            </button>
          </div>

          <Field label="Default variant" hint="Returned when user is outside the segment or flag is ended.">
            <select
              value={defaultVariant}
              onChange={e => setDefaultVariant(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {variants.map(v => (
                <option key={v.key} value={v.key}>
                  {v.key}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <label className="text-sm font-semibold text-gray-800">
              Segment (optional — all blank = all users)
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Field label="Country (ISO-2)">
                <input
                  value={segmentCountry}
                  onChange={e => setSegmentCountry(e.target.value)}
                  placeholder="US"
                  maxLength={2}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm uppercase"
                />
              </Field>
              <Field label="Plan">
                <select
                  value={segmentPlan}
                  onChange={e => setSegmentPlan(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">any</option>
                  <option value="free">free</option>
                  <option value="trial">trial</option>
                  <option value="plus">plus</option>
                  <option value="family">family</option>
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={newUsersOnly}
                onChange={e => setNewUsersOnly(e.target.checked)}
              />
              Only users who sign up after I create this flag
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valid || saving}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create as draft'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-800 block mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
