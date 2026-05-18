'use client';

/**
 * 2026-05-18 release-polish (admin-robustness gap #5): cross-job
 * failure feed for the admin Overview tab.
 *
 * UNIONs failures from halal_screening_runs (failed | skipped),
 * email_retry_queue (abandoned), and lifecycle_campaign_deliveries
 * (non-sent) over the last 24h. Lets admin spot a stuck cron / Resend
 * outage / lifecycle-campaign misfire without grepping Railway logs.
 *
 * Hidden if the user isn't admin (the underlying endpoint returns 403).
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface HalalRow {
  id: number;
  started_at: number;
  finished_at: number | null;
  status: string;
  symbols_checked: number;
  failure_reason: string | null;
}
interface EmailRow {
  id: number;
  to_email: string;
  email_type: string;
  subject: string;
  attempts: number;
  last_error: string | null;
  status: string;
  updated_at: number;
}
interface LcRow {
  id: number;
  campaign_id: number;
  user_id: number;
  status: string;
  error_message: string | null;
  created_at: number;
}
interface FailuresResponse {
  windowHours: number;
  limitPerSource: number;
  fetchedAt: number;
  totalFailures: number;
  halalScreening: HalalRow[];
  emailAbandoned: EmailRow[];
  lifecycleFailed: LcRow[];
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
const truncate = (s: string | null, n = 80) =>
  !s ? '' : s.length > n ? s.substring(0, n) + '…' : s;

export default function AdminJobHealthCard() {
  const [data, setData] = useState<FailuresResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hours, setHours] = useState(24);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.getAdminJobFailures(hours, 50);
      if (r?.error) {
        setHidden(true);
      } else {
        setData(r as FailuresResponse);
      }
    } catch {
      // Silent — admin will see empty card; logs are the diag tool.
    } finally {
      setLoading(false);
    }
  }, [hours]);

  useEffect(() => { load(); }, [load]);

  if (hidden) return null;

  const total = data?.totalFailures ?? 0;
  const badgeClass = total === 0
    ? 'bg-green-100 text-green-800'
    : total < 10
    ? 'bg-amber-100 text-amber-800'
    : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-2xl p-5 border">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="font-semibold text-gray-700 text-sm">
            Job Health
            {data && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                {total} {total === 1 ? 'failure' : 'failures'} in last {hours}h
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Halal-screening + email-retry + lifecycle-delivery failures across the DB-tracked async jobs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={hours}
            onChange={e => setHours(Number(e.target.value))}
            className="text-xs border border-gray-300 rounded-md px-2 py-1"
            aria-label="Time window"
          >
            <option value={1}>1h</option>
            <option value={6}>6h</option>
            <option value={24}>24h</option>
            <option value={72}>3d</option>
            <option value={168}>7d</option>
          </select>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            ↻
          </button>
        </div>
      </div>

      {data && total === 0 && (
        <p className="text-xs text-gray-500 italic">
          All async jobs healthy over the last {hours}h. ✓
        </p>
      )}

      {data && total > 0 && (
        <div className="space-y-3">
          {data.halalScreening.length > 0 && (
            <details open>
              <summary className="cursor-pointer text-xs font-medium text-gray-700">
                Halal screening: {data.halalScreening.length}
              </summary>
              <ul className="mt-2 space-y-1 text-xs">
                {data.halalScreening.map(r => (
                  <li key={r.id} className="border-l-2 border-red-300 pl-2 py-0.5">
                    <span className="text-gray-500">{fmtAge(r.started_at)}</span>
                    {' · '}
                    <span className="font-medium text-red-800">{r.status}</span>
                    {' · '}
                    <span className="text-gray-700">{r.symbols_checked} symbols</span>
                    {r.failure_reason && (
                      <div className="text-gray-600 mt-0.5">{truncate(r.failure_reason)}</div>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {data.emailAbandoned.length > 0 && (
            <details open>
              <summary className="cursor-pointer text-xs font-medium text-gray-700">
                Email (abandoned after retries): {data.emailAbandoned.length}
              </summary>
              <ul className="mt-2 space-y-1 text-xs">
                {data.emailAbandoned.map(r => (
                  <li key={r.id} className="border-l-2 border-red-300 pl-2 py-0.5">
                    <span className="text-gray-500">{fmtAge(r.updated_at)}</span>
                    {' · '}
                    <span className="font-medium text-gray-700">{r.email_type}</span>
                    {' · '}
                    <span className="text-gray-500 break-all">to {r.to_email}</span>
                    {' · '}
                    <span className="text-gray-500">{r.attempts} attempts</span>
                    {r.last_error && (
                      <div className="text-gray-600 mt-0.5">{truncate(r.last_error)}</div>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {data.lifecycleFailed.length > 0 && (
            <details>
              <summary className="cursor-pointer text-xs font-medium text-gray-700">
                Lifecycle campaign delivery: {data.lifecycleFailed.length}
              </summary>
              <ul className="mt-2 space-y-1 text-xs">
                {data.lifecycleFailed.map(r => (
                  <li key={r.id} className="border-l-2 border-amber-300 pl-2 py-0.5">
                    <span className="text-gray-500">{fmtAge(r.created_at)}</span>
                    {' · '}
                    campaign #{r.campaign_id} → user #{r.user_id}
                    {' · '}
                    <span className="font-medium text-amber-800">{r.status}</span>
                    {r.error_message && (
                      <div className="text-gray-600 mt-0.5">{truncate(r.error_message)}</div>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {data && (
        <p className="text-[10px] text-gray-400 mt-3">
          Data fetched {fmtAge(data.fetchedAt)}.
        </p>
      )}
    </div>
  );
}
