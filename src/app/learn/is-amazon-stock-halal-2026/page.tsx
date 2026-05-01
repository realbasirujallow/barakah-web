import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Amazon Stock (AMZN) Halal in 2026? | Barakah',
  description:
    'AAOIFI Standard 21 screen of Amazon (AMZN): debt ratio, interest income, AWS revenue mix, and the verdict for Muslim investors in 2026 with purification calculation.',
  keywords: [
    'is amazon stock halal',
    'amzn halal',
    'amazon sharia compliant',
    'amazon stock muslim investor',
    'aaoifi amzn',
    'amazon debt ratio',
    'aws revenue halal',
    'halal screen amazon',
    'is amzn permissible',
    'amazon zakat',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/is-amazon-stock-halal-2026' },
  openGraph: {
    title: 'Is Amazon Stock (AMZN) Halal in 2026? — Full AAOIFI Screen',
    description: 'AMZN debt-to-asset ratio, interest income, AWS revenue mix, and the AAOIFI Standard 21 verdict. Plus how to purify your dividends.',
    url: 'https://trybarakah.com/learn/is-amazon-stock-halal-2026',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Amazon Stock (AMZN) Halal in 2026?',
    description: 'Full AAOIFI Standard 21 screen of AMZN with current financial ratios.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Is Amazon Stock Halal 2026', item: 'https://trybarakah.com/learn/is-amazon-stock-halal-2026' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Is Amazon Stock (AMZN) Halal in 2026?',
  description: 'A line-by-line AAOIFI Standard 21 screen of Amazon stock for Muslim investors in 2026.',
  url: 'https://trybarakah.com/learn/is-amazon-stock-halal-2026',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function IsAmazonStockHalalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Is Amazon Stock Halal 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 8 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Is Amazon Stock (AMZN) Halal in 2026? — Full AAOIFI Screen
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Amazon is the second-largest weight in most US growth ETFs and the question we get most often after Apple. The short answer: AMZN currently passes the AAOIFI Standard 21 screen but sits close to the line on interest income, which means you owe purification on your dividends. Here is the full breakdown.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The four AAOIFI screens, applied to AMZN</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            AAOIFI Standard 21 is the global benchmark for halal stock screening. It has four tests. A stock fails if any of them does.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">1. Business activity screen (qualitative)</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Amazon&apos;s revenue mix as of the most recent 10-K (FY2025): roughly 60% online stores and physical retail, 17% Amazon Web Services (AWS), 8% advertising, 7% subscription services (Prime, Music), 7% third-party seller services, plus other. None of these primary categories are themselves haram. Amazon does sell alcohol, pork, music subscriptions that include some prohibited content, and books with adult themes. AAOIFI&apos;s threshold for incidental haram revenue is under 5%.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Best public estimates put Amazon&apos;s alcohol, prohibited media, and pork sales at well under 5% of total revenue. Sheikh Joe Bradford&apos;s 2024 review of AMZN landed at roughly 1.8% incidental haram. <strong>Pass.</strong>
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">2. Debt to total assets &lt; 33%</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Most recent balance sheet: total interest-bearing debt around $135B against total assets around $625B. Ratio: 21.6%. <strong>Pass.</strong> Amazon has historically been low on long-term debt relative to its asset base because operating cash flow funds most of its capex.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">3. Interest-bearing securities ÷ total assets &lt; 33%</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Cash, cash equivalents, and marketable securities sit around $90B. The marketable securities slice (which is the interest-bearing portion that triggers AAOIFI&apos;s concern) is roughly $25B. Against $625B in assets, that is about 4%. <strong>Pass.</strong>
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">4. Interest income ÷ total revenue &lt; 5%</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Amazon reported interest income around $4.8B against total revenue of $640B in FY2025. That is 0.75%. <strong>Pass.</strong> But this is the number to watch each year because Amazon&apos;s cash pile keeps growing and rates were elevated through 2025.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The AWS question</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            AWS is sometimes flagged because it hosts conventional banks, gambling sites, and other haram operators. Mufti Faraz Adam&apos;s position (which most AAOIFI-aligned scholars share): selling cloud infrastructure is a halal service even if some buyers use it for haram. The same logic applies to electricity utilities, internet providers, and shipping companies. The intent of the seller and the inherent nature of the product is what matters. AWS itself is permissible.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            A more conservative position (held by some AMJA scholars) says you should still purify a proportional share of AWS revenue derived from prohibited customers. In practice this is unmeasurable, so the dominant view is to apply the standard incidental-haram purification to total earnings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Verdict and purification</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            AMZN passes all four AAOIFI Standard 21 screens as of April 2026. You can own it. Because incidental haram revenue is around 1.8%, you owe purification on that share of your dividends and capital gains.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Purification calculation: take your dividend (Amazon does not pay one currently — verify each year) plus realized capital gain. Multiply by ~1.8%. Donate that amount as sadaqah to a charitable cause. Do not count it as zakat. Mufti Taqi Usmani&apos;s purification methodology (in <em>An Introduction to Islamic Finance</em>) is the cleanest reference.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Things to re-check each quarter</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Interest income line on the income statement. Crosses 5% and the stock is out.</li>
            <li>Long-term debt issuance. Amazon has tapped corporate bond markets opportunistically.</li>
            <li>Marketable securities balance against total assets.</li>
            <li>New business lines that materially change the haram revenue percentage.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Barakah re-screens AMZN every time a new quarterly report drops. If it ever fails, your dashboard will flag it within 24 hours of the 10-Q filing.
          </p>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              AMZN is halal under AAOIFI Standard 21 as of April 2026. Debt ratio 22%, interest income under 1%, incidental haram revenue around 1.8%. AWS counts as halal infrastructure even though some customers run haram businesses. Purify ~1.8% of your gains as sadaqah. Re-check after every 10-Q.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/halal-stocks/amzn', title: 'AMZN Live Screener', desc: 'Real-time AAOIFI screen on Amazon stock.' },
                { href: '/learn/halal-stocks', title: 'Halal Stocks Guide', desc: 'How to vet any individual stock for compliance.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'The full Islamic investing framework.' },
                { href: '/learn/halal-stock-screener', title: 'How Our Screener Works', desc: 'Inside the AAOIFI engine that powers Barakah.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Screen any stock against AAOIFI Standard 21</h2>
            <p className="text-green-200 mb-6">Barakah covers 30,000+ tickers worldwide. Connect your brokerage and see your portfolio&apos;s halal status in seconds.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free Account
              </Link>
              <Link href="/halal-stocks" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Browse Halal Stocks →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
