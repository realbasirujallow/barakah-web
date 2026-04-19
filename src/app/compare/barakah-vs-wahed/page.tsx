import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah vs Wahed (2026): Household Money vs Halal Robo-Advisor | Barakah',
  description:
    "Barakah and Wahed Invest solve different problems. Wahed invests your money; Barakah manages your household's entire money. Honest comparison, pricing, and which one (or both) fits.",
  keywords: [
    'barakah vs wahed',
    'wahed alternative',
    'wahed invest review',
    'halal robo advisor comparison',
    'barakah vs wahed invest',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/compare/barakah-vs-wahed',
  },
  openGraph: {
    title: 'Barakah vs Wahed (2026): Household Money vs Halal Robo-Advisor | Barakah',
    description: "Barakah and Wahed Invest solve different problems. Honest comparison and recommendation.",
    url: 'https://trybarakah.com/compare/barakah-vs-wahed',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial operating system', wahed: 'Halal robo-advisor / managed portfolios', winner: 'Different jobs' as const },
  { feature: 'Brokerage execution (buy/sell)', barakah: 'None (read-only tracking)', wahed: 'Full — this is their core', winner: 'Wahed' as const },
  { feature: 'Budget / transactions / bills', barakah: 'Full Plaid aggregation, budgets, bills', wahed: 'None', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business, integrity-hashed', wahed: 'Only on Wahed-held assets', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware reset', wahed: 'None', winner: 'Barakah' as const },
  { feature: 'Family / household plan', barakah: '6 seats, shared budgets, household zakat', wahed: 'Individual accounts', winner: 'Barakah' as const },
  { feature: 'Islamic will / wasiyyah', barakah: 'Wasiyyah builder + faraid calculator', wahed: 'Adjacent product via Wahed Wills', winner: 'Tie' as const, note: 'Different approaches; Wahed has a dedicated wills product too.' },
  { feature: 'Regulatory posture', barakah: 'Not a regulated broker / advisor (personal-finance app)', wahed: 'SEC (US) + FCA (UK) + FSRA (ADGM) — multi-jurisdiction', winner: 'Wahed' as const, note: 'Wahed earned institutional trust through regulation.' },
  { feature: 'Managed portfolios / sukuk / gold exposure', barakah: 'No execution — partner-referral only', wahed: 'Full menu, diversified across global halal asset classes', winner: 'Wahed' as const },
  { feature: 'Halal stock screening', barakah: '30k+ stocks screened', wahed: 'Only what you invest in via Wahed', winner: 'Barakah' as const },
  { feature: 'Fee structure', barakah: 'Free + $9.99–$14.99/mo flat', wahed: 'Wrap fee 0.49% AUM (plus $60 fixed under $100k US)', winner: 'Depends on balance' as const, note: 'Flat monthly beats wrap-fee once your invested balance is modest; wrap fee makes sense for larger passive balances.' },
  { feature: 'Deposit / withdrawal UX', barakah: 'N/A (read-only)', wahed: '3.5-star iOS — reviewers cite withdrawal friction', winner: 'N/A' as const },
  { feature: 'Works with your existing brokerage', barakah: 'Yes (via Plaid read-only)', wahed: 'No — you custody with Wahed', winner: 'Barakah' as const, note: 'If you use Fidelity / Schwab / Vanguard, Barakah tracks there; Wahed requires moving funds to them.' },
  { feature: 'Global availability', barakah: 'US live; UK Q2 2027', wahed: '130+ countries live today', winner: 'Wahed' as const },
  { feature: 'Audit / integrity transparency', barakah: 'SHA-256 integrity hash per snapshot, methodology changelog, Scholar Board', wahed: 'Regulatory + Amanie Advisors scholar board + quarterly audits', winner: 'Tie' as const, note: 'Both strong; different flavors of institutional trust.' },
];

export default function BarakahVsWahedPage() {
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
            <span className="text-gray-900">Barakah vs Wahed</span>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Wahed Invest (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Wahed is a halal robo-advisor — you give them your money, they invest it across Shariah-compliant
            equities, sukuk, and gold. Barakah is a household financial operating system — you keep your money
            where it is, and Barakah manages your budget, zakat, hawl, halal screening, family, and wills. These
            are not competing products. Most Muslim investors with significant invested wealth will end up using
            <strong> both</strong>.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Wahed invests your money.</strong> If you want a hands-off halal portfolio (equities + sukuk + gold), Wahed does this at 0.49%/yr with SEC/FCA/FSRA regulation.</li>
              <li><strong>Barakah manages your money.</strong> Every account you hold anywhere (via Plaid), your budget, bills, debts, zakat, hawl, halal screening, family, and will — one app.</li>
              <li><strong>The overlap is tiny.</strong> Barakah doesn&apos;t execute trades. Wahed doesn&apos;t do household budgeting. One product recommends the other.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Wahed</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.wahed}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Wahed' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              If you have significant invested wealth and want it managed passively: use <strong>Wahed</strong>.
              If you want one app that tracks everything, calculates your zakat accurately across every asset class,
              manages your family&apos;s budget, flags riba, and drafts your wasiyyah: use <strong>Barakah</strong>.
              If you&apos;re a serious Muslim investor with a multi-account financial life: use <strong>both</strong>.
              Barakah&apos;s /dashboard/investments view aggregates your Wahed account alongside your brokerage,
              401(k), and cash — so you see the full household picture in one place.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Try Barakah alongside your Wahed account</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your Wahed balance via Plaid; keep investing with Wahed. Barakah handles the zakat,
              hawl, budget, and family sharing that Wahed doesn&apos;t offer. Free for 7 days, no card needed.
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
