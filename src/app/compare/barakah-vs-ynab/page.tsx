import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL,
  DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL,
} from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs YNAB (2026): Which Budgeting App for Muslim Households? | Barakah',
  description:
    "YNAB is the gold standard for envelope budgeting but has no Islamic features. Barakah adds zakat, hawl, halal screening, riba detection, and faraid — all on top of modern budgeting.",
  keywords: [
    'barakah vs ynab',
    'ynab for muslims',
    'islamic budgeting app',
    'ynab alternative halal',
    'muslim budget app',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-ynab' },
  openGraph: {
    title: 'Barakah vs YNAB (2026) — Which Budgeting App for Muslim Households? | Barakah',
    description: 'Honest comparison of YNAB and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-ynab',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core philosophy', barakah: 'Muslim household financial OS', ynab: 'Zero-based envelope budgeting', winner: 'Different jobs' as const },
  { feature: 'Budget methodology', barakah: 'Flexible categorization + Plaid sync', ynab: '"Give every dollar a job" — the original', winner: 'YNAB' as const, note: 'YNAB is the methodology leader. 20+ years of refinement.' },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', ynab: '$14.99/mo or $109/yr', winner: 'Barakah' as const, note: 'Barakah free tier is meaningful; YNAB has no free tier after trial.' },
  { feature: 'Bank account aggregation', barakah: 'Plaid — 12,000+ US banks', ynab: 'Direct Import — similar coverage', winner: 'Tie' as const },
  { feature: 'Zakat (multi-asset, multi-madhab)', barakah: 'Full — across cash, gold, stocks, 401k, crypto, business', ynab: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl (lunar year) tracking', barakah: 'Daily nisab-check, madhab-aware reset rules', ynab: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification journey', ynab: 'None (interest treated as ordinary income)', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ tickers, AAOIFI ratios, real-time', ynab: 'None', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', ynab: 'None', winner: 'Barakah' as const },
  { feature: 'Family / household plan', barakah: 'Family plan — 6 seats, shared budgets, household zakat', ynab: 'Up to 6 users on same account', winner: 'Tie' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS; Android Q3 2026', ynab: '4.8 stars iOS, mature', winner: 'YNAB' as const, note: 'YNAB has 12+ years of mobile iteration.' },
  { feature: 'Learning curve', barakah: 'Gentle — budget categories are intuitive', ynab: 'Steep — "the four rules" require commitment', winner: 'Barakah' as const, note: 'YNAB\'s discipline is its power but also its friction.' },
  { feature: 'Debt payoff tracking', barakah: 'Debt list + riba-purification progress', ynab: 'Excellent — "Pay Off Debt" category', winner: 'YNAB' as const, note: 'YNAB\'s debt methodology is mature.' },
  { feature: 'Reporting / analytics', barakah: 'Net-worth, zakat snapshots, giving history', ynab: 'Spending, net-worth, forecasting', winner: 'Tie' as const },
  { feature: 'Offline / manual-entry support', barakah: 'Full — bulk import, CSV, manual transactions', ynab: 'Full', winner: 'Tie' as const },
];

export default function BarakahVsYnabPage() {
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
          <span className="text-gray-900">Barakah vs YNAB</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs YNAB (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            YNAB (&quot;You Need A Budget&quot;) is the most respected envelope-budgeting app, with a devoted following and
            a methodology that genuinely changes people&apos;s relationship with money. If you love its philosophy, keep
            using it. But YNAB has zero Islamic features — no zakat, no hawl, no halal screening, no riba detection, no
            faraid. Most Muslim YNAB users end up running spreadsheets on the side. <strong>Barakah replaces the
            spreadsheet.</strong>
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep YNAB</strong> if: the envelope methodology is working for you and you don&apos;t need zakat/halal features.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that handles both your budget <em>and</em> your Islamic obligations — zakat, hawl, halal screening, riba tracking, wasiyyah.</li>
              <li><strong>Use both</strong> if: you&apos;re deeply committed to YNAB&apos;s method. Keep YNAB for budgeting; use Barakah Plus ($9.99/mo) for everything Islamic. It&apos;s cheaper than hiring a tax accountant to do your zakat each year.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">YNAB</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.ynab}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'YNAB' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              YNAB&apos;s budgeting methodology is genuinely excellent and has changed many people&apos;s finances. If you love
              the rules — &quot;give every dollar a job,&quot; &quot;embrace your true expenses,&quot; &quot;roll with the punches,&quot; &quot;age
              your money&quot; — you shouldn&apos;t abandon them for Barakah. But if you&apos;re a Muslim YNAB user running a
              separate zakat spreadsheet every Ramadan, try Barakah&apos;s Plus tier ($9.99/mo) for the Islamic layer. {DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL}
              free trial, no card.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add Islamic finance to your budget setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah works alongside YNAB or on its own. Link your accounts via Plaid; get live zakat, hawl tracking,
              halal screening, and riba detection — the features YNAB doesn&apos;t offer. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
