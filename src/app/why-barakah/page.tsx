import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Barakah | Islamic Finance Tools You Can Inspect',
  description: 'Barakah brings Islamic inheritance planning, explainable financial alerts, and a public methodology together in one household finance workspace.',
  alternates: { canonical: 'https://trybarakah.com/why-barakah' },
};

const pillars = [
  {
    number: '01',
    title: 'Inheritance planning belongs with household money',
    body: 'Barakah connects a Faraid calculator, Wasiyyah planning, Waqf records, household information, debts, and assets. It is a planning aid, not a substitute for a qualified scholar or estate attorney.',
    href: '/faraid-calculator',
    label: 'Explore the Faraid calculator',
  },
  {
    number: '02',
    title: 'Alerts should explain themselves',
    body: 'A prompt should tell you what changed, why it matters, and where to look next. Barakah keeps the supporting transaction, budget, hawl, or recurring record close to the alert instead of asking you to trust a black box.',
    href: '/dashboard/ledger',
    label: 'See the audit ledger',
  },
  {
    number: '03',
    title: 'Methodology should be inspectable',
    body: 'Where fiqh opinions differ, Barakah explains the selected approach, publishes changes, and keeps clear boundaries around what the product cannot decide for you.',
    href: '/methodology',
    label: 'Read the methodology',
  },
];

export default function WhyBarakahPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-wide text-[#1B5E20]">Built for scrutiny, not slogans</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">Your financial tools should show their work.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">Barakah is a household finance workspace built around the questions Muslim families actually have: what they own, what they owe, what is due, and how to plan responsibly.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <section key={pillar.number} className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm font-bold text-[#1B5E20]">{pillar.number}</p>
              <h2 className="mt-3 text-xl font-bold text-gray-900">{pillar.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-gray-700">{pillar.body}</p>
              <Link href={pillar.href} className="mt-6 text-sm font-bold text-[#1B5E20] hover:underline">{pillar.label} →</Link>
            </section>
          ))}
        </div>
        <section className="mt-10 flex flex-col justify-between gap-4 rounded-lg bg-[#1B5E20] p-7 text-white sm:flex-row sm:items-center">
          <div><h2 className="text-2xl font-bold">Start with the part of your finances that needs attention.</h2><p className="mt-2 text-sm text-green-100">Use the free tools first. Upgrade only when the workflow earns it.</p></div>
          <Link href="/signup?utm_source=us_muslim_finance_community&utm_medium=community&utm_campaign=trust_sprint_2026&utm_content=why_barakah_cta" className="shrink-0 rounded-md bg-white px-5 py-3 text-center text-sm font-bold text-[#1B5E20] hover:bg-green-50">Start free</Link>
        </section>
      </section>
    </main>
  );
}
