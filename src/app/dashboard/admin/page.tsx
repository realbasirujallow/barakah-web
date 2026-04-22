'use client';

/**
 * Admin dashboard shell.
 *
 * Responsibilities:
 *   - Owns the admin data/state that every tab reads (overview, users, etc.)
 *   - Loads data on mount + every 30 min
 *   - Renders the tab header and dispatches to the appropriate tab component
 *   - Hosts the shared user detail + grant-trial modals
 *
 * Tab content lives in `src/components/admin/Admin*Tab.tsx`. Shared helpers
 * (plan/status label maps, date formatters) live in
 * `src/components/admin/adminFormatting.ts`, and all response types in
 * `adminTypes.ts`. This file used to be ~2000 lines — the split is a pure
 * file-organisation refactor with no behavioural or network changes.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../lib/toast';
import { useCurrency } from '../../../lib/useCurrency';
import { LifecycleCampaignCenter } from '../../../components/admin/LifecycleCampaignCenter';
import { AdminOverviewTab } from '../../../components/admin/AdminOverviewTab';
import { AdminUsersTab } from '../../../components/admin/AdminUsersTab';
import { AdminAlertsTab } from '../../../components/admin/AdminAlertsTab';
import { AdminUnverifiedTab } from '../../../components/admin/AdminUnverifiedTab';
import { AdminDeletedTab } from '../../../components/admin/AdminDeletedTab';
import { AdminEmailLogTab } from '../../../components/admin/AdminEmailLogTab';
import { AdminExperimentsTab } from '../../../components/admin/AdminExperimentsTab';
import { AdminUserDetailModal } from '../../../components/admin/AdminUserDetailModal';
import { AdminGrantTrialModal } from '../../../components/admin/AdminGrantTrialModal';
import type {
  AdminUser,
  OnboardingTrialSettings,
  EmailLogStats,
  UserActivity,
  UsersResponse,
  Overview,
  AdminTab,
  UserFilter,
} from '../../../components/admin/adminTypes';

export default function AdminPage() {
  // Round 21: gate loadData behind user.isAdmin so non-admin visitors
  // don't fire six admin-API calls before the 403 handler kicks in.
  // Matches the funnel/growth page pattern from Round 18.
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  useEffect(() => {
    if (isAuthLoading) return;
    // Auth resolved but no user at all → not logged in. Send them to login
    // rather than letting the spinner churn forever (loadData is gated on
    // isAdmin so it never fires for anonymous visitors, leaving the page
    // stuck in its initial loading=true state indefinitely).
    if (!user) {
      router.replace('/login');
      return;
    }
    // Logged in but confirmed not-admin → back to the regular dashboard.
    if (isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

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
  const [userFilter, setUserFilter] = useState<UserFilter>('all');
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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [emailLogStats, setEmailLogStats] = useState<EmailLogStats | null>(null);
  const [onboardingTrial, setOnboardingTrial] = useState<OnboardingTrialSettings | null>(null);
  const [trialSettingsSaving, setTrialSettingsSaving] = useState(false);
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
        api.getAdminOnboardingTrialSettings().catch(() => null),
        api.adminGetEmailLog('all', 0, 1).catch(() => null),  // just for stats
      ]);

      // Check for auth errors from any result
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
          // Show toast for unhandled server errors (500, network issues, etc.)
          // but only for the users call which is critical
          if (r === results[1]) {
            toast(msg, 'error');
          }
        }
      }

      const overviewRes = results[0].status === 'fulfilled' ? results[0].value : null;
      const usersRes = results[1].status === 'fulfilled' ? results[1].value : null;
      const analyticsRes = results[2].status === 'fulfilled' ? results[2].value : null;
      const featureRes = results[3].status === 'fulfilled' ? results[3].value : null;
      const onboardingTrialRes = results[4].status === 'fulfilled' ? results[4].value : null;
      const emailLogStatsRes = results[5].status === 'fulfilled' ? results[5].value : null;

      if (overviewRes) setOverview(overviewRes);
      setUsersData(usersRes);
      if (analyticsRes) setAnalytics(analyticsRes);
      if (featureRes) setFeatureUsage(featureRes);
      if (onboardingTrialRes) setOnboardingTrial(onboardingTrialRes as OnboardingTrialSettings);
      if (emailLogStatsRes) setEmailLogStats({ totalSent: emailLogStatsRes.totalSent ?? 0, totalFailed: emailLogStatsRes.totalFailed ?? 0, totalElements: emailLogStatsRes.totalElements ?? 0 });
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

  // Round 21: only fire loadData when the user is known to be admin.
  // For non-admins the isAdmin redirect effect above handles the
  // bounce; we stop spamming six 403s on every visit.
  useEffect(() => {
    if (isAuthLoading || !isAdminKnown || !isAdmin) return;
    loadData(0);
  }, [isAuthLoading, isAdminKnown, isAdmin, loadData]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => loadData(page), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData, page]);

  /* ── User modal handlers ── */
  const openUser = (u: AdminUser) => {
    setSelected(u);
    setDraftPlan(u.plan || 'free');
    setUserActivity(null);
    api.adminGetUserActivity(u.id).then(d => { if (d && !d.error) setUserActivity(d as UserActivity); }).catch(() => {});
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

  const handleSaveOnboardingTrial = async () => {
    if (!onboardingTrial) return;
    setTrialSettingsSaving(true);
    try {
      const updated = await api.updateAdminOnboardingTrialSettings(onboardingTrial);
      setOnboardingTrial(updated as OnboardingTrialSettings);
      toast('Onboarding trial settings updated', 'success');
      loadData(page);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update onboarding trial settings', 'error');
    } finally {
      setTrialSettingsSaving(false);
    }
  };

  const filteredUsers = (usersData?.users ?? []).filter(u => {
    const q = search.trim().toLowerCase();
    const searchMatch = !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
    if (!searchMatch) return false;

    switch (userFilter) {
      case 'unverified':
        return u.emailVerified === false;
      case 'past_due':
        return u.subscriptionStatus === 'past_due';
      case 'trialing':
        return u.subscriptionStatus === 'trialing' || u.subscriptionStatus === 'trial';
      case 'missing_phone':
        return !u.phoneNumber?.trim();
      case 'missing_location':
        return !u.state?.trim() && !u.country?.trim();
      case 'paying':
        return u.subscriptionStatus === 'active' || u.subscriptionStatus === 'trialing' || u.subscriptionStatus === 'trial';
      default:
        return true;
    }
  });

  /* ── Loading / error states ── */
  //
  // Render nothing while auth state is unresolved OR while we know the user
  // is not an admin (redirect is mid-flight). Without this guard the admin
  // layout flashes for ~100 ms during the router.replace bounce, which:
  //   (a) briefly exposes admin-style UI chrome / page-titles to
  //       non-admins, a confusing-at-best and phishing-useful-at-worst
  //       leak; and
  //   (b) for anonymous visitors, leaves the spinner spinning forever
  //       because loadData is gated on isAdmin and never fires.
  if (isAuthLoading || !user) {
    return null;
  }
  if (isAdminKnown && !isAdmin) {
    return null;
  }

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
          You do not have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  const alertCount = (overview?.expiringTrialsCount ?? 0) + (overview?.pastDueCount ?? 0);

  /* ──────────────────────── RENDER ──────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1B5E20]">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: {lastRefreshed.toLocaleTimeString()} · Auto-refreshes every 30 minutes
          </p>
        </div>
        {/* Sibling dashboards live on their own routes (conversion funnel + growth
            KPIs) — surface direct links here so admins don't have to know the URLs. */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/admin/funnel"
            className="px-3 py-2 text-sm bg-white text-[#1B5E20] border border-[#1B5E20] rounded-lg hover:bg-green-50 transition font-medium"
          >
            📉 Funnel
          </Link>
          <Link
            href="/dashboard/admin/growth"
            className="px-3 py-2 text-sm bg-white text-[#1B5E20] border border-[#1B5E20] rounded-lg hover:bg-green-50 transition font-medium"
          >
            📈 Growth
          </Link>
          <button
            type="button"
            onClick={() => loadData(page)}
            className="px-4 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] transition font-medium"
          >
            ↻ Refresh
          </button>
        </div>
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
                  <button type="button" onClick={() => setActiveTab('alerts')} className="underline hover:text-amber-900">
                    {overview!.pastDueCount} past-due subscription{overview!.pastDueCount > 1 ? 's' : ''}
                  </button>
                )}
                {(overview?.expiringTrialsCount ?? 0) > 0 && (
                  <button type="button" onClick={() => setActiveTab('alerts')} className="underline hover:text-amber-900">
                    {overview!.expiringTrialsCount} trial{overview!.expiringTrialsCount > 1 ? 's' : ''} expiring within 7 days
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick nav to standalone admin pages ── */}
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <Link
          href="/dashboard/admin/scorecard"
          className="bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#2E7D32]"
        >
          📈 Weekly Scorecard
        </Link>
        <Link
          href="/dashboard/admin/funnel"
          className="bg-white border border-[#1B5E20] text-[#1B5E20] px-3 py-1.5 rounded-lg font-medium hover:bg-green-50"
        >
          🔄 Funnel
        </Link>
        <Link
          href="/dashboard/admin/growth"
          className="bg-white border border-[#1B5E20] text-[#1B5E20] px-3 py-1.5 rounded-lg font-medium hover:bg-green-50"
        >
          📊 Growth
        </Link>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {(['overview', 'users', 'alerts', 'unverified', 'lifecycle', 'experiments', 'deleted', 'email-log'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-none whitespace-nowrap py-2 px-3 rounded-lg text-sm font-medium transition min-w-fit ${
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
            {tab === 'unverified' && (
              <>
                📧 Unverified
                {(overview?.unverifiedEmails ?? 0) > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{overview!.unverifiedEmails}</span>
                )}
              </>
            )}
            {tab === 'lifecycle' && '📬 Lifecycle'}
            {tab === 'experiments' && '🧪 Experiments'}
            {tab === 'deleted' && '🗑️ Deleted'}
            {tab === 'email-log' && (
              <>
                ✉️ Email Log
                {(emailLogStats?.totalFailed ?? 0) > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{emailLogStats!.totalFailed}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      {activeTab === 'overview' && (
        <AdminOverviewTab
          overview={overview}
          featureUsage={featureUsage}
          analytics={analytics}
          onboardingTrial={onboardingTrial}
          setOnboardingTrial={setOnboardingTrial}
          trialSettingsSaving={trialSettingsSaving}
          onSaveOnboardingTrial={handleSaveOnboardingTrial}
          fmtMoney={fmtMoney}
          setActiveTab={setActiveTab}
          setUserFilter={setUserFilter}
          setSearch={setSearch}
          openUser={openUser}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab
          usersData={usersData}
          recentSignups={overview?.recentSignups}
          filteredUsers={filteredUsers}
          search={search}
          setSearch={setSearch}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          page={page}
          setPage={setPage}
          loadData={loadData}
          openUser={openUser}
        />
      )}

      {activeTab === 'alerts' && (
        <AdminAlertsTab
          overview={overview}
          alertCount={alertCount}
          setActiveTab={setActiveTab}
          openUser={openUser}
        />
      )}

      {activeTab === 'unverified' && (
        <AdminUnverifiedTab
          usersData={usersData}
          page={page}
          toast={toast}
          loadData={loadData}
        />
      )}

      {activeTab === 'lifecycle' && (
        <LifecycleCampaignCenter active={activeTab === 'lifecycle'} />
      )}

      {activeTab === 'experiments' && (
        <AdminExperimentsTab />
      )}

      {activeTab === 'deleted' && (
        <AdminDeletedTab toast={toast} />
      )}

      {activeTab === 'email-log' && (
        <AdminEmailLogTab
          emailLogStats={emailLogStats}
          setEmailLogStats={setEmailLogStats}
          toast={toast}
        />
      )}

      {/* ══════════════════ USER DETAIL MODAL ══════════════════ */}
      {selected && (
        <AdminUserDetailModal
          selected={selected}
          userActivity={userActivity}
          draftPlan={draftPlan}
          setDraftPlan={setDraftPlan}
          planSaving={planSaving}
          resetting={resetting}
          resendingVerification={resendingVerification}
          deleteConfirm={deleteConfirm}
          setDeleteConfirm={setDeleteConfirm}
          setSelected={setSelected}
          setUsersData={setUsersData}
          onClose={closeModal}
          onSavePlan={handleSavePlan}
          onResetPassword={handleResetPassword}
          onResendVerification={handleResendVerification}
          onGrantTrialOpen={openTrialModal}
          toast={toast}
        />
      )}

      {/* ══════════════════ GRANT TRIAL MODAL ══════════════════ */}
      {trialModalOpen && selected && (
        <AdminGrantTrialModal
          selected={selected}
          trialPlan={trialPlan}
          setTrialPlan={setTrialPlan}
          trialDurationDays={trialDurationDays}
          setTrialDurationDays={setTrialDurationDays}
          trialSendEmail={trialSendEmail}
          setTrialSendEmail={setTrialSendEmail}
          trialGranting={trialGranting}
          onClose={closeTrialModal}
          onGrant={handleGrantTrial}
        />
      )}
    </div>
  );
}
