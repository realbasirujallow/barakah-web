'use client';

/**
 * Grant-Trial modal — shown on top of the user detail modal when the admin
 * clicks "Grant Trial". Collects plan (plus/family), duration (1–365 days),
 * and an optional "send notification email" toggle, then hands off to the
 * parent's `onGrant` which calls `api.adminGrantTrial(...)`.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor.
 */

import { useEffect, useRef } from 'react';
import { PRICING } from '../../lib/pricing';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import type { AdminUser } from './adminTypes';

export interface AdminGrantTrialModalProps {
  selected: AdminUser;
  trialPlan: string;
  setTrialPlan: (s: string) => void;
  trialDurationDays: number;
  setTrialDurationDays: (n: number) => void;
  trialSendEmail: boolean;
  setTrialSendEmail: (b: boolean) => void;
  trialGranting: boolean;
  onClose: () => void;
  onGrant: () => void | Promise<void>;
}

export function AdminGrantTrialModal(props: AdminGrantTrialModalProps) {
  const {
    selected,
    trialPlan,
    setTrialPlan,
    trialDurationDays,
    setTrialDurationDays,
    trialSendEmail,
    setTrialSendEmail,
    trialGranting,
    onClose,
    onGrant,
  } = props;

  // Round 26: Escape-key closes. Admin surface but still a modal that can
  // grant paid trials to any user — keyboard dismissal is expected.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Round 27: trap Tab focus inside the modal.
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  // 2026-05-02: lock body scroll while open so the parent modal /
  // user list don't move underneath while granting a trial.
  useBodyScrollLock(true);

  return (
    // 2026-05-02 fix: same wrapper pattern as AdminUserDetailModal —
    // outer fixed wrapper handles scroll, inner flex parent uses
    // min-h-full so the modal anchors to the visible viewport
    // regardless of where the admin was scrolled when they clicked
    // "Grant Trial".
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 z-[60] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grant-trial-title"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl my-8" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex items-start justify-between">
          <h2 id="grant-trial-title" className="text-lg font-bold text-gray-900">Grant Trial</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none" aria-label="Close">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            Grants <strong>{selected.name || selected.email}</strong> a free trial with full access.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Plan</label>
            <div className="space-y-2">
              {[{ value: 'plus', label: `Plus — ${PRICING.plus.monthly}/mo` }, { value: 'family', label: `Family — ${PRICING.family.monthly}/mo` }].map(p => (
                <label key={p.value} className="flex items-center gap-3 p-3 border rounded-lg border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="trialPlan" value={p.value} checked={trialPlan === p.value}
                    onChange={e => setTrialPlan(e.target.value)} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="grant-trial-days" className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
            <input id="grant-trial-days" type="number" min="1" max="365" value={trialDurationDays}
              onChange={e => setTrialDurationDays(Math.min(365, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="sendEmail" checked={trialSendEmail} onChange={e => setTrialSendEmail(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]" />
            <label htmlFor="sendEmail" className="text-sm text-gray-700">Send notification email</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button onClick={onGrant} disabled={trialGranting}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40">
              {trialGranting ? 'Granting…' : 'Grant Trial'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
