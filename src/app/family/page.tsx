/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';
import { PRICING } from '../../lib/pricing';

export const metadata: Metadata = {
  title: 'Barakah Family Plan — One Account for the Whole Muslim Household',
  description:
    "Up to 6 family members on one Barakah Family plan. Shared zakat visibility across the household, joint budgets, separate hawls, halal stock screening, and Islamic estate planning — for the price of one Plus subscription.",
  keywords: [
    'muslim family budgeting',
    'family halal finance',
    'islamic family finance app',
    'shared zakat tracking',
    'muslim household budget',
    'barakah family plan',
    'family halal budgeting app',
    'islamic finance app for families',
  ],
  alternates: { canonical: 'https://trybarakah.com/family' },
  openGraph: {
    title: 'Barakah Family Plan — One Account for the Whole Muslim Household',
    description: 'Up to 6 family members. Shared zakat visibility, joint budgets, separate hawls, halal screening, Islamic estate planning. One subscription.',
    url: 'https://trybarakah.com/family',
    siteName: 'Barakah',
    type: 'website',
  },
};

const faqItems = [
  {
    q: 'Who is the Barakah Family plan for?',
    a: 'It is built for Muslim households where more than one person handles money — spouses sharing a budget, parents tracking household zakat alongside an adult child, or an extended family pooling for hajj. Up to six members share one subscription. Each member has their own login, their own private accounts, and their own separately-tracked hawl, while still sharing a household-level view of joint goals and zakat.',
  },
  {
    q: 'How does shared zakat across the family work?',
    a: 'Each family member calculates their own zakat on their own wealth — that is how zakat works under classical fiqh. What Barakah adds is a household view: at a glance you can see who in the family is due to pay zakat next, on what asset categories, and at what date. Inside the family view we keep individual accounts private; only roll-up status (hawl progress, nisab status, due date) is shared. Nothing about a sister-in-law\'s salary is visible to her brother-in-law.',
  },
  {
    q: 'Does a family plan replace separate hawls per person?',
    a: 'No — each member still has their own hawl tied to their own first-crossing-of-nisab date. The family plan does not merge wealth; it just gives one household subscription instead of paying six separate Plus plans. The fiqh of zakat is per-individual; Barakah respects that.',
  },
  {
    q: 'How much does the Family plan cost?',
    a: `One subscription at $${PRICING.family.monthly.replace(/[^0-9.]/g, '')}/month covers up to 6 family members. That is meaningfully cheaper than six separate Plus subscriptions and the most common reason households convert from Free or Plus to Family. The yearly option saves an additional ~17%.`,
  },
  {
    q: 'What about teenagers or younger kids?',
    a: 'Adult family members get full Plus access. We treat under-18 members as view-only by default — they can see allowance/sadaqah counters but cannot link external accounts. A separate Kids surface is in development for Islamic financial literacy aimed at children; until that ships, our recommendation is to add teens as standard members and parents handle the account-linking.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
    { '@type': 'ListItem', position: 2, name: 'Family Plan', item: 'https://trybarakah.com/family' },
  ],
};

const features = [
  {
    title: 'Up to 6 members on one subscription',
    body: 'Spouses, parents, adult children, in-laws — any household configuration. Members are added by email invite; each one logs in with their own Google or password and keeps their own private data.',
  },
  {
    title: 'Household zakat view (privacy-preserving)',
    body: 'See who in the family is approaching their zakat due date next, against what nisab threshold, without seeing the underlying account balances. The fiqh of zakat is per-individual; Barakah respects that and surfaces only the roll-up signal.',
  },
  {
    title: 'Separate hawls per person',
    body: 'Each member\'s hawl starts from their own first-crossing-of-nisab date. A teenager who inherits sets their own hawl. A spouse with a fresh business has their own hawl. The Family plan never merges them.',
  },
  {
    title: 'Joint budgets and goals',
    body: 'Optional shared envelopes for household expenses — groceries, mortgage, masjid donations, hajj savings goal — that any member can contribute to. Personal categories stay personal.',
  },
  {
    title: 'Halal stock screening, shared',
    body: 'Run AAOIFI Standard 21 screens on any ticker, save it as a household watchlist. Useful when family members invest together but want to verify Shariah-compliance separately.',
  },
  {
    title: 'Islamic estate planning + family visibility',
    body: 'Wasiyyah builder and faraid (inheritance) calculator are available to all members. Family members can opt into showing each other their will status — so an adult child knows their parent has set up the wasiyyah, without seeing the contents.',
  },
];

