'use client';

/**
 * Admin audit-log viewer — reads the `audit_logs` table written by the
 * backend AuditService (ADMIN_* campaign save/send/test, note create/delete,
 * impersonation, plan/email/trial changes, etc.). Previously there was no UI
 * to review this trail.
 *
 * Backend: GET /admin/audit-log?page=&size=&action=&actorId=  (admin-only).
 *
 * Mirrors the chrome of /dashboard/admin/notes (back link, admin guard,
 * loading/empty/error). All user-facing strings localized via t('auditLog…').
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';
import { useAuth } from '../../../../context/AuthContext';
import { useI18n } from '../../../../lib/i18n';

interface AuditRow {
  id: number;
  actorId: number | null;
  action: string;
  detail: string | null;
  ip: string | null;
  createdAt: number; // epoch millis
}

interface AuditLogResponse {
  rows: AuditRow[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const PAGE_SIZE = 50;

// Curated list of ADMIN_* action types this viewer primarily surfaces. The
// audit_logs table also holds auth/bill/zakat events; the dropdown focuses on
// the admin trail but still shows whatever the active filter selects.
const ACTION_OPTIONS = [
  'ADMIN_SAVE_CAMPAIGN',
  'ADMIN_SEND_CAMPAIGN',
  'ADMIN_SEND_CAMPAIGN_TEST',
  'ADMIN_BROADCAST_NOTIFICATION',
  'ADMIN_CREATE_NOTE',
  'ADMIN_DELETE_NOTE',
  'ADMIN_UPDATE_PLAN',
  'ADMIN_GRANT_TRIAL',
  'ADMIN_ISSUE_COUPON',
  'ADMIN_UPDATE_EMAIL',
  'ADMIN_VERIFY_EMAIL',
  'ADMIN_RESET_PASSWORD',
  'ADMIN_RESEND_VERIFICATION',
  'ADMIN_DELETE_USER',
  'ADMIN_WIPE_FINANCIAL_DATA',
  'ADMIN_EDIT_USER_TRANSACTION',
  'ADMIN_DELETE_USER_TRANSACTION',
  'ADMIN_EDIT_USER_ASSET',
  'ADMIN_VIEW_USER_ZAKAT',
  'ADMIN_VIEW_USER_TRANSACTIONS',
  'ADMIN_VIEW_USER_ASSETS',
  'ADMIN_VIEW_USER_JOURNEY',
] as const;

export default function AdminAuditLogPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<AuditLogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [action, setAction] = useState('');

  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  // Reset to first page whenever the filter changes so the user isn't left on
  // an out-of-range page after narrowing the result set.
  useEffect(() => {
    setPage(0);
  }, [action]);

  useEffect(() => {
    if (isAuthLoading || !user || !isAdmin) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = (await api.adminGetAuditLog(
          page,
          PAGE_SIZE,
          action || undefined,
        )) as AuditLogResponse;
        if (!cancelled) setData(res ?? null);
      } catch (err) {
        logError(err, { context: 'Failed to load admin audit log' });
        if (!cancelled) {
          setError(true);
          toast(t('auditLogLoadError'), 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page, action, isAdmin, isAuthLoading, toast, user, t]);

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  const rows = data?.rows ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const hasPrev = page > 0;
  const hasNext = totalPages > 0 && page < totalPages - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-4"
        >
          <span aria-hidden="true">←</span>
          {t('auditLogBack')}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('auditLogTitle')}</h1>
          <p className="text-sm text-gray-600 mb-4">{t('auditLogSubtitle')}</p>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label
                className="block text-xs font-medium text-gray-700 mb-1"
                htmlFor="filter-action"
              >
                {t('auditLogFilterAction')}
              </label>
              <select
                id="filter-action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
              >
                <option value="">{t('auditLogAllActions')}</option>
                {ACTION_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            {action && (
              <button
                type="button"
                onClick={() => setAction('')}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
              >
                {t('auditLogClearFilter')}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">{t('auditLogEntries')}</h2>
            <span className="text-xs text-gray-500">
              {loading ? '…' : `${totalElements}`}
            </span>
          </div>

          {loading && (
            <p className="text-sm text-gray-400 py-6 text-center">{t('auditLogLoading')}</p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-500 py-6 text-center">{t('auditLogLoadError')}</p>
          )}

          {!loading && !error && rows.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">{t('auditLogEmpty')}</p>
          )}

          {!loading && !error && rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-3 font-medium">{t('auditLogColTime')}</th>
                    <th className="py-2 pr-3 font-medium">{t('auditLogColActor')}</th>
                    <th className="py-2 pr-3 font-medium">{t('auditLogColAction')}</th>
                    <th className="py-2 pr-3 font-medium">{t('auditLogColDetail')}</th>
                    <th className="py-2 pr-3 font-medium">{t('auditLogColIp')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 align-top">
                      <td className="py-2 pr-3 whitespace-nowrap text-gray-500 text-xs">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 whitespace-nowrap text-gray-700">
                        {r.actorId != null ? `#${r.actorId}` : '—'}
                      </td>
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-[#1B5E20]/10 text-[#1B5E20] text-xs font-medium">
                          {r.action}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-gray-800 break-words max-w-md">
                        {r.detail || '—'}
                      </td>
                      <td className="py-2 pr-3 whitespace-nowrap text-gray-500 text-xs font-mono">
                        {r.ip || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
              >
                {t('auditLogPrev')}
              </button>
              <span className="text-xs text-gray-500">
                {t('auditLogPageOf')
                  .replace('{page}', String(page + 1))
                  .replace('{total}', String(totalPages))}
              </span>
              <button
                type="button"
                disabled={!hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
              >
                {t('auditLogNext')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
