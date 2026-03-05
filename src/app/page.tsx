'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const features = [
  { icon: '🕌', title: 'Zakat Calculator', desc: 'AMJA-compliant nisab (85g gold), Hawl tracker, and auto-categorized asset breakdown.' },
  { icon: '🛡️', title: 'Riba Detector', desc: 'Scan your transactions to flag interest-bearing activity and keep your finances halal.' },
  { icon: '✅', title: 'Halal Screener', desc: 'Screen investments for Shariah compliance before you put your money to work.' },
  { icon: '📊', title: 'Budgets & Analytics', desc: 'Track spending, set budgets, and see where every dollar goes—at a glance.' },
  { icon: '💎', title: 'Net Worth Tracker', desc: 'Real-time net worth with assets, debts, and investments in one place.' },
  { icon: '🤲', title: 'Sadaqah & Waqf', desc: 'Log charitable giving and endowments alongside your everyday finances.' },
  { icon: '📜', title: 'Wasiyyah Planning', desc: 'Record your Islamic will directives and keep them updated over time.' },
  { icon: '🎯', title: 'Savings Goals', desc: 'Set goals for Hajj, emergency funds, or anything else and track your progress.' },
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  // While checking auth, show a neutral loading screen so logged-in users
  // aren't briefly shown the marketing page before the redirect fires.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Logged-in users are redirected above; render nothing while navigating.
  if (user) return null;

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* ── Nav ── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-5xl mb-4">🌙</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] leading-tight mb-4">
          Halal Money Management,<br className="hidden sm:block" /> Made Simple
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Barakah brings your entire financial life together—budgets, zakat, investments, and Islamic giving—in one clean, Shariah-aware dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-[#2E7D32] transition shadow"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="bg-white text-[#1B5E20] border border-[#1B5E20] px-8 py-3.5 rounded-xl font-bold text-base hover:bg-green-50 transition"
          >
            Sign In
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required · Built for Muslim families</p>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            Everything you need in one place
          </h2>
          <p className="text-center text-gray-500 mb-12">
            From everyday budgeting to Zakat, Waqf, and beyond.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-[#FFF8E1] rounded-2xl p-5 hover:shadow-md transition">
                <p className="text-3xl mb-3">{f.icon}</p>
                <h3 className="font-bold text-[#1B5E20] mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Islamic finance note ── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-3xl mb-3">🕌</p>
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Built on Islamic Principles</h2>
          <p className="text-gray-600 leading-relaxed">
            Barakah uses AMJA (Assembly of Muslim Jurists of America) standards for Zakat calculation,
            flags riba-bearing transactions, and helps you track your charitable obligations—all in one
            place. We&apos;re a tool to help you stay informed; always consult a qualified scholar for
            specific rulings.
          </p>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-[#1B5E20] py-14 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Start your Barakah journey today
        </h2>
        <p className="text-green-200 mb-6 text-sm">Free to use · No ads · Your data stays yours</p>
        <Link
          href="/signup"
          className="inline-block bg-white text-[#1B5E20] px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow"
        >
          Create Free Account
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t py-6 px-6 text-center text-xs text-gray-400">
        <Link href="/disclaimer" className="hover:text-[#1B5E20] hover:underline transition">
          ⚠️ Disclaimer &amp; Islamic Guidance Notice
        </Link>
        <span className="mx-2">·</span>
        <span>Not a fatwa — consult a qualified scholar for your specific situation</span>
        <span className="mx-2">·</span>
        <span>© {new Date().getFullYear()} Barakah</span>
      </footer>
    </div>
  );
}
