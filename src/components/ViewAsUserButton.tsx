'use client';

import { useState, useCallback, useId } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  REASON_CODES,
  reasonCodeLabel,
  setSupportToken,
  type ReasonCode,
} from '../lib/supportSession';

interface Props {
  targetUserId: number;
  targetEmail?: string;
  targetName?: string;
  redirectTo?: string;
}

/** "View as user" CTA visible only to SUPER_ADMIN. */
export default function ViewAsUserButton({
  targetUserId,
  targetEmail,
  targetName,
  redirectTo = '/dashboard',
}: Props) {
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin === true;

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReasonCode>('customer_support');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogId = useId();
  const reasonId = useId();
  const noteId = useId();

  const start = useCallback(async () => {
    setError(null);
    setSubmitting(true);
    try {
      const resp = (await apiFetch('/admin/support-sessions/start', {
        method: 'POST',
        body: JSON.stringify({
          targetUserId,
          reasonCode: reason,
          reasonNote: note.trim() || undefined,
          mode: 'VIEW_ONLY',
        }),
      })) as {
        sessionId: number;
        targetUserId: number;
        mode: 'VIEW_ONLY';
        reasonCode: string;
        startedAt: number;
        expiresAt: number;
        supportToken: string;
        supportTokenExpiresAt: number;
      };

      setSupportToken(resp.supportToken, {
        sessionId: resp.sessionId,
        targetUserId: resp.targetUserId,
        targetEmail,
        targetName,
        reasonCode: resp.reasonCode,
        reasonNote: note.trim() || undefined,
        mode: 'VIEW_ONLY',
        startedAt: resp.startedAt,
        expiresAt: resp.expiresAt,
      });

      window.location.href = redirectTo;
    } catch (e) {
      const msg = (e as Error).message || 'failed_to_start_session';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [targetUserId, targetEmail, targetName, reason, note, redirectTo]);

  if (!isSuperAdmin) return null;

  const requiresNote = reason === 'other_with_note_required';
  const noteValid = !requiresNote || note.trim().length >= 10;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-amber-600 bg-white text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-amber-300 dark:hover:bg-amber-950"
        data-testid="view-as-user-button"
        aria-haspopup="dialog"
        aria-controls={dialogId}
      >
        <span aria-hidden>🛟</span>
        View as user
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${dialogId}-title`}
          aria-describedby={`${dialogId}-desc`}
          id={dialogId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-900">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 id={`${dialogId}-title`} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Start support session
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <p id={`${dialogId}-desc`} className="text-sm text-gray-700 dark:text-gray-300">
                You are about to view this account as a support action.
                <strong> This is audited.</strong> The session is read-only,
                expires in 15 minutes, and shows a banner across the app.
              </p>
              {(targetEmail || targetName) && (
                <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  Target user: <strong>{targetName || targetEmail || `User #${targetUserId}`}</strong>
                </div>
              )}
              <div>
                <label htmlFor={reasonId} className="block text-sm font-medium text-gray-800 dark:text-gray-200">Reason</label>
                <select
                  id={reasonId}
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReasonCode)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  data-testid="view-as-user-reason"
                >
                  {REASON_CODES.map((rc: ReasonCode) => (
                    <option key={rc} value={rc}>{reasonCodeLabel(rc)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={noteId} className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Note {requiresNote && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  id={noteId}
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={requiresNote
                    ? 'Required when reason is "Other". Describe specifically what you are investigating.'
                    : 'Optional. Free-form context for the audit log.'}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  data-testid="view-as-user-note"
                />
                {requiresNote && note.trim().length < 10 && (
                  <p className="mt-1 text-xs text-red-600">Note must be at least 10 characters.</p>
                )}
              </div>
              {error && (
                <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >Cancel</button>
              <button
                type="button"
                onClick={start}
                disabled={submitting || !noteValid}
                className="px-3 py-2 rounded-md text-sm bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                data-testid="view-as-user-confirm"
              >{submitting ? 'Starting…' : 'Start support mode'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
