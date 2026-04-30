'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING } from '../../lib/pricing';

/**
 * Phase 18 / Brief B (2026-04-30) — Homepage v2 SKELETON.
 *
 * This is the proof-led structure proposed in the redesign brief.
 * It is NOT yet wired to /. The current homepage at src/app/page.tsx
 * stays the live homepage until the founder reviews this version,
 * approves the copy, and provides product screenshots.
 *
 * Reachable at /v2 for review. To promote: rename this file to
 * /src/app/page.tsx and archive the old one.
 *
 * What's still placeholder (founder action needed):
 *   • Hero one-liner — three drafts below; pick / write your own.
 *   • Three product-screenshot images at 1280×720. Right now they
 *     render as gradient placeholders with the caption baked in.
 *   • Outcome section copy (3 × ~80 words). Drafts below; edit voice.
 *
 * What's already wired:
 *   • Pricing block reads from `lib/pricing` (live).
 *   • Final CTA links to /signup.
 *   • Trust + footer reused from existing homepage where applicable.
 */

const HERO_DRAFTS = [
  // Pick one (or write your own) for the production version.
  'Calculate zakat, screen halal, plan your Islamic estate — all in one place.',
  "The halal home for your money.",
  'Money management built on Islamic principles, designed for modern Muslim households.',
];

const HERO_LINE = HERO_DRAFTS[0];

const OUTCOME_BLOCKS = [
  {
    eyebrow: 'For zakat',
    headline: 'Calculate zakat in 60 seconds',
    body: 'Add cash, gold, stocks, crypto — Barakah computes your nisab eligibility, tracks the lunar year (hawl), and tells you exactly when zakat is due. Four madhabs supported, gold and silver thresholds live.',
    cta: { label: 'Try the calculator →', href: '/zakat-calculator' },
    screenshotCaption: 'Zakat in 60 seconds — auto-track the lunar year',
  },
  {
    eyebrow: 'For spending',
    headline: 'Catch riba on every charge',
    body: 'Connect your bank and Barakah flags interest charges, late fees, and other riba in your transactions. Filter halal vs haram spend, and clean it up before zakat season.',
    cta: { label: 'See the riba detector →', href: '/learn/riba-elimination' },
    screenshotCaption: 'Catch riba on every charge',
  },
  {
    eyebrow: 'For your estate',
    headline: 'Plan your Islamic will, faraid-aware',
    body: 'List heirs with their Qur’anic inheritance shares, log financial obligations (debts, dowry, funeral), and generate a printable wasiyyah PDF — all faraid-aware out of the box.',
    cta: { label: 'Open the planner →', href: '/faraid-calculator' },
    screenshotCaption: 'Plan your Islamic will, faraid-aware',
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
      {/* DRAFT BANNER — remove before promoting to / */}
      <div className="bg-amber-100 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 text-center">
        <span className="font-semibold">DRAFT — homepage v2 redesign skeleton.</span>{' '}
        Needs founder copy + product screenshots before promoting to{' '}
        <code className="bg-amber-200/60 px-1 py-0.5 rounded">/</code>. See{' '}
        <a href="https://github.com/realbasirujallow/barakah-web" className="underline">PR + brief</a>.
      </div>

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
              {/* Screenshot placeholder — REPLACE with real PNG when ready */}
              <div className="relative aspect-video bg-gradient-to-br from-[#1B5E20]/10 to-emerald-200/30 rounded-2xl border border-[#1B5E20]/15 shadow-md flex items-center justify-center text-center p-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#1B5E20]/70 font-semibold mb-2">Product screenshot</p>
                  <p className="text-sm text-[#1B5E20] italic">{block.screenshotCaption}</p>
                  <p className="text-[11px] text-gray-400 mt-3">[1280×720 image goes here]</p>
                </div>
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
