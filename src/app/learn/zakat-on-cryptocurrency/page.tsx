import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on Cryptocurrency 2026: Complete Guide | Barakah',
  description:
    'Zakat on Bitcoin, Ethereum, stablecoins, and staking rewards in 2026. Hanafi vs Shafii treatment, lunar year-end valuation, nisab thresholds, and a worked example.',
  keywords: [
    'zakat on cryptocurrency',
    'zakat on bitcoin',
    'zakat on ethereum',
    'zakat on crypto 2026',
    'crypto zakat calculator',
    'is bitcoin zakatable',
    'zakat on stablecoins',
    'zakat on staking rewards',
    'hanafi zakat crypto',
    'shafii zakat crypto',
    'mufti taqi usmani crypto',
    'aaoifi crypto',
    'lunar year crypto zakat',
    'crypto nisab',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-cryptocurrency' },
  openGraph: {
    title: 'Zakat on Cryptocurrency 2026 — BTC, ETH, Stablecoins, Staking',
    description: 'How to calculate zakat on crypto: Hanafi vs Shafii, lunar year-end valuation, staking rewards, and a real worked example.',
    url: 'https://trybarakah.com/learn/zakat-on-cryptocurrency',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat on Cryptocurrency 2026',
    description: 'BTC, ETH, stablecoins, and staking rewards — fiqh-aware guide.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Zakat on Cryptocurrency 2026', item: 'https://trybarakah.com/learn/zakat-on-cryptocurrency' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Zakat on Cryptocurrency 2026: Complete Guide',
  description: 'Complete guide to calculating zakat on cryptocurrency in 2026 — covering Bitcoin, Ethereum, stablecoins, staking rewards, and madhab differences.',
  url: 'https://trybarakah.com/learn/zakat-on-cryptocurrency',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah Team', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function ZakatOnCryptocurrencyPage() {
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
            <span>Zakat on Cryptocurrency 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 9 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Zakat on Cryptocurrency 2026: Complete Guide for BTC, ETH, Stablecoins & Staking
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            If you hold Bitcoin, Ethereum, stablecoins, or earn staking rewards, zakat almost certainly applies. The mechanics are simple — 2.5% on the market value at your hawl anniversary — but getting the valuation date, the staking treatment, and the madhab nuances right matters. This guide walks through all of it.
          </p>

          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">⚖️ Auto-pull crypto balances at hawl</p>
            <p className="text-green-200 text-sm mb-4">Barakah connects to your exchanges and wallets and snapshots BTC, ETH, USDC and more on your hawl date — so you owe what you actually owe, not a guess.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Start Free Account →
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Is cryptocurrency zakatable at all?</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Yes — by overwhelming contemporary scholarly consensus. Crypto is treated as a <em>māl</em> (zakatable wealth) because it functions as a medium of exchange and store of value, the same role gold and silver played classically. Mufti Taqi Usmani has held that crypto qualifies for zakat once it reaches nisab, even where he is cautious about its broader permissibility. AAOIFI working papers from 2022 onward likewise treat crypto holdings as zakatable assets.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            The minority view — that crypto is not real wealth and therefore not zakatable — is increasingly difficult to maintain in 2026, when crypto routinely settles real-world transactions. If in doubt, the conservative path is to pay zakat.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The nisab threshold for crypto</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Crypto is zakatable once your total zakatable wealth crosses <strong>nisab</strong>. The two classical thresholds are:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>Gold nisab:</strong> 85 grams of gold</li>
            <li><strong>Silver nisab:</strong> 595 grams of silver</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Most contemporary scholars recommend the <strong>silver nisab</strong> for individual Muslims, because it is lower and therefore captures more wealth — protecting the right of the poor to receive zakat. Some Hanafi authorities will accept the gold nisab when crypto is the primary holding rather than a mix of cash, gold and crypto. Barakah pulls live spot prices and calculates both.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Hanafi vs Shafii: where the schools differ</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Hanafi position</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Crypto held with intention to trade is treated like trade goods (<em>‘urūḍ al-tijāra</em>) and zakat is owed on the full market value. Crypto held passively as a store of value is treated like cash — also zakatable at full market value. Either way, the practical result is the same: 2.5% of market value at hawl.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Shafii position</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">The Shafii school traditionally limits zakat to gold, silver, and a defined list of items. Some classical Shafii scholars therefore questioned zakat on paper currency. The dominant contemporary Shafii fatwa, however — including from Dār al-Iftā’ Mishriyya — extends zakat to all currency-like assets including crypto. The end result: 2.5% of market value at hawl.</p>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] mb-2">Practical bottom line</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Both schools, when followed by mainstream contemporary scholars, arrive at the same calculation: 2.5% of the market value of your crypto at the moment your lunar year ends.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">How to value crypto on your hawl date</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Your <strong>hawl</strong> is one full lunar year — <strong>354 days</strong>, not 365. Pick the date your wealth first crossed nisab, and that anniversary (in the lunar calendar) is your annual zakat due date. On that day:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Take a snapshot of every wallet, exchange and cold storage balance.</li>
            <li>Convert each holding to your local currency using the spot price at that moment (most calculators use the close price for the hawl date).</li>
            <li>Sum across all holdings — including BTC, ETH, altcoins, and stablecoins.</li>
            <li>If the total plus your other zakatable wealth exceeds nisab, multiply the total by <strong>2.5%</strong>.</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Crypto bought during the year does not need its own hawl — it inherits your existing hawl as long as you held nisab continuously. This matters for active traders.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Stablecoins (USDC, USDT, DAI)</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Stablecoins are functionally cash and are zakatable like cash — full balance at face value. There is some debate about USDT specifically given concerns about its reserves, but for zakat purposes the treatment is unchanged: you owe 2.5% on what you hold.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Staking rewards and yield</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            First a permissibility note: many contemporary scholars (including Mufti Faraz Adam and the Amanah Advisors panel) consider <em>proof-of-stake</em> validator rewards permissible because you are providing a real service (transaction validation), not earning a fixed return on a loan. <em>Lending-based yield</em> on platforms like Aave or BlockFi-style products is generally treated as riba and is impermissible.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            For zakat: any staking rewards you have received are simply added to your crypto balance on your hawl date. There is no separate calculation. If you earned riba-based yield in error, the principal is still zakatable but the yield itself should be purified by donating it to charity (without seeking reward), and is not counted toward the zakat obligation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">A worked example</h2>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm text-gray-700 mb-3 dark:text-gray-300">Aisha&apos;s hawl falls on 15 Shawwal. On that morning she holds:</p>
            <ul className="text-sm text-gray-700 space-y-1 mb-3 dark:text-gray-300">
              <li>• 0.42 BTC at spot $68,200 = <strong>$28,644</strong></li>
              <li>• 5.1 ETH at spot $3,400 = <strong>$17,340</strong></li>
              <li>• 1,200 USDC = <strong>$1,200</strong></li>
              <li>• 0.18 ETH from staking rewards = <strong>$612</strong></li>
            </ul>
            <p className="text-sm text-gray-700 mb-2 dark:text-gray-300"><strong>Total crypto: $47,796</strong></p>
            <p className="text-sm text-gray-700 mb-2 dark:text-gray-300">Above nisab ✓</p>
            <p className="text-sm font-bold text-[#1B5E20]">Zakat owed: $47,796 × 2.5% = $1,194.90</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <h3 className="font-bold text-amber-900 mb-2">Bottom line</h3>
            <p className="text-sm text-amber-900 mb-2">
              Pay <strong>2.5% of the market value</strong> of all your crypto holdings — including stablecoins and staking rewards — on your hawl anniversary, once your total zakatable wealth crosses nisab. Hanafi, Shafii, Maliki and Hanbali contemporary scholars converge on this answer despite different classical reasoning. Riba-based yield (lending platforms) is impermissible and must be purified separately.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related reading</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/zakat-on-crypto', title: 'Zakat on Crypto (overview)', desc: 'Shorter primer on cryptocurrency zakat basics.' },
                { href: '/learn/nisab', title: 'Nisab Thresholds', desc: 'Live gold and silver nisab values updated daily.' },
                { href: '/learn/hawl', title: 'Hawl Explained', desc: 'How the 354-day lunar year works in practice.' },
                { href: '/zakat-calculator', title: 'Zakat Calculator', desc: 'Calculate your full zakat across all assets.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Calculate your zakat in minutes</h2>
            <p className="text-green-200 mb-6">Connect your exchanges, get a hawl-date snapshot, and pay zakat on the right amount.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Start Free →
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
