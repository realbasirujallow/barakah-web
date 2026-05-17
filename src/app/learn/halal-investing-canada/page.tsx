import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Investing in Canada (2026): TFSA, RRSP, and Shariah Funds',
  description:
    'A 2026 guide to halal investing for Canadian Muslims — what TFSA, RRSP, and FHSA fit Shariah-compliant funds, the limited Canadian-listed options, US-listed alternatives, and currency considerations.',
  keywords: [
    'halal investing canada',
    'shariah compliant tfsa',
    'halal rrsp',
    'islamic etf canada',
    'manzil halal',
    'halal stocks canada',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-investing-canada' },
  openGraph: {
    title: 'Halal Investing in Canada (2026): TFSA, RRSP, and Shariah Funds',
    description: 'Halal investing for Canadian Muslims — fund options, registered account fit, and FX considerations.',
    url: 'https://trybarakah.com/learn/halal-investing-canada',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are there halal investment funds in Canada in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — but the menu is small. Wealthsimple Shariah World Equity Index ETF (WSHR) is the leading Canadian-listed halal ETF. Manzil offers halal home financing and is expanding into investment products. Most Canadian Muslims supplement WSHR by holding US-listed halal ETFs (SPUS, HLAL) inside their TFSA or RRSP, accepting the currency exposure.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I hold US-listed halal ETFs inside a TFSA or RRSP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. All major Canadian brokerages (Questrade, Wealthsimple Trade, RBC Direct, TD Direct) allow US-listed ETFs in TFSA and RRSP. Note two things: (1) US-listed ETFs may be subject to 15% US withholding tax on dividends in a TFSA (not in an RRSP, where US dividends are tax-exempt under the Canada-US treaty), and (2) you'll incur FX costs converting CAD to USD unless you use Norbert's Gambit or hold USD in the account.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Canadian Pension Plan (CPP) halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "CPP is a mandatory contribution to a government-managed fund that invests across a broad mix of assets including bonds and conventional financial-sector stocks. Most contemporary scholars accept CPP participation under necessity (it's not optional) and recommend purifying any income received from it in proportion to the non-permissible share of the underlying portfolio. Some scholars suggest opting out of the optional Voluntary Contribution component if available.",
      },
    },
    {
      '@type': 'Question',
      name: 'What about halal mortgages in Canada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Manzil is the most prominent provider, offering diminishing-musharaka home financing across most provinces. EQRAZ is another option. Both work with major Canadian banks as backing partners. Pricing is competitive with conventional mortgages but the structure is genuinely Shariah-compliant — payments include rent + equity buy-back, not interest.",
      },
    },
  ],
};

