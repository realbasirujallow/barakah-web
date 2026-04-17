import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title:
    'How Your Madhab Affects Your Finances: Hanafi, Shafi\'i, Maliki & Hanbali Differences | Barakah',
  description:
    'Understand how your Islamic school of thought (madhab) affects zakat calculation, jewelry zakatabillity, hawl tracking, and wasiyyah rules. Compare Hanafi, Shafi\'i, Maliki, and Hanbali positions.',
  keywords: [
    'madhab zakat differences',
    'hanafi zakat rules',
    'shafi zakat jewelry',
    'maliki zakat al fitr',
    'hanbali riba rules',
    'islamic school of thought finance',
    'fiqh finance',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/madhab-finance',
  },
  openGraph: {
    title: 'How Your Madhab Affects Your Finances',
    description:
      'Compare Hanafi, Shafi\'i, Maliki & Hanbali rulings on zakat, jewelry, hawl, debt, and wasiyyah.',
    url: 'https://trybarakah.com/learn/madhab-finance',
    type: 'article',
  },
};

const faqItems = [
  {
    question: 'Can I mix madhabs for financial rulings?',
    answer:
      'The practice of selectively picking rulings from different madhabs (known as "talfiq") is a debated topic among scholars. Many traditional scholars advise following one madhab consistently to maintain coherence in your religious practice. However, some contemporary scholars permit following a different madhab on specific issues if done with knowledge and sincere intention — not merely to seek the easiest opinion. The safest approach is to consult with a knowledgeable scholar if you feel the need to deviate from your primary madhab on a financial matter. Barakah allows you to set one default madhab for consistency.',
  },
  {
    question: 'Is gold jewelry zakatable?',
    answer:
      'This is one of the most significant points of difference between the madhabs. The Hanafi school holds that gold and silver jewelry is zakatable regardless of whether it is worn regularly — the precious metal content makes it wealth that must be purified through zakat. The Shafi\'i, Maliki, and Hanbali schools generally exempt personal jewelry that is worn regularly and is of a normal amount for the wearer\'s social context. However, all schools agree that jewelry kept for storage, investment, or resale is zakatable. The AMJA (Assembly of Muslim Jurists of America) leans toward the Hanafi position as the conservative default.',
  },
  {
    question: 'Which nisab standard should I use — gold or silver?',
    answer:
      'The classical Hanafi position uses the silver standard (595 grams of silver) as the nisab threshold, which results in a much lower threshold and makes more people eligible to pay zakat. The other three schools traditionally use the gold standard (85 grams of gold). Many contemporary scholars, including those at AMJA, recommend the gold standard as the primary benchmark because gold maintains more stable purchasing power in the modern economy. Some scholars recommend using whichever standard is lower at the time of calculation (the "lower of two" approach) to be cautious. Barakah defaults to the gold standard but allows you to configure your preference.',
  },
  {
    question: 'Does Barakah support all four madhabs?',
    answer:
      'Yes. Barakah supports rulings from all four major Sunni schools of thought (Hanafi, Shafi\'i, Maliki, and Hanbali) as well as general AMJA-aligned guidance for North American Muslims. When you configure your madhab in your Barakah profile, all calculations — zakat, jewelry treatment, debt deduction, hawl tracking, wasiyyah limits, and faraid distribution — automatically adjust to reflect your school\'s rulings. You can also compare how different madhabs would affect your calculations without changing your default.',
  },
];

