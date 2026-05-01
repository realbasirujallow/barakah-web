import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is My 401(k) Halal? AAOIFI Standard 21 Explained | Barakah',
  description:
    'Most 401(k)s are not halal — here is why, and what to do about it. Target-date funds, employer match, AAOIFI Standard 21 screening, and Amana / Wahed alternatives.',
  keywords: [
    'is 401k halal',
    'halal 401k',
    'aaoifi standard 21',
    '401k islamic finance',
    'halal target date fund',
    'amana 401k',
    'wahed 401k',
    'halal retirement account',
    'sharia compliant 401k',
    'employer match halal',
    'islamic 401k',
    'self-directed 401k halal',
    'sdba halal',
    'mufti taqi usmani 401k',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/is-my-401k-halal' },
  openGraph: {
    title: 'Is My 401(k) Halal? — A 2026 AAOIFI-Aligned Guide',
    description: 'Why most 401(k)s fail Shariah screening, what to do about target-date funds and employer match, and the cleanest halal alternatives in 2026.',
    url: 'https://trybarakah.com/learn/is-my-401k-halal',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is My 401(k) Halal? AAOIFI Standard 21 Explained',
    description: 'A practical, fiqh-aware look at making your 401(k) Shariah-compliant.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Is My 401(k) Halal?', item: 'https://trybarakah.com/learn/is-my-401k-halal' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Is My 401(k) Halal? AAOIFI Standard 21 Explained',
  description: 'Practical guide to making a 401(k) Shariah-compliant — typical holdings, target-date funds, employer match, AAOIFI screening, and halal alternatives.',
  url: 'https://trybarakah.com/learn/is-my-401k-halal',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah Team', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function Is401kHalalPage() {
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
            <span>Is My 401(k) Halal?</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 10 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Is My 401(k) Halal? AAOIFI Standard 21 Explained
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            For most American Muslims, the default 401(k) is the single largest non-halal exposure in their financial life. The good news: in 2026 there are real, accessible paths to a Shariah-compliant retirement plan — including ones your existing employer can almost always accommodate. Here is the honest assessment, the AAOIFI screen, and what to actually do.
          </p>

          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">📊 Audit your 401(k) holdings</p>
            <p className="text-green-200 text-sm mb-4">Connect your retirement accounts to Barakah and see which funds pass AAOIFI Standard 21 — and which to swap out.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Start Free Account →
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Why most default 401(k) holdings are not halal</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            When you sign up for a 401(k), your employer typically defaults you into a <strong>target-date retirement fund</strong> — a fund-of-funds that holds a blend of US large-cap, international, small-cap, and bond index funds, gradually shifting toward bonds as you approach retirement. Each piece is a problem:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li><strong>S&P 500 and total-market funds</strong> include conventional banks (JPMorgan, Bank of America, Citi), insurance companies, and dozens of leveraged firms that fail AAOIFI ratios.</li>
            <li><strong>Bond allocations</strong> are pure interest-bearing instruments — riba by construction, regardless of issuer.</li>
            <li><strong>International developed funds</strong> include European and Japanese banks, alcohol producers and gambling operators.</li>
            <li><strong>The default cash sweep</strong> earns interest unless you actively turn it off.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Realistically, a typical Vanguard Target Retirement 2055 fund will fail AAOIFI screening on every component except the modest international equity sleeve, and even there only after individual stock screening.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">AAOIFI Standard 21 in plain English</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>AAOIFI Standard 21</strong> is the most widely recognized Shariah equity screen globally. It applies the following thresholds to every company:
          </p>
          <div className="space-y-3 mb-6">
            {[
              { ratio: 'Debt ÷ Total Assets', limit: '< 33%', desc: 'A company with more than a third of its balance sheet in interest-bearing debt fails.' },
              { ratio: 'Interest Income ÷ Total Revenue', limit: '< 5%', desc: 'A small amount of incidental interest is tolerated; more than 5% disqualifies the stock.' },
              { ratio: 'Interest-Bearing Assets ÷ Total Assets', limit: '< 33%', desc: 'Cash parked in money-market or treasury holdings cannot dominate the balance sheet.' },
            ].map((r) => (
              <div key={r.ratio} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="shrink-0">
                  <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">{r.ratio}</p>
                  <p className="font-bold text-[#1B5E20] text-sm">{r.limit}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            On top of these ratios is the <em>activity screen</em>: less than 5% of revenue from prohibited industries (alcohol, tobacco, pork, gambling, conventional finance, weapons, adult content). A standard S&P 500 index fund will hold roughly 50–70 stocks that fail at least one of these tests at any given time.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">What about the employer match?</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            This is the most common question. The dominant contemporary fatwa, including from Mufti Taqi Usmani, is that <strong>the employer match itself is halal</strong> — it is part of your compensation, not interest income. The non-halal element is <em>where the money is invested</em>. So:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li>Take the full employer match — leaving it on the table is leaving permissible compensation behind.</li>
            <li>But immediately direct both your contributions and the match into Shariah-compliant investment options.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Three concrete paths to a halal 401(k)</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">1. Amana Mutual Funds inside your existing plan</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Saturna&apos;s Amana funds (AMAGX, AMANX, AMDWX) have been on Vanguard, Fidelity, Schwab and most large recordkeeper menus for years. Many plan admins will add them on request — your HR or benefits contact can submit the request to your recordkeeper. This is the lowest-friction option.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">2. Self-Directed Brokerage Account (SDBA)</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Most large 401(k) plans include an SDBA option, sometimes called BrokerageLink (Fidelity) or PCRA (Schwab). It lets you trade individual stocks and ETFs inside your 401(k). You can build a portfolio of HLAL, SPUS, ISWD, and individual screened stocks.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">3. Roll into a Wahed IRA after job changes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">When you leave a job, you can roll your old 401(k) into a Wahed Invest IRA, where the entire portfolio is screened against AAOIFI standards. This does not require employer cooperation. Roth conversions are halal as long as the source funds are.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The transitional period question</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            What if you have years of contributions sitting in non-compliant funds? Most contemporary scholars, including the Assembly of Muslim Jurists of America (AMJA), permit a <em>reasonable transition period</em> while you consolidate. The principle is to act on knowledge once you have it: switch new contributions immediately, and rebalance the legacy holdings as soon as administratively possible. Any haram dividends or interest already received during the impermissible period should be donated to charity (without intention of reward).
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <h3 className="font-bold text-amber-900 mb-2">Bottom line</h3>
            <p className="text-sm text-amber-900 mb-2">
              Take the employer match — it is halal compensation. Then audit what you actually own. If you are in a default target-date fund, you almost certainly fail AAOIFI Standard 21 on debt ratios, sector screens, and bond holdings. The fix is one of three: add Amana funds to your plan menu, open the self-directed brokerage window, or roll over to a Shariah-screened IRA when you leave the employer. Don&apos;t skip the match while you sort it out.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related reading</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/halal-401k', title: 'Halal 401(k) Strategies', desc: 'Step-by-step guide to converting your 401(k).' },
                { href: '/learn/zakat-on-401k', title: 'Zakat on 401(k)', desc: 'How to calculate zakat on retirement holdings.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'AAOIFI screening and Shariah investment principles.' },
                { href: '/learn/halal-etfs', title: 'Halal ETFs', desc: 'HLAL, SPUS, ISWD and other compliant funds.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Audit your retirement accounts</h2>
            <p className="text-green-200 mb-6">Barakah screens every fund and ticker in your 401(k) against AAOIFI Standard 21 — and tells you what to swap.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Start Free →
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
