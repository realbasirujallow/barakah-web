import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Empower Personal Wealth (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Empower Personal Wealth (the rebrand of Personal Capital) is the leading free wealth dashboard. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer.",
  keywords: [
    'barakah vs empower',
    'empower for muslims',
    'halal alternative empower',
    'muslim empower alternative',
    'empower personal wealth alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-empower' },
  openGraph: {
    title: 'Barakah vs Empower Personal Wealth (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Empower Personal Wealth and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-empower',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', empower: 'Wealth dashboard + paid advisory (post-2023 rebrand of Personal Capital)', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', empower: 'Dashboard free; advisory ~0.89% AUM on first $1M ($100k minimum)', winner: 'Tie' as const, note: 'Different models — Empower monetizes via managed-account advice.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', empower: 'Yodlee + proprietary — strongest brokerage / 401k coverage', winner: 'Empower' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', empower: 'Best-in-class — fee analyzer, allocation x-ray, retirement planner', winner: 'Empower' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', empower: 'Cash-flow view; not a real budgeting tool', winner: 'Barakah' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', empower: 'Single login; spouses share credentials', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', empower: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', empower: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', empower: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', empower: 'None — interest income shown as positive cash-flow', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', empower: 'Estate-planning available only via paid advisor', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', empower: 'Excellent — multi-year, the headline feature', winner: 'Empower' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', empower: 'Mature iOS + Android, polished investment charts', winner: 'Empower' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', empower: 'Free dashboard funds advisory sales calls (expect outreach)', winner: 'Barakah' as const, note: 'Empower will call you to upsell wealth management.' },
];

export default function BarakahVsEmpowerPage() {
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
          <span className="text-gray-900">Barakah vs Empower</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Empower Personal Wealth (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Empower Personal Wealth is the rebranded Personal Capital — same dashboard, same fee analyzer, same advisory
            model. For high-net-worth investors with a complex brokerage and 401k picture, it remains the strongest free
            wealth-tracker on the market. It is not built, however, for Muslim households: there&apos;s no zakat engine, no
            hawl tracking, no halal screen, no riba flagging. Barakah is the Islamic-finance complement (or replacement).
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Empower</strong> if: you have a complex investment portfolio, want the fee analyzer, and accept the advisor sales-call funnel.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that covers budget + zakat + hawl + halal + riba + will, and your portfolio is straightforward.</li>
              <li><strong>Use both</strong> if: you have $100k+ invested and want Empower&apos;s investment analytics, plus Barakah for the Islamic layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Empower</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.empower}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Empower' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Empower&apos;s wealth-tracking is the gold standard for the under-served middle of the market — it&apos;ll show
              fees you didn&apos;t know you were paying and project retirement scenarios that spreadsheets can&apos;t. But it is not
              an Islamic-finance app: an observant Muslim using Empower alone is doing zakat by hand, can&apos;t see whether
              their index fund is Shariah-compliant, and is shown interest income as ordinary cash flow. The cleanest setup
              for most Muslim households: Empower for investment analytics if your portfolio warrants it, plus Barakah Plus
              ($9.99/mo) for zakat, hawl, halal screening, riba detection, and the wasiyyah builder.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Empower doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
