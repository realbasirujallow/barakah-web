// 2026-05-03 (Step 6): in-page drilldown for the dashboard net-worth
// hero. When the user sees "$679k net worth · +$53k 1 month" and
// wants to know WHAT changed, this panel lays it out:
//
//   • 1-month delta on the three totals (Assets, Debts, Net Worth)
//   • Current asset breakdown grouped by category (Cash, Investments,
//     Real Estate, Vehicles, Other)
//   • Current debt breakdown grouped by category (Credit Cards, Loans)
//
// Per-asset deltas (which holding moved how much) require backend work
// — net_worth_snapshots only store total assets / debts / net_worth
// today, not the per-asset breakdown. We'll add that in a follow-up;
// for now this gives the user the "what's in my net worth + how the
// totals moved" view.

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useCurrency } from '../../lib/useCurrency';

interface AssetItem {
  id: number;
  name: string;
  type: string;
  value: number;
  institutionName?: string | null;
}

interface DebtRow {
  id: number;
  name: string;
  type: string;
  remainingAmount: number;
}

interface HistoryPoint {
  snapshotDate: number;
  netWorth: number;
  totalAssets?: number;
  totalDebts?: number;
}

function groupForAsset(t: string): string {
  const x = (t || '').toLowerCase();
  if (/cash|checking|saving|money[\s-]?market/.test(x)) return 'Cash';
  if (/stock|crypto|investment|brokerage|etf|401k|ira|hsa|403b|pension|529|tsp|business/.test(x)) return 'Investments';
  if (/real[\s_-]?estate|property|home|rental/.test(x)) return 'Real Estate';
  if (/vehicle|car/.test(x)) return 'Vehicles';
  if (/gold|silver|metal/.test(x)) return 'Metals';
  return 'Other';
}

function groupForDebt(t: string): string {
  const x = (t || '').toLowerCase();
  if (/credit[\s_-]?card|cc/.test(x)) return 'Credit Cards';
  if (/mortgage|loan|line[\s_-]?of[\s_-]?credit/.test(x)) return 'Loans';
  return 'Other';
}

interface NetWorthDrilldownProps {
  /** When false, the panel is collapsed (renders nothing). */
  expanded: boolean;
  onClose?: () => void;
}

