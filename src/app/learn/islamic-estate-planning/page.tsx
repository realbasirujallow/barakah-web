import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Islamic Estate Planning — Protect Your Family’s Future | Barakah',
  description: 'Plan your estate according to Islamic law. Cover wasiyyah, faraid, waqf, and outstanding obligations before it becomes a crisis.',
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-estate-planning' },
};

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
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
            <span className="text-gray-600">Islamic Estate Planning</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Islamic Estate Planning</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">Plan your estate according to Islamic law. Cover wasiyyah, faraid, waqf, and outstanding obligations before it becomes a crisis.</p>
          
          
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
