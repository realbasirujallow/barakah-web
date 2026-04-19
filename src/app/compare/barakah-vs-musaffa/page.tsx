import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah vs Musaffa (2026): Household Money vs Halal Stock Screener | Barakah',
  description:
    "Musaffa screens stocks; Barakah manages your whole Muslim household's money. Honest comparison of both products, pricing, and when to use which.",
  keywords: [
    'barakah vs musaffa',
    'musaffa alternative',
    'best halal stock screener',
    'halal finance app comparison',
    'musaffa vs barakah',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/compare/barakah-vs-musaffa',
  },
  openGraph: {
    title: 'Barakah vs Musaffa (2026): Household Money vs Halal Stock Screener | Barakah',
    description: 'Honest comparison of Musaffa vs Barakah for Muslim households in 2026.',
    url: 'https://trybarakah.com/compare/barakah-vs-musaffa',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', musaffa: 'Halal stock screener + (rolling out) brokerage', winner: 'Different jobs' as const },
  { feature: 'Stock screening coverage', barakah: '30k+ screened (Plus feature)', musaffa: 'Broad specialist screening coverage', winner: 'Musaffa' as const, note: 'Musaffa is built first for security-by-security screening.' },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', musaffa: 'Multiple investing-focused subscription tiers', winner: 'Barakah' as const, note: 'Barakah\'s pricing is simpler to understand; verify Musaffa&apos;s latest pricing before choosing.' },
  { feature: 'Budget / transactions / bills', barakah: 'Full Plaid aggregation + budgets', musaffa: 'None', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', musaffa: 'Purification calculator on held stocks', winner: 'Barakah' as const },
  { feature: 'Hawl continuity', barakah: 'Daily nisab-check, fiqh-aware', musaffa: 'None', winner: 'Barakah' as const },
  { feature: 'Family / household plan', barakah: 'Family plan — 6 members', musaffa: 'Individual only', winner: 'Barakah' as const },
  { feature: 'Islamic will / wasiyyah', barakah: 'Full builder + faraid calculator', musaffa: 'None', winner: 'Barakah' as const },
  { feature: 'Brokerage execution', barakah: 'None (read-only tracking)', musaffa: 'Rolling out (as of 2025)', winner: 'Musaffa' as const },
  { feature: 'Methodology + trust trail', barakah: 'Methodology changelog + published review briefs; Scholar Board still forming', musaffa: 'AAOIFI-oriented screening methodology', winner: 'Tie' as const, note: 'Barakah is stronger on public product-change transparency; Musaffa is more established as a screening specialist.' },
  { feature: 'Audit trail per calculation', barakah: 'SHA-256 integrity hash + fiqh-config per snapshot', musaffa: 'Purification tracking', winner: 'Barakah' as const },
  { feature: 'Riba detection on everyday transactions', barakah: 'Transaction-level flagging + purification journey', musaffa: 'None', winner: 'Barakah' as const },
];

export default function BarakahVsMusaffaPage() {
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
            <span className="text-gray-900">Barakah vs Musaffa</span>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Musaffa (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Competitor features and pricing evolve quickly. Use this page as a product-surface
            comparison, then verify the latest details on Musaffa&apos;s own site before acting.
          </p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Musaffa is a halal stock screener expanding into brokerage; it&apos;s a direct Zoya competitor.
            Barakah is a Muslim household financial operating system. These are adjacent products with
            limited overlap — Musaffa is best for active stock-pickers who want deep per-ticker coverage;
            Barakah is best for households who want one app for budget + zakat + halal + family + wills.
          </p>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Musaffa</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.musaffa}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Musaffa' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
            <h2 className="mb-3 text-xl font-bold text-amber-900">Honest recommendation</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm leading-7 text-amber-900">
              <li><strong>Pick Musaffa</strong> if you actively pick individual stocks and want deep per-ticker compliance data + (once live) halal brokerage execution.</li>
              <li><strong>Pick Barakah</strong> if you want one app for your household&apos;s entire money flow — zakat on every asset class, not just stocks; hawl continuity; family sharing; wasiyyah.</li>
              <li><strong>Use both</strong> if you&apos;re a serious Muslim investor. Musaffa for stock picking; Barakah for household orchestration + zakat on the total picture.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Try Barakah free for 7 days</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              If Musaffa&apos;s 5-tier pricing confuses you, Barakah&apos;s $9.99/mo Plus and $14.99/mo Family
              are easy to understand. If Barakah doesn&apos;t handle everything you need, keep the free tier
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
