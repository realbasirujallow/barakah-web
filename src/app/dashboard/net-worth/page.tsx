'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Snapshot {
  id?: number;
  date: number;          // epoch millis from backend
  totalAssets: number;
  totalDebts: number;
  totalSavings: number;
  netWorth: number;
}

const PERIODS = [
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: '6m', label: '6 Months' },
  { key: '1y', label: '1 Year' },
  { key: 'all', label: 'All Time' },
];

export default function NetWorthPage() {
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

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

  const formatDate = (epoch: number) =>
    new Date(epoch).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const load = async (p?: string) => {
    setLoading(true);
    setError('');
    try {
      // Auto-take a snapshot on each visit (like Flutter apps)
      try { await api.takeNetWorthSnapshot(); } catch { /* ignore */ }

      const d = await api.getNetWorthHistory(p || period);
      setCurrentNetWorth(d.currentNetWorth ?? 0);
      setTotalAssets(d.totalAssets ?? 0);
      setTotalDebts(d.totalDebts ?? 0);
      setTotalSavings(d.totalSavings ?? 0);
      setChangeAmount(d.changeAmount ?? 0);
      setChangePercent(d.changePercent ?? 0);

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
      setError('Could not load net worth data.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const takeSnapshot = async () => {
    setSnapping(true);
    try {
      await api.takeNetWorthSnapshot();
      await load();
    } catch {
      setError('Failed to take snapshot. Make sure you have assets tracked.');
    }
    setSnapping(false);
  };

  const changePositive = changeAmount >= 0;
  const periodLabel = PERIODS.find(p => p.key === period)?.label ?? period;

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Net Worth</h1>
        <button
          onClick={takeSnapshot}
          disabled={snapping}
          className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium disabled:opacity-50"
        >
          {snapping ? 'Calculating...' : '📸 Take Snapshot'}
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Net Worth hero banner — always shows live value */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-green-100 text-sm">Current Net Worth</p>
        <p className="text-4xl font-bold mb-1">{fmt(currentNetWorth)}</p>
        {history.length > 0 && (
          <p className={`text-sm ${changePositive ? 'text-green-200' : 'text-red-300'}`}>
            {changePositive ? '▲' : '▼'} {fmt(Math.abs(changeAmount))} ({changePercent.toFixed(1)}%) over {periodLabel.toLowerCase()}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Total Assets</p>
            <p className="font-bold text-lg">{fmt(totalAssets)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Savings Goals</p>
            <p className="font-bold text-lg">{fmt(totalSavings)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Total Debts</p>
            <p className="font-bold text-lg">{fmt(totalDebts)}</p>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => { setPeriod(p.key); load(p.key); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === p.key
                ? 'bg-[#1B5E20] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Breakdown card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-[#1B5E20] mb-4">Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="text-gray-600">Assets</span>
            </div>
            <span className="font-semibold">{fmt(totalAssets)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-gray-600">Savings Goals</span>
            </div>
            <span className="font-semibold">{fmt(totalSavings)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="text-gray-600">Debts</span>
            </div>
            <span className="font-semibold">{fmt(totalDebts)}</span>
          </div>
          <hr />
          <div className="flex justify-between items-center">
            <span className="font-bold">Net Worth</span>
            <span className={`font-bold text-lg ${currentNetWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(currentNetWorth)}</span>
          </div>
        </div>
        {/* Composition bar */}
        {(totalAssets + totalSavings + totalDebts) > 0 && (
          <div className="h-2 rounded-full overflow-hidden flex mt-4">
            {totalAssets > 0 && <div className="bg-green-500" style={{ width: `${(totalAssets / (totalAssets + totalSavings + totalDebts)) * 100}%` }} />}
            {totalSavings > 0 && <div className="bg-blue-500" style={{ width: `${(totalSavings / (totalAssets + totalSavings + totalDebts)) * 100}%` }} />}
            {totalDebts > 0 && <div className="bg-red-500" style={{ width: `${(totalDebts / (totalAssets + totalSavings + totalDebts)) * 100}%` }} />}
          </div>
        )}
      </div>

      {/* History table */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-[#1B5E20]">Snapshot History</h2>
            <p className="text-xs text-gray-500 mt-1">A snapshot is recorded each time you visit this page</p>
          </div>
          <div className="divide-y">
            {history.map((snap, i) => {
              const prevSnap = history[i + 1];
              const delta = prevSnap ? snap.netWorth - prevSnap.netWorth : null;
              const deltaPos = delta !== null && delta >= 0;
              return (
                <div key={snap.date} className="px-6 py-4 flex justify-between items-center">
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
