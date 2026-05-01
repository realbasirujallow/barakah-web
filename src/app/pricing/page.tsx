import type { Metadata } from 'next';
import { PRICING } from '../../lib/pricing';
import {
  DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL,
} from '../../lib/trial';
import PricingPageClient from './PricingPageClient';

// Pricing strings come from the PRICING constant so SEO metadata can
// never drift from the pricing-card UI. Previously hardcoded "$9.99/mo"
// and "$14.99/mo" — if PRICING ever changed, the SERP snippet would
// stale-link to the wrong number for days.
const PLUS_MONTHLY = `${PRICING.plus.monthly}${PRICING.plus.monthlyPeriod}`;
const FAMILY_MONTHLY = `${PRICING.family.monthly}${PRICING.family.monthlyPeriod}`;

export const metadata: Metadata = {
  title: 'Pricing — Barakah Islamic Finance | Compare Plans',
  description:
    `Compare Barakah plans: Free, Plus (${PLUS_MONTHLY}), and Family (${FAMILY_MONTHLY}). See how Barakah compares to Monarch, YNAB, and Zoya. The most affordable Islamic finance platform.`,
  alternates: {
    canonical: 'https://trybarakah.com/pricing',
  },
  openGraph: {
    title: 'Pricing — Barakah Islamic Finance | Compare Plans',
    description:
      `Compare Barakah plans: Free, Plus (${PLUS_MONTHLY}), and Family (${FAMILY_MONTHLY}). The most affordable Islamic finance platform with features no one else has.`,
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

      <PricingPageClient />
    </>
  );
}