export default function HalalInvestingCanadaPage() {
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
              <span className="text-[#1B5E20] font-medium">Halal Investing Canada</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Halal Investing Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Halal Investing in Canada (2026)</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                TFSA, RRSP, FHSA — what fits, what doesn&apos;t, and the small-but-growing Canadian halal fund menu.
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
                <li><Link href="#funds" className="text-[#1B5E20] hover:underline">Canadian-listed halal funds</Link></li>
                <li><Link href="#us-listed" className="text-[#1B5E20] hover:underline">Using US-listed halal ETFs from Canada</Link></li>
                <li><Link href="#accounts" className="text-[#1B5E20] hover:underline">TFSA, RRSP, FHSA fit</Link></li>
                <li><Link href="#cpp" className="text-[#1B5E20] hover:underline">CPP and employer pensions</Link></li>
                <li><Link href="#mortgage" className="text-[#1B5E20] hover:underline">Halal mortgages in Canada</Link></li>
                <li><Link href="#zakat" className="text-[#1B5E20] hover:underline">Zakat in CAD</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQ</Link></li>
              </ul>
            </nav>

            <section id="funds" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Canadian-listed halal funds</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-lg bg-white shadow-sm dark:bg-gray-800">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Ticker / Product</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Provider</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Type</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">WSHR</td><td className="p-3">Wealthsimple</td><td className="p-3">Shariah World Equity Index ETF</td><td className="p-3">CAD-denominated; tracks Shariah-compliant global equities</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Manzil Halal Portfolios</td><td className="p-3">Manzil</td><td className="p-3">Managed halal portfolios</td><td className="p-3">Equity + sukuk allocations</td></tr>
                    <tr><td className="p-3 font-semibold">Halal Capital portfolios</td><td className="p-3">Halal Capital</td><td className="p-3">Robo-managed halal allocations</td><td className="p-3">Emerging provider; verify SSB</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                The Canadian halal-fund menu is meaningfully smaller than the US menu. Many Canadian Muslims supplement
                with US-listed halal ETFs.
              </p>
            </section>

            <section id="us-listed" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Using US-listed halal ETFs from Canada</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                All major Canadian brokerages (Questrade, Wealthsimple, RBC DI, TD DI, Interactive Brokers) allow US-listed
                ETFs in registered and non-registered accounts. The most-used US-listed halal ETFs are:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>SPUS</strong> — SP Funds S&amp;P 500 Shariah ETF (US large-cap)</li>
                <li><strong>HLAL</strong> — Wahed FTSE USA Shariah ETF (US large-cap)</li>
                <li><strong>SPSK</strong> — SP Funds Global Sukuk ETF (fixed-income alternative)</li>
                <li><strong>SPRE</strong> — SP Funds Global REIT Shariah ETF (real-estate exposure)</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Two costs to be aware of</h3>
                <ol className="list-decimal pl-5 text-sm space-y-2 text-blue-900">
                  <li><strong>US withholding tax on dividends:</strong> 15% in a TFSA or non-registered account. <em>None</em> in an RRSP/RRIF (treaty exemption). So US-listed halal ETFs are particularly efficient in an RRSP.</li>
                  <li><strong>FX cost:</strong> Converting CAD to USD via your broker&apos;s default rate can cost 1–2%. Norbert&apos;s Gambit (buying DLR.TO and journaling to DLR.U.TO) reduces this to fractions of a cent on the dollar for trades over ~$5k.</li>
                </ol>
              </div>
            </section>

            <section id="accounts" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">TFSA, RRSP, FHSA fit</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>TFSA:</strong> Best for WSHR (CAD-native, no withholding) or for US-listed halal ETFs if you&apos;re willing to accept 15% US withholding on dividends. Tax-free growth otherwise.</li>
                <li><strong>RRSP:</strong> Best for US-listed halal ETFs (SPUS, HLAL, SPSK) — no US withholding under the Canada-US tax treaty. Highly tax-efficient for US-dividend-bearing halal funds.</li>
                <li><strong>FHSA (First Home Savings Account):</strong> Limited halal options because of the short time horizon and need for liquidity. WSHR is a reasonable fit; many Muslims also keep FHSA cash in profit-sharing accounts at Manzil partner banks.</li>
                <li><strong>Non-registered (taxable):</strong> Holding WSHR is simplest tax-wise. US-listed ETFs work but require tracking ACB and FX for capital gains.</li>
              </ul>
            </section>

            <section id="cpp" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">CPP and employer pensions</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                CPP contributions are mandatory for employed Canadians and the fund invests across a broad mix of asset
                classes including conventional bonds and financial-sector equities. Most contemporary scholars accept CPP
                participation under necessity, with purification of any income received in proportion to the non-permissible
                share of the underlying portfolio.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Employer-sponsored defined-contribution pension plans (DCPP) or group RRSPs sometimes lack halal fund options.
                In that case the practical paths are: (1) contribute the employer-match amount only and hold the most-halal-leaning
                option available (often a broad equity index, which still requires purification), then maximize your personal RRSP/TFSA
                with WSHR + US-listed halal ETFs, or (2) ask HR if WSHR or similar can be added to the plan menu — increasingly accepted.
              </p>
            </section>

            <section id="mortgage" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Halal mortgages in Canada</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Canada now has multiple credible halal home-finance providers:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Manzil</strong> — diminishing musharaka, available in most provinces; partner banks include major chartered institutions.</li>
                <li><strong>EQRAZ</strong> — murabaha and diminishing musharaka structures.</li>
                <li><strong>An Nur Co-operative</strong> — Toronto-area cooperative offering halal home financing.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Pricing is broadly competitive with conventional mortgages once you factor in stamp duty, legal, and the
                effective &ldquo;rent + equity buy-back&rdquo; structure. See our{' '}
                <Link href="/learn/diminishing-musharaka-explained" className="text-[#1B5E20] underline">diminishing musharaka guide</Link>{' '}
                for how the structure works.
              </p>
            </section>

            <section id="zakat" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat in CAD</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Zakat is calculated on your CAD-equivalent net zakatable wealth on your zakat anniversary, at 2.5%.{' '}
                <Link href="/learn/nisab" className="text-[#1B5E20] underline">Nisab</Link> is computed from the
                current spot price of gold (85g) or silver (595g) converted to CAD on the day. Barakah supports CAD natively
                — gold price is pulled from a live feed and converted on the day, and the calculator includes all common
                Canadian account types.
              </p>
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
              <h2 className="text-2xl font-bold">Track halal investments in CAD</h2>
              <p className="text-green-100">
                Barakah works in CAD natively — link Wealthsimple, Questrade, or major Canadian banks and Barakah computes zakat, purification, and net worth in your home currency.
              </p>
              <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Get started free
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/halal-index-funds-2026" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Index Funds (2026)</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">The wider menu of US-available halal index funds.</p>
                </Link>
                <Link href="/learn/diminishing-musharaka-explained" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Diminishing Musharaka Explained</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">How the structure used by Manzil and most Canadian halal mortgages works.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
