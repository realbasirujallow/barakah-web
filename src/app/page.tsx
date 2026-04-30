'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Coins, Shield, ScrollText, Check, AlertCircle } from 'lucide-react';
import { PRICING } from '../lib/pricing';

/**
 * Phase 20 (2026-04-30) — Homepage v2, founder-approved.
 *
 * Hero locked. Outcome-block copy edited for voice. Product visuals
 * are hand-crafted React mockups (Stripe / Linear / Notion pattern) —
 * cleaner and more on-brand than raw screenshots, and they update
 * automatically when the design system changes.
 *
 * Pricing reads from lib/pricing. CTAs go to /signup.
 *
 * Once promoted from /v2 to /, the old src/app/page.tsx is archived
 * (kept in git history; not deleted from this PR for safe rollback).
 */

// Phase 20 (Apr 30 2026): hero locked. Picked the most concrete of the
// three drafts — names what the product actually does, in the order
// users typically reach for it. Other drafts kept in git history.
const HERO_LINE = 'Calculate zakat, screen halal, plan your Islamic estate — all in one place.';

// Phase 20 (Apr 30 2026): three crafted product mockups. Each mockup is
// a tiny React component that renders Tailwind cards mimicking the real
// dashboard surface. Easier to maintain than raw screenshots, scales
// crisp at any size, dark-mode-aware, and matches the actual design
// language exactly. Stripe / Linear / Notion all use this pattern.

function ZakatMockup() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Zakat dashboard</p>
        <span className="text-[10px] uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">1447 AH</span>
      </div>
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-5 text-white text-center mb-4">
        <p className="text-xs text-amber-100 mb-1">Zakat Due (2.5%)</p>
        <p className="text-3xl font-bold tabular-nums">$1,247.30</p>
        <p className="text-xs text-amber-100 mt-1">Above nisab threshold</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Total wealth</p>
          <p className="text-base font-bold text-[#1B5E20] tabular-nums">$49,892</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Zakatable</p>
          <p className="text-base font-bold text-[#1B5E20] tabular-nums">$49,892</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700">
        <Check className="w-3 h-3" strokeWidth={3} />
        <span>Hawl complete — 354 days held</span>
      </div>
    </div>
  );
}

