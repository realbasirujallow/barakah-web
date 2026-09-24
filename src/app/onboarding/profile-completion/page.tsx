'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function ProfileCompletionPage() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [isLoading, router, user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');
    const code = country.trim().toUpperCase();
    if (digits.length < 7 || digits.length > 15) {
      setError('Enter a valid phone number with 7 to 15 digits.');
      return;
    }
    if (!/^[A-Z]{2}$/.test(code)) {
      setError('Enter your two-letter country code, such as US, GB, IN, or NG.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.completeProfile(phone.trim(), code);
      window.location.assign('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your details. Please try again.');
      setSaving(false);
    }
  }

  if (isLoading || !user) return null;

  return (
    <main className="min-h-screen bg-[#FFF8E1] px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900">Finish your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add your phone and country so support, currency, and available bank connections are accurate. This does not opt you into marketing.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-800">
            Phone number
            <input
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 317 555 0123"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Country code
            <input
              autoComplete="country"
              value={country}
              onChange={(event) => setCountry(event.target.value.slice(0, 2))}
              placeholder="US"
              maxLength={2}
              className="mt-1 w-full uppercase rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
            />
            <span className="mt-1 block text-xs text-gray-500">Use the two-letter code for your country, such as US, GB, IN, NG, or GM.</span>
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#1B5E20] px-4 py-2.5 font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save and continue'}
          </button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/privacy" className="text-[#1B5E20] underline">Privacy policy</Link>
          <button type="button" onClick={() => logout('logout')} className="text-gray-600 underline">Sign out</button>
        </div>
      </section>
    </main>
  );
}
