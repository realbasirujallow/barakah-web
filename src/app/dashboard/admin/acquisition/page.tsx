'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';

/**
 * Acquisition-channel breakdown + retargeting cohort puller.
 *
 * Data source: GET /admin/acquisition and /admin/acquisition/cohort.
 * Backend groups the SIGNUP lifecycle events in the selected window by
 * the `channel` tag written at signup time (derived from UTM / referral /
 * Referer heuristics in AuthController#deriveAcquisitionChannel), then
 * joins to `first_upgrade_completed` so the "which channels pay off?"
 * question is a 1-column lookup rather than a 6-join query.
 *
 * Window controls: `days` is a rolling window; `since`/`until` let the
 * admin pin a historical cohort (e.g. February 2026) for retargeting.
 */

interface ChannelRow {
  channel: string;
  signups: number;
  upgrades: number;
  upgradeRate: number;
}

interface AcquisitionResponse {
  windowStartMs: number;
  windowEndMs: number;
  windowDays: number;
  channels: ChannelRow[];
  totalSignups: number;
  totalUpgrades: number;
  overallUpgradeRate: number;
}

interface CohortResponse {
  channel: string;
  windowStartMs: number;
  windowEndMs: number;
  limit: number;
  userIds: number[];
  count: number;
}

const WINDOW_OPTIONS = [7, 30, 90, 180, 365] as const;

function pct(n: number) {
  if (!Number.isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}

function formatDate(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

export default function AcquisitionPage() {
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AcquisitionResponse | null>(null);
  const [days, setDays] = useState<number>(30);
  const [since, setSince] = useState<string>('');
  const [until, setUntil] = useState<string>('');
  const [cohort, setCohort] = useState<CohortResponse | null>(null);
  const [cohortLoading, setCohortLoading] = useState<string | null>(null);
  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  // Frontend admin-role guard — mirrors funnel/growth page pattern.
  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  const reload = useCallback(async () => {
    if (isAuthLoading || !user || !isAdmin) return;
    setLoading(true);
    try {
      const sinceMs = since ? new Date(since).getTime() : undefined;
      const untilMs = until ? new Date(until).getTime() : undefined;
      const res = await api.getAdminAcquisition(days, sinceMs, untilMs) as AcquisitionResponse;
      setData(res);
    } catch (err) {
      logError(err, { context: 'Failed to load acquisition breakdown' });
      toast('Failed to load acquisition data. Admin access required?', 'error');
    } finally {
      setLoading(false);
    }
  }, [days, since, until, isAdmin, isAuthLoading, toast, user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const pullCohort = async (channel: string) => {
    setCohortLoading(channel);
    setCohort(null);
    try {
      const sinceMs = since ? new Date(since).getTime() : undefined;
      const untilMs = until ? new Date(until).getTime() : undefined;
      const res = await api.getAdminAcquisitionCohort(channel, days, sinceMs, untilMs) as CohortResponse;
      setCohort(res);
    } catch (err) {
      logError(err, { context: 'Failed to pull acquisition cohort' });
      toast('Failed to pull cohort', 'error');
    } finally {
      setCohortLoading(null);
    }
  };

  const copyCohortCsv = () => {
    if (!cohort) return;
    const csv = cohort.userIds.join(',');
    void navigator.clipboard.writeText(csv);
    toast(`Copied ${cohort.userIds.length} user IDs`, 'success');
  };

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-4"
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Acquisition & Retargeting</h1>
          <p className="text-sm text-gray-600 mt-1">
            Signups grouped by the channel that drove them (UTM tags + referral codes + Referer heuristics). Click any row to pull the user-ID cohort for retargeting.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Quick window</label>
              <div className="flex gap-1">
                {WINDOW_OPTIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setDays(d); setSince(''); setUntil(''); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      days === d && !since && !until
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white text-primary border border-primary hover:bg-green-50'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Or pin window — since</label>
              <input
                type="date"
                value={since}
                onChange={e => setSince(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">until</label>
              <input
                type="date"
                value={until}
                onChange={e => setUntil(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => void reload()}
              className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
            >
              Apply
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-600 shadow-sm">
            Loading acquisition…
          </div>
        )}

        {!loading && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Window</p>
                <p className="text-sm mt-1 font-medium text-primary">
                  {formatDate(data.windowStartMs)} → {formatDate(data.windowEndMs)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Total signups</p>
                <p className="text-2xl font-bold text-primary mt-1">{data.totalSignups}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Overall paid-conversion</p>
                <p className="text-2xl font-bold text-primary mt-1">{pct(data.overallUpgradeRate)}</p>
                <p className="text-xs text-gray-500">{data.totalUpgrades} upgrades</p>
              </div>
            </div>

            {data.channels.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-600 shadow-sm">
                No signups in this window. Signup UTM capture landed 2026-04-24 — rows will start populating as new users sign up from tagged links.
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="text-left p-3 font-semibold">Channel</th>
                      <th className="text-right p-3 font-semibold">Signups</th>
                      <th className="text-right p-3 font-semibold">Upgrades</th>
                      <th className="text-right p-3 font-semibold">Paid rate</th>
                      <th className="text-right p-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.channels.map(row => (
                      <tr key={row.channel} className="border-t border-gray-100">
                        <td className="p-3 font-mono text-xs">{row.channel}</td>
                        <td className="p-3 text-right">{row.signups}</td>
                        <td className="p-3 text-right">{row.upgrades}</td>
                        <td className="p-3 text-right">{pct(row.upgradeRate)}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => void pullCohort(row.channel)}
                            disabled={cohortLoading === row.channel}
                            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                          >
                            {cohortLoading === row.channel ? '…' : 'Pull cohort'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {cohort && (
          <div className="bg-white rounded-xl p-4 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-primary">
                  Cohort: <span className="font-mono text-sm">{cohort.channel}</span>
                </h2>
                <p className="text-xs text-gray-500">
                  {cohort.count} users (capped at {cohort.limit}) · {formatDate(cohort.windowStartMs)} → {formatDate(cohort.windowEndMs)}
                </p>
              </div>
              <button
                type="button"
                onClick={copyCohortCsv}
                className="px-3 py-1.5 text-sm bg-white border border-primary text-primary rounded-lg font-medium hover:bg-green-50"
              >
                Copy CSV
              </button>
            </div>
            <textarea
              readOnly
              value={cohort.userIds.join(',')}
              className="w-full h-24 border border-gray-200 rounded-lg p-2 text-xs font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}
