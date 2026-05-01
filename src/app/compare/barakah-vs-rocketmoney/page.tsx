import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Rocket Money (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Rocket Money (formerly Truebill) is the best subscription canceller in the market. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer for Muslim households.",
  keywords: [
    'barakah vs rocket money',
    'rocket money for muslims',
    'truebill alternative islamic',
    'halal alternative rocket money',
    'muslim budget app',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-rocketmoney' },
  openGraph: {
    title: 'Barakah vs Rocket Money (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Rocket Money (formerly Truebill) and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-rocketmoney',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', rocket: 'Subscription canceller + budgeting + bill negotiation (formerly Truebill)', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', rocket: 'Free tier + Premium "pay what you want" $4–$12/mo; bill negotiation takes 30–60% of savings', winner: 'Tie' as const, note: 'Rocket\'s pay-what-you-want is gimmicky; Premium features really need $6+/mo.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', rocket: 'Plaid + Finicity — very broad US coverage', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', rocket: 'Basic net-worth + investment account aggregation', winner: 'Tie' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', rocket: 'Category-based, monthly limits, "Spending Insights"', winner: 'Tie' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', rocket: 'Single-user oriented; no real household collaboration', winner: 'Barakah' as const },
  { feature: 'Subscription cancellation', barakah: 'None — Barakah surfaces recurring charges but doesn\'t cancel for you', rocket: 'Flagship feature — cancels subscriptions on your behalf via concierge', winner: 'Rocket Money' as const, note: 'This is genuinely the best subscription canceller in any consumer app.' },
  { feature: 'Bill negotiation', barakah: 'None', rocket: 'Concierge negotiates cable/internet/cell bills; takes 30–60% of one year\'s savings', winner: 'Rocket Money' as const, note: 'Effective but the cut is steep — read the fine print.' },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', rocket: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', rocket: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', rocket: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', rocket: 'None — Rocket also markets a savings account that pays interest', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', rocket: 'None', winner: 'Barakah' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', rocket: 'Polished iOS & Android, mature; Rocket Companies brand backing', winner: 'Rocket Money' as const, note: 'Mobile UX is among the best in the category.' },
];

export default function BarakahVsRocketMoneyPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Rocket Money</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Rocket Money (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Rocket Money (formerly Truebill) won its category by being the best subscription canceller in the market —
            you forward a charge, their concierge cancels it for you. The bill-negotiation service genuinely works,
            though the 30–60% cut on savings is steep. For Muslim households, Rocket Money does one job extremely
            well and has zero coverage of zakat, hawl, halal screening, or riba — and they cross-sell a savings account
            that pays interest. The honest answer is that subscription cancellation and Islamic compliance are
            different jobs, and you may want both.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Rocket Money</strong> if: subscription cancellation is your main use case and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app for budget + zakat + hawl + halal + riba + will, and you can cancel subscriptions yourself.</li>
              <li><strong>Use both</strong> if: you have a lot of recurring subscriptions to manage. Rocket Money for cancellation; Barakah for the Islamic layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Rocket Money</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.rocket}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Rocket Money' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Rocket Money&apos;s subscription-cancellation concierge is the genuine reason to use it — no other app
              does this as well, and if you have 8 forgotten streaming services, it pays for itself in a month. But it
              has no Islamic features and actively cross-sells an interest-bearing savings account. If you&apos;re a
              Muslim household subscribed to Rocket Money, you&apos;re paying for cancellation help and doing your zakat
              on spreadsheets. Either switch to Barakah outright (and cancel subscriptions yourself), or bolt Barakah
              Plus ($9.99/mo) onto Rocket Money for the Islamic features you can&apos;t get anywhere else.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Rocket Money doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
