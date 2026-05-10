'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getSupportMeta,
  clearSupportToken,
  reasonCodeLabel,
  type SupportSessionMeta,
} from '../lib/supportSession';
import { apiFetch } from '../lib/api';

/**
 * Persistent support-mode banner. Renders nothing when not in support
 * mode. Shows target user, reason, countdown, and an Exit CTA.
 */
export default function SupportModeBanner() {
  const [meta, setMeta] = useState<SupportSessionMeta | null>(() => getSupportMeta());
  const [now, setNow] = useState<number>(() => Date.now());
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const onChange = () => setMeta(getSupportMeta());
    window.addEventListener('barakah:support-mode-changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('barakah:support-mode-changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  useEffect(() => {
    if (!meta) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (meta.expiresAt && t > meta.expiresAt) {
        // 2026-05-10 (View-as-user fix): on natural expiry, also force
        // a reload so AuthContext re-mounts and re-reads the founder's
        // own cached profile from localStorage. Without this, the
        // impersonated user object in AuthContext.user state stays
        // visible to the founder even after the session expires.
        clearSupportToken();
        setMeta(null);
        try { window.location.reload(); } catch { /* SSR safety */ }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [meta]);

  const exit = useCallback(async () => {
    if (!meta) return;
    setExiting(true);
    try {
      await apiFetch(`/admin/support-sessions/${meta.sessionId}/end`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'admin_exited' }),
      }).catch(() => {});
    } finally {
      clearSupportToken();
      setMeta(null);
      setExiting(false);
      window.location.reload();
    }
  }, [meta]);

  if (!meta) return null;

  const remainingMs = Math.max(0, meta.expiresAt - now);
  const min = Math.floor(remainingMs / 60000);
  const sec = Math.floor((remainingMs % 60000) / 1000);
  const countdown = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  const target = meta.targetEmail || meta.targetName || `User #${meta.targetUserId}`;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="sticky top-0 z-50 w-full bg-amber-100 border-b-2 border-amber-500 px-4 py-3 text-amber-900 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700"
      data-testid="support-mode-banner"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 text-sm">
        <span aria-hidden className="text-lg">🛟</span>
        <span className="font-bold tracking-wide">SUPPORT MODE</span>
        <span>
          Viewing as <strong>{target}</strong>. Actions are audited.
        </span>
        <span className="opacity-80">
          Reason: <strong>{reasonCodeLabel(meta.reasonCode)}</strong> · Mode:{' '}
          <strong>{meta.mode}</strong> · Expires in{' '}
          <strong className="font-mono">{countdown}</strong>
        </span>
        <button
          type="button"
          onClick={exit}
          disabled={exiting}
          className="ml-auto px-3 py-1 rounded-md bg-amber-700 text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 dark:bg-amber-100 dark:text-amber-900 dark:hover:bg-amber-200"
          data-testid="support-mode-exit"
        >
          {exiting ? 'Exiting…' : 'Exit support mode'}
        </button>
      </div>
    </div>
  );
}
