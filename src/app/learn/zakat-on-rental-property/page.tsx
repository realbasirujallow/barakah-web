import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Zakat on Rental Property Income — Islamic Ruling & Calculator | Barakah',
  description: 'Understand whether rental property income is subject to zakat, how different scholars approach it, and how to calculate your obligation on real estate investments.',
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-rental-property' },
};

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{"@type":"Question","name":"Do I pay zakat on my home?","acceptedAnswer":{"@type":"Answer","text":"No. Your primary residence is exempt from zakat across all schools of Islamic jurisprudence."}},{"@type":"Question","name":"What about a second home or vacation property?","acceptedAnswer":{"@type":"Answer","text":"If it is for personal use, it is exempt. If it generates rental income, the income is zakatable. If it is held for resale, the full market value is zakatable."}}],
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
            <span className="text-gray-600 dark:text-gray-400">Zakat on Rental Property</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">Zakat on Rental Property</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 dark:text-gray-300">Rental property is one of the most debated topics in Islamic zakat law. The property itself (your primary home or rental buildings) is generally NOT zakatable, but the rental income you receive IS zakatable once it enters your savings.</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Is the Property Itself Zakatable?</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">No. Real estate held for personal use or rental income is not subject to zakat on the property value. Only real estate held for resale (trading) is zakatable on its market value. This is the position of all four madhabs.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Is Rental Income Zakatable?</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">Yes. Once rental income is received and enters your bank account or savings, it becomes part of your overall zakatable wealth. If your total liquid wealth (including rental income) exceeds nisab on your hawl date, zakat is due on the entire amount.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Investment Property Held for Resale</h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">If you purchased property with the intention to flip or resell it, the full market value of the property is zakatable — similar to business inventory. This applies to real estate investors and developers.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">Do I pay zakat on my home?</summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">No. Your primary residence is exempt from zakat across all schools of Islamic jurisprudence.</div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">What about a second home or vacation property?</summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">If it is for personal use, it is exempt. If it generates rental income, the income is zakatable. If it is held for resale, the full market value is zakatable.</div>
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