const comparisonRows = [
  {
    rule: 'Gold jewelry zakatable?',
    hanafi: 'Yes',
    shafii: 'No (if worn)',
    maliki: 'No (if worn)',
    hanbali: 'No (if worn)',
    amja: 'Yes (conservative)',
  },
  {
    rule: 'Zakat al-Fitr payment',
    hanafi: 'Money OK',
    shafii: 'Food only',
    maliki: 'Food staples',
    hanbali: 'Food or money',
    amja: 'Money recommended',
  },
  {
    rule: 'Debt deduction from zakat',
    hanafi: 'Annual installment',
    shafii: 'Full balance',
    maliki: 'Annual only',
    hanbali: 'Full balance',
    amja: 'Annual installment',
  },
  {
    rule: 'Hawl reset on nisab drop',
    hanafi: 'No',
    shafii: 'Yes',
    maliki: 'No',
    hanbali: 'Yes',
    amja: 'No',
  },
  {
    rule: 'Wasiyyah > 1/3 with heir consent',
    hanafi: 'Yes',
    shafii: 'No',
    maliki: 'No',
    hanbali: 'No',
    amja: 'No',
  },
  {
    rule: 'Radd includes spouse',
    hanafi: 'Yes (Uthmani)',
    shafii: 'No',
    maliki: 'No',
    hanbali: 'No',
    amja: 'No',
  },
];

