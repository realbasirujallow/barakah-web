import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Faraid Calculator 2026 — Islamic Inheritance Distribution | Barakah',
  description:
    'Calculate Islamic inheritance shares (faraid) instantly. Supports all Quranic heirs — spouse, children, parents, siblings. Awl, Radd, and blocking rules applied automatically per Quran 4:11-12.',
  keywords: [
    'faraid calculator',
    'islamic inheritance calculator',
    'islamic estate planning',
    'quran inheritance shares',
    'muslim inheritance distribution',
    'awl radd calculator',
    'wasiyyah faraid',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/faraid-calculator',
  },
  openGraph: {
    title: 'Free Faraid Calculator — Islamic Inheritance Distribution',
    description:
      'Calculate Quranic inheritance shares for all heirs. Automatic Awl, Radd, and blocking rules.',
    url: 'https://trybarakah.com/faraid-calculator',
    type: 'article',
  },
};

const faqItems = [
  {
    question: 'What is faraid in Islam?',
    answer:
      'Faraid (also spelled fara\'id) is the Islamic science of inheritance distribution. It refers to the fixed shares prescribed in the Quran (primarily Surah An-Nisa 4:11-12 and 4:176) that determine how a deceased Muslim\'s estate is divided among eligible heirs. The word "faraid" comes from the Arabic root meaning "obligatory shares" — these portions are mandated by Allah and cannot be altered by the deceased or their family.',
  },
  {
    question: 'How are Islamic inheritance shares calculated?',
    answer:
      'Islamic inheritance follows a specific order: first, funeral expenses (tajheez) are deducted from the estate. Then all debts are settled. Next, any voluntary bequests (wasiyyah) are executed, limited to a maximum of one-third of the remaining estate. Finally, the remainder is distributed among Quranic heirs according to their fixed shares (fara\'id). If shares exceed the estate, Awl (proportional reduction) is applied. If shares leave a surplus, Radd (redistribution) may apply.',
  },
  {
    question: 'What is Awl in Islamic inheritance?',
    answer:
      'Awl is a proportional reduction mechanism used when the total fixed shares assigned to heirs exceed the available estate (i.e., shares add up to more than 100%). In Awl, the common denominator of all shares is increased so that every heir receives a proportionally reduced amount. For example, if shares total 13/12, the denominator is raised from 12 to 13, and each heir\'s fraction is adjusted accordingly. This ensures fair distribution without any heir being completely excluded.',
  },
  {
    question: 'Can I leave more than 1/3 in my wasiyyah?',
    answer:
      'Under standard Islamic inheritance law, a voluntary bequest (wasiyyah) is limited to one-third of the estate after funeral expenses and debts. This limit is based on the hadith of Sa\'d ibn Abi Waqqas, where the Prophet (peace be upon him) said "One-third, and one-third is a lot." Bequeathing more than one-third requires the unanimous consent of all heirs after the testator\'s death. Additionally, a wasiyyah cannot be made in favor of someone who is already a Quranic heir, unless other heirs consent.',
  },
  {
    question: 'What happens if shares exceed 100%?',
    answer:
      'When the total prescribed shares for all heirs add up to more than the available estate, the principle of Awl is applied. Awl proportionally reduces each heir\'s share so that the total equals exactly 100% of the distributable estate. This is a well-established principle in Islamic jurisprudence, first applied during the caliphate of Umar ibn al-Khattab (may Allah be pleased with him). Barakah\'s calculator applies Awl automatically when needed.',
  },
  {
    question: 'Does Barakah support different madhabs for inheritance?',
    answer:
      'Yes. Barakah supports inheritance calculations according to all four major Sunni schools of thought (Hanafi, Shafi\'i, Maliki, and Hanbali), as well as general AMJA-aligned guidance. Key differences between schools include whether the grandfather inherits alongside siblings, how Radd (surplus redistribution) is applied, and whether the spouse receives Radd. You can configure your preferred madhab in your Barakah profile settings.',
  },
];

const quranicShares = [
  { heir: 'Husband', share: '1/2 or 1/4', condition: '1/2 if no children; 1/4 if children exist', verse: '4:12' },
  { heir: 'Wife', share: '1/4 or 1/8', condition: '1/4 if no children; 1/8 if children exist', verse: '4:12' },
  { heir: 'Daughter(s)', share: '1/2 or 2/3', condition: '1/2 if one; 2/3 if two or more (no son)', verse: '4:11' },
  { heir: 'Father', share: '1/6 + residual', condition: '1/6 if children exist; residual if no children', verse: '4:11' },
  { heir: 'Mother', share: '1/6 or 1/3', condition: '1/6 if children/siblings; 1/3 if neither', verse: '4:11' },
  { heir: 'Full Sister(s)', share: '1/2 or 2/3', condition: '1/2 if one; 2/3 if two or more (no brother)', verse: '4:176' },
  { heir: 'Paternal Sister(s)', share: '1/2 or 2/3', condition: 'Similar to full sister when no full siblings', verse: '4:176' },
  { heir: 'Maternal Sibling(s)', share: '1/6 or 1/3', condition: '1/6 if one; 1/3 if two or more', verse: '4:12' },
];

