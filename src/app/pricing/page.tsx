import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPETITOR_COMPARISON } from '../../lib/pricing';
import {
  DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL,
  DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL,
} from '../../lib/trial';
import PricingToggle from './PricingToggle';

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
      `Yes. Every signup gets ${DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} of Barakah Plus free, no credit card or debit card required. You can cancel or downgrade at any point; if you do nothing, your account drops to Free when the trial ends.`,
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
      <script
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

          {/* Interactive Billing Toggle + Plan Cards */}
          <PricingToggle />

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
                    <th className="text-center py-4 px-4 font-semibold text-white bg-green-700">Barakah Plus</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Monarch</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">YNAB</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Zoya</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Copilot</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITOR_COMPARISON.map((row, idx) => {
                    const cell = (val: boolean | string, highlight = false) => (
                      <td className={`py-3 px-4 text-center ${highlight ? 'bg-green-50 font-semibold' : ''}`}>
                        {typeof val === 'boolean' ? (
                          val
                            ? <span className={`text-lg ${highlight ? 'text-green-700' : 'text-green-600'}`}>&#10003;</span>
                            : <span className="text-red-400 text-lg">&#10007;</span>
                        ) : (
                          <span className={highlight ? 'text-green-800 font-bold' : 'text-gray-700'}>{val}</span>
                        )}
                      </td>
                    );
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-6 text-gray-700 font-medium">{row.feature}</td>
                        {cell(row.barakah, true)}
                        {cell(row.monarch)}
                        {cell(row.ynab)}
                        {cell(row.zoya)}
                        {cell(row.copilot)}
                      </tr>
                    );
                  })}
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
              Start your {DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free Plus trial
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              No credit card or debit card required. Every new account gets {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} of Barakah Plus on the house &mdash; run a zakat calc, link an account, and see why Muslim households choose Barakah over Monarch, YNAB, or Zoya.
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
