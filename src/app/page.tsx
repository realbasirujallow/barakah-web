'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRICING } from '../lib/pricing';

// ── Data ────────────────────────────────────────────────────────────────────

const features = [
  { icon: '🕌', title: 'Zakat Calculator', desc: 'Multi-madhab nisab (gold or silver standard), live prices, Hawl tracker, and auto-categorized asset breakdown — supporting Hanafi, Shafi&apos;i, Maliki, Hanbali, and AMJA methodologies.' },
  { icon: '🛡️', title: 'Riba Detector', desc: 'Scan transactions to flag interest-bearing activity and stay halal-compliant with automatic alerts.' },
  { icon: '✅', title: 'Halal Stock Screener', desc: '30,000+ stocks screened against AAOIFI Standard 21 — filter by halal or haram with sector breakdown.' },
  { icon: '📊', title: 'Budgets & Analytics', desc: 'Track spending by category and see where every dollar goes with visualized insights and trends.' },
  { icon: '💎', title: 'Net Worth Tracker', desc: 'Real-time net worth with assets, debts, and investments in one comprehensive dashboard.' },
  { icon: '🤲', title: 'Sadaqah & Waqf', desc: 'Log charitable giving and endowments alongside everyday finances with dedicated impact tracking.' },
  { icon: '📜', title: 'Wasiyyah & Estate Obligations', desc: 'Record your Islamic will, beneficiaries, and outstanding obligations (Zakat, Kaffarah, loans) for family.' },
  { icon: '🎯', title: 'Savings Goals', desc: 'Set goals for Hajj, emergency funds, or any milestone — with automatic Hajj savings template.' },
  { icon: '⭐', title: 'Barakah Score', desc: 'Your Islamic financial health score (0–100) across Zakat, Riba-free living, Sadaqah, Hawl, and debt.' },
  { icon: '🕌', title: 'Prayer Times', desc: 'Daily salah schedule for any city worldwide, with next prayer countdown and Jumu&apos;ah times.' },
  { icon: '🔄', title: 'Subscription Detector', desc: 'Automatically detect recurring subscriptions from your transactions — flag haram services instantly.' },
  { icon: '🔔', title: 'Smart Islamic Reminders', desc: 'Bill due alerts, Hawl anniversaries, Zakat nisab threshold alerts, and savings milestones built-in.' },
  { icon: '👥', title: 'Shared Family Finances', desc: 'Family plan lets up to 6 members track shared expenses, group transactions, and family Zakat.' },
  { icon: '🌍', title: 'Multi-Currency Support', desc: 'Track finances across USD, GBP, EUR, AED, and 50+ currencies with live exchange rates daily.' },
];


