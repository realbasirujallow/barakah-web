import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AAOIFI Halal Stock Screening — The Three Thresholds Explained',
  description:
    'AAOIFI Standard 21 sets the most widely-cited halal stock criteria: debt &lt; 33%, interest income &lt; 5%, non-permissible income &lt; 5%. Here&apos;s what each one means in practice.',
  keywords: [
    'aaoifi standard 21',
    'halal stock screening criteria',
    'halal stock thresholds',
    'aaoifi vs other screens',
    'halal investing methodology',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/aaoifi-halal-screening' },
  openGraph: {
    title: 'AAOIFI Halal Stock Screening — Three Thresholds',
    description: 'How AAOIFI Standard 21 separates halal from haram stocks, with worked examples.',
    url: 'https://trybarakah.com/learn/aaoifi-halal-screening',
    siteName: 'Barakah',
    type: 'article',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AAOIFI Standard 21?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) Standard 21 is a globally-recognised framework for screening publicly-traded stocks for shariah compliance. It defines a two-stage screen: a business-activity screen (no haram primary revenue) and three financial-ratio thresholds.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the three financial thresholds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AAOIFI Standard 21 sets: (1) interest-bearing debt must be less than 33% of the company&apos;s market capitalization, (2) interest income must be less than 5% of total revenue, (3) non-permissible (haram) income must be less than 5% of total revenue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are AAOIFI standards stricter than alternatives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AAOIFI is widely considered a middle-ground standard. Some scholars apply stricter filters: lower debt thresholds (e.g. 25% instead of 33%), no tolerance for interest income at all, or active-investing rules. Always verify against your scholar&apos;s preferred methodology.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Barakah use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah&apos;s halal screener uses AAOIFI Standard 21 thresholds by default. We surface the underlying numbers (debt ratio, interest income share, non-permissible income share) on each stock&apos;s page so you can apply a stricter filter yourself if your scholar requires.',
      },
    },
  ],
};

export default function AAOIFIScreeningPage() {
  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">AAOIFI Halal Screening</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          AAOIFI halal stock screening — three thresholds explained
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Methodology summary, not a fatwa. See our{' '}
          <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
            full methodology
          </Link>
          {' '}for sources.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The two-stage screen</h2>
          <p className="text-base text-gray-700 mb-3">
            AAOIFI Standard 21 separates halal from haram stocks in two passes:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-base text-gray-800">
            <li>
              <strong>Business-activity screen.</strong> The company&apos;s primary revenue must
              not come from prohibited industries — alcohol, pork, gambling, conventional
              banking/insurance, adult content, weapons of mass destruction, and similar.
              Even one of these as primary revenue automatically fails the screen.
            </li>
            <li>
              <strong>Financial-ratio screen.</strong> Three ratios must each fall below
              their threshold (see below).
            </li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The three financial thresholds</h2>
          <table className="w-full text-base text-gray-800">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Ratio</th>
                <th className="text-left py-2">Threshold</th>
                <th className="text-left py-2">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 align-top"><strong>Interest-bearing debt</strong></td>
                <td className="py-2 align-top">&lt; 33% of market cap</td>
                <td className="py-2 align-top text-gray-700">Companies with too much riba on their balance sheet are tainted.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 align-top"><strong>Interest income</strong></td>
                <td className="py-2 align-top">&lt; 5% of revenue</td>
                <td className="py-2 align-top text-gray-700">Earning money from interest directly is riba; small incidental amounts are tolerated and purified.</td>
              </tr>
              <tr>
                <td className="py-2 align-top"><strong>Non-permissible income</strong></td>
                <td className="py-2 align-top">&lt; 5% of revenue</td>
                <td className="py-2 align-top text-gray-700">A small share of haram revenue (e.g. an airline serving alcohol) doesn&apos;t void the whole stock; investors purify the proportional dividend.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Purification</h2>
          <p className="text-base text-gray-700">
            When you hold a stock that has any non-zero share of interest income or
            non-permissible income, the proportional share of dividends you receive should
            be donated to charity (not zakat — these are separate). Barakah&apos;s halal
            screener calculates the purification amount per stock based on the published
            ratios, so you know exactly what to give.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">When AAOIFI is too lenient</h2>
          <p className="text-base text-gray-700 mb-3">
            Some scholars apply stricter filters than AAOIFI Standard 21. Common stricter
            positions include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
            <li>Lower debt ratio (e.g. 25% instead of 33%)</li>
            <li>Zero tolerance for interest income (any non-zero share fails the stock)</li>
            <li>Zero tolerance for non-permissible income</li>
            <li>Sector-specific bans beyond AAOIFI&apos;s list (e.g. some scholars exclude all entertainment companies)</li>
          </ul>
          <p className="text-base text-gray-700 mt-3">
            Barakah surfaces the underlying ratios on each stock&apos;s page so you can apply
            your scholar&apos;s preferred filter yourself. Default verdicts use AAOIFI
            thresholds; you can mark a stock as personally non-halal regardless of the
            screen result.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Try the screener</h2>
          <Link href="/halal-stocks" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open Barakah&apos;s halal stock screener →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/halal-stocks" className="text-[#1B5E20] underline">Halal stocks live screener</Link></li>
            <li>· <Link href="/learn/halal-stock-screener" className="text-[#1B5E20] underline">Halal stock screener guide</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Full methodology + sources</Link></li>
            <li>· <Link href="/disclaimer" className="text-[#1B5E20] underline">Why Barakah is not a fatwa</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
