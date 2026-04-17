'use client';

/**
 * Admin Unverified-Emails tab — lists every user whose email is still
 * unverified, offers per-row "Resend" and a bulk "Resend All" action.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. Receives the parent's users response + toast/loadData hooks
 * so the underlying `api.adminResendVerification` behavior is unchanged.
 */

import { api } from '../../lib/api';
import type { UsersResponse } from './adminTypes';
import { fmtDateMs } from './adminFormatting';

export interface AdminUnverifiedTabProps {
  usersData: UsersResponse | null;
  page: number;
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
  loadData: (p: number) => void | Promise<void>;
}

export function AdminUnverifiedTab({ usersData, page, toast, loadData }: AdminUnverifiedTabProps) {
  const unverified = usersData?.users.filter(u => u.emailVerified === false) ?? [];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border">
      <div className="p-4 border-b bg-amber-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📧</span>
            <div>
              <h2 className="font-semibold text-amber-800 text-sm">Unverified Emails</h2>
              <p className="text-xs text-amber-700 mt-0.5">These users signed up but never confirmed their email address. They cannot access the app until verified.</p>
            </div>
          </div>
          {(usersData?.users.filter(u => u.emailVerified === false) ?? []).length > 0 && (
            <button
              onClick={async () => {
                const list = usersData!.users.filter(u => u.emailVerified === false);
                try {
                  await Promise.all(list.map(u => api.adminResendVerification(u.id)));
                  toast(`Sent verification emails to ${list.length} user${list.length > 1 ? 's' : ''}`, 'success');
                  loadData(page);
                } catch (err) {
                  toast(err instanceof Error ? err.message : 'Failed to resend verification emails', 'error');
                }
              }}
              className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              Resend All
            </button>
          )}
        </div>
      </div>

      {unverified.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          <p className="text-4xl mb-2">✓</p>
          <p>All users have verified their email addresses.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 gap-4 text-xs font-semibold text-gray-600 uppercase">
            <div>Name & Email</div>
            <div>Signup Date</div>
            <div>Location</div>
            <div>Action</div>
          </div>
          {unverified.map(u => (
            <div key={u.id} className="grid grid-cols-4 px-5 py-4 gap-4 items-center hover:bg-gray-50 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {(u.name || u.email)[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.name || 'Unnamed'}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">{fmtDateMs(u.createdAt)}</div>
              <div className="text-sm text-gray-600">
                {u.country && u.state ? `${u.state}, ${u.country}` : u.country || u.state || '—'}
              </div>
              <button
                onClick={async () => {
                  try {
                    await api.adminResendVerification(u.id);
                    toast(`Verification email sent to ${u.email}`, 'success');
                    loadData(page);
                  } catch (err) {
                    toast(err instanceof Error ? err.message : 'Failed to send verification email', 'error');
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
              >
                Resend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
