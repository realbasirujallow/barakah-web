'use client';

/**
 * 2026-05-03 — /dashboard/forecasting
 *
 * Monarch-parity forecasting surface, layered with Islamic milestones
 * (Hajj, Umrah, Zakat-aware retirement) so the projection chart speaks
 * directly to the founder's investor pitch — Barakah is what Monarch
 * would be if it understood Muslim financial life-stages.
 *
 * 2026-06-17 — Multi-scenario wiring:
 *   1. SCENARIO MANAGEMENT — switcher dropdown listing all user scenarios,
 *      with create-new (name prompt), rename, delete, and set-active.
 *      Auto-save per scenario via PUT /api/forecasting/scenarios/{id}.
 *   2. REAL vs FUTURE DOLLARS — toggle sets inflationMode on the scenario
 *      and drives the projection off the server-side GET …/{id}/projection
 *      endpoint (realBalance for "today", nominalBalance for "future").
 *   3. GROWTH-RATE CONTROLS — forecast events (income/expense) let the
 *      user pick growthMode (inflation/custom/flat) and a custom rate.
 *
 * Falls back to client-side compound-growth math if the server projection
 * endpoint is unavailable (same resilience as the original page).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot,
} from 'recharts';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useI18n } from '../../../lib/i18n';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScenarioDTO {
  id: number;
  name: string;
  isActive: boolean;
  currentAge: number;
  retirementAge: number;
  hajjYearsFromNow: number;
  monthlyContribution: number;
  annualReturnPct: number;
  inflationMode: 'today' | 'future';
  inflationRate: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ForecastEventDTO {
  id: number;
  label: string;
  type: 'income' | 'expense';
  annualAmount: number;
  growthMode: 'inflation' | 'custom' | 'flat';
  customGrowthRate: number | null;
  startYearOffset: number;
  endYearOffset: number;
  sortOrder: number;
}

interface ProjectionPoint {
  year: number;
  age: number;
  /** Displayed balance — real or nominal depending on inflationMode. */
  value: number;
  milestone?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_HORIZON = 25;
const MAX_HORIZON = 50;

const DEFAULTS = {
  currentAge: 30,
  retirementAge: 65,
  hajjYearsFromNow: 8,
  monthlyContribution: 1500,
  annualReturnPct: 6,
  inflationMode: 'today' as const,
  inflationRate: 3,
};

// ─── Client-side fallback projection (same math as before) ────────────────────

function computeProjectionLocal(opts: {
  startingValue: number;
  monthlyContribution: number;
  annualReturnPct: number;
  currentAge: number;
  retirementAge: number;
  hajjYearsFromNow: number;
}): ProjectionPoint[] {
  const { startingValue, monthlyContribution, annualReturnPct, currentAge, retirementAge, hajjYearsFromNow } = opts;
  const r = annualReturnPct / 100;
  const C = monthlyContribution * 12;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const horizon = Math.max(MIN_HORIZON, Math.min(MAX_HORIZON, yearsToRetirement + 2));
  const points: ProjectionPoint[] = [];
  for (let t = 0; t <= horizon; t++) {
    let value: number;
    if (r === 0) {
      value = startingValue + C * t;
    } else {
      const growth = Math.pow(1 + r, t);
      value = startingValue * growth + C * ((growth - 1) / r);
    }
    const age = currentAge + t;
    let milestone: string | undefined;
    if (t === hajjYearsFromNow) milestone = 'Hajj';
    else if (age === retirementAge) milestone = 'Retirement';
    points.push({ year: t, age, value, milestone });
  }
  return points;
}

// ─── ScenarioSwitcher ─────────────────────────────────────────────────────────

interface ScenarioSwitcherProps {
  scenarios: ScenarioDTO[];
  activeId: number | undefined;
  loading: boolean;
  onSelect: (id: number) => void;
  onCreate: (name: string) => Promise<void>;
  onRename: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onSetActive: (id: number) => Promise<void>;
  createError: string | null;
  renameError: string | null;
  deleteError: string | null;
}

