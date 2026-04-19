import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah vs Zoya (2026): Halal Finance App Comparison | Barakah',
  description:
    "An honest, feature-by-feature comparison of Barakah and Zoya for Muslim households in 2026. Where Zoya wins, where Barakah wins, and how to decide which one (or both) fits your needs.",
  keywords: [
    'barakah vs zoya',
    'zoya alternative',
    'best halal investing app',
    'best islamic finance app',
    'zoya vs barakah',
    'halal stock screener comparison',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/compare/barakah-vs-zoya',
  },
  openGraph: {
    title: 'Barakah vs Zoya (2026): Halal Finance App Comparison | Barakah',
    description: 'An honest, feature-by-feature comparison of Barakah and Zoya for Muslim households in 2026.',
    url: 'https://trybarakah.com/compare/barakah-vs-zoya',
    type: 'article',
  },
};

const rows = [
  { feature: 'Halal stock screener', barakah: '30k+ stocks screened (Plus)', zoya: 'Large specialist database across stocks, ETFs, and mutual funds', winner: 'Zoya' as const, note: 'Zoya is the specialist.' },
  { feature: 'Zakat calculator (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + business + crypto + receivables, integrity-hashed snapshots', zoya: 'Zakat only on held stocks', winner: 'Barakah' as const, note: 'Zoya does one asset; Barakah does the whole balance sheet.' },
  { feature: 'Hawl (354-day) tracking', barakah: 'Daily nisab-continuity snapshots, fiqh-aware reset', zoya: 'None', winner: 'Barakah' as const },
  { feature: 'Budget / transactions / bills', barakah: 'Full Plaid aggregation, budget, bills, debts, recurring', zoya: 'None', winner: 'Barakah' as const },
  { feature: 'Family / household plan', barakah: 'Family plan up to 6 members + shared budgets ($14.99/mo)', zoya: 'Individual accounts only', winner: 'Barakah' as const },
  { feature: 'Islamic will / wasiyyah', barakah: 'Wasiyyah builder + faraid calculator', zoya: 'None', winner: 'Barakah' as const },
  { feature: 'Riba detection', barakah: 'Transaction-level riba flagging + purification journey', zoya: 'None', winner: 'Barakah' as const },
  { feature: 'Sadaqah / waqf tracking', barakah: 'Full tracker', zoya: 'None', winner: 'Barakah' as const },
  { feature: 'Prayer times / Ramadan mode', barakah: 'Integrated', zoya: 'None', winner: 'Barakah' as const },
  { feature: 'Portfolio sync with multiple brokerages', barakah: 'Via Plaid (read-only)', zoya: 'Direct brokerage integrations', winner: 'Zoya' as const, note: 'Zoya connects natively to many brokers.' },
  { feature: 'Ticker-level "is X halal" pages', barakah: 'Not live yet; planned', zoya: 'Thousands of pre-indexed ticker pages', winner: 'Zoya' as const },
  { feature: 'Audit transparency', barakah: 'SHA-256 integrity hash per zakat snapshot, /methodology/changelog, public review-brief trail', zoya: 'Methodology transparency on investing, but no per-calculation hash', winner: 'Barakah' as const },
  { feature: 'Public scholarly oversight', barakah: 'Published review briefs + methodology changelog; Scholar Board still forming', zoya: 'Named Shariah advisor panel on investing methodology', winner: 'Zoya' as const, note: 'Barakah is publishing the trust trail early, but named reviewers are still being added.' },
  { feature: 'Pricing (entry)', barakah: 'Free tier + Plus from $9.99/mo', zoya: 'Free tier + paid Pro plan', winner: 'Tie' as const, note: 'Verify current store pricing before choosing.' },
  { feature: 'Family-tier pricing', barakah: '$14.99/mo (6 seats)', zoya: 'N/A', winner: 'Barakah' as const },
  { feature: 'Mobile platforms', barakah: 'iOS + Android', zoya: 'iOS + Android', winner: 'Tie' as const, note: 'Both ship mobile apps; feature depth is the differentiator.' },
];

const tally = { Barakah: 0, Zoya: 0, Tie: 0 } as const;
for (const r of rows) {
  (tally as Record<string, number>)[r.winner]++;
}

