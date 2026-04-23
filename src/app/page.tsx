'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PRICING, FREE_FEATURES, PLUS_FEATURES, FAMILY_FEATURES, COMPETITOR_COMPARISON } from '../lib/pricing';
import {
  DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL,
  DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL,
} from '../lib/trial';
import {
  IOS_APP_STORE_URL,
  ANDROID_PLAY_STORE_URL,
  ANDROID_FALLBACK_URL,
  IS_ANDROID_PUBLICLY_LAUNCHED,
} from '../lib/appStore';

// ── Data ────────────────────────────────────────────────────────────────────

const features = [
  { icon: '💰', title: 'Zakat Calculator', desc: "Multi-madhab nisab (gold or silver standard), live prices, Hawl tracker, and auto-categorized asset breakdown — supporting Hanafi, Shafi'i, Maliki, Hanbali, and AMJA methodologies." },
  { icon: '🛡️', title: 'Riba Detector', desc: 'Scan transactions to flag interest-bearing activity and stay halal-compliant with automatic alerts.' },
  { icon: '✅', title: 'Halal Stock Screener', desc: '30,000+ stocks screened against AAOIFI Standard 21 — filter by halal or haram with sector breakdown.' },
  { icon: '📊', title: 'Budgets & Analytics', desc: 'Track spending by category and see where every dollar goes with visualized insights and trends.' },
  { icon: '💎', title: 'Net Worth Tracker', desc: 'Real-time net worth with assets, debts, and investments in one comprehensive dashboard.' },
  { icon: '🤲', title: 'Sadaqah & Waqf', desc: 'Log charitable giving and endowments alongside everyday finances with dedicated impact tracking.' },
  { icon: '📜', title: 'Wasiyyah & Estate Obligations', desc: 'Record your Islamic will, beneficiaries, and outstanding obligations (Zakat, Kaffarah, loans) for family.' },
  { icon: '🎯', title: 'Savings Goals', desc: 'Set goals for Hajj, emergency funds, or any milestone — with automatic Hajj savings template.' },
  { icon: '⭐', title: 'Barakah Score', desc: 'Your Islamic financial health score (0–100) across Zakat, Riba-free living, Sadaqah, Hawl, and debt.' },
  { icon: '🕌', title: 'Prayer Times', desc: "Daily salah schedule for any city worldwide, with next prayer countdown and Jumu'ah times." },
  { icon: '🔄', title: 'Subscription Detector', desc: 'Automatically detect recurring subscriptions from your transactions — flag haram services instantly.' },
  { icon: '🔔', title: 'Smart Islamic Reminders', desc: 'Bill due alerts, Hawl anniversaries, Zakat nisab threshold alerts, and savings milestones built-in.' },
  { icon: '👥', title: 'Shared Family Finances', desc: 'Family plan lets up to 6 members track shared expenses, group transactions, and family Zakat.' },
  { icon: '🌍', title: 'Multi-Currency Support', desc: 'Track finances across USD, GBP, EUR, AED, and 50+ currencies with live exchange rates daily.' },
];


