'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { trackReferralShare } from '../lib/analytics';
import { logError } from '../lib/logError';

/**
 * Shareable-moment button for zakat receipts and similar milestones.
 *
 * When a user finishes something meaningful (calculating zakat, paying
 * zakat, generating a receipt), the act itself is a natural sharing
 * impulse — especially zakat, which is a form of daʿwah. This button
 * wraps the share flow in a one-click UI that:
 *
 *   - fetches the user's referralCode + shareUrl (cached in component state)
 *   - opens the native share sheet on mobile (falls back to WhatsApp / copy)
 *   - fires trackReferralShare(method) → GA4
 *   - fires a REFERRAL_SHARED lifecycle event server-side with `source`
 *     so the admin funnel can measure viral K-factor by surface.
 *
 * The pitch text is passed in by the caller so each moment can feel native
 * (e.g. zakat uses "Assalamu alaykum — I just calculated my zakat…").
 */

interface ReferralData {
  referralCode: string;
  shareUrl: string;
}

interface Props {
  /** Source tag for analytics — e.g. "zakat_receipt", "hawl_completion". */
  source: string;
  /** Share title (used by native share sheet + some apps that read it). */
  title: string;
  /**
   * Pitch text. Keep it short enough that the final link isn't truncated on
   * WhatsApp / Twitter. Don't include the URL — the component appends it.
   */
  pitch: string;
  /** Optional button label override. Defaults to "Share". */
  label?: string;
  /** Tailwind classes for the outer button — caller controls size/color. */
  className?: string;
}

export default function ShareReceiptButton({ source, title, pitch, label, className }: Props) {
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.getReferralCode()
      .then((d) => { if (!cancelled) setReferral(d as ReferralData); })
      .catch((err) => {
        logError(err, { context: 'ShareReceiptButton: failed to fetch referral code', source });
      });
    return () => { cancelled = true; };
  }, [source]);

  const fireLifecycle = (method: string) => {
    try { trackReferralShare(method); } catch { /* GA4 unavailable */ }
    // Fire-and-forget server-side lifecycle event for admin funnel aggregation.
    // If the user bails between render and click this still captures intent.
    api.lifecycleTrackEvent?.('referral_shared', { method, source }, 'web')
      .catch((err: unknown) => {
        logError(err, { context: 'ShareReceiptButton: lifecycle event failed', source, method });
      });
  };

  const handleClick = async () => {
    // HIGH BUG FIX (H-8): previously we'd fetch /referral-code, call
    // setReferral(), then fall through to `referral ?? (await api...)` — but
    // setState is asynchronous, so on the very first click the `referral`
    // reference read below was still null and we'd re-fetch. Capture the
    // freshly-fetched value in a local variable so we issue exactly one
    // network request per click.
    let ref = referral;
    if (!ref) {
      setLoading(true);
      try {
        const fetched = await api.getReferralCode() as ReferralData;
        setReferral(fetched);
        ref = fetched;
      } catch (err) {
        logError(err, { context: 'ShareReceiptButton: on-click fetch failed', source });
        return;
      } finally {
        setLoading(false);
      }
    }

    if (!ref) {
      // Fetch failed silently; abort — the catch above already logged.
      return;
    }

    // Try native share sheet first — best on mobile. The text field gets
    // the pitch; the URL is passed separately so the receiving app can
    // preview the link.
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text: pitch, url: ref.shareUrl });
        fireLifecycle('native');
        return;
      } catch {
        // User canceled or native share failed — fall through to menu.
      }
    }

    // Desktop / no native share → open a menu for explicit method choice.
    setOpen(true);
  };

  const copy = async () => {
    if (!referral) return;
    const shareText = `${pitch}\n\n${referral.shareUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      fireLifecycle('copy');
    } catch {
      // Clipboard API unavailable (insecure context) — leave the button as-is.
    }
  };

  const whatsAppHref = referral
    ? `https://wa.me/?text=${encodeURIComponent(`${pitch}\n${referral.shareUrl}`)}`
    : '#';

  const defaultBtnCls =
    'px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm disabled:opacity-60';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className ?? defaultBtnCls}
        aria-label={label ?? 'Share'}
      >
        {loading ? 'Loading…' : `📤 ${label ?? 'Share'}`}
      </button>

      {open && referral && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20"
          onMouseLeave={() => setOpen(false)}
        >
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { fireLifecycle('whatsapp'); setOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-sm text-gray-800"
          >
            <span className="text-lg">💬</span>
            WhatsApp
          </a>
          <button
            type="button"
            onClick={copy}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-sm text-gray-800"
          >
            <span className="text-lg">📋</span>
            {copied ? 'Copied!' : 'Copy share text'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-500"
          >
            <span className="text-lg">✕</span>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
