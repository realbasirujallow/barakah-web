import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Halal ETFs 2026: SPUS, HLAL, IGDA & Shariah-Compliant Funds | Barakah',
  description:
    'Compare the top halal ETFs available to US and UK Muslim investors in 2026: SPUS, HLAL, IGDA, and more. AAOIFI methodology, expense ratios, and how they fit into your zakat-aware portfolio.',
  keywords: [
    'halal etfs',
    'shariah compliant etf',
    'best halal etf 2026',
    'spus halal etf',
    'hlal halal etf',
    'igda halal etf',
    'halal index fund',
    'halal 401k fund options',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/halal-etfs',
  },
  openGraph: {
    title: 'Best Halal ETFs 2026: SPUS, HLAL, IGDA & Shariah-Compliant Funds | Barakah',
    description: 'Compare the top halal ETFs available to US and UK Muslim investors in 2026.',
    url: 'https://trybarakah.com/learn/halal-etfs',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What makes an ETF halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A halal (Shariah-compliant) ETF is one whose underlying holdings have been screened against Islamic investment rules: no more than ~5% of revenue from prohibited industries (alcohol, gambling, conventional banking, adult entertainment, pork-related, weapons manufacturing), interest-bearing debt below 33% of market cap, and liquid assets plus receivables below 33–45% of total assets depending on the standard. The major Shariah screening standards are AAOIFI (global) and the Dow Jones Islamic Market methodology. ETFs that meet these criteria and have ongoing scholar-board oversight are considered halal.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which halal ETF is best for a US investor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no single best — it depends on your diversification and expense-ratio tolerance. SPUS (SP Funds S&P 500 Sharia Industry Exclusions) and HLAL (Wahed FTSE USA Shariah) are the two most-held US-listed halal ETFs with deep liquidity and sub-0.50% expense ratios. UMMA (Wahed Dow Jones Islamic World) and KWIN (Wahed-branded international) add global exposure. IGDA (IdealRatings US Equity) and SPSK (SP Funds Dow Jones Global Sukuk) add sukuk exposure for fixed-income allocations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay zakat on halal ETFs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Halal ETFs are zakatable wealth. The majority scholarly view applies zakat to the full market value of ETFs held for investment (the simpler approach). A minority view applies zakat only to the proportional share of zakatable underlying assets (cash, inventory, receivables), exempting the proportional share of non-zakatable holdings (fixed property, equipment). Both views are supported; AAOIFI documents both. See our zakat-on-stocks guide for the full breakdown.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I buy halal ETFs in a 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Usually not directly — most 401(k) plans offer a fixed menu of mutual funds selected by your employer. You can request halal funds be added (ShariaPortfolio, Amana, and Guidestone manage retirement-plan-accessible halal funds) or roll over to an IRA where you have full brokerage access to SPUS, HLAL, UMMA, IGDA, and others. See our dedicated /learn/halal-401k guide for a copy-ready email template you can send HR.",
      },
    },
  ],
};

const etfs = [
  {
    ticker: 'SPUS',
    name: 'SP Funds S&P 500 Sharia Industry Exclusions ETF',
    issuer: 'SP Funds / State Street',
    expense: '0.49%',
    auM: '~$500M+ (2026 est)',
    holdings: 'S&P 500 filtered for Shariah compliance',
    screening: 'Dow Jones Islamic Market + S&P Shariah + ongoing scholar review',
    standout: 'Largest US-listed halal ETF. Best core US equity exposure for halal investors.',
  },
  {
    ticker: 'HLAL',
    name: 'Wahed FTSE USA Shariah ETF',
    issuer: 'Wahed Invest',
    expense: '0.50%',
    auM: '~$200M+ (2026 est)',
    holdings: 'FTSE Shariah-compliant US large-cap',
    screening: 'FTSE Russell Shariah methodology + Amanie Advisors',
    standout: "Wahed's own US equity ETF. Slightly broader than SPUS on mid-cap exposure.",
  },
  {
    ticker: 'UMMA',
    name: 'Wahed Dow Jones Islamic World ETF',
    issuer: 'Wahed Invest',
    expense: '0.65%',
    auM: '~$50M (2026 est)',
    holdings: 'Dow Jones Islamic Market World',
    screening: 'DJIM + Amanie Advisors',
    standout: 'International equity exposure in one ETF. Higher expense but only halal option for broad global developed-market.',
  },
  {
    ticker: 'IGDA',
    name: 'Impact Shares IdealRatings Shariah ETF',
    issuer: 'Impact Shares',
    expense: '0.75%',
    auM: 'Smaller than HLAL/SPUS',
    holdings: 'IdealRatings screened universe',
    screening: 'IdealRatings (B2B Shariah data provider)',
    standout: 'Alternative US equity exposure for investors who want IdealRatings methodology specifically.',
  },
  {
    ticker: 'SPSK',
    name: 'SP Funds Dow Jones Global Sukuk ETF',
    issuer: 'SP Funds / State Street',
    expense: '0.55%',
    auM: '~$100M+ (2026 est)',
    holdings: 'Global sukuk (Islamic fixed income)',
    screening: 'DJ Sukuk Index',
    standout: 'Only accessible halal "fixed-income" exposure for US retail. Sukuk replace conventional bonds in a halal portfolio.',
  },
];

