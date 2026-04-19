import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Halal Stocks List 2026: How to Screen for Shariah Compliance | Barakah',
  description: 'Learn how to screen stocks for Shariah compliance using AAOIFI standards. Covers halal sectors, haram industries, financial ratios, and how to build a halal portfolio in 2026.',
  keywords: ['halal stocks', 'shariah compliant stocks', 'halal investing', 'islamic stocks', 'halal stock screener', 'AAOIFI screening', 'halal ETF', 'islamic finance investing'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/halal-stocks',
  },
  openGraph: {
    title: 'Halal Stocks List 2026: How to Screen for Shariah Compliance | Barakah',
    description: 'Complete guide to screening stocks for Shariah compliance using AAOIFI standards, with sector analysis and screening ratios.',
    url: 'https://trybarakah.com/learn/halal-stocks',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I know if a stock is halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A stock is considered halal if the company passes both business activity screening (no haram revenue sources like alcohol, gambling, or interest-based finance) and financial ratio screening (debt-to-market-cap below 33%, interest income below 5%, and illiquid assets ratio below certain thresholds as defined by AAOIFI).',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the AAOIFI screening standards for halal stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) sets three main financial ratios: (1) total debt divided by trailing 12-month average market cap must be below 33%, (2) interest-bearing securities divided by trailing 12-month average market cap must be below 33%, and (3) impermissible income must be below 5% of total revenue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are tech stocks halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many technology stocks pass Shariah screening because their core business is permissible (software, hardware, cloud services). However, each company must still be individually screened for financial ratios and any impermissible revenue streams. Companies like Apple, Microsoft, and Google have historically passed halal screening, but this can change quarterly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to purify dividends from halal stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Even if a stock passes Shariah screening, it may have a small percentage of impermissible income (up to 5%). You should purify your dividends by donating the equivalent percentage to charity. For example, if 3% of a company revenue is from interest income, donate 3% of your dividends.',
      },
    },
    {
      '@type': 'Question',
      name: 'What industries are considered haram for investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Industries that are impermissible include conventional banking and insurance, alcohol production and distribution, pork and pork-related products, gambling and casinos, adult entertainment, tobacco, and weapons manufacturing. Companies primarily involved in these sectors cannot be halal investments.',
      },
    },
  ],
};