const learningResources = [
  { title: 'Zakat on Gold', href: '/learn/zakat-on-gold', desc: 'Understand how gold-based nisab works and calculate your zakat obligation.' },
  { title: 'Zakat on Retirement Accounts', href: '/learn/zakat-on-retirement-accounts', desc: 'Navigate zakat rules for 401(k)s, IRAs, and other retirement savings.' },
  { title: 'Zakat on Savings', href: '/learn/zakat-on-savings', desc: 'Learn which savings are zakatable and how to calculate your obligation.' },
  { title: 'Nisab Threshold', href: '/learn/nisab-threshold', desc: 'Understand the nisab threshold and how it\'s calculated with current gold prices.' },
  { title: 'Zakat Al-Fitr', href: '/learn/zakat-al-fitr', desc: 'Master Zakat Al-Fitr, the charity given at the end of Ramadan.' },
  { title: 'Islamic Finance Basics', href: '/learn/islamic-finance-basics', desc: 'Learn the fundamentals of Islamic finance principles and halal investing.' },
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
      'Budgets & bills tracking',
      'Savings goals',
      'Sadaqah tracking',
      'Ramadan Mode',
      'Recurring transactions',
      'Smart Islamic reminders',
    ],
    missing: [
      'Halal screener',
      'Subscription detector',
      'Riba detector',
      'Auto-categorize',
      'Investments & net worth',
      'Wasiyyah & Waqf',
      'Barakah Score & analytics',
      'Export CSV/PDF',
      'Shared finances',
    ],
    cta: 'Get Started Free',
    ctaHref: '/signup',
    ctaStyle: 'border border-[#1B5E20] text-[#1B5E20] hover:bg-green-50',
  },
  {
    name: 'Plus',
    price: PRICING.plus.monthly,
    period: PRICING.plus.monthlyPeriod,
    annual: `${PRICING.plus.yearly}/yr · save 17%`,
    color: 'border-[#1B5E20] ring-2 ring-[#1B5E20]',
    badge: 'Most Popular',
    features: [
      'Unlimited transactions',
      'All Free features',
      'Halal stock screener (30,000+ stocks)',
      'Subscription detector (flag haram services)',
      'Riba detector',
      'Auto-categorize transactions',
      'Investments & net worth',
      'Wasiyyah & Waqf planning',
      'Barakah Score & analytics',
      'Debt Payoff Projector',
      'Financial Summary reports',
      'Export CSV/PDF',
    ],
    missing: ['Shared family finances'],
    cta: 'Start Plus',
    ctaHref: '/signup',
    ctaStyle: 'bg-[#1B5E20] text-white hover:bg-[#2E7D32]',
  },
  {
    name: 'Family',
    price: PRICING.family.monthly,
    period: PRICING.family.monthlyPeriod,
    annual: `${PRICING.family.yearly}/yr · save 34%`,
    color: 'border-purple-300',
    badge: null,
    features: [
      'Everything in Plus',
      'Shared finances (up to 6 members)',
      'Family Zakat management',
      'Shared budgets & goals',
      'Family Estate Visibility (see each other\u2019s wills & endowments)',
      'Shared expense splitting',
      'Family financial summary',
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
  { feature: 'Starting price',
    bText: 'Free',   ynabText: '$11.99/mo', mintText: 'Free*', zoyaText: 'Free' },
];

const Tick = () => <span className="text-[#1B5E20] font-bold text-lg">✓</span>;
const Cross = () => <span className="text-gray-300 font-bold text-lg">✕</span>;

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

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
        <p className="text-xs text-[#1B5E20] font-semibold mb-6 inline-block bg-green-50 px-4 py-2 rounded-full border border-[#1B5E20]">
          ✨ Trusted by Muslim families worldwide
        </p>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Manage your entire financial life — budgets, Zakat, investments, halal screening, and Islamic giving — all in one Shariah-aware dashboard with zero distractions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-[#2E7D32] transition shadow">
            Create Free Account
          </Link>
          <Link href="/login" className="bg-white text-[#1B5E20] border border-[#1B5E20] px-8 py-3.5 rounded-xl font-bold text-base hover:bg-green-50 transition">
            Sign In
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required · No ads · Your data is yours</p>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            Everything you need in one place
          </h2>
          <p className="text-center text-gray-500 mb-12">From everyday budgeting to Zakat, Waqf, investments, and beyond.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
            {features.map(f => (
              <div key={f.title} className="bg-[#FFF8E1] rounded-2xl p-5 hover:shadow-md transition h-full">
                <p className="text-3xl mb-3">{f.icon}</p>
                <h3 className="font-bold text-[#1B5E20] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-[#FFF8E1] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            Loved by Muslim families
          </h2>
          <p className="text-center text-gray-500 mb-12">Join thousands of Muslims managing their finances the halal way.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-1 mb-4">
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &quot;Finally, a finance app that understands Zakat and riba. No more spreadsheets!&quot;
              </p>
              <p className="text-sm font-semibold text-gray-900">Aisha, London</p>
              <p className="text-xs text-gray-500">Muslim Financial Planner</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-1 mb-4">
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &quot;The halal screener is game-changing. My family knows our portfolio is Shariah-compliant.&quot;
              </p>
              <p className="text-sm font-semibold text-gray-900">Mohammed, Toronto</p>
              <p className="text-xs text-gray-500">Business Owner</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-1 mb-4">
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &quot;The Barakah Score keeps us accountable. We&apos;re giving more Sadaqah than ever.&quot;
              </p>
              <p className="text-sm font-semibold text-gray-900">Fatima, Dubai</p>
              <p className="text-xs text-gray-500">Educator & Mom</p>
            </div>
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
              <h3 className="font-bold text-gray-900 mb-2">Multi-Madhab Zakat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most apps either skip zakat entirely or get the nisab wrong. Barakah supports all four schools of thought (Hanafi, Shafi&apos;i, Maliki, Hanbali) plus AMJA consensus — with gold and silver nisab options, a full Hawl calendar, and per-asset breakdown.
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
              <p className="text-4xl font-extrabold mb-1">40+</p>
              <p className="text-green-200 text-sm">Islamic financial features (Zakat, Riba, Halal, Waqf, and more)</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">30,000+</p>
              <p className="text-green-200 text-sm">Stocks screened for halal compliance per AAOIFI standards</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">$0</p>
              <p className="text-green-200 text-sm">To get started — no credit card, no ads, forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">Simple, Honest Pricing</h2>
          <p className="text-center text-gray-500 mb-8">No ads. No data selling. Just a clean tool that works for your deen and your dunya.</p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-[#1B5E20]' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition"
              style={{ backgroundColor: isAnnual ? '#1B5E20' : '#d1d5db' }}
            >
              <span
                className="inline-block h-5 w-5 transform rounded-full bg-white transition"
                style={{ marginLeft: isAnnual ? '1.5rem' : '0.25rem' }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-[#1B5E20]' : 'text-gray-500'}`}>
              Annual <span className="text-xs text-green-600 font-bold">(Save 17-34%)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl border-2 p-6 ${plan.color} bg-white flex flex-col h-full`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B5E20] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-[#1B5E20]">
                    {isAnnual && plan.annual ? (plan.annual.split('/')[0]) : plan.price}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">
                    {isAnnual && plan.annual ? '/yr' : plan.period}
                  </span>
                </div>
                {isAnnual && plan.annual && (
                  <p className="text-xs text-green-700 font-semibold mb-4">{plan.annual.split('·')[1]?.trim() || 'Best value'}</p>
                )}
                {!isAnnual && plan.annual && (
                  <p className="text-xs text-green-700 font-semibold mb-4">{plan.annual}</p>
                )}
                {!plan.annual && <div className="mb-4" />}
                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-2.5 rounded-xl font-bold text-sm transition mb-6 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
                <ul className="space-y-2 text-sm flex-grow">
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
      <section id="compare" className="py-20 px-6 bg-[#FFF8E1]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            How Barakah Compares
          </h2>
          <p className="text-center text-gray-500 mb-6">See why Muslim families are choosing Barakah over generic finance apps.</p>
          <div className="md:hidden text-xs text-gray-500 text-center mb-4 bg-white rounded-lg p-3">
            💡 Tip: Swipe the table horizontally to see all comparisons on mobile
          </div>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FFF8E1]">
                    <th className="px-5 py-4 text-left font-semibold text-gray-700 min-w-[180px]">Feature</th>
                    <th className="px-4 py-4 text-center font-bold text-[#1B5E20] min-w-[100px]">🌙 Barakah</th>
                    <th className="px-4 py-4 text-center font-semibold text-gray-500 min-w-[100px]">YNAB</th>
                    <th className="px-4 py-4 text-center font-semibold text-gray-500 min-w-[120px]">Mint / Copilot</th>
                    <th className="px-4 py-4 text-center font-semibold text-gray-500 min-w-[100px]">Zoya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonRows.map(row => (
                    <tr key={row.feature} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-700 font-medium">{row.feature}</td>
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
            <p className="px-5 py-4 text-xs text-gray-400 border-t bg-gray-50">
              * Mint discontinued Jan 2024; Copilot is US-only at $8.99/mo. Data based on publicly available feature sets as of April 2026.
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
            Barakah supports multiple schools of Islamic jurisprudence (Hanafi, Shafi&apos;i, Maliki, Hanbali, and AMJA consensus) for Zakat calculation, flags riba-bearing transactions, and helps you track all your Islamic financial obligations in one place. We are a tool to help you stay informed — always consult a qualified scholar for specific rulings.
          </p>
        </div>
      </section>

      {/* ── Free Zakat Calculator ── */}
      <section className="py-20 px-6 bg-[#FFF8E1]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-4xl mb-4">🧮</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Free Zakat Calculator</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Calculate your zakat obligation instantly with our free, multi-madhab zakat calculator. Support for gold or silver nisab, live gold prices, and detailed breakdowns by asset type.
            </p>
            <Link
              href="/zakat-calculator"
              className="inline-block bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition shadow"
            >
              Try Zakat Calculator Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Learn About Islamic Finance ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Learn About Islamic Finance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Deepen your understanding of zakat, nisab, halal investing, and Islamic financial principles with our comprehensive learning resources.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {learningResources.map(resource => (
              <Link
                key={resource.href}
                href={resource.href}
                className="bg-[#FFF8E1] hover:shadow-md transition rounded-2xl p-6 border border-gray-100"
              >
                <h3 className="font-bold text-[#1B5E20] mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{resource.desc}</p>
                <div className="mt-4 text-[#1B5E20] font-semibold text-sm">Learn More →</div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/learn"
              className="inline-block bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition"
            >
              View All Articles
            </Link>
          </div>
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
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-3">🌙 Barakah</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Halal money management for Muslim families worldwide. Built with care, guided by Islamic principles.
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><Link href="/dashboard" className="hover:text-[#1B5E20] transition">Dashboard</Link></li>
                <li><a href="#features" className="hover:text-[#1B5E20] transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#1B5E20] transition">Pricing</a></li>
                <li><Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><Link href="/about" className="hover:text-[#1B5E20] transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-[#1B5E20] transition">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-[#1B5E20] transition">Careers</Link></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                <li><a href="mailto:support@barakah.app" className="hover:text-[#1B5E20] transition">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Bottom Bar */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex gap-4 mb-4 md:mb-0">
                <a href="https://twitter.com/barakahapp" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm font-bold" title="Twitter">𝕏</a>
                <a href="https://instagram.com/barakahapp" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="Instagram">📷</a>
                <a href="https://linkedin.com/company/barakah" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="LinkedIn">in</a>
                <a href="https://youtube.com/@barakahapp" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="YouTube">▶️</a>
              </div>
              <p className="text-xs text-gray-500 text-center md:text-right">
                <span className="block">© {new Date().getFullYear()} Barakah. All rights reserved.</span>
                <span className="block mt-1">Not a fatwa — consult a qualified scholar for guidance on Islamic rulings.</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
