import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Zakat on 401(k) — How to Calculate Zakat on Retirement Accounts | Barakah',
  description: 'Learn the scholarly positions on zakat for 401(k), IRA, Roth IRA, and other retirement accounts. Calculate your accessible value and zakat obligation.',
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-401k' },
};

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{"@type":"Question","name":"Do I pay zakat on my employer match?","acceptedAnswer":{"@type":"Answer","text":"Most scholars say yes — the employer match is wealth you own even if you did not contribute it directly."}},{"@type":"Question","name":"What about Roth IRA?","acceptedAnswer":{"@type":"Answer","text":"Roth IRAs are funded with after-tax money. You can withdraw contributions (not earnings) penalty-free. Scholars generally treat the contribution portion as fully zakatable."}}],
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
            <span className="text-gray-600">Zakat on 401(k) Retirement Accounts</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Zakat on 401(k) Retirement Accounts</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">Retirement accounts like 401(k)s, IRAs, and Roth IRAs present a unique zakat challenge because the money is restricted — early withdrawals trigger taxes and penalties. Scholars offer three main approaches.</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Three Scholarly Approaches</h2>
            <p className="text-gray-700 leading-relaxed">1. Full Accessible Value (AMJA/Majority): Calculate zakat on what you could access today after estimated taxes and penalties. 2. Employer Match Only: Only the employer-contributed portion is zakatable since you did not earn it from labor. 3. Deferred Until Withdrawal: Pay zakat when you actually withdraw funds.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Calculate (Accessible Value)</h2>
            <p className="text-gray-700 leading-relaxed">Take your current 401(k) balance. Subtract estimated federal tax (~22%), state tax (~5%), and early withdrawal penalty (~10%). The result is your accessible value. Multiply by 2.5% for your zakat.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Example Calculation</h2>
            <p className="text-gray-700 leading-relaxed">401(k) balance: $100,000. Estimated taxes + penalty: ~$37,000. Accessible value: $63,000. If your total wealth exceeds nisab: Zakat = $63,000 x 2.5% = $1,575.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">Do I pay zakat on my employer match?</summary>
                <div className="px-4 pb-4 text-gray-700">Most scholars say yes — the employer match is wealth you own even if you did not contribute it directly.</div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">What about Roth IRA?</summary>
                <div className="px-4 pb-4 text-gray-700">Roth IRAs are funded with after-tax money. You can withdraw contributions (not earnings) penalty-free. Scholars generally treat the contribution portion as fully zakatable.</div>
              </details>
            </div>
          </section>
          <RamadanEmailCapture source="learn-zakat-on-401k" variant="inline" />

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
