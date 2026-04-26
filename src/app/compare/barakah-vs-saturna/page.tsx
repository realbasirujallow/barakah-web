import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Saturna Capital / Amana Funds (2026): Complementary, Not Competitive | Barakah',
  description:
    "Saturna's Amana Funds have been Sharia-compliant since 1986. Barakah doesn't compete — it's the household OS that sits alongside funds like AMANX. Here's how they fit together.",
  keywords: [
    'barakah vs saturna',
    'amana funds review',
    'saturna capital muslim',
    'islamic mutual funds',
    'halal investing track record',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-saturna' },
  openGraph: {
    title: 'Barakah vs Saturna Capital (2026) — Complementary, Not Competitive | Barakah',
    description: 'How Saturna\'s Amana Funds and Barakah work together for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-saturna',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', saturna: 'Asset manager — Amana Funds (mutual funds)', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', saturna: 'Fund expense ratios ~0.86%-1.07% (varies)', winner: 'Different jobs' as const },
  { feature: 'Track record', barakah: 'Live since 2025', saturna: 'Sharia-compliant funds since 1986; 30+ years', winner: 'Saturna' as const, note: 'Saturna\'s longevity in halal investing is unmatched in the US.' },
  { feature: 'Fund management', barakah: 'None — Barakah does not manage money', saturna: 'AMANX Income, AMAGX Growth, AMDWX Developing World, AMIGX Participation', winner: 'Saturna' as const, note: 'Active Sharia-compliant fund management is Saturna\'s entire business.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', saturna: 'None — they manage funds, not households', winner: 'Barakah' as const },
  { feature: 'Budgeting', barakah: 'Category-based, flexible', saturna: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening (third-party)', barakah: '30,000+ AAOIFI-screened — for any account', saturna: 'Internal screening for their own funds', winner: 'Barakah' as const, note: 'Different jobs — Saturna screens for AMANX; Barakah screens any ticker you hold anywhere.' },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', saturna: 'Provides zakat reports for fund holders', winner: 'Barakah' as const, note: 'Saturna\'s zakat reports are for their funds only.' },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', saturna: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', saturna: 'Funds avoid interest-bearing securities', winner: 'Tie' as const, note: 'Different scope — fund-level vs transaction-level.' },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', saturna: 'None', winner: 'Barakah' as const },
  { feature: 'Performance vs benchmark', barakah: 'N/A — not a fund manager', saturna: 'Long-running track record vs S&P 500 (varies by fund)', winner: 'Saturna' as const },
  { feature: 'Available in 401k plans', barakah: 'Tracks 401k via Plaid', saturna: 'Amana funds in many 401k menus + Saturna IRA available', winner: 'Saturna' as const, note: 'If your employer offers AMANX in your 401k, that\'s a real win.' },
  { feature: 'Mobile app', barakah: 'Live on iOS & Android', saturna: 'Web-first; account portal, no investment app', winner: 'Barakah' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', saturna: 'Standard fiduciary; no data sale', winner: 'Tie' as const },
];

export default function BarakahVsSaturnaPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Saturna</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Saturna Capital / Amana Funds (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            This isn&apos;t a competitive comparison. Saturna Capital has been running Sharia-compliant mutual funds —
            the Amana Funds — since 1986. Their track record in halal investing is unmatched in the United States.
            Barakah doesn&apos;t manage money and never will. We&apos;re the household OS: budget, zakat, hawl, halal
            screening on what you already own, faraid. Saturna is the fund manager. They sit alongside each other.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Use Saturna</strong> for: long-term, professionally-managed Sharia-compliant fund exposure (AMANX, AMAGX, etc.) — especially in IRAs and 401ks where available.</li>
              <li><strong>Use Barakah</strong> for: tracking those Saturna holdings alongside everything else, calculating zakat across all your assets, and the Islamic compliance layer for your household.</li>
              <li><strong>Use both</strong>: Saturna manages a slice of your portfolio; Barakah keeps the whole household&apos;s books in order.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Saturna</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.saturna}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Saturna' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
                        'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900'
                      }>
                        {r.winner}
                      </span>
                      {r.note && <p className="mt-1 text-xs italic text-gray-500">{r.note}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">The honest recommendation</h2>
            <p className="text-sm leading-7 text-amber-900">
              Saturna is the elder statesman of US halal investing. If you want a Sharia-compliant equity fund inside
              your IRA or 401k, AMANX or AMAGX are serious choices with a long history. Barakah doesn&apos;t replace any
              of that — link your Saturna brokerage account via Plaid and Barakah will track those positions, run
              halal screening on the rest of what you hold elsewhere, and calculate zakat across the whole household.
              Different jobs. Same goal.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Track your Saturna holdings + the rest of your household</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; Barakah brings together your Amana fund holdings, other investments,
              cash, gold, and crypto into one zakat and halal-screening view. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Get started free →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
