import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ramadan Giving Tracker Setup 2026 | Barakah',
  description:
    'How to set up a Ramadan giving tracker for 2026: daily targets, fitra timing, last-10-nights bonuses, sadaqah jariyah categorization, family-shared goals.',
  keywords: [
    'ramadan giving tracker',
    'ramadan 2026',
    'daily sadaqah target',
    'zakat al fitr 2026',
    'last 10 nights laylatul qadr',
    'sadaqah jariyah categories',
    'family ramadan goals',
    'ramadan donations app',
    'ramadan budget tracker',
    'islamic giving planner',
    'ramadan charity calendar',
    'fitra calculation',
    'shared giving goals',
    'ramadan habit tracker',
    'monthly sadaqah plan',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/ramadan-giving-tracker-setup' },
  openGraph: {
    title: 'How to Set Up a Ramadan Giving Tracker (2026)',
    description: 'A practical, scholar-aligned tracker for Ramadan 2026: daily targets, fitra timing, Laylatul Qadr bonuses, sadaqah jariyah categories, family goals.',
    url: 'https://trybarakah.com/learn/ramadan-giving-tracker-setup',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Set Up a Ramadan Giving Tracker (2026)',
    description: 'Daily targets, fitra timing, Laylatul Qadr bonuses, sadaqah jariyah categorization, family-shared giving goals.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Ramadan Giving Tracker Setup', item: 'https://trybarakah.com/learn/ramadan-giving-tracker-setup' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Set Up a Ramadan Giving Tracker (2026)',
  description: 'A practical guide to building a Ramadan giving tracker: daily targets, fitra timing, Laylatul Qadr bonus tracking, sadaqah jariyah categories, and family-shared goals.',
  url: 'https://trybarakah.com/learn/ramadan-giving-tracker-setup',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function RamadanGivingTrackerSetupPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Start My Ramadan Tracker →
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Ramadan Giving Tracker Setup</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 9 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            How to Set Up a Ramadan Giving Tracker (2026)
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Ramadan is the month where every act of charity is multiplied. Without a tracker, most families end up giving in scattered bursts — a transfer here, an iftar donation there — and reach the end of the month unsure whether they hit their intentions. A simple giving tracker fixes that. Here is how to build one for Ramadan 2026 that handles daily targets, the timing of zakat al-fitr, last-10-nights bonus tracking, sadaqah jariyah categories, and shared family goals.
          </p>

          {/* CTA */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">📿 Track Every Sadaqah This Ramadan</p>
            <p className="text-green-200 text-sm mb-4">Barakah&apos;s Ramadan tracker syncs with your bank, splits zakat from sadaqah, and shows your progress against the goal you set on day one.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Start Free Account →
            </Link>
          </div>

          {/* Daily target */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">1. Set a Daily Target Before Day One</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The simplest tracker structure is a daily target. Decide on day one what you can sustainably give every day for 30 days. The Prophet ﷺ said the most beloved deeds to Allah are those done consistently, even if small (Bukhari 6464). A consistent $10/day for 30 days ($300) often outperforms a single $250 lump-sum because it builds the habit that carries past Ramadan.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            A common formula: total monthly Ramadan budget ÷ 30 = daily floor. Then add a multiplier for the last ten nights (covered below). When you set up the tracker in Barakah, enter the monthly budget and we auto-split it into a daily floor plus a Laylatul Qadr reserve.
          </p>

          {/* Fitra timing */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">2. Lock In Zakat al-Fitr Timing</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Zakat al-fitr (also called fitra or sadaqat al-fitr) is a separate obligation from zakat al-mal. It is owed by every Muslim — including children, dependants, and the elderly — and must be paid <strong>before the Eid prayer</strong>. Ibn Abbas (RA) reported that the Prophet ﷺ made it obligatory as a purification for the fasting person and as food for the poor. If paid after the Eid prayer, it counts as ordinary sadaqah, not fitra.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The Hanafi school permits paying fitra at the start of Ramadan; the Shafi&apos;i school recommends paying once Ramadan begins; Maliki and Hanbali schools recommend the last 1–2 days. Whichever madhab you follow, your tracker should:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li>Calculate fitra per household member (the modern equivalent of a saa&apos; of staple food, typically $10–$15 per person in 2026)</li>
            <li>Set a hard deadline reminder for the morning of Eid — before the prayer</li>
            <li>Mark fitra as <em>obligation</em>, not optional sadaqah, so it does not get double-counted</li>
          </ul>

          {/* Last 10 nights */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">3. Build a Last-10-Nights Bonus Tier</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Allah describes Laylatul Qadr as <em>better than a thousand months</em> (Surah al-Qadr 97:3). Most scholars place it on one of the odd nights of the last ten days. Because the exact night is hidden, the Prophet ﷺ urged extra worship — and extra giving — on every odd night: the 21st, 23rd, 25th, 27th, and 29th.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            A practical bonus structure many families use:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {[
              { night: 'Nights 1–20', mult: '1× daily target', note: 'The steady floor that builds habit.' },
              { night: 'Even nights 22, 24, 26, 28, 30', mult: '1.5× daily target', note: 'A modest lift across the last ten days.' },
              { night: 'Odd nights 21, 23, 25, 29', mult: '2× daily target', note: 'Each could be Laylatul Qadr — invest accordingly.' },
              { night: 'Night 27', mult: '5× daily target', note: 'The most commonly reported night for Laylatul Qadr.' },
            ].map((tier) => (
              <div key={tier.night} className="bg-[#FFF8E1] rounded-xl p-4 border border-green-100">
                <p className="font-bold text-[#1B5E20] mb-1">{tier.night}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tier.mult}</p>
                <p className="text-xs text-gray-600 mt-1 dark:text-gray-400">{tier.note}</p>
              </div>
            ))}
          </div>

          {/* Sadaqah Jariyah */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">4. Categorize by Sadaqah Jariyah</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Not all sadaqah is equal in reward longevity. The Prophet ﷺ said: &quot;When a person dies, their deeds end except three: ongoing charity (sadaqah jariyah), beneficial knowledge, and a righteous child who prays for them&quot; (Muslim 1631). A good tracker tags each donation by category so you can see the balance:
          </p>
          <div className="space-y-3 mb-6">
            {[
              { cat: 'Sadaqah jariyah (ongoing)', desc: 'Wells, mosques, schools, orphanage endowments, Quran printing, tree planting. Reward continues after death.' },
              { cat: 'Iftar feeding', desc: 'Feeding a fasting person carries the reward of their fast (Tirmidhi 807), without reducing theirs.' },
              { cat: 'Zakat al-mal', desc: 'Your annual 2.5% obligation. If your hawl falls in Ramadan, many Muslims pay it during this month for extra reward — but it is a debt, not a bonus.' },
              { cat: 'Zakat al-fitr', desc: 'Tracked separately because it has a hard pre-Eid deadline and per-person calculation.' },
              { cat: 'Sadaqah (general)', desc: 'Cash gifts, masjid donations, dawah support, helping a family member or neighbor.' },
            ].map((c) => (
              <div key={c.cat} className="border border-gray-100 rounded-xl p-4 dark:border-gray-700">
                <p className="font-semibold text-[#1B5E20] mb-1">{c.cat}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Family-shared goals */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">5. Set Family-Shared Goals</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Ramadan giving is more sustainable when the whole household participates. Barakah lets you invite a spouse or older children to a shared goal — for example, &quot;Build a water well as a family this Ramadan&quot; with a $1,200 target. Each member&apos;s contribution rolls up into the same progress bar, and everyone gets the reward of intention.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Practical tips:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li>Pick one big jariyah goal at the start (well, masjid wing, orphan sponsorship)</li>
            <li>Let each person commit a daily floor of their own — even $1/day from a child counts</li>
            <li>Show the progress bar at iftar so kids see and feel the impact</li>
            <li>Save receipts in one folder for end-of-year tax purposes (US, UK, Canada all allow zakat-eligible deductions for qualifying charities)</li>
          </ul>

          {/* Bottom line */}
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6 mb-10">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900">
              A Ramadan tracker is not about hitting a number — it is about converting intention into consistent action. Set a daily floor, lock in fitra timing before Eid, layer a 2× to 5× bonus on the last ten odd nights, tag each donation by category so jariyah accumulates, and pull the family in around one shared goal. Barakah handles all five automatically.
            </p>
          </section>

          {/* Related */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/zakat-al-fitr', title: 'Zakat al-Fitr Guide', desc: 'Per-person calculation, timing, and madhab differences.' },
                { href: '/learn/ramadan-giving-tracker', title: 'Ramadan Giving Tracker', desc: 'Overview of Barakah&apos;s built-in Ramadan tools.' },
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: 'When something counts as obligation vs voluntary giving.' },
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'The 2.5% obligation, nisab, and hawl explained.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-8 text-center mt-10">
            <h2 className="text-2xl font-bold mb-2">Build your tracker in 60 seconds</h2>
            <p className="text-green-200 mb-6">Barakah sets up daily targets, fitra deadlines, last-10-nights bonuses, and family-shared goals — all in one place.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free — Build My Tracker
              </Link>
              <Link href="/learn/ramadan-giving-tracker" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Tracker Overview →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
