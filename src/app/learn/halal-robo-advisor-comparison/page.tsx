import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Robo-Advisors 2026: Wahed vs Amana vs DIY | Barakah',
  description:
    'Honest comparison of halal robo-advisors in 2026 — Wahed Invest vs Amana Mutual Funds vs DIY. Fees, screening methodology, minimums, custody, and portability.',
  keywords: [
    'halal robo advisor',
    'wahed vs amana',
    'best halal investing app',
    'halal robo advisor comparison',
    'wahed invest review',
    'amana mutual funds review',
    'sharia compliant robo advisor',
    'islamic investing platform',
    'halal etf vs robo',
    'wahed fees',
    'amana fees',
    'diy halal investing',
    'halal portfolio manager',
    'islamic wealth management',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-robo-advisor-comparison' },
  openGraph: {
    title: 'Halal Robo-Advisors 2026 — Wahed vs Amana vs DIY',
    description: 'Real fee comparison, screening methodology, account minimums, custody arrangements, and how easy it is to leave each platform.',
    url: 'https://trybarakah.com/learn/halal-robo-advisor-comparison',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halal Robo-Advisors 2026 — Wahed vs Amana vs DIY',
    description: 'Side-by-side comparison of fees, screening, and custody.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Halal Robo-Advisor Comparison 2026', item: 'https://trybarakah.com/learn/halal-robo-advisor-comparison' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Robo-Advisors 2026: Wahed vs Amana vs DIY',
  description: 'Side-by-side comparison of the leading halal robo-advisors and DIY portfolios in 2026 — fees, methodology, custody, and portability.',
  url: 'https://trybarakah.com/learn/halal-robo-advisor-comparison',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah Team', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function HalalRoboAdvisorComparisonPage() {
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
            <span>Halal Robo-Advisor Comparison 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 11 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Halal Robo-Advisors 2026: Wahed vs Amana vs DIY — An Honest Comparison
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            By 2026 there are three credible paths for halal investing in the United States: a modern robo-advisor (Wahed), a long-standing fund family with an advisor relationship (Amana), or building it yourself with screened ETFs and individual stocks. Each has real strengths and real costs. Here is the side-by-side, with no affiliate spin.
          </p>

          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">📈 Compare brokerage costs honestly</p>
            <p className="text-green-200 text-sm mb-4">Barakah screens whatever you hold, anywhere. Stay where you are — or use this comparison to make an informed move.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Start Free Account →
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Wahed Invest — the modern robo</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Wahed is the most familiar name in the space. They run a robo-advisor experience: you answer a risk questionnaire, get assigned a portfolio across global equities, sukuk, and gold, and they automate rebalancing.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li><strong>Fees:</strong> 0.49% AUM on accounts under $250k, 0.29% above. Plus the underlying ETF expense ratios (HLAL ~0.50%, SPSK ~0.65%) — total drag is roughly 1.0%–1.15%/year on smaller accounts.</li>
            <li><strong>Minimum:</strong> $100 to start, no minimum to maintain.</li>
            <li><strong>Custody:</strong> Apex Clearing holds your assets in your name, SIPC-insured up to $500k.</li>
            <li><strong>Screening:</strong> Wahed&apos;s own Shariah board, anchored on AAOIFI Standard 21, reviewed quarterly.</li>
            <li><strong>Portability:</strong> ACATS-out is supported but the portfolio is built around proprietary ETFs (notably HLAL), so transferring in-kind to Schwab or Fidelity gives you fragmented holdings that need rebalancing.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Amana Mutual Funds (Saturna) — the incumbent</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Amana, run by Saturna Capital, has offered Shariah-compliant mutual funds since 1986. There is no robo overlay — you pick which funds you want and contribute directly, or hold them inside a brokerage account.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li><strong>Fees:</strong> Expense ratios of 0.92% (AMAGX Growth), 0.94% (AMANX Income), 1.05% (AMDWX Developing World). No advisor fee on top — you are paying just the fund.</li>
            <li><strong>Minimum:</strong> $250 to open an Amana direct account, $25 for IRAs.</li>
            <li><strong>Custody:</strong> Held with Saturna or your existing broker. Available on Schwab, Fidelity, Vanguard 401(k) menus on request.</li>
            <li><strong>Screening:</strong> Amana&apos;s methodology is conservative — they apply AAOIFI-aligned screens but reject some companies others accept (e.g. they have historically excluded most semiconductor manufacturers due to debt ratios in cycles where competitors approved them).</li>
            <li><strong>Portability:</strong> Excellent. Funds are widely held and easily transferred between brokers.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">DIY — build your own with ETFs and screened stocks</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The DIY path uses a regular brokerage (Fidelity, Schwab, IBKR) and lets you pick from a growing set of Shariah-compliant ETFs and individually screened stocks. This is increasingly viable in 2026 as the ETF lineup has matured.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li><strong>Core building blocks:</strong> SPUS (S&P 500 Sharia, 0.49% ER), HLAL (FTSE USA Sharia, 0.50% ER), ISWD (MSCI World Islamic, 0.30% ER), SPSK (sukuk ETF, 0.55% ER), SPRE (real estate Sharia, 0.55% ER).</li>
            <li><strong>Fees:</strong> 0.30%–0.55% blended, depending on weights. No platform fee on top if you use a free broker.</li>
            <li><strong>Minimum:</strong> Whatever you can afford — fractional shares supported on most brokers.</li>
            <li><strong>Custody:</strong> Wherever you choose to custody.</li>
            <li><strong>Screening:</strong> Each ETF has its own Shariah board. For individual stocks you need an external screener — Barakah, Zoya, or Musaffa.</li>
            <li><strong>Portability:</strong> Maximum. You hold standard ETFs that any broker accepts.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Side-by-side at a glance</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300"></th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Wahed</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Amana</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">DIY ETFs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr><td className="p-3 font-medium">All-in cost</td><td className="p-3">~1.0%</td><td className="p-3">~0.95%</td><td className="p-3">~0.40%</td></tr>
                <tr><td className="p-3 font-medium">Minimum</td><td className="p-3">$100</td><td className="p-3">$250</td><td className="p-3">~$1</td></tr>
                <tr><td className="p-3 font-medium">Auto-rebalance</td><td className="p-3">Yes</td><td className="p-3">No</td><td className="p-3">No</td></tr>
                <tr><td className="p-3 font-medium">Tax-loss harvesting</td><td className="p-3">No</td><td className="p-3">No</td><td className="p-3">Manual</td></tr>
                <tr><td className="p-3 font-medium">Portability</td><td className="p-3">Medium</td><td className="p-3">High</td><td className="p-3">Maximum</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Which one is right for you?</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Wahed</strong> is best if you value a single-app experience, automatic rebalancing, and don&apos;t want to think about asset allocation. The fee drag matters less when balances are small but compounds painfully on six- and seven-figure accounts.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Amana</strong> is best if you want active management and a Shariah board with deep institutional history, and you&apos;re willing to pay roughly 1% for it. Particularly compelling inside an IRA or 401(k) where it&apos;s commonly available.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            <strong>DIY ETFs</strong> wins on cost and flexibility. If you can manage a 4-line spreadsheet to rebalance once a year, you can save 50–60 basis points annually — which on a $100k portfolio over 30 years compounds to roughly $40k of foregone fees.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <h3 className="font-bold text-amber-900 mb-2">Bottom line</h3>
            <p className="text-sm text-amber-900 mb-2">
              For accounts under $25k, the difference between Wahed, Amana, and DIY is largely a UX preference. Above $100k, the all-in cost matters: DIY ETFs at ~0.40% beats Wahed and Amana at ~1% by a wide margin over decades. None of these is wrong — pick the one you will actually contribute to consistently. Use Barakah as a free overlay to verify your holdings against AAOIFI Standard 21 regardless of which platform you pick.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related reading</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/compare/barakah-vs-wahed', title: 'Barakah vs Wahed', desc: 'Detailed comparison with Wahed Invest.' },
                { href: '/learn/halal-etfs', title: 'Halal ETFs Explained', desc: 'Every Shariah-compliant ETF available in 2026.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'AAOIFI Standard 21 from first principles.' },
                { href: '/learn/is-my-401k-halal', title: 'Is My 401(k) Halal?', desc: 'How to apply this to your retirement plan.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Verify any portfolio in seconds</h2>
            <p className="text-green-200 mb-6">Use Barakah&apos;s free screener to verify your holdings — no matter which platform you use.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Start Free →
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
