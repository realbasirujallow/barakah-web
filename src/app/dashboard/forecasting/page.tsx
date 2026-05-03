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

import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot,
} from 'recharts';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
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

  // Scenario knobs — local React state, no persistence.
  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [hajjYearsFromNow, setHajjYearsFromNow] = useState(DEFAULTS.hajjYearsFromNow);
  const [monthlyContribution, setMonthlyContribution] = useState(DEFAULTS.monthlyContribution);
  const [annualReturnPct, setAnnualReturnPct] = useState(DEFAULTS.annualReturnPct);

  // Starting principal pulled from /api/networth/summary so the curve
  // begins at the user's actual current net worth.
  const [startingValue, setStartingValue] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // /api/net-worth/history?period=6m returns currentNetWorth as
        // part of the headline payload (same call /dashboard/net-worth
        // uses for the hero card). No bespoke endpoint needed.
        const d = await api.getNetWorthHistory('6m');
        if (cancelled) return;
        const nw = (d as { currentNetWorth?: number })?.currentNetWorth;
        setStartingValue(typeof nw === 'number' ? nw : 0);
      } catch {
        // Demo-friendly fallback so the page still tells a story even if
        // the API hiccups during the investor demo.
        if (!cancelled) {
          setStartingValue(100_000);
          setLoadError(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
        title="Forecasting"
        subtitle="Project your wealth across decades, keyed to the Islamic milestones that matter to you."
      />

      {/* Hero summary — the answer in numbers, before the chart. */}
      <div className="bg-gradient-to-br from-[#1B5E20] via-emerald-700 to-emerald-600 text-white rounded-2xl p-6 mb-6 shadow-md">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-emerald-100 text-xs uppercase tracking-wide">Today</p>
            <p className="text-3xl font-bold tabular-nums mt-1">
              {startingValue == null ? '...' : fmt(startingValue)}
            </p>
            <p className="text-emerald-200 text-xs mt-1">Starting net worth</p>
          </div>
          {hajjPoint && (
            <div>
              <p className="text-emerald-100 text-xs uppercase tracking-wide">In {hajjYearsFromNow} year{hajjYearsFromNow === 1 ? '' : 's'} <span className="text-emerald-300">· Hajj 🕋</span></p>
              <p className="text-3xl font-bold tabular-nums mt-1">{fmt(hajjPoint.value)}</p>
              <p className="text-emerald-200 text-xs mt-1">Projected at {hajjPoint.age} years old</p>
            </div>
          )}
          {retirementPoint && (
            <div>
              <p className="text-emerald-100 text-xs uppercase tracking-wide">At retirement <span className="text-emerald-300">· {retirementAge}</span></p>
              <p className="text-3xl font-bold tabular-nums mt-1">{fmt(retirementPoint.value)}</p>
              <p className="text-emerald-200 text-xs mt-1">In {retirementAge - currentAge} years</p>
            </div>
          )}
        </div>
        {loadError && (
          <p className="text-emerald-100 text-xs mt-4 italic">
            Couldn&apos;t load your live net worth — showing a sample $100,000 starting point so you can still preview the projection.
          </p>
        )}
      </div>

      {/* Projection chart */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Net-worth projection</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Compound-growth model: starting net worth + monthly contributions earning {annualReturnPct}% annually.
            </p>
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-700">
            {fmtShort(finalValue)} <span className="text-xs font-normal text-gray-500">in {projection.length ? projection[projection.length - 1].year : 0}y</span>
          </p>
        </div>

        {projection.length === 0 ? (
          <div className="py-20 text-center text-gray-400">Loading projection…</div>
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
                tickFormatter={y => y === 0 ? 'Now' : `+${y}y`}
              />
              <YAxis
                tickFormatter={fmtShort}
                tick={{ fill: '#374151', fontSize: 11 }}
              />
              <Tooltip
                formatter={(v: number | undefined) => fmt(v ?? 0)}
                labelFormatter={y => y === 0 ? 'Today' : `${y} year${y === 1 ? '' : 's'} from now`}
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
                  label={{ value: '🕋 Hajj', position: 'top', fill: '#FF6B35', fontSize: 12, fontWeight: 600 }}
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
                  label={{ value: `Retirement · ${retirementAge}`, position: 'top', fill: '#1B5E20', fontSize: 12, fontWeight: 600 }}
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
          label="Current age"
          subtitle="Used to mark retirement on the chart"
          value={currentAge}
          onChange={setCurrentAge}
          min={18}
          max={80}
          step={1}
          suffix="years"
        />
        <ScenarioCard
          label="Retirement age"
          subtitle="When you plan to stop earning"
          value={retirementAge}
          onChange={setRetirementAge}
          min={Math.max(currentAge + 1, 35)}
          max={85}
          step={1}
          suffix="years"
          accent="primary"
        />
        <ScenarioCard
          label="Hajj timing"
          subtitle="Years from now"
          value={hajjYearsFromNow}
          onChange={setHajjYearsFromNow}
          min={1}
          max={MAX_HORIZON}
          step={1}
          suffix="years"
          accent="orange"
          icon="🕋"
        />
        <ScenarioCard
          label="Monthly contribution"
          subtitle="Halal investments + savings"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          min={0}
          max={20_000}
          step={100}
          prefix={symbol}
        />
        <ScenarioCard
          label="Annual return"
          subtitle="Long-run halal-portfolio average"
          value={annualReturnPct}
          onChange={setAnnualReturnPct}
          min={0}
          max={15}
          step={0.5}
          suffix="%"
        />
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900 leading-relaxed">
          <p className="font-semibold mb-1">Tip 💡</p>
          <p>
            Try setting Hajj 5 years out and see how much your monthly contribution
            needs to be to stay on track. Increasing the annual return assumes a
            more aggressive halal-equity weighting in your portfolio.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-900 leading-relaxed mb-8">
        <p className="font-semibold mb-1">⚠️ Not financial advice</p>
        <p>
          Projections use a constant-rate compound-growth model and don&apos;t
          account for inflation, taxes, market volatility, life events, or
          fluctuating contributions. Numbers are illustrative — consult a
          qualified financial advisor for actual planning. Not a fatwa; consult
          a qualified scholar for the Islamic permissibility of any specific
          investment vehicle.
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
}

function ScenarioCard({
  label, subtitle, value, onChange, min, max, step, prefix, suffix, accent, icon,
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
        aria-label={`${label} slider`}
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
