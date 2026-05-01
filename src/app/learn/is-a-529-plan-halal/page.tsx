import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is a 529 Plan Halal? Sharia Review for 2026 | Barakah',
  description:
    'Are 529 college savings plans halal? Typical fund composition, halal alternatives, gift options, and Georgia Path2College specifics for Muslim parents in 2026.',
  keywords: [
    'is 529 plan halal',
    'halal 529',
    '529 sharia compliant',
    'halal college savings',
    'muslim 529 plan',
    'path2college halal',
    'georgia 529',
    'halal education savings',
    '529 alternatives muslim',
    'islamic 529',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/is-a-529-plan-halal' },
  openGraph: {
    title: 'Is a 529 Plan Halal? — Sharia Review for Muslim Parents in 2026',
    description: 'What is actually inside a 529 plan, why most fail AAOIFI screens, and the halal alternatives that work for college savings.',
    url: 'https://trybarakah.com/learn/is-a-529-plan-halal',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is a 529 Plan Halal?',
    description: 'Sharia review of 529 college savings for Muslim parents in 2026.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Is a 529 Plan Halal?', item: 'https://trybarakah.com/learn/is-a-529-plan-halal' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Is a 529 Plan Halal? Sharia Review for Muslim Parents',
  description: 'Detailed Sharia review of 529 college savings plans, common fund compositions, and halal alternatives.',
  url: 'https://trybarakah.com/learn/is-a-529-plan-halal',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function Is529PlanHalalPage() {
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
            <span>Is a 529 Plan Halal?</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 8 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Is a 529 Plan Halal? — A Sharia Review for Muslim Parents in 2026
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            The question we get most from new Muslim parents in the US: should I open a 529 for my kid? The honest answer is that the wrapper is fine but the standard investment options inside almost every 529 plan are not halal. Here is what that actually means and what to do instead.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">What a 529 actually is</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            A 529 is a state-sponsored tax-advantaged account for education expenses. Contributions are after-tax federally, growth is tax-free, and qualified withdrawals (tuition, books, room and board, even K-12 in some plans) are tax-free. Many states throw in a state income tax deduction on contributions. In Georgia, Path2College gives a $4,000 deduction per beneficiary if filing single, $8,000 if married filing jointly.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The 529 itself is just a wrapper. AMJA scholars (Resolution 8/3) have stated that tax-advantaged wrappers are halal in principle. The question is what you put inside.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">What is inside a typical 529</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Most 529 plans are managed by Vanguard, Fidelity, or T. Rowe Price. The default investment is an age-based portfolio that shifts from stocks to bonds as the beneficiary nears college age. Both legs are problematic:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>The stock side</strong> is usually a total-market index. Total-market indexes include conventional banks, alcohol, gambling, and other haram sectors. They fail AAOIFI Standard 21 on multiple ratios.</li>
            <li><strong>The bond side</strong> is conventional fixed-income. Bonds are riba on contract. Even one cent in a conventional bond fund is a problem.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Mufti Faraz Adam&apos;s 2023 review of US 529 plans found that none of the major state plans offer a Sharia-compliant default option. You have to actively pick the underlying funds yourself, and most plans only offer 8-15 fund choices.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Plans that have at least one halal-eligible fund</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Some 529 plans offer S&P 500 index funds without bonds. The S&P 500 itself is not halal under AAOIFI, but a small number of plans have added Sharia-screened ETFs to their fund menu over the past three years:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>Utah my529</strong> — allows custom portfolios with broader fund access. You can build a 100% equity portfolio that excludes the bond glide path.</li>
            <li><strong>Nevada Vanguard 529</strong> — total stock market only option avoids the bond contamination.</li>
            <li><strong>Path2College (Georgia)</strong> — limited fund menu. Total US Equity option (TIAA-CREF) is closer to halal than the age-based default but still includes haram sectors. Best practice: contribute, then call the plan administrator and request a 100% US Equity Index allocation, then purify roughly 25-30% of gains as sadaqah to account for haram sector exposure.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The Path2College Georgia specifics</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Georgia&apos;s plan offers nine investment options: three age-based, five static, and one principal-protected (which is interest-bearing — avoid). The static 100% US Equity Index option (TIAA-CREF Equity Index) tracks the Russell 3000. It will contain banks and conventional financials. Mufti Joe Bradford&apos;s reading: this is permissible under necessity if no halal alternative exists in your state plan, with active purification.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Practical Georgia path:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Contribute up to the $4,000/$8,000 state-deductible cap to capture the state tax break.</li>
            <li>Allocate 100% to US Equity Index (avoid age-based and principal-protected).</li>
            <li>Each year, calculate the haram revenue percentage of the underlying index (usually 20-30%) and donate that share of gains as sadaqah.</li>
            <li>Put any contributions above the state-deduction cap into a halal Coverdell ESA or taxable account in HLAL/SPUS, where the underlying funds are AAOIFI-screened.</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Halal alternatives</h2>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Coverdell ESA</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Coverdell ESAs let you invest in any ETF, including HLAL (Wahed FTSE USA Shariah) and SPUS (SP Funds S&P 500 Sharia). Contribution cap is $2,000/year per beneficiary, income-limited. Less generous than a 529 but cleanly halal.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">UGMA/UTMA in halal ETFs</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Custodial brokerage accounts at Charles Schwab or Fidelity, invested in HLAL or SPUS. No tax advantage but full halal control and unlimited contributions. Becomes the child&apos;s asset at 18 or 21 depending on state.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Wahed Junior</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Wahed offers a custodial account product with Sharia-screened portfolios. Cleaner than a 529, no tax wrapper, but nothing to manage.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Gift options for grandparents</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Grandparents can superfund a 529 with up to $95,000 per donor (2026 5-year frontload limit) without gift tax. If your parents want to gift toward your kid&apos;s education, the same caveats apply: the wrapper is fine, the default investment is not. Direct them to the same equity-only allocation, or have them gift to a Coverdell or custodial account in halal ETFs instead.
          </p>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              The 529 wrapper is halal. The default investments are not. If you are in Georgia, contribute to Path2College up to the state deduction cap, allocate 100% to US Equity Index, purify 25-30% of gains as sadaqah, and put any extra savings in a Coverdell ESA invested in HLAL or SPUS. That gets you the tax break without compromising the principle.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/halal-etfs', title: 'Halal ETFs', desc: 'HLAL, SPUS, ISWD, and other Sharia-screened funds.' },
                { href: '/learn/is-my-401k-halal', title: 'Is My 401(k) Halal?', desc: 'Same wrapper question, different account type.' },
                { href: '/learn/halal-401k', title: 'Halal 401(k) Setup', desc: 'How to make your retirement plan Sharia-compliant.' },
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting', desc: 'Build savings goals into a riba-free budget.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Plan halal college savings in Barakah</h2>
            <p className="text-green-200 mb-6">Set goals, track contributions across 529s, Coverdells, and brokerage accounts, and screen every fund against AAOIFI Standard 21.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free Account
              </Link>
              <Link href="/learn/halal-etfs" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Halal ETFs Guide →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
