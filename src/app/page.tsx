'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#1B5E20] text-white">
        <h1 className="text-2xl font-bold">&#127769; Barakah</h1>
        <div className="flex gap-4 items-center">
          {user ? (
            <Link href="/dashboard" className="bg-white text-[#1B5E20] px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-green-200 transition">Login</Link>
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-24 text-center">
        <h2 className="text-5xl font-bold text-[#1B5E20] mb-6">
          Islamic Finance,<br />Made Simple
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Track your wealth, calculate Zakat automatically, detect riba, and keep your finances 100% halal.
        </p>
        <Link href="/signup" className="inline-block bg-[#1B5E20] text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-800 transition shadow-lg">
          Get Started &mdash; It&apos;s Free
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '\uD83D\uDCB0', title: 'Wealth Tracking', desc: 'Track all assets — cash, gold, stocks, crypto — in one place' },
            { icon: '\uD83D\uDD4C', title: 'Zakat Calculator', desc: 'Auto-calculate Zakat with Nisab tracking and Hawl reminders' },
            { icon: '\uD83D\uDEE1\uFE0F', title: 'Riba Detector', desc: 'AI scans your transactions and flags interest-based dealings' },
            { icon: '\uD83D\uDCCA', title: 'Budget Planning', desc: 'Set monthly budgets by category and track spending' },
            { icon: '\uD83D\uDCDD', title: 'Islamic Will', desc: 'Create your Wasiyyah with Quran-based inheritance shares' },
            { icon: '\uD83E\uDD32', title: 'Sadaqah Tracker', desc: 'Log charitable giving and track your generosity over time' },
            { icon: '\u23F0', title: 'Hawl Tracker', desc: "Track the Islamic lunar year for each asset's Zakat eligibility" },
            { icon: '\uD83C\uDFDB\uFE0F', title: 'Waqf Endowment', desc: 'Record Waqf contributions for ongoing Sadaqah Jariyah' },
            { icon: '\uD83D\uDD04', title: 'Auto Categorize', desc: 'Smart AI categorizes your transactions automatically' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B5E20] text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Make Your Finances Halal?</h3>
        <p className="text-green-200 mb-8 text-lg">Join Muslims worldwide managing their wealth the Islamic way</p>
        <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-50 transition">
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D3311] text-green-300 py-8 text-center text-sm">
        <p>&copy; 2026 Barakah Islamic Finance Tracker. All rights reserved.</p>
        <p className="mt-2 text-green-500">Built with Tawakkul &#127769;</p>
      </footer>
    </div>
  );
}
