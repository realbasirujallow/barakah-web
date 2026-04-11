import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import {
  PRICING,
  FREE_FEATURES,
  PLUS_FEATURES,
  FAMILY_FEATURES,
  COMPETITOR_COMPARISON,
} from '../../lib/pricing';

export const metadata: Metadata = {
  title: 'Pricing — Barakah Islamic Finance | Compare Plans',
  description:
    'Compare Barakah plans: Free, Plus ($9.99/mo), and Family ($14.99/mo). See how Barakah compares to Monarch, YNAB, and Zoya. The most affordable Islamic finance platform.',
  alternates: {
    canonical: 'https://trybarakah.com/pricing',
  },
  openGraph: {
    title: 'Pricing — Barakah Islamic Finance | Compare Plans',
    description:
      'Compare Barakah plans: Free, Plus ($9.99/mo), and Family ($14.99/mo). The most affordable Islamic finance platform with features no one else has.',
    url: 'https://trybarakah.com/pricing',
    siteName: 'Barakah',
    type: 'website',
    images: [
      {
        url: 'https://trybarakah.com/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Barakah Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Barakah Islamic Finance | Compare Plans',
    description:
      'Compare Barakah plans: Free, Plus ($9.99/mo), and Family ($14.99/mo). The most affordable Islamic finance platform.',
    images: ['https://trybarakah.com/og-pricing.png'],
  },
};

const faqItems = [
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, 30-day Plus trial on signup. No credit card required.',
  },
  {
    question: 'Can I switch plans?',
    answer: 'Yes, upgrade or downgrade anytime.',
  },
  {
    question: 'Is Barakah cheaper than Monarch?',
    answer:
      "Yes. Barakah Plus is $9.99/mo vs Monarch's $14.99/mo, with Islamic finance features Monarch doesn't offer.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Visa, Mastercard, Amex via Stripe. Apple Pay and Google Pay on mobile.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, no long-term commitment. Cancel from Settings anytime.',
  },
];

export default function PricingPage() {
  return (
    <>
      {/* FAQPage JSON-LD */}
      <Script
        id="pricing-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <article className="min-h-screen bg-gray-50">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-green-700 hover:text-green-800 font-medium">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">Pricing</span>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More affordable than Monarch, YNAB, and Zoya — with Islamic finance features they
              don&apos;t have.
            </p>
          </header>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-3 mb-12">
            <span className="text-sm font-medium text-gray-700">Monthly</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-700">Yearly</span>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              Save up to 34%
            </span>
          </div>

          {/* Plan Cards */}
          <section className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Free</h2>
                <p className="text-sm text-gray-500">For getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 ml-1">/forever</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {FREE_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Plus Plan */}
            <div className="bg-white rounded-2xl border-2 border-green-700 shadow-lg p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-green-700 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Plus</h2>
                <p className="text-sm text-gray-500">Full personal finance + Islamic tools</p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">{PRICING.plus.monthly}</span>
                <span className="text-gray-500 ml-1">{PRICING.plus.monthlyPeriod}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                or {PRICING.plus.yearly}{PRICING.plus.yearlyPeriod}{' '}
                <span className="text-green-700 font-medium">({PRICING.plus.yearlySaving})</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {PLUS_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start 30-Day Free Trial
              </Link>
            </div>

            {/* Family Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-amber-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  For Households
                </span>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Family</h2>
                <p className="text-sm text-gray-500">Shared finances for the whole household</p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">{PRICING.family.monthly}</span>
                <span className="text-gray-500 ml-1">{PRICING.family.monthlyPeriod}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                or {PRICING.family.yearly}{PRICING.family.yearlyPeriod}{' '}
                <span className="text-green-700 font-medium">({PRICING.family.yearlySaving})</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {FAMILY_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </section>

          {/* Competitor Comparison Table */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                How Barakah compares to other budgeting apps
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Same powerful budgeting features. Plus Islamic finance tools no one else has.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-white bg-green-700 rounded-tl-none">
                      Barakah Plus
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Monarch</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">YNAB</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Zoya</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITOR_COMPARISON.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-3 px-6 text-gray-700 font-medium">{row.feature}</td>
                      <td className="py-3 px-4 text-center bg-green-50 font-semibold">
                        {typeof row.barakah === 'boolean' ? (
                          row.barakah ? (
                            <span className="text-green-700 text-lg">&#10003;</span>
                          ) : (
                            <span className="text-red-400 text-lg">&#10007;</span>
                          )
                        ) : (
                          <span className="text-green-800 font-bold">{row.barakah}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.monarch === 'boolean' ? (
                          row.monarch ? (
                            <span className="text-green-600 text-lg">&#10003;</span>
                          ) : (
                            <span className="text-red-400 text-lg">&#10007;</span>
                          )
                        ) : (
                          <span className="text-gray-700">{row.monarch}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.ynab === 'boolean' ? (
                          row.ynab ? (
                            <span className="text-green-600 text-lg">&#10003;</span>
                          ) : (
                            <span className="text-red-400 text-lg">&#10007;</span>
                          )
                        ) : (
                          <span className="text-gray-700">{row.ynab}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.zoya === 'boolean' ? (
                          row.zoya ? (
                            <span className="text-green-600 text-lg">&#10003;</span>
                          ) : (
                            <span className="text-red-400 text-lg">&#10007;</span>
                          )
                        ) : (
                          <span className="text-gray-700">{row.zoya}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Frequently Asked Questions
            </h2>

            <div className="space-y-0 divide-y divide-gray-200">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group cursor-pointer py-6 hover:bg-gray-50 px-4 -mx-4"
                >
                  <summary className="flex items-center justify-between font-semibold text-gray-900 text-lg select-none">
                    <span className="flex-1">{item.question}</span>
                    <span className="transition-transform group-open:rotate-180 text-green-700 ml-4">
                      &#9660;
                    </span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 text-gray-700 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTA Section */}
          <section className="bg-gradient-to-r from-green-800 to-green-900 rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start your 30-day free trial
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              No credit card required. Get full access to Barakah Plus for 30 days and see why
              thousands of Muslims trust Barakah for their finances.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-green-800 hover:bg-green-50 font-bold py-4 px-10 rounded-lg transition-colors text-lg"
            >
              Get Started Free
            </Link>
          </section>
        </div>
      </article>
    </>
  );
}
