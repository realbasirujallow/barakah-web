'use client';

/**
 * Admin Email-Log tab — all outbound email delivery (verification, lifecycle,
 * dunning, password reset). Filter by all/sent/failed, paginate newest-first,
 * and click any row to drill into the full detail (incl. recipient name,
 * phone, plan, and the exact failure reason).
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor. The parent owns the stats (so badge counts stay in sync across
 * tabs); this component owns the entries list + current filter + current
 * page + drilldown state.
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { EmailLogEntry, EmailLogEntryDetail, EmailLogStats } from './adminTypes';
import { fmtDateTimeMs } from './adminFormatting';

const PAGE_SIZE = 25;

export interface AdminEmailLogTabProps {
  emailLogStats: EmailLogStats | null;
  setEmailLogStats: (s: EmailLogStats | null) => void;
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
}

export function AdminEmailLogTab({ emailLogStats, setEmailLogStats, toast }: AdminEmailLogTabProps) {
  const [emailLog, setEmailLog] = useState<EmailLogEntry[] | null>(null);
  const [emailLogLoading, setEmailLogLoading] = useState(false);
  const [emailLogFilter, setEmailLogFilter] = useState<'all' | 'sent' | 'failed'>('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selected, setSelected] = useState<EmailLogEntryDetail | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  const loadPage = useCallback(async (targetPage: number, filter: 'all' | 'sent' | 'failed') => {
    setEmailLogLoading(true);
    try {
      const res = await api.adminGetEmailLog(filter, targetPage, PAGE_SIZE);
      const typed = res as {
        entries?: EmailLogEntry[];
        totalElements?: number;
        totalPages?: number;
        page?: number;
        totalSent?: number;
        totalFailed?: number;
      } | null;
      setEmailLog(typed?.entries ?? []);
      setTotalPages(typed?.totalPages ?? 0);
      setTotalElements(typed?.totalElements ?? 0);
      setPage(typed?.page ?? targetPage);
      setEmailLogStats({
        totalSent: typed?.totalSent ?? 0,
        totalFailed: typed?.totalFailed ?? 0,
        totalElements: typed?.totalElements ?? 0,
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load email log', 'error');
    } finally {
      setEmailLogLoading(false);
    }
  }, [setEmailLogStats, toast]);

  // Reset to page 0 whenever the filter changes. Do NOT auto-load on mount
  // — the original UX requires an explicit "Load Email Log" click so we
  // don't hammer the DB every time the admin lands on this tab.
  useEffect(() => {
    if (emailLog !== null) {
      loadPage(0, emailLogFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailLogFilter]);

  const openDetail = async (entry: EmailLogEntry) => {
    setSelected({ ...entry });
    setSelectedLoading(true);
    try {
      const res = await api.adminGetEmailLogEntry(entry.id);
      if (res) {
        setSelected(res as EmailLogEntryDetail);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load entry detail', 'error');
    } finally {
      setSelectedLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Email Delivery Log</h2>
            <p className="text-sm text-gray-500">All emails sent: verification, lifecycle, dunning, password reset. Click any row for detail.</p>
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
            {(emailLogStats?.totalFailed ?? 0) > 0 && (
              <button
                type="button"
                disabled={emailLogLoading}
                onClick={async () => {
                  if (!confirm(`Permanently delete ALL failed email entries older than 7 days? Recent failures (last 7 days) stay so you can still triage them.`)) return;
                  try {
                    const res = await api.adminCleanupFailedEmailLog(7);
                    const deleted = (res as { deleted?: number })?.deleted ?? 0;
                    toast(`Cleaned up ${deleted} stale failed entries`, 'success');
                    loadPage(0, emailLogFilter);
                  } catch (err) {
                    toast(err instanceof Error ? err.message : 'Cleanup failed', 'error');
                  }
                }}
                className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-50 disabled:opacity-50"
                title="Bulk-delete failed entries older than 7 days"
              >
                🧹 Clean stale failures
              </button>
            )}
            <button
              type="button"
              disabled={emailLogLoading}
              onClick={() => loadPage(0, emailLogFilter)}
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
            <p className="text-sm mt-1">Shows all outbound emails: verification, lifecycle, dunning, etc. Newest entries first.</p>
          </div>
        ) : emailLog.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No email records found{emailLogFilter !== 'all' ? ` for filter: ${emailLogFilter}` : ''}.</p>
            {emailLogFilter !== 'all' && (
              <button onClick={() => setEmailLogFilter('all')} className="text-[#1B5E20] underline text-sm mt-2">Show all</button>
            )}
          </div>
        ) : (
          <>
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
                    <tr
                      key={entry.id}
                      onClick={() => openDetail(entry)}
                      className={`cursor-pointer transition hover:bg-[#1B5E20]/5 ${entry.status === 'failed' ? 'bg-red-50' : ''}`}
                      title="Click for detail"
                    >
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Page <span className="font-semibold text-gray-700">{page + 1}</span> of{' '}
                  <span className="font-semibold text-gray-700">{totalPages}</span> ·{' '}
                  {totalElements.toLocaleString()} total record{totalElements === 1 ? '' : 's'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 0 || emailLogLoading}
                    onClick={() => loadPage(page - 1, emailLogFilter)}
                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-[#1B5E20] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages - 1 || emailLogLoading}
                    onClick={() => loadPage(page + 1, emailLogFilter)}
                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-[#1B5E20] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <EmailLogDetailDrawer
          entry={selected}
          loading={selectedLoading}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

interface EmailLogDetailDrawerProps {
  entry: EmailLogEntryDetail;
  loading: boolean;
  onClose: () => void;
}

function EmailLogDetailDrawer({ entry, loading, onClose }: EmailLogDetailDrawerProps) {
  return (
    // 2026-05-02 fix: outer-scroll wrapper pattern (see useBodyScrollLock).
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-log-detail-title"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
      <div
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b">
          <div>
            <h2 id="email-log-detail-title" className="text-lg font-bold text-gray-900">
              Email Delivery Detail
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">#{entry.id} · {entry.emailType}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status + timestamp */}
          <div className="flex items-center gap-3">
            {entry.status === 'sent' ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">✓ Sent</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">✗ Failed</span>
            )}
            <span className="text-xs text-gray-500">{fmtDateTimeMs(entry.createdAt)}</span>
          </div>

          {/* Email metadata */}
          <section>
            <h3 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">Email</h3>
            <dl className="grid grid-cols-3 gap-y-2 text-sm">
              <dt className="text-gray-500">Type</dt>
              <dd className="col-span-2 text-gray-800">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {entry.emailType}
                </span>
              </dd>
              <dt className="text-gray-500">Recipient</dt>
              <dd className="col-span-2 font-mono text-gray-800 break-all">{entry.toEmail}</dd>
              <dt className="text-gray-500">Subject</dt>
              <dd className="col-span-2 text-gray-800">{entry.subject || <span className="text-gray-400">—</span>}</dd>
              {entry.errorMessage && (
                <>
                  <dt className="text-red-500">Error</dt>
                  <dd className="col-span-2 text-red-600 whitespace-pre-wrap break-words">{entry.errorMessage}</dd>
                </>
              )}
            </dl>
          </section>

          {/* User enrichment */}
          <section>
            <h3 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">User</h3>
            {loading ? (
              <p className="text-sm text-gray-400">Loading user detail…</p>
            ) : entry.userId == null ? (
              <p className="text-sm text-gray-500 italic">System email — no user account attached.</p>
            ) : entry.userFullName == null && entry.userEmail == null ? (
              <p className="text-sm text-red-500 italic">
                Account with id {entry.userId} no longer exists (deleted). Original recipient address preserved above.
              </p>
            ) : (
              <dl className="grid grid-cols-3 gap-y-2 text-sm">
                <dt className="text-gray-500">User ID</dt>
                <dd className="col-span-2 font-mono text-gray-800">{entry.userId}</dd>
                <dt className="text-gray-500">Name</dt>
                <dd className="col-span-2 text-gray-800">{entry.userFullName || <span className="text-gray-400">—</span>}</dd>
                <dt className="text-gray-500">Email</dt>
                <dd className="col-span-2 font-mono text-gray-800 break-all">
                  {entry.userEmail || <span className="text-gray-400">—</span>}
                  {entry.userEmailVerified === false && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-700">unverified</span>
                  )}
                </dd>
                <dt className="text-gray-500">Phone</dt>
                <dd className="col-span-2 font-mono text-gray-800">{entry.userPhone || <span className="text-gray-400">—</span>}</dd>
                <dt className="text-gray-500">Plan</dt>
                <dd className="col-span-2 text-gray-800">{entry.userPlan || <span className="text-gray-400">free</span>}</dd>
                {entry.userCreatedAt != null && (
                  <>
                    <dt className="text-gray-500">Joined</dt>
                    <dd className="col-span-2 text-gray-800">{fmtDateTimeMs(entry.userCreatedAt)}</dd>
                  </>
                )}
              </dl>
            )}
          </section>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-semibold hover:bg-[#2E7D32]"
          >
            Close
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
