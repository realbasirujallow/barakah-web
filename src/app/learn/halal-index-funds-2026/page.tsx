import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Index Funds (2026): The Practical Guide for US & UK Investors',
  description:
    'A 2026 guide to Shariah-compliant index funds and ETFs available to retail Muslim investors — what to buy, how to compare expense ratios, purification requirements, and tax-advantaged account fit.',
  keywords: [
    'halal index funds',
    'halal index funds 2026',
    'shariah compliant index funds',
    'islamic etf',
    'halal etf list',
    'halal vanguard alternative',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-index-funds-2026' },
  openGraph: {
    title: 'Halal Index Funds (2026): The Practical Guide',
    description: 'Shariah-compliant index funds and ETFs — what to buy, expense ratios, purification, and 401(k)/ISA fit.',
    url: 'https://trybarakah.com/learn/halal-index-funds-2026',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are halal index funds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Halal index funds are mutual funds or ETFs that track a Shariah-compliant index (such as Dow Jones Islamic, S&P Shariah, or MSCI Islamic). They hold only stocks that pass both a business-activity screen (no alcohol, conventional finance, gambling, adult content, etc.) and an AAOIFI-style financial-ratio screen. They differ from passive S&P 500 funds by excluding non-compliant companies.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which halal index funds are available to US retail investors in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The most widely held US-available halal funds include: SPUS (SP Funds S&P 500 Shariah ETF), HLAL (Wahed FTSE USA Shariah ETF), AMAGX (Amana Growth Fund), AMAGX-G (Amana Growth Institutional), and IMAN (Iman Fund). Each tracks a slightly different index and has different expense ratios — typically 0.49%–1.05%.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I hold halal index funds in a 401(k) or IRA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Most major brokerage IRAs (Fidelity, Schwab, Vanguard) let you buy SPUS, HLAL, and similar ETFs. 401(k) plans depend on the employer's fund menu — many plans don't include halal options, in which case Barakah's halal-401k guide explains your options: rolling over to a self-directed IRA, requesting fund additions, or holding cash equivalents within the 401(k) and a halal IRA outside it.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to purify dividends from halal index funds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — even Shariah-compliant funds typically require small purification (0.5–3% of dividends), because the underlying companies still earn a small amount of interest on cash reserves. The fund manager often publishes a recommended purification ratio annually. Barakah lets you record the purification ratio from your fund's annual disclosure and tracks the cumulative amount owed; verify against your fund's latest filing before donating.",
      },
    },
  ],
};

