import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Eliminate Riba from Your Finances: A Muslim\'s Complete Guide 2026 | Barakah',
  description:
    'Step-by-step guide to identifying and eliminating riba (interest) from your financial life. Halal alternatives for mortgages, credit cards, loans, and savings accounts.',
  keywords: [
    'riba elimination',
    'eliminate interest islam',
    'halal mortgage alternative',
    'islamic finance no interest',
    'riba free finances',
    'halal credit card',
    'musharakah mutanaqisah',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/riba-elimination',
  },
  openGraph: {
    title: 'How to Eliminate Riba from Your Finances',
    description:
      'Complete Muslim guide to identifying and removing interest from mortgages, credit cards, loans, and savings.',
    url: 'https://trybarakah.com/learn/riba-elimination',
    type: 'article',
  },
};

const faqItems = [
  {
    question: 'Is all interest haram in Islam?',
    answer:
      'The majority of Islamic scholars hold that all forms of interest (riba) are prohibited in Islam, whether the interest is paid or received, and regardless of the amount. This is based on clear Quranic injunctions (2:275-279) and numerous hadith. The prohibition covers conventional bank interest on savings and loans, credit card interest charges, and interest-bearing bonds. Some contemporary scholars make limited exceptions for situations of genuine necessity (darurah), such as when no halal alternative exists for essential housing, but this remains a minority position and should be discussed with a knowledgeable scholar.',
  },
  {
    question: 'How do I purify riba I\'ve already earned?',
    answer:
      'Scholars recommend giving away any interest income you have already earned as sadaqah (charity) without expecting reward for it. The purpose is to cleanse your wealth, not to earn reward. You should donate the interest amount to those in need or to public benefit projects (such as sanitation, infrastructure, or feeding programs). You should not use it for mosque construction or Quran printing according to many scholars. Going forward, close or convert interest-bearing accounts and redirect future earnings to halal alternatives. Barakah can help track and calculate the exact purification amount.',
  },
  {
    question: 'Are Islamic mortgages truly riba-free?',
    answer:
      'Islamic home financing structures such as Musharakah Mutanaqisah (diminishing partnership) and Murabaha (cost-plus sale) are designed to avoid the interest-based lending model. In a diminishing partnership, the bank and buyer co-own the property; the buyer gradually purchases the bank\'s share while paying rent on the bank\'s portion. Reputable Islamic finance providers have their products certified by independent Shariah boards. While critics note that monthly payments may appear similar to conventional mortgages, the underlying contractual structure is fundamentally different — it is a sale or partnership, not a loan with interest.',
  },
  {
    question: 'Can I keep a conventional bank account?',
    answer:
      'You may keep a conventional bank account for transactional purposes (checking account for everyday spending) as long as it does not pay or charge interest. Many conventional banks offer zero-interest checking accounts. For savings, you should seek out alternatives that do not involve interest — such as Islamic banks, Mudarabah-based savings, or investing in halal assets. If your checking account incidentally earns a small amount of interest, you should donate that interest to charity as purification. Several digital banks now offer Shariah-compliant accounts in North America and Europe.',
  },
  {
    question: 'What if I can\'t avoid riba entirely?',
    answer:
      'Scholars acknowledge that avoiding riba completely can be challenging in modern financial systems, especially in non-Muslim-majority countries. The key principles are: make sincere intention to eliminate riba, take active steps to reduce exposure over time, and consult with knowledgeable scholars about your specific circumstances. Some scholars permit limited engagement with conventional finance under the principle of necessity (darurah) when no halal alternative is accessible. However, this should be treated as temporary, and you should continuously work toward full elimination. Barakah helps you track your progress and celebrate milestones along the way.',
  },
];

