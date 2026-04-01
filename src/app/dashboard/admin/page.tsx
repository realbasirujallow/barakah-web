'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  plan: string;
  createdAt: number; // unix seconds
}

interface UsersResponse {
  users: AdminUser[];
  count: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:   { label: 'Free',   color: 'bg-gray-100 text-gray-600' },
  plus:   { label: 'Plus',   color: 'bg-blue-100 text-blue-700' },
  family: { label: 'Family', color: 'bg-purple-100 text-purple-700' },
};

function fmtDate(unixSec: number | undefined) {
  if (!unixSec) return '—';
  return new Date(unixSec * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function AdminPage() {
  const [userCount, setUserCount]   = useState<number | null>(null);
  const [usersData, setUsersData]   = useState<UsersResponse | null>(null);
  const [page, setPage]             = useState(0);
  const [loading, setLoading]           = useState(true);
  const [forbidden, setForbidden]       = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<AdminUser | null>(null);
  const [resetting, setResetting]   = useState(false);
  const [planSaving, setPlanSaving] = useState(false);
  const [draftPlan, setDraftPlan]   = useState('');
  const [analytics, setAnalytics]   = useState<{ totalUsers: number; freeUsers: number; plusUsers: number; familyUsers: number; growthByMonth: { month: string; signups: number }[] } | null>(null);
  const [featureUsage, setFeatureUsage] = useState<Record<string, number> | null>(null);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialPlan, setTrialPlan] = useState('plus');
  const [trialDurationDays, setTrialDurationDays] = useState(30);
  const [trialSendEmail, setTrialSendEmail] = useState(true);
  const [trialGranting, setTrialGranting] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const [countRes, usersRes, analyticsRes, featureRes] = await Promise.all([
        api.getAdminUserCount(),
        api.getAdminUsers(p, 50),
        api.getAdminAnalytics().catch(() => null),
        api.getAdminFeatureUsage().catch(() => null),
      ]);
      setUserCount(countRes?.count ?? null);
      setUsersData(usersRes);
      if (analyticsRes) setAnalytics(analyticsRes);
      if (featureRes) setFeatureUsage(featureRes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin data';
      if (msg.toLowerCase().includes('admin access') || msg.includes('403')) {
        setForbidden(true);
      } else if (
        msg.toLowerCase().includes('session') ||
        msg.toLowerCase().includes('expired') ||
        msg.toLowerCase().includes('authentication') ||
        msg.toLowerCase().includes('unauthorized')
      ) {
        // Token expired or silent refresh failed — don't auto-logout, show a
        // friendly prompt so the user can sign in again from this page.
        setSessionExpired(true);
      } else {
        toast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(0); }, [loadData]);

  const openUser = (u: AdminUser) => {
    setSelected(u);
    setDraftPlan(u.plan || 'free');
  };

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

  const handleSavePlan = async () => {
    if (!selected) return;
    setPlanSaving(true);
    try {
      await api.adminUpdatePlan(selected.id, draftPlan);
      // Update local state so the table reflects the change immediately
      setUsersData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map(u => u.id === selected.id ? { ...u, plan: draftPlan } : u),
        };
      });
      setSelected(prev => prev ? { ...prev, plan: draftPlan } : null);
      toast(`Plan updated to ${draftPlan}`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update plan', 'error');
    } finally {
      setPlanSaving(false);
    }
  };

  const openTrialModal = () => {
    setTrialPlan('plus');
    setTrialDurationDays(30);
    setTrialSendEmail(true);
    setTrialModalOpen(true);
  };

  const closeTrialModal = () => setTrialModalOpen(false);

  const handleGrantTrial = async () => {
    if (!selected) return;
    setTrialGranting(true);
    try {
      await api.adminGrantTrial(selected.id, trialPlan, trialDurationDays, trialSendEmail);
      toast(`Trial granted: ${trialPlan} for ${trialDurationDays} days`, 'success');
      closeTrialModal();
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
        <p className="text-gray-500 max-w-sm mb-6">
          Your session has expired. Please sign in again to access the admin dashboard.
        </p>
        <a
          href="/login"
          className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
        >
          Sign In Again
        </a>
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
          Ask the server owner to add your user ID.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white">
          <p className="text-green-200 text-sm mb-1">Total Users</p>
          <p className="text-4xl font-bold">{userCount ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">On This Page</p>
          <p className="text-4xl font-bold text-gray-800">{usersData?.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Pages</p>
          <p className="text-4xl font-bold text-gray-800">{usersData?.totalPages ?? 1}</p>
        </div>
      </div>

      {/* Analytics Row */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Free Users</p>
            <p className="text-2xl font-bold text-gray-800">{analytics.freeUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Plus Users</p>
            <p className="text-2xl font-bold text-blue-600">{analytics.plusUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Family Users</p>
            <p className="text-2xl font-bold text-purple-600">{analytics.familyUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Signups (Last 12mo)</p>
            <p className="text-2xl font-bold text-[#1B5E20]">
              {analytics.growthByMonth.reduce((s, m) => s + m.signups, 0)}
            </p>
          </div>
        </div>
      )}

      {/* Feature Usage */}
      {featureUsage && (
        <div className="bg-white rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-gray-700 mb-4">Feature Usage (All Users)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(featureUsage).map(([key, count]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 capitalize">{key.replace('total', '').replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-xl font-bold text-gray-800">{count.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Signups Mini-Chart */}
      {analytics && analytics.growthByMonth.length > 0 && (
        <div className="bg-white rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-gray-700 mb-4">Monthly Signups (Last 12 months)</h2>
          <div className="flex items-end gap-1 h-24">
            {analytics.growthByMonth.map((m) => {
              const max = Math.max(...analytics.growthByMonth.map(x => x.signups), 1);
              const pct = (m.signups / max) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1" title={`${m.month}: ${m.signups} signups`}>
                  <div className="w-full bg-[#1B5E20] rounded-t-sm" style={{ height: `${Math.max(pct, 4)}%`, minHeight: 3 }} />
                  <p className="text-[9px] text-gray-400 rotate-45 origin-left" style={{ fontSize: 8 }}>{m.month.slice(5)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-sm">
              Clear
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    {search ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => openUser(u)}>
                      <td className="px-5 py-3 text-gray-400 font-mono">{u.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{u.name || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>
                          {planInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{fmtDate(u.createdAt)}</td>
                      <td className="px-5 py-3 text-right">
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
            <span>
              Page {page + 1} of {usersData!.totalPages} &mdash; {usersData!.totalElements} total users
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { const p = page - 1; setPage(p); loadData(p); }}
                disabled={page === 0}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"
              >
                ← Prev
              </button>
              <button
                onClick={() => { const p = page + 1; setPage(p); loadData(p); }}
                disabled={page + 1 >= usersData!.totalPages}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.name || 'Unnamed User'}</h2>
                <p className="text-sm text-gray-500">{selected.email}</p>
                <p className="text-xs text-gray-400 mt-1">ID: {selected.id} · Joined {fmtDate(selected.createdAt)}</p>
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
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠ Unsaved — click Save to apply the plan change.
                  </p>
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
                  {resetting ? 'Sending…' : '📧 Send Password Reset Email'}
                </button>
              </div>

              {/* Grant Trial */}
              <div className="border-t pt-5">
                <p className="text-sm font-medium text-gray-700 mb-1">Grant Trial</p>
                <p className="text-xs text-gray-500 mb-3">
                  Grants the user a free trial. They'll receive full access for the selected duration.
                </p>
                <button
                  onClick={openTrialModal}
                  className="w-full py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
                >
                  🎁 Grant Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Grant Trial Modal ── */}
      {trialModalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeTrialModal}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b flex items-start justify-between">
              <h2 className="text-lg font-bold text-gray-900">Grant Trial</h2>
              <button onClick={closeTrialModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Note */}
              <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                Grants the user a free trial. They'll receive full access for the selected duration.
              </p>

              {/* Plan selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Plan</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="trialPlan"
                      value="plus"
                      checked={trialPlan === 'plus'}
                      onChange={e => setTrialPlan(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Plus — $9.99/mo</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="trialPlan"
                      value="family"
                      checked={trialPlan === 'family'}
                      onChange={e => setTrialPlan(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Family — $14.99/mo</span>
                  </label>
                </div>
              </div>

              {/* Duration input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={trialDurationDays}
                  onChange={e => setTrialDurationDays(Math.min(365, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Range: 1-365 days (default 30)</p>
              </div>

              {/* Send email checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={trialSendEmail}
                  onChange={e => setTrialSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]"
                />
                <label htmlFor="sendEmail" className="text-sm text-gray-700">
                  Send notification email
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeTrialModal}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGrantTrial}
                  disabled={trialGranting}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40"
                >
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
