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

import { useState } from 'react';
import { api } from '../../lib/api';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import { PRICING } from '../../lib/pricing';
import type { AdminUser, ActivityCountKey, UserActivity, UsersResponse } from './adminTypes';
import { PLAN_LABELS, SUB_STATUS_LABELS, fmtDate, fmtDateTimeMs, fmtFullTs, daysUntil } from './adminFormatting';
import AdminUserDrilldownSheet, { type DrilldownKind } from './AdminUserDrilldownSheet';

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

/**
 * Per-user email-retry-queue diagnostic + unstick widget.
 * R39 (2026-05-01): closes the founder-reported support gap "user X
 * isn't getting password reset emails." The dispatcher's silent-fail-
 * on-exhaustion path means a poisoned email-queue entry can prevent
 * any retries from succeeding. Admin clicks "View queue" to see
 * what's stuck, "Unstick" to flip abandoned entries back to pending.
 */
interface EmailQueueRow {
  id: number;
  emailType: string;
  subject: string;
  attempts: number;
  status: string;
  nextAttemptAt: number;
  lastError: string | null;
  createdAt: number;
  updatedAt: number;
}
interface EmailQueueResponse {
  userId: number;
  email: string;
  totalEntries: number;
  totalAbandoned: number;
  totalPending: number;
  entries: EmailQueueRow[];
  error?: string;
}
function EmailQueueSection({
  userId,
  email,
  toast,
}: {
  userId: number;
  email: string;
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EmailQueueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [unsticking, setUnsticking] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = (await api.adminGetUserEmailQueue(userId)) as EmailQueueResponse;
      if (r?.error) throw new Error(r.error);
      setData(r);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load email queue', 'error');
    } finally {
      setLoading(false);
    }
  }
  async function unstick() {
    setUnsticking(true);
    try {
      const r = (await api.adminUnstickUserEmailQueue(userId)) as { success?: boolean; unstuck?: number; message?: string; error?: string };
      if (r?.error) throw new Error(r.error);
      toast(r?.message || `Unstuck ${r?.unstuck ?? 0} email(s)`, 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to unstick', 'error');
    } finally {
      setUnsticking(false);
    }
  }

  return (
    <div className="border-t pt-5">
      <p className="text-sm font-medium text-gray-700 mb-1">Email queue diagnostic</p>
      <p className="text-xs text-gray-500 mb-3">
        Check + unstick the email retry queue for <strong>{email}</strong>. Use when a user reports they&apos;re not getting password-reset or verification emails.
      </p>
      {!open ? (
        <button
          onClick={() => { setOpen(true); void load(); }}
          className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
        >
          📬 View email queue
        </button>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          {loading && <p className="text-xs text-gray-500">Loading…</p>}
          {data && (
            <>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded p-2">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">Total</p>
                  <p className="text-sm font-bold text-gray-800">{data.totalEntries}</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">Pending</p>
                  <p className="text-sm font-bold text-amber-700">{data.totalPending}</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">Abandoned</p>
                  <p className={`text-sm font-bold ${data.totalAbandoned > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                    {data.totalAbandoned}
                  </p>
                </div>
              </div>
              {data.totalAbandoned > 0 && (
                <button
                  onClick={unstick}
                  disabled={unsticking}
                  className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition disabled:opacity-40"
                >
                  {unsticking ? 'Unsticking…' : `🔄 Unstick ${data.totalAbandoned} abandoned email(s) → retry within 2 min`}
                </button>
              )}
              {data.entries.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">No queue entries — emails delivered successfully.</p>
              )}
              {data.entries.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {data.entries.map((e) => (
                    <div key={e.id} className="bg-white rounded p-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{e.subject || e.emailType}</p>
                          <p className="text-[10px] text-gray-500">
                            {e.emailType} · {e.attempts}/6 attempts · {new Date(e.createdAt).toLocaleString()}
                          </p>
                          {e.lastError && (
                            <p className="text-[10px] text-red-600 mt-0.5 truncate" title={e.lastError}>
                              {e.lastError}
                            </p>
                          )}
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          e.status === 'abandoned' ? 'bg-red-100 text-red-700' :
                          e.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <button
            onClick={() => setOpen(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
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
  // 2026-05-02: lock body scroll while the modal is open so the user
  // list doesn't move underneath, and the visible viewport stays
  // anchored to wherever the user clicked. Same pattern applies to
  // every other modal in the app — see useBodyScrollLock for the
  // full rationale.
  useBodyScrollLock(true);
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

  // R37 (2026-04-30): per-user drilldown sheet (transactions, zakat).
  // Opens on click of the matching activity-count card.
  const [drilldown, setDrilldown] = useState<DrilldownKind | null>(null);

  return (
    // 2026-05-02 (revert): the earlier `flex min-h-full` outer-scroll
    // pattern broke modal mounting on some browser/window combos —
    // founder reported the modal "freezes and nothing is shown."
    // Reverted to the original centered pattern + `max-h-[90vh]
    // overflow-y-auto` on the inner box for internal scroll.
    // useBodyScrollLock handles the "page scrolls behind modal"
    // complaint without any structural change.
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
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
                {ACTIVITY_COUNT_KEYS.map((key) => {
                  // R37 (2026-04-30): transactions + zakatPayments are
                  // clickable — opens AdminUserDrilldownSheet with the
                  // actual rows. Other counts are not clickable yet
                  // (would need their own backend list endpoints).
                  const drilldownKind: DrilldownKind | null =
                    key === 'transactions' ? 'transactions' :
                    key === 'zakatPayments' ? 'zakatPayments' : null;
                  const value = typeof userActivity[key] === 'number' ? userActivity[key] : null;
                  const isInteractive = drilldownKind !== null && (value ?? 0) > 0;
                  const cellClasses = `bg-white rounded-lg p-2 ${
                    isInteractive ? 'cursor-pointer hover:bg-emerald-50 hover:ring-1 hover:ring-emerald-200 transition' : ''
                  }`;
                  const inner = (
                    <>
                      <p className="text-lg font-bold text-[#1B5E20]">
                        {value}
                        {isInteractive && (
                          <span className="ml-1 text-[10px] text-emerald-500" aria-hidden="true">↗</span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</p>
                    </>
                  );
                  if (isInteractive) {
                    return (
                      <button
                        key={String(key)}
                        type="button"
                        onClick={() => setDrilldown(drilldownKind)}
                        className={cellClasses}
                        aria-label={`View ${String(key)} for ${selected.email}`}
                      >
                        {inner}
                      </button>
                    );
                  }
                  return (
                    <div key={String(key)} className={cellClasses}>
                      {inner}
                    </div>
                  );
                })}
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
                } catch (err) {
                  const msg = err instanceof Error ? err.message : 'Failed to fetch hawl report';
                  toast(msg, 'error');
                }
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

          {/* R39 (2026-05-01): Email queue diagnostic + unstick.
              Use case: user reports they're not getting password-reset
              or verification emails. The dispatcher may have given up
              after MAX_ATTEMPTS and marked entries `abandoned`. View
              the queue to see what's stuck, click "Unstick" to flip
              them back to pending. The scheduler retries within ~2min. */}
          <EmailQueueSection userId={selected.id} email={selected.email} toast={toast} />

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
                  // R37 (2026-04-30): backend may return either a fresh
                  // verification or "already verified". Toast accordingly so
                  // the admin doesn't see "verified directly" on a no-op.
                  const alreadyVerified = data?.message === 'Email already verified';
                  const nextPlan = typeof data?.plan === 'string' ? data.plan : selected.plan;
                  toast(alreadyVerified ? 'User was already verified' : 'Email force-verified (no email sent)', 'success');
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
              Force-Verify (Skip Email Send)
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
      {/* R37 (2026-04-30): per-user drilldown sheet — opens when an
          admin clicks a clickable activity-count card. */}
      {drilldown && (
        <AdminUserDrilldownSheet
          userId={selected.id}
          userEmail={selected.email}
          kind={drilldown}
          onClose={() => setDrilldown(null)}
        />
      )}
    </div>
  );
}
