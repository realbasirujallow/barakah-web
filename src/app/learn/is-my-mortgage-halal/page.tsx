import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Is My Mortgage Halal? Understanding Riba in Home Financing | Barakah',
  description: 'Understand the Islamic ruling on conventional mortgages, explore halal alternatives like murabaha and ijara, and learn what scholars say about necessity exceptions.',
  alternates: { canonical: 'https://trybarakah.com/learn/is-my-mortgage-halal' },
};

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{"@type":"Question","name":"Can I deduct my mortgage from zakatable wealth?","acceptedAnswer":{"@type":"Answer","text":"Scholars differ. The Hanafi position allows deducting the full outstanding mortgage. Other scholars recommend deducting only the current year's installments. Barakah supports both methods in Fiqh Settings."}},{"@type":"Question","name":"Should I pay off my mortgage early to avoid riba?","acceptedAnswer":{"@type":"Answer","text":"If you have a conventional mortgage, paying it off early reduces the total riba paid. Many scholars strongly encourage this. Barakah's Riba Elimination Journey can help you plan a payoff strategy."}}],
  };

  return (
    <>
      <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <article className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Is My Mortgage Halal?</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Is My Mortgage Halal?</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">A conventional mortgage involves paying and receiving interest (riba), which is prohibited in Islam. However, scholars differ on whether necessity exceptions apply for Muslims living in non-Muslim-majority countries where halal alternatives are limited.</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">What Makes a Mortgage Haram?</h2>
            <p className="text-gray-700 leading-relaxed">Conventional mortgages charge interest on the borrowed amount. Interest (riba) is explicitly prohibited in the Quran (2:275-279) and Hadith. The prohibition is absolute — riba is considered one of the major sins.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Halal Alternatives</h2>
            <p className="text-gray-700 leading-relaxed">Several Shariah-compliant home financing structures exist: Murabaha (cost-plus financing), Ijara (lease-to-own), Musharaka Mutanaqisa (diminishing partnership), and Commodity Murabaha. Companies like Guidance Residential, UIF, and Ameen Housing offer these in the US.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">The Necessity Exception</h2>
            <p className="text-gray-700 leading-relaxed">Some scholars, including the European Council for Fatwa and Research and Dr. Yusuf al-Qaradawi, have issued rulings permitting conventional mortgages for Muslims in non-Muslim countries where halal alternatives are genuinely unavailable, under the principle of necessity (darurah).</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">Can I deduct my mortgage from zakatable wealth?</summary>
                <div className="px-4 pb-4 text-gray-700">Scholars differ. The Hanafi position allows deducting the full outstanding mortgage. Other scholars recommend deducting only the current year&apos;s installments. Barakah supports both methods in Fiqh Settings.</div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">Should I pay off my mortgage early to avoid riba?</summary>
                <div className="px-4 pb-4 text-gray-700">If you have a conventional mortgage, paying it off early reduces the total riba paid. Many scholars strongly encourage this. Barakah&apos;s Riba Elimination Journey can help you plan a payoff strategy.</div>
              </details>
            </div>
          </section>
          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Calculate Your Zakat Now</h2>
            <p className="text-gray-600 mb-6">Use our free, multi-madhab zakat calculator with live gold prices.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">Try Zakat Calculator</Link>
              <Link href="/signup" className="border border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">Create Free Account</Link>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/learn/zakat-on-gold" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Zakat on Gold</h3>
              <p className="text-sm text-gray-500 mt-1">Understand gold-based nisab calculations.</p>
            </Link>
            <Link href="/learn/zakat-on-retirement-accounts" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Retirement Accounts</h3>
              <p className="text-sm text-gray-500 mt-1">Navigate zakat on 401(k) and IRA.</p>
            </Link>
            <Link href="/faraid-calculator" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Faraid Calculator</h3>
              <p className="text-sm text-gray-500 mt-1">Calculate Islamic inheritance shares.</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
