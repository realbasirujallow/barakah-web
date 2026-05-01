import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices, { GoldPricePerGram, GoldNisabUSD } from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Zakat on Gold & Jewelry: Complete 2026 Guide | Barakah',
  description: 'Complete guide to calculating zakat on gold, jewelry, and silver. Learn about nisab thresholds, Hanafi vs Shafi\'i positions, and 2026 gold prices.',
  keywords: ['zakat on gold', 'zakat on gold jewelry', 'how to calculate zakat on gold', 'is jewelry zakatable', 'gold nisab'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/zakat-on-gold',
  },
  openGraph: {
    title: 'Zakat on Gold & Jewelry: Complete 2026 Guide | Barakah',
    description: 'Calculate zakat on gold with our complete guide covering nisab, calculation methods, and scholarly positions.',
    url: 'https://trybarakah.com/learn/zakat-on-gold',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the nisab for gold?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The nisab for gold is 85 grams (approximately 2.747 troy ounces), as recommended by AMJA. Some scholars use a lower threshold based on silver (approximately 612 grams or 21 troy ounces of gold value equivalent).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is gold jewelry zakatable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This depends on the school of fiqh you follow. In Barakah\'s fiqh settings, Hanafi and Hanbali calculations treat gold and silver jewelry as zakatable, while Shafi\'i and Maliki settings generally exempt personal jewelry worn regularly. Jewelry held for storage, resale, or investment is generally treated as zakatable.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate zakat on gold?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the total weight of your gold (in grams) by the current market price per gram, then multiply by 2.5% (0.025). Use Barakah\'s zakat calculator for live gold prices and automatic calculations.',
      },
    },
  ],
};

