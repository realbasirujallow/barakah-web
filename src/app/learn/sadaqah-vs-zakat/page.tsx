import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Sadaqah vs Zakat — Key Differences Every Muslim Must Know | Barakah',
  description:
    'Understand the key differences between sadaqah and zakat. Learn which is obligatory, who pays, how much, when, and how to track both in your Islamic budget.',
  keywords: [
    'sadaqah vs zakat',
    'difference between sadaqah and zakat',
    'zakat vs sadaqah',
    'what is sadaqah',
    'types of sadaqah',
    'is sadaqah obligatory',
    'sadaqah meaning',
    'sadaqah jariyah',
    'voluntary charity in islam',
    'islamic charity types',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/sadaqah-vs-zakat' },
  openGraph: {
    title: 'Sadaqah vs Zakat — Key Differences Every Muslim Must Know',
    description: 'The complete comparison of sadaqah and zakat — obligatory vs voluntary, who pays, how much, and the spiritual rewards of each.',
    url: 'https://trybarakah.com/learn/sadaqah-vs-zakat',
    siteName: 'Barakah',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Sadaqah vs Zakat', item: 'https://trybarakah.com/learn/sadaqah-vs-zakat' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sadaqah vs Zakat — Key Differences Every Muslim Must Know',
  description: 'A complete comparison of sadaqah and zakat — covering obligation, who pays, amount, recipients, spiritual rewards, and how to track both in your Islamic budget.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-02-20',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/sadaqah-vs-zakat' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the main difference between sadaqah and zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main difference is obligation: zakat is fard (obligatory) on every qualifying Muslim, while sadaqah is nafl (voluntary). Zakat has specific rules — 2.5% rate, nisab threshold, hawl year, and 8 defined recipient categories. Sadaqah has no fixed amount, no minimum threshold, no annual cycle, and can be given to anyone (even non-Muslims). Both earn immense reward from Allah, but leaving zakat is a major sin, while missing sadaqah is a missed opportunity, not a sin.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is sadaqah jariyah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sadaqah jariyah (صدقة جارية) is "ongoing charity" — a form of giving whose reward continues after the giver dies. The Prophet ﷺ said: "When a person dies, all their deeds end except three: sadaqah jariyah, knowledge that benefits others, or a righteous child who prays for them." (Sahih Muslim 1631). Examples include: funding a well, building a masjid, contributing to an Islamic school, planting trees, endowing a waqf (Islamic trust), writing a useful Islamic book.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can sadaqah replace zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. Sadaqah cannot replace or offset zakat. Zakat is an obligatory right of the poor upon your wealth — even if you give millions in sadaqah, your zakat obligation remains. Some scholars consider giving sadaqah without paying zakat a sign of bad faith. Pay zakat in full first, then give additional sadaqah.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who can receive sadaqah vs zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Zakat can only go to 8 specific categories (asnaf): the poor, the needy, zakat administrators, those whose hearts are to be reconciled, those in bondage (historically), debtors, those in the way of Allah (fi sabilillah), and travelers in need. Sadaqah is more flexible — it can go to anyone in need, including non-Muslims, mosques, Islamic institutions, hospitals, your own family members (other than those you're obligated to support), and even animals.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a minimum amount for sadaqah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The Prophet ﷺ said: "Protect yourself from hellfire even by giving half a date in charity." (Bukhari 1417). Even a smile is considered sadaqah in Islam. There is no minimum. The key is consistency — the Prophet ﷺ said: "The most beloved deeds to Allah are those done consistently, even if small." (Bukhari 6465). Setting a small monthly sadaqah goal and tracking it in Barakah is more valuable than a large one-time gift you forget.',
      },
    },
  ],
};

