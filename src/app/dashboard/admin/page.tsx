'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { useCurrency } from '../../../lib/useCurrency';

/* ──────────────────────────── Types ──────────────────────────── */

interface AdminUser {
  id: number;
  email: string;
  name: string;
  plan: string;
  subscriptionStatus?: string;
  planExpiresAt?: number;
  emailVerified?: boolean;
  referralCount?: number;
  hasStripe?: boolean;
  createdAt: number;
  updatedAt?: number;
}

interface UsersResponse {
  users: AdminUser[];
  count: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface Overview {
  totalUsers: number;
  freeUsers: number;
  plusUsers: number;
  familyUsers: number;
  subscriptionStatus: Record<string, number>;
  paidUsers: number;
  activePlus: number;
  activeFamily: number;
  mrr: number;
  arr: number;
  conversionRate: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  unverifiedEmails: number;
  expiringTrialsCount: number;
  expiringTrials: AdminUser[];
  pastDueCount: number;
  pastDueUsers: AdminUser[];
  totalReferrals: number;
  usersWithReferrals: number;
  totalDonationRecords: number;
  recentSignups: AdminUser[];
}

/* ──────────────────────────── Helpers ─────────────────────────── */

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:   { label: 'Free',   color: 'bg-gray-100 text-gray-600' },
  plus:   { label: 'Plus',   color: 'bg-blue-100 text-blue-700' },
  family: { label: 'Family', color: 'bg-purple-100 text-purple-700' },
};

const SUB_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:   { label: 'Active',   color: 'bg-green-100 text-green-700' },
  trial:    { label: 'Trial',    color: 'bg-amber-100 text-amber-700' },
  past_due: { label: 'Past Due', color: 'bg-red-100 text-red-700' },
  canceled: { label: 'Canceled', color: 'bg-gray-200 text-gray-500' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-400' },
};

