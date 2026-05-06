import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Where to Give Your Zakat in 2026 — The 8 Categories + Verified Charities | Barakah',
  description:
    'The Quran names 8 categories of zakat-eligible recipients (Surah At-Tawbah 9:60). Here&apos;s what each category means today, plus a vetting rubric for choosing a charity.',
  keywords: [
    'zakat recipients',
    'who can receive zakat',
    'best zakat charities 2026',
    'how to give zakat',
    '8 categories of zakat',
    'asnaf',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-recipients-2026' },
  openGraph: {
    title: 'Where to Give Your Zakat in 2026',
    description:
      'The 8 Quranic categories of zakat-eligible recipients explained, with a vetting rubric for picking a charity.',
    url: 'https://trybarakah.com/learn/zakat-recipients-2026',
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
      name: 'Who is eligible to receive zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Quran (Surah At-Tawbah 9:60) names 8 categories of eligible recipients (asnaf): the poor (al-fuqara), the needy (al-masakin), administrators of zakat (al-amilina alayha), those whose hearts are to be reconciled (al-mu&apos;allafati qulubuhum), captives (fi al-riqab), debtors (al-gharimin), in the path of Allah (fi sabilillah), and the wayfarer (ibn al-sabil).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I give zakat to my family?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You cannot give zakat to your direct dependents (parents, children, spouse) because supporting them is your obligation regardless. You CAN give zakat to siblings, aunts/uncles, cousins, and other relatives if they qualify under the 8 categories.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I vet a zakat charity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Look for: (1) public 990 / annual report showing low overhead (target less than 15%), (2) zakat handled in a segregated fund, not commingled with general donations, (3) transparent disbursement reports by category, (4) shariah board oversight on zakat disbursement. Also useful: review on Charity Navigator or local Islamic Center recommendations.',
      },
    },
  ],
};

export default function ZakatRecipientsPage() {
  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Zakat Recipients 2026</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Where to give your zakat — the 8 categories + a vetting rubric
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Methodology summary, not a fatwa. See our{' '}
          <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
            full methodology
          </Link>
          {' '}and consult a qualified scholar for binding rulings on specific cases.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The 8 categories (Surah At-Tawbah 9:60)</h2>
          <ol className="list-decimal list-inside space-y-3 text-base text-gray-700">
            <li><strong>Al-fuqara (the poor)</strong> — those with no income or income below their household&apos;s subsistence needs.</li>
            <li><strong>Al-masakin (the needy)</strong> — those with some income but unable to meet basic needs. Often distinguished from al-fuqara by degree of need; many scholars treat them together.</li>
            <li><strong>Al-amilina alayha (zakat administrators)</strong> — people legitimately employed to collect, manage, and distribute zakat. Their salaries can be paid from zakat funds, capped at a reasonable share.</li>
            <li><strong>Al-mu&apos;allafati qulubuhum (those whose hearts are to be reconciled)</strong> — historically new Muslims or those whose support is being sought; contemporary scholars debate whether this category is still applicable.</li>
            <li><strong>Fi al-riqab (captives / those in bondage)</strong> — historically slaves seeking emancipation; today often interpreted as freeing trafficking victims, war captives, or those held under crushing debt-bondage.</li>
            <li><strong>Al-gharimin (debtors)</strong> — those buried under debt they cannot repay through their own means, where the debt was incurred for permissible needs.</li>
            <li><strong>Fi sabilillah (in the path of Allah)</strong> — historically those engaged in defensive jihad; contemporary scholars include broader Islamic causes such as Islamic education, dawah, and humanitarian relief in conflict zones.</li>
            <li><strong>Ibn al-sabil (the wayfarer)</strong> — travellers stranded away from home without means, even if they have wealth elsewhere they cannot access.</li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Local vs international</h2>
          <p className="text-base text-gray-700">
            Classical scholars preferred zakat be given to recipients in the giver&apos;s own
            community first, on the principle that one&apos;s neighbours have the strongest
            claim. Contemporary scholars are split: some hold the same priority, others
            allow international giving when local need is being met by other means or when
            international need is acutely greater (e.g. famine or active conflict). Both
            positions are well-supported.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Charity vetting rubric</h2>
          <p className="text-base text-gray-700 mb-3">Before donating, check:</p>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Public 990 / annual report.</strong> Target overhead under 15%.</li>
            <li><strong>Zakat-specific accounting.</strong> Zakat funds should be segregated from general donations, not pooled.</li>
            <li><strong>Disbursement transparency.</strong> Look for category-level disbursement reports — how much went to each of the 8 asnaf categories.</li>
            <li><strong>Shariah board oversight.</strong> A named scholar or board reviewing zakat policy is meaningful (and rare).</li>
            <li><strong>Independent ratings.</strong> Charity Navigator, GiveWell-equivalents.</li>
            <li><strong>Local recommendations.</strong> Your imam or local Islamic Center has on-the-ground signal we can&apos;t reproduce online.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Where Barakah-collected sadaqah goes</h2>
          <p className="text-base text-gray-700">
            If you donate via the Sadaqah / Waqf surface in Barakah, see{' '}
            <Link href="/learn/sadaqah-distribution" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
              our disbursement disclosure
            </Link>
            {' '}for the partner charities and processing details.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Calculate your zakat first</h2>
          <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the free zakat calculator →
          </Link>
        </section>
      </div>
    </main>
  );
}
