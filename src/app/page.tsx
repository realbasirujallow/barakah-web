'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Data ────────────────────────────────────────────────────────────────────

const features = [
  { icon: '🕌', title: 'Zakat Calculator', desc: 'AMJA-compliant nisab (85g gold, live price), Hawl tracker, and auto-categorized asset breakdown.' },
  { icon: '🛡️', title: 'Riba Detector', desc: 'Scan transactions to flag interest-bearing activity and stay halal.' },
  { icon: '✅', title: 'Halal Screener', desc: '30,000+ stocks screened against AAOIFI Standard 21 — filter by halal, haram, or all with sector breakdown and debt ratios.' },
  { icon: '📊', title: 'Budgets & Analytics', desc: 'Track spending by category and see where every dollar goes at a glance.' },
  { icon: '💎', title: 'Net Worth Tracker', desc: 'Real-time net worth with assets, debts, and investments in one place.' },
  { icon: '🤲', title: 'Sadaqah & Waqf', desc: 'Log charitable giving and endowments alongside everyday finances.' },
  { icon: '📜', title: 'Wasiyyah & Obligations', desc: 'Record your Islamic will, beneficiaries, and outstanding obligations (Zakat, Kaffarah, loans) for your family.' },
  { icon: '🎯', title: 'Savings Goals', desc: 'Set goals for Hajj, emergency funds, or anything else — with an automatic Hajj savings template.' },
  { icon: '⭐', title: 'Barakah Score', desc: 'Your Islamic financial health score (0–100) across Zakat, Riba-free living, Sadaqah, Hawl, and debt.' },
  { icon: '🕌', title: 'Prayer Times', desc: 'Daily salah schedule for any city worldwide, with next prayer countdown — built in.' },
  { icon: '🔄', title: 'Subscription Detector', desc: 'Automatically detect recurring subscriptions from your transactions — flag haram services and track monthly spend.' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Bill due alerts, Hawl anniversaries, Zakat nisab threshold alerts, and savings milestones.' },
  { icon: '👥', title: 'Shared Family Finances', desc: 'Family plan lets up to 6 members track shared expenses, group transactions, and family Zakat.' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    annual: null,
    color: 'border-gray-200',
    badge: null,
    features: [
      'Up to 25 transactions/month',
      'Zakat calculator (live nisab)',
      'Hawl tracker',
      'Prayer times (any city)',
      'Basic budgeting (3 categories)',
      '1 savings goal',
      'Mobile app',
    ],
    missing: [
      'Halal screener',
      'Subscription detector',
      'Riba detector',
      'Auto-categorize',
      'Investments & net worth',
      'Wasiyyah & Waqf',
      'Export CSV/PDF',
      'Shared finances',
    ],
    cta: 'Get Started Free',
    ctaHref: '/signup',
    ctaStyle: 'border border-[#1B5E20] text-[#1B5E20] hover:bg-green-50',
  },
  {
    name: 'Plus',
    price: '$9.99',
    period: '/mo',
    annual: '$99/yr · save 17%',
    color: 'border-[#1B5E20] ring-2 ring-[#1B5E20]',
    badge: 'Most Popular',
    features: [
      'Unlimited transactions',
      'All Free features',
      'Halal stock screener (30,000+ stocks)',
      'Subscription detector (flag haram services)',
      'Riba detector',
      'Auto-categorize',
      'Investments & net worth',
      'Wasiyyah & Waqf planning',
      'Barakah Score & analytics',
      'Prayer times (any city)',
      'Smart Islamic reminders',
      'Export CSV/PDF',
      'Unlimited savings goals & budgets',
    ],
    missing: ['Shared family finances'],
    cta: 'Start Plus',
    ctaHref: '/signup',
    ctaStyle: 'bg-[#1B5E20] text-white hover:bg-[#2E7D32]',
  },
  {
    name: 'Family',
    price: '$14.99',
    period: '/mo',
    annual: '$119/yr · save 34%',
    color: 'border-purple-300',
    badge: null,
    features: [
      'Everything in Plus',
      'Shared finances (up to 6 members)',
      'Family Zakat management',
      'Priority support',
    ],
    missing: [],
    cta: 'Start Family',
    ctaHref: '/signup',
    ctaStyle: 'bg-purple-600 text-white hover:bg-purple-700',
  },
];

// Comparison: rows = features, cols = [Barakah, YNAB, Mint/Copilot, Zoya]
const comparisonRows = [
  { feature: 'Budgeting & analytics',         b: true,  ynab: true,  mint: true,  zoya: false },
  { feature: 'Zakat calculator (live nisab)', b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Hawl lunar year tracker',       b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Halal stock screener (30K+)',   b: true,  ynab: false, mint: false, zoya: true  },
  { feature: 'Riba detector',                 b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Subscription detector',         b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Net worth tracking',            b: true,  ynab: false, mint: true,  zoya: false },
  { feature: 'Investment tracking',           b: true,  ynab: false, mint: true,  zoya: true  },
  { feature: 'Sadaqah & Waqf logging',       b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Wasiyyah & estate obligations', b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Barakah Score',                 b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Prayer times built-in',         b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Smart Islamic reminders',       b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Shared family finances',        b: true,  ynab: false, mint: false, zoya: false },
  { feature: 'Mobile app',                    b: true,  ynab: true,  mint: true,  zoya: true  },
  { feature: 'Starting price',
    bText: 'Free',   ynabText: '$11.99/mo', mintText: 'Free*', zoyaText: 'Free' },
];

const Tick = () => <span className="text-[#1B5E20] font-bold text-lg">✓</span>;
const Cross = () => <span className="text-gray-300 font-bold text-lg">✕</span>;

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user) return null;

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">

      {/* ── Nav ── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</span>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#1B5E20] transition">Features</a>
            <a href="#pricing" className="hover:text-[#1B5E20] transition">Pricing</a>
            <a href="#compare" className="hover:text-[#1B5E20] transition">Compare</a>
            <Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-5xl mb-4">🌙</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] leading-tight mb-4">
          Halal Money Management,<br className="hidden sm:block" /> Made Simple
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Barakah brings your entire financial life together — budgets, Zakat, investments, Barakah Score, and Islamic giving — in one clean, Shariah-aware dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-[#2E7D32] transition shadow">
            Create Free Account
          </Link>
          <Link href="/login" className="bg-white text-[#1B5E20] border border-[#1B5E20] px-8 py-3.5 rounded-xl font-bold text-base hover:bg-green-50 transition">
            Sign In
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required · Built for Muslim families</p>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            Everything you need in one place
          </h2>
          <p className="text-center text-gray-500 mb-12">From everyday budgeting to Zakat, Waqf, and beyond.</p>
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

      {/* ── Why We're Different ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-3">
            Why Barakah is Different
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Most finance apps are built for a general audience. Barakah is built specifically for Muslims — every feature is designed around Islamic financial principles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">🕌</p>
              <h3 className="font-bold text-gray-900 mb-2">AMJA-Standard Zakat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most apps either skip zakat entirely or get the nisab wrong. We follow the Assembly of Muslim Jurists of America (AMJA) gold standard — 85g — with a full Hawl calendar and per-asset breakdown.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">🛡️</p>
              <h3 className="font-bold text-gray-900 mb-2">Riba Detection Built In</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No other personal finance app scans your transactions for interest-bearing activity. Barakah automatically flags riba so you can stay aware — not just track spending.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">📜</p>
              <h3 className="font-bold text-gray-900 mb-2">Sadaqah, Waqf & Wasiyyah</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track your charitable giving, endowments, and Islamic will — including estate obligations like unpaid Zakat. No other finance app covers all three.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center mt-6 md:mt-0 md:col-start-2">
              <p className="text-4xl mb-3">⭐</p>
              <h3 className="font-bold text-gray-900 mb-2">Barakah Score</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your Islamic financial health at a glance — scored across Zakat, riba-free living, Sadaqah, Hawl, and halal debt. Improve your score, improve your deen.
              </p>
            </div>
          </div>

          {/* Ranked stats */}
          <div className="mt-10 bg-[#1B5E20] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <p className="text-4xl font-extrabold mb-1">30+</p>
              <p className="text-green-200 text-sm">Islamic finance features — more than any other app</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">#1</p>
              <p className="text-green-200 text-sm">Most comprehensive halal finance tracker available</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">$0</p>
              <p className="text-green-200 text-sm">To get started — no credit card, no ads, ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">Simple, Honest Pricing</h2>
          <p className="text-center text-gray-500 mb-12">No ads. No data selling. Just a clean tool that works for your deen and your dunya.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl border-2 p-6 ${plan.color} bg-white`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B5E20] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-[#1B5E20]">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                </div>
                {plan.annual && (
                  <p className="text-xs text-green-700 font-semibold mb-4">{plan.annual}</p>
                )}
                {!plan.annual && <div className="mb-4" />}
                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-2.5 rounded-xl font-bold text-sm transition mb-6 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
                <ul className="space-y-2 text-sm">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-gray-700">
                      <span className="text-[#1B5E20] mt-0.5">✓</span> {f}
                    </li>
                  ))}
                  {plan.missing.map(f => (
                    <li key={f} className="flex items-start gap-2 text-gray-300">
                      <span className="mt-0.5">✕</span> <span className="line-through">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section id="compare" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            How Barakah Compares
          </h2>
          <p className="text-center text-gray-500 mb-10">See why Muslim families are choosing Barakah over generic finance apps.</p>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FFF8E1]">
                    <th className="px-5 py-4 text-left font-semibold text-gray-700 w-1/3">Feature</th>
                    <th className="px-4 py-4 text-center font-bold text-[#1B5E20]">🌙 Barakah</th>
                    <th className="px-4 py-4 text-center font-semibold text-gray-500">YNAB</th>
                    <th className="px-4 py-4 text-center font-semibold text-gray-500">Mint / Copilot</th>
                    <th className="px-4 py-4 text-center font-semibold text-gray-500">Zoya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonRows.map(row => (
                    <tr key={row.feature} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-700">{row.feature}</td>
                      <td className="px-4 py-3 text-center">
                        {row.bText   ? <span className="font-semibold text-[#1B5E20]">{row.bText}</span>   : (row.b    ? <Tick /> : <Cross />)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.ynabText ? <span className="text-gray-500">{row.ynabText}</span> : (row.ynab  ? <Tick /> : <Cross />)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.mintText ? <span className="text-gray-500">{row.mintText}</span> : (row.mint  ? <Tick /> : <Cross />)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.zoyaText ? <span className="text-gray-500">{row.zoyaText}</span> : (row.zoya  ? <Tick /> : <Cross />)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-5 py-3 text-xs text-gray-400 border-t">
              * Mint discontinued Jan 2024; Copilot is US-only at $8.99/mo. Data based on publicly available feature sets as of March 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ── Islamic principles note ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-3xl mb-3">🕌</p>
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Built on Islamic Principles</h2>
          <p className="text-gray-600 leading-relaxed">
            Barakah uses AMJA standards for Zakat, flags riba-bearing transactions, and helps you track all your Islamic financial obligations in one place. We are a tool to help you stay informed — always consult a qualified scholar for specific rulings.
          </p>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-[#1B5E20] py-14 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Start your Barakah journey today</h2>
        <p className="text-green-200 mb-6 text-sm">Free to use · No ads · Your data stays yours</p>
        <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow">
          Create Free Account
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t py-6 px-6 text-center text-xs text-gray-400">
        <Link href="/disclaimer" className="hover:text-[#1B5E20] hover:underline transition">
          ⚠️ Disclaimer &amp; Islamic Guidance Notice
        </Link>
        <span className="mx-2">·</span>
        <Link href="/contact" className="hover:text-[#1B5E20] hover:underline transition">Contact Us</Link>
        <span className="mx-2">·</span>
        <span>Not a fatwa — consult a qualified scholar for your specific situation</span>
        <span className="mx-2">·</span>
        <span>© {new Date().getFullYear()} Barakah</span>
      </footer>
    </div>
  );
}
