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

import type { AdminUser, Overview, OnboardingTrialSettings, UserFilter, AdminTab } from './adminTypes';
import { PLAN_LABELS, SUB_STATUS_LABELS, fmtDateMs } from './adminFormatting';

export interface AdminOverviewTabProps {
  overview: Overview | null;
  featureUsage: Record<string, number> | null;
  analytics: { growthByMonth: { month: string; signups: number }[] } | null;
  onboardingTrial: OnboardingTrialSettings | null;
  setOnboardingTrial: (updater: (prev: OnboardingTrialSettings | null) => OnboardingTrialSettings | null) => void;
  trialSettingsSaving: boolean;
  onSaveOnboardingTrial: () => void | Promise<void>;
  fmtMoney: (n: number) => string;
  setActiveTab: (tab: AdminTab) => void;
  setUserFilter: (f: UserFilter) => void;
  setSearch: (s: string) => void;
  openUser: (u: AdminUser) => void;
}

export function AdminOverviewTab({
  overview,
  featureUsage,
  analytics,
  onboardingTrial,
  setOnboardingTrial,
  trialSettingsSaving,
  onSaveOnboardingTrial,
  fmtMoney,
  setActiveTab,
  setUserFilter,
  setSearch,
  openUser,
}: AdminOverviewTabProps) {
  return (
    <div className="space-y-6">

      {/* ── Revenue KPIs ── */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white">
            <p className="text-emerald-200 text-xs font-medium mb-1">Monthly Revenue (MRR)</p>
            <p className="text-3xl font-bold">{fmtMoney(overview.mrr)}</p>
            <p className="text-emerald-200 text-xs mt-1">ARR: {fmtMoney(overview.arr)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white">
            <p className="text-green-200 text-xs font-medium mb-1">Total Users</p>
            <p className="text-3xl font-bold">{overview.totalUsers.toLocaleString()}</p>
            <p className="text-green-200 text-xs mt-1">{overview.conversionRate}% paid conversion</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border">
            <p className="text-gray-400 text-xs font-medium mb-1">Paying Subscribers</p>
            <p className="text-3xl font-bold text-gray-800">{overview.paidUsers}</p>
            <p className="text-gray-400 text-xs mt-1">{overview.subscribedPlus} Plus · {overview.subscribedFamily} Family</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border">
            <p className="text-gray-400 text-xs font-medium mb-1">New Users Today</p>
            <p className="text-3xl font-bold text-gray-800">{overview.newUsersToday}</p>
            <p className="text-gray-400 text-xs mt-1">This week: {overview.newUsersThisWeek} · Month: {overview.newUsersThisMonth}</p>
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
                          <span className="text-gray-600">{country}</span>
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
                          <span className="text-gray-600">{state}</span>
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
                <div key={u.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onClick={() => { setActiveTab('users'); openUser(u); }}>
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