export default function FaraidCalculatorPage() {
  return (
    <>
      <script
        id="faraid-faq-schema"
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

      <script
        id="faraid-howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How Islamic Inheritance (Faraid) Distribution Works',
            description:
              'Step-by-step process for distributing a Muslim estate according to Quranic shares.',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Deduct funeral expenses (tajheez)',
                text: 'The first obligation on the estate is to cover the funeral and burial costs of the deceased. These expenses are taken from the gross estate before any other distribution.',
              },
              {
                '@type': 'HowToStep',
                name: 'Settle all debts (dyun)',
                text: 'All outstanding debts owed by the deceased must be settled from the estate. This includes personal loans, mortgages, credit card balances, and any other financial obligations.',
              },
              {
                '@type': 'HowToStep',
                name: 'Execute voluntary bequests (wasiyyah)',
                text: 'Any voluntary bequests specified in the deceased\'s Islamic will are executed next, limited to a maximum of one-third of the remaining estate after expenses and debts.',
              },
              {
                '@type': 'HowToStep',
                name: 'Distribute remainder per Quranic shares',
                text: 'The remaining estate is distributed among Quranic heirs according to their fixed shares as prescribed in Surah An-Nisa (4:11-12, 4:176).',
              },
              {
                '@type': 'HowToStep',
                name: 'Apply Awl or Radd if needed',
                text: 'If total shares exceed the estate, Awl (proportional reduction) is applied. If shares leave a surplus with no residual heir, Radd (surplus redistribution) may return the excess to eligible heirs.',
              },
            ],
          }),
        }}
      />

      <script
        id="faraid-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Barakah Faraid Calculator',
            description:
              'Free Islamic inheritance calculator supporting all Quranic heirs with automatic Awl, Radd, and blocking rules.',
            url: 'https://trybarakah.com/faraid-calculator',
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
              <span className="text-gray-700">Faraid Calculator</span>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Free Islamic Inheritance Calculator (Faraid)
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
              Calculate Quranic inheritance shares for all heirs instantly. Automatic Awl,
              Radd, and blocking rules applied per Quran 4:11-12 and 4:176.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-green-700 font-bold">&#10003;</span>
                <span className="text-sm font-medium text-gray-700">All 4 Madhabs Supported</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-green-700 font-bold">&#10003;</span>
                <span className="text-sm font-medium text-gray-700">Awl &amp; Radd Auto-Applied</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-green-700 font-bold">&#10003;</span>
                <span className="text-sm font-medium text-gray-700">PDF Export</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="bg-green-700 text-white hover:bg-green-800 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Try the Faraid Calculator Free
              </Link>
              <Link
                href="/learn/islamic-will"
                className="border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Learn About Islamic Wills
              </Link>
            </div>
          </header>

          {/* How Faraid Works */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              How Faraid Works: 5-Step Estate Distribution
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
                    Deduct Funeral Expenses (Tajheez)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The first charge on the estate is the cost of preparing and burying the
                    deceased. This includes shrouding (kafan), washing, transportation, and
                    burial plot costs. These are taken from the gross estate before any other
                    distribution. Scholars agree that funeral expenses should be reasonable and
                    not extravagant.
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
                    Settle All Debts (Dyun)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All outstanding debts owed by the deceased must be paid from the estate.
                    This includes personal loans, mortgages, credit card balances, medical
                    bills, and any other financial obligations. Debts owed to Allah (such as
                    unpaid zakat or kaffarah) are also settled at this stage. The Prophet
                    (peace be upon him) emphasized the importance of settling debts before
                    inheritance distribution.
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
                    Execute Voluntary Bequests (Wasiyyah)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The deceased&apos;s voluntary bequests are executed next, limited to a
                    maximum of one-third of the remaining estate. A wasiyyah cannot be made
                    in favor of a Quranic heir (unless other heirs consent after death). This
                    is the mechanism for leaving something to non-heirs such as charitable
                    organizations, friends, or adopted children who do not inherit by default
                    under Islamic law.
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
                    Distribute Remainder per Quranic Shares (Fara&apos;id)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The remaining estate is distributed among eligible heirs according to
                    their Quranic shares. These fixed shares are prescribed in Surah An-Nisa
                    (4:11-12 and 4:176) and cannot be altered. Heirs include the spouse,
                    children, parents, and in some cases siblings and other relatives. Sons
                    receive double the share of daughters when they inherit together as
                    residual heirs (asabah).
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
                    Apply Awl or Radd If Needed
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    If the total fixed shares exceed the estate (e.g., shares add up to
                    more than 100%), Awl (proportional reduction) is applied to reduce each
                    share fairly. If the shares total less than the estate and there is no
                    residual heir (asabah), Radd (surplus redistribution) returns the excess
                    to eligible heirs proportionally. Scholars differ on whether the spouse
                    receives Radd — the Hanafi school includes the spouse in Radd (Uthmani
                    view), while other schools exclude the spouse.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quranic Share Table */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Quranic Inheritance Share Table
            </h2>
            <p className="text-gray-700 mb-6">
              The following table summarizes the fixed shares prescribed in the Quran for
              primary heirs. Actual distribution depends on which heirs are present and may
              involve blocking rules, residual sharing, or Awl/Radd adjustments.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Heir</th>
                    <th className="px-4 py-3 text-left font-semibold">Share</th>
                    <th className="px-4 py-3 text-left font-semibold">Condition</th>
                    <th className="px-4 py-3 text-left font-semibold">Quran Verse</th>
                  </tr>
                </thead>
                <tbody>
                  {quranicShares.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{row.heir}</td>
                      <td className="px-4 py-3 text-green-700 font-semibold">{row.share}</td>
                      <td className="px-4 py-3 text-gray-700">{row.condition}</td>
                      <td className="px-4 py-3 text-gray-600">{row.verse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Note: Sons and other male residual heirs (asabah) do not have fixed shares
              but inherit the remainder after fixed-share holders receive their portions.
              When a son and daughter inherit together, the son receives twice the
              daughter&apos;s share.
            </p>
          </section>

          {/* Why Use Barakah's Faraid Calculator */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Why Use Barakah&apos;s Faraid Calculator
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Multi-Madhab Support',
                  desc: 'Configure your preferred school of thought and see how rulings differ on grandfather-with-siblings, Radd distribution, and blocking rules.',
                },
                {
                  title: 'Awl & Radd Auto-Applied',
                  desc: 'When shares exceed or fall short of the estate, proportional adjustments are calculated automatically — no manual math needed.',
                },
                {
                  title: 'PDF Export',
                  desc: 'Generate a detailed PDF report of your inheritance distribution to share with family members, lawyers, or estate planners.',
                },
                {
                  title: 'Tied to Your Wasiyyah',
                  desc: 'Connect your faraid calculation to your Islamic will (wasiyyah) in Barakah so your estate plan is always complete and consistent.',
                },
                {
                  title: 'Blocking Rules Explained',
                  desc: 'See exactly which heirs are blocked or partially blocked by other heirs, with clear explanations of why.',
                },
                {
                  title: 'Scenario Comparison',
                  desc: 'Compare inheritance outcomes across different family configurations to understand how adding or removing heirs changes the distribution.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">&#10003;</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-700">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Frequently Asked Questions About Faraid
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

          {/* Backed by Quran & Sunnah */}
          <section className="bg-green-900 rounded-xl p-8 mb-12 text-white text-center">
            <p className="text-xs uppercase tracking-wider font-semibold text-green-300 mb-3">Grounded in Quran &amp; Sunnah</p>
            <blockquote className="text-lg md:text-xl font-semibold mb-3 leading-relaxed italic max-w-2xl mx-auto">
              &ldquo;Allah commands you regarding your children: the share of the male shall be twice that of the female&rdquo;
            </blockquote>
            <p className="text-green-300 text-sm font-medium">Quran 4:11</p>
            <p className="text-green-200 text-xs mt-4 max-w-xl mx-auto">
              Barakah&apos;s faraid engine implements the inheritance rules prescribed in Surah An-Nisa (4:11-12, 4:176) with automatic Awl, Radd, and blocking rules. We are a calculation tool — not a fatwa service. Consult a qualified scholar for specific rulings.
            </p>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-12 text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Calculate Your Faraid Now — Free
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Create a free Barakah account to use the full faraid calculator with
              multi-madhab support, PDF export, and integration with your Islamic will.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="bg-white text-green-700 hover:bg-amber-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/#features"
                className="border-2 border-white text-white hover:bg-white hover:text-green-700 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Learn More
              </Link>
            </div>
          </section>

          {/* Internal Links / Related Resources */}
          <section className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link
                href="/learn/islamic-will"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-green-700 mb-2">Islamic Will Guide</h3>
                <p className="text-sm text-gray-600">
                  Learn how to create a Shariah-compliant will (wasiyyah) and why every Muslim needs one.
                </p>
              </Link>
              <Link
                href="/zakat-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-green-700 mb-2">Zakat Calculator</h3>
                <p className="text-sm text-gray-600">
                  Calculate your zakat obligation with live nisab references and fiqh-aware guidance.
                </p>
              </Link>
              <Link
                href="/learn"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-green-700 mb-2">Islamic Finance Library</h3>
                <p className="text-sm text-gray-600">
                  Browse all our guides on zakat, inheritance, halal investing, and riba elimination.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
