'use client';

/**
 * Admin Deleted-Users tab — archive of soft-deleted accounts with churn
 * breakdown (reason totals + remarketing eligibility). Loads lazily via
 * an on-page button so the admin doesn't pay the cost on page mount.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. Owns its own deleted-users / churn state because nothing else
 * on the page needs it.
 */

import { useState } from 'react';
import { api } from '../../lib/api';
import { fmtFullTs } from './adminFormatting';

export interface AdminDeletedTabProps {
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
}

export function AdminDeletedTab({ toast }: AdminDeletedTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deletedUsers, setDeletedUsers] = useState<any[] | null>(null);
  const [deletedUsersLoading, setDeletedUsersLoading] = useState(false);
  const [churnData, setChurnData] = useState<Record<string, number> | null>(null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Deleted User Archive</h2>
          <p className="text-sm text-gray-500">Contact info preserved for remarketing and churn analysis.</p>
        </div>
        <button
          onClick={async () => {
            setDeletedUsersLoading(true);
            try {
              const [usersRes, churnRes] = await Promise.all([
                api.adminGetDeletedUsers(),
                api.adminGetChurnAnalysis(),
              ]);
              setDeletedUsers(usersRes?.users ?? []);
              setChurnData(churnRes ?? null);
            } catch { toast('Failed to load deleted users', 'error'); }
            finally { setDeletedUsersLoading(false); }
          }}
          disabled={deletedUsersLoading}
          className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-semibold hover:bg-[#2E7D32] disabled:opacity-50"
        >
          {deletedUsersLoading ? 'Loading...' : deletedUsers ? 'Refresh' : 'Load Deleted Users'}
        </button>
      </div>

      {/* Churn breakdown */}
      {churnData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{churnData.total_deleted ?? 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Total Deleted</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#1B5E20]">{churnData.remarketing_eligible ?? 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Remarketing Eligible</p>
          </div>
          {['too_expensive', 'not_enough_features', 'found_alternative', 'not_using', 'privacy', 'other'].map(reason => (
            <div key={reason} className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-gray-700">{churnData[reason] ?? 0}</p>
              <p className="text-[9px] text-gray-400 capitalize">{reason.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Deleted users table */}
      {deletedUsers && deletedUsers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Plan</th>
                <th className="px-3 py-3">Reason</th>
                <th className="px-3 py-3">Deleted</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deletedUsers.map((u, i) => (
                <tr key={(u.userId as number | undefined) ?? (u.id as number | undefined) ?? (u.email as string | undefined) ?? i} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-900 text-sm">{String(u.fullName || '—')}</p>
                    <p className="text-xs text-gray-400">{String(u.email || '')}</p>
                    {u.phoneNumber && <p className="text-xs text-gray-400">{String(u.phoneNumber)}</p>}
                  </td>
                  <td className="px-3 py-3 text-xs">{String(u.planAtDeletion || 'free')}</td>
                  <td className="px-3 py-3 text-xs text-gray-600">
                    {u.deletionReason ? String(u.deletionReason).replace(/_/g, ' ') : <span className="text-gray-300">—</span>}
                    {u.deletionNote && <p className="text-[10px] text-gray-400 italic mt-0.5">{String(u.deletionNote)}</p>}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{u.deletionDate ? fmtFullTs(Number(u.deletionDate)) : '—'}</td>
                  <td className="px-3 py-3 text-xs">{String(u.deletionSource || '')}</td>
                  <td className="px-3 py-3">
                    {u.reactivated
                      ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Returned</span>
                      : u.remarketingOptedOut
                        ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">Opted Out</span>
                        : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">Remarket</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deletedUsers && deletedUsers.length === 0 && (
        <p className="text-center py-10 text-gray-400">No deleted users yet.</p>
      )}
    </div>
  );
}
