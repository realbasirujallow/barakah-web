'use client';

/**
 * 2026-05-18 release-polish (admin-robustness gap #6): reusable
 * "Data fetched X ago" caption for admin pages.
 *
 * Props:
 *   - fetchedAt: epoch ms of the most recent successful load (null → "—")
 *   - onRefresh: optional callback for a small ↻ button next to the caption
 *
 * Re-ticks every 15s so the relative age stays live without re-fetching.
 * Renders nothing if fetchedAt is null and no refresh callback is provided.
 */

import { useEffect, useState } from 'react';

const fmtAge = (ms: number) => {
  const diff = Date.now() - ms;
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  const mins = Math.floor(sec / 60);
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
  fetchedAt: number | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  staleAfterMs?: number; // amber warning threshold (default 5 min)
  className?: string;
}

export default function DataFreshness({
  fetchedAt,
  onRefresh,
  refreshing = false,
  staleAfterMs = 5 * 60 * 1000,
  className = '',
}: Props) {
  // Tick every 15s so the relative caption refreshes without re-render
  // pressure on the parent.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 15000);
    return () => clearInterval(id);
  }, []);

  if (fetchedAt == null && !onRefresh) return null;

  const isStale = fetchedAt != null && Date.now() - fetchedAt > staleAfterMs;
  const ageText = fetchedAt != null ? fmtAge(fetchedAt) : '—';

  // 2026-06-06 (BUG-WEB-HYDRATION-1): outer used to be a <div>, but
  // every admin page mounts <DataFreshness/> inside a <p>-rendered
  // subtitle or under a <span>-flex shell — both invalid HTML wrappers
  // for a <div> with a <button> inside. Next.js logged a hydration
  // error on every admin page load. Switching the outer to <span>
  // with display:inline-flex keeps the visual layout identical (it
  // was a flex row) while making the tree valid HTML (span > span +
  // span > button is fine).
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs text-gray-400 ${className}`}
    >
      <span
        className={isStale ? 'text-amber-700' : ''}
        title={fetchedAt != null ? fmtAbs(fetchedAt) : 'No data loaded yet'}
      >
        {isStale ? '⚠ ' : ''}Data fetched {ageText}
      </span>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="px-1.5 py-0.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          title="Refresh now"
        >
          {refreshing ? '⏳' : '↻'}
        </button>
      )}
    </span>
  );
}
