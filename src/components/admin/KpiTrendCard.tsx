'use client';

/**
 * 2026-05-18 release-polish (admin-robustness gap #9): Last-8-weeks KPI
 * sparkline + WoW delta card for the scorecard.
 *
 * Pulls GET /admin/kpi-snapshots?weeks=8 and renders:
 *   - 4 small KPI tiles (Total users, Paid users, MRR, Trial count)
 *   - each with current value + WoW delta chip (green up / red down)
 *   - and a tiny SVG sparkline (8 weeks of daily points)
 * Plus a "buildingHistory" note when fewer than 7 live snapshots have
 * accrued (typical for the first week after deploy).
 *
 * Pure SVG — no chart library needed for sparklines.
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface KpiDelta {
  previous: number | null;
  latest: number | null;
  delta?: number;
  deltaPct?: number | null;
}
interface Snapshot {
  date: string;
  source: 'live' | 'backfill';
  totalUsers: number;
  newUsersToday: number;
  paidUsers: number | null;
  trialCount: number | null;
  activeCount: number | null;
  mrrCents: number | null;
}
interface KpiResponse {
  weeks: number;
  days: number;
  earliestSnapshot: string | null;
  backfillRowCount: number;
  liveRowCount: number;
  buildingHistory: boolean;
  buildingHistoryNote: string | null;
  deltas: {
    totalUsers: KpiDelta;
    paidUsers: KpiDelta;
    activeCount: KpiDelta;
    trialCount: KpiDelta;
    mrrCents: KpiDelta;
    arrCents: KpiDelta;
  };
  snapshots: Snapshot[];
}

const fmtDelta = (d?: number, pct?: number | null) => {
  if (d == null) return '—';
  const sign = d > 0 ? '+' : '';
  if (pct != null && Number.isFinite(pct)) {
    return `${sign}${d.toLocaleString()} (${sign}${pct.toFixed(1)}%)`;
  }
  return `${sign}${d.toLocaleString()}`;
};

const fmtMoney = (cents: number | null) => {
  if (cents == null) return '—';
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const fmtMoneyDelta = (d?: number, pct?: number | null) => {
  if (d == null) return '—';
  const sign = d > 0 ? '+' : '';
  const dollars = `${sign}$${(Math.abs(d) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const signedDollars = d < 0 ? `-$${(Math.abs(d) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : dollars;
  if (pct != null && Number.isFinite(pct)) {
    return `${signedDollars} (${sign}${pct.toFixed(1)}%)`;
  }
  return signedDollars;
};

interface SparklineProps {
  points: (number | null)[];
  /** Render width + height in CSS pixels. */
  width?: number;
  height?: number;
  stroke?: string;
}

function Sparkline({ points, width = 140, height = 32, stroke = '#1B5E20' }: SparklineProps) {
  const valid = points.filter((p): p is number => p != null);
  if (valid.length < 2) {
    return <div className="text-[10px] text-gray-400 italic">building…</div>;
  }
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  // Coords: x evenly spaced, y inverted so up = up.
  const xStep = points.length > 1 ? width / (points.length - 1) : 0;
  const segments: string[] = [];
  let started = false;
  points.forEach((p, i) => {
    if (p == null) return;
    const x = i * xStep;
    const y = height - ((p - min) / range) * height;
    if (!started) {
      segments.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
      started = true;
    } else {
      segments.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={segments.join(' ')} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

interface TileProps {
  label: string;
  current: string;
  delta: KpiDelta | undefined;
  deltaFmt: (d?: number, pct?: number | null) => string;
  sparkPoints: (number | null)[];
}

function Tile({ label, current, delta, deltaFmt, sparkPoints }: TileProps) {
  const d = delta?.delta;
  const deltaColor =
    d == null ? 'text-gray-400' : d > 0 ? 'text-green-700' : d < 0 ? 'text-red-700' : 'text-gray-500';
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1.5">{current}</p>
      <p className={`text-xs font-medium mt-0.5 ${deltaColor}`}>
        WoW {deltaFmt(d, delta?.deltaPct)}
      </p>
      <div className="mt-2">
        <Sparkline points={sparkPoints} />
      </div>
    </div>
  );
}

export default function KpiTrendCard() {
  const [data, setData] = useState<KpiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.getAdminKpiSnapshots(8);
      if (r?.error) {
        setHidden(true);
      } else {
        setData(r as KpiResponse);
      }
    } catch {
      // Silent fail — keep scorecard usable; trend card is non-critical.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (hidden) return null;
  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Loading 8-week trend…</p>
      </div>
    );
  }
  if (!data || data.snapshots.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 italic">
          No snapshots yet. The first daily snapshot writes at 01:00 UTC tomorrow.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div>
          <h2 className="font-semibold text-gray-700 text-sm">8-week trend</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            WoW delta = latest snapshot vs. 7 days prior.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="text-xs text-primary hover:underline disabled:opacity-50"
        >
          ↻
        </button>
      </div>

      {data.buildingHistory && data.buildingHistoryNote && (
        <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          ⏳ {data.buildingHistoryNote}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile
          label="Total users"
          current={(data.snapshots[data.snapshots.length - 1]?.totalUsers ?? 0).toLocaleString()}
          delta={data.deltas.totalUsers}
          deltaFmt={fmtDelta}
          sparkPoints={data.snapshots.map(s => s.totalUsers)}
        />
        <Tile
          label="Paid users"
          current={(data.snapshots[data.snapshots.length - 1]?.paidUsers ?? 0).toLocaleString()}
          delta={data.deltas.paidUsers}
          deltaFmt={fmtDelta}
          sparkPoints={data.snapshots.map(s => s.paidUsers)}
        />
        <Tile
          label="MRR"
          current={fmtMoney(data.snapshots[data.snapshots.length - 1]?.mrrCents ?? null)}
          delta={data.deltas.mrrCents}
          deltaFmt={fmtMoneyDelta}
          sparkPoints={data.snapshots.map(s => s.mrrCents)}
        />
        <Tile
          label="Trial count"
          current={(data.snapshots[data.snapshots.length - 1]?.trialCount ?? 0).toLocaleString()}
          delta={data.deltas.trialCount}
          deltaFmt={fmtDelta}
          sparkPoints={data.snapshots.map(s => s.trialCount)}
        />
      </div>

      <p className="text-[10px] text-gray-400 mt-3">
        {data.snapshots.length} daily points · {data.liveRowCount} live · {data.backfillRowCount} backfilled
        {data.earliestSnapshot && ` · earliest ${data.earliestSnapshot}`}
      </p>
    </div>
  );
}
