'use client';

/**
 * Weekly Scorecard — one URL, tracked forever, refreshed once a week.
 *
 * Purpose (per the overnight growth plan): the founder's Monday-morning
 * 10-minute view. Every number on this page is the source-of-truth signal
 * for one specific decision:
 *
 *   ARR / MRR            → are we on the $1M ARR glide path?
 *   Active paid          → cohort we're retaining
 *   New signups (wk)     → top-of-funnel health
 *   Trial→paid rate      → paywall + trial-end copy working?
 *   Funnel drop-offs     → where users die between signup and paid
 *   Activation rates     → linked bank / calculated zakat / demo loaded
 *   Annual plan share    → LTV stability
 *   Family plan share    → ARPU upside
 *   Churn (30d)          → retention health
 *
 * External dashboards (GA4 + Stripe + RevenueCat + GSC) that can't be
 * pulled server-side are deep-linked instead — one click to the live
 * dashboard, not a stale snapshot embedded in our UI.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';
import { useCurrency } from '../../../../lib/useCurrency';
import type { Overview } from '../../../../components/admin/adminTypes';
import type { GrowthResponse } from '../../../../components/admin/GrowthSnapshot';

interface FunnelResponse {
  windowDays: number;
  stages: { name: string; label: string; count: number; dropFromPrev?: number }[];
  conversionRates: {
    signupToActivated: number;
    activatedToPaid: number;
    signupToPaid: number;
  };
  topPaywallEndpoints: { endpoint: string; count: number }[];
}

interface DropoffEvent {
  eventType: string;
  source: string | null;
  createdAt: number;
}
interface DropoffTimeline {
  userId: number;
  emailHash: string;
  signupAt: number | null;
  events: DropoffEvent[];
}
interface DropoffResponse {
  windowDays: number;
  cohortSize: number;
  lastEventHistogram: { eventType: string; count: number }[];
  sampledTimelines: DropoffTimeline[];
}

export default function ScorecardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { fmt } = useCurrency();

  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [funnel, setFunnel] = useState<FunnelResponse | null>(null);
  const [growth, setGrowth] = useState<GrowthResponse | null>(null);
  const [dropoff, setDropoff] = useState<DropoffResponse | null>(null);
  const [expandedTimelineUserId, setExpandedTimelineUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, f, g, d] = await Promise.all([
        api.getAdminOverview() as Promise<Overview>,
        api.getAdminFunnel(30) as Promise<FunnelResponse>,
        api.getAdminGrowth() as Promise<GrowthResponse>,
        api.getAdminDropoffAnalysis(30) as Promise<DropoffResponse>,
      ]);
      setOverview(o);
      setFunnel(f);
      setGrowth(g);
      setDropoff(d);
    } catch (err) {
      logError(err, { context: 'ScorecardPage.load' });
      toast('Failed to load scorecard data — admin access required?', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthLoading || !user || !isAdmin) return;
    load();
  }, [isAdmin, isAuthLoading, user, load]);

  const target = 1_000_000; // $1M ARR goal
  const arrProgress = overview?.arr ? Math.min(100, (overview.arr / target) * 100) : 0;

  // Backend /admin/growth returns `trialConversion: { granted30d, upgraded30d,
  // rate }` — we display rate directly. If the weekly-cadence scorecard ever
  // needs a WoW delta on ARR, add a new endpoint that returns the trailing
  // 8 weekly ARR snapshots (today's /growth is a point-in-time).
  const trialToPaidRate = useMemo(() => {
    if (!growth?.trialConversion) return null;
    const { rate } = growth.trialConversion;
    if (typeof rate !== 'number') return null;
    return rate * 100;
  }, [growth]);

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard/admin" className="text-sm text-[#1B5E20] hover:underline">
          ← Admin
        </Link>

        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between mt-3 mb-6 gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#1B5E20]">📈 Weekly Scorecard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monday-morning 10-minute view. The numbers here are the source-of-truth
              signals for the $1M ARR glide path.
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="text-sm bg-white border border-[#1B5E20] text-[#1B5E20] px-4 py-2 rounded-lg hover:bg-green-50 disabled:opacity-50"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* ── Top strip: ARR glide path ────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Annual Run Rate</p>
                  <p className="text-4xl font-bold text-[#1B5E20]">
                    {fmt(overview?.arr ?? 0)}
                  </p>
                  {growth?.totals?.mrrUsd && (
                    <p className="text-xs text-gray-500 mt-1">
                      MRR {fmt(growth.totals.mrrUsd)} ·{' '}
                      {growth.activeUsers?.wau ?? 0} WAU ·{' '}
                      {growth.activeUsers?.mau ?? 0} MAU
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Goal: $1M ARR</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {arrProgress.toFixed(1)}% there
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className="bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] rounded-full h-3 transition-all"
                  style={{ width: `${Math.max(1, arrProgress)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                At blended ~$105/yr per paid account, $1M ARR ≈ 9,500 paid accounts.
                Today:{' '}
                <strong>{(overview?.activePlus ?? 0) + (overview?.activeFamily ?? 0)}</strong>{' '}
                truly paid accounts (Stripe + RevenueCat only).
              </p>
            </section>

            {/* ── Four core KPIs ──────────────────────────────────────── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Kpi
                label="Paid MRR"
                value={overview?.mrr != null ? fmt(overview.mrr) : '—'}
                hint={
                  typeof overview?.phantomMrr === 'number' && overview.phantomMrr > 0
                    ? `Nominal ${fmt(overview.nominalMrr ?? 0)} · phantom ${fmt(overview.phantomMrr)}`
                    : 'Stripe + RevenueCat only'
                }
              />
              <Kpi
                label="Paid Accounts"
                value={((overview?.activePlus ?? 0) + (overview?.activeFamily ?? 0)).toLocaleString()}
                hint={`${overview?.activePlus ?? 0} Plus · ${overview?.activeFamily ?? 0} Family · excludes trials + inherited seats`}
              />
              <Kpi
                label="New Signups (7d)"
                value={overview?.newUsersThisWeek?.toLocaleString() ?? '—'}
                hint={`${overview?.newUsersToday ?? 0} today`}
              />
              <Kpi
                label="Trial→Paid"
                value={trialToPaidRate != null ? `${trialToPaidRate.toFixed(1)}%` : '—'}
                hint="Last 30 days cohort"
              />
            </div>

            {/* ── Funnel snapshot ──────────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-lg font-bold text-[#1B5E20]">
                  Funnel (last 30 days)
                </h2>
                <Link
                  href="/dashboard/admin/funnel"
                  className="text-sm text-[#1B5E20] underline"
                >
                  Full funnel →
                </Link>
              </div>
              {funnel ? (
                <div className="space-y-2">
                  {funnel.stages.map((stage, i) => {
                    const pct = funnel.stages[0].count > 0
                      ? (stage.count / funnel.stages[0].count) * 100
                      : 0;
                    return (
                      <div key={stage.name} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">
                            {i + 1}. {stage.label}
                            {typeof stage.dropFromPrev === 'number' && stage.dropFromPrev > 0 && i > 0 && (
                              <span className="text-red-500 text-xs ml-2">
                                (−{stage.dropFromPrev.toLocaleString()} from previous)
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-[#1B5E20] font-semibold">
                            {stage.count.toLocaleString()} · {pct.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded h-2">
                          <div
                            className="bg-[#1B5E20] rounded h-2 transition-all"
                            style={{ width: `${Math.max(1, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t text-xs text-gray-600">
                    <div>
                      <p className="font-semibold text-[#1B5E20]">
                        {(funnel.conversionRates.signupToActivated * 100).toFixed(1)}%
                      </p>
                      <p>signup → activated</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1B5E20]">
                        {(funnel.conversionRates.activatedToPaid * 100).toFixed(1)}%
                      </p>
                      <p>activated → paid</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1B5E20]">
                        {(funnel.conversionRates.signupToPaid * 100).toFixed(1)}%
                      </p>
                      <p>signup → paid (overall)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No funnel data available.</p>
              )}
            </section>

            {/* ── External data we can't pull ─────────────────────────── */}
            <section className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-amber-900 mb-2">
                External dashboards (open in new tab)
              </h2>
              <p className="text-sm text-amber-800 mb-4">
                Attribution + raw revenue + search performance live on third-party
                systems. Deep-linked here so the weekly review is one URL, not five.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <ExternalLink
                  href="https://analytics.google.com/analytics/web/"
                  title="Google Analytics 4"
                  subtitle="Signup attribution, campaign UTMs, trial_started + first_zakat_calc events"
                />
                <ExternalLink
                  href="https://dashboard.stripe.com/subscriptions"
                  title="Stripe"
                  subtitle="Raw subscription count + MRR + failed payments (dunning health)"
                />
                <ExternalLink
                  href="https://app.revenuecat.com"
                  title="RevenueCat"
                  subtitle="iOS + Android subscription tracking (App Store + Play Store)"
                />
                <ExternalLink
                  href="https://search.google.com/search-console"
                  title="Google Search Console"
                  subtitle="Organic clicks, indexed pages, Core Web Vitals, top queries"
                />
              </div>
            </section>

            {/* ── Quick links to the other admin views ─────────────── */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              <AdminLink href="/dashboard/admin" label="📊 Admin overview" />
              <AdminLink href="/dashboard/admin/funnel" label="🔄 Funnel detail" />
              <AdminLink href="/dashboard/admin/growth" label="📈 Growth detail" />
              <AdminLink href="/dashboard/admin?tab=experiments" label="🧪 Experiments" />
              <AdminLink href="/dashboard/admin?tab=lifecycle" label="📬 Lifecycle campaigns" />
              <AdminLink href="/dashboard/admin?tab=users" label="👥 Users" />
            </section>

            {/* ── Drop-off analyzer ────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex justify-between items-baseline mb-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1B5E20]">
                    Drop-off autopsy — last 30 days
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Users who signed up but did NOT upgrade. Big red bar = this
                    week&apos;s experiment.
                  </p>
                </div>
                {dropoff && (
                  <span className="text-sm text-gray-600">
                    Cohort size: <b className="text-[#1B5E20]">{dropoff.cohortSize}</b>
                  </span>
                )}
              </div>
              {dropoff && dropoff.lastEventHistogram.length > 0 ? (
                <>
                  <div className="space-y-1.5 mb-5">
                    {dropoff.lastEventHistogram.map((row) => {
                      const top = Math.max(...dropoff.lastEventHistogram.map(r => r.count));
                      const pct = (row.count / top) * 100;
                      return (
                        <div key={row.eventType} className="flex items-center gap-3 text-sm">
                          <span className="w-52 truncate text-gray-700">{row.eventType}</span>
                          <div className="flex-1 bg-gray-100 rounded h-5 relative">
                            <div
                              className="bg-red-400 rounded h-5 transition-all flex items-center justify-end pr-2"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            >
                              <span className="text-xs font-mono text-white">{row.count}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Sampled per-user timelines ({dropoff.sampledTimelines.length} shown, newest first)
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Click a row to expand the full lifecycle-event timeline. Goal: read
                      30 of these in &lt;15 min and spot the human pattern the histogram
                      can&apos;t.
                    </p>
                    <div className="space-y-1 text-xs font-mono">
                      {dropoff.sampledTimelines.map((tl) => {
                        const latest = tl.events[0];
                        const expanded = expandedTimelineUserId === tl.userId;
                        return (
                          <div
                            key={tl.userId}
                            className="border border-gray-200 rounded p-2 hover:border-[#1B5E20]"
                          >
                            <button
                              onClick={() => setExpandedTimelineUserId(expanded ? null : tl.userId)}
                              className="w-full flex items-center justify-between text-left"
                            >
                              <span className="text-gray-700">
                                #{tl.userId} · {tl.emailHash}{' '}
                                {tl.signupAt && (
                                  <span className="text-gray-400">
                                    · signup {new Date(tl.signupAt).toISOString().slice(0, 10)}
                                  </span>
                                )}
                              </span>
                              <span className="text-[#1B5E20]">
                                last: {latest?.eventType ?? '—'} {expanded ? '▴' : '▾'}
                              </span>
                            </button>
                            {expanded && (
                              <ol className="mt-2 pl-3 border-l border-gray-200 space-y-0.5 text-gray-600">
                                {tl.events.map((e, i) => (
                                  <li key={i}>
                                    <span className="text-gray-400">
                                      {new Date(e.createdAt).toISOString().slice(0, 19).replace('T', ' ')}
                                    </span>{' '}
                                    <span className="text-[#1B5E20]">{e.eventType}</span>
                                    {e.source && <span className="text-gray-400"> · {e.source}</span>}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  No drop-off data yet. (Cohort may be too small in a fresh environment.)
                </p>
              )}
            </section>

            {/* ── Operator notes ───────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-dashed border-gray-300 p-6">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">
                Monday review checklist
              </h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>ARR delta vs last week — on the 15-20%/mo glide path?</li>
                <li>Trial→Paid rate moved? If below 3%, paywall is broken.</li>
                <li>Funnel drop-offs — biggest red bar is this week&apos;s experiment.</li>
                <li>Annual plan share (check /growth) — is it climbing toward 65%?</li>
                <li>Churn this month — under 6%? If not, halt acquisition spend.</li>
                <li>One customer conversation this week — call a paid subscriber.</li>
              </ol>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-[#1B5E20] mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function ExternalLink({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-amber-200 rounded-xl p-4 hover:border-amber-400 transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
        </div>
        <span className="text-gray-400">↗</span>
      </div>
    </a>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#1B5E20] transition text-sm font-medium text-gray-700"
    >
      {label}
    </Link>
  );
}
