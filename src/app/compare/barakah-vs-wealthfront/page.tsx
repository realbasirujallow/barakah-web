import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Wealthfront (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Wealthfront is a leading robo-advisor with a high-yield cash account — but the cash APY is interest-bearing (riba) and there's no zakat, hawl, or halal screening. Barakah is the Islamic-finance complement.",
  keywords: [
    'barakah vs wealthfront',
    'wealthfront for muslims',
    'halal alternative wealthfront',
    'muslim wealthfront alternative',
    'wealthfront alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-wealthfront' },
  openGraph: {
    title: 'Barakah vs Wealthfront (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Wealthfront and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-wealthfront',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', wealthfront: 'Robo-advisor + high-yield cash account + auto-investing', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', wealthfront: '0.25% AUM/year on managed portfolios; cash account free', winner: 'Tie' as const, note: 'Different models — Wealthfront monetizes invested assets, not subscriptions.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', wealthfront: 'Plaid — for funding only, not a budgeting aggregator', winner: 'Barakah' as const, note: 'Wealthfront aggregates accounts inside its planner, but isn\'t a Mint-style tracker.' },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', wealthfront: 'Yes — and actively manages portfolios with auto-rebalancing + tax-loss harvesting', winner: 'Wealthfront' as const, note: 'Wealthfront actually invests for you; Barakah only tracks.' },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', wealthfront: 'No real budgeting; goal-based projections only', winner: 'Barakah' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', wealthfront: 'Single-account; joint accounts only via shared login', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', wealthfront: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', wealthfront: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', wealthfront: 'None — uses standard ESG / index portfolios, not Shariah', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', wealthfront: 'None — and the cash account itself pays interest (riba)', winner: 'Barakah' as const, note: 'See honest-recommendation box below — the cash APY is riba.' },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', wealthfront: 'None', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', wealthfront: 'Yes — projection-focused, less historical detail', winner: 'Barakah' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', wealthfront: 'Excellent on iOS + Android; very polished', winner: 'Wealthfront' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', wealthfront: 'Brokerage privacy standard; no data sold', winner: 'Tie' as const },
];

export default function BarakahVsWealthfrontPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Wealthfront</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Wealthfront (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Wealthfront is one of the strongest robo-advisors in the US — 0.25% AUM, automatic rebalancing, daily tax-loss
            harvesting, and a high-yield cash account that&apos;s frequently the highest APY in the consumer market. It is not,
            however, built for Muslim users: the cash APY is interest income (riba), the index portfolios aren&apos;t
            Shariah-screened, and there is no zakat, hawl, or wasiyyah feature. Barakah is the Islamic-finance complement.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Wealthfront</strong> if: you want hands-off investing with auto-rebalancing and tax-loss harvesting — and you understand the cash account pays interest.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that covers budget + zakat + hawl + halal + riba + will, and you handle investing through a halal brokerage like Wahed or Zoya-screened picks.</li>
              <li><strong>Use both with caution</strong> if: you keep some assets at Wealthfront. Use Barakah&apos;s halal-screen on your portfolio holdings, flag the cash interest as riba for purification, and consider routing emergency cash through a non-interest alternative.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Wealthfront</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.wealthfront}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Wealthfront' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Wealthfront&apos;s product is genuinely well-engineered — but for an observant Muslim, the headline cash account is
              the problem, not the feature. The 4–5% APY (or whatever the current rate is) is interest, which is riba, and
              even the holding-period yield is not generally considered halal under most contemporary fatwas. Please
              consult a qualified scholar before parking emergency funds there. As a practical setup: if you need a
              high-yield, Shariah-conscious cash store, look at non-interest alternatives (a checking account paired with
              short-duration Sukuk, for example) and use Barakah to track your full picture, screen any Wealthfront
              holdings for halal compliance, and calculate zakat on the actual asset value. If you do hold cash there,
              Barakah&apos;s riba-detection will flag the interest for purification.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Wealthfront doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
