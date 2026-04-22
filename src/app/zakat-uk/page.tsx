import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../lib/trial';

export const metadata: Metadata = {
  title: 'Zakat in the UK (2026): Calculate, Distribute, and Track Your Obligation | Barakah',
  description:
    'How UK Muslims calculate and pay zakat in 2026. Live nisab in GBP, ISA and pension rules, UK distribution partners (NZF, Islamic Relief), and a scholar-aligned methodology per Hanafi, Shafi\u2019i, Maliki, and Hanbali positions.',
  keywords: [
    'zakat uk',
    'uk zakat calculator',
    'zakat gbp',
    'zakat in british pounds',
    'nisab uk',
    'how to pay zakat uk',
    'islamic zakat uk',
  ],
  alternates: { canonical: 'https://trybarakah.com/zakat-uk' },
  openGraph: {
    title: 'Zakat in the UK (2026) | Barakah',
    description: 'Complete UK zakat guide — GBP nisab, ISA/pension rules, UK charities.',
    url: 'https://trybarakah.com/zakat-uk',
    type: 'article',
  },
};

const steps = [
  {
    n: 1,
    title: 'Check your nisab in GBP',
    desc: 'Most UK scholars default to silver (~£400-£500); Hanafi explicitly so. Gold is ~£6,200. Below whichever applies, no zakat is due.',
    link: { href: '/learn/nisab-gbp', label: 'Live UK nisab →' },
  },
  {
    n: 2,
    title: 'Aggregate every zakatable asset',
    desc: 'Cash (UK + overseas), gold/silver (including jewellery per most madhabs), stocks and ETFs, ISA balances, cryptocurrencies, rental-property income accumulated past hawl, business stock and receivables. Deduct legitimate debts due within the hawl year.',
    link: { href: '/fiqh-terms/zakat', label: 'Zakat definition →' },
  },
  {
    n: 3,
    title: 'Confirm your hawl anniversary',
    desc: 'Zakat is due 354 days after your wealth first crossed the nisab. If you\u2019ve maintained wealth above nisab throughout, each year\u2019s hawl starts on the same Hijri/Gregorian date.',
    link: { href: '/fiqh-terms/hawl', label: 'Hawl explained →' },
  },
  {
    n: 4,
    title: 'Apply 2.5% and distribute',
    desc: 'UK-based Muslims commonly distribute through the National Zakat Foundation (NZF), Islamic Relief, or direct to eligible family. The 8 Qur\u2019anic categories (Qur\u2019an 9:60) are universal.',
    link: { href: '/fiqh-terms/zakat', label: '8 categories →' },
  },
];

