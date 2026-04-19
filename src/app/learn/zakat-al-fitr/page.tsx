import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat al-Fitr 2026: Amount, Rules & Calculator | Barakah',
  description: 'Complete guide to zakat al-fitr for Eid 2026. Learn the amount, when to pay, who must pay, and the scholarly basis from Sahih Bukhari.',
  keywords: ['zakat al fitr', 'zakat al fitr calculator', 'how much is zakat al fitr', 'when to pay zakat al fitr', 'fitrah amount 2026'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/zakat-al-fitr',
  },
  openGraph: {
    title: 'Zakat al-Fitr 2026: Amount, Rules & Calculator | Barakah',
    description: 'Master zakat al-fitr with 2026 amounts and complete Islamic guidance for Eid al-Fitr.',
    url: 'https://trybarakah.com/learn/zakat-al-fitr',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is zakat al-fitr?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat al-fitr (also called fitrah) is a special type of zakat due at the end of Ramadan before Eid al-Fitr prayers. Unlike zakat al-mal (annual wealth zakat), it is obligatory on every Muslim (even children) and has a fixed per-person amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much is zakat al-fitr in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat al-fitr is one sa\' (approximately 2.25 kg or 4.75 lbs) of food per person, or its monetary equivalent. The monetary amount varies by type of food and local prices, typically ranging from $7-$15 USD per person for 2026.',
      },
    },
    {
      '@type': 'Question',
      name: 'When do I pay zakat al-fitr?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat al-fitr must be paid before the Eid al-Fitr prayer. It can be paid anytime during Ramadan, but most scholars emphasize paying before Eid to ensure the poor can benefit from it on the day of celebration.',
      },
    },
  ],
};