export default function HalalIndexFundsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }} />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Halal Index Funds (2026)</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Halal Investing Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Halal Index Funds (2026): The Practical Guide</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Shariah-compliant index funds and ETFs available to retail investors — expense ratios, purification, and account-type fit.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>10 min read</span>
                <span>Published: May 2026 • Last updated: May 17, 2026</span>
              </div>
            </header>

            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#what" className="text-[#1B5E20] hover:underline">What makes an index fund halal?</Link></li>
                <li><Link href="#us-funds" className="text-[#1B5E20] hover:underline">US-available halal index funds and ETFs (2026)</Link></li>
                <li><Link href="#uk-funds" className="text-[#1B5E20] hover:underline">UK-available halal funds</Link></li>
                <li><Link href="#compare" className="text-[#1B5E20] hover:underline">How to compare expense ratios</Link></li>
                <li><Link href="#purification" className="text-[#1B5E20] hover:underline">Purification requirements</Link></li>
                <li><Link href="#accounts" className="text-[#1B5E20] hover:underline">401(k), IRA, ISA, TFSA fit</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQ</Link></li>
              </ul>
            </nav>

            <section id="what" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What makes an index fund halal?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A halal index fund tracks an index that has been pre-screened for Shariah compliance. The screening
                process has two stages:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Business-activity screen:</strong> Exclude companies whose primary business is alcohol, conventional finance (banks, insurance), gambling, pork, tobacco, weapons, or adult content.</li>
                <li><strong>AAOIFI financial-ratio screen:</strong> Exclude companies whose interest-bearing debt, interest-bearing securities, or non-permissible revenue exceeds AAOIFI thresholds (30%, 30%, 5% respectively).</li>
              </ol>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The remaining stocks form the Shariah-compliant index. The fund replicates the index by holding those
                stocks in proportion to their weights, and rebalances quarterly when screening results change. See our{' '}
                <Link href="/learn/aaoifi-halal-screening" className="text-[#1B5E20] underline">AAOIFI screening methodology guide</Link>{' '}
                for the full ratio definitions.
              </p>
            </section>

            <section id="us-funds" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">US-available halal index funds and ETFs (2026)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-lg bg-white shadow-sm dark:bg-gray-800">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Ticker</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Fund name</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Type</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Expense ratio</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Tracks</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">SPUS</td><td className="p-3">SP Funds S&amp;P 500 Shariah ETF</td><td className="p-3">ETF</td><td className="p-3">0.49%</td><td className="p-3">S&amp;P 500 Shariah</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">HLAL</td><td className="p-3">Wahed FTSE USA Shariah ETF</td><td className="p-3">ETF</td><td className="p-3">0.50%</td><td className="p-3">FTSE USA Shariah</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">SPRE</td><td className="p-3">SP Funds S&amp;P Global REIT Shariah ETF</td><td className="p-3">ETF</td><td className="p-3">0.69%</td><td className="p-3">Shariah REITs</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">SPSK</td><td className="p-3">SP Funds Dow Jones Global Sukuk ETF</td><td className="p-3">ETF</td><td className="p-3">0.55%</td><td className="p-3">Global sukuk</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">AMAGX</td><td className="p-3">Amana Growth Fund (Investor)</td><td className="p-3">Mutual fund</td><td className="p-3">~0.95%</td><td className="p-3">Actively managed growth</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">AMANX</td><td className="p-3">Amana Income Fund</td><td className="p-3">Mutual fund</td><td className="p-3">~1.04%</td><td className="p-3">Actively managed income</td></tr>
                    <tr><td className="p-3 font-semibold">IMAN</td><td className="p-3">Iman Fund</td><td className="p-3">Mutual fund</td><td className="p-3">~1.05%</td><td className="p-3">Actively managed</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                Expense ratios as of mid-2026; verify on the issuer&apos;s site before buying. AMANX/AMAGX/IMAN are
                actively-managed mutual funds with Shariah mandates; SPUS/HLAL are passive index ETFs.
              </p>
            </section>

            <section id="uk-funds" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">UK-available halal funds</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                UK investors have a smaller but functional set of options:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>HSBC Islamic Global Equity Index Fund</strong> — passive, tracks Dow Jones Islamic Market Titans 100.</li>
                <li><strong>iShares MSCI World Islamic UCITS ETF (ISWD)</strong> — passive global equity exposure.</li>
                <li><strong>iShares MSCI USA Islamic UCITS ETF (ISUS)</strong> — passive US large-cap.</li>
                <li><strong>Wahed Invest UK</strong> — managed halal portfolios with sukuk and equity sleeves.</li>
                <li><strong>Al Rayan</strong> — Islamic bank offering fund products via partner brokers.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                All of the above are eligible for ISA wrappers and most are eligible for SIPPs.
              </p>
            </section>

            <section id="compare" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How to compare expense ratios</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Expense ratios matter more than headline performance. A passive halal ETF at 0.50% will typically beat
                an actively-managed fund at 1.00% over 10+ years, all else equal — even if the active fund slightly
                outperforms gross of fees. Compounded over 30 years on a $100k portfolio, a 0.50% fee difference is roughly
                $40k–$60k less terminal wealth.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Rule of thumb</h3>
                <p className="text-sm text-blue-900">
                  For a core US equity sleeve, start with SPUS or HLAL. Use AMAGX or IMAN if you specifically want active
                  management. Add SPSK (sukuk) for fixed-income exposure and SPRE for REITs once your equity sleeve is
                  sized appropriately.
                </p>
              </div>
            </section>

            <section id="purification" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Purification requirements</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Even fully Shariah-compliant index funds typically require a small annual purification, because the
                underlying companies still earn small amounts of interest on their cash reserves. Most fund issuers
                publish a recommended purification ratio annually:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>SP Funds (SPUS, SPRE, SPSK): typically 0.5%–2% of dividends</li>
                <li>Wahed (HLAL): typically 1%–3% of dividends</li>
                <li>Amana (AMAGX, AMANX): typically 0.5%–1.5%, published annually</li>
              </ul>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Barakah computes purification automatically based on your holdings and the issuer&apos;s latest disclosure.
              </p>
            </section>

            <section id="accounts" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Account-type fit (401(k), IRA, ISA, TFSA)</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>US IRA / Roth IRA:</strong> All major brokerages (Fidelity, Schwab, Vanguard) let you buy SPUS, HLAL, AMAGX. Roth IRA is especially attractive — no purification on tax-free growth.</li>
                <li><strong>US 401(k):</strong> Depends on employer plan menu. See our{' '}
                  <Link href="/learn/halal-401k" className="text-[#1B5E20] underline">halal 401(k) guide</Link>{' '}
                  for what to do if your plan has no halal options.
                </li>
                <li><strong>UK Stocks &amp; Shares ISA:</strong> ISWD, ISUS, HSBC Islamic fund all qualify.</li>
                <li><strong>Canada TFSA / RRSP:</strong> Limited; see our{' '}
                  <Link href="/learn/halal-investing-canada" className="text-[#1B5E20] underline">halal investing Canada guide</Link>.
                </li>
              </ul>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>
              {FaqSchema.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Q: {q.name}</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </section>

            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Track halal ETFs + purification in one place</h2>
              <p className="text-green-100">
                Barakah links your brokerage, calculates purification on every dividend, and re-screens your holdings against AAOIFI thresholds quarterly.
              </p>
              <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Get started free
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/halal-etfs" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal ETFs Overview</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">The broader ETF landscape and why ETFs differ from mutual funds.</p>
                </Link>
                <Link href="/learn/halal-investing-guide" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Investing Complete Guide</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Beginner-to-intermediate walkthrough across asset classes.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
