import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices, { GoldPricePerGram, SilverPricePerGram, GoldNisabUSD, SilverNisabUSD } from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Nisab Threshold 2026: Gold vs Silver — Which Should You Use? | Barakah',
  description: 'Understand the nisab threshold for 2026. Compare gold standard (85g) vs silver standard (595g) and learn which to use based on your Islamic school.',
  keywords: ['nisab threshold 2026', 'what is nisab', 'nisab value today', 'gold nisab vs silver nisab', 'minimum zakat threshold'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/nisab-threshold',
  },
  openGraph: {
    title: 'Nisab Threshold 2026: Gold vs Silver — Which Should You Use? | Barakah',
    description: 'Master the nisab concept with expert guidance on which standard applies to your situation.',
    url: 'https://trybarakah.com/learn/nisab-threshold',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the nisab threshold?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The nisab threshold is the minimum amount of wealth you must possess before zakat becomes obligatory. It is set at either 85 grams of gold or 595 grams of silver according to Islamic fiqh.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the gold nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The gold nisab is 85 grams (approximately 2.747 troy ounces). Multiply 85 by the current gold spot price per gram to get the nisab in your currency. This is the most widely recommended standard by modern Islamic scholars and AMJA.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the silver nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The silver nisab is 595 grams (approximately 19.1 troy ounces). Multiply 595 by the current silver spot price per gram to get the nisab in your currency. This is the classical Hanafi standard.',
      },
    },
  ],
};

