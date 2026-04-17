'use client';

/**
 * Admin Alerts tab — past-due subscriptions, expiring trials (next 7 days),
 * and the unverified-emails callout. Clicking a row opens the shared user
 * detail modal via the parent-provided `openUser` callback.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. Renders whatever the parent already fetched — no independent
 * data loading here.
 */

import type { AdminUser, Overview, AdminTab } from './adminTypes';
import { PLAN_LABELS, daysUntil } from './adminFormatting';

export interface AdminAlertsTabProps {
  overview: Overview | null;
  alertCount: number;
  setActiveTab: (tab: AdminTab) => void;
  openUser: (u: AdminUser) => void;
}

export function AdminAlertsTab({ overview, alertCount, setActiveTab, openUser }: AdminAlertsTabProps) {
  return (
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
                These users signed up but haven&apos;t confirmed their email. They cannot log in until verified.
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
  );
}
