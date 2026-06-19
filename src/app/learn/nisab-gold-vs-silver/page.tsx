import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gold vs Silver Nisab — Which Threshold Applies to You?',
  description:
    'The classical silver-nisab threshold (612g) is far lower than the gold one (87.48g). Choosing one over the other can mean owing zakat or not. Here&apos;s how scholars decide.',
  keywords: [
    'nisab gold vs silver',
    'silver nisab threshold',
    'gold nisab amount',
    'which nisab to use',
    'classical silver nisab',
    'nisab comparison',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/nisab-gold-vs-silver' },
  openGraph: {
    title: 'Gold vs Silver Nisab — Which Threshold Applies to You?',
    description:
      'The two nisab thresholds yield very different zakat outcomes. Hanafi vs Shafi&apos;i/Maliki/Hanbali differences explained.',
    url: 'https://trybarakah.com/learn/nisab-gold-vs-silver',
    siteName: 'Barakah',
    type: 'article',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nisab is the minimum wealth threshold above which paying zakat becomes obligatory. There are two classical thresholds: 87.48 grams of gold or 612 grams of silver. Below either, no zakat is due. (Barakah\'s calculator uses the modern rounded values — 85g gold / 595g silver — within ~3% of these classical figures.)',
      },
    },
    {
      '@type': 'Question',
      name: 'Which nisab should I use, gold or silver?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Hanafi school traditionally uses the silver nisab because it is lower, which means more people qualify and more zakat reaches the poor. The Shafi&apos;i, Maliki, and Hanbali schools use gold nisab when calculating zakat on cash, currency, and trade goods. Many modern scholars (including AMJA) recommend using whichever is lower in your local market for cash-equivalent wealth, again to be more inclusive.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is the silver threshold so much lower than gold?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When the thresholds were set 1400+ years ago, gold and silver were close in real-world purchasing power. The dollar value of 612g of silver and 87.48g of gold was similar. Modern markets have decoupled them — gold is now far more valuable per gram than silver — so the dollar value of each threshold differs by an order of magnitude. This is why the choice between the two matters today in a way it didn&apos;t historically.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Barakah use by default?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah lets you pick. The free public calculator defaults to the gold nisab; signed-in users can switch to silver, classical silver, or lower-of-two methodology in their settings. Your choice respects the madhab you follow.',
      },
    },
  ],
};

export default function NisabGoldVsSilverPage() {
  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Gold vs Silver Nisab</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Gold vs silver nisab — which threshold applies to you?
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · This is a Barakah methodology summary, not a fatwa. See our{' '}
          <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
            full methodology
          </Link>
          {' '}for sources, and confirm with a qualified scholar for binding rulings.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Quick answer</h2>
          <table className="w-full text-base text-gray-800">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Threshold</th>
                <th className="text-left py-2">Mass</th>
                <th className="text-left py-2">Approx USD*</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2"><strong>Gold nisab</strong></td>
                <td className="py-2">87.48 g (≈7.5 tola)</td>
                <td className="py-2 text-gray-600">~$5,200</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Silver nisab</strong></td>
                <td className="py-2">612 g</td>
                <td className="py-2 text-gray-600">~$700</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">* Approximate USD values fluctuate with the spot price. Use the live calculator for today&apos;s number.</p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Why this matters</h2>
          <p className="text-base text-gray-700 mb-3">
            If your net zakatable wealth is between the silver and gold thresholds — say
            $2,000 — silver-nisab schools say you owe zakat; gold-nisab schools say you
            don&apos;t. Same person, same wealth, different obligation depending on which
            threshold applies.
          </p>
          <p className="text-base text-gray-700">
            The classical Hanafi position prefers silver because it&apos;s lower and more
            inclusive. The Shafi&apos;i, Maliki, and Hanbali schools prefer gold for
            cash-equivalent wealth. Many contemporary AMJA-aligned scholars recommend
            silver (or lower-of-two) for the same reason classical Hanafi did: it sweeps in
            more eligible payers and gets more zakat to its rightful recipients.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Which one should you pick?</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Hanafi:</strong> traditionally silver — Barakah recommends silver for Hanafi users.</li>
            <li><strong>Shafi&apos;i / Maliki / Hanbali:</strong> traditionally gold — Barakah recommends gold for these schools, with the option to use silver to be more inclusive.</li>
            <li><strong>No strong madhab affiliation:</strong> consider the &quot;lower of gold or silver&quot; rule the contemporary AMJA position favours, so you don&apos;t under-pay relative to the strictest classical position.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Calculate yours</h2>
          <p className="text-base text-gray-700 mb-4">
            Use the free Barakah zakat calculator — pick your madhab, the right nisab is
            applied automatically.
          </p>
          <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the zakat calculator →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/fiqh-terms/nisab" className="text-[#1B5E20] underline">Nisab — full definition + sources</Link></li>
            <li>· <Link href="/fiqh-terms/hawl" className="text-[#1B5E20] underline">Hawl — the lunar-year rule</Link></li>
            <li>· <Link href="/learn/zakat-on-gold-hanafi" className="text-[#1B5E20] underline">Zakat on gold by madhab</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Barakah methodology — full references</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
