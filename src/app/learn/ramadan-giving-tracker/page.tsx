import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Ramadan Giving Tracker 2026 — Zakat al-Fitr, Sadaqah & Charity Guide | Barakah',
  description:
    'Complete Ramadan giving guide: how much is Zakat al-Fitr in 2026, when to give Sadaqah for maximum reward, and how to track your Ramadan charity with Barakah.',
  keywords: [
    'ramadan giving tracker',
    'zakat al fitr 2026',
    'sadaqah ramadan',
    'ramadan charity',
    'laylatul qadr giving',
    'zakat ul fitr amount 2026',
    'sadaqah fitr',
    'ramadan donations',
    'zakat tracker ramadan',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/ramadan-giving-tracker' },
  openGraph: {
    title: 'Ramadan Giving Tracker 2026 — Zakat al-Fitr, Sadaqah & Charity Guide',
    description: 'Complete Ramadan giving guide: how much is Zakat al-Fitr in 2026, when to give Sadaqah for maximum reward, and how to track your Ramadan charity with Barakah.',
    url: 'https://trybarakah.com/learn/ramadan-giving-tracker',
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
    { '@type': 'ListItem', position: 3, name: 'Ramadan Giving Tracker 2026 — Zakat al-Fitr, Sadaqah & Charity Guide | Barakah', item: 'https://trybarakah.com/learn/ramadan-giving-tracker' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Ramadan Giving Tracker 2026 — Zakat al-Fitr, Sadaqah & Charity Guide',
  description: 'Complete Ramadan giving guide: how much is Zakat al-Fitr in 2026, when to give Sadaqah for maximum reward, and how to track your Ramadan charity with Barakah.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-04-01',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/ramadan-giving-tracker' },
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
        text: 'In 2026, Zakat al-Fitr is approximately $12–15 per person for Muslims in North America, based on the value of 2.5–3 kg of staple food. ISNA recommends $15 per person. You pay for yourself and every dependent in your household. It must be paid before the Eid al-Fitr prayer — ideally during the last few days of Ramadan.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to give Sadaqah in Ramadan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best time is the last 10 nights of Ramadan, particularly on odd nights (21st, 23rd, 25th, 27th, 29th) when Laylatul Qadr is most likely. The 27th night is widely considered the most likely Laylatul Qadr. A practical strategy: give a set amount every night of the last 10 to ensure you give on Laylatul Qadr without knowing exactly which night it falls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Ramadan charity worth more than charity outside Ramadan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Prophet (PBUH) confirmed that charity in Ramadan has multiplied rewards compared to other months. The rewards are further amplified during the last 10 nights, and exponentially so on Laylatul Qadr. However, consistent ongoing charity (Sadaqah al-Jariyah) that continues after Ramadan — like funding a well or supporting an orphan\'s education — may ultimately earn more total reward than a one-time Ramadan donation.',
      },
    },
  ],
};

