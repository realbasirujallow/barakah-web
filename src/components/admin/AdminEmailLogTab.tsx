'use client';

/**
 * Admin Email-Log tab — all outbound email delivery (verification, lifecycle,
 * dunning, password reset). Filter by all/sent/failed, load on demand, and
 * see the error message inline for failed sends.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. The parent owns the stats (so badge counts stay in sync across
 * tabs); this component owns the entries list + current filter.
 */

import { useState } from 'react';
import { api } from '../../lib/api';
import type { EmailLogEntry, EmailLogStats } from './adminTypes';
import { fmtDateTimeMs } from './adminFormatting';

export interface AdminEmailLogTabProps {
  emailLogStats: EmailLogStats | null;
  setEmailLogStats: (s: EmailLogStats | null) => void;
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
}

export function AdminEmailLogTab({ emailLogStats, setEmailLogStats, toast }: AdminEmailLogTabProps) {
  const [emailLog, setEmailLog] = useState<EmailLogEntry[] | null>(null);
  const [emailLogLoading, setEmailLogLoading] = useState(false);
  const [emailLogFilter, setEmailLogFilter] = useState<'all' | 'sent' | 'failed'>('all');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Email Delivery Log</h2>
            <p className="text-sm text-gray-500">All emails sent: verification, lifecycle, dunning, password reset.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'sent', 'failed'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setEmailLogFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  emailLogFilter === f
                    ? f === 'failed' ? 'bg-red-600 text-white' : 'bg-[#1B5E20] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B5E20]'
                }`}
              >
                {f === 'all' ? 'All' : f === 'sent' ? '✓ Sent' : '✗ Failed'}
                {f === 'failed' && (emailLogStats?.totalFailed ?? 0) > 0 && (
                  <span className="ml-1 bg-red-100 text-red-700 px-1 rounded">{emailLogStats!.totalFailed}</span>
                )}
              </button>
            ))}
            <button
              type="button"
              disabled={emailLogLoading}
              onClick={async () => {
                setEmailLogLoading(true);
                try {
                  const res = await api.adminGetEmailLog(emailLogFilter);
                  setEmailLog(res?.entries ?? []);
                  setEmailLogStats({
                    totalSent: res?.totalSent ?? 0,
                    totalFailed: res?.totalFailed ?? 0,
                    totalElements: res?.totalElements ?? 0,
                  });
                } catch (err) {
                  toast(err instanceof Error ? err.message : 'Failed to load email log', 'error');
                } finally {
                  setEmailLogLoading(false);
                }
              }}
              className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-semibold hover:bg-[#2E7D32] disabled:opacity-50"
            >
              {emailLogLoading ? 'Loading...' : emailLog ? 'Refresh' : 'Load Email Log'}
            </button>
          </div>
        </div>

        {emailLogStats && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#1B5E20]">{emailLogStats.totalSent.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Sent Successfully</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{emailLogStats.totalFailed.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-800">{emailLogStats.totalElements.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Records</p>
            </div>
          </div>
        )}

        {!emailLog ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">✉️</p>
            <p className="font-medium">Click &quot;Load Email Log&quot; to see email delivery history</p>
            <p className="text-sm mt-1">Shows all outbound emails: verification, lifecycle, dunning, etc.</p>
          </div>
        ) : emailLog.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No email records found{emailLogFilter !== 'all' ? ` for filter: ${emailLogFilter}` : ''}.</p>
            {emailLogFilter !== 'all' && (
              <button onClick={() => setEmailLogFilter('all')} className="text-[#1B5E20] underline text-sm mt-2">Show all</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-3 py-3">Recipient</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Sent At</th>
                  <th className="px-3 py-3">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emailLog.map(entry => (
                  <tr key={entry.id} className={`hover:bg-gray-50 ${entry.status === 'failed' ? 'bg-red-50' : ''}`}>
                    <td className="px-3 py-2 text-xs font-mono text-gray-700">{entry.toEmail}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {entry.emailType}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{entry.subject || '—'}</td>
                    <td className="px-3 py-2">
                      {entry.status === 'sent' ? (
                        <span className="text-green-600 font-semibold text-xs">✓ Sent</span>
                      ) : (
                        <span className="text-red-600 font-semibold text-xs">✗ Failed</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">{fmtDateTimeMs(entry.createdAt)}</td>
                    <td className="px-3 py-2 text-xs text-red-500 max-w-xs truncate" title={entry.errorMessage}>
                      {entry.errorMessage || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
