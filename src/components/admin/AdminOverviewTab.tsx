'use client';

/**
 * Admin Overview tab — revenue KPIs, plan distribution, subscription
 * breakdown, support action center, onboarding-trial settings, demographics,
 * feature adoption, monthly signup chart, and recent signups.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. Receives the state it needs as props; all data loading +
 * mutations remain on the parent page so event wiring stays centralized.
 */

import type {
  AdminUser,
  Overview,
  OnboardingTrialSettings,
  UserFilter,
  AdminTab,
  EmailLogStats,
  UserActivityFilter,
  ConversionQueuesResponse,
} from './adminTypes';
import { PLAN_LABELS, SUB_STATUS_LABELS, fmtDateMs, formatCountry, formatLocation } from './adminFormatting';
import AdminJobHealthCard from './AdminJobHealthCard';

export interface AdminOverviewTabProps {
  overview: Overview | null;
  featureUsage: Record<string, number> | null;
  analytics: { growthByMonth: { month: string; signups: number }[] } | null;
  conversionQueues?: ConversionQueuesResponse | null;
  emailLogStats?: EmailLogStats | null;
  onboardingTrial: OnboardingTrialSettings | null;
  setOnboardingTrial: (updater: (prev: OnboardingTrialSettings | null) => OnboardingTrialSettings | null) => void;
  trialSettingsSaving: boolean;
  onSaveOnboardingTrial: () => void | Promise<void>;
  fmtMoney: (n: number) => string;
  setActiveTab: (tab: AdminTab) => void;
  setUserFilter: (f: UserFilter) => void;
  setSearch: (s: string) => void;
  onUsersQueryChange?: (q: { sort?: string; dir?: 'asc' | 'desc'; country?: string; activity?: UserActivityFilter }) => void;
  openUser: (u: AdminUser, listContext?: AdminUser[]) => void;
}

