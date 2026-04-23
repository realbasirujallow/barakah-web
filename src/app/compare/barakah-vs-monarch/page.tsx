import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Monarch Money (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Monarch is the most popular Mint successor. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer to modern budgeting.",
  keywords: [
    'barakah vs monarch',
    'monarch money for muslims',
    'halal alternative monarch',
    'muslim budget app',
    'monarch alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-monarch' },
  openGraph: {
    title: 'Barakah vs Monarch Money (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Monarch Money and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-monarch',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', monarch: 'Modern Mint successor — personal finance', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', monarch: '$14.99/mo or $99.99/yr (no free tier)', winner: 'Barakah' as const },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', monarch: 'Plaid + MX Data — very broad', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', monarch: 'Yes — richer visualizations', winner: 'Monarch' as const, note: 'Monarch\'s investment-tracking UI is very polished.' },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', monarch: 'Flex budgeting (like Mint) + rollovers', winner: 'Tie' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', monarch: 'Collaboration built-in (partners/households)', winner: 'Monarch' as const, note: 'Monarch\'s collaboration UI is the gold standard.' },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', monarch: 'None (shows interest as income)', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Credit score / monitoring', barakah: 'None', monarch: 'Built-in (Experian)', winner: 'Monarch' as const, note: 'Credit scores aren\'t Islamic-first — but they\'re useful data.' },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', monarch: 'Excellent, with longest history view', winner: 'Monarch' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', monarch: '4.7 stars iOS, mature', winner: 'Monarch' as const, note: 'Monarch\'s UI is award-winning; Barakah shipped iOS + Android in 2026.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', monarch: 'No data sold (per privacy policy)', winner: 'Tie' as const },
];

export default function BarakahVsMonarchPage() {
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
          <span className="text-gray-900">Barakah vs Monarch</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Monarch Money (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Monarch is the slickest personal-finance app since Mint&apos;s shutdown, and for non-Muslim households it&apos;s a
            near-perfect answer. But Monarch treats interest income as ordinary revenue, has no concept of zakat or hawl,
            and can&apos;t screen a stock for halal status. If those pieces matter — and for observant Muslim households,
            they do — Barakah is the complement or the replacement.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Monarch</strong> if: you want the best-in-class investment UI + credit-score tracking and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that covers budget + zakat + hawl + halal + riba + will, and you&apos;re fine with a younger UI.</li>
              <li><strong>Use both</strong> if: you love Monarch&apos;s polish. Monarch for budgeting and credit; Barakah for the Islamic compliance layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Monarch</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.monarch}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Monarch' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Monarch&apos;s collaboration, investment UI, and credit-score features are genuinely excellent — and at $14.99/mo
              it costs the same as Barakah Family. If you&apos;re a Muslim household and you subscribe to Monarch, you&apos;re paying
              for the budgeting layer but doing your zakat on spreadsheets. Either switch to Barakah outright, or bolt
              Barakah Plus ($9.99/mo) onto your Monarch subscription for the Islamic features you can&apos;t get anywhere else.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Monarch doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