const halalAlternatives = [
  {
    conventional: 'Conventional Mortgage',
    halal: 'Musharakah Mutanaqisah',
    providers: 'Guidance Residential, UIF, Ameen Housing',
    notes: 'Diminishing partnership — you and the bank co-own the home; you buy out the bank\'s share over time while paying rent on their portion.',
  },
  {
    conventional: 'Credit Card Interest',
    halal: 'Halal Debit / Pay Full Balance',
    providers: 'Rizq, any debit card, or pay statement balance monthly',
    notes: 'Use debit cards that avoid interest entirely. If using a credit card for rewards, always pay the full balance before the due date to avoid any interest charges.',
  },
  {
    conventional: 'Personal Loan',
    halal: 'Qard Hasan / Murabaha',
    providers: 'Community lending circles, LaunchGood, Islamic cooperatives',
    notes: 'Qard Hasan is an interest-free loan. Murabaha is a cost-plus sale where the financier purchases the item and sells it to you at a marked-up price paid in installments.',
  },
  {
    conventional: 'Savings Account (Interest)',
    halal: 'Mudarabah / Halal ETFs / Sukuk',
    providers: 'Saturna (Amana Funds), SP Funds, Wahed Invest',
    notes: 'Mudarabah-based savings share profits and losses instead of paying fixed interest. Halal ETFs and sukuk provide Shariah-compliant growth without riba.',
  },
  {
    conventional: 'Car Loan',
    halal: 'Islamic Auto Financing / Save & Buy',
    providers: 'UIF Auto, Devon Bank, community financing',
    notes: 'Islamic auto financing uses Murabaha (cost-plus sale) or Ijarah (lease-to-own) instead of an interest-bearing loan.',
  },
  {
    conventional: 'Student Loan',
    halal: 'Scholarships / 0% Plans / Community Funds',
    providers: 'ISNA scholarships, employer tuition programs, family Qard Hasan',
    notes: 'Prioritize scholarships, grants, and employer tuition benefits. Some scholars permit interest-bearing student loans under necessity if no alternative exists, but this should be temporary.',
  },
];

