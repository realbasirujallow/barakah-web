import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on NFTs and Digital Assets 2026 | Barakah',
  description:
    'How to calculate zakat on NFTs, in-game items, and digital collectibles. Fungibility test, fair-value methodology, blue-chip vs speculative treatment, and AAOIFI guidance.',
  keywords: [
    'zakat on nfts',
    'zakat on digital assets',
    'nft zakat calculator',
    'zakat on collectibles',
    'islamic ruling nft',
    'aaoifi nft',
    'is nft halal',
    'zakat on bored ape',
    'fair value zakat',
    'fungibility zakat',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-nfts-and-digital-assets' },
  openGraph: {
    title: 'Zakat on NFTs and Digital Assets — A Practical Methodology for 2026',
    description: 'How fungibility decides whether your NFT is zakatable, fair-value methods scholars accept, and the gap between blue-chip JPEGs and speculative mints.',
    url: 'https://trybarakah.com/learn/zakat-on-nfts-and-digital-assets',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat on NFTs and Digital Assets',
    description: 'Practical zakat methodology for NFTs, in-game items, and digital collectibles. With scholar citations.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Zakat on NFTs and Digital Assets', item: 'https://trybarakah.com/learn/zakat-on-nfts-and-digital-assets' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Zakat on NFTs and Digital Assets — A Practical Methodology',
  description: 'How to apply zakat rules to NFTs and digital collectibles using fungibility tests, fair-value methods, and contemporary scholar opinions.',
  url: 'https://trybarakah.com/learn/zakat-on-nfts-and-digital-assets',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function ZakatOnNftsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <div className="max-w-3xl mx-auto px-6 py-10">

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 9 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Zakat on NFTs and Digital Assets — A Practical 2026 Methodology
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            NFT zakat questions hit our inbox every Ramadan. Scholars have not landed on one universal answer because the asset class is too varied. The cleanest framework starts with one question: are you holding it to flip, or to keep? That intent, plus the fungibility of the underlying asset, decides whether you owe 2.5% on its market value.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The fungibility test</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Classical fiqh divides assets into two buckets for zakat purposes: cash-equivalents (gold, silver, currency, trade inventory) which are zakatable on full value, and personal-use assets (your home, your car, your library) which are not. The first bucket gets 2.5% every hawl (354 lunar days). The second gets nothing.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Mufti Faraz Adam at Amanah Advisors has published the cleanest contemporary framework on NFTs. His test has two prongs:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>Fungibility</strong> — does the NFT trade like a commodity with an active market and a discoverable price? If yes, it behaves like trade inventory.</li>
            <li><strong>Intent</strong> — did you buy it to hold and use, or to resell at a profit? Trade intent triggers zakat regardless of asset class.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            If both prongs fire (fungible market plus trade intent), the NFT is zakatable at fair market value. If neither fires (illiquid art you keep on your wall), it is closer to personal property and not zakatable. The grey zone in the middle is where most NFTs actually sit.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Blue-chip NFTs (CryptoPunks, BAYC, Art Blocks)</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Blue-chip collections trade with deep liquidity, observable floor prices, and active secondary markets. They behave like commodities. Most contemporary scholars (including Mufti Faraz Adam and Sheikh Joe Bradford) treat blue-chip NFTs as trade goods if you bought them with resale intent. You owe 2.5% on the floor price (or your last verifiable trade comparable) on your hawl date.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            If you bought a blue-chip NFT genuinely as a long-term collectible — for its art, its membership perks, its identity — and you have no intent to flip, the case for zero zakat is stronger. Document your intent. If the floor 10x&apos;s and you sell, the proceeds are zakatable cash from that point forward.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Speculative mints and meme NFTs</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Almost everyone who buys a fresh PFP mint at 0.05 ETH is hoping to flip it. The intent is plain. Even if liquidity is thin, the trade intent alone makes the asset zakatable on whatever fair value you can establish. Use the most recent verifiable trade or the floor on the largest secondary market (OpenSea, Blur, Magic Eden).
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            If the project ruggs and your NFT is unsellable, fair value is effectively zero and you owe nothing. Mufti Taqi Usmani&apos;s general rule on zakat applies: you only pay on assets that retain real, recoverable value.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">In-game items, domain names, digital land</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Same framework. CS:GO skins traded for cash on Steam Marketplace are de facto trade goods. Decentraland or Sandbox parcels you bought to flip are zakatable at floor. ENS domains held to resell are zakatable at the last comparable sale. A .eth name that matches your handle and you would never sell behaves more like personal property.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Fair-value methodology</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            AAOIFI Standard 35 on zakat allows three valuation methods for non-cash trade goods, in order of preference:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>Active market price.</strong> Floor price on the deepest exchange (OpenSea, Blur). Use the price as of your hawl anniversary.</li>
            <li><strong>Comparable transactions.</strong> If your specific NFT has no recent sale, use the most recent floor in the same collection at the same rarity tier.</li>
            <li><strong>Independent appraisal.</strong> For genuinely illiquid 1/1 art, an arms-length appraisal from a qualified party.</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Convert the resulting USD value to your zakat calculation. Multiply by 2.5%. Pay before the next lunar year ends.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Worked example</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            You hold 3 NFTs on your hawl date in Ramadan 1447H:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>1 CryptoPunk you bought for 50 ETH and would sell at the right price. Floor today: 30 ETH ($90,000). Zakatable.</li>
            <li>1 mint from a meme project. Worthless. Floor: 0. Owe nothing on it.</li>
            <li>1 ENS domain matching your name. Personal use, no resale intent. Not zakatable.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Add the $90,000 to your other zakatable assets (cash, gold, business inventory). If your total clears the 85g gold nisab (~$8,500 at typical 2026 prices) and a hawl has passed, you owe 2.5% on the full pool. That is $2,250 from the Punk alone.
          </p>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              If you bought it to flip, it is zakatable at fair market value. If you bought it to keep and there is no active market, it is not. Use floor prices from the deepest exchange on your hawl date. Pay 2.5% on the total. When in doubt, ask your local mufti and document your intent.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/zakat-on-crypto', title: 'Zakat on Crypto', desc: 'How to calculate zakat on Bitcoin, ETH, and altcoins.' },
                { href: '/learn/is-bitcoin-halal-2026', title: 'Is Bitcoin Halal?', desc: 'Scholar consensus on cryptocurrency in 2026.' },
                { href: '/learn/nisab', title: 'Nisab Threshold', desc: '85g gold and 595g silver explained.' },
                { href: '/learn/hawl', title: 'Hawl (Lunar Year)', desc: 'How the 354-day cycle works for zakat.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Calculate zakat on every asset class</h2>
            <p className="text-green-200 mb-6">Barakah supports cash, gold, stocks, crypto, NFTs, business assets, and more. Server-authoritative Hijri dates and live nisab pricing.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Open Zakat Calculator
              </Link>
              <Link href="/learn/zakat-on-crypto" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Zakat on Crypto →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