export default function SadaqahVsZakatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Sadaqah vs Zakat</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">ISLAMIC CHARITY GUIDE</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Sadaqah vs Zakat — Key Differences Every Muslim Must Know
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Both zakat and sadaqah are forms of Islamic charity — but they differ fundamentally in obligation, rules, and spiritual standing. This guide explains both forms, their Quranic basis, and how to track them in your Islamic budget.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📅 Updated April 2026</span>
              <span>⏱ 8 min read</span>
              <span>✅ Quran & Hadith references</span>
            </div>
          </header>

          {/* Quick Comparison Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sadaqah vs Zakat: Quick Comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b">Aspect</th>
                    <th className="p-3 font-semibold text-green-700 border-b">Zakat (زكاة)</th>
                    <th className="p-3 font-semibold text-purple-700 border-b">Sadaqah (صدقة)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Obligation', 'Fard (obligatory) — 3rd Pillar of Islam', 'Nafl (voluntary) — highly encouraged'],
                    ['Who must pay', 'Every Muslim above nisab with one lunar year of wealth', 'Any Muslim (or non-Muslim) — no threshold'],
                    ['Minimum amount', '2.5% of net zakatable wealth', 'None — even a smile counts'],
                    ['Timing', 'Once per lunar year (hawl anniversary)', 'Any time — more is better'],
                    ['Who can receive it', '8 defined asnaf categories only', 'Anyone in need, including non-Muslims'],
                    ['Nisab requirement', 'Yes — must exceed nisab to owe', 'No minimum wealth to give'],
                    ['Can be given to family', 'Not to dependents you are obligated to support', "Yes — relatives you don't support are eligible"],
                    ['Impact of missing it', 'Major sin — obligatory duty unfulfilled', 'Missed opportunity, no sin'],
                    ['Reward', 'Obligatory — fulfilling duty to Allah and the poor', 'Highly multiplied reward — Allah multiplies sadaqah'],
                    ['Examples', 'Annual 2.5% on savings, gold, investments', 'Masjid donations, sponsoring an orphan, building a well'],
                  ].map(([aspect, zakat, sadaqah], i) => (
                    <tr key={aspect} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-700 border-b border-gray-100">{aspect}</td>
                      <td className="p-3 text-green-700 border-b border-gray-100">{zakat}</td>
                      <td className="p-3 text-purple-700 border-b border-gray-100">{sadaqah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Zakat Deep Dive */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Zakat: The Third Pillar of Islam</h2>
            <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-5 mb-5">
              <p className="text-green-800 italic text-sm">
                "And establish prayer and give zakat, and whatever good you put forward for yourselves — you will find it with Allah." — Quran 2:110
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Zakat is one of the Five Pillars of Islam — an obligatory annual act of worship that purifies your wealth and fulfills the right of the poor upon the wealthy. Scholars describe it as "a right of the poor upon the rich" — not charity, but an obligation owed.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: '5 Conditions for Zakat', items: ['Muslim', 'Free person (historically)', 'Owns nisab amount', 'Wealth held for one hawl (lunar year)', 'Full ownership — no debts exceeding assets'] },
                { title: '8 Zakat Recipients (Asnaf)', items: ['Al-Fuqara — the poor', 'Al-Masakin — the needy', 'Amil — zakat administrators', 'Mu\'allafatu Qulubuhum — reconciliation', 'Al-Riqab — freeing slaves (historical)', 'Al-Gharimin — those in debt', 'Fi Sabilillah — in the cause of Allah', 'Ibn Al-Sabil — stranded travelers'] },
              ].map((box) => (
                <div key={box.title} className="border border-green-200 rounded-xl p-4">
                  <h3 className="font-bold text-green-800 mb-2 text-sm">{box.title}</h3>
                  <ul className="space-y-1">
                    {box.items.map((item) => <li key={item} className="text-xs text-gray-600 flex gap-2"><span className="text-green-500">•</span>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <Link href="/learn/what-is-zakat" className="text-green-700 font-semibold text-sm hover:underline">
              Read the complete Zakat guide →
            </Link>
          </section>

          {/* Sadaqah Deep Dive */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sadaqah: Voluntary Charity With Immense Reward</h2>
            <div className="bg-purple-50 border-l-4 border-purple-600 rounded-r-xl p-5 mb-5">
              <p className="text-purple-800 italic text-sm">
                "Indeed, the men who give in sadaqah and the women who give in sadaqah and have lent Allah a goodly loan — it will be multiplied for them, and they will have a noble reward." — Quran 57:18
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sadaqah encompasses all forms of voluntary giving and goodness. The Prophet ﷺ described many acts as sadaqah — not just financial donations.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { type: 'Sadaqah Maaliyah (Financial)', examples: ['Donating to masjid', 'Feeding the poor', 'Sponsoring an orphan', 'Contributing to Islamic causes', 'Giving gifts to family'] },
                { type: 'Sadaqah Jariyah (Ongoing)', examples: ['Building a well or water source', 'Endowing a waqf trust', 'Funding an Islamic school', 'Planting a tree', 'Writing beneficial Islamic content'] },
                { type: 'Sadaqah of Knowledge', examples: ['Teaching Quran', 'Sharing Islamic knowledge', 'Writing Islamic books', 'Giving a useful fatwa', 'Teaching practical skills'] },
                { type: 'Sadaqah of Action', examples: ['A smile at your brother/sister', 'Removing harm from the path', 'Helping someone with their load', 'Making dhikr', 'Enjoining good and forbidding evil'] },
              ].map((cat) => (
                <div key={cat.type} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{cat.type}</h3>
                  <ul className="space-y-1">
                    {cat.examples.map((e) => <li key={e} className="text-xs text-gray-600 flex gap-2"><span className="text-purple-500">•</span>{e}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How Barakah Helps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Both Zakat and Sadaqah in Barakah</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-green-200 rounded-2xl p-5">
                <div className="text-2xl mb-2">🧮</div>
                <h3 className="font-bold text-gray-900 mb-1">Zakat Calculator</h3>
                <p className="text-sm text-gray-600 mb-3">Multi-madhab zakat calculation with live gold/silver prices, 8 asset categories, and hawl anniversary tracking. Free forever.</p>
                <Link href="/zakat-calculator" className="text-green-700 font-semibold text-sm hover:underline">Calculate your zakat →</Link>
              </div>
              <div className="border border-purple-200 rounded-2xl p-5">
                <div className="text-2xl mb-2">💸</div>
                <h3 className="font-bold text-gray-900 mb-1">Sadaqah Tracker</h3>
                <p className="text-sm text-gray-600 mb-3">Set monthly sadaqah goals, log every donation, track total giving by year, and see your sadaqah history across all causes.</p>
                <Link href="/signup" className="text-green-700 font-semibold text-sm hover:underline">Start tracking →</Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Ramadan email capture */}
          <RamadanEmailCapture source="learn-sadaqah-vs-zakat" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Calculate Zakat & Track Sadaqah — Free</h2>
            <p className="text-green-100 mb-6">Never miss your zakat obligation or lose track of your charitable giving again.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition">
                Zakat Calculator
              </Link>
              <Link href="/signup" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">
                Track Sadaqah Free
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'Complete 2026 guide — rules, calculation, and recipients.' },
                { href: '/learn/how-much-zakat-do-i-owe', title: 'How Much Zakat Do I Owe?', desc: 'Step-by-step calculation with worked examples.' },
                { href: '/learn/zakat-al-fitr', title: 'Zakat al-Fitr', desc: "The Ramadan obligatory charity paid before Eid prayer." },
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting', desc: 'Building a budget that prioritizes zakat and sadaqah.' },
                { href: '/learn/ramadan-giving-tracker', title: 'Ramadan Giving', desc: 'Track your giving during the blessed month of Ramadan.' },
                { href: '/learn/nisab-threshold', title: 'Nisab Threshold 2026', desc: 'Current gold and silver nisab values for this year.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors">
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