export default function RibaEliminationPage() {
  return (
    <>
      <Script
        id="riba-faq-schema"
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

      <Script
        id="riba-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Eliminate Riba from Your Finances: A Muslim\'s Complete Guide',
            description:
              'Step-by-step guide to identifying and eliminating riba (interest) from your financial life.',
            url: 'https://trybarakah.com/learn/riba-elimination',
            publisher: {
              '@type': 'Organization',
              name: 'Barakah',
              url: 'https://trybarakah.com',
            },
          }),
        }}
      />

      <article className="min-h-screen bg-amber-50">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-green-700 hover:text-green-800 font-medium">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/learn" className="text-green-700 hover:text-green-800 font-medium">
                Learn
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">Riba Elimination Guide</span>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                Islamic Finance
              </span>
              <span className="text-sm text-gray-500">10 min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              How to Eliminate Riba from Your Finances
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              A practical, step-by-step guide for Muslims who want to identify and remove
              interest from their mortgages, credit cards, loans, and savings accounts.
            </p>
          </header>

          {/* What is Riba */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Is Riba and Why Is It Prohibited?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Riba (Arabic for &quot;increase&quot; or &quot;excess&quot;) refers to any
              guaranteed, predetermined return on a loan or financial transaction — what
              modern finance calls &quot;interest.&quot; The Quran explicitly and repeatedly
              prohibits riba in some of its strongest language, declaring it fundamentally
              opposed to ethical economic practice.
            </p>
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded mb-4">
              <p className="text-gray-800 font-medium mb-2">Quranic Prohibition</p>
              <p className="text-gray-700 text-sm">
                The prohibition of riba is established in multiple verses including Quran
                2:275-279, where those who deal in riba are warned severely. The Quran
                distinguishes between trade (which is permissible) and riba (which is
                forbidden), emphasizing that the two are fundamentally different even though
                they may appear similar superficially.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The wisdom behind the prohibition includes protecting the vulnerable from
              exploitation, ensuring risk is shared fairly between parties, and promoting
              real economic activity over rentier income. In a riba-based system, the lender
              profits regardless of whether the borrower succeeds — Islam requires that both
              reward and risk be shared.
            </p>
          </section>

          {/* Step 1: Audit */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-700 text-white font-bold">
                  1
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Audit Your Riba Exposure
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before you can eliminate riba, you need to know exactly where it exists in
              your financial life. Go through every financial account and relationship and
              identify all sources of interest — both interest you pay and interest you
              receive.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Common Riba Sources to Check</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Mortgage or home equity line of credit (HELOC)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Credit card balances carried past the due date</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Auto loan or car financing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Student loans (federal and private)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Savings or money market accounts earning interest</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Bonds, CDs, or fixed-income investments</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Personal loans from banks or fintech lenders</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-700 font-bold flex-shrink-0">&#8226;</span>
                  <span>Buy-now-pay-later services with deferred interest</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 2: Prioritize */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-700 text-white font-bold">
                  2
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Prioritize by Impact
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              You likely cannot eliminate all riba overnight. Prioritize based on a
              combination of the interest rate, the total interest cost, and how easy it is
              to find a halal alternative.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="font-bold text-red-700 flex-shrink-0">High Priority</span>
                <p className="text-gray-700">
                  Credit card interest (often 20%+), personal loans, and payday loans.
                  These carry the highest rates and the easiest halal alternatives exist.
                </p>
              </div>
              <div className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-700 flex-shrink-0">Medium Priority</span>
                <p className="text-gray-700">
                  Auto loans and savings account interest. Refinancing to Islamic auto
                  financing or moving savings to halal alternatives is straightforward.
                </p>
              </div>
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-bold text-blue-700 flex-shrink-0">Long-Term</span>
                <p className="text-gray-700">
                  Mortgage refinancing and student loans. These involve the largest
                  balances and may require more planning. Islamic mortgage providers are
                  growing but not yet available in all markets.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Halal Alternatives Table */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-700 text-white font-bold">
                  3
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Halal Alternatives for Every Riba Source
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              For each source of riba in your financial life, there is a Shariah-compliant
              alternative. Here is a practical reference table.
            </p>

            <div className="space-y-6">
              {halalAlternatives.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <span className="text-red-600 line-through text-sm font-medium">
                      {item.conventional}
                    </span>
                    <span className="text-gray-400 hidden sm:inline">&rarr;</span>
                    <span className="text-green-700 font-semibold">{item.halal}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{item.notes}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Providers:</span> {item.providers}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 4: Track Progress */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-700 text-white font-bold">
                  4
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Track Your Progress
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Eliminating riba is a journey, not a single event. Tracking your progress
              helps you stay motivated and accountable. Barakah&apos;s Riba Journey feature
              lets you set elimination goals for each riba source, track your progress over
              time, and celebrate milestones along the way.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What Barakah Tracks for You</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-700 font-bold flex-shrink-0">&#10003;</span>
                  <span>Total riba exposure across all accounts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-700 font-bold flex-shrink-0">&#10003;</span>
                  <span>Elimination percentage and progress over time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-700 font-bold flex-shrink-0">&#10003;</span>
                  <span>Milestone celebrations when you close a riba source</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-700 font-bold flex-shrink-0">&#10003;</span>
                  <span>Interest purification amount calculated automatically</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 5: Purify Past Riba */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-700 text-white font-bold">
                  5
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Purify Past Riba Income
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have earned interest in the past (from savings accounts, bonds, or
              other sources), scholars recommend donating that amount as sadaqah to purify
              your wealth. This is not done with the expectation of reward — it is a
              purification obligation to remove the tainted portion from your assets.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Purification Guidelines</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-700 font-bold flex-shrink-0">1.</span>
                  <span>Calculate total interest earned across all accounts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-700 font-bold flex-shrink-0">2.</span>
                  <span>Donate that exact amount to charitable causes benefiting the poor</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-700 font-bold flex-shrink-0">3.</span>
                  <span>Avoid using purification funds for mosque construction or Quran printing (according to many scholars)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-700 font-bold flex-shrink-0">4.</span>
                  <span>Public welfare projects (sanitation, clean water, food banks) are appropriate recipients</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-700 font-bold flex-shrink-0">5.</span>
                  <span>Make sincere repentance (tawbah) and resolve not to engage in riba going forward</span>
                </li>
              </ul>
            </div>
          </section>

          {/* How Barakah Helps */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How Barakah Helps You Go Riba-Free
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Auto-Detection',
                  desc: 'Connect your accounts and Barakah automatically identifies which ones involve riba — interest-bearing savings, loan payments, and more.',
                },
                {
                  title: 'Elimination Goals',
                  desc: 'Set target dates for eliminating each riba source and track your progress with visual dashboards and percentage completion.',
                },
                {
                  title: 'Milestone Tracking',
                  desc: 'Celebrate when you close an interest-bearing account or refinance to a halal alternative. Every step forward counts.',
                },
                {
                  title: 'Purification Calculator',
                  desc: 'Automatically calculate how much interest you need to purify and track your donation progress toward full purification.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">&#10003;</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-700">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Frequently Asked Questions About Riba
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

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-12 text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your Riba-Free Journey
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Create a free Barakah account to audit your riba exposure, set elimination
              goals, and track your progress toward fully halal finances.
            </p>

            <Link
              href="/signup"
              className="inline-block bg-white text-green-700 hover:bg-amber-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Create Free Account
            </Link>
          </section>

          {/* Related Articles */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Link
                href="/learn/islamic-finance-basics"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-green-700 mb-2">Islamic Finance Basics</h3>
                <p className="text-sm text-gray-600">
                  Understand the core principles of Islamic finance including risk-sharing,
                  asset-backing, and ethical screening.
                </p>
              </Link>
              <Link
                href="/learn/halal-stocks"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-green-700 mb-2">Halal Stock Investing</h3>
                <p className="text-sm text-gray-600">
                  Learn how to screen stocks for Shariah compliance and build a halal
                  investment portfolio.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