export default function MadhabFinancePage() {
  return (
    <>
      <Script
        id="madhab-faq-schema"
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
        id="madhab-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'How Your Madhab Affects Your Finances: Hanafi, Shafi\'i, Maliki & Hanbali Differences',
            description:
              'Compare how the four major Islamic schools of thought differ on zakat, jewelry, hawl, debt deduction, and wasiyyah rules.',
            url: 'https://trybarakah.com/learn/madhab-finance',
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
        <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
              <span className="text-gray-700 dark:text-gray-300">Madhab &amp; Finance</span>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                Fiqh
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">8 min read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              How Your Madhab Affects Your Finances
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl dark:text-gray-300">
              Compare Hanafi, Shafi&apos;i, Maliki, and Hanbali rulings on zakat, jewelry,
              hawl tracking, debt deduction, and wasiyyah — and understand why your school
              of thought matters for your money.
            </p>
          </header>

          {/* Why Madhab Matters */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              Why Your Madhab Matters in Finance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              While all four Sunni schools of thought agree on the fundamentals of Islamic
              finance — the prohibition of riba, the obligation of zakat, and the Quranic
              inheritance system — they differ on important details that directly affect how
              much zakat you owe, how your estate is distributed, and what counts as
              zakatable wealth.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              These differences are not arbitrary. They arise from different interpretive
              methodologies (usul al-fiqh) applied to the same Quranic verses and hadith.
              Each madhab represents centuries of careful scholarly analysis, and all four
              positions are considered valid within Sunni Islam.
            </p>
            <div className="bg-green-50 border-l-4 border-green-700 p-6 rounded">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Practical impact:</span> Depending on your
                madhab, you might owe zakat on your gold jewelry or not. Your debt might be
                fully deducted or only partially. Your zakat al-fitr might need to be food or
                can be money. These differences can amount to hundreds or thousands of dollars
                annually.
              </p>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">
              Madhab Comparison: Key Financial Rulings
            </h2>
            <p className="text-gray-700 mb-6 dark:text-gray-300">
              The following table summarizes the key differences between the four madhabs
              and AMJA general guidance on financial matters most relevant to Muslim
              households in the West.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-3 py-3 text-left font-semibold">Rule</th>
                    <th className="px-3 py-3 text-left font-semibold">Hanafi</th>
                    <th className="px-3 py-3 text-left font-semibold">Shafi&apos;i</th>
                    <th className="px-3 py-3 text-left font-semibold">Maliki</th>
                    <th className="px-3 py-3 text-left font-semibold">Hanbali</th>
                    <th className="px-3 py-3 text-left font-semibold">AMJA</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100">{row.rule}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{row.hanafi}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{row.shafii}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{row.maliki}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{row.hanbali}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{row.amja}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Deep Dives */}
          <section className="space-y-8 mb-8">
            {/* Gold Jewelry */}
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                Gold Jewelry: Zakatable or Exempt?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                This is perhaps the most well-known point of disagreement between the
                schools. The Hanafi position, based on the apparent (zahir) meaning of the
                hadith that require zakat on gold and silver, treats all gold and silver as
                zakatable wealth — including jewelry worn regularly. The reasoning is that
                gold retains its nature as a medium of exchange regardless of its form.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The Shafi&apos;i, Maliki, and Hanbali schools exempt personal jewelry that is
                worn regularly and is of a normal amount for the wearer&apos;s social
                context. Their reasoning is based on hadith indicating that personal-use
                items are not zakatable, and that jewelry worn for adornment (as opposed to
                storage) is akin to personal clothing. All schools agree that jewelry kept
                for investment or storage is zakatable.
              </p>
            </div>

            {/* Zakat al-Fitr */}
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                Zakat al-Fitr: Food or Money?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                The Shafi&apos;i and Maliki schools require that zakat al-fitr be paid in
                food staples (such as dates, barley, wheat, or rice) based on the hadith
                specifying these items. The Hanafi school permits paying in monetary value,
                arguing that the underlying purpose is to benefit the poor — and money may
                be more useful to recipients than food in many modern contexts.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The Hanbali school allows both food and money. AMJA and many North American
                scholars recommend monetary payment as more practical and beneficial for
                recipients in Western countries where food banks are well-established but
                cash assistance may be more needed.
              </p>
            </div>

            {/* Debt Deduction */}
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                Debt Deduction: How Much Can You Subtract?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                When calculating zakatable wealth, debts are subtracted from your assets.
                But how much debt you can deduct varies significantly by madhab. The Hanafi
                and Maliki schools limit the deduction to the annual installment (what is
                due in the coming year), while the Shafi&apos;i and Hanbali schools allow
                deducting the full outstanding balance of your debt.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                This difference has enormous practical impact. If you have a $300,000
                mortgage, the Shafi&apos;i position would let you deduct the entire balance,
                potentially eliminating your zakat obligation entirely. The Hanafi position
                would only allow deducting the annual payment (perhaps $20,000-$30,000),
                leaving a much larger zakatable base. AMJA aligns with the annual
                installment approach.
              </p>
            </div>

            {/* Hawl Reset */}
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                Hawl Reset: What Happens When Wealth Drops Below Nisab?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                If your wealth drops below the nisab threshold during the year, does your
                hawl (lunar year timer) reset? The Hanafi and Maliki schools say no — as
                long as your wealth is at or above nisab at the beginning and end of the
                hawl period, brief dips below nisab during the year do not reset the clock.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The Shafi&apos;i and Hanbali schools are stricter — if your wealth drops
                below nisab at any point during the hawl, the timer resets and a new hawl
                begins from the date your wealth rises above nisab again. This means
                irregular income earners or freelancers may find their hawl frequently
                resetting under these schools.
              </p>
            </div>

            {/* Wasiyyah Limit */}
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                Wasiyyah Beyond One-Third: With Heir Consent?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                The standard rule across all schools is that a voluntary bequest (wasiyyah)
                is limited to one-third of the estate. However, the Hanafi school uniquely
                permits exceeding this limit if all eligible heirs unanimously consent
                after the testator&apos;s death.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The Shafi&apos;i, Maliki, and Hanbali schools do not recognize this
                exception — the one-third limit is absolute regardless of heir consent. This
                difference matters for families who may wish to allocate a larger portion to
                charitable causes, adopted children, or non-heir family members.
              </p>
            </div>

            {/* Radd and Spouse */}
            <div className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">
                Radd Distribution: Does the Spouse Get Surplus?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                When fixed Quranic shares total less than the estate and there is no
                residual heir (asabah), the surplus is redistributed to eligible heirs
                through Radd. A key difference is whether the surviving spouse participates
                in this redistribution.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The Hanafi school, following the Uthmani view (attributed to the Caliph
                Uthman ibn Affan), includes the spouse in Radd, meaning the spouse receives
                a share of the surplus in proportion to their original Quranic share. The
                Shafi&apos;i, Maliki, and Hanbali schools exclude the spouse from Radd —
                the surplus is distributed only among blood-related heirs.
              </p>
            </div>
          </section>

          {/* How Barakah Handles This */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">
              How Barakah Handles Madhab Differences
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              Barakah is designed to respect your school of thought without making
              assumptions. When you set up your profile, you select your preferred madhab,
              and all financial calculations automatically adjust.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'One-Time Configuration',
                  desc: 'Set your madhab once in your profile. Every zakat calculation, hawl tracker, and faraid distribution reflects your school\'s rulings automatically.',
                },
                {
                  title: 'Side-by-Side Comparison',
                  desc: 'Curious how another madhab would affect your zakat? Compare calculations across all four schools without changing your default.',
                },
                {
                  title: 'Scholarly References',
                  desc: 'Every ruling applied to your calculations includes a reference to the relevant scholarly source so you can verify with your local imam.',
                },
                {
                  title: 'AMJA Default',
                  desc: 'If you are unsure which madhab to follow, Barakah offers an AMJA-aligned general setting based on contemporary North American scholarship.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">&#10003;</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-gray-100">{feature.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Which Madhab Should I Follow */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              Which Madhab Should I Follow?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              If you already follow a specific madhab — whether by family tradition,
              geographic origin, or personal study — continue following it consistently.
              Consistency in one school prevents the problematic cherry-picking of easy
              opinions across schools.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              If you do not currently follow a specific madhab, the best approach is to
              follow the guidance of your local scholars and community. In North America,
              many scholars recommend the AMJA-aligned approach, which draws from all four
              schools based on the strongest evidence for each issue.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Key principle:</span> Choose a school (or
                follow your local scholars) and be consistent. The differences between
                madhabs exist because qualified scholars interpreted the evidence
                differently — all four positions are valid, and following any one of them
                with sincerity fulfills your obligation before Allah.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-8 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200 dark:text-gray-100 dark:border-gray-700">
              Frequently Asked Questions
            </h2>

            <div className="space-y-0 divide-y divide-gray-200">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group cursor-pointer py-6 hover:bg-gray-50 px-4 -mx-4"
                >
                  <summary className="flex items-center justify-between font-semibold text-gray-900 text-lg select-none dark:text-gray-100">
                    <span className="flex-1">{item.question}</span>
                    <span className="transition-transform group-open:rotate-180 text-green-700 ml-4">
                      &#9660;
                    </span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-200 text-gray-700 leading-relaxed dark:text-gray-300 dark:border-gray-700">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-12 text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Configure Your Madhab in Barakah
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Create a free account and set your preferred school of thought. All zakat,
              faraid, and hawl calculations will automatically reflect your madhab&apos;s
              rulings.
            </p>

            <Link
              href="/signup"
              className="inline-block bg-white text-green-700 hover:bg-amber-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg dark:bg-gray-800"
            >
              Create Free Account
            </Link>
          </section>

          {/* Related Articles */}
          <section className="bg-white rounded-xl shadow-md p-8 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link
                href="/learn/zakat-on-gold"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all dark:border-gray-700"
              >
                <h3 className="font-semibold text-green-700 mb-2">Zakat on Gold</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed guide on when and how zakat applies to gold jewelry, coins, and
                  bullion.
                </p>
              </Link>
              <Link
                href="/learn/nisab-threshold"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all dark:border-gray-700"
              >
                <h3 className="font-semibold text-green-700 mb-2">Nisab Threshold</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understanding the gold and silver nisab standards and which one to use.
                </p>
              </Link>
              <Link
                href="/methodology"
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-700 hover:shadow-md transition-all dark:border-gray-700"
              >
                <h3 className="font-semibold text-green-700 mb-2">Our Methodology</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn how Barakah sources its Islamic rulings and which scholars inform
                  our calculations.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
