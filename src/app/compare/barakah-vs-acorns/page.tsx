import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Acorns (2026): Halal Alternative for Muslim Investors | Barakah',
  description:
    "Acorns built round-up investing. But its checking account pays interest (riba) and there's no halal screening. Barakah is the Islamic compliance layer for Muslim families.",
  keywords: [
    'barakah vs acorns',
    'acorns for muslims',
    'is acorns halal',
    'halal alternative acorns',
    'muslim micro investing',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-acorns' },
  openGraph: {
    title: 'Barakah vs Acorns (2026) — Halal Alternative for Muslim Investors | Barakah',
    description: 'Honest comparison of Acorns and Barakah for Muslim families.',
    url: 'https://trybarakah.com/compare/barakah-vs-acorns',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', acorns: 'Round-up micro-investing + banking', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', acorns: '$3 / $6 / $12 per month', winner: 'Tie' as const, note: 'Comparable price; very different products.' },
  { feature: 'Round-ups', barakah: 'Round-up to sadaqah (giving) supported', acorns: 'Original round-up-to-invest workflow', winner: 'Acorns' as const, note: 'Acorns invented this UX; their execution is best-in-class.' },
  { feature: 'Investment portfolios', barakah: 'Halal screening on user-held positions', acorns: 'Pre-built ETF portfolios (none halal-screened)', winner: 'Acorns' as const, note: 'Acorns\' default ETFs include conventional bonds and non-halal sectors.' },
  { feature: 'Cash / checking interest', barakah: 'Tracks but flags interest as non-halal', acorns: 'Acorns Checking pays interest = riba', winner: 'Barakah' as const, note: 'Acorns Mighty Oak / checking interest is riba for Muslim users.' },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', acorns: 'None — no halal filter on portfolios', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', acorns: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', acorns: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', acorns: 'None — interest shown as APY win', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', acorns: 'None', winner: 'Barakah' as const },
  { feature: 'IRA / retirement', barakah: 'Tracks 401k via Plaid', acorns: 'Acorns Later — automated IRA', winner: 'Acorns' as const, note: 'But the IRA holds the same non-halal-screened ETFs.' },
  { feature: 'Family / kids accounts', barakah: 'Family plan — 6 seats, shared budgets + zakat', acorns: 'Acorns Early — UTMA for kids', winner: 'Tie' as const, note: 'Different angles on family money.' },
  { feature: 'Bonus / cashback ecosystem', barakah: 'None', acorns: 'Acorns Earn — partner cashback into investments', winner: 'Acorns' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', acorns: 'Polished iOS & Android, mature', winner: 'Acorns' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', acorns: 'Standard SaaS; no data sale per policy', winner: 'Tie' as const },
];

export default function BarakahVsAcornsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Acorns</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Acorns (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Acorns is a beautifully designed onramp to investing for people who&apos;ve never owned a share of stock. The
            problem for Muslim users is two-layer: the default ETFs aren&apos;t halal-screened, and the Acorns Checking
            and Mighty Oak products pay interest (riba). The round-up idea is excellent — but in its current form, the
            money flows into things that don&apos;t pass an Islamic filter.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Skip Acorns</strong> if: you want a Sharia-compliant investing flow — the default portfolios fail the screen.</li>
              <li><strong>Use Barakah instead</strong> if: you want round-up-to-sadaqah, halal screening, and zakat across your existing accounts.</li>
              <li><strong>If you stay on Acorns</strong>: opt out of Checking interest, hand-pick halal ETFs only, and use Barakah for zakat + screening.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Acorns</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.acorns}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Acorns' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Acorns built a beautiful product — for non-Muslim retail. The round-up flow, the kids&apos; UTMA, the cashback
              ecosystem are all genuinely good ideas. But every default flow runs through interest-bearing cash and
              non-screened ETFs. For a Muslim family that wants to invest with confidence, Barakah is the layer that
              answers the question Acorns won&apos;t: is what I&apos;m holding actually halal?
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get halal screening, riba detection, and zakat across stocks, ETFs, cash,
              and crypto — everything Acorns doesn&apos;t do for Muslim families. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