export default function NisabThresholdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
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
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Nisab Threshold</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Nisab Threshold: Gold vs Silver</h1>
              <p className="text-lg text-gray-700">Master the nisab concept and determine which standard applies to your Islamic school and situation.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <span>By Barakah Editorial Team</span>
                <span>6 min read</span>
              </div>
            </header>

            {/* Live Nisab Prices — fetched from API */}
            <NisabLivePrices />

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#what-is" className="text-[#1B5E20] hover:underline">What is the Nisab Threshold?</Link></li>
                <li><Link href="#gold-standard" className="text-[#1B5E20] hover:underline">Gold Standard (85 grams)</Link></li>
                <li><Link href="#silver-standard" className="text-[#1B5E20] hover:underline">Silver Standard (595 grams)</Link></li>
                <li><Link href="#comparison" className="text-[#1B5E20] hover:underline">Gold vs Silver Comparison</Link></li>
                <li><Link href="#which-to-use" className="text-[#1B5E20] hover:underline">Which Should You Use?</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQs</Link></li>
              </ul>
            </nav>

            <section id="what-is" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What is the Nisab Threshold?</h2>
              <p className="text-gray-700 leading-relaxed">
                The nisab threshold is the <strong>minimum amount of wealth</strong> you must possess before zakat (the obligatory annual charity) becomes a duty upon you. If your wealth falls below the nisab, you do not owe zakat that year.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of nisab as the &quot;exemption threshold&quot; — similar to income tax in secular systems, where you only pay if earnings exceed a certain amount. In Islam, you only owe zakat if your wealth exceeds the nisab.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Key Point</h3>
                <p className="text-gray-700 text-sm">
                  The nisab was established by the Prophet Muhammad (peace be upon him) based on the cost of living in 7th-century Arabia. It applies today using the value of gold or silver, which serves as a timeless economic standard.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Islamic law recognizes two nisab standards — gold and silver — reflecting classical scholarly traditions. The choice between them depends on your school of Islamic jurisprudence (madhab).
              </p>
            </section>

            <section id="gold-standard" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Gold Standard: 85 Grams</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Weight:</strong> 85 grams (approximately 2.747 troy ounces)
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Current Value:</strong> <GoldNisabUSD /> (at <GoldPricePerGram /> per gram)
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3">About This Standard</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong className="text-blue-900">Endorsed by:</strong> AMJA (American Muslim Jurists Association), Fiqh Council of North America, and most contemporary Islamic scholars</li>
                  <li><strong className="text-blue-900">Ease of use:</strong> Gold prices are widely published daily, making it easy to calculate current nisab value</li>
                  <li><strong className="text-blue-900">Scholarly backing:</strong> Referenced in classical hadith and widely accepted across Islamic schools</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed font-semibold">
                <strong className="text-[#1B5E20]">Recommendation:</strong> Most modern Muslims use the gold standard of 85 grams unless following a specific madhab that prescribes otherwise.
              </p>
            </section>

            <section id="silver-standard" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Silver Standard: 595 Grams</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Weight:</strong> 595 grams (approximately 19.1 troy ounces)
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Current Value:</strong> <SilverNisabUSD /> (at <SilverPricePerGram /> per gram)
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-3">About This Standard</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong className="text-amber-900">Historical basis:</strong> This is the classical Hanafi school standard, traced to early Islamic jurisprudence</li>
                  <li><strong className="text-amber-900">School-specific:</strong> Primarily used by Hanafi madhab followers and some traditionalist scholars</li>
                  <li><strong className="text-amber-900">Practical consideration:</strong> Silver prices are less commonly quoted than gold, making calculations slightly less convenient</li>
                </ul>
              </div>
            </section>

            <section id="comparison" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Side-by-Side Comparison</h2>
              {/* Live comparison table — values fetched from API */}
              <NisabLivePrices variant="table" />
            </section>

            <section id="which-to-use" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Which Should You Use?</h2>
              <p className="text-gray-700 leading-relaxed">
                The short answer is: <strong>Consult your imam or local Islamic teacher for guidance based on your school of Islamic jurisprudence (madhab).</strong> However, here is practical guidance:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Sunni Majority (Shafi&apos;i, Maliki, Hanbali) & Modern Scholars</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Use the gold standard (85 grams).</strong> This is the most widely recommended by AMJA, Fiqh Council, and most Islamic organizations in North America. If you are unsure of your madhab or follow a general contemporary approach, use the gold standard.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Hanafi Madhab (Traditional)</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Classically, use the silver standard (595 grams).</strong> However, many modern Hanafi scholars are now recommending the gold standard for consistency with other schools. Consult your Hanafi imam for their preferred approach.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
                  <h3 className="font-bold text-purple-900 mb-2">Want to be Extra Conservative?</h3>
                  <p className="text-gray-700 text-sm">
                    Some scholars recommend the &quot;lower of two&quot; approach: use whichever nisab is lower at the time of calculation. This ensures zakat is definitely due and you fulfill your obligation generously.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-bold text-amber-900 mb-3">Practical Steps to Choose</h3>
                <ol className="space-y-2 text-gray-700 text-sm">
                  <li>1. <strong>Know your madhab:</strong> Ask your imam which school of Islamic law you follow (Hanafi, Shafi&apos;i, Maliki, Hanbali)</li>
                  <li>2. <strong>Check your school&apos;s guidance:</strong> Most schools today recommend the gold standard (85g)</li>
                  <li>3. <strong>When in doubt:</strong> Use the gold standard (85g), which is the safest and most widely accepted</li>
                  <li>4. <strong>Stay consistent:</strong> Once you choose a standard, use the same one year after year for consistency</li>
                </ol>
              </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: How do I check the current nisab value?</h3>
                <p className="text-gray-700 text-sm">
                  Check the daily spot price of gold per gram (usually in USD). Multiply by the nisab gram amount to get the current gold nisab in dollars. For silver, multiply the spot price per gram by its nisab gram amount. Barakah&apos;s calculator automatically updates with current prices daily — see the live values at the top of this page.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I&apos;m exactly at the nisab amount? Do I owe zakat?</h3>
                <p className="text-gray-700 text-sm">
                  Yes, if you are at or above the nisab threshold and have held the wealth for one lunar year, zakat is due. Many scholars prefer to round up slightly to ensure compliance.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Does the nisab change every year?</h3>
                <p className="text-gray-700 text-sm">
                  Yes. The nisab threshold changes based on the market price of gold and silver. Each year when calculating zakat, check the current spot prices to determine the updated nisab in your local currency. This is why Barakah updates daily.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I use the silver nisab even if I follow the Shafi&apos;i school?</h3>
                <p className="text-gray-700 text-sm">
                  Technically, the Shafi&apos;i school recommends the gold standard. However, if you want to be extra cautious and use the lower (silver) standard, most scholars accept this as a valid approach to ensure you&apos;re fulfilling zakat properly.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I have both gold and silver? Do I combine them for nisab?</h3>
                <p className="text-gray-700 text-sm">
                  This is a matter of scholarly debate. Most contemporary scholars recommend calculating zakat on each type separately. However, if you have other liquid wealth (cash, savings), you typically combine all liquid assets and apply one nisab calculation. Consult an imam for clarity on your specific situation.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Check Your Nisab Status Today</h2>
              <p className="text-green-100">
                Use Barakah&apos;s zakat calculator to determine your current nisab threshold and whether zakat is due on your wealth.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Open Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/zakat-on-gold"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Gold & Jewelry</h3>
                  <p className="text-gray-600 text-sm">Calculate zakat on gold with current nisab thresholds.</p>
                </Link>
                <Link
                  href="/learn/zakat-on-savings"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Savings</h3>
                  <p className="text-gray-600 text-sm">Step-by-step guide to zakat on bank accounts and savings.</p>
                </Link>
              </div>
            </section>

            {/* Author Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p className="mt-2">Content based on Islamic fiqh from AMJA, Fiqh Council of North America, and classical Islamic jurisprudence across all madhabs.</p>
            </footer>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600">Fiqh-aware household finance for modern Muslim families.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/zakat-on-gold" className="hover:text-[#1B5E20] transition">Zakat on Gold</Link></li>
                  <li><Link href="/learn/zakat-on-savings" className="hover:text-[#1B5E20] transition">Zakat on Savings</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
