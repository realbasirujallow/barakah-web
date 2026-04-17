import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Zakat on Cryptocurrency (Bitcoin, Ethereum) — Islamic Guide 2026 | Barakah',
  description: 'Learn how to calculate zakat on Bitcoin, Ethereum, and other crypto. Understand the scholarly rulings, nisab thresholds, and whether your crypto holdings are zakatable.',
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-crypto' },
};

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{"@type":"Question","name":"Do I pay zakat on crypto I've held for less than a year?","acceptedAnswer":{"@type":"Answer","text":"No. Zakat requires a full lunar year (hawl) of ownership above nisab. If you bought crypto less than 354 days ago, it is not yet zakatable — but it will be once the hawl completes."}},{"@type":"Question","name":"What about NFTs?","acceptedAnswer":{"@type":"Answer","text":"NFTs held for investment are treated like any other digital asset. If you intend to sell them, their market value is zakatable. NFTs held for personal use (display art) are generally exempt, similar to personal property."}},{"@type":"Question","name":"Do I use the purchase price or current market value?","acceptedAnswer":{"@type":"Answer","text":"Use the current market value on your hawl anniversary date, not the purchase price. Zakat is based on what you own today, not what you paid."}}],
  };

  return (
    <>
      <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Zakat on Cryptocurrency</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">Zakat on Cryptocurrency</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 dark:text-gray-300">Cryptocurrency is a relatively new asset class, and Islamic scholars have reached a strong consensus: crypto holdings that have been held for one full lunar year (hawl) above the nisab threshold are subject to zakat at the standard 2.5% rate.</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Is Crypto Zakatable?</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">Yes. The majority of contemporary scholars — including AMJA, Dr. Monzer Kahf, and the Fiqh Council of North America — treat cryptocurrency as zakatable wealth similar to cash or stocks. If your crypto portfolio&apos;s market value exceeds the nisab threshold on your hawl anniversary, zakat is due.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">How to Calculate</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">Take the total market value of all your crypto holdings on your hawl date. If it exceeds nisab (approximately $14,025 based on 85g of gold), multiply the total by 2.5%. For example, if you hold $20,000 in Bitcoin and Ethereum combined, your zakat would be $500.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Staking and DeFi Yields</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">Income from staking, yield farming, or DeFi protocols is treated similarly to investment returns. The principal plus accumulated yields are included in your zakatable wealth on your hawl date.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">Do I pay zakat on crypto I&apos;ve held for less than a year?</summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">No. Zakat requires a full lunar year (hawl) of ownership above nisab. If you bought crypto less than 354 days ago, it is not yet zakatable — but it will be once the hawl completes.</div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">What about NFTs?</summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">NFTs held for investment are treated like any other digital asset. If you intend to sell them, their market value is zakatable. NFTs held for personal use (display art) are generally exempt, similar to personal property.</div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">Do I use the purchase price or current market value?</summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">Use the current market value on your hawl anniversary date, not the purchase price. Zakat is based on what you own today, not what you paid.</div>
              </details>
            </div>
          </section>
          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Calculate Your Zakat Now</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">Use our free, multi-madhab zakat calculator with live gold prices.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">Try Zakat Calculator</Link>
              <Link href="/signup" className="border border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">Create Free Account</Link>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/learn/zakat-on-gold" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Zakat on Gold</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Understand gold-based nisab calculations.</p>
            </Link>
            <Link href="/learn/zakat-on-retirement-accounts" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Retirement Accounts</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Navigate zakat on 401(k) and IRA.</p>
            </Link>
            <Link href="/faraid-calculator" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Faraid Calculator</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Calculate Islamic inheritance shares.</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
