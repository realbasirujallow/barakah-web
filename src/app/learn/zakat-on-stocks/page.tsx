import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices, { GoldNisabUSD, SilverNisabUSD } from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Zakat on Stocks & Investments: How to Calculate in 2026 | Barakah',
  description: 'Complete guide to calculating zakat on stocks, mutual funds, ETFs, and cryptocurrency. Learn the market value method, net asset method, and when zakat is due on investments.',
  keywords: ['zakat on stocks', 'zakat on investments', 'zakat on mutual funds', 'zakat on cryptocurrency', 'zakat on ETF', 'zakat on shares', 'investment zakat calculation'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/zakat-on-stocks',
  },
  openGraph: {
    title: 'Zakat on Stocks & Investments: How to Calculate in 2026 | Barakah',
    description: 'How to calculate zakat on stocks, mutual funds, ETFs, and crypto using market value and net asset methods.',
    url: 'https://trybarakah.com/learn/zakat-on-stocks',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate zakat on stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There are two methods: (1) Market Value Method - multiply the current market value of all your shares by 2.5%. This is simpler and recommended for most investors. (2) Net Asset Method - calculate your proportional share of the company\'s zakatable assets (cash, receivables, inventory) minus liabilities, then apply 2.5%. This method is used by long-term investors who view stocks as business ownership.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is zakat due on stocks I hold for long-term investment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Whether you are a day trader or a long-term investor, zakat is due on your stock holdings if they meet the nisab threshold and you have held them for one lunar year. The calculation method may differ (market value for traders, net asset for long-term holders), but both require annual zakat payment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay zakat on cryptocurrency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most contemporary scholars who consider cryptocurrency permissible hold that zakat is due on crypto holdings at their current market value, similar to stocks held for trading. Calculate 2.5% of the market value on your zakat due date. If you mine or stake crypto, the income is also zakatable.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is my zakat due date for stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat on stocks is due after holding wealth above the nisab for one complete lunar year (hawl). Many Muslims choose a fixed annual date (such as Ramadan 1st) and calculate zakat on all their assets on that date. Use the market value of your stocks on your chosen zakat date.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay zakat on stocks that lost value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You pay zakat on the current market value of your stocks, not what you originally paid. If a stock has dropped in value, your zakat is calculated on the lower current price. If your total portfolio is below the nisab threshold, no zakat is due.',
      },
    },
  ],
};

