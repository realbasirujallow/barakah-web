import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../components/RamadanEmailCapture';
import RamadanCountdown from './RamadanCountdown';

export const metadata: Metadata = {
  title: 'Ramadan 2027 Financial Planner: Zakat, Sadaqah, Fidyah, Kaffarah | Barakah',
  description:
    "Plan your Ramadan 2027 finances: calculate zakat on every asset class, track sadaqah and sadaqah jariyah, handle fidyah and kaffarah, and automate Zakat al-Fitr — all in one app.",
  keywords: [
    'ramadan 2027',
    'ramadan financial planning',
    'ramadan zakat',
    'ramadan sadaqah tracker',
    'zakat calculator ramadan',
    'fidyah 2027',
    'kaffarah 2027',
  ],
  alternates: { canonical: 'https://trybarakah.com/ramadan' },
  openGraph: {
    title: 'Ramadan 2027 Financial Planner | Barakah',
    description: 'Zakat, sadaqah, fidyah, kaffarah, and Zakat al-Fitr — one app for the whole month.',
    url: 'https://trybarakah.com/ramadan',
    type: 'article',
  },
};

const tools = [
  {
    title: 'Calculate your zakat',
    desc: 'Multi-asset zakat across cash, gold, stocks, 401(k), crypto, business, and rental income. Hawl-aware.',
    href: '/zakat-calculator',
    cta: 'Open calculator',
  },
  {
    title: 'Zakat al-Fitr calculator',
    desc: 'The $10–15 per-household-member obligation due before Eid prayer. Covers every family member automatically.',
    href: '/learn/zakat-al-fitr-calculator',
    cta: 'Calculate al-Fitr',
  },
  {
    title: 'Ramadan giving tracker',
    desc: 'Log every sadaqah for deduction + blessing. Separate from zakat so obligation and generosity are both visible.',
    href: '/learn/ramadan-giving-tracker',
    cta: 'Start tracker',
  },
  {
    title: 'Faraid / wasiyyah builder',
    desc: 'Ramadan is when many Muslims finalize estate plans. Generate your Islamic will + see faraid distribution.',
    href: '/faraid-calculator',
    cta: 'Plan now',
  },
];

