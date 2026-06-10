import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'YNAB Alternative for Muslims — Halal Budgeting App (2026)',
  description:
    "Looking for a YNAB alternative as a Muslim? Barakah keeps YNAB's envelope-budgeting discipline and adds the Islamic layer: zakat across all assets, hawl tracking, halal stock screening, riba detection, and an Islamic will planner — for households YNAB never accounted for.",
  keywords: [
    'ynab alternative for muslims',
    'ynab for muslims',
    'halal alternative to ynab',
    'islamic finance ynab',
    'muslim budgeting app',
    'envelope budgeting halal',
    'ynab vs barakah',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/ynab-alternative-for-muslims' },
  openGraph: {
    title: 'YNAB Alternative for Muslims — Halal Budgeting App (2026)',
    description: "Keep YNAB's envelope-budgeting discipline. Add zakat, hawl, halal screening, riba detection, and Islamic estate planning.",
    url: 'https://trybarakah.com/learn/ynab-alternative-for-muslims',
    type: 'article',
  },
};

const comparisonRows = [
  { area: 'Core philosophy', ynab: 'Give every dollar a job — envelope-budgeting, future-focused.', barakah: 'Run a fiqh-aware household — budget like YNAB, also handle zakat, hawl, halal screening, will.', winner: 'Different jobs' },
  { area: 'Pricing', ynab: '$14.99/mo or $109/yr', barakah: 'Free; Plus $9.99/mo; Family $14.99/mo for up to 6 members', winner: 'Barakah on price' },
  { area: 'Envelope budgeting', ynab: "Classic — what YNAB invented", barakah: 'Category-based with optional rollover; not envelope-strict by default but supports the same workflow', winner: 'YNAB on strictness' },
  { area: 'Bank sync', ynab: 'Plaid-powered, US/CA/UK coverage', barakah: 'Plaid-powered, 12,000+ US banks (CA/UK on roadmap)', winner: 'YNAB on country coverage' },
  { area: 'Zakat calculator (multi-asset)', ynab: 'None', barakah: 'Cash, gold, silver, stocks, 401k/IRA, rental, crypto, business inventory — multi-madhab', winner: 'Barakah' },
  { area: 'Hawl tracking', ynab: 'None', barakah: 'Daily nisab check, fiqh-aware reset rules, anniversary reminders', winner: 'Barakah' },
  { area: 'Halal stock screening', ynab: 'None', barakah: '30,000+ ticker library + on-demand AAOIFI Standard 21 screen', winner: 'Barakah' },
  { area: 'Riba / interest detection', ynab: "None — interest income shows as regular income, no purification prompt", barakah: 'Transaction-level flagging with purification math', winner: 'Barakah' },
  { area: 'Islamic estate planning', ynab: 'None', barakah: 'Faraid calculator + wasiyyah builder', winner: 'Barakah' },
  { area: 'Family / shared accounts', ynab: 'Two users per account', barakah: 'Up to 6 members on Family plan with privacy-preserving household roll-up', winner: 'Barakah' },
  { area: 'Reporting + forecasting', ynab: 'Excellent — Age of Money, forecasting, spending breakdowns', barakah: 'Solid analytics + safe-to-spend forecast; not as deep as YNAB on cash-flow forecasting yet', winner: 'YNAB on depth' },
  { area: 'Mobile app polish', ynab: 'Mature, multi-platform, well-loved', barakah: 'iOS + Android live; rapidly iterating', winner: 'YNAB on maturity' },
  { area: 'Learning curve', ynab: 'Steep — the methodology takes a while to internalise', barakah: 'Gentle — calculator-first, budgeting layered on top', winner: 'Barakah on onboarding' },
];

