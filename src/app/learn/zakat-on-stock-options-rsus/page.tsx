import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on Stock Options & RSUs: 2026 Guide | Barakah',
  description:
    'Zakat treatment of vested vs unvested RSUs and stock options in 2026 — fair-market valuation, blackout windows, and exactly when zakat is owed.',
  keywords: [
    'zakat on rsu',
    'zakat on stock options',
    'zakat on vested stock',
    'zakat on unvested rsu',
    'rsu islamic finance',
    'zakat tech employee',
    'zakat stock options 2026',
    'fmv zakat rsu',
    'blackout window zakat',
    'aaoifi rsu',
    'zakat espp',
    'zakat on iso',
    'zakat on nso',
    'mufti taqi rsu',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-stock-options-rsus' },
  openGraph: {
    title: 'Zakat on Stock Options & RSUs: 2026 Guide',
    description: 'When zakat is owed on equity comp — vesting vs exercise vs sale, blackout windows, and the fair-market valuation rule.',
    url: 'https://trybarakah.com/learn/zakat-on-stock-options-rsus',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat on Stock Options & RSUs: 2026 Guide',
    description: 'Vested vs unvested, fair-market valuation, blackout windows.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Zakat on Stock Options & RSUs 2026', item: 'https://trybarakah.com/learn/zakat-on-stock-options-rsus' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Zakat on Stock Options & RSUs: 2026 Guide',
  description: 'Complete guide to zakat on equity compensation — vested vs unvested treatment, valuation, and blackout window considerations.',
  url: 'https://trybarakah.com/learn/zakat-on-stock-options-rsus',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah Team', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function ZakatOnStockOptionsRsusPage() {
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
            <span>Zakat on Stock Options & RSUs 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 9 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Zakat on Stock Options & RSUs: A 2026 Guide for Tech Workers
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            For Muslim employees of public tech companies — Meta, Google, Microsoft, Nvidia and beyond — restricted stock units and stock options are often the largest single line on the household balance sheet. They also raise the trickiest zakat questions. Here is the contemporary fiqh consensus, with the practical edge cases that come up every year.
          </p>

          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">📈 Track equity comp through your hawl</p>
            <p className="text-green-200 text-sm mb-4">Connect your brokerage and Barakah snapshots vested RSUs at the right moment — no spreadsheet juggling.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Start Free Account →
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The core principle: ownership and access</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Classical zakat law treats wealth as zakatable when two conditions are met: <strong>milkiyya tamma</strong> (complete ownership) and <strong>imkān al-taṣarruf</strong> (the practical ability to dispose of it). Mufti Taqi Usmani and the AAOIFI Shariah Standards apply this directly to modern equity comp: if you do not yet own it, or you cannot sell it, zakat is not yet due.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Vested RSUs — fully zakatable</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            When an RSU vests, the shares are deposited into your brokerage account and are legally yours. They become part of your zakatable wealth from that moment — even if you choose to hold them. On your hawl date:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Take the closing price (or your broker&apos;s reported value) on your hawl date.</li>
            <li>Multiply by the number of vested shares you actually hold (after broker sell-to-cover for tax withholding).</li>
            <li>Add the resulting market value to your total zakatable wealth, then apply 2.5% if you exceed nisab.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            The fact that the shares may be in a non-AAOIFI-compliant company is a separate issue (purification of dividends and gains) — it does not affect the zakat calculation itself.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Unvested RSUs — not zakatable yet</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Unvested RSUs are a contractual <em>future right</em>, not present ownership. You cannot sell them, transfer them, or encumber them — and if you leave the company before vesting they evaporate. The contemporary consensus, including statements from the Assembly of Muslim Jurists of America (AMJA) and Mufti Faraz Adam, is that unvested RSUs carry no zakat obligation. They become zakatable only when vesting occurs.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Stock options (ISOs and NSOs)</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Options are more nuanced. The zakat treatment turns on whether they are <strong>vested and in-the-money</strong>:
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Unvested options</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">No zakat owed — same reasoning as unvested RSUs. You have no ownership and cannot dispose of them.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Vested but underwater</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">If your strike price is above the current market price, the options have no economic value. No zakat is owed.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Vested and in-the-money</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Most contemporary scholars hold that the <em>spread</em> (current price minus strike, times number of vested options) is part of your zakatable wealth even before exercise — because you have the practical ability to monetize. A minority view delays zakat until exercise. Both are defensible; the conservative path is to pay on the spread.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Exercised and held as shares</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Treated as ordinary stock holdings. Full market value at hawl is zakatable.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">ESPP (Employee Stock Purchase Plans)</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            During the contribution period (when payroll is being deducted but shares haven&apos;t been purchased yet), the cash being withheld is still legally yours and is zakatable as cash. Once shares are purchased and deposited, treat them as ordinary stock — full market value at hawl. The discount you received is part of compensation, not interest, and is permissible.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Blackout windows — a real-world wrinkle</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Most public-company employees can only sell during defined trading windows. If your hawl date falls inside a blackout window — meaning you legally cannot sell — the shares remain zakatable, because the restriction is temporary and procedural, not a denial of ownership. Pay zakat from other liquid assets (cash, savings) in that case. Setting up a 10b5-1 plan or simply timing your zakat payment to the next open window is also acceptable, as long as you do not delay unreasonably.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Worked example</h2>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-700 mb-3 dark:text-gray-300">Yusuf works at a public tech company. On his hawl date:</p>
            <ul className="text-sm text-gray-700 space-y-1 mb-3 dark:text-gray-300">
              <li>• 220 vested RSUs at $385 = <strong>$84,700</strong></li>
              <li>• 600 unvested RSUs (vest over next 3 years) = <strong>$0</strong> (not zakatable)</li>
              <li>• 1,000 vested ISOs, strike $120, current $385 = spread of $265 × 1,000 = <strong>$265,000</strong></li>
              <li>• ESPP cash being withheld this period = <strong>$3,200</strong></li>
            </ul>
            <p className="text-sm text-gray-700 mb-2 dark:text-gray-300"><strong>Zakatable from equity comp: $352,900</strong></p>
            <p className="text-sm font-bold text-[#1B5E20]">Zakat owed on this slice: $352,900 × 2.5% = $8,822.50</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Concentrated stock and the screening question</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Beyond zakat, employees of non-Shariah-compliant companies face a separate question: should they hold shares of an employer that fails AAOIFI screening? Most contemporary scholars permit holding employer stock you receive through compensation, but encourage selling and reinvesting in compliant alternatives once the tax cost is acceptable. This is a separate calculation from zakat — pay the zakat first, then act on the compliance question.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <h3 className="font-bold text-amber-900 mb-2">Bottom line</h3>
            <p className="text-sm text-amber-900 mb-2">
              Zakat on equity comp follows ownership and access. <strong>Vested RSUs:</strong> 2.5% of market value at hawl. <strong>Unvested RSUs:</strong> nothing. <strong>Vested in-the-money options:</strong> 2.5% of the spread. <strong>Underwater or unvested options:</strong> nothing. Blackout windows do not waive zakat — pay from other liquid assets if needed. Compliance screening is a separate question from zakat: pay zakat first, address holdings second.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related reading</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/zakat-on-stocks', title: 'Zakat on Stocks', desc: 'General zakat rules for individual stock holdings.' },
                { href: '/learn/zakat-on-stocks-and-etfs', title: 'Zakat on Stocks & ETFs', desc: 'Investor vs trader treatment for stock positions.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'AAOIFI screening for stock holdings.' },
                { href: '/zakat-calculator', title: 'Zakat Calculator', desc: 'Plug your numbers into the full calculator.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Calculate zakat on your equity comp</h2>
            <p className="text-green-200 mb-6">Connect your brokerage and Barakah handles the vested-vs-unvested split automatically.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Start Free →
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