export function AdminOverviewTab({
  overview,
  featureUsage,
  analytics,
  conversionQueues,
  emailLogStats,
  onboardingTrial,
  setOnboardingTrial,
  trialSettingsSaving,
  onSaveOnboardingTrial,
  fmtMoney,
  setActiveTab,
  setUserFilter,
  setSearch,
  onUsersQueryChange,
  openUser,
}: AdminOverviewTabProps) {
  const truePaidAccounts = overview
    ? (overview.activePlus ?? 0) + (overview.activeFamily ?? 0)
    : 0;
  const truePaidConversion = overview && overview.totalUsers > 0
    ? ((truePaidAccounts / overview.totalUsers) * 100).toFixed(1)
    : '0.0';
  const failedEmails = emailLogStats?.totalFailed ?? 0;
  const expiringTrials = overview?.expiringTrials ?? [];
  const recentNoLogin = (overview?.recentSignups ?? [])
    .filter(u => (u.loginCount ?? 0) === 0 || (!u.lastLoginAt && !u.lastSeenAt));
  const queueByKey = (key: string) => conversionQueues?.queues?.find(q => q.key === key);
  const newNoLoginQueue = queueByKey('new_no_login');
  const expiringActiveQueue = queueByKey('trial_expiring_active');
  const expiringInactiveQueue = queueByKey('trial_expiring_inactive');

  const openUsersQueue = (filter: UserFilter = 'all', activity?: UserActivityFilter) => {
    setActiveTab('users');
    setUserFilter(filter);
    setSearch('');
    if (activity && onUsersQueryChange) {
      onUsersQueryChange({ activity, sort: 'createdAt', dir: 'desc' });
    }
  };

  const openConversionQueue = (key: string) => {
    if (key === 'unverified_recent') {
      setActiveTab('unverified');
      setUserFilter('unverified');
      setSearch('');
      return;
    }
    if (key.startsWith('trial_expiring')) {
      setActiveTab('alerts');
      setUserFilter('trialing');
      setSearch('');
      return;
    }
    if (key === 'new_no_login') {
      openUsersQueue('all', 'new_no_login_7d');
      return;
    }
    openUsersQueue('all', 'seen_30d');
  };

  const priorityTone = (priority: string) => {
    if (priority === 'P0') return 'border-red-200 bg-red-50 text-red-900';
    if (priority === 'P1') return 'border-amber-200 bg-amber-50 text-amber-900';
    return 'border-slate-200 bg-slate-50 text-slate-800';
  };

  return (
    <div className="space-y-6">

      {/* ── Revenue KPIs ── */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('lifecycle')}
            title="Open Lifecycle tab"
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white text-left transition hover:shadow-lg hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <p className="text-emerald-200 text-xs font-medium mb-1">Monthly Revenue (MRR)</p>
            <p className="text-3xl font-bold">{fmtMoney(overview.mrr)}</p>
            <p className="text-emerald-200 text-xs mt-1">ARR: {fmtMoney(overview.arr)}</p>
            {/* Surface the phantom-MRR gap so the "true paid" vs "nominal"
                distinction is visible. Hidden when there's no gap (no family
                inheritance / trials counted as active), which is the healthy
                state we want the app to eventually reach. */}
            {typeof overview.phantomMrr === 'number' && overview.phantomMrr > 0 && (
              <p className="text-emerald-200/70 text-[11px] mt-1 leading-tight">
                Nominal {fmtMoney(overview.nominalMrr ?? 0)} · phantom{' '}
                {fmtMoney(overview.phantomMrr)} from{' '}
                {overview.phantomSeats ?? 0} inherited seats
              </p>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('users'); setUserFilter('all'); setSearch(''); }}
            title="Open Users tab"
            className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white text-left transition hover:shadow-lg hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <p className="text-green-200 text-xs font-medium mb-1">Total Users</p>
            <p className="text-3xl font-bold">{overview.totalUsers.toLocaleString()}</p>
            <p
              className="text-green-200 text-xs mt-1"
              title="'Truly paid' = users on a Stripe or RevenueCat plan that has actually charged. Excludes active trials and family-plan inherited seats. So 0.0% with 55 'Active' subs means everyone active is currently on a trial or family-inherited seat — not zero conversion."
            >
              {truePaidConversion}% truly paid
            </p>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('users'); setUserFilter('all'); setSearch(''); }}
            title="Open Users tab"
            className="bg-white rounded-2xl p-5 border text-left transition hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <p className="text-gray-400 text-xs font-medium mb-1">Nominal Access Seats</p>
            <p className="text-3xl font-bold text-gray-800">{overview.paidUsers}</p>
            <p className="text-gray-400 text-xs mt-1">
              {overview.conversionRate}% of users on trial, paid, or inherited access
            </p>
            <p className="text-gray-400 text-[11px] mt-0.5 italic">
              Includes active trials + inherited family seats; not true paid accounts
            </p>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('users'); setUserFilter('all'); setSearch(''); }}
            title="Open Users tab"
            className="bg-white rounded-2xl p-5 border text-left transition hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <p className="text-gray-400 text-xs font-medium mb-1">New Users Today</p>
            <p className="text-3xl font-bold text-gray-800">{overview.newUsersToday}</p>
            <p className="text-gray-400 text-xs mt-1">This week: {overview.newUsersThisWeek} · Month: {overview.newUsersThisMonth}</p>
          </button>
        </div>
      )}

      {overview && (
        <div className="bg-white rounded-2xl p-5 border">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Today Queue</h2>
              <p className="text-xs text-gray-400 mt-1">One place for the founder/support checks that leak trust or revenue.</p>
            </div>
            <button
              type="button"
              onClick={() => { setActiveTab('email-log'); setSearch(''); }}
              className="text-xs font-semibold text-[#1B5E20] hover:underline"
            >
              Email triage
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              {
                label: 'Failed emails',
                value: failedEmails,
                priority: failedEmails > 0 ? 'P0' : 'OK',
                hint: 'Delivery issues blocking verification, resets, or billing',
                action: () => setActiveTab('email-log'),
                tone: failedEmails > 0 ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
              },
              {
                label: 'Unverified users',
                value: overview.unverifiedEmails ?? 0,
                priority: (overview.unverifiedEmails ?? 0) > 0 ? 'P0' : 'OK',
                hint: 'Users who may be blocked from entering the app',
                action: () => { setActiveTab('unverified'); setUserFilter('unverified'); setSearch(''); },
                tone: (overview.unverifiedEmails ?? 0) > 0 ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
              },
              {
                label: 'Trials expiring',
                value: overview.expiringTrialsCount ?? ((expiringActiveQueue?.count ?? 0) + (expiringInactiveQueue?.count ?? 0)),
                priority: (overview.expiringTrialsCount ?? 0) > 0 ? 'P1' : 'OK',
                hint: 'Conversion follow-up before the trial goes cold',
                action: () => setActiveTab('alerts'),
                tone: (overview.expiringTrialsCount ?? 0) > 0 ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
              },
              {
                label: 'Past-due billing',
                value: overview.pastDueCount ?? 0,
                priority: (overview.pastDueCount ?? 0) > 0 ? 'P1' : 'OK',
                hint: 'Revenue at immediate churn risk',
                action: () => openUsersQueue('past_due'),
                tone: (overview.pastDueCount ?? 0) > 0 ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
              },
              {
                label: 'Missing contact info',
                value: overview.usersMissingProfileInfo ?? 0,
                priority: (overview.usersMissingProfileInfo ?? 0) > 0 ? 'P2' : 'OK',
                hint: 'Support reachability is weaker',
                action: () => openUsersQueue('missing_phone'),
                tone: (overview.usersMissingProfileInfo ?? 0) > 0 ? 'border-gray-200 bg-gray-50 text-gray-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
              },
              {
                label: 'New with no login',
                value: newNoLoginQueue?.count ?? recentNoLogin.length,
                priority: (newNoLoginQueue?.count ?? recentNoLogin.length) > 0 ? 'P1' : 'OK',
                hint: 'Fresh signups who may be stuck after account creation',
                action: () => openUsersQueue('all', 'new_no_login_7d'),
                tone: (newNoLoginQueue?.count ?? recentNoLogin.length) > 0 ? 'border-purple-200 bg-purple-50 text-purple-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800',
              },
              {
                label: 'Paid inactive',
                value: 'Find',
                priority: 'P2',
                hint: 'Paying or trial users inactive for 30+ days',
                action: () => openUsersQueue('paying', 'paid_inactive_30d'),
                tone: 'border-slate-200 bg-slate-50 text-slate-700',
              },
              {
                label: 'Refund / offer lookup',
                value: 'Guide',
                priority: 'Ops',
                hint: 'Open the user, confirm platform, then refund or discount',
                action: () => openUsersQueue('paying'),
                tone: 'border-indigo-200 bg-indigo-50 text-indigo-800',
              },
            ].map(item => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`text-left rounded-xl border p-4 transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 ${item.tone}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold opacity-80">{item.label}</span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold">{item.priority}</span>
                </div>
                <p className="text-2xl font-bold mt-2">{item.value}</p>
                <p className="text-xs mt-2 opacity-80 leading-snug">{item.hint}</p>
              </button>
            ))}
          </div>
          {expiringTrials.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fast follow-up</p>
                <button type="button" onClick={() => setActiveTab('alerts')} className="text-xs font-semibold text-[#1B5E20] hover:underline">
                  Open all alerts
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {expiringTrials.slice(0, 3).map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => openUser(u, expiringTrials)}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left hover:bg-white hover:border-[#1B5E20]/30 transition"
                  >
                    <p className="text-sm font-semibold text-gray-800 truncate">{u.name || 'Unnamed user'}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    <p className="text-[11px] text-gray-400 mt-1">Trial follow-up</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {conversionQueues?.queues && conversionQueues.queues.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Conversion Queues</h2>
              <p className="text-xs text-gray-400 mt-1">
                Server-backed worklists for the last {conversionQueues.windowDays} days. Counts are full-DB; samples open the user detail modal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('lifecycle')}
              className="text-xs font-semibold text-[#1B5E20] hover:underline"
            >
              Lifecycle tools
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {conversionQueues.queues.map(queue => (
              <div key={queue.key} className={`rounded-xl border p-4 ${priorityTone(queue.priority)}`}>
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openConversionQueue(queue.key)}
                    className="text-left min-w-0"
                    title="Open the closest matching admin queue"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-bold">{queue.priority}</span>
                      <h3 className="text-sm font-bold truncate">{queue.label}</h3>
                    </div>
                    <p className="text-xs mt-2 opacity-80 leading-snug">{queue.description}</p>
                  </button>
                  <p className="text-3xl font-bold shrink-0">{queue.count.toLocaleString()}</p>
                </div>
                <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs leading-snug">
                  {queue.recommendedAction}
                </p>
                {queue.users.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {queue.users.slice(0, 4).map(u => {
                      const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                      return (
                        <button
                          key={`${queue.key}-${u.id}`}
                          type="button"
                          onClick={() => openUser(u, queue.users)}
                          className="rounded-lg border border-white/70 bg-white/80 px-3 py-2 text-left transition hover:bg-white hover:shadow-sm"
                        >
                          <p className="text-sm font-semibold text-gray-900 truncate">{u.name || 'Unnamed user'}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                            <span className="text-[10px] text-gray-500">{u.lastActivityAt ? `Active ${fmtDateMs(u.lastActivityAt)}` : `Joined ${fmtDateMs(u.createdAt)}`}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Plan Distribution ── */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border">
            <h2 className="font-semibold text-gray-700 mb-4 text-sm">Plan Distribution</h2>
            <div className="space-y-3">
              {[
                { label: 'Free', count: overview.freeUsers, color: 'bg-gray-300', total: overview.totalUsers },
                { label: 'Plus', count: overview.plusUsers, color: 'bg-blue-500', total: overview.totalUsers },
                { label: 'Family', count: overview.familyUsers, color: 'bg-purple-500', total: overview.totalUsers },
              ].map(p => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{p.label}</span>
                    <span className="font-medium text-gray-800">{p.count} ({p.total > 0 ? ((p.count / p.total) * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${p.total > 0 ? (p.count / p.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Status Breakdown */}
          <div className="bg-white rounded-2xl p-5 border">
            <h2 className="font-semibold text-gray-700 mb-4 text-sm">Subscription Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(overview.subscriptionStatus).map(([status, count]) => {
                const info = SUB_STATUS_LABELS[status] ?? { label: status, color: 'bg-gray-100 text-gray-500' };
                return (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>{info.label}</span>
                    <span className="font-bold text-gray-800">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {overview && (
        <div className="bg-white rounded-2xl p-5 border">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-gray-700 text-sm">Support Action Center</h2>
              <p className="text-xs text-gray-400 mt-1">Jump straight to the highest-friction user situations.</p>
            </div>
            <span className="text-xs text-gray-400">Click a card to open the right queue</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              {
                key: 'unverified' as const,
                label: 'Unverified Emails',
                value: overview.unverifiedEmails ?? 0,
                hint: 'Users blocked from logging in',
                color: 'border-amber-200 bg-amber-50 text-amber-800',
              },
              {
                key: 'past_due' as const,
                label: 'Past-Due Billing',
                value: overview.pastDueCount ?? 0,
                hint: 'Subscribers at churn risk',
                color: 'border-red-200 bg-red-50 text-red-800',
              },
              {
                key: 'trialing' as const,
                label: 'Trials Expiring',
                value: overview.expiringTrialsCount ?? 0,
                hint: 'Conversion follow-up needed',
                color: 'border-blue-200 bg-blue-50 text-blue-800',
              },
              {
                key: 'missing_phone' as const,
                label: 'Missing Contact Info',
                value: overview.usersMissingProfileInfo ?? 0,
                hint: 'Support reachability is weaker',
                color: 'border-gray-200 bg-gray-50 text-gray-700',
              },
            ].map(card => (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  setActiveTab(card.key === 'unverified' ? 'unverified' : 'users');
                  setUserFilter(card.key === 'trialing' ? 'trialing' : card.key);
                  setSearch('');
                }}
                className={`text-left rounded-xl border p-4 transition hover:shadow-sm ${card.color}`}
              >
                <p className="text-xs font-medium opacity-80">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
                <p className="text-xs mt-2 opacity-80">{card.hint}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs text-gray-500">
            <div className="rounded-lg bg-gray-50 px-3 py-2 border">Missing phone: <span className="font-semibold text-gray-800">{overview.usersMissingPhone ?? 0}</span></div>
            <div className="rounded-lg bg-gray-50 px-3 py-2 border">Missing location: <span className="font-semibold text-gray-800">{overview.usersMissingLocation ?? 0}</span></div>
            <div className="rounded-lg bg-gray-50 px-3 py-2 border">Total support backlog: <span className="font-semibold text-gray-800">{(overview.unverifiedEmails ?? 0) + (overview.pastDueCount ?? 0) + (overview.expiringTrialsCount ?? 0)}</span></div>
          </div>
        </div>
      )}

      {/* 2026-05-18 — Cross-job failure feed (admin-robustness gap #5).
          Renders nothing for non-admin viewers. */}
      <AdminJobHealthCard />

      {onboardingTrial && (
        <div className="bg-white rounded-2xl p-5 border">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-gray-700 text-sm">New Member Trial</h2>
              <p className="text-xs text-gray-400 mt-1">Control the automatic access every newly verified account receives.</p>
            </div>
            <button
              type="button"
              onClick={onSaveOnboardingTrial}
              disabled={trialSettingsSaving}
              className="px-4 py-2 rounded-lg bg-[#1B5E20] text-white text-sm font-semibold hover:bg-[#2E7D32] disabled:opacity-50"
            >
              {trialSettingsSaving ? 'Saving…' : 'Save Trial Settings'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_0.8fr_1fr] gap-4">
            <label className="rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Enabled</p>
                <p className="text-xs text-gray-500 mt-1">Automatically grant access after email verification.</p>
              </div>
              <input
                type="checkbox"
                checked={onboardingTrial.enabled}
                onChange={e => setOnboardingTrial(prev => prev ? { ...prev, enabled: e.target.checked } : prev)}
                className="h-5 w-5 accent-[#1B5E20]"
              />
            </label>
            <label className="rounded-xl border border-gray-200 px-4 py-3 block">
              <p className="text-sm font-semibold text-gray-900 mb-2">Plan</p>
              <select
                value={onboardingTrial.plan}
                onChange={e => setOnboardingTrial(prev => prev ? { ...prev, plan: e.target.value } : prev)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900"
              >
                <option value="plus">Plus</option>
                <option value="family">Family</option>
              </select>
            </label>
            <label className="rounded-xl border border-gray-200 px-4 py-3 block">
              <p className="text-sm font-semibold text-gray-900 mb-2">Duration</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={onboardingTrial.durationDays}
                  onChange={e => setOnboardingTrial(prev => prev ? {
                    ...prev,
                    durationDays: Math.max(1, Math.min(365, Number(e.target.value) || 1)),
                  } : prev)}
                  className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Current default: {onboardingTrial.enabled ? `${onboardingTrial.plan} for ${onboardingTrial.durationDays} days` : 'disabled'}.
              </p>
            </label>
          </div>
        </div>
      )}

      {/* ── Engagement & Referrals ── */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-400 mb-1">Unverified Emails</p>
            <p className="text-2xl font-bold text-amber-600">{overview.unverifiedEmails}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-400 mb-1">Total Referrals</p>
            <p className="text-2xl font-bold text-blue-600">{overview.totalReferrals}</p>
            <p className="text-xs text-gray-400 mt-1">{overview.usersWithReferrals} referrers</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-400 mb-1">Sadaqah Records</p>
            <p className="text-2xl font-bold text-emerald-600">{overview.totalDonationRecords ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-400 mb-1">Expiring Trials</p>
            <p className="text-2xl font-bold text-red-500">{overview.expiringTrialsCount}</p>
            <p className="text-xs text-gray-400 mt-1">within 7 days</p>
          </div>
        </div>
      )}

      {/* ── User Demographics ── */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {overview.countryDistribution && Object.keys(overview.countryDistribution).length > 0 && (
            <div className="bg-white rounded-2xl p-5 border">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm">Top Countries</h2>
              <div className="space-y-3">
                {Object.entries(overview.countryDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([country, count]) => {
                    const total = Object.values(overview.countryDistribution!).reduce((a, b) => a + b, 0);
                    const pct = (count / total) * 100;
                    return (
                      <div key={country}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{formatCountry(country)}</span>
                          <span className="font-medium text-gray-800">{count} ({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1B5E20] rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {overview.stateDistribution && Object.keys(overview.stateDistribution).length > 0 && (
            <div className="bg-white rounded-2xl p-5 border">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm">Top US States</h2>
              <div className="space-y-3">
                {Object.entries(overview.stateDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([state, count]) => {
                    const total = Object.values(overview.stateDistribution!).reduce((a, b) => a + b, 0);
                    const pct = (count / total) * 100;
                    return (
                      <div key={state}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{formatLocation(state, '')}</span>
                          <span className="font-medium text-gray-800">{count} ({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1B5E20] rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Feature Usage ── */}
      {featureUsage && (
        <div className="bg-white rounded-2xl p-5 border">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Feature Adoption (All Users)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(featureUsage).map(([key, count]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 capitalize mb-1">{key.replace('total', '').replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-xl font-bold text-gray-800">{count.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Monthly Signups Chart ── */}
      {analytics && analytics.growthByMonth.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Monthly Signups (Last 12 months)</h2>
          <div className="flex items-end gap-1 h-28">
            {analytics.growthByMonth.map((m) => {
              const max = Math.max(...analytics.growthByMonth.map(x => x.signups), 1);
              const pct = (m.signups / max) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1" title={`${m.month}: ${m.signups} signups`}>
                  <span className="text-[9px] text-gray-500 font-medium">{m.signups}</span>
                  <div className="w-full bg-[#1B5E20] rounded-t" style={{ height: `${Math.max(pct, 4)}%`, minHeight: 4 }} />
                  <p className="text-[9px] text-gray-400">{m.month.slice(5)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Recent Signups ── */}
      {overview && overview.recentSignups && overview.recentSignups.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm">Recent Signups</h2>
          <div className="space-y-2">
            {overview.recentSignups.map(u => {
              const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
              return (
                <div key={u.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onClick={() => { setActiveTab('users'); openUser(u, overview?.recentSignups ?? []); }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1B5E20] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {(u.name || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.name || 'Unnamed'}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                    <span className="text-xs text-gray-400">{fmtDateMs(u.createdAt)}</span>
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
