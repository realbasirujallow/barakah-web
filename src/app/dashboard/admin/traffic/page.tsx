'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';

interface BreakdownRow {
  label: string;
  sessions: number;
  signups: number;
  paid: number;
  sessionToSignupRate: number;
  sessionToPaidRate: number;
  signupToPaidRate: number;
}

interface RecentJourney {
  userId: number;
  sessionId: string;
  channel: string;
  landingPath: string;
  signupAt: number;
  paidAt?: number | null;
  deviceType?: string | null;
  browserName?: string | null;
  countryCode?: string | null;
  pageSequence: string[];
}

interface TrafficResponse {
  windowStartMs: number;
  windowEndMs: number;
  overview: {
    sessions: number;
    visitors: number;
    pageViews: number;
    signups: number;
    trials: number;
    paid: number;
    sessionToSignupRate: number;
    signupToPaidRate: number;
  };
  sources: BreakdownRow[];
  landingPages: BreakdownRow[];
  devices: BreakdownRow[];
  recentJourneys: RecentJourney[];
}

const WINDOW_OPTIONS = [7, 30, 90, 180, 365] as const;

function pct(n: number) {
  if (!Number.isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}

function fmtDate(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

function fmtDateTime(ms?: number | null) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString();
}

function BreakdownTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: BreakdownRow[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3 font-semibold">Label</th>
              <th className="text-right p-3 font-semibold">Sessions</th>
              <th className="text-right p-3 font-semibold">Signups</th>
              <th className="text-right p-3 font-semibold">Paid</th>
              <th className="text-right p-3 font-semibold">Visit → Signup</th>
              <th className="text-right p-3 font-semibold">Signup → Paid</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="p-3 font-mono text-xs">{row.label}</td>
                <td className="p-3 text-right">{row.sessions}</td>
                <td className="p-3 text-right">{row.signups}</td>
                <td className="p-3 text-right">{row.paid}</td>
                <td className="p-3 text-right">{pct(row.sessionToSignupRate)}</td>
                <td className="p-3 text-right">{pct(row.signupToPaidRate)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={6}>
                  No data yet in this window.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminTrafficPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number>(30);
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');
  const [data, setData] = useState<TrafficResponse | null>(null);
  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

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
      const res = await api.getAdminTraffic(days, sinceMs, untilMs) as TrafficResponse;
      setData(res);
    } catch (err) {
      logError(err, { context: 'Failed to load admin traffic' });
      toast('Failed to load traffic analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [days, since, until, isAdmin, isAuthLoading, toast, user]);

  useEffect(() => {
    void reload();
  }, [reload]);

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
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-primary">Traffic & Conversion Journeys</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-3xl">
            First-party anonymous traffic capture for the public Barakah site. Sessions are stitched to signup, trial, and paid milestones using the same visitor/session IDs sent at signup.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Quick window</label>
              <div className="flex gap-1">
                {WINDOW_OPTIONS.map((d) => (
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
                onChange={(e) => setSince(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">until</label>
              <input
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
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
            Loading traffic analytics…
          </div>
        )}

        {!loading && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Window</p>
                <p className="text-sm mt-1 font-medium text-primary">
                  {fmtDate(data.windowStartMs)} → {fmtDate(data.windowEndMs)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Sessions</p>
                <p className="text-2xl font-bold text-primary mt-1">{data.overview.sessions}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Visitors</p>
                <p className="text-2xl font-bold text-primary mt-1">{data.overview.visitors}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Signups</p>
                <p className="text-2xl font-bold text-primary mt-1">{data.overview.signups}</p>
                <p className="text-xs text-gray-500">{pct(data.overview.sessionToSignupRate)} visit → signup</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Trials</p>
                <p className="text-2xl font-bold text-primary mt-1">{data.overview.trials}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase">Paid</p>
                <p className="text-2xl font-bold text-primary mt-1">{data.overview.paid}</p>
                <p className="text-xs text-gray-500">{pct(data.overview.signupToPaidRate)} signup → paid</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BreakdownTable
                title="Sources"
                subtitle="Sessions first seen in this window, grouped by source/channel."
                rows={data.sources}
              />
              <BreakdownTable
                title="Landing Pages"
                subtitle="Which public pages are attracting visits and eventually producing signups."
                rows={data.landingPages}
              />
            </div>

            <BreakdownTable
              title="Devices"
              subtitle="Device mix for the same first-party session window."
              rows={data.devices}
            />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-primary">Recent Signup Journeys</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Latest attributed signup sessions in the selected window, including the page sequence captured before signup.
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {data.recentJourneys.length === 0 && (
                  <div className="p-6 text-center text-gray-500">No attributed signup journeys yet.</div>
                )}
                {data.recentJourneys.map((journey) => (
                  <div key={`${journey.userId}-${journey.signupAt}`} className="p-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                          {journey.channel}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {journey.landingPath}
                        </span>
                        {journey.deviceType && (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {journey.deviceType}
                          </span>
                        )}
                        {journey.browserName && (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {journey.browserName}
                          </span>
                        )}
                        {journey.countryCode && (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {journey.countryCode}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        User <span className="font-semibold text-primary">#{journey.userId}</span> signed up {fmtDateTime(journey.signupAt)}
                        {journey.paidAt ? (
                          <span className="text-green-700"> and paid {fmtDateTime(journey.paidAt)}</span>
                        ) : (
                          <span className="text-gray-500"> and has not paid yet</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {journey.pageSequence.map((path) => (
                          <span
                            key={`${journey.userId}-${journey.sessionId}-${path}`}
                            className="text-xs font-mono px-2 py-1 rounded-md bg-[#F8F5EB] text-gray-700"
                          >
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