export default function HalalStocksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <div className="flex items-center gap-3">
              <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
              <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
              <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Halal Stocks</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Halal Investing
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Halal Stocks List 2026: How to Screen for Shariah Compliance</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">A complete guide to identifying Shariah-compliant stocks using AAOIFI standards, understanding halal vs. haram sectors, and building a portfolio that aligns with your faith.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>12 min read</span>
                <span>Published: April 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#what-is-halal" className="text-[#1B5E20] hover:underline">What Makes a Stock Halal?</Link></li>
                <li><Link href="#aaoifi" className="text-[#1B5E20] hover:underline">AAOIFI Screening Standards</Link></li>
                <li><Link href="#sectors" className="text-[#1B5E20] hover:underline">Halal vs. Haram Sectors</Link></li>
                <li><Link href="#ratios" className="text-[#1B5E20] hover:underline">Financial Ratio Screening</Link></li>
                <li><Link href="#purification" className="text-[#1B5E20] hover:underline">Dividend Purification</Link></li>
                <li><Link href="#screener" className="text-[#1B5E20] hover:underline">Using Barakah&apos;s Screener</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">Frequently Asked Questions</Link></li>
              </ul>
            </nav>

            {/* Main Content */}
            <section id="what-is-halal" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What Makes a Stock Halal?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Investing in stocks is permissible in Islam as long as the underlying company operates in a Shariah-compliant manner. When you buy shares in a company, you become a partial owner, so the company&apos;s business activities and financial structure must align with Islamic principles.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Halal stock screening involves two layers of analysis:
              </p>
              <ul className="space-y-3 text-gray-700 list-disc list-inside dark:text-gray-300">
                <li><strong>Business Activity Screening:</strong> The company&apos;s core business must not be involved in haram (prohibited) activities such as alcohol, gambling, conventional interest-based finance, pork, or adult entertainment.</li>
                <li><strong>Financial Ratio Screening:</strong> Even if the business itself is permissible, the company must maintain acceptable levels of debt, interest income, and liquid assets as defined by AAOIFI or similar Shariah boards.</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">The Scholarly Basis</h3>
                <p className="text-blue-900 text-sm">
                  The permissibility of stock ownership is based on the principle that buying shares represents ownership in the underlying assets and business operations. The Islamic Fiqh Academy (OIC) and AAOIFI have both issued rulings permitting stock investment with proper screening. The 5% impermissible income tolerance was established because virtually no modern company is 100% free from conventional financial interactions.
                </p>
              </div>
            </section>

            <section id="aaoifi" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">AAOIFI Screening Standards</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) is the most widely recognized body for Islamic financial standards. Their equity screening methodology is used by major Islamic indices and Shariah-compliant funds worldwide.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The AAOIFI standard requires companies to pass both qualitative (business activity) and quantitative (financial ratio) tests:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">1. Business Activity Screen</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    The company&apos;s primary business must be halal. Companies with <strong>any</strong> revenue from prohibited activities (alcohol, pork, gambling, conventional banking/insurance, adult entertainment, weapons) are excluded. A tolerance of up to 5% of total revenue from incidental impermissible sources is allowed (e.g., interest on cash deposits).
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">2. Debt Ratio</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    <strong>Total interest-bearing debt / Trailing 12-month average market capitalization &lt; 33%.</strong> This ensures the company is not excessively leveraged with interest-bearing loans. High debt levels indicate reliance on riba (interest), which is prohibited.
                  </p>
                </div>

                <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded">
                  <h3 className="font-bold text-amber-900 mb-2">3. Interest-Bearing Securities Ratio</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    <strong>Interest-bearing securities and deposits / Trailing 12-month average market cap &lt; 33%.</strong> This measures how much of the company&apos;s assets are held in interest-generating instruments like bonds or interest-bearing bank deposits.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
                  <h3 className="font-bold text-purple-900 mb-2">4. Impermissible Income Ratio</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    <strong>Impermissible income / Total revenue &lt; 5%.</strong> This catches any residual haram income from interest, prohibited activities, or other non-compliant sources. Any dividends received must be purified by this same percentage.
                  </p>
                </div>
              </div>
            </section>

            <section id="sectors" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Halal vs. Haram Sectors</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Understanding which sectors are generally permissible helps you narrow down your investment universe before running detailed financial screens.
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Generally Halal Sectors</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Generally Haram Sectors</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Requires Individual Screening</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Technology & Software</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Conventional Banks & Insurance</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Pharmaceuticals</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Healthcare & Medical Devices</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Alcohol & Breweries</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Entertainment & Media</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Halal Food & Agriculture</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Casinos & Gambling</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Restaurants & Hospitality</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Renewable Energy & Utilities</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Pork & Non-Halal Meat</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Real Estate (REITs)</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">E-commerce & Logistics</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Adult Entertainment</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Conglomerates</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Manufacturing & Industrial</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Tobacco</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Consumer Staples</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-gray-700 dark:text-gray-300"><strong className="text-red-600">Important:</strong> Even stocks in &quot;generally halal&quot; sectors must be individually screened for financial ratios. A tech company with 40% debt-to-market-cap ratio would fail the AAOIFI screen despite its halal business activities.</p>
              </div>
            </section>

            <section id="ratios" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Financial Ratio Screening</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Financial ratio screening ensures that even halal businesses are not overly reliant on interest-based financing. Here is a summary of the key thresholds:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Ratio</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">AAOIFI Threshold</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">What It Measures</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Debt Ratio</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">&lt; 33% of market cap</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Reliance on interest-bearing loans</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Interest Securities</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">&lt; 33% of market cap</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Holdings in bonds or interest deposits</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Impermissible Income</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">&lt; 5% of revenue</td>
                      <td className="border border-gray-300 p-3 text-sm dark:border-gray-600">Revenue from haram sources</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                These ratios are calculated using the trailing 12-month average market capitalization, not a single day&apos;s price. This smooths out market volatility and provides a more stable assessment.
              </p>
            </section>

            <section id="purification" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Dividend Purification</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Even Shariah-compliant stocks may have a small amount of impermissible income (up to 5%). As a shareholder, you must &quot;purify&quot; your returns by donating the equivalent percentage to charity.
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside dark:text-gray-300">
                <li><strong>Find the impermissible income ratio.</strong> This is usually provided by Shariah screening services or Barakah&apos;s screener.</li>
                <li><strong>Calculate the impure portion.</strong> Multiply your total dividends (or capital gains) by the impermissible income percentage.</li>
                <li><strong>Donate to charity.</strong> Give that amount away to a charitable cause. This is not considered sadaqah (voluntary charity) or zakat; it is a purification obligation.</li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example: Dividend Purification</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Annual dividends received: <strong>$2,000</strong></p>
                  <p>Company impermissible income ratio: <strong>3.2%</strong></p>
                  <p>Purification amount: $2,000 x 3.2% = <strong>$64</strong></p>
                  <p>Donate $64 to charity (not counted as zakat)</p>
                </div>
              </div>
            </section>

            <section id="screener" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Using Barakah&apos;s Halal Stock Screener</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Barakah provides a built-in Shariah compliance screener that automatically checks stocks against AAOIFI standards. Here is how to use it:
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside dark:text-gray-300">
                <li><strong>Search for any ticker.</strong> Enter a stock symbol (e.g., AAPL, MSFT, TSLA) in the Barakah dashboard.</li>
                <li><strong>View the compliance status.</strong> Barakah displays a clear Halal/Not Halal/Doubtful badge with detailed ratio breakdowns.</li>
                <li><strong>Check the purification ratio.</strong> If the stock is compliant, Barakah shows the exact purification percentage for your dividends.</li>
                <li><strong>Track your portfolio.</strong> Add stocks to your watchlist and get alerts if compliance status changes after quarterly earnings.</li>
              </ol>

              <NisabLivePrices />

              <p className="text-gray-700 leading-relaxed font-semibold bg-yellow-50 border border-yellow-200 p-4 rounded dark:text-gray-300">
                <strong>Tip:</strong> Stock compliance can change every quarter when new financial statements are released. Barakah automatically re-screens your portfolio and notifies you of any status changes. Visit your <Link href="/dashboard" className="text-[#1B5E20] underline">dashboard</Link> to set up alerts.
              </p>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: How do I know if a stock is halal?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  A stock is halal if the company passes both business activity screening (no haram core revenue) and financial ratio screening (debt, interest securities, and impermissible income all below AAOIFI thresholds). Use Barakah&apos;s screener or a Shariah advisory service for accurate, up-to-date screening.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Are tech stocks halal?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Many tech stocks are halal because their core business (software, hardware, services) is permissible. However, each company must still pass the financial ratio screens. A tech company with excessive debt or significant interest income could still fail. Always screen individually.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Are index funds or ETFs halal?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Standard index funds (like the S&P 500) include haram companies such as conventional banks and alcohol producers, so they are not halal. However, Shariah-compliant ETFs exist (such as the SP Funds S&P 500 Sharia ETF, or Wahed Invest funds) that pre-screen all holdings for compliance.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I need to purify dividends from halal stocks?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Yes. Even compliant stocks may earn a small percentage of income from impermissible sources (up to 5%). You must donate that percentage of your dividends to charity. This is a purification, not zakat or sadaqah.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What about cryptocurrency?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  The permissibility of cryptocurrency is debated among scholars. Many consider Bitcoin and Ethereum permissible as digital assets, while others raise concerns about speculation and lack of intrinsic value. If you hold crypto, Barakah can help you calculate zakat on it. See our <Link href="/learn/zakat-on-stocks" className="text-[#1B5E20] underline">zakat on stocks and investments guide</Link> for more details.
                </p>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Screen Any Stock for Shariah Compliance</h2>
              <p className="text-green-100">
                Barakah&apos;s halal stock screener checks AAOIFI compliance in real-time, tracks your portfolio, and calculates purification ratios automatically.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800"
              >
                Open Halal Screener
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/zakat-on-stocks"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Stocks & Investments</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">How to calculate zakat on your stock portfolio, mutual funds, and crypto.</p>
                </Link>
                <Link
                  href="/learn/islamic-finance-basics"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Islamic Finance Basics</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Foundational principles of halal finance, riba, and ethical investing.</p>
                </Link>
              </div>
            </section>

            {/* Author & Update Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last reviewed:</strong> April 2026</p>
              <p className="mt-2">This article is based on AAOIFI Shariah Standard No. 21 on Financial Papers (Shares and Bonds), rulings from the Islamic Fiqh Academy (OIC), and guidance from prominent scholars including Sheikh Yusuf al-Qaradawi and Dr. Muhammad Taqi Usmani on equity investment.</p>
            </footer>
          </article>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/sukuk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sukuk →</Link>
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fiqh-aware household finance for modern Muslim families.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/nisab" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                  <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">Finance 101</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500 dark:text-gray-400 dark:border-gray-700">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
