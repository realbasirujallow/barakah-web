'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';

type FlippedSymbol = {
  symbol: string;
  oldHalal: boolean;
  newHalal: boolean;
  usersAffected: number;
  // 2026-05-18 release-polish: backend now includes the actual notified
  // user IDs (capped at 50 per flip) so admin can correlate "user reported
  // X" with the exact symbol flip that emailed them.
  userIds?: number[];
  userIdsTruncated?: boolean;
  reason?: string;
};

type Run = {
  id: number;
  startedAt: number;
  finishedAt: number | null;
  status: 'running' | 'succeeded' | 'failed' | 'skipped' | 'no_runs';
  symbolsChecked: number;
  statusChanges: number;
  usersNotified: number;
  failureReason: string | null;
  flippedSymbols: FlippedSymbol[];
};

type Response = {
  lastSucceededAt: number | null;
  lastSucceededFlips: number;
  lastSucceededUsersNotified: number;
  currentStatus: Run['status'];
  runs: Run[];
};

const fmtDateTime = (ms: number | null) => {
  if (!ms) return '—';
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fmtAge = (ms: number | null) => {
  if (!ms) return 'never';
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const statusBadge = (status: Run['status']) => {
  const map: Record<Run['status'], { bg: string; text: string; label: string }> = {
    succeeded: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Succeeded' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: '🚨 Failed' },
    skipped: { bg: 'bg-amber-100', text: 'text-amber-800', label: '⚠️ Skipped' },
    running: { bg: 'bg-blue-100', text: 'text-blue-800', label: '⏳ Running' },
    no_runs: { bg: 'bg-gray-100', text: 'text-gray-700', label: '— No runs yet' },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  );
};

export default function AdminHalalScreeningPage() {
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 2026-05-18 release-polish: data-freshness timestamp + manual trigger state
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);
  // Tick every 15s so the "X seconds ago" caption stays live without a refetch.
  const [, setNowTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNowTick(n => n + 1), 15000);
    return () => clearInterval(id);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.getAdminHalalScreening();
      if (r?.error === 'Forbidden') {
        setForbidden(true);
      } else if (r?.error) {
        setError(String(r.error));
      } else {
        setData(r as Response);
        setFetchedAt(Date.now());
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  const trigger = useCallback(async () => {
    if (!confirm('Run halal-screening scan now? This takes 15-60 seconds and writes to FMP API.')) return;
    setTriggering(true);
    setTriggerResult(null);
    try {
      const r = await api.triggerAdminHalalScreening();
      if (r?.error) {
        setTriggerResult(`Trigger failed: ${String(r.error)}`);
      } else {
        const checks = (r as { symbolsChecked?: number })?.symbolsChecked ?? 0;
        const flips = (r as { statusChanges?: number })?.statusChanges ?? 0;
        const users = (r as { usersNotified?: number })?.usersNotified ?? 0;
        setTriggerResult(`✓ Scan complete: ${checks} symbols checked, ${flips} flips, ${users} users notified.`);
        await load();
      }
    } catch (e: unknown) {
      setTriggerResult(`Trigger error: ${e instanceof Error ? e.message : 'unknown'}`);
    } finally {
      setTriggering(false);
    }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  if (forbidden) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-gray-700">Admin access required.</p>
        <Link href="/dashboard" className="text-primary underline">← Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/admin" className="text-sm text-primary hover:underline">← Admin</Link>
          <h1 className="text-2xl font-bold text-primary mt-1">Halal-screening monitor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daily AAOIFI re-screen of every distinct stock symbol present in <code className="bg-gray-100 px-1 rounded">investment_holdings</code>.
            Religious-trust observability — verify the scan ran and that users with newly-haram holdings were notified.
          </p>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 max-w-3xl">
            <strong>Coverage note:</strong> the scan reads from per-position <code className="bg-amber-100 px-1 rounded">InvestmentHolding</code> rows.
            Users who only have aggregate brokerage-account balances on their <em>Assets</em> page (no
            per-symbol detail) are <strong>not</strong> covered. If &quot;Symbols&quot; reads 0 across recent runs,
            it most likely means no users have linked per-position investment data yet — not that
            the scan is broken.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={trigger}
            disabled={triggering || loading}
            className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            title="Trigger a halal-screen run now without waiting for the 6 AM UTC cron. Takes 15-60s."
          >
            {triggering ? '⏳ Running scan…' : '▶ Run scan now'}
          </button>
          <button
            type="button"
            onClick={load}
            disabled={loading || triggering}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Manual-trigger result banner */}
      {triggerResult && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${
          triggerResult.startsWith('✓')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {triggerResult}
        </div>
      )}

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {data && (
        <>
          {/* Status summary card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Most recent run</p>
                <div className="mt-1.5 flex items-center gap-2">{statusBadge(data.currentStatus)}</div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Last successful scan</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">
                  {fmtAge(data.lastSucceededAt)}
                </p>
                <p className="text-xs text-gray-400">{fmtDateTime(data.lastSucceededAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Last-scan status changes</p>
                <p className="mt-1.5 text-sm font-medium text-gray-900">
                  {data.lastSucceededFlips} stock{data.lastSucceededFlips === 1 ? '' : 's'} flipped
                </p>
                <p className="text-xs text-gray-400">
                  {data.lastSucceededUsersNotified} user{data.lastSucceededUsersNotified === 1 ? '' : 's'} notified
                </p>
              </div>
            </div>

            {data.lastSucceededAt && Date.now() - data.lastSucceededAt > 36 * 60 * 60 * 1000 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                ⚠️ Last successful scan was over 36 hours ago. Daily scheduler may be stuck — check
                Railway logs for <code className="bg-amber-100 px-1 rounded">HalalScreeningScheduler</code>.
              </div>
            )}
            {data.currentStatus === 'skipped' && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                ⚠️ Last run was skipped. Check that <code className="bg-amber-100 px-1 rounded">FMP_API_KEY</code>{' '}
                is set on Railway.
              </div>
            )}
            {data.currentStatus === 'failed' && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                🚨 Last run failed: {data.runs[0]?.failureReason || 'see logs'}
              </div>
            )}
          </div>

          {/* 2026-05-18 release-polish: data-freshness signal — admin can
              tell at a glance whether they're looking at fresh data or a
              cached snapshot. Re-ticks via setNowTick every 15s. */}
          {fetchedAt && (
            <p className="text-xs text-gray-400 mb-3">
              Data fetched {fmtAge(fetchedAt)} ({fmtDateTime(fetchedAt)}) — click ↻ Refresh to reload.
            </p>
          )}

          {/* Run history */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-primary">Last 30 runs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 text-xs uppercase">
                    <th className="px-4 py-2">Started</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Symbols</th>
                    <th className="px-4 py-2 text-right">Flips</th>
                    <th className="px-4 py-2 text-right">Users notified</th>
                    <th className="px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.runs.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">No runs yet.</td></tr>
                  )}
                  {data.runs.map(r => (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="px-4 py-2.5 text-gray-700">{fmtDateTime(r.startedAt)}</td>
                      <td className="px-4 py-2.5">{statusBadge(r.status)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{r.symbolsChecked}</td>
                      <td className="px-4 py-2.5 text-right">
                        {r.statusChanges > 0
                          ? <span className="font-semibold text-amber-700">{r.statusChanges}</span>
                          : <span className="text-gray-400">0</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-700">{r.usersNotified}</td>
                      <td className="px-4 py-2.5">
                        {r.failureReason && <span className="text-red-700 text-xs">{r.failureReason}</span>}
                        {r.flippedSymbols.length > 0 && (
                          <details>
                            <summary className="cursor-pointer text-primary text-xs">
                              {r.flippedSymbols.length} flip{r.flippedSymbols.length === 1 ? '' : 's'}
                            </summary>
                            <ul className="mt-1.5 space-y-2 text-xs text-gray-700">
                              {r.flippedSymbols.map(f => (
                                <li key={f.symbol} className="border-l-2 border-gray-200 pl-2">
                                  <strong>{f.symbol}</strong>:{' '}
                                  {f.oldHalal ? 'halal' : 'haram'} → {f.newHalal ? 'halal' : 'haram'}
                                  {' · '}
                                  {f.usersAffected} user{f.usersAffected === 1 ? '' : 's'}
                                  {f.reason && <span className="text-gray-500"> · {f.reason}</span>}
                                  {/* 2026-05-18 release-polish: notified user IDs
                                      so admin can correlate user reports with the
                                      exact flip that emailed them. Each ID links
                                      to the admin Users tab with focusUser= so
                                      one click opens the user detail modal. */}
                                  {f.userIds && f.userIds.length > 0 && (
                                    <div className="mt-1 text-[11px] text-gray-500">
                                      Notified:{' '}
                                      {f.userIds.map((uid, i) => (
                                        <span key={uid}>
                                          <Link
                                            href={`/dashboard/admin?focusUser=${uid}`}
                                            className="text-primary hover:underline"
                                            title={`Open user ${uid} detail`}
                                          >
                                            {uid}
                                          </Link>
                                          {i < f.userIds!.length - 1 ? ', ' : ''}
                                        </span>
                                      ))}
                                      {f.userIdsTruncated && (
                                        <span className="text-gray-400 italic">
                                          {' '}(+{f.usersAffected - f.userIds.length} more — capped at 50)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
