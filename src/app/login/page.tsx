'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { hasCompletedGuidedSetup } from '../../lib/setup';

const REMEMBERED_EMAIL_KEY = 'barakah_remembered_email';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    } else if (searchParams.get('expired') === 'true') {
      setBannerReason('expired');
    }
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
      // Track login in GA4
      const { trackLogin } = await import('../../lib/analytics');
      trackLogin('email');
      let nextRoute = '/setup';
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser) as { id?: string };
          if (parsed.id && hasCompletedGuidedSetup(parsed.id)) {
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
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
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
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#1B5E20] hover:underline">Forgot Password?</Link>
            </div>
            <input
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
