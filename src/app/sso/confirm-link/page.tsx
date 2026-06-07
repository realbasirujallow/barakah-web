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
import { api } from '../../../lib/api';
import { readTokenFromUrl, scrubTokenFromUrl } from '../../../lib/scrubUrlToken';

type Phase = 'verifying' | 'success' | 'error';

function ConfirmSsoLinkInner() {
  const [phase, setPhase] = useState<Phase>('verifying');
  const [message, setMessage] = useState('');

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
            <Link
              href="/login"
              className="inline-block bg-[#1B5E20] text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition"
            >
              Sign in
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