function ScenarioSwitcher({
  scenarios, activeId, loading, onSelect, onCreate, onRename, onDelete, onSetActive,
  createError, renameError, deleteError,
}: ScenarioSwitcherProps) {
  const { t, tFmt } = useI18n();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'list' | 'create' | 'rename' | 'confirmDelete'>('list');
  const [pendingName, setPendingName] = useState('');
  const [pendingId, setPendingId] = useState<number | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setMode('list');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const activeScenario = scenarios.find(s => s.id === activeId);

  const handleCreate = async () => {
    const name = pendingName.trim();
    if (!name) return;
    await onCreate(name);
    setPendingName('');
    setMode('list');
    setOpen(false);
  };

  const handleRename = async () => {
    const name = pendingName.trim();
    if (!name || !pendingId) return;
    await onRename(pendingId, name);
    setPendingName('');
    setPendingId(undefined);
    setMode('list');
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!pendingId) return;
    await onDelete(pendingId);
    setPendingId(undefined);
    setMode('list');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => { setOpen(o => !o); setMode('list'); }}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs text-gray-400 uppercase tracking-wide mr-1">{t('forecastingScenarioSwitcherLabel')}</span>
        <span className="max-w-[140px] truncate">{activeScenario?.name ?? '—'}</span>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-72">
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-400">{t('forecastingScenarioLoadingList')}</p>
          )}

          {!loading && mode === 'list' && (
            <>
              <ul className="py-1 max-h-56 overflow-y-auto">
                {scenarios.map(s => (
                  <li
                    key={s.id}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer group hover:bg-gray-50 ${s.id === activeId ? 'bg-emerald-50' : ''}`}
                  >
                    <button
                      className="flex-1 text-left text-sm text-gray-800 truncate"
                      onClick={() => { onSelect(s.id); setOpen(false); }}
                    >
                      {s.name}
                      {s.isActive && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 rounded-full px-1.5 py-0.5">
                          {t('forecastingScenarioActiveLabel')}
                        </span>
                      )}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      {!s.isActive && (
                        <button
                          title={t('forecastingScenarioSetActive')}
                          onClick={async (e) => { e.stopPropagation(); await onSetActive(s.id); setOpen(false); }}
                          className="text-xs text-emerald-600 hover:text-emerald-800 px-1"
                        >
                          ★
                        </button>
                      )}
                      <button
                        title={t('forecastingScenarioRename')}
                        onClick={(e) => { e.stopPropagation(); setPendingId(s.id); setPendingName(s.name); setMode('rename'); }}
                        className="text-xs text-gray-500 hover:text-gray-800 px-1"
                      >
                        ✎
                      </button>
                      {scenarios.length > 1 && (
                        <button
                          title={t('forecastingScenarioDelete')}
                          onClick={(e) => { e.stopPropagation(); setPendingId(s.id); setMode('confirmDelete'); }}
                          className="text-xs text-rose-400 hover:text-rose-600 px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100">
                <button
                  onClick={() => setMode('create')}
                  className="w-full px-4 py-2.5 text-sm text-emerald-700 font-medium hover:bg-emerald-50 text-left"
                >
                  {t('forecastingScenarioNewLabel')}
                </button>
              </div>
              {(createError || renameError || deleteError) && (
                <p className="px-4 py-2 text-xs text-rose-600">{createError || renameError || deleteError}</p>
              )}
            </>
          )}

          {!loading && mode === 'create' && (
            <div className="p-4">
              <p className="text-sm font-medium text-gray-800 mb-2">{t('forecastingScenarioCreateTitle')}</p>
              <input
                autoFocus
                type="text"
                value={pendingName}
                onChange={e => setPendingName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setMode('list'); }}
                placeholder={t('forecastingScenarioNamePlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
              />
              {createError && <p className="text-xs text-rose-600 mb-2">{createError}</p>}
              <div className="flex gap-2">
                <button onClick={handleCreate} className="flex-1 bg-emerald-700 text-white rounded-lg py-1.5 text-sm font-medium hover:bg-emerald-800">{t('forecastingScenarioSave')}</button>
                <button onClick={() => setMode('list')} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-1.5 text-sm hover:bg-gray-50">{t('forecastingScenarioCancel')}</button>
              </div>
            </div>
          )}

          {!loading && mode === 'rename' && (
            <div className="p-4">
              <p className="text-sm font-medium text-gray-800 mb-2">{t('forecastingScenarioRenameTitle')}</p>
              <input
                autoFocus
                type="text"
                value={pendingName}
                onChange={e => setPendingName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setMode('list'); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
              />
              {renameError && <p className="text-xs text-rose-600 mb-2">{renameError}</p>}
              <div className="flex gap-2">
                <button onClick={handleRename} className="flex-1 bg-emerald-700 text-white rounded-lg py-1.5 text-sm font-medium hover:bg-emerald-800">{t('forecastingScenarioSave')}</button>
                <button onClick={() => setMode('list')} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-1.5 text-sm hover:bg-gray-50">{t('forecastingScenarioCancel')}</button>
              </div>
            </div>
          )}

          {!loading && mode === 'confirmDelete' && pendingId != null && (
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-3">
                {tFmt('forecastingScenarioDeleteConfirmFmt', [scenarios.find(s => s.id === pendingId)?.name ?? ''])}
              </p>
              {deleteError && <p className="text-xs text-rose-600 mb-2">{deleteError}</p>}
              <div className="flex gap-2">
                <button onClick={handleDelete} className="flex-1 bg-rose-600 text-white rounded-lg py-1.5 text-sm font-medium hover:bg-rose-700">{t('forecastingScenarioDelete')}</button>
                <button onClick={() => setMode('list')} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-1.5 text-sm hover:bg-gray-50">{t('forecastingScenarioCancel')}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── InflationToggle ──────────────────────────────────────────────────────────

interface InflationToggleProps {
  inflationMode: 'today' | 'future';
  inflationRate: number;
  onModeChange: (mode: 'today' | 'future') => void;
  onRateChange: (rate: number) => void;
}

function InflationToggle({ inflationMode, inflationRate, onModeChange, onRateChange }: InflationToggleProps) {
  const { t } = useI18n();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">{t('forecastingInflationToggleLabel')}</p>
      <div className="flex flex-col gap-1 mb-3">
        {(['today', 'future'] as const).map(mode => (
          <label key={mode} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inflationMode"
              value={mode}
              checked={inflationMode === mode}
              onChange={() => onModeChange(mode)}
              className="accent-emerald-700"
            />
            <span className="text-sm text-gray-800">
              {mode === 'today' ? t('forecastingInflationToday') : t('forecastingInflationFuture')}
            </span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 shrink-0">{t('forecastingInflationRateLabel')}</label>
        <input
          type="number"
          value={inflationRate}
          onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onRateChange(Math.max(0, Math.min(20, v))); }}
          step={0.5}
          min={0}
          max={20}
          className="w-16 text-sm font-bold tabular-nums text-gray-900 border border-gray-200 rounded-lg px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <span className="text-xs text-gray-500">%</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{t('forecastingInflationRateSubtitle')}</p>
    </div>
  );
}

// ─── EventForm ────────────────────────────────────────────────────────────────

interface EventFormProps {
  type: 'income' | 'expense';
  initial?: Partial<ForecastEventDTO>;
  onSave: (data: {
    label: string;
    type: 'income' | 'expense';
    annualAmount: number;
    growthMode: 'inflation' | 'custom' | 'flat';
    customGrowthRate: number | null;
    startYearOffset: number;
    endYearOffset: number;
  }) => Promise<void>;
  onCancel: () => void;
  saveError: string | null;
}

function EventForm({ type, initial, onSave, onCancel, saveError }: EventFormProps) {
  const { t } = useI18n();
  const { symbol } = useCurrency();
  const [label, setLabel] = useState(initial?.label ?? '');
  const [annualAmount, setAnnualAmount] = useState(initial?.annualAmount ?? 0);
  const [growthMode, setGrowthMode] = useState<'inflation' | 'custom' | 'flat'>(initial?.growthMode ?? 'inflation');
  const [customGrowthRate, setCustomGrowthRate] = useState<number>(initial?.customGrowthRate ?? 2);
  const [startYearOffset, setStartYearOffset] = useState(initial?.startYearOffset ?? 0);
  const [endYearOffset, setEndYearOffset] = useState(initial?.endYearOffset ?? 10);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setBusy(true);
    try {
      await onSave({
        label: label.trim(),
        type,
        annualAmount,
        growthMode,
        customGrowthRate: growthMode === 'custom' ? customGrowthRate : null,
        startYearOffset,
        endYearOffset,
      });
    } finally {
      setBusy(false);
    }
  };

  const accentColor = type === 'income' ? 'emerald' : 'rose';

  return (
    <div className={`bg-white border border-${accentColor}-200 rounded-xl p-4 shadow-sm`}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="forecastingEventsLabelLabel" className="block text-xs text-gray-500 mb-1">{t('forecastingEventsLabelLabel')}</label>
          <input id="forecastingEventsLabelLabel"
            autoFocus
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder={t('forecastingEventsLabelPlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="forecastingEventsAnnualAmountLabel" className="block text-xs text-gray-500 mb-1">{t('forecastingEventsAnnualAmountLabel')}</label>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-sm">{symbol}</span>
            <input id="forecastingEventsAnnualAmountLabel"
              type="number"
              value={annualAmount}
              onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setAnnualAmount(Math.max(0, v)); }}
              min={0}
              step={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="forecastingEventsGrowthModeLabel" className="block text-xs text-gray-500 mb-1">{t('forecastingEventsGrowthModeLabel')}</label>
          <select id="forecastingEventsGrowthModeLabel"
            value={growthMode}
            onChange={e => setGrowthMode(e.target.value as 'inflation' | 'custom' | 'flat')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="inflation">{t('forecastingEventsGrowthInflation')}</option>
            <option value="custom">{t('forecastingEventsGrowthCustom')}</option>
            <option value="flat">{t('forecastingEventsGrowthFlat')}</option>
          </select>
        </div>
        {growthMode === 'custom' && (
          <div>
            <label htmlFor="forecastingEventsCustomRateLabel" className="block text-xs text-gray-500 mb-1">{t('forecastingEventsCustomRateLabel')}</label>
            <input id="forecastingEventsCustomRateLabel"
              type="number"
              value={customGrowthRate}
              onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setCustomGrowthRate(v); }}
              step={0.5}
              min={-20}
              max={50}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
        <div>
          <label htmlFor="forecastingEventsStartYearLabel" className="block text-xs text-gray-500 mb-1">{t('forecastingEventsStartYearLabel')}</label>
          <input id="forecastingEventsStartYearLabel"
            type="number"
            value={startYearOffset}
            onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setStartYearOffset(Math.max(0, v)); }}
            min={0}
            max={MAX_HORIZON}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="forecastingEventsEndYearLabel" className="block text-xs text-gray-500 mb-1">{t('forecastingEventsEndYearLabel')}</label>
          <input id="forecastingEventsEndYearLabel"
            type="number"
            value={endYearOffset}
            onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setEndYearOffset(Math.max(startYearOffset + 1, v)); }}
            min={startYearOffset + 1}
            max={MAX_HORIZON}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      {saveError && <p className="text-xs text-rose-600 mt-2">{saveError}</p>}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          disabled={busy || !label.trim()}
          className="flex-1 bg-emerald-700 text-white rounded-lg py-1.5 text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
        >
          {t('forecastingScenarioSave')}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-1.5 text-sm hover:bg-gray-50"
        >
          {t('forecastingScenarioCancel')}
        </button>
      </div>
    </div>
  );
}

// ─── ForecastEventsList ───────────────────────────────────────────────────────

interface ForecastEventsListProps {
  scenarioId: number | undefined;
  events: ForecastEventDTO[];
  onEventsChange: (events: ForecastEventDTO[]) => void;
}

function ForecastEventsList({ scenarioId, events, onEventsChange }: ForecastEventsListProps) {
  const { t, tFmt } = useI18n();
  const { fmt, symbol } = useCurrency();
  const [addingType, setAddingType] = useState<'income' | 'expense' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSave = async (data: Parameters<EventFormProps['onSave']>[0]) => {
    if (!scenarioId) return;
    setSaveError(null);
    try {
      if (editingId != null) {
        const res = await api.updateForecastEvent(scenarioId, editingId, data);
        const updated = (res && typeof res === 'object' && 'id' in (res as object) ? res : null) as ForecastEventDTO | null;
        if (updated) {
          onEventsChange(events.map(e => e.id === editingId ? updated : e));
        }
        setEditingId(null);
      } else {
        const res = await api.createForecastEvent(scenarioId, data);
        const created = (res && typeof res === 'object' && 'id' in (res as object) ? res : null) as ForecastEventDTO | null;
        if (created) {
          onEventsChange([...events, created]);
        }
        setAddingType(null);
      }
    } catch {
      setSaveError(t('forecastingEventsSaveError'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!scenarioId) return;
    setDeleteError(null);
    setDeletingId(id);
    try {
      await api.deleteForecastEvent(scenarioId, id);
      onEventsChange(events.filter(e => e.id !== id));
    } catch {
      setDeleteError(t('forecastingEventsDeleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const growthLabel = (e: ForecastEventDTO) => {
    if (e.growthMode === 'inflation') return t('forecastingEventsGrowthInflation');
    if (e.growthMode === 'flat') return t('forecastingEventsGrowthFlat');
    return `${e.customGrowthRate ?? 0}%/yr`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-primary">{t('forecastingEventsTitle')}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('forecastingEventsSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setAddingType('income'); setEditingId(null); }}
            className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-1.5 font-medium hover:bg-emerald-100"
          >
            {t('forecastingEventsAddIncome')}
          </button>
          <button
            onClick={() => { setAddingType('expense'); setEditingId(null); }}
            className="text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded-lg px-3 py-1.5 font-medium hover:bg-rose-100"
          >
            {t('forecastingEventsAddExpense')}
          </button>
        </div>
      </div>

      {events.length === 0 && !addingType && (
        <p className="text-sm text-gray-400 py-4 text-center">{t('forecastingEventsEmpty')}</p>
      )}

      {deleteError && <p className="text-xs text-rose-600 mb-2">{deleteError}</p>}

      <ul className="space-y-2 mb-3">
        {events.map(ev => (
          <li key={ev.id}>
            {editingId === ev.id ? (
              <EventForm
                type={ev.type}
                initial={ev}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
                saveError={saveError}
              />
            ) : (
              <div className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${ev.type === 'income' ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
                <div>
                  <p className="text-sm font-medium text-gray-800">{ev.label}</p>
                  <p className="text-xs text-gray-500">
                    {symbol}{fmt(ev.annualAmount)}/yr · {growthLabel(ev)} · yr {ev.startYearOffset}–{ev.endYearOffset}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingId(ev.id); setAddingType(null); setSaveError(null); }}
                    className="text-xs text-gray-400 hover:text-gray-700"
                  >
                    {t('forecastingEventsEdit')}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(tFmt('forecastingEventsDeleteConfirmFmt', [ev.label]))) {
                        handleDelete(ev.id);
                      }
                    }}
                    disabled={deletingId === ev.id}
                    className="text-xs text-rose-400 hover:text-rose-600 disabled:opacity-50"
                  >
                    {t('forecastingEventsDelete')}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {addingType && (
        <EventForm
          type={addingType}
          onSave={handleSave}
          onCancel={() => { setAddingType(null); setSaveError(null); }}
          saveError={saveError}
        />
      )}
    </div>
  );
}

// ─── Main page content ────────────────────────────────────────────────────────

function ForecastingPageContent() {
  const { fmt, symbol } = useCurrency();
  const { t, tFmt } = useI18n();

  // ── Scenario list ─────────────────────────────────────────────────────────
  const [scenarios, setScenarios] = useState<ScenarioDTO[]>([]);
  const [scenariosLoading, setScenariosLoading] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── Active scenario knobs ──────────────────────────────────────────────────
  const [scenarioId, setScenarioId] = useState<number | undefined>(undefined);
  const scenarioIdRef = useRef<number | undefined>(undefined);
  useEffect(() => { scenarioIdRef.current = scenarioId; }, [scenarioId]);

  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [hajjYearsFromNow, setHajjYearsFromNow] = useState(DEFAULTS.hajjYearsFromNow);
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULTS.monthlyContribution);
  const [annualReturnPct, setAnnualReturnPct] = useState(DEFAULTS.annualReturnPct);
  const [inflationMode, setInflationMode] = useState<'today' | 'future'>(DEFAULTS.inflationMode);
  const [inflationRate, setInflationRate] = useState(DEFAULTS.inflationRate);

  const [scenarioLoaded, setScenarioLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // ── Starting net worth ─────────────────────────────────────────────────────
  const [startingValue, setStartingValue] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  // ── Server projection ──────────────────────────────────────────────────────
  const [serverProjection, setServerProjection] = useState<ProjectionPoint[] | null>(null);
  const projectionAbortRef = useRef<AbortController | null>(null);

  // ── Forecast events ────────────────────────────────────────────────────────
  const [events, setEvents] = useState<ForecastEventDTO[]>([]);

  // Apply a loaded ScenarioDTO into local state
  const applyScenario = useCallback((s: ScenarioDTO) => {
    setScenarioId(s.id);
    setCurrentAge(s.currentAge);
    setRetirementAge(s.retirementAge);
    setHajjYearsFromNow(s.hajjYearsFromNow);
    setMonthlyContribution(s.monthlyContribution);
    setAnnualReturnPct(s.annualReturnPct);
    setInflationMode(s.inflationMode ?? 'today');
    setInflationRate(s.inflationRate ?? DEFAULTS.inflationRate);
  }, []);

  // ── Initial load — net worth + scenario list + active scenario ────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [nwResult, scenariosResult] = await Promise.allSettled([
          api.getNetWorthHistory('6m'),
          api.getForecastScenarios(),
        ]);
        if (cancelled) return;

        if (nwResult.status === 'fulfilled') {
          const nw = (nwResult.value as { currentNetWorth?: number })?.currentNetWorth;
          setStartingValue(typeof nw === 'number' ? nw : 0);
        } else {
          setStartingValue(100_000);
          setLoadError(true);
        }

        if (scenariosResult.status === 'fulfilled') {
          const raw = scenariosResult.value;
          const list: ScenarioDTO[] = Array.isArray(raw) ? (raw as ScenarioDTO[]) : [];
          setScenarios(list);
          // Find active scenario or fall back to first
          const active = list.find(s => s.isActive) ?? list[0];
          if (active) {
            applyScenario(active);
            // Also load its events
            try {
              const evts = await api.getForecastEvents(active.id);
              if (!cancelled) setEvents(Array.isArray(evts) ? (evts as ForecastEventDTO[]) : []);
            } catch { /* events are non-critical */ }
          }
        }

        if (!cancelled) setScenarioLoaded(true);
        setScenariosLoading(false);
      } catch {
        if (!cancelled) {
          setStartingValue(100_000);
          setLoadError(true);
          setScenarioLoaded(true);
          setScenariosLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user selects a different scenario from the switcher
  const handleSelectScenario = useCallback(async (id: number) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;
    applyScenario(scenario);
    setServerProjection(null);
    try {
      const evts = await api.getForecastEvents(id);
      setEvents(Array.isArray(evts) ? (evts as ForecastEventDTO[]) : []);
    } catch { setEvents([]); }
  }, [scenarios, applyScenario]);

  // ── Scenario management handlers ─────────────────────────────────────────
  const handleCreateScenario = async (name: string) => {
    setCreateError(null);
    try {
      const res = await api.createForecastScenario({
        name,
        currentAge,
        retirementAge,
        hajjYearsFromNow,
        monthlyContribution,
        annualReturnPct,
        inflationMode,
        inflationRate,
        makeActive: false,
      });
      const created = (res && typeof res === 'object' && 'id' in (res as object) ? res : null) as ScenarioDTO | null;
      if (created) {
        setScenarios(prev => [...prev, created]);
        applyScenario(created);
      }
      setEvents([]);
    } catch {
      setCreateError(t('forecastingScenarioCreateError'));
    }
  };

  const handleRenameScenario = async (id: number, name: string) => {
    setRenameError(null);
    try {
      const res = await api.updateForecastScenario(id, { name });
      const updated = (res && typeof res === 'object' && 'id' in (res as object) ? res : null) as ScenarioDTO | null;
      setScenarios(prev => prev.map(s => s.id === id ? { ...s, name: updated?.name ?? name } : s));
    } catch {
      setRenameError(t('forecastingScenarioRenameError'));
    }
  };

  const handleDeleteScenario = async (id: number) => {
    setDeleteError(null);
    try {
      await api.deleteForecastScenario(id);
      const remaining = scenarios.filter(s => s.id !== id);
      setScenarios(remaining);
      // If we deleted the selected scenario, switch to first remaining
      if (scenarioIdRef.current === id && remaining.length > 0) {
        const next = remaining.find(s => s.isActive) ?? remaining[0];
        applyScenario(next);
        setEvents([]);
        try {
          const evts = await api.getForecastEvents(next.id);
          setEvents(Array.isArray(evts) ? (evts as ForecastEventDTO[]) : []);
        } catch { /* non-critical */ }
      }
    } catch {
      setDeleteError(t('forecastingScenarioDeleteError'));
    }
  };

  const handleSetActive = async (id: number) => {
    try {
      await api.activateForecastScenario(id);
      setScenarios(prev => prev.map(s => ({ ...s, isActive: s.id === id })));
    } catch { /* silent — active is cosmetic */ }
  };

  // ── Debounced auto-save per scenario (PUT /{id}) ──────────────────────────
  useEffect(() => {
    if (!scenarioLoaded) return;
    const sid = scenarioIdRef.current;
    if (!sid) return;
    setSaveStatus('saving');
    const timeoutId = window.setTimeout(async () => {
      try {
        await api.updateForecastScenario(sid, {
          currentAge,
          retirementAge,
          hajjYearsFromNow,
          monthlyContribution,
          annualReturnPct,
          inflationMode,
          inflationRate,
        });
        setSaveStatus('saved');
        window.setTimeout(() => setSaveStatus('idle'), 1500);
      } catch {
        setSaveStatus('error');
      }
    }, 800);
    return () => window.clearTimeout(timeoutId);
  // scenarioId included so changing scenario re-arms correctly
  }, [scenarioLoaded, scenarioId, currentAge, retirementAge, hajjYearsFromNow, monthlyContribution, annualReturnPct, inflationMode, inflationRate]);

  // ── Server-side projection fetch ──────────────────────────────────────────
  useEffect(() => {
    const sid = scenarioId;
    const nw = startingValue;
    if (!sid || nw == null) return;

    // Cancel any in-flight fetch
    projectionAbortRef.current?.abort();
    const controller = new AbortController();
    projectionAbortRef.current = controller;

    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const years = Math.max(MIN_HORIZON, Math.min(MAX_HORIZON, yearsToRetirement + 2));

    (async () => {
      try {
        const result = await api.getForecastProjection(sid, nw, years) as {
          scenarioId: number;
          inflationMode: 'today' | 'future';
          inflationRate: number;
          points: { year: number; age: number; nominalBalance: number; realBalance: number }[];
        } | null;
        if (controller.signal.aborted) return;
        if (!result) return; // null = 403 (not on Plus) or empty; fall back to client-side
        const useReal = inflationMode === 'today';
        const points = Array.isArray(result.points) ? result.points : [];
        const mapped: ProjectionPoint[] = points.map(p => {
          const value = useReal ? p.realBalance : p.nominalBalance;
          let milestone: string | undefined;
          if (p.year === hajjYearsFromNow) milestone = 'Hajj';
          else if (p.age === retirementAge) milestone = 'Retirement';
          return { year: p.year, age: p.age, value, milestone };
        });
        setServerProjection(mapped);
      } catch {
        if (!controller.signal.aborted) {
          // Fall back to client-side — serverProjection stays null
          setServerProjection(null);
        }
      }
    })();

    return () => controller.abort();
    // monthlyContribution IS included: the server projection is computed from
    // the persisted scenario row (which the sibling persist effect above keys
    // on monthlyContribution too), so omitting it here left the chart stale
    // when only the contribution slider changed.
  }, [scenarioId, startingValue, currentAge, retirementAge, hajjYearsFromNow, monthlyContribution, annualReturnPct, inflationMode, inflationRate]);

  // ── Client-side projection (fallback) ─────────────────────────────────────
  const clientProjection = useMemo(() => {
    if (startingValue == null) return [];
    return computeProjectionLocal({
      startingValue,
      monthlyContribution,
      annualReturnPct,
      currentAge,
      retirementAge,
      hajjYearsFromNow,
    });
  }, [startingValue, monthlyContribution, annualReturnPct, currentAge, retirementAge, hajjYearsFromNow]);

  const projection = serverProjection ?? clientProjection;

  const finalValue = projection.length ? projection[projection.length - 1].value : 0;
  const retirementPoint = projection.find(p => p.age === retirementAge);
  const hajjPoint = projection.find(p => p.year === hajjYearsFromNow);

  const fmtShort = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return symbol + (n / 1_000_000).toFixed(1) + 'M';
    if (Math.abs(n) >= 1000) return symbol + (n / 1000).toFixed(0) + 'k';
    return fmt(n);
  };

  const chartLabel = inflationMode === 'today'
    ? t('forecastingChartLabelReal')
    : t('forecastingChartLabelNominal');

  return (
    <div role="main" className="max-w-6xl mx-auto">
      <PageHeader
        title={t('forecastingTitle')}
        subtitle={t('forecastingSubtitle')}
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Scenario switcher */}
            <ScenarioSwitcher
              scenarios={scenarios}
              activeId={scenarioId}
              loading={scenariosLoading}
              onSelect={handleSelectScenario}
              onCreate={handleCreateScenario}
              onRename={handleRenameScenario}
              onDelete={handleDeleteScenario}
              onSetActive={handleSetActive}
              createError={createError}
              renameError={renameError}
              deleteError={deleteError}
            />
            {/* Save status chip */}
            <span
              className={
                'text-xs px-2.5 py-1 rounded-full font-medium tabular-nums transition-colors ' +
                (saveStatus === 'saving' ? 'bg-amber-50 text-amber-700' :
                 saveStatus === 'saved' ? 'bg-emerald-50 text-emerald-700' :
                 saveStatus === 'error' ? 'bg-rose-50 text-rose-700' :
                 'bg-gray-50 text-gray-500')
              }
              aria-live="polite"
            >
              {saveStatus === 'saving' ? t('forecastingSaving') :
               saveStatus === 'saved' ? t('forecastingSaved') :
               saveStatus === 'error' ? t('forecastingSaveFailed') :
               t('forecastingSynced')}
            </span>
          </div>
        }
      />

      {/* Hero summary */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-emerald-700 to-emerald-600 text-white rounded-2xl p-6 mb-6 shadow-md">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-emerald-100 text-xs uppercase tracking-wide">{t('forecastingToday')}</p>
            <p className="text-3xl font-bold tabular-nums mt-1">
              {startingValue == null ? '...' : fmt(startingValue)}
            </p>
            <p className="text-emerald-200 text-xs mt-1">{t('forecastingStartingNetWorth')}</p>
          </div>
          {hajjPoint && (
            <div>
              <p className="text-emerald-100 text-xs uppercase tracking-wide">{tFmt('forecastingHajjEyebrowFmt', [hajjYearsFromNow, hajjYearsFromNow === 1 ? '' : 's'])} <span className="text-emerald-300">{t('forecastingHajjEyebrowTag')}</span></p>
              <p className="text-3xl font-bold tabular-nums mt-1">{fmt(hajjPoint.value)}</p>
              <p className="text-emerald-200 text-xs mt-1">{tFmt('forecastingProjectedAtAgeFmt', [hajjPoint.age])}</p>
            </div>
          )}
          {retirementPoint && (
            <div>
              <p className="text-emerald-100 text-xs uppercase tracking-wide">{t('forecastingAtRetirement')} <span className="text-emerald-300">· {retirementAge}</span></p>
              <p className="text-3xl font-bold tabular-nums mt-1">{fmt(retirementPoint.value)}</p>
              <p className="text-emerald-200 text-xs mt-1">{tFmt('forecastingInYearsFmt', [retirementAge - currentAge])}</p>
            </div>
          )}
        </div>
        {loadError && (
          <p className="text-emerald-100 text-xs mt-4 italic">
            {tFmt('forecastingLoadErrorFmt', [fmt(100000)])}
          </p>
        )}
      </div>

      {/* Projection chart */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">{t('forecastingChartTitle')}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {tFmt('forecastingChartSubtitleFmt', [annualReturnPct])}
              {' · '}
              <span className={inflationMode === 'today' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>{chartLabel}</span>
            </p>
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-700">
            {fmtShort(finalValue)} <span className="text-xs font-normal text-gray-500">{tFmt('forecastingInYearsShortFmt', [projection.length ? projection[projection.length - 1].year : 0])}</span>
          </p>
        </div>

        {projection.length === 0 ? (
          <div className="py-20 text-center text-gray-400">{t('forecastingLoadingProjection')}</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={projection} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B5E20" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1B5E20" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#374151', fontSize: 11 }}
                tickFormatter={y => y === 0 ? t('forecastingAxisNow') : tFmt('forecastingAxisYearFmt', [y])}
              />
              <YAxis
                tickFormatter={fmtShort}
                tick={{ fill: '#374151', fontSize: 11 }}
              />
              <Tooltip
                formatter={(v: number | undefined) => [fmt(v ?? 0), chartLabel]}
                labelFormatter={y => y === 0 ? t('forecastingTooltipToday') : tFmt('forecastingTooltipYearsFmt', [y, y === 1 ? '' : 's'])}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1B5E20"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive
                animationDuration={500}
              />
              {hajjPoint && (
                <ReferenceDot
                  x={hajjPoint.year}
                  y={hajjPoint.value}
                  r={7}
                  fill="#FF6B35"
                  stroke="#fff"
                  strokeWidth={2}
                  label={{ value: t('forecastingMilestoneHajj'), position: 'top', fill: '#FF6B35', fontSize: 12, fontWeight: 600 }}
                />
              )}
              {retirementPoint && (
                <ReferenceDot
                  x={retirementPoint.year}
                  y={retirementPoint.value}
                  r={7}
                  fill="#1B5E20"
                  stroke="#fff"
                  strokeWidth={2}
                  label={{ value: tFmt('forecastingMilestoneRetirementFmt', [retirementAge]), position: 'top', fill: '#1B5E20', fontSize: 12, fontWeight: 600 }}
                />
              )}
              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Scenario inputs + inflation toggle */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ScenarioCard
          label={t('forecastingCurrentAgeLabel')}
          subtitle={t('forecastingCurrentAgeSubtitle')}
          value={currentAge}
          onChange={setCurrentAge}
          min={18}
          max={80}
          step={1}
          suffix={t('forecastingYearsSuffix')}
          sliderAriaLabel={tFmt('forecastingSliderAriaFmt', [t('forecastingCurrentAgeLabel')])}
        />
        <ScenarioCard
          label={t('forecastingRetirementAgeLabel')}
          subtitle={t('forecastingRetirementAgeSubtitle')}
          value={retirementAge}
          onChange={setRetirementAge}
          min={Math.max(currentAge + 1, 35)}
          max={85}
          step={1}
          suffix={t('forecastingYearsSuffix')}
          accent="primary"
          sliderAriaLabel={tFmt('forecastingSliderAriaFmt', [t('forecastingRetirementAgeLabel')])}
        />
        <ScenarioCard
          label={t('forecastingHajjTimingLabel')}
          subtitle={t('forecastingHajjTimingSubtitle')}
          value={hajjYearsFromNow}
          onChange={setHajjYearsFromNow}
          min={1}
          max={MAX_HORIZON}
          step={1}
          suffix={t('forecastingYearsSuffix')}
          accent="orange"
          icon="🕋"
          sliderAriaLabel={tFmt('forecastingSliderAriaFmt', [t('forecastingHajjTimingLabel')])}
        />
        <ScenarioCard
          label={t('forecastingMonthlyContributionLabel')}
          subtitle={t('forecastingMonthlyContributionSubtitle')}
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          min={0}
          max={20_000}
          step={100}
          prefix={symbol}
          sliderAriaLabel={tFmt('forecastingSliderAriaFmt', [t('forecastingMonthlyContributionLabel')])}
        />
        <ScenarioCard
          label={t('forecastingAnnualReturnLabel')}
          subtitle={t('forecastingAnnualReturnSubtitle')}
          value={annualReturnPct}
          onChange={setAnnualReturnPct}
          min={0}
          max={15}
          step={0.5}
          suffix="%"
          sliderAriaLabel={tFmt('forecastingSliderAriaFmt', [t('forecastingAnnualReturnLabel')])}
        />
        {/* Inflation toggle replaces the old static tip card */}
        <InflationToggle
          inflationMode={inflationMode}
          inflationRate={inflationRate}
          onModeChange={setInflationMode}
          onRateChange={setInflationRate}
        />
      </div>

      {/* Forecast events panel */}
      {scenarioId != null && (
        <ForecastEventsList
          scenarioId={scenarioId}
          events={events}
          onEventsChange={setEvents}
        />
      )}

      {/* Tip */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900 leading-relaxed mb-6">
        <p className="font-semibold mb-1">{t('forecastingTipTitle')}</p>
        <p>{t('forecastingTipBody')}</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-900 leading-relaxed mb-8">
        <p className="font-semibold mb-1">{t('forecastingDisclaimerTitle')}</p>
        <p>{t('forecastingDisclaimerBody')}</p>
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  label: string;
  subtitle: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  accent?: 'primary' | 'orange';
  icon?: string;
  sliderAriaLabel: string;
}

function ScenarioCard({
  label, subtitle, value, onChange, min, max, step, prefix, suffix, accent, icon, sliderAriaLabel,
}: ScenarioCardProps) {
  const accentClass =
    accent === 'orange' ? 'bg-[#FF6B35]' :
    accent === 'primary' ? 'bg-[#1B5E20]' :
    'bg-emerald-600';

  const handleInput = (raw: string) => {
    const n = parseFloat(raw);
    if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {icon && <span className="mr-1">{icon}</span>}{label}
        </p>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        {prefix && <span className="text-gray-500 text-lg">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => handleInput(e.target.value)}
          min={min}
          max={max}
          step={step}
          className="text-2xl font-bold tabular-nums text-gray-900 w-full bg-transparent outline-none focus:bg-emerald-50 rounded px-1 -mx-1"
          aria-label={label}
        />
        {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
      </div>
      <input
        type="range"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={`w-full ${accentClass} accent-current rounded-lg appearance-none h-1.5 cursor-pointer`}
        aria-label={sliderAriaLabel}
      />
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}

export default function ForecastingPage() {
  return (
    <ErrorBoundary>
      <ForecastingPageContent />
    </ErrorBoundary>
  );
}
