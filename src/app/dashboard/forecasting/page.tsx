'use client';

/**
 * 2026-05-03 — /dashboard/forecasting
 *
 * Monarch-parity forecasting surface, layered with Islamic milestones
 * (Hajj, Umrah, Zakat-aware retirement) so the projection chart speaks
 * directly to the founder's investor pitch — Barakah is what Monarch
 * would be if it understood Muslim financial life-stages.
 *
 * This is a CLIENT-SIDE-ONLY stub. No new backend endpoint, no
 * persistence — the whole projection runs as React state with simple
 * compound-growth math. Easy to evolve into a server-persisted scenario
 * later. Pulls current net-worth from the existing /api/networth/summary
 * endpoint as the starting principal.
 *
 * Math:
 *   FV(t) = P · (1+r)^t + C · (((1+r)^t − 1) / r)
 * where:
 *   P = current net worth
 *   r = annual return (decimal, default 6%)
 *   C = annual contribution (= monthly contribution × 12)
 *   t = years from now
 *
 * Returns a simple line series over 25 years with milestone markers for
 * Hajj timing, retirement age, and 1st-Umrah year. The projection isn't
 * meant to be a financial-planning oracle — it's a "feel the trajectory"
 * surface that gives a Muslim user a tangible sense of their long-horizon
 * options. The disclaimer footer says exactly that.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot,
} from 'recharts';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useI18n } from '../../../lib/i18n';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

interface ProjectionPoint {
  year: number;
  age: number;
  /** Net worth at this year, given current assumptions. */
  value: number;
  /** Optional milestone label (Hajj, Retirement, etc.) for ReferenceDot. */
  milestone?: string;
}

// Horizon stretches to accommodate the user's retirement-age slider
// (always show retirement on the chart) but never below 25 years and
// never above 50 — the curve gets visually noisy past ~50 years and
// the underlying compound-growth assumption breaks down past that
// horizon anyway (life events the user can't model now).
const MIN_HORIZON = 25;
const MAX_HORIZON = 50;

// Default scenario knobs — investor-friendly, conservative numbers. The
// user can tweak each in the UI; everything below is a starting point
// keyed off "this is what a typical 30-year-old Muslim professional
// should plug in to get a feel for the curve."
const DEFAULTS = {
  currentAge: 30,
  retirementAge: 65,
  hajjYearsFromNow: 8,
  monthlyContribution: 1500,
  annualReturnPct: 6,
};

