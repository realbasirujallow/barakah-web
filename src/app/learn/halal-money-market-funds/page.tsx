import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Money Market Funds (2026): Sukuk-Based Liquidity Alternatives',
  description:
    'Halal alternatives to conventional money-market funds — sukuk-based liquidity products, expected returns, risks, and how to hold them inside a brokerage or IRA.',
  keywords: [
    'halal money market fund',
    'sukuk fund',
    'islamic money market',
    'halal hysa alternative',
    'shariah liquidity fund',
    'spsk halal',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-money-market-funds' },
  openGraph: {
    title: 'Halal Money Market Funds (2026)',
    description: 'Sukuk-based liquidity products as a halal alternative to conventional money-market funds.',
    url: 'https://trybarakah.com/learn/halal-money-market-funds',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are conventional money-market funds halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. Conventional money-market funds hold short-term debt instruments — Treasury bills, commercial paper, certificates of deposit — that pay interest. Both the underlying instruments and the fund's distributions are riba-based, so they are not permissible.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the halal alternative to a money-market fund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sukuk-based funds. Sukuk are Shariah-compliant certificates representing ownership in real assets (infrastructure projects, leased equipment, real estate). The holder receives a share of the asset's rental or revenue stream rather than interest on a loan. Short-duration sukuk funds (1-3 year average maturity) function similarly to conventional money-market funds for liquidity purposes.",
      },
    },
    {
      '@type': 'Question',
      name: 'What sukuk-based funds are available to retail investors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In the US: SPSK (SP Funds Dow Jones Global Sukuk ETF) is one of the more retail-accessible options — NASDAQ-listed, holds roughly 50 sukuk issuances globally, expense ratio around 0.55% as of the issuer's most recent factsheet. In the UK: ASUSF (Sharia US Sukuk Fund) and several iShares sukuk products. Several Islamic banks also offer sukuk-based deposit accounts via partner platforms. Verify availability, fees, and prospectus on the issuer's site before investing.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are sukuk funds as safe as money-market funds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Different risk profile. Sukuk funds have credit risk (the issuer might default on the underlying revenue), duration risk (price moves with rates), and liquidity risk (less developed secondary market than US Treasuries). They are not insured. Money-market funds investing in T-bills are generally considered lower-risk than sukuk funds, but a sukuk fund holding investment-grade sovereign and corporate sukuk is reasonable for short-term cash allocations.",
      },
    },
  ],
};