export default function HalalEtfsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Halal ETFs</span>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
              Best Halal ETFs 2026 — A Shariah-Compliant Portfolio Builder&apos;s Guide
            </h1>
            <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

            <p className="text-lg leading-8 text-gray-800 mb-6">
              Halal ETFs solve the hardest problem in Muslim investing: how to stay diversified
              and fiqh-compliant without building a 50-ticker portfolio by hand. This guide
              compares the five halal ETFs that matter in 2026 — SPUS, HLAL, UMMA, IGDA, and SPSK
              — and shows how to stitch them into a portfolio that fits both your risk profile
              and your zakat obligation.
            </p>

            {/* Comparison table */}
            <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">The 2026 halal ETF lineup</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="py-2 pr-3 font-semibold text-gray-700">Ticker</th>
                    <th className="py-2 pr-3 font-semibold text-gray-700">Name</th>
                    <th className="py-2 pr-3 font-semibold text-gray-700">Expense</th>
                    <th className="py-2 pr-3 font-semibold text-gray-700">Holdings</th>
                    <th className="py-2 font-semibold text-gray-700">Standout</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {etfs.map((etf) => (
                    <tr key={etf.ticker} className="border-b border-gray-100">
                      <td className="py-3 pr-3 font-bold text-[#1B5E20]">{etf.ticker}</td>
                      <td className="py-3 pr-3">{etf.name}</td>
                      <td className="py-3 pr-3">{etf.expense}</td>
                      <td className="py-3 pr-3 text-xs">{etf.holdings}</td>
                      <td className="py-3 text-xs">{etf.standout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs italic text-gray-600">
                AUM figures are rough 2026 estimates — verify on your brokerage&apos;s fund page
                before building a large position. Expense ratios are published rates.
              </p>
            </section>

            {/* How to build a portfolio */}
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">
                How to build a halal portfolio with these ETFs
              </h2>
              <p className="mb-4 text-base leading-7 text-gray-800">
                A typical halal portfolio allocation for a long-horizon investor:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Growth-tilted (30s–40s)</h3>
                  <ul className="space-y-1 text-sm text-gray-800">
                    <li>• 50% SPUS — US large-cap halal</li>
                    <li>• 30% UMMA — international halal</li>
                    <li>• 15% SPSK — sukuk (Islamic fixed income)</li>
                    <li>• 5% cash / emergency fund</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Balanced (50s)</h3>
                  <ul className="space-y-1 text-sm text-gray-800">
                    <li>• 35% HLAL — US large-cap halal</li>
                    <li>• 25% UMMA — international halal</li>
                    <li>• 30% SPSK — sukuk</li>
                    <li>• 10% cash / gold</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm italic text-gray-700">
                These are examples, not financial advice. Your allocation should reflect your
                horizon, dependents, income stability, and personal risk tolerance. Barakah tracks
                your portfolio&apos;s halal compliance + zakat obligation in one place — link your
                brokerage via Plaid.
              </p>
            </section>

            {/* Zakat on ETFs */}
            <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">
                How zakat works on halal ETFs
              </h2>
              <p className="mb-3 text-base leading-7 text-gray-800">
                ETF shares are zakatable wealth. Two scholarly positions:
              </p>
              <ol className="list-decimal space-y-3 pl-6 text-sm leading-7 text-gray-800">
                <li>
                  <strong>Full market value (majority view):</strong> zakat is 2.5% of the
                  current market value of your ETF position on your hawl anniversary. Simpler. Higher
                  zakat amount. Endorsed by AMJA, ISNA, most contemporary Hanafi and Shafi&apos;i
                  fatawa.
                </li>
                <li>
                  <strong>Proportional asset look-through (minority view):</strong> zakat only on
                  the proportional share of zakatable underlying assets (cash, inventory,
                  receivables), exempting the proportional share of non-zakatable holdings (fixed
                  property, equipment, intellectual property). Requires you to look up the fund&apos;s
                  balance sheet. Lower zakat amount. Endorsed by AAOIFI Standard 35 for trade-and-investment
                  distinction.
                </li>
              </ol>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                Barakah defaults to the majority full-market-value position (simpler, more
                pro-obligation) but shows both calculations on the zakat dashboard. See{' '}
                <Link href="/learn/zakat-on-stocks" className="text-[#1B5E20] underline hover:no-underline">
                  zakat on stocks
                </Link>{' '}
                for the full mechanics.
              </p>
            </section>

            {/* 401k CTA */}
            <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
              <h2 className="mb-2 text-xl font-bold text-amber-900">401(k) user? Read this first</h2>
              <p className="text-sm leading-7 text-amber-900">
                Most 401(k) plans don&apos;t offer SPUS, HLAL, UMMA, or IGDA directly — they
                restrict you to their curated menu. Your options: (1) ask HR to add halal funds
                (ShariaPortfolio manages 401k-accessible halal options), (2) roll over vested
                  balances to an IRA where you have full brokerage access, or (3) contribute just
                  enough to capture any employer match and invest the rest in an IRA. Our{' '}
                  <Link href="/learn/halal-401k" className="font-semibold text-amber-900 underline hover:no-underline">
                    halal 401(k) guide
                  </Link>{' '}
                  includes a copy-ready template email to send HR.
                </p>
              </section>

            {/* Related */}
            <section className="mb-10 rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-4 text-2xl font-bold">Related guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/learn/halal-stocks" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Halal stocks →</strong>
                  <p className="mt-1 text-sm text-green-100">Individual stock screening and AAOIFI ratios.</p>
                </Link>
                <Link href="/learn/halal-investing-guide" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Halal investing guide →</strong>
                  <p className="mt-1 text-sm text-green-100">The complete Muslim investor&apos;s playbook.</p>
                </Link>
                <Link href="/learn/zakat-on-stocks" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Zakat on stocks →</strong>
                  <p className="mt-1 text-sm text-green-100">How zakat works on equity holdings.</p>
                </Link>
                <Link href="/learn/halal-stock-screener" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Halal stock screener →</strong>
                  <p className="mt-1 text-sm text-green-100">Barakah&apos;s 30k+ stock screener.</p>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