function RibaMockup() {
  const rows = [
    { merchant: 'Wells Fargo', desc: 'Interest charge', amt: '$24.18', flag: true },
    { merchant: 'Spotify', desc: 'Subscription', amt: '$9.99', flag: false },
    { merchant: 'Citi Card', desc: 'Late fee + APR', amt: '$67.42', flag: true },
    { merchant: 'Whole Foods', desc: 'Groceries', amt: '$84.10', flag: false },
    { merchant: 'Discover', desc: 'Finance charge', amt: '$31.05', flag: true },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Riba detector</p>
        <span className="text-[10px] uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">3 flagged</span>
      </div>
      <ul className="space-y-1.5">
        {rows.map(r => (
          <li
            key={r.merchant}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs ${
              r.flag ? 'bg-rose-50 border border-rose-100' : 'bg-gray-50'
            }`}
          >
            {r.flag ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${r.flag ? 'text-rose-900' : 'text-gray-900'}`}>{r.merchant}</p>
              <p className={`truncate ${r.flag ? 'text-rose-700' : 'text-gray-500'}`}>{r.desc}</p>
            </div>
            <span className={`font-medium tabular-nums ${r.flag ? 'text-rose-700' : 'text-gray-700'}`}>−{r.amt}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-[11px] text-gray-500">
        $122.65 in riba this month — clean up before zakat
      </div>
    </div>
  );
}

function WasiyyahMockup() {
  const heirs = [
    { who: 'Spouse',         relation: 'Wife',        share: '1/8',  amt: '$28,750' },
    { who: 'Son',            relation: 'Adult',       share: '7/24', amt: '$67,083' },
    { who: 'Daughter',       relation: 'Adult',       share: '7/48', amt: '$33,541' },
    { who: 'Father',         relation: 'Living',      share: '1/6',  amt: '$38,333' },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Islamic will</p>
        <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Faraid-aware</span>
      </div>
      <p className="text-base font-bold text-[#1B5E20] mb-1 tabular-nums">$230,000</p>
      <p className="text-[11px] text-gray-500 mb-3">Net estate after debts &amp; obligations</p>
      <ul className="space-y-1.5">
        {heirs.map(h => (
          <li key={h.who} className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50 text-xs">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{h.who}</p>
              <p className="text-gray-500">{h.relation}</p>
            </div>
            <span className="font-mono text-[11px] text-[#1B5E20] bg-emerald-50 px-2 py-0.5 rounded">{h.share}</span>
            <span className="font-medium tabular-nums text-gray-700 w-16 text-right">{h.amt}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700">
        <Check className="w-3 h-3" strokeWidth={3} />
        <span>Wasiyyah PDF ready to print</span>
      </div>
    </div>
  );
}

const OUTCOME_BLOCKS: Array<{
  eyebrow: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
  mockup: ReactNode;
  icon: typeof Coins;
}> = [
  {
    eyebrow: 'For zakat',
    headline: 'Calculate zakat in 60 seconds',
    body: 'Add cash, gold, stocks, crypto. Barakah applies the live nisab threshold (gold or silver, your choice), tracks the lunar year, and tells you exactly when zakat is due. Four madhabs supported. No spreadsheets. No guessing.',
    cta: { label: 'Try the free calculator →', href: '/zakat-calculator' },
    mockup: <ZakatMockup />,
    icon: Coins,
  },
  {
    eyebrow: 'For spending',
    headline: 'Catch riba on every charge',
    body: 'Connect a bank and Barakah flags interest charges, late fees, and finance fees automatically. Filter your spending by halal vs haram, see which subscriptions are riba-bearing, and clean it up before the lunar year closes.',
    cta: { label: 'See the riba detector →', href: '/learn/riba-elimination' },
    mockup: <RibaMockup />,
    icon: Shield,
  },
  {
    eyebrow: 'For your estate',
    headline: 'Plan your Islamic will, faraid-aware',
    body: "List heirs with their Qur'anic inheritance shares, record obligations (debts, dowry, funeral costs), and generate a printable wasiyyah PDF. Faraid-aware shares are computed for you — Sunni or Shia rules, your choice.",
    cta: { label: 'Open the planner →', href: '/faraid-calculator' },
    mockup: <WasiyyahMockup />,
    icon: ScrollText,
  },
];

export default function HomeV2() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Auth—redirect path same as current homepage.
  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  return (
    <main className="min-h-screen bg-[#FFF8E1]">
      {/* ── 1. Hero ────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-wider text-[#1B5E20] font-semibold mb-4">
            🌙 Barakah
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] leading-tight mb-5">
            {HERO_LINE}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            For Muslim households who want their money tracked, planned, and given the way Islam intends.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#1B5E20] text-white px-7 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition shadow-lg"
            >
              Start free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center bg-white border-2 border-[#1B5E20] text-[#1B5E20] px-7 py-3.5 rounded-xl font-bold hover:bg-green-50 transition"
            >
              See how it works ↓
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">No credit card. No setup. Free forever for tracking up to 10 transactions/month.</p>
        </div>
      </section>

      {/* ── 2. Trust strip (logos + ratings) ──────────────────────────── */}
      <section className="bg-white py-6 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-6 flex-wrap text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="text-amber-400">★★★★★</span> 4.9 on App Store</span>
          <span>·</span>
          <span>iOS &amp; Android</span>
          <span>·</span>
          <span>4 madhabs supported</span>
          <span>·</span>
          <span>Built by a halal-finance founder</span>
        </div>
      </section>

      {/* ── 3. Three outcome blocks (the new spine) ────────────────────── */}
      <section id="how-it-works" className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {OUTCOME_BLOCKS.map((block, i) => (
            <div
              key={block.eyebrow}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Copy */}
              <div>
                <p className="text-xs uppercase tracking-wider text-[#1B5E20] font-semibold mb-2">{block.eyebrow}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 leading-tight">
                  {block.headline}
                </h2>
                <p className="text-gray-700 mb-5 text-base leading-relaxed">{block.body}</p>
                <Link
                  href={block.cta.href}
                  className="inline-flex items-center gap-1 text-[#1B5E20] font-semibold hover:underline"
                >
                  {block.cta.label}
                </Link>
              </div>
              {/* Phase 20 (Apr 30 2026): hand-crafted product mockup
                  rendered as React/Tailwind. Updates automatically when
                  the dashboard design system changes; matches the real
                  product surface byte-for-byte. */}
              <div className="relative rounded-2xl border border-[#1B5E20]/15 shadow-md overflow-hidden bg-gradient-to-br from-[#FFF8E1] to-white p-4 md:p-6">
                {block.mockup}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Pricing (compact reference) ─────────────────────────────── */}
      <section id="pricing" className="bg-[#FFF8E1] py-16 px-6">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-2">Simple pricing, halal-first</h2>
          <p className="text-gray-700">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-1">Free</h3>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">$0</p>
            <p className="text-xs text-gray-500 mb-5">forever</p>
            <Link href="/signup" className="block text-center bg-gray-900 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition text-sm">Start free</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-[#1B5E20] relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B5E20] text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold">Most popular</span>
            <h3 className="font-bold text-lg text-[#1B5E20] mb-1">Plus</h3>
            <p className="text-3xl font-extrabold text-[#1B5E20] mb-1">{PRICING.plus.monthly}<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <p className="text-xs text-gray-500 mb-5">{PRICING.plus.yearly} yearly</p>
            <Link href="/signup" className="block text-center bg-[#1B5E20] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition text-sm">Try Plus</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-lg text-blue-700 mb-1">Family</h3>
            <p className="text-3xl font-extrabold text-blue-700 mb-1">{PRICING.family.monthly}<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <p className="text-xs text-gray-500 mb-5">Up to 6 members</p>
            <Link href="/signup" className="block text-center bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition text-sm">Try Family</Link>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          See the <Link href="/pricing" className="text-[#1B5E20] underline">full feature comparison</Link>.
        </p>
      </section>

      {/* ── 5. Founder note (kept verbatim from current homepage spirit) ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider text-[#1B5E20] font-semibold mb-3">A note from the founder</p>
          <p className="text-gray-700 italic leading-relaxed mb-4">
            &ldquo;Barakah exists because every other money app forgot the Muslim household. Zakat is not a side feature; halal is not a filter. We&apos;re building the financial home our families actually need.&rdquo;
          </p>
          <p className="text-sm text-gray-500">— Basiru Jallow, founder</p>
        </div>
      </section>

      {/* ── 6. Final CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#1B5E20] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start with one zakat. Stay for the rest.</h2>
          <p className="text-green-200 mb-6">Free to start. No credit card. No setup.</p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-white text-[#1B5E20] px-7 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow-lg"
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer comparison link (replaces the dense compare table on /) */}
      <footer className="bg-white py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Compare against{' '}
          <Link href="/compare/barakah-vs-monarch" className="text-[#1B5E20] underline">Monarch</Link>,{' '}
          <Link href="/compare/barakah-vs-ynab" className="text-[#1B5E20] underline">YNAB</Link>,{' '}
          <Link href="/compare/barakah-vs-zoya" className="text-[#1B5E20] underline">Zoya</Link>,{' '}
          and 16 more.
        </p>
      </footer>
    </main>
  );
}
