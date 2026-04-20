import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nisab in GBP 2026: Live Gold & Silver Thresholds for UK Muslims | Barakah',
  description:
    'The zakat nisab threshold in British pounds. Live gold (85g, AMJA standard) and silver (595g) values in GBP, methodology explained for UK Muslims, madhab guidance, and the 2026 update schedule.',
  keywords: [
    'nisab gbp',
    'nisab uk',
    'nisab in pounds',
    'zakat threshold uk',
    'zakat gbp',
    'uk nisab 2026',
    'nisab silver uk',
    'nisab gold uk',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/nisab-gbp' },
  openGraph: {
    title: 'Nisab in GBP 2026 — UK Zakat Threshold | Barakah',
    description: 'Live nisab values in GBP for UK Muslims calculating zakat.',
    url: 'https://trybarakah.com/learn/nisab-gbp',
    type: 'article',
  },
};

export default function NisabGbpPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Nisab in GBP 2026: Live Gold & Silver Thresholds for UK Muslims',
    description: 'UK-specific zakat threshold calculation in British pounds.',
    author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
    publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/nisab-gbp' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the nisab threshold in GBP for 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'As of April 2026, the gold nisab (85g, AMJA standard used by Barakah) in GBP is approximately \u00a36,000\u2013\u00a36,200 depending on the day\u2019s spot price; the silver nisab (595g) is approximately \u00a3400\u2013\u00a3500. Classical fiqh texts use 87.48g gold / 612.36g silver; the modern rounded values are within ~3%. Values fluctuate daily with metal markets. UK Muslims should verify against a live calculator on the day they\u2019re computing zakat.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which nisab should I use if I live in the UK?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most UK scholarly bodies (NZF, IFG, the Islamic Shari\u2019a Council) align with silver nisab by default because it\u2019s lower and therefore obligates more households and benefits more recipients. Hanafi Muslims traditionally use silver nisab. Shafi\u2019i, Maliki, and Hanbali Muslims may use either, with many UK scholars advising silver for precaution (ihtiyat).',
        },
      },
      {
        '@type': 'Question',
        name: 'Do UK Muslims pay zakat to UK charities or back home?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Both are valid. The 8 Quranic recipient categories are universal. Most UK scholars advise prioritising local need in your community first (UK-based registered zakat-eligible charities) and remitting the remainder to family/community back home if stronger need exists there. National Zakat Foundation (NZF) and Islamic Relief are the two largest UK-registered zakat distributors.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Nisab (GBP)</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-4 inline-block rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-semibold">UK-specific · GBP values</div>
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Nisab in GBP (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              The <Link href="/fiqh-terms/nisab" className="text-[#1B5E20] underline">nisab</Link> is
              the minimum wealth threshold that obligates zakat. Barakah uses the AMJA standard of
              85g of gold or 595g of silver (classical fiqh texts specify 87.48g / 612.36g; the modern
              rounded values are within ~3%) — but UK Muslims calculate in pounds sterling. This
              page explains which nisab to use, the live GBP values, and how UK-specific factors (tax,
              recipients, NZF partnership) apply.
            </p>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              <strong>This page targets UK Muslims.</strong> For the USD authority version, see{' '}
              <Link href="/learn/nisab" className="underline">/learn/nisab</Link>.
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Live GBP thresholds</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Values fluctuate daily with metal spot prices. As of April 2026, typical ranges are:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Methodology</th>
                    <th className="p-3 font-semibold text-gray-700">Classical weight</th>
                    <th className="p-3 font-semibold text-gray-700">Approx GBP value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-semibold">Gold nisab (AMJA default)</td>
                    <td className="p-3">85g / 20 mithqal <span className="text-xs text-gray-500">(classical 87.48g)</span></td>
                    <td className="p-3">~£6,000–£6,200</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-semibold">Silver nisab (classical Hanafi, UK scholar default)</td>
                    <td className="p-3">595g / 200 dirham <span className="text-xs text-gray-500">(classical 612.36g)</span></td>
                    <td className="p-3">~£400–£500</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Lower-of-two (safest)</td>
                    <td className="p-3">whichever is lower today</td>
                    <td className="p-3">silver in almost all years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Spot-checked against LBMA pm-fix (London gold) + LBMA silver fix on 2026-04-18. Barakah
              recomputes against live feeds and applies your chosen methodology automatically.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Which to use in the UK?</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              UK-based scholarly bodies — including the{' '}
              <strong>National Zakat Foundation (NZF)</strong>, <strong>IFG (Islamic Finance Guru)</strong>,
              and the <strong>Islamic Shari&apos;a Council</strong> — default to silver nisab when advising
              households. The reasoning:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>It&apos;s the Hanafi position.</strong> The Hanafi madhab is dominant across South Asian (Pakistani, Bangladeshi, Indian) and Turkish communities — the majority of UK Muslims.</li>
              <li><strong>It obligates more households.</strong> A lower threshold means more wealth is zakatable, which benefits more recipients.</li>
              <li><strong>It&apos;s more cautious (ihtiyat).</strong> Erring toward the obligation.</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              If you&apos;re Shafi&apos;i, Maliki, or Hanbali, the gold nisab is valid for you — but most UK
              scholars advise silver for caution. Barakah lets you switch between the three
              methodologies and records which was used for every snapshot.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">UK-specific considerations</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Gift Aid is not applicable to zakat.</strong> Zakat is an obligation owed to the recipients, not a donation from your discretionary wealth. Sadaqah (voluntary) is Gift Aid-eligible when given to UK-registered charities.</li>
              <li><strong>ISA balances are zakatable.</strong> Cash ISAs, stocks &amp; shares ISAs, Lifetime ISAs — all count toward zakatable wealth. The UK tax wrapper doesn&apos;t exempt from zakat.</li>
              <li><strong>Workplace pensions (DB vs DC).</strong> Defined-contribution pensions (access restricted) — most UK scholars rule zakat is not due until accessed. Defined-benefit pensions — not directly zakatable until received as income. See <Link href="/learn/zakat-on-401k" className="text-[#1B5E20] underline">zakat on retirement accounts</Link> (US analogue).</li>
              <li><strong>Help to Buy / Lifetime ISA bonus</strong> — government top-ups received interest-free, so the bonus itself is zakatable; but interest accrued inside the account is riba and must be purified.</li>
              <li><strong>Student Loan (Plan 2/4/5).</strong> Interest-bearing; debts to Student Loans Company should be deducted from your zakatable wealth to the extent of what&apos;s due within the hawl year (following the majority scholarly view on deferred debt).</li>
            </ul>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Distributing UK zakat</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              The 8 Qur&apos;anic recipient categories (Qur&apos;an 9:60) are universal. UK-based Muslims
              commonly use:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>National Zakat Foundation (NZF)</strong> — the only UK-specific zakat distributor; strong governance, Shariah advisory, focus on UK poverty</li>
              <li><strong>Islamic Relief UK</strong> — broad international and domestic programmes</li>
              <li><strong>Penny Appeal</strong> — similar profile</li>
              <li><strong>Muslim Aid</strong> — established UK-registered charity</li>
              <li>Local mosques with established zakat committees</li>
              <li>Direct to eligible recipients in your family or community (takes precedence per most scholars)</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Calculate your UK zakat</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah&apos;s zakat calculator supports GBP out of the box. Link your UK bank accounts,
              ISAs, and pensions through Plaid; the app runs daily nisab checks against live gold/silver
              spot in your currency and handles UK-specific considerations (ISA treatment, Student Loan
              deduction, Help to Buy bonus zakat vs interest).
            </p>
            <Link href="/signup?region=uk" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Get started free →
            </Link>
          </section>
        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Nisab →</Link>
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hawl →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </main>
    </div>
  );
}
