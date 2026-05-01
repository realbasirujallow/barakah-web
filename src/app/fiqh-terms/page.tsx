import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../lib/trial';

export const metadata: Metadata = {
  title: 'Islamic Finance Glossary (2026): 14 Fiqh Terms Every Muslim Investor Should Know | Barakah',
  description:
    'Plain-English definitions of the 14 core Islamic finance terms — zakat, riba, musharaka, murabaha, sukuk, takaful, waqf, and more. Scholar-reviewed, internally linked, and tied to real household decisions.',
  keywords: [
    'islamic finance glossary',
    'fiqh terms',
    'sharia finance terms',
    'halal finance dictionary',
    'islamic banking terminology',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/fiqh-terms',
  },
  openGraph: {
    title: 'Islamic Finance Glossary — 14 Fiqh Terms | Barakah',
    description: 'Plain-English definitions of the 14 core Islamic finance terms every Muslim investor should know.',
    url: 'https://trybarakah.com/fiqh-terms',
    type: 'article',
  },
};

type Term = {
  slug: string;
  term: string;
  arabic: string;
  short: string;
  category: 'Worship' | 'Contracts' | 'Thresholds' | 'Estate' | 'Prohibitions';
};

const terms: Term[] = [
  { slug: 'faraid', term: 'Faraid', arabic: 'فرائض', short: 'Fixed Qur\'anic inheritance shares for heirs.', category: 'Estate' },
  { slug: 'hawl', term: 'Hawl', arabic: 'حول', short: 'The lunar year holding period that makes zakat due.', category: 'Thresholds' },
  { slug: 'hibah', term: 'Hibah', arabic: 'هبة', short: 'A gift transferring ownership during the giver\'s lifetime.', category: 'Contracts' },
  { slug: 'ijara', term: 'Ijara', arabic: 'إجارة', short: 'A lease or rental contract over usufruct, not ownership.', category: 'Contracts' },
  { slug: 'murabaha', term: 'Murabaha', arabic: 'مرابحة', short: 'A cost-plus sale where the seller discloses the markup.', category: 'Contracts' },
  { slug: 'musharaka', term: 'Musharaka', arabic: 'مشاركة', short: 'A profit-and-loss partnership, the base of riba-free home finance.', category: 'Contracts' },
  { slug: 'nisab', term: 'Nisab', arabic: 'نصاب', short: 'The minimum wealth threshold that triggers zakat.', category: 'Thresholds' },
  { slug: 'riba', term: 'Riba', arabic: 'ربا', short: 'Interest or usury — categorically prohibited in Islam.', category: 'Prohibitions' },
  { slug: 'sadaqah', term: 'Sadaqah', arabic: 'صدقة', short: 'Voluntary charity given any time, any amount, any asset.', category: 'Worship' },
  { slug: 'sukuk', term: 'Sukuk', arabic: 'صكوك', short: 'Shariah-compliant investment certificates backed by real assets.', category: 'Contracts' },
  { slug: 'takaful', term: 'Takaful', arabic: 'تكافل', short: 'Cooperative, mutual-aid risk-sharing — the halal alternative to conventional insurance.', category: 'Contracts' },
  { slug: 'waqf', term: 'Waqf', arabic: 'وقف', short: 'A perpetual endowment whose principal is preserved forever.', category: 'Worship' },
  { slug: 'wassiyah', term: 'Wassiyah', arabic: 'وصية', short: 'The discretionary portion of an Islamic will (up to 1/3 of the estate).', category: 'Estate' },
  { slug: 'zakat', term: 'Zakat', arabic: 'زكاة', short: 'The 2.5% annual purifying obligation on accumulated wealth.', category: 'Worship' },
];

const categories: Term['category'][] = ['Worship', 'Prohibitions', 'Thresholds', 'Contracts', 'Estate'];

export default function FiqhTermsHub() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Islamic finance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Islamic finance is a system of economic and commercial activity governed by Shariah (Islamic law). Its core rules forbid riba (interest), gharar (excessive uncertainty), and investment in prohibited industries, and require that financial contracts be tied to real assets and shared risk.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between sadaqah and zakat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zakat is an obligatory annual payment of 2.5% of qualifying wealth once it passes the nisab threshold and has been held for a hawl (lunar year). Sadaqah is voluntary charity — any time, any amount, any asset — with no threshold or calendar.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is riba forbidden in Islam?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Riba (interest) is prohibited because it creates income without productive risk-sharing, concentrates wealth, and exploits borrowers. Islam replaces it with profit-and-loss contracts like musharaka, mudaraba, and ijara, where the financier shares real economic risk.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Islamic Finance Glossary</h1>
          <p className="text-base text-gray-600 mb-8">Last reviewed: 2026-04-18 · 14 core terms · Scholar-aligned definitions</p>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-lg leading-8 text-gray-800">
              Islamic finance has its own vocabulary — mostly classical Arabic legal terms that resist easy
              translation. This glossary gives you the 14 words you&apos;ll meet most often as a Muslim
              household managing zakat, debts, investments, and inheritance. Each entry explains the
              linguistic root, the fiqh ruling, and — where relevant — how Barakah applies the concept
              inside the app.
            </p>
          </section>

          {categories.map((cat) => {
            const catTerms = terms.filter((t) => t.category === cat);
            if (catTerms.length === 0) return null;
            return (
              <section key={cat} className="mb-10">
                <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">{cat}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {catTerms.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/fiqh-terms/${t.slug}`}
                      className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition border border-transparent hover:border-[#1B5E20]"
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xl font-bold text-[#1B5E20]">{t.term}</span>
                        <span className="text-lg text-gray-500" dir="rtl">{t.arabic}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-6">{t.short}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Apply the concepts, don&apos;t just memorize them</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah turns each of these terms into a real feature — nisab-aware zakat, hawl-continuity
              tracking, riba detection on your bank transactions, a faraid calculator, and a wassiyah
              builder. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}, no card.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Try Barakah free →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
