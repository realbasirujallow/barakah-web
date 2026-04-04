import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Calculator from './Calculator';
import NisabLivePrices, { GoldPricePerGram, SilverPricePerGram, GoldNisabUSD, SilverNisabUSD } from '../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Free Zakat Calculator 2026 — Calculate Your Zakat Instantly | Barakah',
  description:
    'Calculate your zakat in 60 seconds with our free online zakat calculator. Supports gold, silver, cash, savings, investments, retirement accounts, and business assets. Updated nisab threshold for 2026.',
  keywords: [
    'zakat calculator',
    'how to calculate zakat',
    'zakat calculator 2026',
    'nisab threshold',
    'zakat on savings',
    'zakat on gold',
    'islamic finance calculator',
    'how much zakat do I owe',
    'zakat percentage',
    '2.5 percent zakat',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/zakat-calculator',
  },
  openGraph: {
    title: 'Free Zakat Calculator 2026 — Calculate Zakat on All Assets',
    description:
      'The most comprehensive free zakat calculator online. Gold, silver, cash, stocks, retirement accounts, business assets. Live nisab prices. All four madhabs supported.',
    url: 'https://trybarakah.com/zakat-calculator',
    siteName: 'Barakah',
    type: 'website',
    images: [
      {
        url: 'https://trybarakah.com/og-zakat-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Barakah Zakat Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Zakat Calculator 2026 — Calculate Your Zakat Instantly',
    description: 'Calculate zakat on all your assets with our comprehensive Islamic calculator.',
    images: ['https://trybarakah.com/og-zakat-calculator.png'],
  },
};

// FAQ data for structured data and display
const faqItems = [
  {
    question: 'How much is zakat on $10,000?',
    answer:
      'If $10,000 is your net wealth after debts and you meet the nisab threshold (based on 85 grams of gold at current market prices), you would owe 2.5% of your total zakatable wealth in zakat. For example, if your total net wealth is $10,000 and exceeds the nisab, your zakat would be $10,000 × 2.5% = $250. Use our live calculator for exact amounts with current gold prices.',
  },
  {
    question: 'Do I pay zakat on my house?',
    answer:
      'No. Your primary residence is not subject to zakat according to all four Islamic schools of thought. However, if you own rental property, vacation homes, or investment real estate held for resale, the value or rental income may be zakatable depending on how it is classified and managed.',
  },
  {
    question: 'Is zakat due on retirement accounts (401k, IRA)?',
    answer:
      'There are three scholarly positions on retirement accounts. The Hanafi school typically excludes them from zakat since you cannot access them freely. The Maliki and Hanbali schools generally include them. Many contemporary scholars recommend consulting your local imam about your specific situation, as tax penalties and restrictions may affect the calculation.',
  },
  {
    question: 'When should I pay my zakat?',
    answer:
      'Zakat becomes due after one Islamic lunar year (hawl) has passed since you first met the nisab threshold with that wealth. You should track the anniversary date (in the Islamic calendar) and pay by the end of that lunar year. The month of Ramadan is a popular time to pay zakat, but it is due whenever your anniversary arrives.',
  },
  {
    question: 'What is the difference between zakat and sadaqah?',
    answer:
      'Zakat is an obligatory pillar of Islam (one of the Five Pillars) calculated at 2.5% of wealth held for one lunar year above the nisab threshold. Sadaqah is voluntary charity that can be given at any time in any amount. While zakat is mandatory, sadaqah is encouraged and has tremendous spiritual reward.',
  },
  {
    question: 'Do I pay zakat on gold jewelry?',
    answer:
      'This depends on your Islamic school of thought. The Shafii, Maliki, and Hanbali schools typically require zakat on all gold jewelry, even if worn regularly. The Hanafi school often exempts gold jewelry worn by women for personal adornment. Consult with your imam for clarity on your madhab.',
  },
  {
    question: 'How do I calculate zakat on investments and stocks?',
    answer:
      'Calculate zakat on investments at their current market value. If you own stocks worth $5,000 on your zakat anniversary date, that full value is subject to zakat. Dividends and capital gains should be included in your total wealth calculation. Use the net value after brokerage fees and commissions.',
  },
  {
    question: 'What if my wealth fluctuates during the year?',
    answer:
      'What matters is the value of your wealth on your zakat anniversary date (one lunar year after you first met nisab). Small fluctuations during the year do not require recalculation. However, if you experience a significant change (inheritance, major loss, business sale), consult your imam about how it affects your zakat calculation.',
  },
  {
    question: 'Who are the eligible recipients of zakat?',
    answer:
      'According to the Quran (Surah At-Taubah 9:60), zakat must be given to eight categories: the poor, the needy, those employed to collect zakat, those whose hearts are to be won over, freeing slaves, those in debt, those in the way of Allah (jihad fi sabilillah), and travelers. Zakat cannot be given to family members you are obligated to support, nor to non-Muslims (though general charity to non-Muslims is permissible).',
  },
];

export default function ZakatCalculatorPage() {
  return (
    <>
      <Script
        id="zakat-calculator-schema"
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
        id="zakat-howtocalculate-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Calculate Zakat',
            description: 'A comprehensive guide to calculating your zakat obligation',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Determine if you meet the nisab threshold',
                text: 'Check if your net wealth (assets minus debts) exceeds the nisab threshold, based on 85 grams of gold at current market prices. The nisab is the minimum amount of wealth required for zakat to be obligatory. Use Barakah\'s calculator for the live nisab value.',
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate your total zakatable wealth',
                text: 'Add up all your zakatable assets: cash, savings, gold, silver, investments, business inventory, rental property income, and other applicable assets. Include the value of precious metals at current market prices.',
              },
              {
                '@type': 'HowToStep',
                name: 'Deduct any outstanding debts',
                text: 'Subtract all liabilities from your total assets. This includes mortgages, personal loans, credit card debt, and other financial obligations. The nisab exemption is applied to net wealth after debts.',
              },
              {
                '@type': 'HowToStep',
                name: 'Apply the 2.5% zakat rate',
                text: 'Multiply your total zakatable wealth (net wealth above nisab) by 0.025 (2.5%). This gives you the amount of zakat you owe. The 2.5% rate is established in Islamic law and is the standard across all schools of thought.',
              },
              {
                '@type': 'HowToStep',
                name: 'Pay to eligible recipients',
                text: 'Distribute your zakat to eligible recipients: the poor, the needy, those employed to collect zakat, those whose hearts are to be won over, those in bondage, those in debt, those in the way of Allah, and travelers. Ensure the recipients meet Islamic criteria.',
              },
            ],
          }),
        }}
      />

      <Script
        id="zakat-calculator-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Barakah Zakat Calculator',
            description:
              'Free online zakat calculator supporting gold, silver, cash, savings, investments, retirement accounts, and business assets',
            url: 'https://trybarakah.com/zakat-calculator',
            applicationCategory: 'FinanceApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />

      <article className="min-h-screen bg-amber-50">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-green-700 hover:text-green-800 font-medium">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">Zakat Calculator</span>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Free Zakat Calculator 2026
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
              Calculate your zakat obligation in under 60 seconds. Trusted by thousands of Muslims
              worldwide for accurate, easy zakat calculations.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-green-700 font-bold">✓</span>
                <span className="text-sm font-medium text-gray-700">AMJA Methodology</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-green-700 font-bold">✓</span>
                <span className="text-sm font-medium text-gray-700">Live Gold Prices</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-green-700 font-bold">✓</span>
                <span className="text-sm font-medium text-gray-700">All 4 Madhabs</span>
              </div>
            </div>
          </header>

          {/* Quick Answer Box (Featured Snippet Target) */}
          <section className="bg-white rounded-xl shadow-md border-l-4 border-green-700 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is Zakat?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Zakat is an obligatory charitable payment in Islam, calculated as <strong>2.5% of your
              net wealth</strong> held for one Islamic lunar year (hawl) above the nisab threshold.
              The nisab is the minimum amount of wealth required for zakat to become obligatory,
              based on 85 grams of gold or 595 grams of silver at current market prices.
            </p>
            {/* Live nisab card — values fetched from backend API */}
            <NisabLivePrices />
          </section>

          {/* Interactive Calculator Component */}
          <section className="mb-12">
            <Calculator />
          </section>

          {/* How to Calculate Zakat - Step by Step */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              How to Calculate Zakat: Step-by-Step Guide
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-700 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Determine if you meet the nisab threshold
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Calculate your total net wealth by adding all your assets and subtracting all
                    your debts. If this net wealth is less than the nisab threshold (currently <GoldNisabUSD /> based on 85g of gold), zakat is not obligatory for you. Zakat is only due when your
                    wealth exceeds the minimum threshold set by Islamic law.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Calculate your total zakatable wealth
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Add up all your zakatable assets. This includes: cash and bank accounts, gold
                    and silver (at current market value), stocks and investment portfolios,
                    cryptocurrency, business inventory, rental property value or income, and other
                    liquid or semi-liquid assets. Exclude your primary residence, personal vehicles,
                    and household items used for personal consumption.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-700 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Deduct any debts and liabilities
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Subtract all outstanding debts and financial obligations from your total
                    assets. This includes mortgages, personal loans, credit card balances, business
                    loans, and any other amounts you owe to others. The nisab exemption applies to
                    your net wealth after debts are deducted.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-700 text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Apply the 2.5% zakat rate to zakatable wealth
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Take your net wealth after debts, subtract the nisab threshold, and multiply
                    the remaining amount by 2.5% (or 0.025). This is the amount of zakat you owe.
                    The 2.5% rate is unanimous across all four Islamic schools of thought (madhabs)
                    and is established from the Quran and Sunnah.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-700 text-white font-bold text-lg">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Pay your zakat to eligible recipients
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Distribute your zakat amount to eligible recipients. These are the eight
                    categories specified in the Quran: the poor, the needy, zakat workers,
                    converting Muslims, freeing slaves, those in debt, those striving in Allah's
                    way, and travelers. You cannot give zakat to family members you are obligated to
                    support. Ensure you keep records of your zakat payments for accountability.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What Assets Are Zakatable */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Which Assets Are Subject to Zakat?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Zakatable Assets */}
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-4">Zakatable Assets</h3>
                <ul className="space-y-3">
                  {[
                    'Cash and bank accounts (checking, savings, money market)',
                    'Gold and silver jewelry (except personal items based on madhab)',
                    'Stocks, bonds, mutual funds, and investment portfolios',
                    'Cryptocurrency and digital assets',
                    'Business inventory and stock in trade',
                    'Rental property income (or property value, depending on method)',
                    'Accounts receivable and outstanding loans made to others',
                    'Precious metals held for investment purposes',
                  ].map((asset, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="text-green-700 font-bold flex-shrink-0">✓</span>
                      <span>{asset}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exempt Assets */}
              <div>
                <h3 className="text-xl font-semibold text-amber-700 mb-4">Typically Exempt</h3>
                <ul className="space-y-3">
                  {[
                    'Primary residence (home you live in)',
                    'Personal vehicles used for transportation',
                    'Household furniture and personal belongings',
                    'Clothing and shoes for personal use',
                    'Books and educational materials',
                    'Tools and equipment used for work/trade',
                    'Food and supplies for household consumption',
                    'Items of sentimental value (except precious metals)',
                  ].map((asset, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="text-amber-700 font-bold flex-shrink-0">—</span>
                      <span>{asset}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Retirement Accounts Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Retirement Accounts (401k, IRA, Roth IRA)</h4>
              <p className="text-gray-700 mb-3">
                There are three scholarly positions on retirement accounts:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>
                  <strong>Hanafi School:</strong> Excludes retirement accounts since you cannot
                  access them freely without penalty.
                </li>
                <li>
                  <strong>Shafii & Hanbali Schools:</strong> Include them as part of zakatable wealth
                  at their current balance value.
                </li>
                <li>
                  <strong>Maliki School:</strong> Varies based on the nature of restrictions and
                  access terms.
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Many contemporary scholars recommend consulting your local imam to determine which
                position aligns with your circumstances and madhab.
              </p>
            </div>
          </section>

          {/* Nisab Threshold Explained */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Understanding the Nisab Threshold in 2026
            </h2>

            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                The nisab threshold is the minimum amount of wealth you must have before zakat
                becomes obligatory. Islamic law establishes nisab in terms of precious metals to
                maintain consistency regardless of currency fluctuations.
              </p>

              {/* Gold Standard */}
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gold Standard (Zahab)</h3>
                <p className="text-gray-700 mb-3">
                  <strong>85 grams of gold</strong> at current market price. This currently equals approximately <GoldNisabUSD /> (at <GoldPricePerGram /> per gram). This is the
                  primary standard used in Islamic jurisprudence.
                </p>
                <p className="text-sm text-gray-600">
                  The gold standard is preferred by many scholars because gold maintains more stable
                  value over time compared to silver and is used in jewelry and savings globally.
                </p>
              </div>

              {/* Silver Standard */}
              <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Silver Standard (Fiddah)</h3>
                <p className="text-gray-700 mb-3">
                  <strong>595 grams of silver</strong> at current market price. This currently equals approximately <SilverNisabUSD /> (at <SilverPricePerGram /> per gram).
                </p>
                <p className="text-sm text-gray-600">
                  The silver standard is much lower, as silver is less valuable per unit. According
                  to the Hanafi, Hanbali, and some Maliki scholars, you may choose either standard.
                </p>
              </div>

              {/* The Lower of Two Approach */}
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Al-Qaradawi's "Lower of Two" Approach
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Many contemporary Islamic scholars, including the prominent jurist Yusuf
                  Al-Qaradawi and the Assembly of Muslim Jurists of America (AMJA), recommend using
                  the <strong>lower of the two nisab amounts</strong> (gold or silver standard) to
                  be more cautious and ensure zakat is paid when due. This means if the gold standard
                  is higher, use the gold standard amount. This approach aims to ensure more people
                  pay zakat and the obligation is not overlooked. Our calculator uses this
                  methodology.
                </p>
              </div>

              {/* Nisab Timeline */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">One Lunar Year (Hawl)</h3>
                <p className="text-gray-700 mb-4">
                  Zakat becomes obligatory only after you have held wealth at or above the nisab
                  threshold for <strong>one full Islamic lunar year (hawl)</strong>. This is
                  approximately 354-355 days, which is about 11 days shorter than the solar year.
                </p>
                <div className="bg-white p-4 rounded border border-gray-300 text-sm text-gray-700">
                  <p className="font-medium mb-2">Example Timeline:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>April 3, 2026: Your wealth first exceeds the nisab threshold</li>
                    <li>April 3, 2027: One lunar year has passed (approximately)</li>
                    <li>By April 3, 2027: You must pay your zakat</li>
                    <li>The amount owed is 2.5% of your wealth on April 3, 2027</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Frequently Asked Questions About Zakat
            </h2>

            <div className="space-y-0 divide-y divide-gray-200">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group cursor-pointer py-6 hover:bg-gray-50 px-4 -mx-4"
                >
                  <summary className="flex items-center justify-between font-semibold text-gray-900 text-lg marker:text-green-700 select-none">
                    <span className="flex-1">{item.question}</span>
                    <span className="transition-transform group-open:rotate-180 text-green-700 ml-4">
                      ▼
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
          <section className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Track Your Zakat Automatically?
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Muslims using Barakah to calculate, track, and manage their zakat
              with confidence. Our zakat tracker helps you monitor your wealth throughout the year
              and never miss a payment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/signup"
                className="bg-white text-green-700 hover:bg-amber-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/features"
                className="border-2 border-white text-white hover:bg-white hover:text-green-700 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Learn More
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              {[
                { icon: '📊', title: 'Auto-Calculate', desc: 'From linked assets' },
                { icon: '📅', title: 'Hawl Tracking', desc: 'Know your anniversary' },
                { icon: '✓', title: 'Payment Records', desc: 'Track what you gave' },
              ].map((feature, idx) => (
                <div key={idx} className="text-white">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-green-100">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Resources */}
          <section className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                For more information about zakat and Islamic finance, consult these resources:
              </p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>
                  <a
                    href="https://www.amjaonline.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline font-medium"
                  >
                    Assembly of Muslim Jurists of America (AMJA)
                  </a>
                  — Authoritative Islamic legal guidance for Muslims in North America
                </li>
                <li>
                  <a
                    href="https://www.islamicrelief.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline font-medium"
                  >
                    Islamic Relief
                  </a>
                  — Trusted international charity for zakat distribution
                </li>
                <li>
                  <a
                    href="https://www.zakat.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline font-medium"
                  >
                    Zakat Foundation International
                  </a>
                  — Educational resources and zakat collection
                </li>
                <li>
                  Consult with your local imam or Islamic scholar for personalized guidance on your
                  specific situation and madhab
                </li>
              </ul>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
