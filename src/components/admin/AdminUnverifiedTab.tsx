'use client';

/**
 * Admin Unverified-Emails tab — lists every user whose email is still
 * unverified, offers per-row "Resend" and a bulk "Resend All" action.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor.
 *
 * Round 47 (2026-05-09 founder report): the previous version filtered
 * the parent's paginated `/admin/active-users` response client-side
 * (`usersData.users.filter(emailVerified === false)`), so the tab only
 * showed unverified users that happened to land on page 1. With 19
 * unverified across the dataset and 0 of them on page 1, the badge
 * said "19" and the tab body said "All users have verified."
 *
 * Fix: fetch the dedicated `/admin/unverified-users` endpoint on mount
 * (and after any Resend mutation), which returns the FULL unverified
 * set newest-first. The list now always matches the
 * `Overview.unverifiedEmails` count.
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { AdminUser } from './adminTypes';
import { fmtDateMs } from './adminFormatting';

export interface AdminUnverifiedTabProps {
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
  /**
   * Refreshes the parent's `usersData` + `overview` so the tab badge
   * count and the Overview card stay in sync after a Resend / Verify.
   * Optional — the tab also refetches its own list locally.
   */
  loadData?: (p: number) => void | Promise<void>;
  page?: number;
  /**
   * Open the shared user-detail modal so admins can call the user, fix
   * a typo in their email, force-verify, or grant a trial. Wired by the
   * parent admin page. Founder report 2026-05-10: prior to this prop,
   * unverified rows had no onClick at all — you could see the user but
   * couldn't act on them.
   */
  openUser?: (u: AdminUser, listContext?: AdminUser[]) => void;
}

interface UnverifiedResponse {
  users: AdminUser[];
  count: number;
}

export function AdminUnverifiedTab({ toast, loadData, page = 0, openUser }: AdminUnverifiedTabProps) {
  const [unverified, setUnverified] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = (await api.adminGetUnverifiedUsers()) as UnverifiedResponse;
      setUnverified(resp.users ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load unverified users';
      setError(msg);
      setUnverified([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleResendOne = async (u: AdminUser) => {
    try {
      await api.adminResendVerification(u.id);
      toast(`Verification email sent to ${u.email}`, 'success');
      await refresh();
      // Also kick the parent so the badge count + Overview card update.
      if (loadData) await loadData(page);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send verification email', 'error');
    }
  };

  const handleResendAll = async () => {
    if (!unverified || unverified.length === 0) return;
    try {
      await Promise.all(unverified.map(u => api.adminResendVerification(u.id)));
      toast(
        `Sent verification emails to ${unverified.length} user${unverified.length > 1 ? 's' : ''}`,
        'success',
      );
      await refresh();
      if (loadData) await loadData(page);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to resend verification emails', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border">
      <div className="p-4 border-b bg-amber-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📧</span>
            <div>
              <h2 className="font-semibold text-amber-800 text-sm">Unverified Emails</h2>
              <p className="text-xs text-amber-700 mt-0.5">
                These users signed up but never confirmed their email address. They cannot access
                the app until verified.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="px-3 py-2 text-xs font-semibold border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 disabled:opacity-50 transition"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            {(unverified?.length ?? 0) > 0 && (
              <button
                onClick={handleResendAll}
                className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Resend All
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && unverified === null ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          <p>Loading unverified users…</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">
          <p className="text-3xl mb-2">⚠️</p>
          <p>Couldn&apos;t load unverified users: {error}</p>
          <button
            onClick={refresh}
            className="mt-3 px-4 py-2 bg-amber-500 text-white text-xs rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Try again
          </button>
        </div>
      ) : (unverified?.length ?? 0) === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          <p className="text-4xl mb-2">✓</p>
          <p>All users have verified their email addresses.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 gap-4 text-xs font-semibold text-gray-600 uppercase">
            <div>Name &amp; Email</div>
            <div>Signup Date</div>
            <div>Location</div>
            <div>Action</div>
          </div>
          {(unverified ?? []).map(u => {
            const list = unverified ?? [];
            const handleOpen = openUser
              ? () => openUser(u, list)
              : undefined;
            return (
              <div
                key={u.id}
                role={handleOpen ? 'button' : undefined}
                tabIndex={handleOpen ? 0 : undefined}
                onClick={handleOpen}
                onKeyDown={handleOpen
                  ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }
                  : undefined}
                className={`grid grid-cols-4 px-5 py-4 gap-4 items-center transition ${
                  handleOpen ? 'cursor-pointer hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-amber-50' : 'hover:bg-gray-50'
                }`}
              >
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleResendOne(u); }}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
                  >
                    Resend
                  </button>
                  {handleOpen && (
                    <span className="text-[#1B5E20] text-xs font-medium" aria-hidden>View →</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