const useCases = [
  {
    who: 'A married couple in their 30s',
    flow: 'One subscription. Joint mortgage savings goal. Separate hawls (his started in 2022, hers in 2024). Shared sadaqah tracker for Ramadan. They see "the family is on track for hajj 2030" in one view.',
  },
  {
    who: 'An extended household sharing finances',
    flow: 'Parents + two married adult children + their spouses (6 members). Joint household budget for utilities + groceries. Each adult tracks their own salary, investments, and zakat privately. The household sees one roll-up of "who pays zakat next month" with no leakage of underlying balances.',
  },
  {
    who: 'A parent planning the next generation',
    flow: 'Parent on Family, teenage child added as a viewer. The teen sees their own sadaqah jar and allowance counter. When they turn 18 and start their first job, they activate full member access and start their own hawl — the family plan absorbs the transition with no extra cost.',
  },
];

export default function FamilyLandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Hero */}
          <header className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1B5E20] mb-2">Barakah Family</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-4 leading-tight">One account for the whole Muslim household.</h1>
            <p className="text-lg leading-8 text-gray-800 max-w-2xl">
              Up to 6 members. Shared zakat visibility without sharing balances. Separate hawls tracked per person. Joint budgets, halal stock screening, and Islamic estate planning — for the price of one Plus subscription.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup?plan=family" className="inline-flex items-center justify-center rounded-xl bg-[#1B5E20] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2E7D32]">
                Start a free Family trial →
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-[#1B5E20] px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-white">
                See pricing
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-3">No credit card required. Cancel anytime.</p>
          </header>

          {/* What the Family plan actually is */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">What the Family plan actually is</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              The Family plan is a single Barakah subscription that covers up to six members of one household. Each member has their own login, their own private accounts, and their own hawl clock. The household gets a privacy-preserving roll-up view — who is due to pay zakat next, joint progress on household goals — without exposing individual balances across the family.
            </p>
            <p className="text-base leading-7 text-gray-800">
              The fiqh of zakat is per-individual: every Muslim who reaches nisab calculates their own zakat from their own first-crossing date. Barakah does not merge wealth across the household, and the Family plan does not change that. What it does change is that you stop paying six separate $9.99/month Plus subscriptions for one family.
            </p>
          </section>

          {/* Features */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">What's included</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm leading-6 text-gray-700">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Who actually uses this</h2>
            <div className="space-y-4">
              {useCases.map((u) => (
                <div key={u.who} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-base font-bold text-[#1B5E20] mb-1">{u.who}</h3>
                  <p className="text-sm leading-6 text-gray-700">{u.flow}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy section */}
          <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">A note on privacy in a shared family plan</h2>
            <p className="text-sm leading-6 text-amber-900 mb-2">
              We designed the Family plan so adult members can keep their salary, investments, and accounts private from other family members while still sharing the household roll-up. By default, no member can see another member's balances or transactions — only shared envelopes (joint budgets and goals) cross the privacy boundary, and even those are opt-in.
            </p>
            <p className="text-sm leading-6 text-amber-900">
              This matches how most fiqh-aware households actually manage money — collaboration on joint costs, autonomy on personal accounts. The "household zakat view" tells you that someone's hawl is approaching without telling you what they own.
            </p>
          </section>

          {/* FAQ visible */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Frequently asked</h2>
            <div className="space-y-4">
              {faqItems.map((f) => (
                <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                  <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">Related guides</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/learn/muslim-household-budget" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Muslim household budget</Link>
              <Link href="/learn/islamic-budgeting-app" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Islamic budgeting app</Link>
              <Link href="/learn/islamic-will" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Islamic will</Link>
              <Link href="/faraid-calculator" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Faraid calculator</Link>
              <Link href="/zakat-calculator" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat calculator</Link>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-[#1B5E20] p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Start the Family plan</h2>
            <p className="text-sm leading-6 text-green-100 mb-5 max-w-xl">
              One subscription, up to six family members, shared household view with private personal data. Cancel anytime; no credit card required to start.
            </p>
            <Link href="/signup?plan=family" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Start free →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
