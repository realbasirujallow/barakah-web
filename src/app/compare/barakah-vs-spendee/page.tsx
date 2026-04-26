import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Spendee (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Spendee has a beautiful free tier and shared wallets. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer.",
  keywords: [
    'barakah vs spendee',
    'spendee for muslims',
    'halal alternative spendee',
    'muslim budget app',
    'spendee alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-spendee' },
  openGraph: {
    title: 'Barakah vs Spendee (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Spendee and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-spendee',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', spendee: 'Visual budgeting + shared wallets', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', spendee: 'Free tier + Plus $14.99/yr + Premium $22.99/yr', winner: 'Spendee' as const, note: 'Spendee\'s paid tiers are cheaper if you don\'t need Islamic features.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', spendee: 'Limited US bank sync; stronger in EU', winner: 'Barakah' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', spendee: 'No — wallets only', winner: 'Barakah' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', spendee: 'Wallet-based + category budgets', winner: 'Tie' as const },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', spendee: 'Shared wallets are a core feature', winner: 'Spendee' as const, note: 'Shared wallets are Spendee\'s headline feature and they nailed it.' },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', spendee: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', spendee: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', spendee: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', spendee: 'None', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', spendee: 'None', winner: 'Barakah' as const },
  { feature: 'Visualizations', barakah: 'Standard charts + zakat dashboards', spendee: 'Beautiful infographic-style charts', winner: 'Spendee' as const, note: 'Spendee\'s design is genuinely the prettiest in the category.' },
  { feature: 'Manual entry workflow', barakah: 'Supported but Plaid-first', spendee: 'Excellent — designed for cash-first users', winner: 'Spendee' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', spendee: 'Polished iOS & Android, mature', winner: 'Spendee' as const, note: 'Spendee has been refining its app since 2014.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', spendee: 'EU-based, GDPR-first', winner: 'Tie' as const },
];

export default function BarakahVsSpendeePage() {
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
          <span className="text-gray-900">Barakah vs Spendee</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Spendee (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Spendee is the prettiest budgeting app on the App Store and the shared-wallet feature is genuinely
            the best in the category for couples splitting cash. But it doesn&apos;t track investments, doesn&apos;t flag
            interest income, and has no concept of zakat. For a Muslim household that wants the Islamic compliance
            layer plus household budgeting in one place, Barakah covers the gap.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Spendee</strong> if: you want the prettiest visuals + best shared-wallet UX and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app for budget + zakat + hawl + halal + riba + will, with US bank coverage.</li>
              <li><strong>Use both</strong> if: Spendee for shared cash wallets with your spouse; Barakah for the Islamic compliance and investment side.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Spendee</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.spendee}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Spendee' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Spendee is a beautiful, focused tool. If your finances are simple, your spouse splits cash, and you love
              great design, Spendee will make you happy. The catch is: as soon as you have investments, retirement
              accounts, gold holdings, or you want zakat done correctly, Spendee runs out of room. Barakah is built
              for the Muslim household that wants the budgeting plus the obligations handled in one place.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Spendee doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
