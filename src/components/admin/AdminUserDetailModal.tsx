'use client';

/**
 * Admin user detail modal — shown when any tab calls `openUser(user)`.
 * Contains:
 *   - User profile summary + activity counts + lifecycle status
 *   - Plan management (select + save)
 *   - Hawl/Nisab debug download
 *   - Password reset
 *   - Resend verification / verify-email directly
 *   - Grant trial (opens the GrantTrialModal)
 *   - Delete account with two-step confirmation
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. All mutation callbacks come from the parent so users-table
 * updates still roll in without prop drilling the whole response shape.
 */

import { api } from '../../lib/api';
import { PRICING } from '../../lib/pricing';
import type { AdminUser, ActivityCountKey, UserActivity, UsersResponse } from './adminTypes';
import { PLAN_LABELS, SUB_STATUS_LABELS, fmtDate, fmtDateTimeMs, fmtFullTs, daysUntil } from './adminFormatting';

export interface AdminUserDetailModalProps {
  selected: AdminUser;
  userActivity: UserActivity | null;
  draftPlan: string;
  setDraftPlan: (s: string) => void;
  planSaving: boolean;
  resetting: boolean;
  resendingVerification: boolean;
  deleteConfirm: number | null;
  setDeleteConfirm: (id: number | null) => void;
  setSelected: (u: AdminUser | null) => void;
  setUsersData: (updater: (prev: UsersResponse | null) => UsersResponse | null) => void;
  onClose: () => void;
  onSavePlan: () => void | Promise<void>;
  onResetPassword: () => void | Promise<void>;
  onResendVerification: () => void | Promise<void>;
  onGrantTrialOpen: () => void;
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
}

const ACTIVITY_COUNT_KEYS: ActivityCountKey[] = [
  'assets',
  'debts',
  'transactions',
  'budgets',
  'savingsGoals',
  'wasiyyah',
  'wasiyyahObligations',
  'hawlTrackers',
  'sadaqah',
  'waqfContributions',
  'zakatPayments',
  'zakatSnapshots',
  'linkedBankAccounts',
];

