
'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';

function SignupContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      // Fire-and-forget referral click tracking
      fetch(`/api/referrals/click/${encodeURIComponent(ref)}`, { method: 'POST' }).catch((e) => console.error('Referral tracking error:', e));
    }
  }, [searchParams]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const US_STATES = [
    '', 'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
  ];

  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (pwd.length < 8) return 'weak';
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    const characterTypeCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (pwd.length >= 12 && characterTypeCount >= 3) return 'strong';
    if (pwd.length >= 8 && characterTypeCount >= 2) return 'medium';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.signup(name, email, password, state, referralCode.trim().toUpperCase() || undefined);
      setSignupSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await api.resendVerification(email);
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Check Your Email!</h2>
            <p className="text-gray-600 mb-2">
              We sent a verification link to <strong>{email}</strong>.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Click the link in the email to verify your account, then you can sign in.
              Don&apos;t forget to check your spam folder!
            </p>

            {resendStatus === 'sent' ? (
              <p className="text-green-700 text-sm mb-4">✅ Verification email resent!</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendStatus === 'sending'}
                className="w-full mb-3 border border-[#1B5E20] text-[#1B5E20] py-2.5 rounded-lg text-sm font-semibold hover:bg-green-50 transition disabled:opacity-50"
              >
                {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}

            <Link
              href="/login"
              className="inline-block w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          <p className="text-gray-500 mt-2">Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-gray-500">At least 8 characters</p>
              {password && (
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className={`w-1 h-1 rounded-full ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-red-500' : 'bg-gray-300'}`} />
                    <div className={`w-1 h-1 rounded-full ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    <div className={`w-1 h-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength === 'weak' ? 'text-red-500' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition focus:ring-1 ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20]'}`}
              placeholder="Re-enter your password"
              minLength={8}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">State (for tax estimate)</label>
            <select value={state} onChange={e => setState(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900" required>
              {US_STATES.map((s) => (<option key={s} value={s}>{s ? s : 'Select your state'}</option>))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral code <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ABCD1234"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 font-mono uppercase placeholder:normal-case placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
            />
            <p className="text-xs text-gray-400 mt-1">Have a friend&apos;s code? Both of you get 1 free month of Plus. 🎁</p>
          </div>

          <p className="text-center text-xs text-gray-600 mb-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-[#1B5E20] hover:underline font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#1B5E20] hover:underline font-medium">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1B5E20] font-semibold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div />}>
      <SignupContent />
    </Suspense>
  );
}