export default function HalalMoneyMarketFundsPage() {
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
              <span className="text-[#1B5E20] font-medium">Halal Money Market Funds</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Halal Investing Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Halal Money Market Funds (2026)</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Sukuk-based liquidity products as a Shariah-compliant alternative to conventional money-market funds.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>8 min read</span>
                <span>Published: May 2026 • Last updated: May 17, 2026</span>
              </div>
            </header>

            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#why-not" className="text-[#1B5E20] hover:underline">Why conventional money-market funds aren&apos;t halal</Link></li>
                <li><Link href="#what" className="text-[#1B5E20] hover:underline">What sukuk funds hold instead</Link></li>
                <li><Link href="#funds" className="text-[#1B5E20] hover:underline">Available halal money-market alternatives (2026)</Link></li>
                <li><Link href="#risks" className="text-[#1B5E20] hover:underline">Risks and what to watch</Link></li>
                <li><Link href="#how-to-use" className="text-[#1B5E20] hover:underline">How to use them in a cash allocation</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQ</Link></li>
              </ul>
            </nav>

            <section id="why-not" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Why conventional money-market funds aren&apos;t halal</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A conventional money-market fund holds short-duration debt instruments — US Treasury bills, agency
                discount notes, commercial paper, repurchase agreements, certificates of deposit. All of these pay{' '}
                <Link href="/fiqh-terms/riba" className="text-[#1B5E20] underline">riba</Link>. The fund&apos;s dividends are
                effectively pass-through interest. Both the underlying instruments and the distribution to you are
                impermissible under Shariah.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                This includes products like SPAXX (Fidelity), VMFXX (Vanguard), and SWVXX (Schwab) — all popular cash sweeps
                in conventional brokerage accounts. If your brokerage automatically sweeps idle cash into a money-market
                fund, switch the sweep to a non-interest-bearing option (FCASH at Fidelity, for example) and allocate cash
                manually instead.
              </p>
            </section>

            <section id="what" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What sukuk funds hold instead</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <Link href="/fiqh-terms/sukuk" className="text-[#1B5E20] underline">Sukuk</Link> are
                Shariah-compliant investment certificates structured as fractional ownership in a real asset (a building,
                an infrastructure project, an equipment lease). The holder receives a share of the rental or revenue stream
                rather than interest on a loan. Sukuk funds typically hold:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Sovereign sukuk from countries that issue Shariah-compliant debt (Saudi Arabia, Indonesia, Malaysia, UAE, Turkey, UK)</li>
                <li>Corporate sukuk from major issuers (financials, telecoms, real-estate developers)</li>
                <li>Multilateral sukuk from organizations like the Islamic Development Bank</li>
              </ul>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Short-duration sukuk funds (average maturity 1–3 years) function similarly to conventional money-market
                funds for liquidity purposes, though the price is more sensitive to rate moves than a true 30-day money fund.
              </p>
            </section>

            <section id="funds" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Available halal money-market alternatives (2026)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-lg bg-white shadow-sm dark:bg-gray-800">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Ticker / Name</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Type</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Region</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Expense</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Use case</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">SPSK</td><td className="p-3">Sukuk ETF</td><td className="p-3">US-listed, global holdings</td><td className="p-3">0.55%</td><td className="p-3">Core sukuk allocation</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Islamic-bank mudaraba savings</td><td className="p-3">Profit-sharing deposit</td><td className="p-3">US (UIF, Lariba)</td><td className="p-3">N/A</td><td className="p-3">FDIC-insured cash sleeve</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">FCASH (cash sweep)</td><td className="p-3">Custody, no interest</td><td className="p-3">US (Fidelity)</td><td className="p-3">N/A</td><td className="p-3">Idle cash without riba</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">ASUSF</td><td className="p-3">Sukuk fund</td><td className="p-3">UK-domiciled</td><td className="p-3">~0.65%</td><td className="p-3">UK SIPP / ISA</td></tr>
                    <tr><td className="p-3 font-semibold">Al Rayan Notice Account</td><td className="p-3">Profit-sharing deposit</td><td className="p-3">UK</td><td className="p-3">N/A</td><td className="p-3">FSCS-insured cash sleeve</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                Expense ratios as of mid-2026; verify current rates and policies before allocating. Fund availability
                varies by brokerage.
              </p>
            </section>

            <section id="risks" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Risks and what to watch</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Duration risk:</strong> Sukuk fund prices fall when long-term rates rise. Short-duration sukuk funds (1–3 yr avg) limit this.</li>
                <li><strong>Credit risk:</strong> Sovereign sukuk from emerging-market issuers can default. Check the fund&apos;s credit-quality breakdown.</li>
                <li><strong>Liquidity risk:</strong> The sukuk secondary market is smaller than the US Treasury market. Spreads can widen in stress.</li>
                <li><strong>Currency risk:</strong> Many sukuk are USD-denominated but some are in MYR, IDR, SAR, etc. Check the fund&apos;s hedging policy.</li>
                <li><strong>Not FDIC/FSCS insured:</strong> Sukuk funds are securities, not deposits. SIPC protects against broker failure but not market loss.</li>
              </ul>
            </section>

            <section id="how-to-use" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How to use sukuk funds in a cash allocation</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A practical structure for cash that isn&apos;t earmarked for immediate spending:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>1 month of expenses</strong> in no-interest checking (FDIC-insured).</li>
                <li><strong>3–6 months emergency fund</strong> in Islamic-bank profit-sharing account (FDIC-insured).</li>
                <li><strong>Sinking funds (1–3 year horizon)</strong> in SPSK or similar short-duration sukuk fund.</li>
                <li><strong>Long-term growth (5+ year horizon)</strong> in halal index funds and ETFs — see our{' '}
                  <Link href="/learn/halal-index-funds-2026" className="text-[#1B5E20] underline">halal index funds guide</Link>.</li>
              </ol>
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
              <h2 className="text-2xl font-bold">Track sukuk and cash sleeves in one dashboard</h2>
              <p className="text-green-100">
                Barakah unifies your no-interest checking, profit-sharing accounts, and sukuk holdings — and computes zakat across the whole picture.
              </p>
              <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Get started free
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/halal-savings-account-usa" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Savings Accounts (USA)</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Specific cash options for American Muslims in 2026.</p>
                </Link>
                <Link href="/learn/halal-emergency-fund-methodology" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Emergency Fund Methodology</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">How to size and structure an emergency fund without earning interest.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
