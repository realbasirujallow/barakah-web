import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs PocketGuard (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "PocketGuard's 'In My Pocket' calculation is one of the slickest spending guards in any budgeting app. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer.",
  keywords: [
    'barakah vs pocketguard',
    'pocketguard for muslims',
    'halal alternative pocketguard',
    'muslim budget app',
    'pocketguard alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-pocketguard' },
  openGraph: {
    title: 'Barakah vs PocketGuard (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of PocketGuard and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-pocketguard',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', pocketguard: 'Mobile-first budget guard — "In My Pocket" calculator', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', pocketguard: '~$12.99/mo or $74.99/yr (PocketGuard Plus); free tier exists but is heavily limited', winner: 'Barakah' as const },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', pocketguard: 'Plaid + Finicity — broad US coverage', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', pocketguard: 'Limited — net worth only, no security-level detail', winner: 'Barakah' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', pocketguard: 'Income minus bills minus goals = "In My Pocket" — uniquely opinionated', winner: 'PocketGuard' as const, note: 'IMP is the most intuitive single-number spending guard in any app.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', pocketguard: 'Single-user oriented; no real household sharing', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', pocketguard: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', pocketguard: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', pocketguard: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', pocketguard: 'None (treats interest as income)', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', pocketguard: 'None', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', pocketguard: 'Basic net-worth tracking', winner: 'Barakah' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', pocketguard: 'Mobile-first design, polished iOS & Android', winner: 'PocketGuard' as const, note: 'PocketGuard\'s mobile UX is its main reason for being.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', pocketguard: 'No data sold (per privacy policy)', winner: 'Tie' as const },
];

export default function BarakahVsPocketGuardPage() {
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
          <span className="text-gray-900">Barakah vs PocketGuard</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs PocketGuard (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            PocketGuard&apos;s claim to fame is the &ldquo;In My Pocket&rdquo; number — income minus bills minus goals,
            shown as one figure on the home screen. It is genuinely the most intuitive single-number spending guard in
            any consumer budgeting app. But it has no concept of zakat, hawl, halal stock screening, or riba — and
            interest income is treated as ordinary revenue. For Muslim households, PocketGuard solves the &ldquo;am I
            overspending today?&rdquo; problem and leaves the entire Islamic compliance layer untouched.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep PocketGuard</strong> if: the IMP calculation is your main behavior change and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app for budget + zakat + hawl + halal + riba + will, and you don&apos;t need IMP&apos;s specific UX.</li>
              <li><strong>Use both</strong> if: you love the IMP guardrail. PocketGuard for spending discipline; Barakah for the Islamic layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">PocketGuard</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.pocketguard}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'PocketGuard' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              PocketGuard&apos;s &ldquo;In My Pocket&rdquo; is a real behavioral innovation — it&apos;s the cleanest
              spending-guard UX in any budgeting app, and the mobile-first build is well-executed. At ~$12.99/mo it&apos;s
              also more expensive than Barakah Plus. If you&apos;re a Muslim household and you subscribe to PocketGuard,
              you&apos;re paying for one really good number on a home screen, while doing your zakat on spreadsheets.
              Either switch to Barakah outright, or bolt Barakah Plus ($9.99/mo) onto PocketGuard for the Islamic
              features you can&apos;t get anywhere else.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything PocketGuard doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