export default function ZakatOnGoldPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Zakat on Gold</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          {/* Article Header */}
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Zakat on Gold & Jewelry: Complete 2026 Guide</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">Master the rules for calculating zakat on gold, jewelry, and silver with accurate 2026 prices and scholarly guidance.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>8 min read</span>
                <span>Published: March 2026 • Last updated: April 3, 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#nisab" className="text-[#1B5E20] hover:underline">What is the Nisab for Gold?</Link></li>
                <li><Link href="#calculation" className="text-[#1B5E20] hover:underline">How to Calculate Zakat on Gold</Link></li>
                <li><Link href="#jewelry" className="text-[#1B5E20] hover:underline">Is Gold Jewelry Zakatable?</Link></li>
                <li><Link href="#comparison" className="text-[#1B5E20] hover:underline">Gold vs Silver Nisab</Link></li>
                <li><Link href="#mistakes" className="text-[#1B5E20] hover:underline">Common Mistakes</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">Frequently Asked Questions</Link></li>
              </ul>
            </nav>

            {/* Main Content */}
            <section id="nisab" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What is the Nisab for Gold?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The nisab (minimum threshold) for gold is the amount you must possess for zakat to become obligatory. A widely used contemporary standard, including AMJA guidance for North America, is <strong>85 grams</strong> (approximately 2.747 troy ounces).
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                At the current market price of <GoldPricePerGram /> per gram, this equates to approximately <GoldNisabUSD />. Gold prices fluctuate daily, so always use today&apos;s market rate.
              </p>
              {/* Live nisab card */}
              <NisabLivePrices />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Did you know?</h3>
                <p className="text-blue-900 text-sm">
                  The nisab amount comes from the Sunnah. Prophet Muhammad (peace be upon him) established that zakat is due on gold and silver above certain thresholds. Classical Islamic jurisprudence applies these principles to modern contexts.
                </p>
              </div>
            </section>

            <section id="calculation" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How to Calculate Zakat on Gold</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Calculating zakat on gold is straightforward once you have the current market price:
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside dark:text-gray-300">
                <li><strong>Gather all your gold.</strong> Include coins, bars, jewelry, and any other gold items you own.</li>
                <li><strong>Weigh in grams.</strong> Use a precise scale to measure the total weight. If you have mixed metals, weigh only the pure gold content.</li>
                <li><strong>Verify the current market price.</strong> Check the daily spot price of gold per gram (typically in USD).</li>
                <li><strong>Apply the formula:</strong> Total Weight (grams) × Price per Gram × 2.5% = Your Zakat Due</li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example Calculation</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Your total gold: <strong>150 grams</strong></p>
                  <p>Current gold price: <GoldPricePerGram /> per gram (live)</p>
                  <p>Formula: 150g × price per gram = total value</p>
                  <p>Zakat due: total value × 2.5%</p>
                </div>
                <p className="text-xs text-amber-700 mt-3">Use Barakah&apos;s <Link href="/zakat-calculator" className="underline">zakat calculator</Link> for exact calculations with live prices.</p>
              </div>
            </section>

            <section id="jewelry" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Is Gold Jewelry Zakatable?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                This is one of the most common questions about zakat on gold. The answer depends on which school of Islamic law you follow:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Hanafi and Hanbali Settings</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    <strong>Jewelry is generally treated as zakatable.</strong> In Barakah&apos;s fiqh settings, these approaches count gold and silver jewelry as part of zakatable wealth even if it is worn regularly.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Shafi&apos;i and Maliki Settings</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    <strong>Personal jewelry worn regularly is generally exempt.</strong> Jewelry held for savings, resale, or investment is still treated as zakatable.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed font-semibold bg-yellow-50 border border-yellow-200 p-4 rounded dark:text-gray-300">
                <strong>Recommendation:</strong> Follow the fiqh guidance you trust and stay consistent. If you are unsure, ask a qualified imam whether your regularly worn jewelry should be counted or exempted.
              </p>
            </section>

            <section id="comparison" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Gold vs Silver Nisab</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Islamic law establishes nisab thresholds for both gold and silver. Here&apos;s how they compare:
              </p>

              {/* Live comparison table — values fetched from API */}
              <NisabLivePrices variant="table" />

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Which Should You Use?</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong className="text-[#1B5E20]">Gold Standard (85g):</strong> Use this if you follow the AMJA recommendation or most contemporary scholars.</li>
                  <li><strong className="text-[#1B5E20]">Silver Standard (595g):</strong> Use if you follow classical Hanafi jurisprudence. Some scholars apply the &quot;lower of two&quot; approach, using whichever nisab is lower at the time of calculation.</li>
                  <li><strong className="text-[#1B5E20]">Al-Qaradawi&apos;s Position:</strong> Many modern scholars recommend using the lower threshold to ensure zakat is definitely due, maximizing compliance.</li>
                </ul>
              </div>
            </section>

            <section id="mistakes" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Common Mistakes to Avoid</h2>
              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-red-600">Forgetting mixed metals:</strong> If you have 14K or 18K gold jewelry, calculate only the gold content (purity percentage), not the total weight.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-red-600">Using old prices:</strong> Gold prices change daily. Always use the current spot price for accurate calculations.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-red-600">Not checking the lunar year:</strong> Zakat is due after possessing nisab for one complete Islamic (lunar) year. Many calculate it on the Gregorian calendar by mistake.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-red-600">Excluding stored jewelry:</strong> Some people only count coins or bars but forget jewelry they keep for savings, resale, or long-term storage. If your fiqh position treats that jewelry as wealth, include it.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 dark:text-gray-300"><strong className="text-red-600">Confusing resale value with market price:</strong> Use the current spot price of gold, not what a jeweler would pay for it (which is typically 20-30% less).</p>
                </div>
              </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I inherit gold? Do I calculate zakat on inherited gold?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Yes, if you inherit gold and possess it for one complete lunar year, zakat becomes due on it like any other gold you own. Count it from the moment you inherit it and fulfill the lunar year requirement.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Is gold plating zakatable?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Only the gold content counts toward zakat. Gold plating on jewelry (like plated silver) has such minimal gold that it is typically not zakatable on its own. However, if the underlying metal (e.g., silver) reaches its own nisab, that becomes zakatable.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I pay zakat on gold in cash instead of physical gold?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Yes, you may pay the equivalent cash value of the gold&apos;s market price. Many scholars prefer this for convenience, and Barakah&apos;s calculator helps you convert your metal holdings into a clear cash zakat amount.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What about gold coins or bullion?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Gold coins and bullion are fully zakatable. Include them in your total weight along with jewelry. If coins contain other metals, calculate only the gold content.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I include gold I&apos;m holding for someone else?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  No. If you are holding gold on trust for another person (as a custodian), you are not responsible for zakat on it. The owner must pay zakat. However, if it is a loan or you have ownership rights, you must include it.
                </p>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Ready to Calculate Your Zakat on Gold?</h2>
              <p className="text-green-100">
                Use Barakah&apos;s zakat calculator to compute your obligations across all asset classes with live gold and silver prices, your chosen madhab&apos;s rules, and per-asset hawl tracking.
              </p>
              <Link
                href="/zakat-calculator"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800"
              >
                Open Zakat Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/nisab"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Nisab Threshold 2026</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Understand the nisab threshold and which standard to use for your calculations.</p>
                </Link>
                <Link
                  href="/learn/zakat-on-savings"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Savings</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Step-by-step guide to calculating zakat on savings accounts and cash.</p>
                </Link>
              </div>
            </section>

            {/* Author & Update Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last reviewed:</strong> April 3, 2026</p>
              <p className="mt-2">This article is based on Islamic fiqh from AMJA (American Muslim Jurists Association), Fiqh Council of North America, and classical Islamic jurisprudence sources including hadith collections (Sahih Bukhari, Sahih Muslim).</p>
            </footer>
          </article>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Nisab →</Link>
              <Link href="/fiqh-terms/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hawl →</Link>
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
                  <li><Link href="/learn/nisab" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                  <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">Finance 101</Link></li>
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
