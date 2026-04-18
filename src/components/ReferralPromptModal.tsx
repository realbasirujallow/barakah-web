'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { useFocusTrap } from '../lib/useFocusTrap';
import { REFERRAL_MODAL_LEAD } from '../lib/referralCopy';

const STORAGE_KEY = 'barakah_referral_prompted';

function safeGetItem(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

export function useReferralPrompt() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (safeGetItem(STORAGE_KEY) !== 'true') {
      // Small delay so dashboard renders first
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);
  const dismiss = useCallback(() => {
    setShow(false);
    safeSetItem(STORAGE_KEY, 'true');
  }, []);
  return { show, dismiss };
}

interface Props {
  onDismiss: () => void;
}

export default function ReferralPromptModal({ onDismiss }: Props) {
  const [code, setCode] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getReferralCode().then((data: Record<string, unknown>) => {
      if (data?.referralCode) setCode(data.referralCode as string);
      if (data?.shareUrl) setShareUrl(data.shareUrl as string);
    }).catch(() => {
      // BUG FIX: if we can't load the referral code, there's nothing useful
      // to show — auto-dismiss rather than leaving a broken empty modal.
      //
      // Round 25: also persist the dismiss so an offline user doesn't get
      // the modal re-opened on every future dashboard mount (infinite
      // loop for degraded-network users).
      safeSetItem(STORAGE_KEY, 'true');
      onDismiss();
    });
  }, [onDismiss]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Track the share event
      api.lifecycleTrackEvent?.('referral_shared', { method: 'copy', source: 'onboarding_modal' }).catch(() => {});
      // Round 25: persist the dismiss once the user has acted — a
      // successful share is the primary "goal" of the modal; re-showing
      // it on every future mount is nagging. Delay closing so the user
      // sees "✓ Link Copied!" before we disappear.
      safeSetItem(STORAGE_KEY, 'true');
      setTimeout(() => onDismiss(), 1200);
    } catch { /* clipboard API not available */ }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Assalamu Alaikum! I just started using Barakah to manage my finances the halal way — zakat calculator, hawl tracker, budgets & more. Try it free: ${shareUrl}`
    );
    // Round 25: `noopener,noreferrer` to prevent tabnabbing on the
    // wa.me target (it could otherwise manipulate `window.opener`).
    // Anchor tags across the codebase set rel=noopener; this scripted
    // open was missed.
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
    api.lifecycleTrackEvent?.('referral_shared', { method: 'whatsapp', source: 'onboarding_modal' }).catch(() => {});
    // Round 25: persist the dismiss — the WhatsApp share is the modal's
    // primary success path; without setting STORAGE_KEY the modal
    // reappeared on every future dashboard visit.
    safeSetItem(STORAGE_KEY, 'true');
    onDismiss();
  };

  const handleDismiss = () => {
    safeSetItem(STORAGE_KEY, 'true');
    onDismiss();
  };

  // Round 24: Escape key closes the modal, matching R18/H-10 pattern on
  // SessionTimeoutModal + AnnualUpgradeModal. Handler uses a ref-free
  // closure since handleDismiss's identity doesn't matter (effect only
  // runs once with cleanup).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        safeSetItem(STORAGE_KEY, 'true');
        onDismiss();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  // Round 29: trap Tab focus inside the modal so keyboard users don't
  // leak focus to the marketing page behind and accidentally click a
  // "Continue" on a product-card they can't see.
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-prompt-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pt-6 text-center animate-in fade-in zoom-in duration-300 relative max-h-[90vh] overflow-y-auto">
        {/* Close X — always visible, always tappable. Round 30: mobile Safari users
            on small screens (iPhone SE / mini) reported the "Maybe Later" button
            at the bottom being clipped by browser chrome + a floating feedback
            widget, trapping them on this modal. The top-right X is a guaranteed
            escape that is above the fold on every viewport. */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl leading-none"
        >
          ✕
        </button>

        {/* Mosque icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4 mt-2">
          🕌
        </div>

        <h2 id="referral-prompt-title" className="text-2xl font-bold text-[#1B5E20] mb-2">
          Share Barakah with Your Family
        </h2>

        {/* Round 32: copy constants imported from lib/referralCopy.ts so the
            backend reward contract stays in sync with every UI surface. */}
        <p className="text-gray-600 mb-6">
          {REFERRAL_MODAL_LEAD.prefix}<strong>{REFERRAL_MODAL_LEAD.referrerSegment}</strong>{REFERRAL_MODAL_LEAD.middle}<strong>{REFERRAL_MODAL_LEAD.refereeSegment}</strong>{REFERRAL_MODAL_LEAD.suffix}
        </p>

        {/* Referral code display */}
        {code && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Your referral code</p>
            <p className="text-2xl font-mono font-bold text-[#1B5E20] tracking-wider">{code}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#20bd5a] transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share via WhatsApp
          </button>

          <button
            onClick={handleCopy}
            className="w-full bg-[#1B5E20] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2E7D32] transition"
          >
            {copied ? '✓ Link Copied!' : '📋 Copy Referral Link'}
          </button>

          <button
            onClick={handleDismiss}
            className="w-full text-gray-400 py-2 text-sm hover:text-gray-600 transition"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          You can always find your referral link in Settings → Refer a Friend
        </p>
      </div>
    </div>
  );
}