export default function BarakahVsZoyaPage() {
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Barakah vs Zoya</span>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
            Barakah vs Zoya (2026)
          </h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Competitor features and pricing change frequently. Treat this page as a product-surface
            comparison, then verify the latest details on each provider&apos;s own site before making
            a financial decision.
          </p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Zoya is a leading halal stock screener. Barakah is a Muslim household
            financial operating system. These products aren&apos;t really competitors — they solve
            different jobs and most serious Muslim investors will end up using both. This page is
            an honest matrix. Where Zoya is genuinely better, we say so.
          </p>

          {/* Positioning summary */}
          <section className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#1B5E20] bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-2 text-2xl font-bold">Barakah</h2>
              <p className="mb-3 text-sm text-green-100">Muslim household financial operating system</p>
              <ul className="space-y-1 text-sm text-green-50">
                <li>• Budget + zakat + hawl + halal + wasiyyah + family in one app</li>
                <li>• Integrity-hashed zakat snapshots (audit-grade)</li>
                <li>• Plaid aggregation across all US banks</li>
                <li>• Family plan up to 6 members</li>
                <li>• Fiqh-aware — per-user madhab + 8 rule toggles</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-gray-300 bg-white p-6">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Zoya</h2>
              <p className="mb-3 text-sm text-gray-600">The halal stock screener</p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Specialist coverage across stocks, ETFs, and mutual funds</li>
                <li>• Large ticker-per-page SEO footprint</li>
                <li>• Direct brokerage sync with many brokers</li>
                <li>• Named public Shariah oversight on investing methodology</li>
                <li>• Strong AAOIFI-oriented methodology posture</li>
              </ul>
            </div>
          </section>

          {/* Matrix */}
          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature matrix</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Zoya</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.zoya}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Zoya' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
            <p className="mt-4 text-sm text-gray-700">
              <strong>Tally:</strong> Barakah wins {rows.filter((r) => r.winner === 'Barakah').length} rows;
              Zoya wins {rows.filter((r) => r.winner === 'Zoya').length} rows;
              {rows.filter((r) => r.winner === 'Tie').length} rows are a genuine tie.
            </p>
          </section>

          {/* Who picks what */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Which one should you use?</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Pick Zoya if…</h3>
                <ul className="space-y-1 text-sm leading-6 text-gray-700">
                  <li>• Your primary goal is screening individual stocks for halal compliance</li>
                  <li>• You actively trade / pick individual securities and need per-ticker detail</li>
                  <li>• You already use a specific broker Zoya integrates with directly</li>
                  <li>• You don&apos;t need budgeting, zakat-on-non-stocks, wasiyyah, or family sharing</li>
                </ul>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Pick Barakah if…</h3>
                <ul className="space-y-1 text-sm leading-6 text-gray-700">
                  <li>• You want <strong>one app for your household&apos;s entire money</strong>, not just investing</li>
                  <li>• You need zakat on cash, savings, 401k, rental property, crypto, business — not just stocks</li>
                  <li>• You want daily hawl continuity with a fiqh-aware reset</li>
                  <li>• You share money with a spouse / family (up to 6 seats on the Family plan)</li>
                  <li>• You want audit-first trust artifacts (integrity hash, methodology changelog, and published review briefs)</li>
                </ul>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
                <h3 className="mb-2 text-lg font-bold text-amber-900">Use both (the honest answer for most serious Muslim investors)</h3>
                <p className="text-sm leading-7 text-amber-900">
                  Zoya for the deep stock-screening workflow; Barakah for the rest of your household money.
                  Most Muslim investors with significant individual-stock positions will end up with both
                  apps. They solve adjacent problems. No one app covers the entire surface.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing side-by-side */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Pricing in 2026</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold text-[#1B5E20]">Barakah</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-800">
                  <li>Free — unlimited zakat/hawl/fiqh/prayer</li>
                  <li>Plus — $9.99/mo or $99/yr</li>
                  <li>Family — $14.99/mo or $119/yr (6 seats)</li>
                  <li>7-day free Plus trial</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700">Zoya</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-800">
                  <li>Free — limited screens/day</li>
                  <li>Zoya Pro — paid premium tier (verify current store pricing)</li>
                  <li>No family plan</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTAs */}
          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Try Barakah free for 7 days</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              No card required. Full Plus access for 7 days. If Barakah doesn&apos;t replace the 4
              apps you&apos;re currently running to manage your household money, keep the free tier
              and nothing changes.
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
