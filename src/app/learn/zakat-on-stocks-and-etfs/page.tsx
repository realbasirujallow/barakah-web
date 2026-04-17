import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Zakat on Stocks and ETFs 2026 — AAOIFI Method Explained | Barakah',
  description: 'How to calculate zakat on stocks, ETFs, and investment portfolios. The market value method vs AAOIFI zakatable assets method — with worked examples for Apple, S&P 500 ETF.',
  keywords: ['zakat on stocks', 'zakat etf', 'zakat on shares', 'stock zakat calculator', 'zakat on investments', 'aaoifi zakat stocks', 'zakat on portfolio', 'halal stock zakat', 'zakat on 401k stocks', 'calculating zakat investments'],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-stocks-and-etfs' },
  openGraph: {
    title: 'Zakat on Stocks and ETFs 2026 — AAOIFI Method Explained | Barakah',
    description: 'How to calculate zakat on stocks, ETFs, and investment portfolios. The market value method vs AAOIFI zakatable assets method — with worked examples for Apple, S&P 500 ETF.',
    url: 'https://trybarakah.com/learn/zakat-on-stocks-and-etfs',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
      { '@type': 'ListItem', position: 3, name: 'Zakat on Stocks and ETFs', item: 'https://trybarakah.com/learn/zakat-on-stocks-and-etfs' },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Zakat on Stocks and ETFs 2026 — AAOIFI Method Explained',
    description: 'How to calculate zakat on stocks, ETFs, and investment portfolios. The market value method vs AAOIFI zakatable assets method — with worked examples.',
    url: 'https://trybarakah.com/learn/zakat-on-stocks-and-etfs',
    dateModified: '2026-04-15',
    publisher: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I pay zakat on unrealized gains?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Zakat is assessed on the current market value of your portfolio on your hawl date — regardless of whether you have sold the shares or 'realized' the gain. If Apple stock you bought for $10,000 is worth $15,000 on your hawl date, you pay zakat on $15,000. Unrealized gains represent real, accessible wealth that you could sell today — which is exactly what triggers zakat.",
        },
      },
      {
        '@type': 'Question',
        name: "What about stocks in my 401(k) or IRA?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Stocks held inside tax-advantaged retirement accounts (401k, IRA, Roth IRA) are treated differently. Most scholars say apply the accessible value method: subtract estimated taxes and early withdrawal penalties from the account value, then pay 2.5% on the net accessible amount. For a Roth IRA (after-tax contributions), contributions can usually be withdrawn penalty-free — calculate zakat on the full contribution portion plus an AAOIFI-adjusted value of earnings.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate zakat on an ETF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For most ETFs, use Method 1 (market value × 2.5%) unless you have access to zakatable-assets-per-ETF data. For Islamic/halal ETFs (HLAL, UMMA, SPUS), the fund managers sometimes publish the zakatable-assets ratio annually — use that if available. For broad market ETFs (VOO, QQQ), an estimated 15–25% zakatable ratio under AAOIFI is commonly cited by Islamic finance scholars.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Zakat on Stocks and ETFs</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">Zakat on Stocks and ETFs 2026</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 dark:text-gray-300">
            Stocks and ETFs are now among the most common forms of zakatable wealth for Muslim investors in North America and Europe. There is broad scholarly agreement that long-term stock holdings are subject to zakat — the disagreement is about <em>how much</em> of the portfolio value is zakatable. This guide explains both main calculation methods, with worked examples using real companies (Apple, S&amp;P 500 ETF), so you can choose the approach that fits your situation.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Two Scholarly Approaches to Stock Zakat</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Scholars broadly agree: if you hold stocks as long-term investments (not day trading), zakat is due on them. The key disagreement is which portion of the market value is zakatable — because companies hold a mix of assets, not all of which are zakatable under classical fiqh.
            </p>
            <div className="space-y-4 mb-4">
              <div className="border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Method 1 — Market Value (Simple)</h3>
                <p className="text-gray-700 dark:text-gray-300">Pay 2.5% of the total market value of your portfolio on your hawl date. Simple, conservative, and widely recommended for individual investors who cannot easily access company balance sheet data. Some scholars prefer this because it errs on the side of giving more zakat.</p>
              </div>
              <div className="border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Method 2 — Zakatable Assets per Share (AAOIFI Standard 21)</h3>
                <p className="text-gray-700 dark:text-gray-300">Research the underlying zakatable assets of each company (cash, receivables, inventory) per share, multiply by the number of shares you own, and pay 2.5% on that portion. More accurate but requires company financial data. This is the method endorsed by AAOIFI and most Islamic finance institutions globally.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Barakah provides AAOIFI-compliant zakatable asset data for 30,000+ stocks and ETFs — making Method 2 accessible for the first time to retail investors without requiring manual balance sheet analysis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Method 1: The Market Value Approach</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The market value method is straightforward: take your portfolio value on your hawl date, and if it has been above the nisab for one full lunar year, pay 2.5% of that value.
            </p>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <p className="font-semibold mb-2">Example (Apple stock, Method 1):</p>
              <p>Portfolio value on hawl date: $50,000</p>
              <p className="mt-1">Zakat = $50,000 &times; 2.5% = <strong>$1,250</strong></p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              This method is recommended by many contemporary scholars — including AMJA (Assembly of Muslim Jurists of America) — for individual investors who cannot access zakatable-assets-per-share data. It is the conservative choice: you may be paying zakat on fixed assets and goodwill that are technically not zakatable under classical fiqh, but this is considered a safe default.
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Key rule: you assess the market value on your specific hawl date — not a year-end average, not the day you bought the shares. If your hawl date is the 1st of Ramadan, that is the value you use, regardless of what the portfolio was worth in other months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Method 2: AAOIFI Zakatable Assets per Share</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The Accounting and Auditing Organisation for Islamic Financial Institutions (AAOIFI) Standard 21 provides the most rigorous stock zakat formula. The principle: you are a partial owner of the company, so your zakat applies to your proportional share of the company&apos;s zakatable assets only — not its fixed equipment, brand value, or goodwill.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              <strong>The AAOIFI formula per share:</strong>
            </p>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 font-mono text-sm text-gray-800 leading-relaxed dark:bg-gray-800 dark:text-gray-100">
              <p>(Cash + Receivables + Inventory) &divide; Total shares outstanding</p>
              <p className="mt-1">= Zakatable Assets per Share</p>
              <p className="mt-2">&times; Your number of shares</p>
              <p className="mt-1">= Your zakatable portion</p>
              <p className="mt-2">Zakat = Your zakatable portion &times; 2.5%</p>
            </div>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <p className="font-semibold mb-2">Apple (AAPL) example, Method 2 (illustrative):</p>
              <p>Apple Q1 2026 balance sheet (hypothetical): Cash + Receivables = ~$70B, Inventory = ~$7B. Total shares: ~15.3B.</p>
              <p className="mt-1">Zakatable per share = $77B &divide; 15.3B = ~$5.03</p>
              <p className="mt-1">If you hold 200 shares: 200 &times; $5.03 = $1,006 zakatable amount</p>
              <p className="mt-1">Zakat = $1,006 &times; 2.5% = <strong>$25.15</strong></p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">(Compare to Method 1: 200 shares &times; ~$230/share = $46,000 portfolio value &times; 2.5% = $1,150)</p>
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              The difference is significant — this is why method selection matters for larger portfolios. Method 2 is more technically accurate but requires reliable company data. Barakah&apos;s halal stock screener provides pre-calculated AAOIFI zakatable asset ratios for 30,000+ stocks, updated quarterly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">ETF Zakat and Worked Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              ETFs (exchange-traded funds) present an additional layer of complexity because they hold dozens or hundreds of underlying stocks. Here is how to approach them:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-4 dark:text-gray-300">
              <li><strong>Broad market ETFs (VOO, SPY, QQQ):</strong> Under Method 1, apply 2.5% to your full position value. Under Method 2 / AAOIFI analysis, the zakatable portion of a diversified equity ETF is typically estimated at 15–25% of NAV — because most of the underlying value is in fixed assets, goodwill, and brand value, not cash or inventory. Example: $10,000 in VOO — Method 1: $250 zakat; Method 2 at 20% ratio: $10,000 &times; 20% = $2,000 &times; 2.5% = <strong>$50</strong>.</li>
              <li><strong>Islamic / halal ETFs (HLAL, UMMA, SPUS):</strong> Fund managers of some halal ETFs publish an annual zakatable-assets ratio. If available, use it. If not, apply Method 1 as a safe default.</li>
              <li><strong>Sector ETFs (tech, financials, commodities):</strong> The zakatable ratio varies by sector. Technology companies (AAPL, MSFT, GOOGL) tend to have high cash reserves — their zakatable ratio is higher than, say, industrial or real estate holdings.</li>
            </ul>
            <div className="bg-gray-50 border rounded-lg p-5 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <p className="font-semibold mb-2">Quick reference table (AAOIFI estimated zakatable ratios):</p>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pr-4 py-1 font-semibold">Asset Type</th>
                    <th className="py-1 font-semibold">Approx. Zakatable Ratio</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr className="border-b">
                    <td className="pr-4 py-1">Large-cap tech (AAPL, MSFT)</td>
                    <td className="py-1">30–50%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="pr-4 py-1">S&amp;P 500 ETF (VOO, SPY)</td>
                    <td className="py-1">15–25%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="pr-4 py-1">Retail / consumer stocks</td>
                    <td className="py-1">20–35%</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1">Real estate (REITs)</td>
                    <td className="py-1">5–10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  Do I pay zakat on unrealized gains?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  Yes. Zakat is assessed on the current market value of your portfolio on your hawl date — regardless of whether you have sold the shares or &quot;realized&quot; the gain. If Apple stock you bought for $10,000 is worth $15,000 on your hawl date, you pay zakat on $15,000 (under Method 1) or on Apple&apos;s zakatable assets portion of $15,000 (under Method 2). Unrealized gains represent real, accessible wealth that you could sell today — which is exactly what triggers zakat.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  What about stocks in my 401(k) or IRA?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  Stocks held inside tax-advantaged retirement accounts (401k, IRA, Roth IRA) are treated differently from taxable brokerage accounts. Most scholars say to apply the accessible value method: subtract estimated taxes and early withdrawal penalties from the account value, then pay 2.5% on the net accessible amount. For a Roth IRA (after-tax contributions), contributions can usually be withdrawn penalty-free at any time — calculate zakat on the full contribution portion. For 401(k) earnings locked until retirement age, deduct the estimated 10% penalty plus your marginal tax rate before assessing.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  How do I calculate zakat on an ETF?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  For most ETFs, use Method 1 (market value &times; 2.5%) unless you have access to zakatable-assets-per-ETF data. For Islamic/halal ETFs (HLAL, UMMA, SPUS), the fund managers sometimes publish the zakatable-assets ratio annually — use that if available. For broad market ETFs (VOO, QQQ, SPY), an estimated 15–25% zakatable ratio under AAOIFI is commonly cited by contemporary Islamic finance scholars. Barakah&apos;s halal screener provides ETF-level zakatable ratios for the most commonly held funds.
                </div>
              </details>
            </div>
          </section>

          <RamadanEmailCapture source="learn-zakat-on-stocks-and-etfs" variant="inline" />

          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Screen Stocks + Calculate Zakat — Free</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">Barakah&apos;s halal stock screener provides AAOIFI zakatable asset ratios for 30,000+ stocks so you can calculate Method 2 zakat accurately — free for all accounts.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">Screen Stocks + Calculate Zakat — Free</Link>
              <Link href="/dashboard/halal" className="border border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">Open Halal Screener</Link>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/learn/zakat-on-retirement-accounts" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Zakat on Retirement Accounts</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Navigating 401(k), IRA, and Roth IRA zakat obligations.</p>
            </Link>
            <Link href="/learn/halal-stocks" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Halal Stocks Guide</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">How to screen stocks for Shariah compliance.</p>
            </Link>
            <Link href="/learn/halal-investing-guide" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Halal Investing Guide</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Building a Shariah-compliant investment portfolio.</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
