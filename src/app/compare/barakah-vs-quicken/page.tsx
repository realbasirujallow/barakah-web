import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Quicken Classic & Simplifi (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Quicken Classic and Simplifi are two of the most established personal-finance tools — but neither has zakat, hawl, halal screening, or riba detection. Barakah adds the Islamic layer Muslim households need.",
  keywords: [
    'barakah vs quicken',
    'quicken for muslims',
    'simplifi alternative islamic',
    'halal alternative quicken',
    'muslim budget app',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-quicken' },
  openGraph: {
    title: 'Barakah vs Quicken Classic & Simplifi (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Quicken Classic, Simplifi, and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-quicken',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', quicken: 'Quicken Classic — desktop+web personal-finance veteran. Simplifi — cloud-only modern budgeting.', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', quicken: 'Quicken Classic $5.99–$10.99/mo (annual). Simplifi $5.99/mo. No free tier on either.', winner: 'Tie' as const, note: 'Quicken/Simplifi are cheaper at the floor; Barakah has a real free tier.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', quicken: 'Quicken: direct connections + Express Web Connect. Simplifi: cloud aggregation. Both very broad.', winner: 'Quicken' as const, note: 'Quicken Classic\'s bank coverage is unmatched after 35+ years.' },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', quicken: 'Quicken Classic: deepest investment tracking on the market — cost basis, lots, tax-lot accounting. Simplifi: lighter.', winner: 'Quicken' as const, note: 'Quicken Classic\'s investment depth is genuinely unmatched.' },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', quicken: 'Quicken: traditional categories + envelopes. Simplifi: "Spending Plan" with planned-spending tracker.', winner: 'Tie' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', quicken: 'Quicken Classic: single-user oriented. Simplifi: limited household sharing.', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', quicken: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', quicken: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', quicken: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', quicken: 'None — interest income shown as ordinary revenue', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', quicken: 'None (Quicken WillMaker is a separate product, not Islamic)', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', quicken: 'Quicken Classic: decades-deep history possible. Simplifi: solid snapshots.', winner: 'Quicken' as const, note: 'Quicken Classic users routinely have 15+ year ledgers.' },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', quicken: 'Quicken Classic mobile is companion-only. Simplifi mobile is the strength.', winner: 'Tie' as const, note: 'Simplifi mobile is good; Quicken Classic mobile lags.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', quicken: 'No data sold; Quicken Classic stores locally (data file on your machine).', winner: 'Quicken' as const, note: 'Local data file is the most privacy-preserving option of any app here.' },
];

export default function BarakahVsQuickenPage() {
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
          <span className="text-gray-900">Barakah vs Quicken</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Quicken Classic &amp; Simplifi (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Quicken Classic is the 35-year-old desktop veteran with the deepest investment tracking on the market.
            Simplifi, its cloud-first sibling, is the polished modern app for everyday budgeting. Both are excellent at
            what they do — and neither has any concept of zakat, hawl, halal screening, riba detection, or faraid.
            For Muslim households, the question isn&apos;t which Quicken product is better; it&apos;s what you&apos;re
            doing about the Islamic compliance layer they don&apos;t cover.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Quicken Classic</strong> if: you have a 10-year ledger, complex investments, and want local-data privacy. Bolt Barakah Plus on top.</li>
              <li><strong>Keep Simplifi</strong> if: you love the clean spending-plan UI and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that covers budget + zakat + hawl + halal + riba + will, and you don&apos;t need decades of investment history.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Quicken / Simplifi</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.quicken}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Quicken' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Quicken Classic&apos;s investment depth (cost-basis, tax lots, decades of history) and Simplifi&apos;s
              clean Spending Plan are genuinely better at their specific jobs than Barakah is — and Quicken Classic at
              $5.99/mo annual is cheaper than Barakah Plus. But neither does zakat. If you&apos;re a Muslim household
              and you subscribe to Quicken or Simplifi, you&apos;re paying for the budgeting/investing layer but doing
              your zakat on spreadsheets. The cleanest answer: bolt Barakah Plus ($9.99/mo) onto Quicken or Simplifi for
              the Islamic layer. Or switch outright if a single app matters more than 10 years of investment history.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Quicken and Simplifi don&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
