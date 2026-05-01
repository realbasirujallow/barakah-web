import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Zeta (2026): Halal Alternative for Muslim Couples & Families | Barakah',
  description:
    "Zeta is the gold standard for couples-and-family budgeting with joint banking. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer for Muslim households.",
  keywords: [
    'barakah vs zeta',
    'zeta for muslims',
    'halal couples budget',
    'muslim family budget app',
    'zeta alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-zeta' },
  openGraph: {
    title: 'Barakah vs Zeta (2026) — Halal Alternative for Muslim Couples & Families | Barakah',
    description: 'Honest comparison of Zeta and Barakah for Muslim couples and families.',
    url: 'https://trybarakah.com/compare/barakah-vs-zeta',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', zeta: 'Couples + family budgeting with joint banking + joint debit card', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', zeta: 'Freemium — joint account is free; Zeta+ premium tier ~$9.99/mo', winner: 'Tie' as const },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', zeta: 'Plaid — broad US coverage; plus its own joint account', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', zeta: 'Light — net worth tracking only', winner: 'Barakah' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', zeta: 'Category budgets with shared/private split per category — uniquely couples-aware', winner: 'Zeta' as const, note: 'Zeta\'s shared-vs-private toggle per category is genuinely best-in-class for couples.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', zeta: 'Built ground-up for couples + families with deep collaboration', winner: 'Zeta' as const, note: 'Zeta is the gold standard for couples budgeting — no one beats them on this.' },
  { feature: 'Joint banking', barakah: 'None — Barakah aggregates, doesn\'t bank', zeta: 'Yes — joint debit card, no fees, no minimums (FDIC via partner bank)', winner: 'Zeta' as const, note: 'Zeta is one of very few apps that actually bundles a joint bank account.' },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', zeta: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', zeta: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', zeta: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', zeta: 'None — Zeta\'s own joint account may pay interest (treated as income)', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', zeta: 'None', winner: 'Barakah' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', zeta: 'Polished iOS & Android, designed for two-user workflows', winner: 'Zeta' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', zeta: 'No data sold; banking partner subject to standard banking disclosures', winner: 'Barakah' as const, note: 'Banking partnerships add disclosure surface that aggregator-only apps avoid.' },
];

export default function BarakahVsZetaPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Zeta</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Zeta (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Zeta is built ground-up for couples and families. The shared-vs-private toggle on every category, the
            two-user mobile flows, and the bundled joint debit card are genuinely best-in-class. For non-Muslim couples
            it&apos;s the cleanest household-finance product available. But Zeta has no zakat, no hawl, no halal stock
            screening, no riba detection, and the joint account itself may pay interest. For Muslim couples who want
            both the collaboration polish AND the Islamic compliance layer, Zeta covers half the job.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Zeta</strong> if: you specifically want the joint debit card and the shared/private category split, and you handle zakat separately.</li>
              <li><strong>Switch to Barakah Family</strong> if: you want one app that covers household budget + zakat + hawl + halal + riba + will for 6 seats.</li>
              <li><strong>Use both</strong> if: you love Zeta&apos;s couples UX. Zeta for shared spending; Barakah for the Islamic compliance layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Zeta</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.zeta}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Zeta' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Zeta&apos;s couples UX and joint debit card are real differentiators — no other budget app bundles banking
              this cleanly, and the shared-vs-private category model maps perfectly to how most households actually
              think about money. But the joint account may pay interest, and there&apos;s no zakat, no halal screening,
              no faraid. If you&apos;re a Muslim couple subscribed to Zeta, you&apos;re getting the collaboration layer
              and missing the Islamic one. The cleanest answer: Barakah Family ($14.99/mo) gives you 6 seats and the
              Islamic compliance layer; if you specifically need the joint debit card, keep Zeta and bolt Barakah Plus
              ($9.99/mo) on top.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your household</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Zeta doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