export default function ZakatUkPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When is zakat due in the UK?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zakat is due 354 days after your wealth first crossed the nisab threshold — this is the hawl. It is not tied to Ramadan or the fiscal year, though many UK Muslims align their zakat payment to Ramadan for the multiplied spiritual reward.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I pay zakat on my ISA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Cash ISAs, Stocks & Shares ISAs, and Lifetime ISAs are all part of your zakatable wealth. The UK tax wrapper does not exempt from zakat, which is a religious obligation on the underlying value, not the tax treatment. The interest earned on a Cash ISA must be purified separately (donated to charity with no reward expectation) as riba.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I give zakat via Gift Aid?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Gift Aid is designed for discretionary donations to UK-registered charities. Zakat is an obligation owed to the recipients — not discretion on your part — so HMRC does not allow Gift Aid uplift on zakat. Sadaqah (voluntary charity) is Gift Aid-eligible if given to registered UK charities.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do UK workplace pensions count toward zakat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most UK scholars rule that defined-contribution pensions (where access is restricted until age 55+) are not zakatable until you can access them. Defined-benefit pensions are treated similarly — not zakatable until received as income. This mirrors the US 401(k) treatment.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup?region=uk" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Zakat UK</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-4 inline-block rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-semibold">
            UK-specific · GBP-native · Compliant with NZF / IFG guidance
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Zakat in the UK (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <p className="text-lg leading-8 text-gray-800 mb-8">
            UK Muslims compute zakat the same way as the rest of the ummah: 2.5% of wealth above the
            nisab, held for one lunar year (hawl). What changes for the UK is the <em>thresholds</em>
            {' '}(GBP, not USD), some <em>asset-class rules</em> (ISAs, pensions, Help to Buy), and the{' '}
            <em>distribution</em> (NZF, Islamic Relief, mosques with zakat committees). This page covers
            everything UK-specific.
          </p>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">The 4 steps</h2>
            <div className="space-y-4">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1B5E20] text-white font-bold flex items-center justify-center">
                    {s.n}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{s.title}</h3>
                    <p className="text-sm leading-7 text-gray-800 mb-2">{s.desc}</p>
                    <Link href={s.link.href} className="text-sm font-semibold text-[#1B5E20] underline">
                      {s.link.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">UK-specific asset rules</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Asset</th>
                    <th className="p-3 font-semibold text-gray-700">Zakatable?</th>
                    <th className="p-3 font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Cash ISA</td><td className="p-3">Yes</td><td className="p-3">Balance is zakatable; interest earned must be purified separately as riba</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Stocks & Shares ISA</td><td className="p-3">Yes</td><td className="p-3">Apply AAOIFI screen first; impermissible income purified</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Lifetime ISA (LISA)</td><td className="p-3">Yes</td><td className="p-3">Balance plus any earned bonus is zakatable; any accrued interest must be purified</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Defined-Contribution pension</td><td className="p-3">Conditional</td><td className="p-3">Most scholars: not until age 55+ access; verify with your chosen scholar</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Defined-Benefit pension</td><td className="p-3">Conditional</td><td className="p-3">Not until received as income</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Primary residence</td><td className="p-3">No</td><td className="p-3">Your family home is not zakatable regardless of value</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Buy-to-let rental property</td><td className="p-3">Partial</td><td className="p-3">Property value not zakatable; accumulated rental income held past hawl is zakatable</td></tr>
                  <tr><td className="p-3 font-semibold">Student Loan (Plans 2/4/5)</td><td className="p-3">Deduction</td><td className="p-3">Amount due within the hawl year may be deducted from zakatable wealth</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">UK distribution partners</h2>
            <p className="text-sm leading-7 text-amber-900 mb-3">
              Zakat distribution requires a trustworthy intermediary or direct delivery to one of the
              8 Qur&apos;anic categories. UK-registered options:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm leading-7 text-amber-900">
              <li><strong>National Zakat Foundation (NZF)</strong> — the only UK-registered charity dedicated solely to zakat, with strong Shariah governance</li>
              <li><strong>Islamic Relief UK</strong> — broad domestic + international programmes</li>
              <li><strong>Penny Appeal</strong> — similar profile, established UK charity</li>
              <li><strong>Muslim Aid</strong> — long-standing UK Muslim humanitarian charity</li>
              <li>Local mosques with zakat committees (verify Shariah-compliant distribution)</li>
              <li>Direct to eligible family or community (takes precedence per most scholars)</li>
            </ul>
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Frequently asked</h2>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">When is zakat due for me?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Zakat is due 354 days after your wealth first crossed the nisab threshold. That&apos;s
                your hawl anniversary, calculated on the lunar calendar. It&apos;s not tied to Ramadan,
                though many UK Muslims align payment to the holy month for the multiplied reward.
              </p>
            </details>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">Can I use Gift Aid for zakat?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                No. Zakat is an obligation owed to the recipients, not a discretionary donation.
                HMRC&apos;s Gift Aid is for discretionary charity. Sadaqah (voluntary) can be Gift
                Aid-eligible when given to UK-registered charities.
              </p>
            </details>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">Is jewellery zakatable?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Yes, per the majority of madhabs including Hanafi and most UK scholars. Gold and silver
                jewellery above nisab is zakatable each year. A small minority view (some Maliki
                rulings) exempts jewellery in ordinary use — but this is a minority position.
              </p>
            </details>
            <details className="mb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">Can I give zakat to my own family?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Yes, to family you are not Islamically required to financially support. You cannot
                give zakat to parents, grandparents, or children (those you&apos;re obligated to support
                anyway) — but siblings, cousins, aunts, uncles, and other eligible family in need
                are valid recipients.
              </p>
            </details>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">UK zakat tracked daily in Barakah</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your UK accounts (ISAs, pensions, current accounts) via Plaid; Barakah runs daily
              nisab checks against live GBP spot prices, flags UK-specific rules (Help to Buy bonus
              vs interest, Student Loan deduction), and tracks your hawl continuously. Scholar-aligned
              methodology, family sharing, and an auditable snapshot trail.
            </p>
            <Link href="/signup?region=uk" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Start {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} free trial →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