const learningResources = [
  { title: 'Zakat on Gold', href: '/learn/zakat-on-gold', desc: 'Understand how gold-based nisab works and calculate your zakat obligation.' },
  { title: 'Zakat on Retirement Accounts', href: '/learn/zakat-on-retirement-accounts', desc: 'Navigate zakat rules for 401(k)s, IRAs, and other retirement savings.' },
  { title: 'Zakat on Savings', href: '/learn/zakat-on-savings', desc: 'Learn which savings are zakatable and how to calculate your obligation.' },
  { title: 'Nisab Threshold', href: '/learn/nisab', desc: 'Understand the nisab threshold and how it\'s calculated with current gold and silver prices.' },
  { title: 'Zakat Al-Fitr', href: '/learn/zakat-al-fitr', desc: 'Master Zakat Al-Fitr, the charity given at the end of Ramadan.' },
  { title: 'Islamic Finance Basics', href: '/learn/islamic-finance-basics', desc: 'Learn the fundamentals of Islamic finance principles and halal investing.' },
  { title: 'Riba Elimination Guide', href: '/learn/riba-elimination', desc: 'Step-by-step guide to removing interest from mortgages, credit cards, and loans.' },
  { title: 'Madhab & Your Finances', href: '/learn/madhab-finance', desc: 'How Hanafi, Shafi\'i, Maliki, and Hanbali rulings affect zakat and estate planning.' },
  { title: 'Islamic Inheritance (Faraid)', href: '/faraid-calculator', desc: 'Calculate Quranic inheritance shares for all heirs with automatic Awl and Radd.' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    annual: null,
    color: 'border-gray-200',
    badge: null,
    features: [...FREE_FEATURES],
    missing: [
      'Bank account sync',
      'Riba Elimination Journey',
      'Faraid Calculator',
      'Zakat receipts',
      'Safe-to-spend',
      'Halal screener',
      'Barakah Score',
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
    features: [...PLUS_FEATURES],
    missing: [],
    note: 'Need shared household workflows? Family adds up to 6 members with household zakat visibility and estate continuity.',
    cta: `Start ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} Free Trial`,
    ctaHref: '/signup',
    ctaStyle: 'bg-[#1B5E20] text-white hover:bg-[#2E7D32]',
  },
  {
    name: 'Family',
    price: PRICING.family.monthly,
    period: PRICING.family.monthlyPeriod,
    annual: `${PRICING.family.yearly}/yr · save 34%`,
    color: 'border-purple-300',
    badge: 'For Households',
    features: [...FAMILY_FEATURES],
    missing: [],
    cta: 'Start Family',
    ctaHref: '/signup',
    ctaStyle: 'bg-purple-600 text-white hover:bg-purple-700',
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  // Default to annual billing on homepage pricing — same rationale as
  // /pricing page: 17%/34% savings should be the first frame every
  // visitor sees, and annual plans churn less (LTV win).
  const [isAnnual, setIsAnnual] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Organization + WebSite JSON-LD for the homepage. Root-level schema that
  // Google uses for Knowledge Panel entries + sitelinks search box in SERP.
  // Per Google's guidelines: one Organization + one WebSite per root domain.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Barakah',
    alternateName: 'Barakah Finance',
    url: 'https://trybarakah.com',
    logo: 'https://trybarakah.com/icon.png',
    description:
      "Free Islamic finance app for Muslim households — zakat calculator, halal investing, riba detection, Islamic will planning, and family budgeting with fiqh rules built in.",
    sameAs: [
      'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229',
      'https://play.google.com/store/apps/details?id=com.trybarakah.app',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@trybarakah.com',
      contactType: 'customer support',
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    },
  };
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Barakah',
    url: 'https://trybarakah.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://trybarakah.com/learn?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Barakah — Islamic Finance',
    operatingSystem: 'iOS, Android, Web',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '1',
    },
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />

      {/* ── Nav ── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</span>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#1B5E20] transition">Features</a>
            <Link href="/pricing" className="hover:text-[#1B5E20] transition">Pricing</Link>
            <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
            <Link href="/careers" className="hover:text-[#1B5E20] transition">Careers</Link>
            <Link href="/trust" className="hover:text-[#1B5E20] transition">Trust</Link>
            <Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* Hamburger menu button - visible on mobile only */}
            {/* Round 18: added aria-expanded + aria-controls so screen readers
                and keyboard users can tell whether the menu is open/closed. */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 text-[#1B5E20]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-panel"
            >
              <div className="w-6 h-0.5 bg-[#1B5E20]"></div>
              <div className="w-6 h-0.5 bg-[#1B5E20]"></div>
              <div className="w-6 h-0.5 bg-[#1B5E20]"></div>
            </button>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Get Started Free
            </Link>
          </div>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu-panel" className="md:hidden bg-white border-t border-gray-100">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3 text-sm text-gray-600">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B5E20] transition py-2">Features</a>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B5E20] transition py-2">Pricing</Link>
              <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B5E20] transition py-2">Learn</Link>
              <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B5E20] transition py-2">Careers</Link>
              <Link href="/trust" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B5E20] transition py-2">Trust</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B5E20] transition py-2">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-5xl mb-4">🌙</p>
        <p className="text-xs text-[#1B5E20] font-semibold mb-6 inline-block bg-green-50 px-4 py-2 rounded-full border border-[#1B5E20]">
          🎁 {`${DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} of Plus free with every signup · no credit card`}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] leading-tight mb-4">
          The money app<br className="hidden sm:block" /> built for Muslim households
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Zakat, hawl, halal investing, budgets, and estate planning in one place &mdash; with fiqh rules built in, so every number you see already respects your deen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-[#2E7D32] transition shadow">
            Start {DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} Free Trial
          </Link>
          <Link href="/login" className="bg-white text-[#1B5E20] border border-[#1B5E20] px-8 py-3.5 rounded-xl font-bold text-base hover:bg-green-50 transition">
            Sign In
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">Plus tier free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} &middot; Drops to free plan after &middot; Your data is yours</p>
      </section>

      {/* ── Trust Indicators Bar ── */}
      <section className="bg-white py-6 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Trusted by Muslim households worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-lg md:text-xl font-extrabold text-[#1B5E20]">Bank-Grade</p>
              <p className="text-xs text-gray-500 mt-1">TLS 1.2+ in transit · AES-256 for bank secrets</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-extrabold text-[#1B5E20]">Zero</p>
              <p className="text-xs text-gray-500 mt-1">Data sold to third parties</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-extrabold text-[#1B5E20]">Plaid-Secured</p>
              <p className="text-xs text-gray-500 mt-1">Bank-level account linking</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-extrabold text-[#1B5E20]">IAM-Built</p>
              <p className="text-xs text-gray-500 mt-1">By a cybersecurity professional</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-gray-400 uppercase tracking-wider font-semibold mb-10">What Muslim households are saying</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &ldquo;Finally an app that actually calculates my zakat correctly — hawl tracker, nisab check, and everything in one place. I used to spend hours on spreadsheets.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">A</div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Ahmed K.</p>
                  <p className="text-xs text-gray-400">Houston, TX · Barakah Plus</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &ldquo;The riba detector caught interest credits I didn&apos;t even notice in my high-yield savings. Made my zakat calculation so much cleaner. Worth every penny of Plus.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">F</div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Fatima S.</p>
                  <p className="text-xs text-gray-400">Chicago, IL · Barakah Family</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                &ldquo;My wife and I share a Family plan and use it for budgeting, Hajj savings, and screening our investments. No other app does all of this — and it&apos;s cheaper than YNAB.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">O</div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Omar & Hana R.</p>
                  <p className="text-xs text-gray-400">Toronto, ON · Barakah Family</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">Live on iOS &amp; Android · Built for Muslim households</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">
            One system for money, obligations, and family continuity
          </h2>
          <p className="text-center text-gray-500 mb-12">From spending and savings to zakat, waqf, and wasiyyah, each tool connects to the life a Muslim household is actually trying to live.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
            {features.map(f => (
              <div key={f.title} className="bg-[#FFF8E1] rounded-2xl p-5 hover:shadow-md transition h-full">
                <p className="text-3xl mb-3">{f.icon}</p>
                <h3 className="font-bold text-[#1B5E20] mb-2">{f.title}</h3>
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
            Why Barakah feels different
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Most apps help with one slice of the problem. Barakah connects everyday money management with fiqh choices, family accountability, and end-of-life preparedness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">🕌</p>
              <h3 className="font-bold text-gray-900 mb-2">Fiqh-Personalized Guidance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Barakah does not assume one-size-fits-all Islam. Users can choose madhab-based settings, track hawl correctly, and apply rules that reflect real differences in Islamic financial practice.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">👨‍👩‍👧‍👦</p>
              <h3 className="font-bold text-gray-900 mb-2">Household, Not Solo Finance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Shared budgets, family visibility, estate sharing, and guided obligations make Barakah feel like a financial home for Muslim households, not just a tool for one person tracking numbers.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">📜</p>
              <h3 className="font-bold text-gray-900 mb-2">From Hawl to Wasiyyah</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most competitors stop at halal investing or zakat. Barakah covers the full chain: earning, avoiding riba, giving, planning waqf, and preparing your estate before it becomes a crisis.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center mt-6 md:mt-0 md:col-start-2">
              <p className="text-4xl mb-3">⭐</p>
              <h3 className="font-bold text-gray-900 mb-2">Accountability You Can Act On</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The Barakah Score turns ideals into practical next steps across zakat, sadaqah, halal cleanliness, debt, and savings so users can steadily improve, not just observe.
              </p>
            </div>
          </div>

          {/* Ranked stats */}
          <div className="mt-10 bg-[#1B5E20] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <p className="text-4xl font-extrabold mb-1">4</p>
              <p className="text-green-200 text-sm">Madhabs supported for zakat and fiqh-aware settings</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">85g / 595g</p>
              <p className="text-green-200 text-sm">Live gold and silver nisab references surfaced throughout the product</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">$0</p>
              <p className="text-green-200 text-sm">To start building a more faithful financial system for your household</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1B5E20] mb-2">Simple, Honest Pricing</h2>
          <p className="text-center text-gray-500 mb-8">Clear pricing, no hidden upsells, and no data selling.</p>

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
                {'note' in plan && plan.note ? (
                  <p className="mt-4 rounded-xl bg-[#FFF8E1] px-3 py-2 text-xs text-gray-600">
                    {plan.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {/* Competitor Comparison Table */}
          <div className="mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-center text-[#1B5E20] mb-2">How Barakah Compares</h3>
            <p className="text-center text-gray-500 mb-8">Same powerful budgeting. Plus Islamic finance tools no one else has.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Feature</th>
                    <th className="py-3 px-4 bg-[#1B5E20] text-white font-bold">Barakah Plus</th>
                    <th className="py-3 px-4 font-medium text-gray-500">Monarch</th>
                    <th className="py-3 px-4 font-medium text-gray-500">YNAB</th>
                    <th className="py-3 px-4 font-medium text-gray-500">Zoya</th>
                    <th className="py-3 px-4 font-medium text-gray-500">Copilot</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITOR_COMPARISON.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2.5 px-4 text-gray-700">{row.feature}</td>
                      <td className="py-2.5 px-4 text-center bg-green-50 font-semibold text-[#1B5E20]">
                        {typeof row.barakah === 'boolean' ? (row.barakah ? '✓' : '✗') : row.barakah}
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-500">
                        {typeof row.monarch === 'boolean' ? (row.monarch ? '✓' : <span className="text-red-400">✗</span>) : row.monarch}
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-500">
                        {typeof row.ynab === 'boolean' ? (row.ynab ? '✓' : <span className="text-red-400">✗</span>) : row.ynab}
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-500">
                        {typeof row.zoya === 'boolean' ? (row.zoya ? '✓' : <span className="text-red-400">✗</span>) : row.zoya}
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-500">
                        {typeof row.copilot === 'boolean' ? (row.copilot ? '✓' : <span className="text-red-400">✗</span>) : row.copilot}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-6">
              <Link href="/pricing" className="text-[#1B5E20] font-semibold hover:underline">
                View full pricing details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Islamic principles note ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-3xl mb-3">🕌</p>
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Built on Islamic Principles</h2>
          <p className="text-gray-600 leading-relaxed">
            Barakah supports multiple schools of Islamic jurisprudence for zakat and related rules, flags riba-bearing activity, and helps households track obligations that are often scattered across spreadsheets, reminders, and private notes. We are a decision-support tool, not a fatwa service, so specific rulings should still be confirmed with a qualified scholar.
          </p>
        </div>
      </section>

      {/* ── Meet the Founder ── */}
      <section className="py-20 px-6 bg-[#FFF8E1]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-[#1B5E20] uppercase tracking-wider font-semibold mb-2">Who Builds Barakah</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Built by a Cybersecurity Professional</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Your financial data deserves the same protection as enterprise systems. Barakah is built by someone who has spent over a decade securing them.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#1B5E20]/20">
                <Image
                  src="/basiru-jallow.png"
                  alt="Basiru Jallow"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Basiru Jallow</h3>
                <p className="text-sm text-[#1B5E20] font-semibold mb-3">Founder & Senior Security Engineer</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  10+ years in enterprise cybersecurity and identity governance. Former Senior SailPoint Developer at Deloitte GPS supporting the Social Security Administration, and cybersecurity lead at CBRE Group (Fortune 200). Full-stack engineer across Java, Python, TypeScript, and Flutter. Built Barakah to give Muslim households the same caliber of secure, well-engineered financial tools that Fortune 500 companies rely on — with security practices from the identity and access management industry.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-50 text-[#1B5E20] px-3 py-1 rounded-full font-medium border border-green-100">Cybersecurity — 10+ Years</span>
                  <span className="text-xs bg-green-50 text-[#1B5E20] px-3 py-1 rounded-full font-medium border border-green-100">Federal IAM (Deloitte GPS)</span>
                  <span className="text-xs bg-green-50 text-[#1B5E20] px-3 py-1 rounded-full font-medium border border-green-100">Fortune 200 (CBRE)</span>
                  <span className="text-xs bg-green-50 text-[#1B5E20] px-3 py-1 rounded-full font-medium border border-green-100">Full-Stack Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Free Zakat Calculator ── */}
      <section className="py-20 px-6 bg-[#FFF8E1]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-4xl mb-4">🧮</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Free Zakat Calculator</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Calculate your zakat obligation instantly with our free, multi-madhab zakat calculator. Use live gold and silver nisab references, review asset categories clearly, and move into a fuller household finance system only if you need more.
            </p>
            <Link
              href="/zakat-calculator"
              className="inline-block bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition shadow"
            >
              Try Zakat Calculator Now
            </Link>
            <p className="text-gray-400 text-sm mt-3">No signup required — try it free in 30 seconds</p>
          </div>
        </div>
      </section>

      {/* ── Faraid Calculator ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-4xl mb-4">⚖️</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Free Islamic Inheritance Calculator</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Calculate Faraid (Islamic inheritance distribution) per Quran 4:11-12. Supports all Quranic heirs with automatic Awl, Radd, and blocking rules. The only calculator that respects your madhab.
            </p>
            <Link
              href="/faraid-calculator"
              className="inline-block bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition shadow"
            >
              Try Faraid Calculator
            </Link>
            <p className="text-gray-400 text-sm mt-3">No signup required — calculate Islamic inheritance instantly</p>
          </div>
        </div>
      </section>

      {/* ── Learn About Islamic Finance ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Learn About Islamic Finance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn the fiqh and practical thinking behind zakat, nisab, halal investing, household obligations, and Islamic estate planning.
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

      {/* ── Download on App Stores ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mb-3">Available Everywhere You Are</h2>
          <p className="text-gray-600 mb-8">Download on iOS or Android, or use the web app from any browser.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={IOS_APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow"
            >
              <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              <div className="text-left">
                <p className="text-[10px] leading-tight opacity-80">Download on the</p>
                <p className="text-base font-semibold leading-tight">App Store</p>
              </div>
            </a>
            {IS_ANDROID_PUBLICLY_LAUNCHED ? (
              <a
                href={ANDROID_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="text-left">
                  <p className="text-[10px] leading-tight opacity-80">Get it on</p>
                  <p className="text-base font-semibold leading-tight">Google Play</p>
                </div>
              </a>
            ) : (
              <Link
                href={ANDROID_FALLBACK_URL}
                className="inline-flex items-center gap-3 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition shadow border border-gray-300"
                aria-label="Android app is in final testing — visit /open for details"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current opacity-70"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="text-left">
                  <p className="text-[10px] leading-tight opacity-80">Android</p>
                  <p className="text-sm font-semibold leading-tight">Launching soon</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-[#1B5E20] py-14 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Build a more faithful financial system for your household</h2>
        <p className="text-green-200 mb-6 text-sm">Start with daily money. Stay for zakat discipline, household clarity, and estate readiness.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow">
            Create Free Account
          </Link>
          <Link href="/refer" className="inline-block border-2 border-white text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-[#1B5E20] transition">
            Refer a Friend — Get 1 Month Free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-3">🌙 Barakah</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fiqh-aware household finance for Muslims who want daily money, Islamic obligations, and family continuity to live in one place.
              </p>
            </div>
            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link></li>
                <li><Link href="/careers" className="hover:text-[#1B5E20] transition">Careers</Link></li>
                <li><Link href="/methodology" className="hover:text-[#1B5E20] transition">Methodology</Link></li>
                <li><Link href="/trust" className="hover:text-[#1B5E20] transition">Trust & Security</Link></li>
                <li><Link href="/security" className="hover:text-[#1B5E20] transition">Security FAQ</Link></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                <li><a href="mailto:support@trybarakah.com" className="hover:text-[#1B5E20] transition">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Bottom Bar */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex gap-4 mb-4 md:mb-0">
                {/* Round 18: added aria-labels to all social icons so
                    screen-reader users hear meaningful link names instead of
                    emoji/text content. */}
                <a href="https://www.tiktok.com/@trybarakah" target="_blank" rel="noopener noreferrer" aria-label="Barakah on TikTok" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm font-bold" title="TikTok">♪</a>
                <a href="https://www.instagram.com/trybarakah/" target="_blank" rel="noopener noreferrer" aria-label="Barakah on Instagram" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="Instagram">📷</a>
                <a href="https://linkedin.com/company/barakah" target="_blank" rel="noopener noreferrer" aria-label="Barakah on LinkedIn" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="LinkedIn">in</a>
                <a href={IOS_APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Barakah on the App Store" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="App Store">🍎</a>
                {IS_ANDROID_PUBLICLY_LAUNCHED && (
                  <a href={ANDROID_PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Barakah on Google Play" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition text-sm" title="Google Play">🤖</a>
                )}
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
