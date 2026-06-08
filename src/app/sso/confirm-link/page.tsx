'use client';

/**
 * 2026-06-07 SEC-AUTH-1: consumer page for the Google-SSO confirmation
 * email. EmailService.sendSsoLinkConfirmationEmail issues a link of the
 * shape `https://trybarakah.com/sso/confirm-link#token=...` — this page
 * reads that fragment, hands the raw token to backend
 * GET /auth/google/confirm-link?token=..., and shows success/error.
 *
 * On success the user is invited to sign in with Google now; the next
 * /auth/google attempt for this account mints tokens normally because
 * sso_linked_at is now set.
 *
 * Token-handling pattern (R7/R8 audit) mirrors /reset-password and
 * /verify-email: fragment → React state → scrub from address bar →
 * single backend hit on mount. No retries.
 */

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { readTokenFromUrl, scrubTokenFromUrl } from '../../../lib/scrubUrlToken';

type Phase = 'verifying' | 'success' | 'error';

function ConfirmSsoLinkInner() {
  const [phase, setPhase] = useState<Phase>('verifying');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 2026-06-07 v2: email clients always open links in a NEW tab — we
  // can't control that — so the user ends up with TWO Barakah tabs:
  //   (A) /login (the original, showing "check your email")
  //   (B) /sso/confirm-link (this one, opened by the email)
  // Goal: collapse the experience to feel like ONE tab. Strategy:
  //   1. On success here in tab B, broadcast "ssoConfirmed" via
  //      BroadcastChannel('barakah-sso'). Same-origin tabs on /login
  //      (which subscribes — see GoogleSignInButton.tsx) receive the
  //      message and immediately fire GIS One-Tap inside tab A.
  //   2. Try window.close() — works if the browser allows scripted
  //      close (email-opened tabs sometimes do, sometimes don't).
  //   3. If close was blocked, fall back to auto-bouncing THIS tab
  //      to /login?ssoAuto=1 so the user still ends up signed in
  //      even if tab A wasn't there (e.g. they're on a different
  //      device and only have the email).
  useEffect(() => {
    if (phase !== 'success') return;
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('barakah-sso');
        bc.postMessage({ type: 'ssoConfirmed', at: Date.now() });
      }
      // Storage-event fallback for browsers without BroadcastChannel.
      // Setting + immediately removing a localStorage key fires a
      // `storage` event in every OTHER same-origin tab.
      const k = 'barakah-sso-confirmed-at';
      localStorage.setItem(k, String(Date.now()));
      localStorage.removeItem(k);
    } catch { /* private mode / Safari quirks — silent */ }

    // Try to close this tab. Works if window.opener is set OR if the
    // browser allows scripted close on tabs that navigated here from
    // outside. Many browsers block this — that's why we have the
    // fallback below.
    let closeAttemptOk = false;
    try { window.close(); closeAttemptOk = true; } catch { /* blocked */ }

    // If close didn't take effect within 1s, fall back to in-tab
    // auto-bounce so the user still ends up signed in.
    const fallback = setTimeout(() => {
      if (!document.hidden) {
        router.replace('/login?ssoAuto=1');
      }
    }, closeAttemptOk ? 1000 : 2500);

    return () => {
      try { bc?.close(); } catch { /* no-op */ }
      clearTimeout(fallback);
    };
  }, [phase, router]);

  useEffect(() => {
    const token = readTokenFromUrl('token');
    if (!token) {
      setPhase('error');
      setMessage(
        'This confirmation link is missing its token. Please open the link from your email exactly as it was sent.',
      );
      return;
    }
    // Scrub the token from the address bar before doing anything else —
    // prevents history / screenshot / copy-paste leaks (R7).
    scrubTokenFromUrl('token');

    let cancelled = false;
    (async () => {
      try {
        const res = await api.confirmSsoLink(token);
        if (cancelled) return;
        if (res?.success === true) {
          setPhase('success');
          setMessage(
            typeof res.message === 'string' && res.message
              ? res.message
              : 'Google sign-in is now enabled for your account. You can sign in with Google.',
          );
        } else {
          setPhase('error');
          setMessage(
            typeof res?.error === 'string' && res.error
              ? res.error
              : 'This link is no longer valid. Please return to the sign-in page and try Google again.',
          );
        }
      } catch (e) {
        if (cancelled) return;
        setPhase('error');
        setMessage(
          e instanceof Error && e.message
            ? e.message
            : 'We could not verify this link. Please try signing in with Google again.',
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="mb-6">
          <span className="text-5xl" aria-hidden="true">
            🌙
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">Barakah</h1>

        {phase === 'verifying' && (
          <>
            <p className="text-gray-700 mb-6">Verifying your link…</p>
            <div className="mx-auto animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
          </>
        )}

        {phase === 'success' && (
          <>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Google sign-in enabled
            </p>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <p className="text-xs text-gray-500 mb-4">
              Taking you to sign in with Google…
            </p>
            <div className="mx-auto mb-4 animate-spin w-6 h-6 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
            <Link
              href="/login?ssoAuto=1"
              className="inline-block bg-[#1B5E20] text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition"
            >
              Sign in with Google now
            </Link>
          </>
        )}

        {phase === 'error' && (
          <>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Confirmation failed
            </p>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/login"
                className="inline-block bg-[#1B5E20] text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition"
              >
                Sign in
              </Link>
              <Link
                href="/"
                className="inline-block bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
              >
                Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmSsoLinkPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">
          <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
        </div>
      }
    >
      <ConfirmSsoLinkInner />
    </Suspense>
  );
}
