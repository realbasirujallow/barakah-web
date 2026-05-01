import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Hajj Savings Plan 2026 — How Much Hajj Costs & How to Save | Barakah',
  description:
    'Complete guide to saving for Hajj and Umrah. 2026 cost breakdown, monthly savings calculator, and how to track your Hajj savings goal with Barakah.',
  keywords: [
    'hajj savings plan',
    'how to save for hajj',
    'hajj cost 2026',
    'umrah savings',
    'hajj savings calculator',
    'how much does hajj cost',
    'saving for hajj',
    'hajj fund',
    'halal savings goal',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/hajj-savings-plan' },
  openGraph: {
    title: 'Hajj Savings Plan 2026 — How Much Hajj Costs & How to Save',
    description: 'Complete guide to saving for Hajj and Umrah. 2026 cost breakdown, monthly savings calculator, and how to track your Hajj savings goal with Barakah.',
    url: 'https://trybarakah.com/learn/hajj-savings-plan',
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
    { '@type': 'ListItem', position: 3, name: 'Hajj Savings Plan 2026 — How Much Hajj Costs & How to Save | Barakah', item: 'https://trybarakah.com/learn/hajj-savings-plan' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Hajj Savings Plan 2026 — How Much Hajj Costs & How to Save',
  description: 'Complete guide to saving for Hajj and Umrah. 2026 cost breakdown, monthly savings calculator, and how to track your Hajj savings goal with Barakah.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-04-01',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/hajj-savings-plan' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much should I save per month for Hajj from the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a $12,000 Hajj package from North America with 3 years to save, you need approximately $333/month. If you have 5 years, it drops to $200/month. Adding a modest 4% annual return on a halal savings account can shave ~$30–50/month off the required contribution.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Zakat money to pay for my own Hajj?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Zakat cannot be used for your own Hajj expenses. Zakat must go to one of the 8 eligible categories (fuqara, masakin, etc.). Hajj is an obligation on those who are financially capable — meaning you need your own savings, separate from zakat. However, a wealthy person can pay Hajj expenses for a poor person as a form of charity (not zakat).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is money saved for Hajj zakatable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Once your Hajj savings exceed the nisab threshold and a full hawl (lunar year) passes, zakat is due on that money — even though it is earmarked for Hajj. The exception: if you have already paid the Hajj registration fee (i.e., the money is contractually committed), many scholars say it is no longer in your possession and not zakatable.',
      },
    },
  ],
};