export function AdminUserDetailModal(props: AdminUserDetailModalProps) {
  const {
    selected,
    userActivity,
    draftPlan,
    setDraftPlan,
    planSaving,
    resetting,
    resendingVerification,
    deleteConfirm,
    setDeleteConfirm,
    setSelected,
    setUsersData,
    onClose,
    onSavePlan,
    onResetPassword,
    onResendVerification,
    onGrantTrialOpen,
    toast,
  } = props;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{selected.name || 'Unnamed User'}</h2>
            <p className="text-sm text-gray-500">{selected.email}</p>
            {selected.phoneNumber && (
              <p className="text-sm text-gray-500">📞 <a href={`tel:${selected.phoneNumber}`} className="text-[#1B5E20] hover:underline">{selected.phoneNumber}</a></p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">ID: {selected.id}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">Joined {fmtFullTs(selected.createdAt)}</span>
            </div>
            {(selected.country || selected.state) && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">📍</span>
                <span className="text-xs text-gray-400">
                  {selected.state && selected.country ? `${selected.state}, ${selected.country}` : selected.country || selected.state}
                </span>
              </div>
            )}
            {selected.signupIp && (
              <p className="text-xs text-gray-400 mt-0.5">Signup IP: <span className="font-mono">{selected.signupIp}</span></p>
            )}
            {selected.signupSource && (
              <p className="text-xs text-gray-400 mt-0.5">Signup via: {selected.signupSource}</p>
            )}
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
            {((selected.referralCount ?? 0) > 0 || (selected.referralClickCount ?? 0) > 0) && (
              <p className="text-xs text-gray-400 mt-0.5">
                {selected.referralClickCount ?? 0} click{(selected.referralClickCount ?? 0) === 1 ? '' : 's'} • {selected.referralCount ?? 0} reward{(selected.referralCount ?? 0) === 1 ? '' : 's'}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* User Activity Summary */}
          {userActivity && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Activity</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {ACTIVITY_COUNT_KEYS.map((key) => (
                  <div key={String(key)} className="bg-white rounded-lg p-2">
                    <p className="text-lg font-bold text-[#1B5E20]">{typeof userActivity[key] === 'number' ? userActivity[key] : null}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Last login</p>
                  <p className="text-gray-700 font-medium mt-1">{fmtDateTimeMs(userActivity.lastLoginAt)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Last seen</p>
                  <p className="text-gray-700 font-medium mt-1">{fmtDateTimeMs(userActivity.lastSeenAt)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Platform</p>
                  <p className="text-gray-700 font-medium mt-1">{userActivity.lastPlatform || '—'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">App version</p>
                  <p className="text-gray-700 font-medium mt-1">{userActivity.lastAppVersion || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Login IP</p>
                  <p className="text-gray-700 font-mono font-medium mt-1 text-[11px]">{(userActivity as Record<string, unknown>).lastLoginIp as string || '—'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Total logins</p>
                  <p className="text-gray-700 font-medium mt-1">{(userActivity as Record<string, unknown>).loginCount as number ?? 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Email verified</p>
                  <p className="text-gray-700 font-medium mt-1 text-[11px]">{fmtFullTs((userActivity as Record<string, unknown>).emailVerifiedAt as number | undefined)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-gray-400 uppercase tracking-wide">Signup IP</p>
                  <p className="text-gray-700 font-mono font-medium mt-1 text-[11px]">{(userActivity as Record<string, unknown>).signupIp as string || '—'}</p>
                </div>
              </div>
              {userActivity.lifecycle && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Completed setup', value: userActivity.lifecycle.hasCompletedSetup },
                      { label: 'Linked bank', value: userActivity.lifecycle.hasLinkedBankAccount },
                      { label: 'Reviewed transactions', value: userActivity.lifecycle.hasReviewedTransactions },
                    ].map(item => (
                      <div key={item.label} className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">{item.label}</p>
                        <p className={`mt-1 text-sm font-semibold ${item.value ? 'text-[#1B5E20]' : 'text-gray-500'}`}>
                          {item.value ? 'Yes' : 'No'}
                        </p>
                      </div>
                    ))}
                  </div>
                  {userActivity.lifecycle.countsByType && Object.keys(userActivity.lifecycle.countsByType).length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-100 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Lifecycle events</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(userActivity.lifecycle.countsByType).slice(0, 8).map(([eventType, count]) => (
                          <span key={eventType} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                            {eventType.replaceAll('_', ' ')} · {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {userActivity.lifecycle.recentEvents && userActivity.lifecycle.recentEvents.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-100 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Recent lifecycle activity</p>
                      <div className="space-y-2">
                        {userActivity.lifecycle.recentEvents.slice(0, 4).map(event => (
                          <div key={event.id} className="flex items-center justify-between gap-3 text-xs">
                            <div>
                              <p className="font-medium text-gray-700">{event.eventType.replaceAll('_', ' ')}</p>
                              <p className="text-gray-400">{event.source || 'system'}</p>
                            </div>
                            <span className="text-gray-400">{fmtDateTimeMs(event.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
                <option value="plus">{`Plus — ${PRICING.plus.monthly}/mo`}</option>
                <option value="family">{`Family — ${PRICING.family.monthly}/mo`}</option>
              </select>
              <button
                onClick={onSavePlan}
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

          {/* Hawl/Nisab Debug Report */}
          <div className="border-t pt-5">
            <p className="text-sm font-medium text-gray-700 mb-1">Hawl / Nisab Debug</p>
            <p className="text-xs text-gray-500 mb-3">View daily nisab snapshots, hawl tracker history, and nisab drop timeline for customer support.</p>
            <button
              onClick={async () => {
                try {
                  const report = await api.adminGetUserHawlReport(selected.id);
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `hawl-report-user-${selected.id}-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast(`Hawl report downloaded (${report?.totalTrackers ?? 0} trackers, ${report?.snapshotCount ?? 0} snapshots, ${report?.daysBelowNisab ?? 0} days below nisab)`, 'success');
                } catch { toast('Failed to fetch hawl report', 'error'); }
              }}
              className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Download Hawl Debug Report (JSON)
            </button>
          </div>

          {/* Password reset */}
          <div className="border-t pt-5">
            <p className="text-sm font-medium text-gray-700 mb-1">Password Reset</p>
            <p className="text-xs text-gray-500 mb-3">
              Sends a password reset email to <strong>{selected.email}</strong>. The link expires in 30 minutes.
            </p>
            <button
              onClick={onResetPassword}
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
              onClick={onResendVerification}
              disabled={resendingVerification}
              className="w-full py-2.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-40"
            >
              {resendingVerification ? 'Sending…' : 'Resend Verification Email'}
            </button>
            <button
              onClick={async () => {
                if (!selected) return;
                try {
                  const data = await api.adminVerifyEmail(selected.id);
                  const nextPlan = typeof data?.plan === 'string' ? data.plan : selected.plan;
                  toast('Email verified directly', 'success');
                  setDraftPlan(nextPlan);
                  setSelected({
                    ...selected,
                    emailVerified: true,
                    plan: nextPlan,
                    subscriptionStatus: typeof data?.subscriptionStatus === 'string'
                      ? data.subscriptionStatus
                      : selected.subscriptionStatus,
                    planExpiresAt: typeof data?.planExpiresAt === 'number'
                      ? data.planExpiresAt
                      : selected.planExpiresAt,
                  });
                  setUsersData(prev => prev ? {
                    ...prev,
                    users: prev.users.map(u => u.id === selected.id ? {
                      ...u,
                      emailVerified: true,
                      plan: nextPlan,
                      subscriptionStatus: typeof data?.subscriptionStatus === 'string'
                        ? data.subscriptionStatus
                        : u.subscriptionStatus,
                      planExpiresAt: typeof data?.planExpiresAt === 'number'
                        ? data.planExpiresAt
                        : u.planExpiresAt,
                    } : u),
                  } : prev);
                } catch (err) {
                  toast(err instanceof Error ? err.message : 'Verification failed', 'error');
                }
              }}
              className="w-full py-2.5 mt-2 border-2 border-green-500 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-50 transition"
            >
              Verify Email Directly (Skip Email)
            </button>
          </div>
          )}

          {/* Grant Trial */}
          <div className="border-t pt-5">
            <p className="text-sm font-medium text-gray-700 mb-1">Grant Trial</p>
            <p className="text-xs text-gray-500 mb-3">Grants the user a free trial with full access for the selected duration.</p>
            <button
              onClick={onGrantTrialOpen}
              className="w-full py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              Grant Trial
            </button>
          </div>

          {/* Delete Account */}
          <div className="border-t pt-5">
            <p className="text-sm font-medium text-red-700 mb-1">Delete Account</p>
            <p className="text-xs text-gray-500 mb-3">Permanently deletes this user and ALL their data. This cannot be undone.</p>
            {deleteConfirm === selected?.id ? (
              <div className="space-y-2">
                <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded">
                  Are you sure? This will delete {selected.name || selected.email} and all their financial data permanently.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await api.adminDeleteUser(selected.id);
                        toast(`User ${selected.email} deleted`, 'success');
                        setSelected(null);
                        setDeleteConfirm(null);
                        setUsersData(prev => prev ? { ...prev, users: prev.users.filter(u => u.id !== selected.id), totalElements: prev.totalElements - 1 } : prev);
                      } catch (err) {
                        toast(err instanceof Error ? err.message : 'Delete failed', 'error');
                      }
                    }}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Yes, Delete Permanently
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(selected?.id ?? null)}
                className="w-full py-2.5 border-2 border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
              >
                Delete User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
