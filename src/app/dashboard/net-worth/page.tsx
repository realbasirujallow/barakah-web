'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Snapshot {
  id?: number;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  zakatableWealth?: number;
  zakatDue?: number;
}

export default function NetWorthPage() {
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [current, setCurrent] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [snapping, setSnapping] = useState(false);
  const [error, setError] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const load = () => {
    setLoading(true);
    setError('');
    api.getNetWorthHistory()
      .then((d: Snapshot[]) => {
        const sorted = [...(d || [])].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setHistory(sorted);
        setCurrent(sorted[0] || null);
      })
      .catch(() => setError('Could not load net worth history.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const takeSnapshot = async () => {
    setSnapping(true);
    try {
      await api.takeNetWorthSnapshot();
      load();
    } catch {
      setError('Failed to take snapshot. Make sure you have assets tracked.');
    }
    setSnapping(false);
  };

  // Calculate change from previous snapshot
  const prev = history[1];
  const change = current && prev ? current.netWorth - prev.netWorth : null;
  const changePositive = change !== null && change >= 0;

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

      <p className="text-sm text-gray-500 mb-6">
        Snapshots capture your current assets and liabilities from the Assets page. Take one regularly to track your wealth over time.
      </p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Current snapshot banner */}
      {current ? (
        <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
          <p className="text-green-100 text-sm">Current Net Worth</p>
          <p className="text-4xl font-bold mb-1">{fmt(current.netWorth)}</p>
          {change !== null && (
            <p className={`text-sm ${changePositive ? 'text-green-200' : 'text-red-300'}`}>
              {changePositive ? '▲' : '▼'} {fmt(Math.abs(change))} since last snapshot
            </p>
          )}
          <p className="text-green-200 text-xs mt-1">As of {formatDate(current.date)}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-green-100 text-xs">Total Assets</p>
              <p className="font-bold text-lg">{fmt(current.totalAssets)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-green-100 text-xs">Total Liabilities</p>
              <p className="font-bold text-lg">{fmt(current.totalLiabilities)}</p>
            </div>
            {current.zakatableWealth !== undefined && (
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-green-100 text-xs">Zakatable Wealth</p>
                <p className="font-bold text-lg">{fmt(current.zakatableWealth)}</p>
              </div>
            )}
            {current.zakatDue !== undefined && (
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-green-100 text-xs">Zakat Due</p>
                <p className="font-bold text-lg">{fmt(current.zakatDue)}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center mb-6 shadow-sm">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-gray-500 mb-4">No snapshots yet. Take your first snapshot to start tracking.</p>
          <button
            onClick={takeSnapshot}
            disabled={snapping}
            className="bg-[#1B5E20] text-white px-6 py-2 rounded-lg hover:bg-[#2E7D32] font-medium disabled:opacity-50"
          >
            {snapping ? 'Calculating...' : 'Take First Snapshot'}
          </button>
        </div>
      )}

      {/* History table */}
      {history.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-[#1B5E20]">History</h2>
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
                      Assets {fmt(snap.totalAssets)} · Liabilities {fmt(snap.totalLiabilities)}
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