function fmtDate(unixSec: number | undefined) {
  if (!unixSec) return '—';
  return new Date(unixSec * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function fmtDateMs(unixMs: number | undefined) {
  if (!unixMs) return '—';
  return new Date(unixMs).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function fmtMoneyStaticUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function daysUntil(epochSec: number | undefined) {
  if (!epochSec) return null;
  const diff = epochSec - Math.floor(Date.now() / 1000);
  return Math.ceil(diff / 86400);
}

/* ────────────────────────── Component ────────────────────────── */

export default function AdminPage() {
  // Data
  const [overview, setOverview] = useState<Overview | null>(null);
  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [featureUsage, setFeatureUsage] = useState<Record<string, number> | null>(null);
  const [analytics, setAnalytics] = useState<{ growthByMonth: { month: string; signups: number }[] } | null>(null);

  // UI state
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [planSaving, setPlanSaving] = useState(false);
  const [draftPlan, setDraftPlan] = useState('');
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialPlan, setTrialPlan] = useState('plus');
  const [trialDurationDays, setTrialDurationDays] = useState(30);
  const [trialSendEmail, setTrialSendEmail] = useState(true);
  const [trialGranting, setTrialGranting] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'alerts'>('overview');
  const { toast } = useToast();
  const { fmt: fmtMoney } = useCurrency();

  /* ── Data loading ── */
  const loadData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getAdminOverview().catch(() => null),
        api.getAdminUsers(p, 50),
        api.getAdminAnalytics().catch(() => null),
        api.getAdminFeatureUsage().catch(() => null),
      ]);

      // Check for 403 from any result
      for (const r of results) {
        if (r.status === 'rejected') {
          const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
          if (msg.includes('403') || msg.toLowerCase().includes('admin access')) {
            setForbidden(true);
            return;
          }
          if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('authentication')) {
            setSessionExpired(true);
            return;
          }
        }
      }

      const overviewRes = results[0].status === 'fulfilled' ? results[0].value : null;
      const usersRes = results[1].status === 'fulfilled' ? results[1].value : null;
      const analyticsRes = results[2].status === 'fulfilled' ? results[2].value : null;
      const featureRes = results[3].status === 'fulfilled' ? results[3].value : null;

      if (overviewRes) setOverview(overviewRes);
      setUsersData(usersRes);
      if (analyticsRes) setAnalytics(analyticsRes);
      if (featureRes) setFeatureUsage(featureRes);
      setLastRefreshed(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin data';
      if (msg.toLowerCase().includes('admin access') || msg.includes('403')) {
        setForbidden(true);
      } else if (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('unauthorized')) {
        setSessionExpired(true);
      } else {
        toast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(0); }, [loadData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => loadData(page), 60000);
    return () => clearInterval(interval);
  }, [loadData, page]);

  /* ── User modal handlers ── */
  const openUser = (u: AdminUser) => { setSelected(u); setDraftPlan(u.plan || 'free'); };
  const closeModal = () => setSelected(null);

  const handleResetPassword = async () => {
    if (!selected) return;
    setResetting(true);
    try {
      await api.adminResetPassword(selected.id);
      toast(`Password reset email sent to ${selected.email}`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send reset email', 'error');
    } finally {
      setResetting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!selected) return;
    setResendingVerification(true);
    try {
      await api.adminResendVerification(selected.id);
      toast(`Verification email sent to ${selected.email}`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send verification email', 'error');
    } finally {
      setResendingVerification(false);
    }
  };

  const handleSavePlan = async () => {
    if (!selected) return;
    setPlanSaving(true);
    try {
      await api.adminUpdatePlan(selected.id, draftPlan);
      setUsersData(prev => {
        if (!prev) return prev;
        return { ...prev, users: prev.users.map(u => u.id === selected.id ? { ...u, plan: draftPlan } : u) };
      });
      setSelected(prev => prev ? { ...prev, plan: draftPlan } : null);
      toast(`Plan updated to ${draftPlan}`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update plan', 'error');
    } finally {
      setPlanSaving(false);
    }
  };

  const openTrialModal = () => { setTrialPlan('plus'); setTrialDurationDays(30); setTrialSendEmail(true); setTrialModalOpen(true); };
  const closeTrialModal = () => setTrialModalOpen(false);

  const handleGrantTrial = async () => {
    if (!selected) return;
    setTrialGranting(true);
    try {
      await api.adminGrantTrial(selected.id, trialPlan, trialDurationDays, trialSendEmail);
      toast(`Trial granted: ${trialPlan} for ${trialDurationDays} days`, 'success');
      closeTrialModal();
      loadData(page);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to grant trial', 'error');
    } finally {
      setTrialGranting(false);
    }
  };

  const filteredUsers = (usersData?.users ?? []).filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
  });

  /* ── Loading / error states ── */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (sessionExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">⏱️</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h1>
        <p className="text-gray-500 max-w-sm mb-6">Your session has expired. Please sign in again to access the admin dashboard.</p>
        <a href="/login" className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Sign In Again</a>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h1>
        <p className="text-gray-500 max-w-sm">
          Your account is not in the <code className="bg-gray-100 px-1 rounded text-sm">ADMIN_USER_IDS</code> environment variable.
        </p>
      </div>
    );
  }

  const alertCount = (overview?.expiringTrialsCount ?? 0) + (overview?.pastDueCount ?? 0);

  /* ──────────────────────── RENDER ──────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B5E20]">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: {lastRefreshed.toLocaleTimeString()} · Auto-refreshes every 60s
          </p>
        </div>
        <button
          onClick={() => loadData(page)}
          className="px-4 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] transition font-medium"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Alerts Banner ── */}
      {alertCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Attention Required</p>
              <div className="flex flex-wrap gap-4 mt-1 text-sm text-amber-700">
                {(overview?.pastDueCount ?? 0) > 0 && (
                  <button onClick={() => setActiveTab('alerts')} className="underline hover:text-amber-900">
                    {overview!.pastDueCount} past-due subscription{overview!.pastDueCount > 1 ? 's' : ''}
                  </button>
                )}
                {(overview?.expiringTrialsCount ?? 0) > 0 && (
                  <button onClick={() => setActiveTab('alerts')} className="underline hover:text-amber-900">
                    {overview!.expiringTrialsCount} trial{overview!.expiringTrialsCount > 1 ? 's' : ''} expiring within 7 days
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {(['overview', 'users', 'alerts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-white text-[#1B5E20] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'users' && '👥 Users'}
            {tab === 'alerts' && (
              <>
                🔔 Alerts
                {alertCount > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{alertCount}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════ OVERVIEW TAB ═══════════════════ */}
      {activeTab === 'overview' && (
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
                <p className="text-gray-400 text-xs mt-1">{overview.activePlus} Plus · {overview.activeFamily} Family</p>
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
      )}

      {/* ═══════════════════ USERS TAB ═══════════════════ */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl overflow-hidden border">
          <div className="p-4 border-b flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-sm">Clear</button>
            )}
            <span className="text-xs text-gray-400">{usersData?.totalElements ?? 0} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Referrals</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      {search ? 'No users match your search.' : 'No users found.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                    const subInfo = SUB_STATUS_LABELS[u.subscriptionStatus ?? 'inactive'] ?? SUB_STATUS_LABELS.inactive;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => openUser(u)}>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{u.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-sm">{u.name || '—'}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${subInfo.color}`}>{subInfo.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          {u.emailVerified === false
                            ? <span className="text-red-500 text-xs font-medium">✗ No</span>
                            : <span className="text-green-500 text-xs font-medium">✓ Yes</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{u.referralCount ?? 0}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{fmtDateMs(u.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-[#1B5E20] text-xs font-medium">View →</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(usersData?.totalPages ?? 1) > 1 && !search && (
            <div className="px-5 py-4 border-t flex items-center justify-between text-sm text-gray-500">
              <span>Page {page + 1} of {usersData!.totalPages} — {usersData!.totalElements} total</span>
              <div className="flex gap-2">
                <button onClick={() => { const p = page - 1; setPage(p); loadData(p); }} disabled={page === 0}
                  className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition">← Prev</button>
                <button onClick={() => { const p = page + 1; setPage(p); loadData(p); }} disabled={page + 1 >= usersData!.totalPages}
                  className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════ ALERTS TAB ═══════════════════ */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">

          {/* Past Due Subscriptions */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b bg-red-50 flex items-center gap-2">
              <span className="text-lg">💳</span>
              <h2 className="font-semibold text-red-800 text-sm">Past-Due Subscriptions ({overview?.pastDueCount ?? 0})</h2>
            </div>
            {(overview?.pastDueUsers ?? []).length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No past-due subscriptions. All clear!</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {overview!.pastDueUsers.map(u => {
                  const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                  return (
                    <div key={u.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => { setActiveTab('users'); openUser(u); }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {(u.name || u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.name || 'Unnamed'}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Past Due</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expiring Trials */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b bg-amber-50 flex items-center gap-2">
              <span className="text-lg">⏳</span>
              <h2 className="font-semibold text-amber-800 text-sm">Expiring Trials — Next 7 Days ({overview?.expiringTrialsCount ?? 0})</h2>
            </div>
            {(overview?.expiringTrials ?? []).length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No trials expiring soon.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {overview!.expiringTrials.map(u => {
                  const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                  const days = daysUntil(u.planExpiresAt);
                  return (
                    <div key={u.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => { setActiveTab('users'); openUser(u); }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {(u.name || u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.name || 'Unnamed'}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          (days ?? 99) <= 1 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {days !== null ? (days <= 0 ? 'Expired' : `${days}d left`) : '—'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unverified Emails stat */}
          {(overview?.unverifiedEmails ?? 0) > 0 && (
            <div className="bg-white rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {overview!.unverifiedEmails} user{overview!.unverifiedEmails > 1 ? 's' : ''} with unverified emails
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    These users signed up but haven't confirmed their email. They cannot log in until verified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {alertCount === 0 && (overview?.unverifiedEmails ?? 0) === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-lg font-semibold text-gray-700">All clear!</p>
              <p className="text-gray-400 text-sm">No alerts or action items right now.</p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ USER DETAIL MODAL ══════════════════ */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b flex items-start justify-between sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.name || 'Unnamed User'}</h2>
                <p className="text-sm text-gray-500">{selected.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">ID: {selected.id}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">Joined {fmtDateMs(selected.createdAt)}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {(() => {
                    const planInfo = PLAN_LABELS[selected.plan] ?? PLAN_LABELS.free;
                    const subInfo = SUB_STATUS_LABELS[selected.subscriptionStatus ?? 'inactive'] ?? SUB_STATUS_LABELS.inactive;
                    return (
                      <>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${subInfo.color}`}>{subInfo.label}</span>
                        {selected.emailVerified === false && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Unverified</span>
                        )}
                        {selected.hasStripe && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">Stripe</span>
                        )}
                      </>
                    );
                  })()}
                </div>
                {selected.planExpiresAt && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Plan expires: {fmtDate(selected.planExpiresAt)}
                    {(() => { const d = daysUntil(selected.planExpiresAt); return d !== null ? ` (${d <= 0 ? 'expired' : d + 'd'})` : ''; })()}
                  </p>
                )}
                {(selected.referralCount ?? 0) > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{selected.referralCount} referral{selected.referralCount! > 1 ? 's' : ''}</p>
                )}
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Plan management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                <div className="flex gap-2">
                  <select
                    value={draftPlan}
                    onChange={e => setDraftPlan(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="plus">Plus — $9.99/mo</option>
                    <option value="family">Family — $14.99/mo</option>
                  </select>
                  <button
                    onClick={handleSavePlan}
                    disabled={planSaving || draftPlan === selected.plan}
                    className="px-4 py-2 bg-[#1B5E20] text-white text-sm rounded-lg font-semibold hover:bg-[#2E7D32] transition disabled:opacity-40"
                  >
                    {planSaving ? 'Saving…' : 'Save'}
                  </button>
                </div>
                {draftPlan !== selected.plan && (
                  <p className="text-xs text-amber-600 mt-1">⚠ Unsaved — click Save to apply the plan change.</p>
                )}
              </div>

              {/* Password reset */}
              <div className="border-t pt-5">
                <p className="text-sm font-medium text-gray-700 mb-1">Password Reset</p>
                <p className="text-xs text-gray-500 mb-3">
                  Sends a password reset email to <strong>{selected.email}</strong>. The link expires in 30 minutes.
                </p>
                <button
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="w-full py-2.5 border-2 border-[#1B5E20] text-[#1B5E20] rounded-lg text-sm font-semibold hover:bg-green-50 transition disabled:opacity-40"
                >
                  {resetting ? 'Sending…' : 'Send Password Reset Email'}
                </button>
              </div>

              {/* Resend Verification Email */}
              {!selected.emailVerified && (
              <div className="border-t pt-5">
                <p className="text-sm font-medium text-gray-700 mb-1">Resend Verification Email</p>
                <p className="text-xs text-gray-500 mb-3">
                  This user has <strong className="text-red-600">not verified their email</strong>.
                  Send a new verification link to <strong>{selected.email}</strong> (expires in 24 hours).
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={resendingVerification}
                  className="w-full py-2.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-40"
                >
                  {resendingVerification ? 'Sending…' : 'Resend Verification Email'}
                </button>
              </div>
              )}

              {/* Grant Trial */}
              <div className="border-t pt-5">
                <p className="text-sm font-medium text-gray-700 mb-1">Grant Trial</p>
                <p className="text-xs text-gray-500 mb-3">Grants the user a free trial with full access for the selected duration.</p>
                <button
                  onClick={openTrialModal}
                  className="w-full py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
                >
                  Grant Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ GRANT TRIAL MODAL ══════════════════ */}
      {trialModalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={closeTrialModal}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-start justify-between">
              <h2 className="text-lg font-bold text-gray-900">Grant Trial</h2>
              <button onClick={closeTrialModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                Grants <strong>{selected.name || selected.email}</strong> a free trial with full access.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Plan</label>
                <div className="space-y-2">
                  {[{ value: 'plus', label: 'Plus — $9.99/mo' }, { value: 'family', label: 'Family — $14.99/mo' }].map(p => (
                    <label key={p.value} className="flex items-center gap-3 p-3 border rounded-lg border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="trialPlan" value={p.value} checked={trialPlan === p.value}
                        onChange={e => setTrialPlan(e.target.value)} className="w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                <input type="number" min="1" max="365" value={trialDurationDays}
                  onChange={e => setTrialDurationDays(Math.min(365, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="sendEmail" checked={trialSendEmail} onChange={e => setTrialSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]" />
                <label htmlFor="sendEmail" className="text-sm text-gray-700">Send notification email</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeTrialModal} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleGrantTrial} disabled={trialGranting}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40">
                  {trialGranting ? 'Granting…' : 'Grant Trial'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
