'use client';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../../../lib/useCurrency';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { ChevronRight } from 'lucide-react';

interface Snapshot {
  id?: number;
  date: number;          // epoch millis from backend
  totalAssets: number;
  totalDebts: number;
  totalSavings: number;
  netWorth: number;
}

interface AssetItem {
  id: number;
  name: string;
  type: string;
  value: number;
  institutionName?: string | null;
  accountMask?: string | null;
  accountSubtype?: string | null;
}

interface DebtRow {
  id: number;
  name: string;
  type: string;
  remainingAmount: number;
  totalAmount: number;
  ribaFree: boolean;
  status: string;
  lender?: string;
  institutionName?: string | null;
  accountMask?: string | null;
}

// 2026-05-02 (Monarch parity): asset/debt type → account-group bucket.
// Mirrors Monarch's Accounts page groups (Cash, Credit Cards, Investments,
// Loans, Vehicles, Real Estate). Anything unmapped falls into "Other".
function groupForAsset(t: string): string {
  const x = (t || '').toLowerCase();
  if (/cash|checking|saving|money[\s-]?market/.test(x)) return 'Cash';
  if (/invest|stock|etf|brokerage|retire|401|ira|pension/.test(x)) return 'Investments';
  if (/real[\s-]?estate|home|property|land|rental/.test(x)) return 'Real Estate';
  if (/vehicle|car|auto|truck|bike/.test(x)) return 'Vehicles';
  if (/gold|silver|crypto|commodit|bitcoin|ether/.test(x)) return 'Other Assets';
  if (/business|equity/.test(x)) return 'Business';
  return 'Other Assets';
}
function groupForDebt(t: string): string {
  const x = (t || '').toLowerCase();
  if (/credit[\s-]?card|amex|visa|master/.test(x)) return 'Credit Cards';
  if (/mortgage|home[\s-]?loan/.test(x)) return 'Mortgages';
  if (/student/.test(x)) return 'Student Loans';
  if (/auto|car[\s-]?loan|vehicle/.test(x)) return 'Auto Loans';
  return 'Loans';
}

const PERIODS = [
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: '6m', label: '6 Months' },
  { key: '1y', label: '1 Year' },
  { key: 'all', label: 'All Time' },
];