function computeProjection(opts: {
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
  // Stretch the horizon so retirement is always visible on the chart,
  // but cap at MAX_HORIZON to avoid 60-year curves that break the
  // compound-growth assumption.
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const horizon = Math.max(MIN_HORIZON, Math.min(MAX_HORIZON, yearsToRetirement + 2));
  const points: ProjectionPoint[] = [];
  for (let t = 0; t <= horizon; t++) {
    let value: number;
    if (r === 0) {
      // Linear case avoids the divide-by-zero in the standard FV formula
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

function ForecastingPageContent() {
  const { fmt, symbol } = useCurrency();
  const { t, tFmt } = useI18n();

  // Scenario knobs. 2026-05-03: now persisted via
  // /api/forecasting/scenarios/active. The defaults below are used as
  // the initial state until the saved scenario (if any) lands; once
  // loaded, the user's saved values overwrite. Each tweak gets
  // debounce-saved back to the server so the next visit (and any
  // future device sync) start from where they left off.
  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [hajjYearsFromNow, setHajjYearsFromNow] = useState(DEFAULTS.hajjYearsFromNow);
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULTS.monthlyContribution);
  const [annualReturnPct, setAnnualReturnPct] = useState(DEFAULTS.annualReturnPct);
  const [scenarioId, setScenarioId] = useState<number | undefined>(undefined);
  // Keep a ref that's always up-to-date so the debounced save callback
  // below can read the latest scenarioId without a stale closure.
  // Without this, sliders after the first save always read scenarioId as
  // undefined (the initial render's closure) and POST a new row instead
  // of PUT-ing the existing one.
  const scenarioIdRef = useRef<number | undefined>(undefined);
  useEffect(() => { scenarioIdRef.current = scenarioId; }, [scenarioId]);
  const [scenarioLoaded, setScenarioLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Starting principal pulled from /api/networth/summary so the curve
  // begins at the user's actual current net worth.
  const [startingValue, setStartingValue] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Initial load — net worth + saved scenario in parallel.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [nwResult, scenarioResult] = await Promise.allSettled([
          api.getNetWorthHistory('6m'),
          api.getActiveForecastScenario(),
        ]);
        if (cancelled) return;

        if (nwResult.status === 'fulfilled') {
          const nw = (nwResult.value as { currentNetWorth?: number })?.currentNetWorth;
          setStartingValue(typeof nw === 'number' ? nw : 0);
        } else {
          // Demo-friendly fallback so the page still tells a story even
          // if the API hiccups during the investor demo.
          setStartingValue(100_000);
          setLoadError(true);
        }

        if (scenarioResult.status === 'fulfilled') {
          const s = (scenarioResult.value as { scenario?: {
            id: number; currentAge: number; retirementAge: number;
            hajjYearsFromNow: number; monthlyContribution: number;
            annualReturnPct: number;
          } | null })?.scenario;
          if (s) {
            // Apply saved values atomically so the projection only
            // recomputes once.
            setScenarioId(s.id);
            setCurrentAge(s.currentAge);
            setRetirementAge(s.retirementAge);
            setHajjYearsFromNow(s.hajjYearsFromNow);
            setMonthlyContribution(s.monthlyContribution);
            setAnnualReturnPct(s.annualReturnPct);
          }
        }
        setScenarioLoaded(true);
      } catch {
        if (!cancelled) {
          setStartingValue(100_000);
          setLoadError(true);
          setScenarioLoaded(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Debounced save — fires 800ms after the user stops adjusting. We
  // wait for `scenarioLoaded` to flip true so the initial-load values
  // don't immediately overwrite the user's saved scenario with the
  // defaults during the brief render window before the GET resolves.
  //
  // scenarioId is included in deps so that after the first POST returns
  // and sets scenarioId, any subsequent slider change re-arms the timer
  // and PUTs with the real id. scenarioIdRef.current is read inside the
  // async callback so it gets the value at fire-time, not at schedule-time
  // (avoids a stale-closure race on rapid adjustments).
  useEffect(() => {
    if (!scenarioLoaded) return;
    setSaveStatus('saving');
    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await api.saveForecastScenario({
          id: scenarioIdRef.current,
          currentAge,
          retirementAge,
          hajjYearsFromNow,
          monthlyContribution,
          annualReturnPct,
        });
        const saved = (result as { scenario?: { id: number } })?.scenario;
        if (saved?.id && !scenarioIdRef.current) setScenarioId(saved.id);
        setSaveStatus('saved');
        // Reset the chip back to idle so it doesn't permanently say "Saved".
        window.setTimeout(() => setSaveStatus('idle'), 1500);
      } catch {
        setSaveStatus('error');
      }
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [scenarioLoaded, scenarioId, currentAge, retirementAge, hajjYearsFromNow, monthlyContribution, annualReturnPct]);

  const projection = useMemo(() => {
    if (startingValue == null) return [];
    return computeProjection({
      startingValue,
      monthlyContribution,
      annualReturnPct,
      currentAge,
      retirementAge,
      hajjYearsFromNow,
    });
  }, [startingValue, monthlyContribution, annualReturnPct, currentAge, retirementAge, hajjYearsFromNow]);

  const finalValue = projection.length ? projection[projection.length - 1].value : 0;
  const retirementPoint = projection.find(p => p.age === retirementAge);
  const hajjPoint = projection.find(p => p.year === hajjYearsFromNow);

  const fmtShort = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return symbol + (n / 1_000_000).toFixed(1) + 'M';
    if (Math.abs(n) >= 1000) return symbol + (n / 1000).toFixed(0) + 'k';
    return fmt(n);
  };

  return (
    <div role="main" className="max-w-6xl mx-auto">
      <PageHeader
        title={t('forecastingTitle')}
        subtitle={t('forecastingSubtitle')}
        actions={
          // Tiny save-status chip — same idea as Linear's "saving…/saved"
          // affordance. Tells the user the scenario syncs without making
          // them save manually.
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
        }
      />

      {/* Hero summary — the answer in numbers, before the chart. */}
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
                formatter={(v: number | undefined) => fmt(v ?? 0)}
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
              {/* Hajj milestone marker */}
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
              {/* Retirement milestone marker */}
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

      {/* Scenario inputs */}
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
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900 leading-relaxed">
          <p className="font-semibold mb-1">{t('forecastingTipTitle')}</p>
          <p>
            {t('forecastingTipBody')}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-900 leading-relaxed mb-8">
        <p className="font-semibold mb-1">{t('forecastingDisclaimerTitle')}</p>
        <p>
          {t('forecastingDisclaimerBody')}
        </p>
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
  /** Localized aria-label for the range slider (the input falls back to `label`). */
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
