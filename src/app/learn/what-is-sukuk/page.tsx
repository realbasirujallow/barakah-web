import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is Sukuk? Islamic Bonds Explained (2026)',
  description:
    'What is sukuk? A plain-English guide to Islamic investment certificates — how sukuk differ from conventional bonds, the main types (ijara, murabaha, musharaka, mudaraba, wakala), whether they are halal, and the risks to know.',
  keywords: ['what is sukuk', 'sukuk', 'sukuk meaning', 'sukuk definition', 'islamic bonds', 'are sukuk halal'],
  alternates: { canonical: 'https://trybarakah.com/learn/what-is-sukuk' },
  openGraph: {
    title: 'What Is Sukuk? Islamic Bonds Explained (2026)',
    description: 'How sukuk work, how they differ from conventional bonds, the main types, and whether they are halal.',
    url: 'https://trybarakah.com/learn/what-is-sukuk',
    type: 'article',
  },
};

const sukukTypes = [
  { name: 'Ijara sukuk', desc: 'Backed by a leased asset; holders earn rental income. The most common structure.' },
  { name: 'Murabaha sukuk', desc: 'Based on a cost-plus sale of goods; returns come from the disclosed markup.' },
  { name: 'Musharaka sukuk', desc: 'A partnership/joint-venture; holders share in actual profit and loss.' },
  { name: 'Mudaraba sukuk', desc: 'One party provides capital, another manages it; profits are shared by agreed ratio.' },
  { name: 'Wakala sukuk', desc: 'An agent invests the proceeds on holders’ behalf for a fee plus a target return.' },
];

const faqItems = [
  {
    q: 'What is sukuk in simple terms?',
    a: 'Sukuk are Islamic investment certificates often called "Islamic bonds." Instead of lending money at interest, each certificate represents partial ownership of a real asset, project, or business venture, and the holder earns a share of the income that asset generates — rent or profit, not interest.',
  },
  {
    q: 'How is sukuk different from a conventional bond?',
    a: 'A conventional bond is a loan: you lend money and receive interest (riba), which is impermissible in Islam. Sukuk represent ownership of an underlying asset or venture, so returns come from rent or profit and the holder shares in the asset’s risk. A bondholder is a creditor; a sukuk holder is a part-owner.',
  },
  {
    q: 'Are sukuk halal?',
    a: 'A properly structured sukuk that genuinely transfers ownership of a permissible asset and ties returns to that asset’s real income is considered halal by most scholars. However, some sukuk are criticized for mimicking conventional bonds in substance (for example, with repurchase guarantees at face value). The structure and the underlying asset both matter — review the certificate’s terms or a scholar’s ruling.',
  },
  {
    q: 'Can I lose money on sukuk?',
    a: 'Yes. Because sukuk holders are part-owners rather than guaranteed creditors, returns depend on the performance of the underlying asset, and the value can fall. That genuine risk-sharing is part of what makes the structure Shariah-compliant.',
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="min-h-screen bg-white px-4 sm:px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">What Is Sukuk?</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            What Is Sukuk? Islamic Bonds Explained
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-05-22</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            Sukuk are often called &quot;Islamic bonds,&quot; but that label is misleading. A bond is a loan that pays
            interest; sukuk are certificates of <strong>ownership</strong> in a real asset or venture, paying you a share
            of the rent or profit it produces. Here is how they actually work.
          </p>

          {/* Definition */}
          <section className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Sukuk, defined</h2>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Sukuk</strong> (singular: <em>sakk</em>) are Shariah-compliant financial certificates that
              represent undivided ownership in a tangible asset, a pool of assets, or a business venture. Holders earn
              returns from the income that ownership generates — not from interest.
            </p>
          </section>

          {/* Bond vs sukuk */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Sukuk vs conventional bonds</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300"></th>
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Conventional bond</th>
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Sukuk</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 dark:text-gray-200">
                  <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Holder is a&hellip;</td><td className="p-3">Creditor (lender)</td><td className="p-3">Part-owner of an asset</td></tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Return comes from</td><td className="p-3">Interest (riba)</td><td className="p-3">Rent or profit share</td></tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Risk</td><td className="p-3">Mostly credit risk; principal contractually owed</td><td className="p-3">Shares in the asset&apos;s real performance</td></tr>
                  <tr><td className="p-3 font-semibold">Shariah view</td><td className="p-3">Impermissible (interest-based)</td><td className="p-3">Permissible when properly structured</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Types */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Main types of sukuk</h2>
            <div className="space-y-3">
              {sukukTypes.map((s) => (
                <div key={s.name} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl group dark:border-gray-700">
                  <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 flex justify-between items-center select-none dark:text-gray-100">
                    <span>{item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 dark:text-gray-300 dark:border-gray-700">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Note:</strong> Educational information only, not investment advice or a fatwa. Sukuk structures vary
            widely, and scholars differ on specific issues. Review the certificate&apos;s terms and consult a qualified
            scholar and licensed adviser before investing.
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-teal-700 rounded-2xl p-8 text-white text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Track your halal investments in one place</h2>
            <p className="text-green-200 mb-6">
              From sukuk to halal stocks, Barakah brings your Shariah-compliant holdings together with zakat and
              purification built in.
            </p>
            <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Get Started Free
            </Link>
          </div>

          {/* Hub navigation */}
          <nav aria-label="Related articles">
            <h2 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Halal Investing Hub</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/learn/halal-investing-for-beginners" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Start Here</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal Investing for Beginners</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">The fundamentals, step by step.</p>
              </Link>
              <Link href="/learn/halal-etfs" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Funds</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal ETFs</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Shariah-compliant fund options.</p>
              </Link>
              <Link href="/halal-stocks/list" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Stocks</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal Stocks List 2026</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">AAOIFI-screened tickers.</p>
              </Link>
            </div>
          </nav>

          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/sukuk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sukuk →</Link>
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All terms →</Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
