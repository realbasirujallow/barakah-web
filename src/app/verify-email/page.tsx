'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { readTokenFromUrl, scrubTokenFromUrl } from '../../lib/scrubUrlToken';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  // R8 audit: prefer the URL fragment (#token=...) over the query
  // string (?token=...). The fragment is never sent to the server
  // and never appears in Referer headers. Legacy links using the
  // query string still work.
  const [token, setToken] = useState<string | null>(() => {
    // Initial render server-side: can't touch window. Defer to
    // useEffect below. But also try searchParams first so the
    // loading state below renders correctly when fragment is absent.
    return searchParams.get('token');
  });
  useEffect(() => {
    const fromHash = readTokenFromUrl('token');
    if (fromHash && fromHash !== token) setToken(fromHash);
    // We intentionally don't depend on `token` here — this runs once
    // to hydrate from the fragment on client mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Initial state is "loading" even if the query-string token is absent —
  // the useEffect above may still hydrate the token from the URL fragment
  // on client mount. We flip to 'error' below once we're sure the token
  // is missing from both sources.
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendStatus('sending');
    try {
      await api.resendVerification(resendEmail);
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
      setMessage('Failed to resend verification email. Please try again.');
    }
  };

  useEffect(() => {
    // If by the time we've had a microtask (the hash-hydration effect
    // above runs before this on mount) there's still no token, stop
    // the loading spinner and surface the "no token" message.
    if (!token) {
      // Small delay lets the hash-hydration effect run first in dev
      // double-invoke. requestAnimationFrame is one frame — imperceptible.
      const id = requestAnimationFrame(() => {
        if (!readTokenFromUrl('token')) {
          setStatus('error');
          setMessage('No verification token provided.');
        }
      });
      return () => cancelAnimationFrame(id);
    }

    // R7 audit: scrub the token from the address bar immediately after
    // capturing it into React state. Prevents history/screenshot/copy-
    // paste leaks of the raw bearer.
    scrubTokenFromUrl('token');

    // Round 19: cancellation flag to avoid a setState after unmount.
    // Also prevents StrictMode's double-effect-run from calling the
    // backend twice with the same token — the second call would 400
    // because the first already consumed it.
    let cancelled = false;

    api.verifyEmail(token)
      .then((data: { message?: string }) => {
        if (cancelled) return;
        setStatus('success');
        setMessage(data?.message || 'Email verified successfully!');
      })
      .catch((err: Error) => {
        if (cancelled) return;
        // Round 18: the backend returns "Invalid or already used
        // verification token" for BOTH expired AND already-used tokens,
        // so a user who refreshes the success page sees the same scary
        // "expired" text. Detect the server's "already used" phrasing
        // and render a friendlier "Already verified — just sign in"
        // state instead of the generic error. Falling back to the
        // original "expired or already used" message for anything else.
        const raw = err.message || '';
        if (/already used|already verified/i.test(raw)) {
          setStatus('success');
          setMessage('This email is already verified. You can sign in now.');
        } else {
          setStatus('error');
          setMessage(raw || 'Verification failed. The link may be expired or already used.');
        }
      });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E20] mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Sign In
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <h2 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <label htmlFor="resend-email" className="text-gray-600 text-sm mb-2 block">Enter your email to resend the verification link:</label>
                <input
                  id="resend-email"
                  type="email"
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-2 outline-none focus:border-[#1B5E20]"
                />
                {resendStatus === 'sent' ? (
                  <p className="text-green-700 text-sm text-center">✅ Verification email sent! Check your inbox.</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendStatus === 'sending' || !resendEmail}
                    className="w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>

              <Link
                href="/login"
                className="inline-block w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E20]"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