export default function RamadanGivingTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">

          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Ramadan Giving Tracker</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">RAMADAN CHARITY</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Ramadan Giving Tracker 2026 — Zakat al-Fitr, Sadaqah &amp; Charity Guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              Ramadan is the most spiritually concentrated month in the Islamic calendar — and the best month to give. This guide covers how much Zakat al-Fitr is in 2026, the optimal times to give Sadaqah for maximum reward, the power of Sadaqah al-Jariyah, and how to track every Ramadan donation with Barakah.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Updated April 2026</span>
              <span>8 min read</span>
              <span>Not a fatwa — consult your local Islamic scholar for rulings</span>
            </div>
          </header>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Why Ramadan Is the Best Time to Give</h2>
            <div className="bg-green-50 border-l-4 border-green-600 rounded-r-xl p-5 mb-6">
              <p className="text-green-800 italic text-sm">
                &ldquo;The best charity is that given in Ramadan.&rdquo; — Prophet Muhammad (PBUH), Tirmidhi
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The reward for every good deed in Ramadan is multiplied beyond other months. Fasting purifies the soul and heightens taqwa (God-consciousness) — and giving charity from a state of sincere fasting carries additional spiritual weight that is difficult to replicate outside this month.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              For the last 10 nights of Ramadan, the reward is further amplified by <strong>Laylatul Qadr</strong> — the Night of Power. The Quran states that Laylatul Qadr is &ldquo;better than a thousand months&rdquo; (97:3) — equivalent to more than 83 years of worship in a single night. A donation made on Laylatul Qadr carries the spiritual weight of over 83 years of nightly giving. This is why the last 10 nights represent the highest-leverage giving opportunity in the entire Islamic calendar.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: 'All of Ramadan', detail: 'Rewards multiplied for every deed — the Prophet (PBUH) called Ramadan the month of generosity.' },
                { title: 'Last 10 Nights', detail: 'Laylatul Qadr falls within these nights. Odd nights (21st–29th) are the most likely candidates.' },
                { title: 'Laylatul Qadr', detail: 'A single night of giving equals 1,000+ months of reward. The 27th night is most commonly observed.' },
              ].map((item) => (
                <div key={item.title} className="border border-green-200 rounded-xl p-4 text-center bg-green-50">
                  <p className="font-bold text-green-800 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-600 text-xs dark:text-gray-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Zakat al-Fitr: What It Is and How Much in 2026</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Zakat al-Fitr (also known as Sadaqat al-Fitr or Fitrana) is a mandatory charity that every Muslim must pay before the Eid al-Fitr prayer. It is distinct from annual Zakat al-Mal (wealth zakat) and has its own rules, timing, and purpose.
            </p>
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-green-800 mb-4">Zakat al-Fitr 2026 — Key Facts</h3>
              <div className="space-y-3">
                {[
                  { label: 'Amount per person (North America)', value: '$12 – $15 (ISNA recommends $15)' },
                  { label: 'Classical measure', value: '1 sa\' (approx. 2.5–3 kg of staple food)' },
                  { label: 'Who must pay', value: 'Every Muslim who has food beyond their immediate needs on Eid morning' },
                  { label: 'Who you pay for', value: 'Yourself and every dependent (spouse, children, elderly parents in your care)' },
                  { label: 'Deadline', value: 'Before the Eid al-Fitr prayer — ideally the last 2–3 days of Ramadan' },
                  { label: 'Who receives it', value: 'The poor and needy (fuqara and masakin) — so they can celebrate Eid' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm border-b border-green-100 pb-2">
                    <span className="text-green-900 font-medium">{row.label}</span>
                    <span className="text-green-700 font-semibold text-right ml-4">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The purpose of Zakat al-Fitr is twofold: to purify the fasting person of any minor lapses during Ramadan, and to ensure that the poor have food to celebrate Eid. The Prophet (PBUH) said: &ldquo;The fasting of Ramadan is suspended between earth and heaven and is not raised up except by Zakat al-Fitr.&rdquo; (Ibn Khuzaymah).
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4">
              <p className="text-amber-800 text-sm">
                <strong>Example for a family of 4:</strong> At $15 per person, Zakat al-Fitr for two parents and two children = <strong>$60 total</strong>. Pay before Fajr of Eid al-Fitr — giving a day or two early ensures it reaches the poor in time for Eid.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Sadaqah al-Jariyah: Ongoing Charity</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Sadaqah al-Jariyah is charity that continues to benefit others — and earn rewards for the giver — even after death. The Prophet (PBUH) said: &ldquo;When a person dies, their deeds come to an end except for three: ongoing charity (Sadaqah al-Jariyah), knowledge that is benefited from, or a righteous child who prays for them.&rdquo; (Muslim 1631).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Ramadan is the ideal time to initiate a Sadaqah al-Jariyah project because an intention made in this blessed month carries exceptional barakah. What you start in Ramadan can continue generating reward for decades or generations.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Fund a water well', detail: 'A well in a water-scarce region provides clean water to thousands of people for 20+ years. Every sip taken is Sadaqah al-Jariyah for you.' },
                { title: 'Support Islamic education', detail: 'Sponsoring a student\'s Islamic studies, funding a madrasa, or contributing to a Quran memorization program benefits every person that student teaches.' },
                { title: 'Contribute to a Waqf', detail: 'A Waqf endowment preserves the principal while the income benefits an Islamic cause permanently — a mosque, school, or charitable foundation.' },
                { title: 'Plant a tree or food garden', detail: 'The Prophet (PBUH) said: "If a Muslim plants a tree or sows seeds, and then a bird, person, or animal eats from it, it is regarded as Sadaqah." (Bukhari).' },
                { title: 'Share beneficial knowledge', detail: 'Contributing to Islamic content, translating religious material, or sponsoring dawah work generates reward every time someone benefits from it.' },
                { title: 'Support an orphan', detail: 'Monthly sponsorship of an orphan\'s education, food, and shelter is one of the most recommended forms of ongoing charity in Islam.' },
              ].map((item) => (
                <div key={item.title} className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 dark:text-gray-100">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed dark:text-gray-400">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Consider dedicating a fixed portion of your Ramadan giving — even 20% — to a Sadaqah al-Jariyah project. A $200 Ramadan contribution to a water well, compounded over the lifetime of that well, may generate more total reward than a $1,000 one-time donation that ends immediately.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Track Your Ramadan Giving with Barakah</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Barakah&apos;s <strong>Sadaqah Tracker</strong> lets you log every Ramadan donation across 12 categories — food, medical, education, shelter, water, orphan care, mosque, disaster relief, dawah, and more — so you have a complete record of your giving and can see your impact at a glance.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Zakat al-Fitr Tracker', detail: 'Log your Fitrana payment for each household member and confirm it was paid before Eid prayer. Never miss this obligation again.' },
                { title: 'Last 10 Nights Planner', detail: 'Set a per-night giving target for the last 10 nights of Ramadan. Barakah reminds you each night and tracks cumulative giving across the most blessed period.' },
                { title: '12-Category Sadaqah Log', detail: 'Tag every donation by category (water, orphan, education, etc.) and see a visual breakdown of where your Ramadan charity went.' },
                { title: 'Annual Giving Report', detail: 'At the end of Ramadan, Barakah generates a beautiful annual giving report showing your total Ramadan charity, categories, and organizations supported.' },
              ].map((feature) => (
                <div key={feature.title} className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-green-900 text-sm leading-relaxed">{feature.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Ramadan is not just a month of fasting — it is a month of transformation. Tracking your giving is not about pride; it is about accountability, intention, and ensuring that the generosity you feel in Ramadan translates into real impact for the people who need it most.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Ramadan email capture */}
          <RamadanEmailCapture source="learn-ramadan-giving-tracker" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Track Your Ramadan Giving — Free</h2>
            <p className="text-green-100 mb-6">Log every donation, track Zakat al-Fitr, and build your Ramadan giving report with Barakah&apos;s free Sadaqah Tracker.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">Start Free — No Card Needed</Link>
              <Link href="/dashboard/sadaqah" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">Open Sadaqah Tracker</Link>
            </div>
          </div>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: 'Understanding the difference between obligatory and voluntary charity.' },
                { href: '/learn/zakat-al-fitr-calculator', title: 'Zakat al-Fitr Calculator', desc: 'Calculate your exact Zakat al-Fitr for your household.' },
                { href: '/learn/what-is-zakat', title: 'What Is Zakat?', desc: 'The complete guide to the third pillar of Islam.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700">
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