export default function RamadanPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When is Ramadan 2027?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ramadan 2027 is expected to begin the evening of approximately 17 February 2027 and end around 18 March 2027, subject to lunar sighting. The exact start and end dates depend on moonsighting in your locality.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I have to pay zakat in Ramadan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zakat is not specifically due in Ramadan — it is due once your hawl (lunar year holding period) completes. However, many Muslims align their zakat payment to Ramadan because rewards for good deeds are multiplied, and Ramadan is when need is most visible. Barakah tracks your actual hawl anniversary independent of Ramadan.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Zakat al-Fitr and how much is it?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zakat al-Fitr is a charity due from every Muslim (including children) before Eid prayer at the end of Ramadan. The classical amount is one sa\u02bb (~2.5kg) of the local staple food per person; most US/UK scholars set the cash equivalent at $10–15 per person. It is separate from and additional to the annual 2.5% zakat al-mal on wealth.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is fidyah?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Fidyah is compensation for missed fasts that cannot be made up — typically due to old age, chronic illness, or pregnancy/breastfeeding. The amount is feeding one poor person per missed fast (about $10–15 in 2027 US prices).",
        },
      },
      {
        '@type': 'Question',
        name: 'What is kaffarah?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Kaffarah is expiation for breaking a fast deliberately without valid excuse. The classical ruling requires freeing a slave (no longer applicable), otherwise fasting 60 consecutive days, otherwise feeding 60 poor people. Modern scholars set the monetary equivalent at ~$600–900 per broken fast.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Ramadan 2027</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="mb-6 inline-block rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-semibold">
            Planning ahead for Ramadan 2027 · starts ~17 February 2027
          </div>
          <RamadanCountdown />
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Your Ramadan 2027 Financial Planner</h1>
          <p className="text-lg leading-8 text-gray-800 mb-6 max-w-3xl">
            Ramadan is when Muslim households do their most important financial work of the year — paying zakat,
            increasing sadaqah, finalizing wills, handling fidyah and kaffarah. Barakah handles all of it in one app,
            with scholar-aligned methodology and household-aware calculations.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">The Ramadan money checklist</h2>
            <ul className="list-none space-y-3 text-base leading-7 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-sm font-bold flex items-center justify-center mt-0.5">1</span>
                <div>
                  <strong>Calculate this year&apos;s zakat.</strong> Aggregate every asset (cash, gold, stocks, 401k, crypto, rental income) and apply 2.5% above nisab.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-sm font-bold flex items-center justify-center mt-0.5">2</span>
                <div>
                  <strong>Distribute zakat to the 8 eligible categories.</strong> Track recipients, amounts, and dates for your records and potential tax deduction.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-sm font-bold flex items-center justify-center mt-0.5">3</span>
                <div>
                  <strong>Pay Zakat al-Fitr before Eid prayer.</strong> ~$10–15 per household member (including children and elderly). Covers all your dependents.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-sm font-bold flex items-center justify-center mt-0.5">4</span>
                <div>
                  <strong>Handle fidyah or kaffarah if applicable.</strong> For missed fasts that can&apos;t be made up (fidyah) or broken fasts (kaffarah).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-sm font-bold flex items-center justify-center mt-0.5">5</span>
                <div>
                  <strong>Increase sadaqah during Laylat al-Qadr.</strong> Rewards are multiplied; track every donation for your records.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-sm font-bold flex items-center justify-center mt-0.5">6</span>
                <div>
                  <strong>Finalize your Islamic will.</strong> Many Muslims use Ramadan as the annual deadline to ensure their wasiyyah is current.
                </div>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Tools for the month</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition border border-transparent hover:border-[#1B5E20]"
                >
                  <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{t.title}</h3>
                  <p className="text-sm text-gray-700 leading-6 mb-3">{t.desc}</p>
                  <span className="text-sm font-semibold text-[#1B5E20]">{t.cta} →</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Frequently asked</h2>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">When is Ramadan 2027?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Ramadan 2027 is expected to begin the evening of approximately <strong>17 February 2027</strong> and end
                around 18 March 2027, subject to lunar sighting in your locality.
              </p>
            </details>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">Must I pay zakat during Ramadan?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Zakat is due on your hawl (lunar-year) anniversary — not specifically in Ramadan. But many Muslims align
                payment to Ramadan for the multiplied reward. Barakah tracks your actual hawl independently so you
                don&apos;t double-pay or miss the obligation.
              </p>
            </details>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">What&apos;s the difference between zakat al-mal and zakat al-fitr?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                <Link href="/fiqh-terms/zakat" className="text-[#1B5E20] underline">Zakat al-mal</Link> is the 2.5% annual
                charity on accumulated wealth above nisab. <Link href="/learn/zakat-al-fitr" className="text-[#1B5E20] underline">Zakat al-fitr</Link>
                {' '}is a separate per-person fee (~$10–15) due before Eid prayer. Both are obligatory.
              </p>
            </details>
            <details className="mb-3 border-b border-gray-100 pb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">What is fidyah?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Fidyah is compensation for fasts you cannot make up (old age, chronic illness, pregnancy/breastfeeding).
                The amount is feeding one poor person per missed fast — approximately $10–15 per day in 2027 prices.
              </p>
            </details>
            <details className="mb-3">
              <summary className="cursor-pointer font-semibold text-gray-900">What is kaffarah?</summary>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                Kaffarah is expiation for breaking a fast deliberately without valid excuse. The classical ruling
                prescribes fasting 60 consecutive days or feeding 60 poor people. Monetary equivalent in 2027 prices:
                ~$600–900 per broken fast.
              </p>
            </details>
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Get the Ramadan 2027 prep drip</h2>
            <p className="mb-4 text-sm leading-7 text-gray-700">
              Drop your email and we&apos;ll send you 6 weekly prep notes between December 2026 and the start
              of Ramadan: hawl anniversary planning, year-end zakat forecasting, sadaqah plans, Zakat al-Fitr
              reminders, and the last 10 nights giving checklist. Unsubscribe anytime.
            </p>
            <RamadanEmailCapture source="ramadan-2027-prep" variant="bottom" />
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Or start using Barakah today</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts through Plaid today. Barakah starts tracking your hawl, zakatable assets, and sadaqah
              now — so by February 2027 everything is ready and you spend the month worshipping, not spreadsheeting.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Sign up free →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
