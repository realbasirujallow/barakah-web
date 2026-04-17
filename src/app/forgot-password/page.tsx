'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Round 18: client-side email format check. HTML5 `type="email"`
    // is decent but Safari/some browsers accept "foo@bar" without TLD,
    // and passing obvious garbage straight to the API wastes a rate-
    // limit token. Mirrors the server regex in AuthController.
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Email is required');
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await api.forgotPassword(trimmed);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">&#9993;&#65039;</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600 text-sm mb-6">
                If an account exists for <span className="font-semibold">{email}</span>,
                we&apos;ve sent a password reset link. Check your inbox and spam folder.
              </p>
              <p className="text-gray-500 text-xs mb-6">The link expires in 30 minutes.</p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-[#1B5E20] text-sm font-semibold hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
              )}

              <p className="text-gray-600 text-sm mb-6">
                Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
              </p>

              {/* Round 19: label/input association via htmlFor+id. */}
              <div className="mb-6">
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-[#1B5E20] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
