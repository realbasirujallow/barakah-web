import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Robinhood (2026): Halal Alternative for Muslim Investors | Barakah',
  description:
    "Robinhood made commission-free trading mainstream. But its cash sweep pays interest (riba) and it has no halal screening. Barakah is the Islamic compliance layer.",
  keywords: [
    'barakah vs robinhood',
    'robinhood for muslims',
    'is robinhood halal',
    'halal alternative robinhood',
    'muslim investor app',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-robinhood' },
  openGraph: {
    title: 'Barakah vs Robinhood (2026) — Halal Alternative for Muslim Investors | Barakah',
    description: 'Honest comparison of Robinhood and Barakah for Muslim investors.',
    url: 'https://trybarakah.com/compare/barakah-vs-robinhood',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', robinhood: 'Commission-free brokerage', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', robinhood: 'Free trading; Gold $5/mo', winner: 'Tie' as const, note: 'Different products entirely.' },
  { feature: 'Trade execution', barakah: 'Read-only via Plaid (no trading)', robinhood: 'Yes — equities, ETFs, options, crypto', winner: 'Robinhood' as const, note: 'Robinhood is a brokerage; Barakah is not.' },
  { feature: 'Options trading', barakah: 'None (most options carry gharar concerns)', robinhood: 'Best-in-class retail options UX', winner: 'Robinhood' as const, note: 'Many scholars consider conventional options non-halal — by design Barakah doesn\'t offer them.' },
  { feature: 'Cash sweep / interest', barakah: 'Tracks but flags interest as non-halal', robinhood: 'Gold cash sweep pays interest = riba', winner: 'Barakah' as const, note: 'Robinhood Gold\'s 4%+ cash APY is interest income — riba for Muslim users.' },
  { feature: 'Margin lending', barakah: 'None (riba)', robinhood: 'Margin available on Gold', winner: 'Barakah' as const, note: 'Margin loans are interest-based — riba.' },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', robinhood: 'None — no halal filter', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', robinhood: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', robinhood: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', robinhood: 'None — interest shown as gain', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', robinhood: 'None', winner: 'Barakah' as const },
  { feature: 'Investment research', barakah: 'Halal screening + financial ratios', robinhood: 'Solid charting, news, analyst ratings', winner: 'Robinhood' as const },
  { feature: 'IRA / retirement', barakah: 'Tracks 401k via Plaid', robinhood: 'Robinhood IRA with 1-3% match', winner: 'Robinhood' as const, note: 'Robinhood\'s IRA match is a real product advantage — but check halal status of holdings.' },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', robinhood: 'Industry-defining mobile UX', winner: 'Robinhood' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', robinhood: 'PFOF model — order flow sold to market makers', winner: 'Barakah' as const, note: 'Robinhood\'s payment-for-order-flow has been controversial.' },
];

export default function BarakahVsRobinhoodPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Robinhood</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Robinhood (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Robinhood is a brokerage. Barakah is a household financial OS. They&apos;re not really competitors — but a lot
            of Muslim investors use Robinhood without realizing what&apos;s going on under the hood. The cash sweep on
            Gold pays interest (riba). Margin is interest-based (riba). Conventional options carry gharar concerns.
            And there&apos;s zero halal screening on the stocks themselves. Honest pitch: keep Robinhood for execution if
            you must, but use Barakah to know what you actually own.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Robinhood</strong> only if: you turn off the cash sweep, avoid margin/options, and screen every stock externally.</li>
              <li><strong>Use Barakah alongside</strong>: link your Robinhood account via Plaid; Barakah will screen holdings, flag interest, and calculate zakat.</li>
              <li><strong>Move to a halal broker</strong>: pair Barakah with a brokerage that doesn&apos;t auto-pay interest on cash.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Robinhood</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.robinhood}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Robinhood' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Robinhood&apos;s execution UX is genuinely best-in-class for retail. The product itself, however, sits on
              several practices that are not halal: interest-paying cash sweep, margin lending, and a default options
              experience. None of that is Robinhood&apos;s fault — they built a great conventional broker. But for
              Muslim users, you have to actively opt out of the haram pieces and screen everything yourself. That&apos;s
              where Barakah fits in: same accounts, with the Islamic compliance layer on top.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your Robinhood account via Plaid; Barakah screens your holdings, flags any interest income, and
              calculates zakat correctly across stocks, cash, and crypto. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
