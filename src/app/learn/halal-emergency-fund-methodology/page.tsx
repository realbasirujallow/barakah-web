import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Emergency Fund Methodology 2026 | Barakah',
  description:
    'How to build a halal emergency fund in 2026: 3-6 month sizing tied to nisab, where to park it (no high-APY savings), and how to keep it riba-free.',
  keywords: [
    'halal emergency fund',
    'islamic emergency fund',
    'muslim emergency savings',
    'no interest savings account',
    'halal savings 2026',
    'sharia compliant emergency fund',
    'where to park halal cash',
    'nisab aware fund',
    'riba free savings',
    'islamic financial planning',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-emergency-fund-methodology' },
  openGraph: {
    title: 'Halal Emergency Fund Methodology — Build a Riba-Free Safety Net',
    description: 'Sizing, placement, and zakat treatment of a halal emergency fund. Where to park cash without paying or earning interest.',
    url: 'https://trybarakah.com/learn/halal-emergency-fund-methodology',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halal Emergency Fund Methodology 2026',
    description: 'Sizing, placement, and zakat for a riba-free emergency fund.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Halal Emergency Fund Methodology', item: 'https://trybarakah.com/learn/halal-emergency-fund-methodology' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Emergency Fund Methodology 2026',
  description: 'How to size, place, and maintain a riba-free emergency fund according to Islamic principles.',
  url: 'https://trybarakah.com/learn/halal-emergency-fund-methodology',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function HalalEmergencyFundPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Build Halal Savings →
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Halal Emergency Fund Methodology</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 8 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Halal Emergency Fund Methodology — Build a Riba-Free Safety Net in 2026
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Conventional personal-finance advice tells you to park your emergency fund in a high-yield savings account at 4-5% APY. That entire premise is riba. Here is how to build the same safety net without earning a cent of interest, sized correctly against your nisab, and placed where you can actually access it in 24 hours.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Why an emergency fund matters in Islam</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The Prophet (peace be upon him) advised tying your camel before relying on Allah. An emergency fund is the modern equivalent. It keeps you from needing a credit card or a payday loan when the car dies or the layoff comes. Both of those alternatives are riba contracts. Building cash reserves is itself a form of trust in Allah&apos;s provision combined with prudent action — exactly the balance Islamic teaching prescribes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Sizing: 3-6 months, but nisab-aware</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The standard advice is 3-6 months of essential expenses. For Muslims, there is one extra layer: the nisab threshold. As of 2026 the gold-based nisab is around $8,500 (85g of gold at typical spot prices). Once your cash holdings exceed nisab and a hawl (354 lunar days) passes, you owe 2.5% zakat on the full balance.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            That changes how you think about emergency-fund sizing. You should still build the full 3-6 months, but you should also:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Track your hawl date precisely from when your cash first crossed nisab.</li>
            <li>Include the upcoming zakat payment in your budgeting so it does not eat into the fund itself.</li>
            <li>Recognize that the fund is zakatable even if you have not touched it.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Sizing rule of thumb: monthly essential expenses x 3-6, with the lower end if you have stable W-2 income and the higher end if you are self-employed or single-income. AMJA Resolution 12/4 affirmed that emergency-fund cash is fully zakatable on the hawl date — there is no exemption for &quot;rainy day&quot; intent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Where to park it (and what to avoid)</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The wrong answer: any &quot;high-yield savings account&quot;, money market account, or CD. These pay riba. Even if you mentally refuse the interest or donate it, signing the account agreement is signing a riba contract. Mufti Taqi Usmani has been firm on this point.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The right answers, in rough order of preference:
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">1. Non-interest-bearing checking account</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Most major banks (Chase, Wells Fargo, Bank of America) offer plain checking that pays 0% by default. This is the cleanest option. You hold the cash, you can move it instantly, you have no riba exposure. The downside: inflation erodes purchasing power. That is the price of avoiding riba.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">2. Lariba or UIF cash management</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Lariba American Finance House offers profit-sharing deposit accounts structured as Mudaraba. Returns are based on actual investment in halal trade, not interest. Yields fluctuate. UIF has similar product offerings depending on state availability.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">3. Physical gold and silver</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            For longer-horizon &quot;deep reserve&quot; holdings, scholars recommend allocating part of your fund to physical gold or silver. This protects purchasing power without involving riba. Liquidity is slower (you have to sell to a dealer), so use this only for the slice you do not need to access in 30 days. The 595g silver nisab is also relevant here for zakat tracking.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">4. Sukuk for the long-tail</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            For the &quot;6th month&quot; portion you genuinely will not need, short-duration sukuk (SP Funds Dow Jones Sukuk ETF, ticker SPSK) offer modest returns from real asset ownership rather than interest. Liquidity is reasonable but not instant.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">A worked example</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            You earn $7,000/month after tax. Essential expenses are $4,500/month. Target: 5 months = $22,500.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Suggested split:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>$10,000 in non-interest checking</strong> — same-day liquidity for any actual emergency.</li>
            <li><strong>$8,000 in a Lariba Mudaraba account</strong> — accessible in 1-3 days, halal returns.</li>
            <li><strong>$3,000 in physical gold (~30g)</strong> — purchasing power hedge, sellable at a dealer in a week.</li>
            <li><strong>$1,500 in SPSK sukuk</strong> — last-resort reserve, 1-2 day liquidity, modest yield.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            On your hawl date, owe 2.5% on the cash and on the gold above the nisab threshold (gold is zakatable from the first gram if the silver nisab is the lower benchmark in your madhab; cash is zakatable on the full amount once over nisab). That is roughly $560 in zakat on this fund. Budget for it.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Discipline beats yield</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            You will give up roughly $900-$1,000 a year in interest you would have earned in a 5% high-yield account on a $22,500 fund. That is the cost of obedience. Reframe it: you are paying that amount as the price of keeping your wealth pure. You will gain it back in barakah and in not having to play financial gymnastics with riba purification.
          </p>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Build 3-6 months of essential expenses. Park the immediate-access portion in a 0% checking account. Use Lariba Mudaraba or sukuk for the longer slice. Keep some in physical gold. Track your hawl date and pay 2.5% zakat on it every lunar year. Skip the 5% APY savings account — it is riba on contract.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/zakat-on-savings', title: 'Zakat on Savings', desc: 'How the 2.5% applies to cash in any account.' },
                { href: '/learn/nisab', title: 'Nisab Threshold', desc: '85g gold and 595g silver explained.' },
                { href: '/learn/hawl', title: 'Hawl (Lunar Year)', desc: 'Why 354 days matters for zakat.' },
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting', desc: 'Build a budget around halal cash flows.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Track your halal emergency fund in Barakah</h2>
            <p className="text-green-200 mb-6">Set savings goals, track multi-account placement, monitor your hawl, and project zakat owed — all in a riba-free dashboard.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free Account
              </Link>
              <Link href="/zakat-calculator" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Zakat Calculator →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
