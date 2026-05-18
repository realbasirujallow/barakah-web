'use client';

/**
 * 2026-05-18 release-polish (admin-robustness gap #7): drill-down sheet
 * that opens when the founder clicks "Who's here?" on a funnel stage.
 *
 * Lists up to N users sitting at the stage in the current window, with
 * email / plan / signup-age + a deep link to the user detail modal on
 * /dashboard/admin (?focusUser=ID), matching the same param the rest
 * of the admin UI uses for cross-page user navigation.
 */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  plan: string | null;
  subscriptionStatus: string | null;
  createdAt: number;
}

interface StageResponse {
  stage: string;
  windowDays: number;
  totalInStage: number;
  returnedCount: number;
  users: UserRow[];
}

const fmtAge = (ms: number) => {
  const days = Math.floor((Date.now() - ms) / (24 * 60 * 60 * 1000));
  if (days < 1) return 'today';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
};

interface Props {
  stageName: string;
  stageLabel: string;
  days: number;
  onClose: () => void;
}

export default function FunnelStageDrilldown({ stageName, stageLabel, days, onClose }: Props) {
  const [data, setData] = useState<StageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api.getAdminFunnelUsersInStage(stageName, days, 50);
      if (r?.error) {
        setError(String(r.error));
      } else {
        setData(r as StageResponse);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load stage cohort');
    } finally {
      setLoading(false);
    }
  }, [stageName, days]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/30">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close drilldown"
      />
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Funnel stage</p>
            <h2 className="text-lg font-semibold text-primary mt-0.5">{stageLabel}</h2>
            <p className="text-xs text-gray-400 mt-1">
              Distinct users at this stage in the last {days}d
              {data && (
                <span>
                  {' '}· showing {data.returnedCount} of {data.totalInStage.toLocaleString()}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {loading && <p className="text-sm text-gray-500">Loading…</p>}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
          {data && data.users.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No users at this stage in the current window.
            </p>
          )}
          {data && data.users.length > 0 && (
            <ul className="space-y-2">
              {data.users.map(u => (
                <li
                  key={u.id}
                  className="border border-gray-100 rounded-lg p-3 hover:border-primary transition"
                >
                  <Link
                    href={`/dashboard/admin?focusUser=${u.id}`}
                    className="block"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate flex-1">
                        {u.name || u.email}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {fmtAge(u.createdAt)}
                      </span>
                    </div>
                    {u.name && (
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                        {u.plan || 'free'}
                      </span>
                      {u.subscriptionStatus && u.subscriptionStatus !== 'inactive' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          {u.subscriptionStatus}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {data && data.totalInStage > data.returnedCount && (
            <p className="text-xs text-gray-400 mt-4 italic">
              Showing the first {data.returnedCount} of {data.totalInStage.toLocaleString()}.
              Increase the window or filter to narrow further.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
