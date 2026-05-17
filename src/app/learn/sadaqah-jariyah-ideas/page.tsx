import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sadaqah Jariyah Ideas: 20 Ways to Earn Continuous Reward (2026)',
  description:
    'Twenty practical, modern sadaqah jariyah ideas — from water wells and Qur\'an printing to coding skills, library books, and recurring monthly giving. With cost ranges and trusted-charity examples.',
  keywords: [
    'sadaqah jariyah ideas',
    'sadaqah jariyah',
    'continuous charity islam',
    'best sadaqah jariyah',
    'sadaqah jariyah for parents',
    'modern sadaqah jariyah',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/sadaqah-jariyah-ideas' },
  openGraph: {
    title: 'Sadaqah Jariyah Ideas: 20 Ways to Earn Continuous Reward (2026)',
    description: 'Twenty practical, modern sadaqah jariyah ideas across budget ranges and impact areas.',
    url: 'https://trybarakah.com/learn/sadaqah-jariyah-ideas',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is sadaqah jariyah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sadaqah jariyah is a form of charity in Islam whose benefit continues to flow to others after the original act — and whose reward continues to flow to the giver even after death. The Prophet (peace be upon him) said: 'When a person dies, their deeds come to an end except for three: ongoing charity, beneficial knowledge, and a righteous child who prays for them.' (Sahih Muslim 1631)",
      },
    },
    {
      '@type': 'Question',
      name: 'What qualifies as sadaqah jariyah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Any charity whose benefit is ongoing rather than one-time. Classic examples: building a well, mosque, school, or hospital; planting a tree or orchard; printing copies of the Qur'an; endowing a waqf. Modern examples: funding open-source educational software, paying for a teacher's salary on a recurring basis, contributing to a library, or sponsoring an orphan's education through to adulthood.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I give sadaqah jariyah on behalf of a deceased parent or relative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. The reward of sadaqah given on behalf of a deceased Muslim flows to them by the unanimous opinion of the four schools. Many Muslims build a water well, contribute to a mosque, or fund Qur'an printing in the name of a deceased parent — the reward continues for them as long as the benefit continues.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does sadaqah jariyah count as zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Only if the recipient and structure meet the zakat conditions (a qualifying recipient category, transfer of ownership to that recipient). Some sadaqah jariyah projects — like funding the operating budget of an orphanage that serves zakat-eligible orphans — can count toward zakat. Others, like building a mosque or funding general infrastructure, are sadaqah but not zakat. When in doubt, give zakat and sadaqah jariyah separately.",
      },
    },
  ],
};

const ideas = [
  { title: 'Water well (large)', cost: '$1,500–$5,000', impact: 'Lifetime water for a village; the most cited modern sadaqah jariyah', tag: 'High impact' },
  { title: 'Hand pump or shallow well', cost: '$200–$800', impact: 'Water for a household or small community', tag: 'Mid impact' },
  { title: 'Qur\'an mushaf printing', cost: '$5–$15 per copy', impact: 'Each recitation earns ongoing reward', tag: 'Low entry' },
  { title: 'Fund a teacher\'s monthly salary', cost: '$50–$200/mo', impact: 'Ongoing education for a class', tag: 'Recurring' },
  { title: 'Sponsor an orphan', cost: '$30–$75/mo', impact: 'Education, food, shelter to adulthood', tag: 'Recurring' },
  { title: 'Build a small masjid', cost: '$5,000–$50,000', impact: 'Every prayer prayed earns ongoing reward', tag: 'High impact' },
  { title: 'Contribute to a masjid building fund', cost: '$25+', impact: 'Same as above, fractional', tag: 'Low entry' },
  { title: 'Plant fruit trees / orchard', cost: '$5–$50 per tree', impact: 'Hadith: every fruit eaten is sadaqah', tag: 'Low entry' },
  { title: 'Fund Qur\'an memorization (tahfidh)', cost: '$100–$500/yr per student', impact: 'A hafiz of Qur\'an is a multiplier', tag: 'High impact' },
  { title: 'Library books for Islamic schools', cost: '$50–$500', impact: 'Beneficial knowledge for many readers', tag: 'Mid impact' },
  { title: 'Open-source educational software', cost: '$50–$5,000', impact: 'Reaches users globally; renewing benefit', tag: 'Modern' },
  { title: 'Solar panels for a rural school', cost: '$500–$5,000', impact: 'Enables study hours after sunset', tag: 'Modern' },
  { title: 'Vocational training program', cost: '$200–$2,000', impact: 'Skills that compound into lifetime earning', tag: 'High impact' },
  { title: 'Wheelchair or medical equipment', cost: '$200–$1,000', impact: 'Years of mobility / care for a person', tag: 'Mid impact' },
  { title: 'Translate Islamic content into a new language', cost: '$500–$5,000', impact: 'Knowledge reach expands to new audiences', tag: 'Modern' },
  { title: 'Build a community kitchen', cost: '$1,000–$10,000', impact: 'Daily meals for the poor for years', tag: 'High impact' },
  { title: 'Endow a waqf (perpetual endowment)', cost: '$5,000+', impact: 'Principal is preserved; income funds charity perpetually', tag: 'Classical' },
  { title: 'Pay for a hospital bed / equipment', cost: '$500–$5,000', impact: 'Patients treated over the equipment\'s lifetime', tag: 'High impact' },
  { title: 'Recurring monthly giving to a verified charity', cost: '$25–$500/mo', impact: 'Compounding habit; never miss a month', tag: 'Recurring' },
  { title: 'Teach a beneficial skill (coding, halal finance, hifdh)', cost: 'Time only', impact: 'Every student who applies it carries the reward forward', tag: 'Free' },
];

export default function SadaqahJariyahIdeasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }} />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Sadaqah Jariyah Ideas</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Giving Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Sadaqah Jariyah Ideas: 20 Ways to Earn Continuous Reward</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Practical, modern sadaqah jariyah ideas — across budget ranges, impact areas, and time horizons.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>9 min read</span>
                <span>Published: May 2026 • Last updated: May 17, 2026</span>
              </div>
            </header>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What is sadaqah jariyah?</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Sadaqah jariyah is a form of charity whose benefit continues after the act of giving — and whose reward
                continues to flow to the giver even after death. The Prophet Muhammad (peace be upon him) said:
              </p>
              <blockquote className="border-l-4 border-[#1B5E20] bg-green-50 p-4 italic text-gray-700 dark:text-gray-300">
                &ldquo;When a person dies, their deeds come to an end except for three: ongoing charity (sadaqah jariyah),
                beneficial knowledge, and a righteous child who prays for them.&rdquo;
                <span className="block text-sm not-italic text-gray-600 mt-2">— Sahih Muslim 1631</span>
              </blockquote>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Below: 20 ideas across price points, with the ongoing-benefit mechanic noted for each.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">20 sadaqah jariyah ideas</h2>
              <div className="grid gap-4">
                {ideas.map((idea, i) => (
                  <div key={idea.title} className="bg-white border border-gray-200 rounded-lg p-5 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-[#1B5E20]">{i + 1}. {idea.title}</h3>
                      <span className="inline-block text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded shrink-0">{idea.tag}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1"><strong>Typical cost:</strong> {idea.cost}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Ongoing benefit:</strong> {idea.impact}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How to choose which idea to pursue</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A few practical filters that can help you pick:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Match your capacity</strong> — recurring small giving compounds; a one-time large gift can be transformative. Both count.</li>
                <li><strong>Pick a recipient you can verify</strong> — a registered charity with audited financials, or a project you can visit / track. Avoid intermediaries whose books you can&apos;t see.</li>
                <li><strong>Bias toward measurable benefit</strong> — water wells, Qur&apos;an printing, scholarships, and waqfs all have a clear ongoing-benefit story. Vaguely scoped &ldquo;general fund&rdquo; donations still count but are harder to attribute.</li>
                <li><strong>On behalf of a loved one</strong> — many Muslims fund a project in the name of a deceased parent. The reward flows to them.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Sadaqah jariyah vs zakat — what counts as what</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-lg bg-white shadow-sm dark:bg-gray-800">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Dimension</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Zakat</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Sadaqah jariyah</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Required?</td><td className="p-3">Obligatory once above nisab</td><td className="p-3">Voluntary</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Recipients</td><td className="p-3">8 categories defined in Qur&apos;an 9:60</td><td className="p-3">Any beneficial purpose</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Ownership transfer</td><td className="p-3">Required (tamlik)</td><td className="p-3">Not required</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Building a mosque?</td><td className="p-3">Typically no</td><td className="p-3">Yes — classic sadaqah jariyah</td></tr>
                    <tr><td className="p-3 font-semibold">Sponsoring an orphan?</td><td className="p-3">Can count if zakat-eligible</td><td className="p-3">Yes</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                See our{' '}
                <Link href="/learn/sadaqah-vs-zakat" className="text-[#1B5E20] underline">
                  sadaqah vs zakat
                </Link>{' '}
                guide for the full breakdown.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>
              {FaqSchema.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Q: {q.name}</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </section>

            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Track sadaqah, zakat, and giving in one place</h2>
              <p className="text-green-100">
                Barakah keeps a running ledger of every dollar you give — by category, by recipient, by year — so giving stays consistent and visible to your future self.
              </p>
              <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Get started free
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/sadaqah-vs-zakat" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Sadaqah vs Zakat</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">When voluntary giving counts as zakat — and when it doesn&apos;t.</p>
                </Link>
                <Link href="/learn/sadaqah-distribution" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Sadaqah Distribution</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">How to allocate ongoing giving across causes and recipients.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