export default function ZakatOnStocksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
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
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Zakat on Stocks</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Zakat on Stocks & Investments: How to Calculate in 2026</h1>
              <p className="text-lg text-gray-700">A comprehensive guide to calculating zakat on stocks, mutual funds, ETFs, and cryptocurrency using the market value and net asset methods, with worked examples.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <span>By Barakah Editorial Team</span>
                <span>11 min read</span>
                <span>Published: April 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#overview" className="text-[#1B5E20] hover:underline">Are Stocks Zakatable?</Link></li>
                <li><Link href="#market-value" className="text-[#1B5E20] hover:underline">Method 1: Market Value Method</Link></li>
                <li><Link href="#net-asset" className="text-[#1B5E20] hover:underline">Method 2: Net Asset Method</Link></li>
                <li><Link href="#which-method" className="text-[#1B5E20] hover:underline">Which Method Should You Use?</Link></li>
                <li><Link href="#mutual-funds" className="text-[#1B5E20] hover:underline">Zakat on Mutual Funds & ETFs</Link></li>
                <li><Link href="#crypto" className="text-[#1B5E20] hover:underline">Zakat on Cryptocurrency</Link></li>
                <li><Link href="#examples" className="text-[#1B5E20] hover:underline">Worked Examples</Link></li>
                <li><Link href="#mistakes" className="text-[#1B5E20] hover:underline">Common Mistakes</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">Frequently Asked Questions</Link></li>
              </ul>
            </nav>

            {/* Main Content */}
            <section id="overview" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Are Stocks Zakatable?</h2>
              <p className="text-gray-700 leading-relaxed">
                Yes. Stocks, mutual funds, ETFs, and other investment holdings are subject to zakat. When you own shares in a company, you own a portion of that company&apos;s assets and business. Since those assets include zakatable wealth (cash, inventory, receivables), your shares carry a zakat obligation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The key requirement is that the total value of your investment portfolio (combined with your other zakatable assets like cash and gold) must meet the nisab threshold. The current gold-based nisab is approximately <GoldNisabUSD />, and the silver-based nisab is approximately <SilverNisabUSD />.
              </p>
              <NisabLivePrices />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Scholarly Basis</h3>
                <p className="text-blue-900 text-sm">
                  The Islamic Fiqh Academy (OIC), AMJA, and the majority of contemporary scholars agree that stocks are zakatable. The basis is the general obligation of zakat on wealth that grows (al-mal al-nami), as stated in the Quran (9:103) and numerous hadith. Stocks represent ownership in productive assets, which clearly falls under this category.
                </p>
              </div>
            </section>

            <section id="market-value" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Method 1: Market Value Method</h2>
              <p className="text-gray-700 leading-relaxed">
                The market value method is the simplest and most commonly recommended approach. It treats your stock holdings like trade goods (urood at-tijarah) and calculates zakat on the full market value.
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li><strong>Determine your zakat date.</strong> Choose a fixed date each year (many use Ramadan 1st).</li>
                <li><strong>Look up the market value.</strong> Check the closing price of each stock on your zakat date.</li>
                <li><strong>Calculate total value.</strong> Multiply shares owned by the price per share for each holding, then sum everything.</li>
                <li><strong>Apply 2.5%.</strong> Multiply the total market value by 0.025 to get zakat due.</li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example: Market Value Method</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>100 shares of Company A @ $150 = <strong>$15,000</strong></p>
                  <p>50 shares of Company B @ $300 = <strong>$15,000</strong></p>
                  <p>200 shares of Company C @ $45 = <strong>$9,000</strong></p>
                  <p>Total portfolio value: <strong>$39,000</strong></p>
                  <p>Zakat due: $39,000 x 2.5% = <strong>$975</strong></p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                This method is recommended by AMJA and most contemporary scholars for investors who actively trade or intend to sell their stocks. It is analogous to zakat on merchandise held for trade.
              </p>
            </section>

            <section id="net-asset" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Method 2: Net Asset Method</h2>
              <p className="text-gray-700 leading-relaxed">
                The net asset method treats your shares as ownership in a business rather than trade goods. Under this approach, you calculate zakat only on your proportional share of the company&apos;s zakatable assets (cash, receivables, inventory), not on non-zakatable assets like buildings, equipment, or intellectual property.
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li><strong>Find the company&apos;s zakatable assets.</strong> These include cash, accounts receivable, inventory, and short-term investments.</li>
                <li><strong>Subtract current liabilities.</strong> Deduct the company&apos;s short-term debts from the zakatable assets.</li>
                <li><strong>Calculate your proportional share.</strong> Divide your shares by total shares outstanding to get your ownership percentage.</li>
                <li><strong>Apply 2.5%.</strong> Multiply your proportional share of net zakatable assets by 0.025.</li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example: Net Asset Method</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Company total zakatable assets: <strong>$5 billion</strong></p>
                  <p>Company current liabilities: <strong>$2 billion</strong></p>
                  <p>Net zakatable assets: <strong>$3 billion</strong></p>
                  <p>Total shares outstanding: <strong>1 billion</strong></p>
                  <p>Your shares: <strong>1,000</strong></p>
                  <p>Your share of net zakatable assets: 1,000 / 1B x $3B = <strong>$3,000</strong></p>
                  <p>Zakat due: $3,000 x 2.5% = <strong>$75</strong></p>
                </div>
                <p className="text-xs text-amber-700 mt-3">Note: This method typically produces a lower zakat amount than the market value method.</p>
              </div>
            </section>

            <section id="which-method" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Which Method Should You Use?</h2>
              <p className="text-gray-700 leading-relaxed">
                The correct method depends on your investment intent:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Use Market Value Method If:</h3>
                  <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                    <li>You bought stocks with the intention of selling for profit (trading)</li>
                    <li>You actively manage and rebalance your portfolio</li>
                    <li>You invest in index funds or ETFs</li>
                    <li>You want the simpler, more cautious approach</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Use Net Asset Method If:</h3>
                  <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                    <li>You are a long-term investor who views stocks as business ownership</li>
                    <li>You hold stocks primarily for dividends, not capital gains</li>
                    <li>You have significant holdings in a single company (e.g., employee stock)</li>
                    <li>You follow scholars who categorize stocks as business assets, not trade goods</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed font-semibold bg-yellow-50 border border-yellow-200 p-4 rounded">
                <strong>Barakah&apos;s default:</strong> Barakah uses the market value method by default, as it is simpler and the majority scholarly recommendation. You can switch to the net asset method in your <Link href="/dashboard" className="text-[#1B5E20] underline">dashboard settings</Link>.
              </p>
            </section>

            <section id="mutual-funds" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat on Mutual Funds & ETFs</h2>
              <p className="text-gray-700 leading-relaxed">
                Mutual funds and ETFs are collections of stocks, bonds, and other assets bundled together. For zakat purposes:
              </p>
              <ul className="space-y-3 text-gray-700 list-disc list-inside">
                <li><strong>Shariah-compliant funds:</strong> Calculate zakat on the full market value of your fund units (market value method) or request the fund&apos;s zakat-per-unit figure if available.</li>
                <li><strong>Conventional funds:</strong> If you hold conventional mutual funds or ETFs (which may contain non-compliant holdings), calculate zakat on the full market value. You should also consider purifying your returns from any haram holdings.</li>
                <li><strong>Bond funds:</strong> Bonds are debt instruments. If you hold bond funds, the principal amount is zakatable. Interest income is impermissible and should be purified (donated to charity without expecting reward).</li>
              </ul>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Tip for Fund Investors</h3>
                <p className="text-gray-700 text-sm">
                  Many Shariah-compliant fund providers (such as Wahed Invest, Azzad Asset Management, and SP Funds) publish an annual zakat-per-unit figure. This makes calculating zakat straightforward: simply multiply the number of units you hold by the zakat-per-unit amount.
                </p>
              </div>
            </section>

            <section id="crypto" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat on Cryptocurrency</h2>
              <p className="text-gray-700 leading-relaxed">
                Cryptocurrency is a rapidly evolving area of Islamic finance. While scholars debate the permissibility of crypto itself, the majority of those who consider it permissible agree that zakat applies:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Crypto Held for Trading</h3>
                  <p className="text-gray-700 text-sm">
                    If you buy and sell cryptocurrency for profit (similar to stocks), zakat is due on the <strong>full market value</strong> on your zakat date. This applies to Bitcoin, Ethereum, and all other tokens held with trading intent.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Crypto Held as Currency</h3>
                  <p className="text-gray-700 text-sm">
                    If you use cryptocurrency as a medium of exchange (like cash), it is treated like cash savings. Zakat is due on the market value in your local currency on your zakat date, at the standard 2.5% rate.
                  </p>
                </div>

                <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded">
                  <h3 className="font-bold text-amber-900 mb-2">Staking & Mining Rewards</h3>
                  <p className="text-gray-700 text-sm">
                    Income from staking or mining is treated like business income. It becomes zakatable once received and added to your total wealth. Some scholars compare mining to agricultural produce, but the majority treat it as regular income for zakat purposes.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Note on Volatility</h3>
                <p className="text-blue-900 text-sm">
                  Cryptocurrency prices are highly volatile. Use the market price on your specific zakat date, not a daily average or historical high. If your crypto drops below nisab before your zakat date, the lunar year counter resets. Barakah&apos;s <Link href="/zakat-calculator" className="underline font-semibold">zakat calculator</Link> can track your crypto holdings and calculate zakat automatically.
                </p>
              </div>
            </section>

            <section id="examples" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Worked Examples</h2>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example 1: Mixed Portfolio (Market Value)</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Stocks: <strong>$25,000</strong></p>
                  <p>Halal ETF: <strong>$10,000</strong></p>
                  <p>Bitcoin: <strong>$8,000</strong></p>
                  <p>Ethereum: <strong>$3,000</strong></p>
                  <p>Total investments: <strong>$46,000</strong></p>
                  <p>Cash savings: <strong>$12,000</strong></p>
                  <p>Total zakatable wealth: <strong>$58,000</strong></p>
                  <p>Zakat due: $58,000 x 2.5% = <strong>$1,450</strong></p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example 2: Long-Term Investor (Net Asset Method)</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>500 shares of Company X (long-term hold)</p>
                  <p>Company X net zakatable assets per share: <strong>$12.50</strong></p>
                  <p>Your zakatable portion: 500 x $12.50 = <strong>$6,250</strong></p>
                  <p>Zakat on stocks: $6,250 x 2.5% = <strong>$156.25</strong></p>
                  <p>Plus cash savings: <strong>$20,000</strong></p>
                  <p>Total zakat: $156.25 + ($20,000 x 2.5%) = <strong>$656.25</strong></p>
                </div>
                <p className="text-xs text-amber-700 mt-3">Use Barakah&apos;s <Link href="/zakat-calculator" className="underline">zakat calculator</Link> for automatic calculations across all asset types.</p>
              </div>
            </section>

            <section id="mistakes" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Common Mistakes to Avoid</h2>
              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Using purchase price instead of market value:</strong> Zakat is calculated on the current market value of your investments, not what you originally paid. A stock you bought at $50 that is now worth $100 owes zakat on $100.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Forgetting to combine all assets:</strong> Your stocks, cash, gold, and other zakatable assets should be combined when checking against the nisab threshold and calculating total zakat.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Not accounting for dividends:</strong> Dividends you receive and hold as cash are zakatable as part of your cash savings. Do not double-count them (once as stock value and once as cash).</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Ignoring retirement accounts:</strong> 401(k), IRA, and other retirement accounts holding stocks are also zakatable. See our <Link href="/learn/zakat-on-401k" className="text-red-600 underline">zakat on 401(k) guide</Link> for details.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Using an inconsistent zakat date:</strong> Pick one date per year and stick to it. Switching dates to avoid paying zakat when markets are high is not permissible.</p>
                </div>
              </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: How do I calculate zakat on stocks?</h3>
                <p className="text-gray-700 text-sm">
                  The simplest method is the market value method: multiply the current value of all your stock holdings by 2.5%. Alternatively, use the net asset method by calculating your proportional share of the company&apos;s zakatable assets. Most scholars recommend the market value method for regular investors.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I pay zakat on stocks that lost value?</h3>
                <p className="text-gray-700 text-sm">
                  You pay zakat on the current market value, not the purchase price. If your stocks have declined, your zakat is calculated on the lower amount. If your total portfolio drops below the nisab, no zakat is due until it recovers and a new lunar year passes.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What about capital gains tax? Do I deduct it?</h3>
                <p className="text-gray-700 text-sm">
                  Unlike retirement accounts, capital gains tax on stocks is only due when you sell. Since you have not yet sold (and may not sell), most scholars do not allow deducting potential capital gains tax from your zakat calculation. Calculate zakat on the full market value.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Is zakat due on company stock options?</h3>
                <p className="text-gray-700 text-sm">
                  Unvested stock options are not yet your property, so zakat is not due on them. Once options vest and you exercise them, the resulting shares are zakatable at their market value. If you hold vested but unexercised options, some scholars treat them as a receivable (the difference between strike price and market price).
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I pay zakat on cryptocurrency?</h3>
                <p className="text-gray-700 text-sm">
                  Yes, according to most scholars who consider crypto permissible. Calculate 2.5% of the market value in your local currency on your zakat date. This applies to Bitcoin, Ethereum, stablecoins, and other tokens you hold as investments or savings.
                </p>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Calculate Zakat on Your Investments</h2>
              <p className="text-green-100">
                Barakah&apos;s zakat calculator automatically pulls live stock prices, supports both market value and net asset methods, and tracks crypto holdings for complete zakat calculations.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Open Zakat Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/halal-stocks"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Stocks List 2026</h3>
                  <p className="text-gray-600 text-sm">How to screen stocks for Shariah compliance using AAOIFI standards.</p>
                </Link>
                <Link
                  href="/learn/zakat-on-401k"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on 401(k) & IRAs</h3>
                  <p className="text-gray-600 text-sm">Three scholarly positions on retirement account zakat with tax deduction examples.</p>
                </Link>
              </div>
            </section>

            {/* Author & Update Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last reviewed:</strong> April 2026</p>
              <p className="mt-2">This article is based on rulings from AMJA, the Islamic Fiqh Academy (OIC Resolution No. 28), AAOIFI Shariah Standards, and guidance from Dr. Monzer Kahf and Sheikh Yusuf al-Qaradawi on zakat on financial instruments. Hadith references include Sahih Bukhari and Sahih Muslim.</p>
            </footer>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600">Islamic finance tools for modern Muslims.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/nisab-threshold" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                  <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">Finance 101</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
