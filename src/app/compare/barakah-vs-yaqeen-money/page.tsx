import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Yaqeen Money (2026): Muslim Budget App Comparison | Barakah',
  description:
    "Yaqeen Money is a newer Muslim-focused budgeting app. Honest comparison: where it overlaps with Barakah, where Barakah goes further, and how to choose.",
  keywords: [
    'barakah vs yaqeen money',
    'yaqeen money review',
    'muslim budget app comparison',
    'islamic finance app',
    'halal budgeting app',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-yaqeen-money' },
  openGraph: {
    title: 'Barakah vs Yaqeen Money (2026) — Muslim Budget App Comparison | Barakah',
    description: 'Honest comparison of Yaqeen Money and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-yaqeen-money',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS — budget + zakat + halal + faraid', yaqeen: 'Muslim-focused budgeting app', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', yaqeen: 'Freemium; pricing varies', winner: 'Tie' as const, note: 'Both teams are iterating on pricing — check current rates.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', yaqeen: 'Plaid integration', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', yaqeen: 'Limited at the time of review', winner: 'Barakah' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', yaqeen: 'Category-based budgeting', winner: 'Tie' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', yaqeen: 'Single-user focus at the time of review', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', yaqeen: 'Zakat calculator (cash-focused)', winner: 'Barakah' as const, note: 'Yaqeen has zakat — but multi-asset coverage is narrower.' },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', yaqeen: 'Basic hawl reminders', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', yaqeen: 'Not the core focus', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', yaqeen: 'Basic flagging', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', yaqeen: 'Not currently included', winner: 'Barakah' as const },
  { feature: 'Sadaqah / giving tracker', barakah: 'Round-up sadaqah + Ramadan tracker', yaqeen: 'Sadaqah tracking is a headline feature', winner: 'Yaqeen Money' as const, note: 'Yaqeen has put real polish into the giving flow.' },
  { feature: 'Methodology transparency', barakah: 'Public methodology + scholar review', yaqeen: 'Documented Islamic principles', winner: 'Tie' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', yaqeen: 'iOS & Android, newer entrant', winner: 'Tie' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', yaqeen: 'Standard SaaS; no data sale per policy', winner: 'Tie' as const },
];

export default function BarakahVsYaqeenMoneyPage() {
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
          <span className="text-gray-900">Barakah vs Yaqeen Money</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Yaqeen Money (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Yaqeen Money is a newer team building a Muslim-focused budgeting app. We&apos;re both serving the same
            community, and that&apos;s a good thing — Muslim families deserve more than one option. The honest read is
            that Yaqeen and Barakah overlap on the core (budget + basic zakat + sadaqah), and Barakah goes further on
            multi-asset zakat, halal stock screening, faraid, and family plans.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Try Yaqeen Money</strong> if: you want a focused Muslim budgeting app and your finances are mostly cash + simple savings.</li>
              <li><strong>Choose Barakah</strong> if: you want investments, multi-asset zakat, halal stock screening, faraid, and family seats in one app.</li>
              <li><strong>Try both</strong>: they&apos;re close enough on price that giving each two weeks tells you which fits your household.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Yaqeen Money</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.yaqeen}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Yaqeen Money' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              We respect what the Yaqeen team is building. The market for Muslim financial software has been
              underserved for too long, and competition raises the bar for everyone. The most honest thing we can say
              is: if your needs are budget plus simple zakat, both apps will work. If you want investments,
              multi-asset zakat, halal stock screening, faraid, and family seats in one place — that&apos;s the area
              where Barakah is further along today.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Try the broader Muslim financial OS</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get budgeting plus multi-asset zakat, hawl tracking, halal screening,
              riba detection, faraid, and wasiyyah builder. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
