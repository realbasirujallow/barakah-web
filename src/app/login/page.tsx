'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { isSetupComplete } from '../../lib/setup';
import { isSafeInternalPath } from '../../lib/safePath';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { useI18n } from '../../lib/i18n';

const REMEMBERED_EMAIL_KEY = 'barakah_remembered_email';

// BUG FIX: useSearchParams() requires a <Suspense> boundary in Next.js App Router.
// Split into LoginForm (uses searchParams) and LoginPage (wraps with Suspense).
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // R7 audit (2026-04-21): default to OFF. A default-on rememberMe means
  // every successful login issues a multi-day session cookie by default,
  // even for one-off logins on shared / public devices. Users who opt in
  // explicitly still get the extended session. The email restore effect
  // below keeps the familiar UX for repeat visitors.
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [bannerReason, setBannerReason] = useState<'expired' | 'logout' | 'deleted' | null>(null);
  const { login } = useAuth();
  const { t } = useI18n();
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
      // R5 audit follow-up (2026-04-21): the cross-tab sessionStorage
      // fallback that used to read `barakah_pending_family_invite_token`
      // here has been removed. The invite flow now relies entirely on the
      // `?redirect=` URL param for hand-off between /family/join ↔ login ↔
      // signup ↔ verify-email. A user who hits the edge case where they
      // lose the redirect param can click the original invite email again.
      // That's a better trade than keeping a raw bearer in storage where
      // any XSS can read it.
      let nextRoute = '/setup';
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          // Round 23: prefer the server-side `setupCompletedAt` that the
          // login response just wrote into localStorage. Falls back to
          // the legacy per-device flag for pre-migration accounts.
          const parsed = JSON.parse(savedUser) as { id?: string; setupCompletedAt?: number | null };
          if (parsed.id && isSetupComplete(parsed.id, parsed.setupCompletedAt)) {
            // Wave 2 BUG-SIGNUP-WIZARD (2026-05-27): first time on this
            // device after setup → show the locale-confirm shell so the
            // user sees the backend-derived currency + can pick a UI
            // language before landing on the dashboard. Skip-flag is
            // set by the onboarding page itself (Confirm or Skip).
            nextRoute = '/dashboard';
            try {
              const seen = localStorage.getItem('barakah_onboarding_locale_seen');
              if (seen !== '1') {
                nextRoute = '/onboarding/locale-confirm';
              }
            } catch { /* private mode */ }
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
        {/* 2026-05-08 (Bug F): language switcher on the login page so a
            non-English first-time user can change UI language before
            signing in. The marketing-page chrome has it, but a user who
            arrives at /login directly (deep link / cookie expired / saved
            bookmark) couldn't otherwise. */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher compact />
        </div>
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          <p className="text-gray-500 mt-2">{t('authWelcomeBack')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {bannerReason === 'expired' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg mb-4 text-sm">
              {t('authSessionExpired')}
            </div>
          )}

          {bannerReason === 'logout' && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
              {t('authSignedOut')}
            </div>
          )}

          {bannerReason === 'deleted' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-4 text-sm">
              <p className="font-semibold mb-1">{t('authAccountDeletedTitle')}</p>
              <p>{t('authAccountDeletedBody')}</p>
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
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">{t('authEmail')}</label>
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
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">{t('authPassword')}</label>
              <Link href="/forgot-password" className="text-xs text-[#1B5E20] hover:underline">{t('authForgotPassword')}</Link>
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
              {t('authRememberMe')}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? t('authSigningIn') : t('authSignInButton')}
          </button>

          {/* 2026-06-07 PARITY-GOOGLE-SSO-WEB: Continue with Google. Hidden
              entirely when NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID is unset, so
              dev/CI builds without GIS configured stay clean. */}
          <GoogleSignInButton ctaLabel="continue_with" />

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('authNoAccount')}{' '}
            <Link href="/signup" className="text-[#1B5E20] font-semibold hover:underline">{t('authSignUp')}</Link>
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
