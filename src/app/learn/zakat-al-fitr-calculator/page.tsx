import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat al-Fitr Calculator 2026 (Fitrana) — Amount, Deadline & Ruling | Barakah',
  description:
    'Calculate Zakat al-Fitr (Fitrana) for 2026 Ramadan. Learn the exact amount per person, who must pay, the deadline before Eid prayer, and madhab-specific rulings.',
  keywords: [
    'zakat al fitr calculator',
    'zakat al fitr 2026',
    'fitrana 2026',
    'fitrana amount',
    'how much is zakat al fitr',
    'zakat al fitr per person',
    'eid al fitr zakat',
    'ramadan zakat calculator',
    'sadaqah al fitr',
    'zakat ul fitr',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-al-fitr-calculator' },
  openGraph: {
    title: 'Zakat al-Fitr Calculator 2026 — Amount, Ruling & Deadline',
    description: 'How much Zakat al-Fitr per person in 2026, who must pay, the deadline before Eid prayer, and all madhab rulings.',
    url: 'https://trybarakah.com/learn/zakat-al-fitr-calculator',
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
    { '@type': 'ListItem', position: 3, name: 'Zakat al-Fitr Calculator 2026', item: 'https://trybarakah.com/learn/zakat-al-fitr-calculator' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Zakat al-Fitr Calculator 2026 (Fitrana) — Amount, Deadline & Ruling',
  description: 'How to calculate Zakat al-Fitr for 2026 — per person amounts, who must pay, the Eid prayer deadline, and all four madhab rulings.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-03-20',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/zakat-al-fitr-calculator' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much is Zakat al-Fitr per person in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Zakat al-Fitr is set at one sa' (a unit of volume, approximately 2.5–3 kg) of the staple food of your community. In the US in 2026, most Islamic organizations set the cash equivalent at approximately $10–$15 per person. Organizations like ISNA, ICNA, and local masjids publish official amounts annually before Ramadan. The Prophet ﷺ set the amount as one sa' of dates, barley, raisins, or cheese per person.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who must pay Zakat al-Fitr?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Zakat al-Fitr is obligatory on every Muslim who has food in excess of their needs on the day and night of Eid al-Fitr. The head of household (typically the father) pays on behalf of all dependents — himself, his wife, children, and any other dependents. Unlike zakat al-mal, Zakat al-Fitr has no nisab threshold — it is due even if you are not wealthy, as long as you have surplus food for that day.",
      },
    },
    {
      '@type': 'Question',
      name: 'When is the deadline for Zakat al-Fitr?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Zakat al-Fitr must be paid BEFORE the Eid al-Fitr prayer. This is the absolute deadline. It is permissible to pay it from the 1st of Ramadan (Shafi'i, Hanbali) or from the last two days of Ramadan (Maliki, Hanafi). Paying it after the Eid prayer turns it into regular sadaqah — it loses its specific Zakat al-Fitr status and reward. Most Islamic organizations recommend paying it in the final 10 days of Ramadan to ensure it is distributed before Eid.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can Zakat al-Fitr be paid in cash?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, according to the Hanafi madhab and most contemporary scholars. The Hanafi school explicitly permits paying the cash equivalent of the food amount, which is the dominant practice in Western countries today. Maliki, Shafi'i, and Hanbali scholars traditionally require actual food to be given — however, most contemporary scholars in those schools allow cash payment in the West given the practical circumstances. Most major Islamic organizations in the US accept cash Zakat al-Fitr.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who can receive Zakat al-Fitr?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Zakat al-Fitr should be given to the poor and needy (fuqara and masakin). It must reach the recipients BEFORE the Eid prayer, so that they too can celebrate Eid. This is the wisdom behind the early payment requirement. It can be given directly to poor individuals, through your local masjid, or via Islamic organizations that distribute to those in need before Eid.",
      },
    },
  ],
};

