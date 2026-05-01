import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Personal Capital (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Personal Capital (now Empower) pioneered free wealth dashboards. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer to wealth tracking.",
  keywords: [
    'barakah vs personal capital',
    'personal capital for muslims',
    'halal alternative personal capital',
    'muslim personal capital alternative',
    'personal capital alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-personal-capital' },
  openGraph: {
    title: 'Barakah vs Personal Capital (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Personal Capital and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-personal-capital',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', personalCapital: 'Wealth dashboard + paid advisory (rebranded to Empower in 2023)', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', personalCapital: 'Dashboard free; advisory ~0.89% AUM on first $1M (requires $100k+)', winner: 'Tie' as const, note: 'Different models — Personal Capital monetizes via AUM advice.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', personalCapital: 'Yodlee + proprietary — very broad, brokerage-strong', winner: 'Personal Capital' as const, note: 'Personal Capital\'s brokerage and 401k aggregation is industry-leading.' },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', personalCapital: 'Best-in-class — fee analyzer, allocation x-ray, retirement planner', winner: 'Personal Capital' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', personalCapital: 'Cash-flow oriented, weak budgeting (built for wealth, not budgeting)', winner: 'Barakah' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', personalCapital: 'Single-user dashboard; couples must share login', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', personalCapital: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', personalCapital: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', personalCapital: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', personalCapital: 'None — interest income shown as positive cash-flow', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', personalCapital: 'None (estate-planning is via paid advisor only)', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', personalCapital: 'Excellent — multi-year history, the original strength', winner: 'Personal Capital' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', personalCapital: 'Mature iOS + Android, strong charts', winner: 'Personal Capital' as const, note: 'Personal Capital has had 10+ years to refine its app.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', personalCapital: 'Free dashboard funded by advisor sales-call leads (you will be called)', winner: 'Barakah' as const, note: 'Sign up for the free dashboard and expect outreach from advisors.' },
];

export default function BarakahVsPersonalCapitalPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Personal Capital</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Personal Capital (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Personal Capital (rebranded to Empower in 2023, but still searched under the old name) was the free wealth-tracking
            dashboard for a generation of US investors. Its brokerage aggregation, fee analyzer, and retirement planner are
            still excellent. But it was built for high-net-worth lead-gen — it has no zakat, no hawl, no halal screening,
            and treats interest income as ordinary cash flow. For an observant Muslim household, Barakah fills the gaps.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Personal Capital</strong> if: your priority is brokerage / 401k aggregation, fee analysis, and retirement projections — and you don&apos;t mind the advisor sales calls.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that covers budget + zakat + hawl + halal + riba + will, and you don&apos;t need the wealth-management bells.</li>
              <li><strong>Use both</strong> if: you have $100k+ in invested assets and want Personal Capital&apos;s investment analytics, plus Barakah for the Islamic layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Personal Capital</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.personalCapital}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Personal Capital' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Personal Capital&apos;s investment-analytics engine is genuinely best-in-class — if you have a complex brokerage +
              401k picture, the fee analyzer alone can save you thousands. But the dashboard is a lead funnel for paid
              advisory; expect calls. For Muslim households the deeper issue is fiqh: Personal Capital can&apos;t tell you a stock
              is non-compliant, can&apos;t flag riba, can&apos;t calculate zakat. The right combo for many readers is Personal Capital
              for investments + Barakah Plus ($9.99/mo) for the Islamic layer, OR just Barakah if your portfolio is simpler.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Personal Capital doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