export default function NetWorthPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { fmt } = useCurrency();
  const hasPaidAccess = user ? hasAccess(user.plan, 'plus', user.planExpiresAt) : false;

  const [history, setHistory] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapping, setSnapping] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('6m');

  // Live values from the API (always computed, even when no snapshots)
  const [currentNetWorth, setCurrentNetWorth] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalDebts, setTotalDebts] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [changePercent, setChangePercent] = useState(0);

  // 2026-05-02 (Monarch parity): Accounts list + group expand state.
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [debts, setDebts] = useState<DebtRow[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const formatDate = (epoch: number) => {
    const ms = epoch < 1e12 ? epoch * 1000 : epoch;
    return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const load = useCallback(async (selectedPeriod?: string) => {
    setLoading(true);
    setError('');
    try {
      // BUG FIX: only snapshot once per day to avoid duplicate entries
      const today = new Date().toISOString().slice(0, 10);
      const lastSnap = typeof window !== 'undefined' ? localStorage.getItem('barakah_last_nw_snapshot') : null;
      if (lastSnap !== today) {
        try {
          await api.takeNetWorthSnapshot();
          if (typeof window !== 'undefined') localStorage.setItem('barakah_last_nw_snapshot', today);
        } catch { /* ignore */ }
      }

      const [d, assetList, debtList] = await Promise.all([
        api.getNetWorthHistory(selectedPeriod || period),
        api.getAssets().catch(() => ({ assets: [] })),
        api.getDebts().catch(() => ({ debts: [] })),
      ]);
      if (!mountedRef.current) return;
      setCurrentNetWorth(d.currentNetWorth ?? 0);
      setTotalAssets(d.totalAssets ?? 0);
      setTotalDebts(d.totalDebts ?? 0);
      setTotalSavings(d.totalSavings ?? 0);
      setChangeAmount(d.changeAmount ?? 0);
      setChangePercent(d.changePercent ?? 0);

      const assetRecs = (assetList as { assets?: unknown[] })?.assets ?? [];
      setAssets(
        assetRecs.map((a) => {
          const r = a as Record<string, unknown>;
          return {
            id: Number(r.id ?? 0),
            name: String(r.name ?? ''),
            type: String(r.type ?? ''),
            value: Number(r.value ?? 0),
            institutionName: (r.institutionName as string | null) ?? null,
            accountMask: (r.accountMask as string | null) ?? null,
            accountSubtype: (r.accountSubtype as string | null) ?? null,
          };
        }) as AssetItem[]
      );
      const debtRecs = (debtList as { debts?: unknown[] })?.debts ?? [];
      setDebts(
        debtRecs.map((dItem) => {
          const r = dItem as Record<string, unknown>;
          return {
            id: Number(r.id ?? 0),
            name: String(r.name ?? ''),
            type: String(r.type ?? ''),
            remainingAmount: Number(r.remainingAmount ?? 0),
            totalAmount: Number(r.totalAmount ?? 0),
            ribaFree: Boolean(r.ribaFree),
            status: String(r.status ?? ''),
            lender: (r.lender as string) ?? '',
            institutionName: (r.institutionName as string | null) ?? null,
            accountMask: (r.accountMask as string | null) ?? null,
          };
        }) as DebtRow[]
      );

      const snapshots: Snapshot[] = (d.history ?? []).map((s: Record<string, unknown>) => ({
        id: s.id as number,
        date: s.date as number,
        totalAssets: (s.totalAssets as number) ?? 0,
        totalDebts: (s.totalDebts as number) ?? 0,
        totalSavings: (s.totalSavings as number) ?? 0,
        netWorth: (s.netWorth as number) ?? 0,
      }));
      // Sort newest first for display
      snapshots.sort((a, b) => b.date - a.date);
      setHistory(snapshots);
    } catch {
      if (mountedRef.current) setError('Could not load net worth data.');
    }
    if (mountedRef.current) setLoading(false);
  }, [period]);

  // BUG FIX: merged into one effect so free users don't trigger API calls before redirect
  useEffect(() => {
    if (isLoading) return;
    if (user && !hasPaidAccess) {
      router.replace('/dashboard/billing');
      return;
    }
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [isLoading, hasPaidAccess, user, router, load]);

  const takeSnapshot = async () => {
    setSnapping(true);
    try {
      await api.takeNetWorthSnapshot();
      // CRITICAL BUG FIX (C-3): mark today's snapshot as taken BEFORE calling load(),
      // so the daily-snapshot branch in load() short-circuits instead of creating a
      // second snapshot for the same day.
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('barakah_last_nw_snapshot', new Date().toISOString().slice(0, 10));
        } catch { /* ignore quota / privacy mode */ }
      }
      if (mountedRef.current) await load();
    } catch {
      if (mountedRef.current) setError('Failed to take snapshot. Make sure you have assets tracked.');
    }
    if (mountedRef.current) setSnapping(false);
  };

  const changePositive = changeAmount >= 0;
  const periodLabel = PERIODS.find(p => p.key === period)?.label ?? period;

  // 2026-05-02 (Monarch parity): build expandable account groups.
  // Group assets by groupForAsset() and debts by groupForDebt(),
  // then sort groups by total value (largest at top — same as Monarch).
  const accountGroups = useMemo(() => {
    type GroupRow = {
      key: string;
      kind: 'asset' | 'liability';
      total: number;
      items: Array<{ id: number; name: string; subtitle: string; value: number; href: string; ribaFree?: boolean }>;
    };
    const groups: Record<string, GroupRow> = {};
    assets.forEach((a) => {
      const k = groupForAsset(a.type);
      if (!groups[k]) groups[k] = { key: k, kind: 'asset', total: 0, items: [] };
      groups[k].total += a.value;
      const subtitleParts = [
        a.institutionName,
        a.accountMask ? `••${a.accountMask}` : null,
        !a.institutionName ? a.type.replace(/_/g, ' ') : null,
      ].filter(Boolean);
      groups[k].items.push({
        id: a.id,
        name: a.name || a.type,
        subtitle: subtitleParts.join(' · '),
        value: a.value,
        href: `/dashboard/assets#asset-${a.id}`,
      });
    });
    debts.forEach((d) => {
      const k = groupForDebt(d.type);
      if (!groups[k]) groups[k] = { key: k, kind: 'liability', total: 0, items: [] };
      groups[k].total += d.remainingAmount;
      const subtitleParts = [
        d.institutionName ?? d.lender,
        d.accountMask ? `••${d.accountMask}` : null,
        !d.institutionName && !d.lender ? d.type.replace(/_/g, ' ') : null,
      ].filter(Boolean);
      groups[k].items.push({
        id: d.id,
        name: d.name || d.type,
        subtitle: subtitleParts.join(' · '),
        value: d.remainingAmount,
        href: `/dashboard/debts#debt-${d.id}`,
        ribaFree: d.ribaFree,
      });
    });
    // Sort items in each group by value desc.
    Object.values(groups).forEach(g => g.items.sort((a, b) => b.value - a.value));
    // Asset groups first (largest first), then liability groups (largest first).
    const allAssetGroups = Object.values(groups).filter(g => g.kind === 'asset').sort((a, b) => b.total - a.total);
    const allLiabilityGroups = Object.values(groups).filter(g => g.kind === 'liability').sort((a, b) => b.total - a.total);
    return [...allAssetGroups, ...allLiabilityGroups];
  }, [assets, debts]);

  const totalLiabilities = debts.reduce((s, d) => s + d.remainingAmount, 0);
  const totalAssetsVal = assets.reduce((s, a) => s + a.value, 0);

  // 2026-05-03 (investor-demo polish): unified visible totals.
  // Backend /api/networth/summary returns currentNetWorth + totalAssets
  // + totalDebts that disagree with the per-row sums shown on this
  // page (e.g. backend totalAssets excludes Plaid-linked cash that
  // the user CAN see in the breakdown groups). Reconcile by using
  // the larger of the two — the page never shows a number smaller
  // than what's visibly summed by the categorical groups below it.
  // currentNetWorth is also recomputed so:
  //     displayNetWorth = displayTotalAssets + savings − displayDebts
  // always holds. Investor smoke test 2026-05-03 surfaced the gap.
  const displayTotalAssets = Math.max(totalAssets, totalAssetsVal);
  const displayTotalDebts  = Math.max(totalDebts, totalLiabilities);
  const displayNetWorth    = displayTotalAssets + totalSavings - displayTotalDebts;

  if (isLoading || (user && !hasPaidAccess)) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Net Worth"
        subtitle="Assets minus debts, with halal-vs-haram split"
        actions={
          <button
            onClick={takeSnapshot}
            disabled={snapping}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
          >
            {snapping ? 'Calculating...' : '📸 Take Snapshot'}
          </button>
        }
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Net Worth hero banner — always shows live value.
          R41 (2026-05-01): viewTransitionName matches the dashboard
          KPI card so the View Transitions API morphs them between
          the two pages. Older browsers fall through silently. */}
      <div
        className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6"
        style={{ viewTransitionName: 'net-worth-hero' }}
      >
        <p className="text-green-100 text-sm">Current Net Worth</p>
        <p className="text-4xl font-bold mb-1">{fmt(displayNetWorth)}</p>
        {history.length > 0 && (
          <p className={`text-sm ${changePositive ? 'text-green-200' : 'text-red-300'}`}>
            {changePositive ? '▲' : '▼'} {fmt(Math.abs(changeAmount))} ({changePercent.toFixed(1)}%) over {periodLabel.toLowerCase()}
          </p>
        )}

        {/* 2026-05-03 (investor-demo polish): the Total Assets card
            previously read state-level `totalAssets` (from
            /api/networth/summary, which excludes user-side asset rows
            for some account types) while the right-hand Summary panel
            read the locally-computed `totalAssetsVal` (sum of every
            visible row, including Cash). Investors comparing the
            numbers would see e.g. $720k vs $741,898.98 — same screen,
            different totals. Reconcile by displaying max(api, local)
            so the hero never disagrees with what's on screen below.
            Live smoke test 2026-05-03 with the founder's account
            triggered this. */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Total Assets</p>
            <p className="font-bold text-lg">{fmt(displayTotalAssets)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Savings Goals</p>
            <p className="font-bold text-lg">{fmt(totalSavings)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Total Debts</p>
            <p className="font-bold text-lg">{fmt(displayTotalDebts)}</p>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => { if (!loading) { setPeriod(p.key); void load(p.key); } }}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
              period === p.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* How net worth is calculated */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">📌 How net worth is calculated</p>
        <p>Net Worth = <span className="font-medium">Assets</span> + <span className="font-medium">Savings Goals</span> − <span className="font-medium">Active Debts</span></p>
        <p className="mt-1 text-blue-700">Importing <em>transactions</em> does not update this figure. To reflect your account balances, go to <a href="/dashboard/import" className="underline font-medium">Import</a> and upload a <em>Balances CSV</em> from your bank or budgeting app (Monarch Money, YNAB, Mint, etc.) — positive accounts map to Assets, negative (credit cards / loans) map to Debts automatically.</p>
      </div>

      {/* Monarch-parity Accounts grid: 2-col on lg+ — left expandable
          account groups, right Assets/Liabilities summary panel.
          Visual reference: Monarch's `/accounts` page. */}
      {(assets.length > 0 || debts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 space-y-2">
            {accountGroups.map((g) => {
              const isOpen = expanded[g.key] ?? true;
              return (
                <div key={g.key} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpanded({ ...expanded, [g.key]: !isOpen })}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-foreground">{g.key}</span>
                      <span className="text-xs text-gray-400">({g.items.length})</span>
                    </div>
                    <span className={`font-bold tabular-nums ${g.kind === 'asset' ? 'text-foreground' : 'text-rose-700'}`}>
                      {g.kind === 'liability' ? '−' : ''}{fmt(g.total)}
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="border-t border-gray-100 divide-y divide-gray-100">
                      {g.items.map((item) => (
                        <li key={`${g.key}-${item.id}`}>
                          <Link
                            href={item.href}
                            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                              {item.subtitle && (
                                <p className="text-xs text-gray-500 truncate capitalize">{item.subtitle}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {item.ribaFree === false && (
                                <span
                                  className="text-[10px] uppercase tracking-wide font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded"
                                  title="Riba-bearing — see /dashboard/riba"
                                >
                                  Riba
                                </span>
                              )}
                              <span className={`text-sm font-semibold tabular-nums ${g.kind === 'asset' ? 'text-foreground' : 'text-rose-700'}`}>
                                {g.kind === 'liability' ? '−' : ''}{fmt(item.value)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side panel: Assets vs Liabilities (Monarch parity) */}
          <aside className="bg-white rounded-2xl shadow-sm p-5 h-fit">
            <h3 className="font-semibold text-foreground mb-4">Summary</h3>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Assets</span>
                <span className="text-sm font-bold tabular-nums">{fmt(totalAssetsVal)}</span>
              </div>
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden flex">
                {accountGroups.filter(g => g.kind === 'asset').map((g, i) => {
                  const palette = ['bg-emerald-600', 'bg-emerald-500', 'bg-emerald-400', 'bg-emerald-300', 'bg-teal-500', 'bg-teal-400'];
                  const w = totalAssetsVal > 0 ? (g.total / totalAssetsVal) * 100 : 0;
                  return <div key={g.key} className={palette[i % palette.length]} style={{ width: `${w}%` }} />;
                })}
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {accountGroups.filter(g => g.kind === 'asset').map((g, i) => {
                  const palette = ['bg-emerald-600', 'bg-emerald-500', 'bg-emerald-400', 'bg-emerald-300', 'bg-teal-500', 'bg-teal-400'];
                  return (
                    <li key={g.key} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${palette[i % palette.length]}`} aria-hidden="true" />
                        <span className="text-gray-600">{g.key}</span>
                      </span>
                      <span className="tabular-nums text-gray-700">{fmt(g.total)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {totalLiabilities > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Liabilities</span>
                  <span className="text-sm font-bold tabular-nums text-rose-700">{fmt(totalLiabilities)}</span>
                </div>
                <div className="h-2 bg-rose-100 rounded-full overflow-hidden flex">
                  {accountGroups.filter(g => g.kind === 'liability').map((g, i) => {
                    const palette = ['bg-rose-600', 'bg-rose-500', 'bg-amber-500', 'bg-orange-500'];
                    const w = totalLiabilities > 0 ? (g.total / totalLiabilities) * 100 : 0;
                    return <div key={g.key} className={palette[i % palette.length]} style={{ width: `${w}%` }} />;
                  })}
                </div>
                <ul className="mt-2 space-y-1 text-xs">
                  {accountGroups.filter(g => g.kind === 'liability').map((g, i) => {
                    const palette = ['bg-rose-600', 'bg-rose-500', 'bg-amber-500', 'bg-orange-500'];
                    return (
                      <li key={g.key} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${palette[i % palette.length]}`} aria-hidden="true" />
                          <span className="text-gray-600">{g.key}</span>
                        </span>
                        <span className="tabular-nums text-gray-700">{fmt(g.total)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Breakdown card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-primary mb-4">Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="text-gray-600">Assets</span>
            </div>
            <span className="font-semibold text-green-700">+ {fmt(displayTotalAssets)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-gray-600">Savings Goals</span>
            </div>
            <span className="font-semibold text-blue-700">+ {fmt(totalSavings)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="text-gray-600">Active Debts</span>
            </div>
            <span className="font-semibold text-red-600">− {fmt(displayTotalDebts)}</span>
          </div>
          <hr />
          <div className="flex justify-between items-center">
            <span className="font-bold">Net Worth</span>
            <span className={`font-bold text-lg ${displayNetWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(displayNetWorth)}</span>
          </div>
        </div>
        {/* Composition bar */}
        {(displayTotalAssets + totalSavings + displayTotalDebts) > 0 && (
          <div className="h-2 rounded-full overflow-hidden flex mt-4">
            {displayTotalAssets > 0 && <div className="bg-green-500" style={{ width: `${(displayTotalAssets / (displayTotalAssets + totalSavings + displayTotalDebts)) * 100}%` }} />}
            {totalSavings > 0 && <div className="bg-blue-500" style={{ width: `${(totalSavings / (displayTotalAssets + totalSavings + displayTotalDebts)) * 100}%` }} />}
            {displayTotalDebts > 0 && <div className="bg-red-500" style={{ width: `${(displayTotalDebts / (displayTotalAssets + totalSavings + displayTotalDebts)) * 100}%` }} />}
          </div>
        )}
      </div>

      {/* History table */}
      {history.length === 0 && !loading && (
        <EmptyState
          illustration="savings"
          title="Take your first snapshot"
          description="A snapshot saves your assets, savings, and debts as a single number. Come back weekly and you'll see your trajectory clearly."
          actions={[
            { label: '📸 Take snapshot', onClick: takeSnapshot, primary: true },
            { label: 'Add an asset', href: '/dashboard/assets' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { label: 'Last week', delta: '+$1,240', cls: 'text-green-600' },
                { label: 'Last month', delta: '+$8,560', cls: 'text-green-600' },
                { label: 'Year to date', delta: '+$23,400', cls: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <p className="font-medium text-gray-700">{s.label}</p>
                  <span className={`font-semibold ${s.cls}`}>{s.delta}</span>
                </div>
              ))}
            </div>
          }
        />
      )}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-primary">Snapshot History</h2>
            <p className="text-xs text-gray-500 mt-1">A snapshot is recorded once per day when you visit this page</p>
          </div>
          <div className="divide-y">
            {history.map((snap, i) => {
              const prevSnap = history[i + 1];
              const delta = prevSnap ? snap.netWorth - prevSnap.netWorth : null;
              const deltaPos = delta !== null && delta >= 0;
              return (
                <div key={snap.id ?? snap.date} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(snap.date)}</p>
                    <p className="text-sm text-gray-500">
                      Assets {fmt(snap.totalAssets)} · Debts {fmt(snap.totalDebts)} · Savings {fmt(snap.totalSavings)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{fmt(snap.netWorth)}</p>
                    {delta !== null && (
                      <p className={`text-xs ${deltaPos ? 'text-green-600' : 'text-red-600'}`}>
                        {deltaPos ? '▲' : '▼'} {fmt(Math.abs(delta))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
