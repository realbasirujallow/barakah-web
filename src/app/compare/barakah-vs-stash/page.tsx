import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Stash (2026): Halal Alternative for Muslim Investors | Barakah',
  description:
    "Stash bundles fractional investing with banking. But interest-bearing cash and non-screened ETFs are riba issues for Muslim users. Barakah is the Islamic compliance layer.",
  keywords: [
    'barakah vs stash',
    'stash for muslims',
    'is stash halal',
    'halal alternative stash',
    'muslim micro investing',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-stash' },
  openGraph: {
    title: 'Barakah vs Stash (2026) — Halal Alternative for Muslim Investors | Barakah',
    description: 'Honest comparison of Stash and Barakah for Muslim investors.',
    url: 'https://trybarakah.com/compare/barakah-vs-stash',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', stash: 'Fractional investing + banking bundle', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', stash: '$3 / $9 per month', winner: 'Tie' as const },
  { feature: 'Trade execution', barakah: 'Read-only via Plaid (no trading)', stash: 'Yes — fractional shares + ETFs', winner: 'Stash' as const, note: 'Stash is a brokerage; Barakah is not.' },
  { feature: 'Investment selection', barakah: 'Halal screening on user-held positions', stash: 'Themed ETFs + individual stocks', winner: 'Stash' as const, note: 'Stash\'s themed ETFs include conventional and non-halal sectors.' },
  { feature: 'Cash / banking interest', barakah: 'Tracks but flags interest as non-halal', stash: 'Stash banking with stock-back rewards', winner: 'Barakah' as const, note: 'Stash\'s cash account features carry interest exposure — riba for Muslim users.' },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', stash: 'None — no halal filter', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', stash: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', stash: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', stash: 'None', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', stash: 'None', winner: 'Barakah' as const },
  { feature: 'IRA / retirement', barakah: 'Tracks 401k via Plaid', stash: 'Stash Retire — Roth & Traditional IRA', winner: 'Stash' as const, note: 'Same screening problem applies to the holdings.' },
  { feature: 'Kids accounts', barakah: 'Family plan — 6 seats, shared budgets + zakat', stash: 'Custodial accounts for minors', winner: 'Tie' as const },
  { feature: 'Stock-back card', barakah: 'None', stash: 'Debit card that rewards in fractional shares', winner: 'Stash' as const, note: 'A clever, well-built feature — but the rewards come in non-screened equities.' },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', stash: 'Polished iOS & Android, mature', winner: 'Stash' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', stash: 'Standard SaaS; no data sale per policy', winner: 'Tie' as const },
];

export default function BarakahVsStashPage() {
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
          <span className="text-gray-900">Barakah vs Stash</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Stash (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Stash bundled investing, banking, and a stock-back debit card into a single app — and they did it well.
            But the same Islamic concerns apply: the cash account features pay interest (riba), and none of the themed
            ETFs are halal-screened. The stock-back card is a clever idea, but a Muslim user has to manually screen
            every share they get rewarded with.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Skip Stash</strong> if: you want a default Sharia-compliant flow — the themed ETFs and cash interest fail the screen.</li>
              <li><strong>Use Barakah instead</strong> if: you want halal screening, riba flagging, and zakat across what you already own.</li>
              <li><strong>If you stay on Stash</strong>: hand-pick halal individual stocks only, opt out of cash interest features, and use Barakah for screening + zakat.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Stash</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.stash}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Stash' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Stash is a thoughtful product with a clear point of view — and for a beginner non-Muslim investor, it&apos;s
              a reasonable place to start. The Islamic problem is that the bundle (themed ETFs, cash interest,
              stock-back rewards) pulls a Muslim user toward the haram parts by default. Barakah doesn&apos;t replace
              your brokerage; it tells you whether your brokerage is doing right by your deen.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get halal screening, riba detection, and zakat across stocks, ETFs, cash,
              and crypto — everything Stash doesn&apos;t do for Muslim families. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
