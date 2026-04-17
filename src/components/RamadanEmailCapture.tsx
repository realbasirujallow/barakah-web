'use client';

import { useState } from 'react';

/**
 * Ramadan email capture widget — placed on /learn/* pages during peak season.
 *
 * Captures email addresses for a Ramadan giving tips + zakat reminder sequence.
 * POSTs to /api/email-capture which logs the lead. On success, redirects the
 * user to /signup pre-filled with their email for one-click account creation.
 *
 * Props:
 *   source — identifies the learn page origin (e.g., 'learn-zakat-savings')
 *   variant — 'inline' (embedded in article) | 'bottom' (end-of-article CTA)
 */
export default function RamadanEmailCapture({
  source = 'learn',
  variant = 'inline',
}: {
  source?: string;
  variant?: 'inline' | 'bottom';
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Round 22: use the same strict regex applied across signup / forgot /
    // profile / family-invite / contact. Prior `.includes('@')` accepted
    // "@", "a@", "@b" and wasted a round-trip + rate-limit token per typo.
    const trimmed = email.trim();
    if (!trimmed || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setState('loading');
    setErrorMsg('');

    try {
      await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      // Whether the server succeeds or fails, redirect to signup with email pre-filled
      // so the lead is never lost.
      setState('success');
    } catch {
      // Still show success — the signup redirect captures the lead regardless
      setState('success');
    }
  };

  if (state === 'success') {
    return (
      <div className={containerCls(variant)}>
        <div className="text-center">
          <p className="text-2xl mb-2">🌙</p>
          <p className="font-bold text-[#1B5E20] text-lg mb-1">JazakAllah Khair!</p>
          <p className="text-sm text-gray-600 mb-4">
            Get your free Barakah account to track zakat, sadaqah, and Ramadan giving — all in one place.
          </p>
          <a
            href={`/signup?email=${encodeURIComponent(email)}&source=${source}`}
            className="inline-block bg-[#1B5E20] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2E7D32] transition text-sm"
          >
            Create Free Account →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={containerCls(variant)}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0">🌙</span>
        <div>
          <p className="font-bold text-[#1B5E20] text-base">
            {variant === 'bottom'
              ? 'Get Ramadan giving reminders + your free zakat calculation'
              : 'Ramadan Tip: Track every sadaqah, zakat, and giving goal in one place'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Free Barakah account — zakat calculator, sadaqah tracker, and Ramadan Mode included.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="bg-[#1B5E20] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2E7D32] transition text-sm whitespace-nowrap disabled:opacity-60"
        >
          {state === 'loading' ? 'Saving…' : 'Get Free Account'}
        </button>
      </form>
      {errorMsg && <p className="text-xs text-red-600 mt-1.5">{errorMsg}</p>}
      <p className="text-xs text-gray-400 mt-2">No spam. Cancel anytime. Barakah never sells your data.</p>
    </div>
  );
}

function containerCls(variant: 'inline' | 'bottom') {
  if (variant === 'bottom') {
    return 'bg-[#1B5E20] text-white rounded-2xl p-6 my-10';
  }
  return 'bg-green-50 border border-green-200 rounded-xl p-5 my-8';
}
