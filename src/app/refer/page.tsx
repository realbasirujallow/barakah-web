import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refer a Friend — Give 1 Free Month, Get 1 Free Month | Barakah',
  description:
    'Share Barakah with friends and family. When they sign up and verify their email, you both get 1 free month of fiqh-aware household finance tools for Muslim families.',
  keywords: [
    'barakah referral',
    'islamic finance app referral',
    'halal finance referral',
    'barakah refer a friend',
    'muslim finance app referral program',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/refer',
  },
  openGraph: {
    title: 'Refer a Friend — Give 1 Free Month, Get 1 Free Month | Barakah',
    description:
      'Share Barakah with friends and family. When they sign up and verify their email, you both get 1 free month of Barakah.',
    url: 'https://trybarakah.com/refer',
    type: 'website',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does the Barakah referral program work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Share your unique referral code with friends and family. When they sign up for Barakah using your code and verify their email, both you and your friend each receive 1 extra free month automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many friends can I refer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no limit to the number of friends you can refer. Each successful referral earns both you and your friend 1 extra free month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a Plus subscription to refer friends?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Any Barakah user with a free or paid account can refer friends. When your friend signs up and verifies their email, you both receive the referral reward automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'When do I receive my free month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your free month is credited automatically once your referred friend verifies their email address. If you already have an active paid plan or trial, the extra month is added on top of your existing access.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can my friend use any plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The referral reward is triggered when your friend signs up through your link and verifies their email address.',
      },
    },
  ],
};

const steps = [
  {
    number: '1',
    icon: '🔗',
    title: 'Share Your Code',
    description:
      'Log in to your Barakah account and grab your unique referral code from the dashboard. Share it with friends, family, or your community.',
  },
  {
    number: '2',
    icon: '👤',
    title: 'Friend Signs Up',
    description:
      'Your friend creates a Barakah account using your referral code and verifies their email address.',
  },
  {
    number: '3',
    icon: '🎉',
    title: 'Both Get 1 Free Month',
    description:
      'Once your friend verifies their email, you both receive 1 extra free month automatically. No limits on how many friends you can refer.',
  },
];

const plusBenefits = [
  { icon: '✅', text: 'Halal stock screener with 30,000+ stocks' },
  { icon: '🛡️', text: 'Riba detector for interest-free living' },
  { icon: '🔄', text: 'Subscription detector to flag haram services' },
  { icon: '📊', text: 'Barakah Score and financial analytics' },
  { icon: '💎', text: 'Net worth and investment tracking' },
  { icon: '📜', text: 'Wasiyyah and Waqf planning tools' },
  { icon: '📈', text: 'Unlimited transactions' },
  { icon: '📄', text: 'Export reports as CSV or PDF' },
];

export default function ReferPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />

      {/* ── Nav ── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">
            🌙 Barakah
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/#features" className="hover:text-[#1B5E20] transition">
              Features
            </Link>
            <Link href="/#pricing" className="hover:text-[#1B5E20] transition">
              Pricing
            </Link>
            <Link href="/learn" className="hover:text-[#1B5E20] transition">
              Learn
            </Link>
            <Link href="/contact" className="hover:text-[#1B5E20] transition">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#1B5E20] font-medium hover:underline"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-[#1B5E20]/10 text-[#1B5E20] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Referral Program
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-6 leading-tight">
            Give 1 Free Month,
            <br />
            Get 1 Free Month
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Share Barakah with your friends and family. When they sign up and
            verify their email, you both receive a free month. Help your community build a
            more thoughtful Muslim household finance system while earning rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/referral"
              className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition text-base"
            >
              Get Your Referral Code
            </Link>
            <Link
              href="/signup"
              className="border-2 border-[#1B5E20] text-[#1B5E20] px-8 py-3.5 rounded-lg font-semibold hover:bg-green-50 transition text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1B5E20] mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Three simple steps to earn 1 free month for you and your friend with each successful referral.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-[#FFF8E1] rounded-2xl p-8 text-center relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1B5E20] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <div className="text-4xl mb-4 mt-2">{step.icon}</div>
                <h3 className="text-lg font-bold text-[#1B5E20] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Connector arrows on desktop */}
          <div className="hidden md:flex justify-center mt-6">
            <p className="text-sm text-gray-500 italic">
              No limits on referrals &mdash; each successful referral earns 1 free month.
            </p>
          </div>
        </div>
      </section>

      {/* ── Plus Benefits ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1B5E20] mb-4">
            What You Get with Plus
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Both you and your friend unlock these premium features for a full month &mdash; completely free.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plusBenefits.map((benefit) => (
              <div
                key={benefit.text}
                className="bg-white rounded-xl p-5 shadow-sm border border-green-100 flex items-start gap-3"
              >
                <span className="text-xl flex-shrink-0">{benefit.icon}</span>
                <p className="text-sm text-gray-700 font-medium leading-snug">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/#pricing"
              className="text-[#1B5E20] font-semibold underline hover:text-[#2E7D32] transition"
            >
              View all Plus features &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Callout ── */}
      <section className="py-16 px-6 bg-[#1B5E20]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Spread the Barakah
          </h2>
          <p className="text-green-100 text-lg mb-8 leading-relaxed">
            The Prophet (peace be upon him) said: &ldquo;The best of people are
            those that bring the most benefit to the rest of mankind.&rdquo;
            Help your community take control of their halal finances.
          </p>
          <Link
            href="/dashboard/referral"
            className="inline-block bg-white text-[#1B5E20] px-8 py-3.5 rounded-lg font-semibold hover:bg-green-50 transition text-base"
          >
            Get Your Referral Code
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1B5E20] mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FaqSchema.mainEntity.map((item, i) => (
              <details
                key={i}
                className="group bg-[#FFF8E1] rounded-xl p-5 cursor-pointer"
              >
                <summary className="font-semibold text-[#1B5E20] list-none flex items-center justify-between gap-4">
                  <span>{item.name}</span>
                  <span className="text-xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                  {item.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-4">
            Ready to Start Referring?
          </h2>
          <p className="text-gray-600 mb-8">
            Log in to your account to get your unique referral code, or sign up
            to join Barakah today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/referral"
              className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition text-base"
            >
              Get Your Referral Code
            </Link>
            <Link
              href="/signup"
              className="border-2 border-[#1B5E20] text-[#1B5E20] px-8 py-3.5 rounded-lg font-semibold hover:bg-green-50 transition text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[#1B5E20] transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#1B5E20] transition">
              Privacy
            </Link>
            <Link href="/disclaimer" className="hover:text-[#1B5E20] transition">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-[#1B5E20] transition">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
