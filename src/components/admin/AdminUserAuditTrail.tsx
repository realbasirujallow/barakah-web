'use client';

/**
 * 2026-05-18 release-polish (admin gap #1): per-user audit trail panel.
 *
 * Embedded inside AdminUserDetailModal between the grant-trial /
 * activity-counts area and AdminUserNotesPanel. Reads from
 * GET /admin/audit/user/{userId}, surfaces who did what to this user
 * with timestamps + ip + support-session correlation. Renders nothing
 * if the actor isn't permitted (RBAC 403) so non-audit admins don't
 * see an empty section.
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface AuditRow {
  id: number;
  timestamp: number;
  actorUserId: number;
  actorName: string;
  action: string;
  permissionRequired: string | null;
  success: boolean;
  failureReason: string | null;
  supportSessionId: number | null;
  ipAddress: string | null;
  userAgentShort: string | null;
  detailsJson: string | null;
}

interface AuditResponse {
  userId: number;
  count: number;
  rows: AuditRow[];
}

const fmtAge = (ms: number) => {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const fmtAbs = (ms: number) =>
  new Date(ms).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

interface Props {
  userId: number;
}

export default function AdminUserAuditTrail({ userId }: Props) {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.getAdminUserAuditLog(userId, 20);
      if (r?.error) {
        // Most likely 403 — admin doesn't have admin.audit.view permission.
        // Just hide the section quietly rather than showing a noisy error.
        setHidden(true);
      } else {
        setData(r as AuditResponse);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load audit trail');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  if (hidden) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Audit trail
          {data && (
            <span className="ml-2 text-xs text-gray-400">
              ({data.count} recent {data.count === 1 ? 'action' : 'actions'})
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="text-xs text-primary hover:underline disabled:opacity-50"
        >
          ↻ Refresh
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Actions where this user was the target — plan changes, password resets,
        impersonations, role grants, etc. Append-only.
      </p>

      {loading && <p className="text-xs text-gray-400">Loading…</p>}
      {error && <p className="text-xs text-red-600">Error: {error}</p>}

      {data && data.rows.length === 0 && (
        <p className="text-xs text-gray-400 italic">
          No audit entries — no admin has acted on this user.
        </p>
      )}

      {data && data.rows.length > 0 && (
        <ul className="space-y-2">
          {data.rows.map(row => (
            <li
              key={row.id}
              className={`text-xs border-l-2 pl-3 py-1 ${
                row.success === false
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-800">{row.action}</span>
                  {row.success === false && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-medium">
                      FAILED
                    </span>
                  )}
                  {row.supportSessionId && (
                    <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-medium">
                      support#{row.supportSessionId}
                    </span>
                  )}
                </div>
                <span
                  className="text-gray-400 whitespace-nowrap"
                  title={fmtAbs(row.timestamp)}
                >
                  {fmtAge(row.timestamp)}
                </span>
              </div>
              <div className="text-gray-500 mt-0.5">
                by <span className="text-gray-700">{row.actorName}</span>
                {row.ipAddress && <span className="text-gray-400"> · {row.ipAddress}</span>}
                {row.permissionRequired && (
                  <span className="text-gray-400"> · {row.permissionRequired}</span>
                )}
              </div>
              {row.failureReason && (
                <div className="text-red-700 mt-0.5">{row.failureReason}</div>
              )}
              {row.detailsJson && (
                <details className="mt-1">
                  <summary className="cursor-pointer text-primary text-[11px]">
                    details
                  </summary>
                  <pre className="mt-1 text-[10px] text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                    {row.detailsJson}
                  </pre>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