export function NetWorthDrilldown({ expanded, onClose }: NetWorthDrilldownProps) {
  const { fmt } = useCurrency();
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [debts, setDebts] = useState<DebtRow[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      api.getAssets() as Promise<{ assets?: AssetItem[] } | AssetItem[] | unknown>,
      api.getDebts?.() as Promise<{ debts?: DebtRow[] } | DebtRow[] | unknown>,
      api.getNetWorthHistory('1m') as Promise<{ snapshots?: HistoryPoint[] } | HistoryPoint[] | unknown>,
    ]).then(results => {
      if (cancelled) return;
      const [aRes, dRes, hRes] = results;
      if (aRes.status === 'fulfilled' && aRes.value) {
        const v = aRes.value as { assets?: AssetItem[] } | AssetItem[];
        const list = Array.isArray(v) ? v : (v.assets ?? []);
        setAssets(list);
      }
      if (dRes.status === 'fulfilled' && dRes.value) {
        const v = dRes.value as { debts?: DebtRow[] } | DebtRow[];
        const list = Array.isArray(v) ? v : (v.debts ?? []);
        setDebts(list);
      }
      if (hRes.status === 'fulfilled' && hRes.value) {
        const v = hRes.value as { snapshots?: HistoryPoint[] } | HistoryPoint[];
        const list = Array.isArray(v) ? v : (v.snapshots ?? []);
        setHistory(list);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [expanded]);

  const assetGroups = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assets) {
      const g = groupForAsset(a.type);
      map.set(g, (map.get(g) ?? 0) + a.value);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [assets]);

  const debtGroups = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of debts) {
      const g = groupForDebt(d.type);
      map.set(g, (map.get(g) ?? 0) + d.remainingAmount);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [debts]);

  const totals = useMemo(() => {
    const totalAssets = assets.reduce((s, a) => s + a.value, 0);
    const totalDebts = debts.reduce((s, d) => s + d.remainingAmount, 0);
    const netWorth = totalAssets - totalDebts;
    if (history.length < 2) return { totalAssets, totalDebts, netWorth, dAssets: 0, dDebts: 0, dNet: 0 };
    const earliest = history[0];
    return {
      totalAssets,
      totalDebts,
      netWorth,
      dAssets: totalAssets - (earliest.totalAssets ?? 0),
      dDebts: totalDebts - (earliest.totalDebts ?? 0),
      dNet: netWorth - earliest.netWorth,
    };
  }, [assets, debts, history]);

  if (!expanded) return null;

  return (
    <section className="bg-card rounded-2xl border border-border p-5 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Net Worth Breakdown</p>
          <p className="text-base font-semibold text-foreground">Last 1 month</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drilldown"
            className="text-gray-500 hover:text-gray-800 transition rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading…</div>
      ) : (
        <>
          {/* Three-stat row: Assets / Debts / Net Worth with deltas */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <DeltaStat label="Assets"    value={totals.totalAssets} delta={totals.dAssets} positiveIsGood fmt={fmt} />
            <DeltaStat label="Debts"     value={totals.totalDebts}  delta={totals.dDebts}  positiveIsGood={false} fmt={fmt} />
            <DeltaStat label="Net Worth" value={totals.netWorth}    delta={totals.dNet}    positiveIsGood fmt={fmt} bold />
          </div>

          {/* Asset breakdown by category */}
          {assetGroups.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Assets by category</p>
                <Link href="/dashboard/net-worth" className="text-xs text-primary font-semibold hover:underline">
                  View all →
                </Link>
              </div>
              <BreakdownBars rows={assetGroups} total={totals.totalAssets} barClass="bg-emerald-500" fmt={fmt} />
            </div>
          )}

          {/* Debt breakdown by category */}
          {debtGroups.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Debts by category</p>
                <Link href="/dashboard/debts" className="text-xs text-primary font-semibold hover:underline">
                  View all →
                </Link>
              </div>
              <BreakdownBars rows={debtGroups} total={totals.totalDebts} barClass="bg-rose-500" fmt={fmt} />
            </div>
          )}

          {history.length < 2 && (
            <p className="mt-4 text-xs text-muted-foreground italic">
              Per-asset deltas need at least 2 net-worth snapshots. Take a snapshot
              on the Net Worth page to start tracking change over time.
            </p>
          )}
        </>
      )}
    </section>
  );
}

function DeltaStat({
  label, value, delta, positiveIsGood, fmt, bold = false,
}: {
  label: string;
  value: number;
  delta: number;
  positiveIsGood: boolean;
  fmt: (n: number) => string;
  bold?: boolean;
}) {
  const positive = delta >= 0;
  // For Debts, growing debts is bad (red); for Assets/Net Worth, growing is good (green).
  const goodDirection = positiveIsGood ? positive : !positive;
  const deltaColor = goodDirection ? 'text-emerald-700' : 'text-rose-700';
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`tabular-nums ${bold ? 'text-2xl font-bold' : 'text-xl font-semibold'} text-foreground mt-0.5`}>
        {fmt(value)}
      </p>
      {delta !== 0 && (
        <p className={`text-[11px] ${deltaColor} font-medium`}>
          {positive ? '▲' : '▼'} {fmt(Math.abs(delta))}
        </p>
      )}
    </div>
  );
}

function BreakdownBars({
  rows, total, barClass, fmt,
}: {
  rows: Array<[string, number]>;
  total: number;
  barClass: string;
  fmt: (n: number) => string;
}) {
  return (
    <ul className="space-y-2">
      {rows.map(([label, value]) => {
        const pct = total > 0 ? (value / total) * 100 : 0;
        return (
          <li key={label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{label}</span>
              <span className="tabular-nums text-foreground">
                {fmt(value)}
                <span className="text-muted-foreground ml-1">· {pct.toFixed(0)}%</span>
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${barClass}`} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
