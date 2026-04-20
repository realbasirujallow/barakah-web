/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity --
 * This page uses two patterns that the React 19 lint rules flag but are
 * intentional here (and throughout the dashboard):
 *
 *   1. Polling / on-mount data fetches inside useEffect that call setState
 *      after the fetch promise resolves. The rule targets synchronous
 *      state derivations; async network subscriptions are the exception.
 *
 *   2. Date.now() at render time for "N minutes ago" relative-time displays.
 *      Render-time snapshot is the *desired* semantic — concurrent re-renders
 *      landing ms-level different values is harmless for a time-ago tooltip.
 *
 * Canonical rationale + worked example: PR #27 on NotificationBell.tsx.
 * Disabling at file-level here (instead of line-level on every occurrence)
 * so the pattern doesn't add noise across the dashboard.
 */
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { isSetupComplete } from '../../lib/setup';
import { isSafeInternalPath } from '../../lib/safePath';

const REMEMBERED_EMAIL_KEY = 'barakah_remembered_email';

// BUG FIX: useSearchParams() requires a <Suspense> boundary in Next.js App Router.
// Split into LoginForm (uses searchParams) and LoginPage (wraps with Suspense).
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [bannerReason, setBannerReason] = useState<'expired' | 'logout' | 'deleted' | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore remembered email on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch { /* SSR / incognito safety */ }
  }, []);

  useEffect(() => {
    const reason = searchParams.get('reason') as 'expired' | 'logout' | 'deleted' | null;
    // Support the legacy ?expired=true param as well
    if (reason) {
      setBannerReason(reason);
      // Round 18: strip the param after reading so a page refresh
      // doesn't re-show the "session expired / account deleted" banner
      // indefinitely. We preserve ?redirect= if present.
      const redirect = searchParams.get('redirect');
      router.replace(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login');
    } else if (searchParams.get('expired') === 'true') {
      setBannerReason('expired');
      const redirect = searchParams.get('redirect');
      router.replace(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login');
    }
    // router intentionally NOT in deps — it's stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setResendStatus('idle');
    setLoading(true);
    try {
      // Persist or clear remembered email
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch { /* incognito safety */ }
      await login(email, password, rememberMe);
      // BUG FIX: removed duplicate trackLogin() call — AuthContext.login() already fires it
      // Round 17: honor `?redirect=<path>` param so /family/join and other
      // entry points can send unauthed users through login and back to
      // their intended destination. `isSafeInternalPath` rejects external
      // URLs / protocol-relative paths to prevent open-redirect abuse.
      const redirectParam = searchParams.get('redirect');
      if (isSafeInternalPath(redirectParam)) {
        router.push(redirectParam);
        return;
      }
      // Round 17: cross-session fallback — if the user originally landed on
      // /family/join and completed signup + email verification in a
      // different tab, sessionStorage no longer has the token, but if
      // they're on the same session we persisted the token during the
      // initial preview. This gets them back to the invite screen to
      // tap "Accept" without retyping the URL.
      try {
        const pendingFamilyToken = sessionStorage.getItem('barakah_pending_family_invite_token');
        if (pendingFamilyToken) {
          router.push(`/family/join?token=${encodeURIComponent(pendingFamilyToken)}`);
          return;
        }
      } catch { /* sessionStorage unavailable — ignore */ }
      let nextRoute = '/setup';
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          // Round 23: prefer the server-side `setupCompletedAt` that the
          // login response just wrote into localStorage. Falls back to
          // the legacy per-device flag for pre-migration accounts.
          const parsed = JSON.parse(savedUser) as { id?: string; setupCompletedAt?: number | null };
          if (parsed.id && isSetupComplete(parsed.id, parsed.setupCompletedAt)) {
            nextRoute = '/dashboard';
          }
        }
      } catch {
        // Ignore localStorage parse issues and fall back to setup
      }
      router.push(nextRoute);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      if (msg.toLowerCase().includes('verify your email')) {
        setNeedsVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address above first.');
      return;
    }
    setResendStatus('sending');
    try {
      await api.resendVerification(email);
      setResendStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
      setResendStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {bannerReason === 'expired' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg mb-4 text-sm">
              Your session has expired. Please sign in again.
            </div>
          )}

          {bannerReason === 'logout' && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
              You have been signed out successfully. See you next time!
            </div>
          )}

          {bannerReason === 'deleted' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-4 text-sm">
              <p className="font-semibold mb-1">Your account has been deleted.</p>
              <p>May Allah bless your journey. You&apos;re always welcome back — just sign up anytime.</p>
            </div>
          )}

          {error && (
            <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          {needsVerification && resendStatus === 'idle' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
              <p className="text-amber-800 text-sm mb-3">
                Your email is not verified yet. Check your inbox for the verification link, or request a new one.
              </p>
              <button
                type="button"
                onClick={handleResendVerification}
                className="w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
              >
                Resend Verification Email
              </button>
            </div>
          )}

          {needsVerification && resendStatus === 'sending' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4 text-center">
              <p className="text-amber-800 text-sm">Sending verification email...</p>
            </div>
          )}

          {needsVerification && resendStatus === 'sent' && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <p className="text-green-800 text-sm">
                ✅ Verification email sent! Check your inbox (and spam folder) for the link.
              </p>
            </div>
          )}

          {/* Round 19: each label/input pair has matching htmlFor/id so
              screen readers announce the label, and clicking the label
              focuses the input. Prior markup had orphaned labels. */}
          <div className="mb-4">
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#1B5E20] hover:underline">Forgot Password?</Link>
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20] cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#1B5E20] font-semibold hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