const faqItems = [
  {
    q: 'Is YNAB halal?',
    a: "The YNAB app itself is neutral — it's a budgeting tool, and budgeting is permissible. The Shariah-relevant concerns for Muslim YNAB users are about what YNAB doesn't do: it doesn't calculate zakat across multi-asset wealth, doesn't track your hawl, doesn't surface interest income as riba requiring purification, and doesn't help with halal investing decisions. YNAB is fine to use; it just leaves the Islamic-finance layer entirely up to you.",
  },
  {
    q: 'Why are Muslim YNAB users looking for an alternative?',
    a: "The most common reasons we hear: (1) keeping a separate spreadsheet for zakat alongside YNAB is tedious, especially when you have gold, stocks, and a 401k to value; (2) YNAB doesn't track hawl, so users miss anniversary dates; (3) Muslim households often share finances across more than two people (extended family, parents and adult children), and YNAB's two-user limit doesn't fit; (4) Plus the desire to support a Muslim-built product designed for the fiqh of their household.",
  },
  {
    q: 'Can I keep YNAB and use Barakah for the Islamic layer?',
    a: "Yes, and that's a common setup for households that love YNAB's discipline. Many users keep YNAB for the envelope budgeting and use Barakah for zakat calculation, hawl tracking, halal stock screening, and wasiyyah planning. The two apps don't fight — they read different aspects of your finances. The longer-term path is consolidating into one app, but the hybrid approach works.",
  },
  {
    q: "What's the closest Barakah equivalent to YNAB's category budgeting?",
    a: "Barakah's budget categories with optional rollover give you the same workflow — pre-allocate funds across categories, see what's left in each, roll over unspent. Strict YNAB-style 'every dollar must have a job' isn't enforced by default, but you can use Barakah this way if that's how you think about money. The advantage is that the same categories link directly to the zakat engine and the riba detector, so you're not double-entering data.",
  },
  {
    q: 'Does Barakah cover the UK / Canada / Australia like YNAB does?',
    a: "Bank sync is currently strongest in the US (12,000+ banks via Plaid). UK and Canada bank coverage is on the roadmap. UK Muslims can use Barakah today for manual transaction entry, zakat calculation, halal stock screening, hawl tracking, and Islamic will planning — all the non-bank-sync features work globally. CSV import works for any bank.",
  },
  {
    q: 'What about YNAB Together (the new family feature)?',
    a: "YNAB Together allows two users on a single budget. Barakah's Family plan allows up to six members with privacy-preserving household roll-ups — each member keeps their own private accounts and hawl, while the household sees joint goals and zakat status. For Muslim extended families this is structurally a better fit.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'YNAB Alternative for Muslims', item: 'https://trybarakah.com/learn/ynab-alternative-for-muslims' },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">YNAB Alternative for Muslims</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">

          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">YNAB alternative for Muslims</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-28</p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">The short version</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              YNAB is one of the most thoughtful budgeting products ever built. Its envelope-budgeting method, Age of Money concept, and Rule of Four have shaped how a generation of users think about cash flow. For Muslim users it leaves one thing alone: the Islamic-finance layer. There&apos;s no zakat calculation, no hawl tracking, no halal stock screening, no riba detection, no Islamic will planning. You either run a parallel spreadsheet for those — most observant Muslims do — or you switch to a product built for the fiqh-aware household.
            </p>
            <p className="text-base leading-7 text-gray-800">
              Barakah keeps the budgeting discipline and adds everything YNAB doesn&apos;t do. This page compares them honestly, including where YNAB still wins.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">The quick decision</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Stay on YNAB</strong> if: you love strict envelope-budgeting, your spouse is your only co-account holder, you do zakat by hand each year, and the lack of halal-screen / hawl-tracker isn&apos;t bothering you.</li>
              <li><strong>Switch to Barakah</strong> if: you&apos;re tired of running a zakat spreadsheet alongside YNAB, your household has more than two adult money-managers, or you want one app that covers budget + zakat + hawl + halal + riba + will.</li>
              <li><strong>Use both</strong> if: you&apos;ve internalised YNAB&apos;s method and don&apos;t want to switch, but want the Islamic-finance layer to take care of itself. The two apps don&apos;t conflict — they look at different things.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Area</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">YNAB</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r) => (
                  <tr key={r.area} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.area}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.ynab}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 text-xs">
                      <span className={
                        r.winner === 'Barakah' || r.winner === 'Barakah on price' || r.winner === 'Barakah on onboarding' ?
                          'rounded-full bg-[#1B5E20] px-2 py-0.5 font-semibold text-white' :
                        r.winner.startsWith('YNAB') ?
                          'rounded-full bg-gray-700 px-2 py-0.5 font-semibold text-white' :
                          'rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-900'
                      }>{r.winner}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">The honest take</h2>
            <p className="text-sm leading-6 text-amber-900 mb-2">
              YNAB is better-engineered for the strict-envelope budgeter and has a more mature mobile app. If those are your priorities and your Islamic-finance needs are simple, staying on YNAB is rational. The reason this page exists is that most Muslim YNAB users we hear from have crossed an inflection point — usually at a milestone like buying their first halal mortgage, having a child, opening a 401k, or starting a business — where the parallel zakat spreadsheet stops being tolerable.
            </p>
            <p className="text-sm leading-6 text-amber-900">
              The honest recommendation: spend a week trying Barakah&apos;s free tier alongside your YNAB setup. If the zakat + hawl + halal screening replaces enough spreadsheet work, the switch pays for itself.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Frequently asked</h2>
            <div className="space-y-4">
              {faqItems.map((f) => (
                <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                  <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">Related</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/learn/mint-alternative-for-muslims" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Mint alternative for Muslims</Link>
              <Link href="/learn/islamic-budgeting-app" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Islamic budgeting app</Link>
              <Link href="/learn/islamic-finance-app" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Best Islamic finance app 2026</Link>
              <Link href="/family" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Family plan</Link>
              <Link href="/zakat-calculator" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat calculator</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Try Barakah alongside YNAB this week</h2>
            <p className="text-sm leading-6 text-green-100 mb-4">
              Sync your accounts via Plaid. Watch zakat compute automatically across cash, gold, stocks, and 401k. If it replaces enough of your YNAB-side workarounds, you&apos;ll know.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Start free →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