export default function ZakatAlFitrPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <div className="flex items-center gap-3">
              <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
              <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
              <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Zakat al-Fitr</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Zakat al-Fitr 2026: Amount, Rules & Calculator</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">Complete guide to zakat al-fitr (fitrah) for Eid al-Fitr with 2026 amounts and Islamic fiqh references.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>5 min read</span>
                <span>Published: March 2026 • Last updated: April 3, 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#what-is" className="text-[#1B5E20] hover:underline">What is Zakat al-Fitr?</Link></li>
                <li><Link href="#how-much" className="text-[#1B5E20] hover:underline">How Much to Pay</Link></li>
                <li><Link href="#when" className="text-[#1B5E20] hover:underline">When to Pay</Link></li>
                <li><Link href="#who-pays" className="text-[#1B5E20] hover:underline">Who Must Pay</Link></li>
                <li><Link href="#recipients" className="text-[#1B5E20] hover:underline">Who Receives It</Link></li>
                <li><Link href="#vs-zakat-mal" className="text-[#1B5E20] hover:underline">vs Zakat al-Mal</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQs</Link></li>
              </ul>
            </nav>

            <section id="what-is" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What is Zakat al-Fitr?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Zakat al-Fitr (also known as <strong>fitrah</strong>) is a special obligatory charity due at the end of Ramadan, before the Eid al-Fitr prayer. It is unique among Islamic obligations because it is not based on wealth thresholds (nisab) — rather, it is due on every single Muslim regardless of income or assets.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The purpose of zakat al-fitr is to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 dark:text-gray-300">
                <li><strong>Purify the fast:</strong> It atones for any shortcomings or mistakes in fasting during Ramadan</li>
                <li><strong>Aid the poor:</strong> It ensures the poor and needy can celebrate Eid with dignity, food, and basic necessities</li>
                <li><strong>Foster community:</strong> It emphasizes the equality and unity of all Muslims on the day of celebration</li>
              </ul>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Hadith Reference</h3>
                <p className="text-gray-700 text-sm italic dark:text-gray-300">
                  &quot;The Messenger of Allah (peace be upon him) enjoined Zakat al-Fitr on every Muslim, slave or free, male or female, small or big, and it is one sa&apos; of dates or barley.&quot; — Sahih Bukhari (1503)
                </p>
              </div>
            </section>

            <section id="how-much" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How Much to Pay</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The amount of zakat al-fitr is <strong>one sa&apos;</strong> per person. A sa&apos; is a traditional Islamic unit of measurement:
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3">What is One Sa&apos;?</h3>
                <ul className="space-y-2 text-gray-700 text-sm dark:text-gray-300">
                  <li><strong className="text-blue-900">Modern metric equivalent:</strong> Approximately 2.25 kilograms (kg) or 4.75 pounds (lbs)</li>
                  <li><strong className="text-blue-900">Volume measure:</strong> About 4-5 cups or 1 gallon</li>
                  <li><strong className="text-blue-900">Types of food:</strong> A sa&apos; of dates, barley, wheat, raisins, or any basic grain that was common in 7th-century Arabia</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-[#1B5E20] mt-6 mb-4">2026 Zakat al-Fitr Amounts (USD)</h3>
              <p className="text-gray-700 text-sm mb-4 dark:text-gray-300">
                The monetary equivalent depends on the cost of the food chosen. Here are typical 2026 estimates:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Food Type</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Per Person Amount</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Family of 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Dates</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$12-15</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$60-75</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Wheat/Flour</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$7-10</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$35-50</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Rice</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$8-12</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$40-60</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Barley</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$7-9</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">$35-45</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-bold text-amber-900 mb-3">2026 Recommended Amount (AMJA)</h3>
                <p className="text-gray-700 text-sm mb-2 dark:text-gray-300">
                  Many Islamic organizations recommend a standard amount for ease of calculation. For 2026, a common guideline is:
                </p>
                <p className="text-amber-900 font-mono font-semibold">$12 per person (or local equivalent)</p>
                <p className="text-gray-700 text-sm mt-2 dark:text-gray-300">
                  This ensures adequate support for the poor while respecting the spirit of the obligation across various food costs.
                </p>
              </div>
            </section>

            <section id="when" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">When to Pay Zakat al-Fitr</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Time to pay:</strong> Before the Eid al-Fitr prayer (typically in the early morning on Eid day)
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>When it can be paid:</strong> Anytime during Ramadan, though most scholars emphasize paying before Eid prayer to ensure the poor benefit on the day of celebration.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Timing Guidance</h3>
                <ul className="space-y-2 text-gray-700 text-sm dark:text-gray-300">
                  <li><strong className="text-[#1B5E20]">Ideal:</strong> Pay 1-2 days before Eid (last 1-2 days of Ramadan) or on the morning of Eid before prayer</li>
                  <li><strong className="text-[#1B5E20]">Acceptable:</strong> Anytime in the last week of Ramadan</li>
                  <li><strong className="text-[#1B5E20]">Avoid:</strong> Delaying until after the Eid prayer (it becomes invalid if not paid beforehand)</li>
                </ul>
              </div>
            </section>

            <section id="who-pays" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Who Must Pay Zakat al-Fitr?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Zakat al-fitr is obligatory on <strong>every Muslim</strong> who:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 dark:text-gray-300">
                <li>Has food that exceeds their basic needs for the day</li>
                <li>Reaches the end of Ramadan (sunset of the last day)</li>
                <li>Is Muslim (of any age, gender, or circumstance)</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3">Special Cases</h3>
                <div className="space-y-3 text-gray-700 text-sm dark:text-gray-300">
                  <p>
                    <strong className="text-blue-900">Children:</strong> Parents or guardians pay on behalf of children (even newborns). This is based on the hadith mentioning zakat al-fitr on &quot;slave or free, male or female, small or big.&quot;
                  </p>
                  <p>
                    <strong className="text-blue-900">Servants/employees:</strong> The employer typically pays, though the servant may pay their own share if they wish.
                  </p>
                  <p>
                    <strong className="text-blue-900">Elderly/ill:</strong> Still obligatory. If they cannot pay themselves, a family member may pay on their behalf.
                  </p>
                  <p>
                    <strong className="text-blue-900">Non-fasters:</strong> Even if someone didn&apos;t fast Ramadan (due to valid reasons or travel), they still owe zakat al-fitr.
                  </p>
                </div>
              </div>
            </section>

            <section id="recipients" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Who Receives Zakat al-Fitr?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Zakat al-fitr is specifically for the poor and needy, distributed to those who need food and basic necessities for Eid. Recipients should typically be:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 dark:text-gray-300">
                <li><strong>The poor (fuqara):</strong> Those with no income or minimal means</li>
                <li><strong>The needy (masakin):</strong> Those with insufficient means for basic needs</li>
                <li><strong>Priority to local community:</strong> Most scholars emphasize giving to the poor in your own community first</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mt-4 dark:text-gray-300">
                <strong>Note:</strong> Zakat al-fitr is distinct from zakat al-mal. You cannot use zakat al-fitr amounts for non-poor recipients (like students, mosques, or da&apos;wah projects), though other forms of sadaqah (voluntary charity) may go to those categories.
              </p>
            </section>

            <section id="vs-zakat-mal" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat al-Fitr vs Zakat al-Mal</h2>
              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Aspect</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Zakat al-Fitr</th>
                      <th className="border border-gray-300 p-3 text-left dark:border-gray-600">Zakat al-Mal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">When Due</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">End of Ramadan (before Eid prayer)</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">After holding wealth for 1 lunar year</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Who Pays</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Every Muslim (no nisab required)</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Those with wealth above nisab</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Amount</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">1 sa&apos; of food per person (~2.25kg)</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">2.5% of total wealth</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Purpose</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Purify the fast, aid poor for Eid</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Annual wealth purification</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="border border-gray-300 p-3 font-semibold dark:border-gray-600">Frequency</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Once per year (at Eid only)</td>
                      <td className="border border-gray-300 p-3 dark:border-gray-600">Once per year (on anniversary)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I pay zakat al-fitr before Ramadan?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Most scholars say no — zakat al-fitr becomes obligatory specifically at the end of Ramadan, not before. However, paying during the last week of Ramadan is widely accepted. Paying after Eid prayer is not valid.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I can&apos;t find the specific food mentioned (dates, barley)?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Use the monetary equivalent of any basic food. In modern times, rice, wheat flour, or other staple foods are acceptable. The intent is to ensure the poor have food for Eid, not to be strictly limited to historical foods.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I combine zakat al-fitr with zakat al-mal donations?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  While both go to the poor, they are technically separate obligations. It&apos;s best to track them separately to ensure you fulfill both properly. However, if you give generously to the poor beyond the nisab, this is acceptable practice.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I travel on Eid? Do I still owe zakat al-fitr?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Yes, zakat al-fitr is still obligatory when traveling. You should pay it before leaving on your journey or arrange for someone to distribute it on your behalf before Eid prayer.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I give zakat al-fitr to an organization instead of directly to the poor?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Yes, you can give to a trustworthy Islamic organization, masjid, or charity that distributes to the poor. This is acceptable, but ensure the organization directly serves the needy on or before Eid day.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Calculate Your Zakat al-Fitr</h2>
              <p className="text-green-100">
                Use Barakah to calculate the exact amount you owe and donate directly to qualified recipients.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800"
              >
                Open Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/islamic-finance-basics"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Islamic Finance Basics</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Understand zakat as a pillar of Islamic finance and charitable giving.</p>
                </Link>
                <Link
                  href="/learn/zakat-on-savings"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Savings</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Calculate zakat on your liquid assets and savings accounts.</p>
                </Link>
              </div>
            </section>

            {/* Author Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last updated:</strong> April 3, 2026</p>
              <p className="mt-2">Content based on Islamic fiqh from AMJA, Fiqh Council, and hadith sources including Sahih Bukhari (1503) and other classical collections.</p>
            </footer>
          </article>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fiqh-aware household finance for modern Muslim families.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/zakat-on-gold" className="hover:text-[#1B5E20] transition">Zakat on Gold</Link></li>
                  <li><Link href="/learn/nisab" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500 dark:text-gray-400 dark:border-gray-700">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