export default function HajjSavingsPlanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">

          {/* Breadcrumb */}

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">HAJJ & UMRAH</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Hajj Savings Plan 2026 — How Much Hajj Costs &amp; How to Save
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              Hajj is one of the five pillars of Islam — obligatory for every Muslim who is financially and physically able. But packages from North America now cost $8,000–$20,000+. This guide breaks down exactly what Hajj costs in 2026, how to calculate your monthly savings target, and how to build a dedicated Hajj fund that actually reaches its goal.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Updated April 2026</span>
              <span>8 min read</span>
              <span>Not financial advice — consult a qualified Islamic scholar</span>
            </div>
          </header>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">How Much Does Hajj Cost in 2026?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              A full Hajj package from North America in 2026 ranges from approximately <strong>$8,000–$15,000</strong> for economy packages to <strong>$20,000+</strong> for premium accommodations. US government-regulated Hajj package costs have risen roughly 15% since 2022, driven by Saudi accommodation price increases and higher airfares. Here is how a typical $12,000 economy package breaks down:
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 mb-6 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Expense</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Economy Range</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Premium Range</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'Round-trip flights (US to Jeddah)', economy: '$1,500 – $2,500', premium: '$3,000 – $3,500' },
                    { item: 'Accommodation (Mecca & Medina)', economy: '$2,500 – $4,000', premium: '$5,000 – $8,000' },
                    { item: 'Hajj visa fee', economy: '~$300', premium: '~$300' },
                    { item: 'Ground transport & buses', economy: '$300 – $500', premium: '$500 – $800' },
                    { item: 'Meals & food (5 weeks)', economy: '$500 – $800', premium: '$800 – $1,500' },
                    { item: 'Ihram, clothing & supplies', economy: '$200 – $400', premium: '$400 – $800' },
                    { item: 'Hady (sacrificial animal)', economy: '~$150', premium: '~$150' },
                  ].map((row, i) => (
                    <tr key={row.item} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-gray-900 border-b border-gray-100 dark:text-gray-100 dark:border-gray-700">{row.item}</td>
                      <td className="p-3 text-green-700 border-b border-gray-100 dark:border-gray-700">{row.economy}</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100 dark:text-gray-400 dark:border-gray-700">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              <strong>Umrah</strong> is significantly more affordable: an all-in package from the US typically runs <strong>$2,000–$5,000</strong>, depending on the season. Ramadan Umrah packages are the most expensive due to demand; off-peak packages in Muharram or Rabi&apos; al-Awwal can be found for under $2,500.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Hajj packages sold through licensed US travel agents must be Ministry of Hajj approved. Always book through ISNA-affiliated or government-recognized Hajj mission operators to ensure your package is legitimate and your visa is properly processed.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Calculating Your Monthly Savings Target</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The formula is straightforward: <strong>(Goal amount) &divide; (Months until Hajj) = Monthly savings required.</strong> But you can reduce that monthly amount by starting earlier and placing your savings in a halal high-yield account.
            </p>
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-green-800 mb-3">Example: $12,000 Goal</h3>
              <div className="space-y-2 text-sm text-green-900">
                <p><strong>Starting today, 3 years (36 months):</strong> $12,000 &divide; 36 = <strong>$333/month</strong></p>
                <p><strong>Starting today, 4 years (48 months):</strong> $12,000 &divide; 48 = <strong>$250/month</strong></p>
                <p><strong>Starting today, 5 years (60 months):</strong> $12,000 &divide; 60 = <strong>$200/month</strong></p>
                <p className="mt-3 text-green-800"><strong>With 4% APY halal savings account (5-year plan):</strong> ~$183/month — the account does ~$1,000 of the work for you.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              If your savings account earns 4–5% APY in a halal account (such as a murabaha-based savings product), compound growth meaningfully reduces your required monthly contribution over a multi-year timeline. The longer your horizon, the more growth helps.
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              One important zakat consideration: once your Hajj savings exceed the <strong>nisab threshold</strong> (~$5,600 at current gold prices) and a full lunar year (hawl) passes, those savings become <strong>zakatable</strong> — even though they are earmarked for Hajj. Budget an additional 2.5% annually on your growing balance. For a $10,000 Hajj fund, that is approximately $250/year in zakat.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Best Strategies to Save for Hajj</h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              A dedicated savings strategy makes the difference between Hajj remaining a distant hope and becoming a scheduled trip. The following approaches are practical, proven, and spiritually grounded.
            </p>
            <div className="space-y-4">
              {[
                {
                  letter: 'A',
                  title: 'Open a dedicated Hajj Fund account',
                  detail: 'Create a separate savings account labeled "Hajj Fund" — either at a halal bank or as a separate sub-account at your current bank. Keeping it separate from your emergency fund and general savings prevents you from dipping into it. A halal high-yield savings account earning 4–5% APY is ideal.',
                },
                {
                  letter: 'B',
                  title: 'Automate transfers on payday',
                  detail: 'Set up an automatic monthly transfer to your Hajj Fund on the day you are paid. Automating the contribution removes the decision entirely — you save before you can spend. Even $100/month compounds meaningfully over 5+ years.',
                },
                {
                  letter: 'C',
                  title: 'Cut one major discretionary expense',
                  detail: 'Identify one recurring expense — dining out, streaming subscriptions, gym membership — and redirect that money to your Hajj Fund. A family spending $300/month dining out that redirects even half ($150) adds $1,800/year to their Hajj savings.',
                },
                {
                  letter: 'D',
                  title: 'Make niyyah (intention) formally',
                  detail: 'The Prophet (PBUH) said: "Actions are judged by intentions." Making a sincere, formal niyyah for Hajj — writing it down, telling your spouse, or making du\'a — creates a spiritual contract that reinforces financial discipline. Many Muslims report that their Hajj savings accelerated after making formal niyyah.',
                },
                {
                  letter: 'E',
                  title: 'Direct windfalls to the Hajj Fund',
                  detail: 'Tax refunds, Ramadan bonuses, work bonuses, and inheritance amounts are all high-impact injection points. A $3,000 tax refund deposited into your Hajj Fund can cut 10–15 months off a 5-year savings plan. Establish a rule: any windfall above $500 goes 50% to Hajj.',
                },
              ].map((item) => (
                <div key={item.letter} className="flex gap-4 border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.letter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-gray-100">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Track Your Hajj Goal with Barakah</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Barakah&apos;s <strong>Savings Goals</strong> feature lets you create a dedicated &ldquo;Hajj Fund&rdquo; goal with a target amount, target date, and automatic monthly progress visualization. You set the goal once — Barakah tracks every contribution and shows you exactly how many months remain at your current savings rate.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Hajj Fund Goal Tracker', detail: 'Set your target amount ($8,000–$20,000), target date, and current balance. Barakah shows a real-time progress bar and projected completion date.' },
                { title: 'Monthly Reminders', detail: 'Get automated notifications when you fall behind your monthly contribution target — so you can catch up before the gap becomes unmanageable.' },
                { title: 'Sadaqah Allocation', detail: 'For family members who cannot make full Hajj, the Sadaqah tracker helps you set aside funds for Umrah packages — a meaningful alternative goal.' },
                { title: 'Zakat on Savings Alert', detail: 'Barakah automatically flags when your Hajj savings cross the nisab threshold and a hawl has passed — so you never accidentally miss zakat on your fund.' },
              ].map((feature) => (
                <div key={feature.title} className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-green-900 text-sm leading-relaxed">{feature.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              The Hajj is the journey of a lifetime — the moment you stand at &lsquo;Arafah and make du&apos;a is worth every month of disciplined saving. Barakah exists to make that journey financially attainable without compromising your halal values along the way.
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
          <RamadanEmailCapture source="learn-hajj-savings-plan" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Start Your Hajj Savings Goal — Free</h2>
            <p className="text-green-100 mb-6">Create a dedicated Hajj Fund goal, set your target date, and let Barakah track every contribution toward the journey of a lifetime.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">Start Free — No Card Needed</Link>
              <Link href="/dashboard/savings" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">Track Your Savings</Link>
            </div>
          </div>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/zakat-on-savings-account', title: 'Zakat on Savings Accounts', desc: 'When and how to pay zakat on your cash savings.' },
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: 'Understanding the difference between obligatory and voluntary charity.' },
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
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