export default function ZakatAlFitrCalculatorPage() {
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
            <span className="text-gray-600">Zakat al-Fitr Calculator 2026</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">RAMADAN / ZAKAT</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Zakat al-Fitr Calculator 2026 — Fitrana Amount, Ruling & Deadline
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Zakat al-Fitr (فطرة) is an obligatory charity due at the end of Ramadan, paid before the Eid al-Fitr prayer. This guide covers the 2026 amount, who must pay, the exact deadline, and rulings across all four madhabs.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📅 Updated April 2026</span>
              <span>⏱ 6 min read</span>
              <span>✅ Multi-madhab guidance</span>
            </div>
          </header>

          {/* Quick Summary Box */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10">
            <h2 className="font-bold text-green-900 text-lg mb-4">Zakat al-Fitr 2026 — Quick Summary</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Amount per person', value: '~$10–$15 (US, 2026)' },
                { label: 'Due per', value: 'Every Muslim in your household (including infants)' },
                { label: 'Who pays', value: 'Head of household pays for all dependents' },
                { label: 'Deadline', value: 'BEFORE Eid al-Fitr prayer (obligatory)' },
                { label: 'Earliest payment', value: '1st of Ramadan (Shafi\'i/Hanbali) or last 2 days (Maliki/Hanafi)' },
                { label: 'Form', value: 'Food (1 sa\') or cash equivalent (Hanafi + contemporary scholars)' },
                { label: 'Recipients', value: 'The poor and needy (fuqara & masakin) — must receive before Eid' },
                { label: 'Hadith basis', value: 'Bukhari 1503: Ibn Umar — one sa\' of dates or barley per person' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-xs text-green-700 font-semibold uppercase">{item.label}</span>
                  <span className="text-green-900 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Helper */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Family&apos;s Zakat al-Fitr</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-green-700 px-5 py-3 text-white font-bold">Simple Calculation</div>
              <div className="p-5">
                <p className="text-sm text-gray-700 mb-4">Multiply the per-person amount by your total household members:</p>
                <div className="font-mono bg-gray-50 rounded-xl p-4 text-sm mb-4">
                  <p className="text-gray-600">Number of household members × Per-person amount = Total Zakat al-Fitr</p>
                  <p className="text-gray-600 mt-2">Example: 4 family members × $12 = <strong className="text-green-700">$48 total</strong></p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-semibold text-amber-800 text-sm mb-1">⚠️ Check Your Local Organization&apos;s Amount</p>
                  <p className="text-xs text-amber-700">The exact dollar amount varies by community and year based on grain prices. Check with your local masjid, ISNA, ICNA, or your Islamic center for the official 2026 amount in your area.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Madhab Rulings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Zakat al-Fitr Rulings by Madhab</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b">Question</th>
                    <th className="p-3 font-semibold text-green-700 border-b">Hanafi</th>
                    <th className="p-3 font-semibold text-blue-600 border-b">Maliki</th>
                    <th className="p-3 font-semibold text-purple-600 border-b">Shafi&apos;i</th>
                    <th className="p-3 font-semibold text-orange-600 border-b">Hanbali</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      q: 'Cash payment allowed?',
                      hanafi: '✅ Yes — cash is preferable (it benefits recipients more)',
                      maliki: '❌ No — food only (cash is makruh)',
                      shafii: '❌ Traditionally no — food only',
                      hanbali: '❌ Traditionally no — food only',
                    },
                    {
                      q: 'Earliest payment?',
                      hanafi: '2 days before Eid',
                      maliki: '2 days before Eid',
                      shafii: 'Beginning of Ramadan',
                      hanbali: 'Beginning of Ramadan',
                    },
                    {
                      q: 'Deadline?',
                      hanafi: 'Before Eid prayer',
                      maliki: 'Before Eid prayer',
                      shafii: 'Before Eid prayer',
                      hanbali: 'Before Eid prayer',
                    },
                    {
                      q: 'On behalf of fetus?',
                      hanafi: 'Not required (recommended)',
                      maliki: 'Not required',
                      shafii: 'Not required',
                      hanbali: 'Recommended (mustahabb)',
                    },
                    {
                      q: 'Staple food type?',
                      hanafi: 'Wheat, barley, dates, raisins, or cash',
                      maliki: 'Predominant local food',
                      shafii: 'Predominant food of payer',
                      hanbali: 'Predominant food of area',
                    },
                  ].map((row, i) => (
                    <tr key={row.q} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-800 border-b border-gray-100">{row.q}</td>
                      <td className="p-3 text-xs text-green-700 border-b border-gray-100">{row.hanafi}</td>
                      <td className="p-3 text-xs text-blue-600 border-b border-gray-100">{row.maliki}</td>
                      <td className="p-3 text-xs text-purple-600 border-b border-gray-100">{row.shafii}</td>
                      <td className="p-3 text-xs text-orange-600 border-b border-gray-100">{row.hanbali}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Note: Contemporary Western scholars from non-Hanafi madhabs often permit cash payment due to practical necessity (darura). Consult your local scholar for a ruling specific to your circumstances.
            </p>
          </section>

          {/* Key Hadith */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Hadith Basis for Zakat al-Fitr</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-5">
                <p className="italic text-green-800 text-sm mb-2">
                  &ldquo;The Messenger of Allah (ﷺ) made Zakat al-Fitr obligatory — one sa&apos; of dates or one sa&apos; of barley — on every free person and slave, male and female, young and old among the Muslims. And he commanded it to be paid before the people went out to the (Eid) prayer.&rdquo; — Sahih Bukhari 1503
                </p>
                <p className="text-xs text-green-700">Narrated by Ibn Umar (رضي الله عنه)</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-600 rounded-r-xl p-5">
                <p className="italic text-green-800 text-sm mb-2">
                  &ldquo;Whoever pays it before the prayer, it is accepted zakat. And whoever pays it after the prayer, it is one of the charitable donations (sadaqah).&rdquo; — Abu Dawud 1609
                </p>
                <p className="text-xs text-green-700">Narrated by Ibn Abbas (رضي الله عنه)</p>
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

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Track All Zakat in One Place — Free</h2>
            <p className="text-green-100 mb-6">Barakah tracks Zakat al-Mal AND Zakat al-Fitr — plus sadaqah, hawl anniversaries, and all Islamic giving in one free app.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition">Zakat Calculator</Link>
              <Link href="/signup" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">Create Free Account</Link>
            </div>
          </div>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/zakat-al-fitr', title: 'Zakat al-Fitr Guide', desc: "Complete ruling and wisdom behind Ramadan's end-of-fast charity." },
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'Complete guide — the annual obligatory zakat al-mal.' },
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: "The difference between obligatory and voluntary charity." },
                { href: '/learn/nisab-threshold', title: 'Nisab Threshold', desc: 'Current nisab values for zakat al-mal.' },
                { href: '/learn/how-much-zakat-do-i-owe', title: 'How Much Zakat Do I Owe?', desc: 'Calculate your annual zakat al-mal obligation.' },
                { href: '/learn/ramadan-giving-tracker', title: 'Ramadan Giving', desc: 'Track all your Ramadan charity and donations.' },
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
