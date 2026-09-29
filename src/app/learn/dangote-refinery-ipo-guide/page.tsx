import type { Metadata } from 'next';
import Link from 'next/link';
import DangoteIpoGuideClient from './DangoteIpoGuideClient';

const secNoticeUrl = 'https://www.sec.gov.ng/for-investors/keep-track-of-circulars/dangote-petroleum-refinery-and-petrochemicals-initial-public-offering/';

export const metadata: Metadata = {
  title: 'Dangote Refinery IPO: Questions to Ask Before You Invest',
  description: 'A practical due-diligence checklist for the Dangote Petroleum Refinery IPO: official channels, prospectus questions, risk, liquidity, zakat, and personal-finance planning.',
  alternates: { canonical: 'https://trybarakah.com/learn/dangote-refinery-ipo-guide' },
  openGraph: {
    title: 'Dangote Refinery IPO: Questions to Ask Before You Invest',
    description: 'A decision checklist for Nigerian investors: verify the offer, read the prospectus, understand risk, and plan around your wider finances.',
    url: 'https://trybarakah.com/learn/dangote-refinery-ipo-guide',
    siteName: 'Barakah',
    type: 'article',
  },
};

const questions = [
  ['Am I using an authorised channel?', 'The Nigerian SEC has warned investors to use only officially designated receiving agents, subscription channels, and platforms. Treat social-media payment instructions, forwarded account details, and “priority allocation” claims as a reason to stop and verify.'],
  ['What does the prospectus actually say?', 'Read the approved offer document rather than relying on headlines. Focus on the use of proceeds, share rights, offer timetable, risk factors, related-party arrangements, financial statements, and the assumptions behind any growth story.'],
  ['What am I paying per share and what can change?', 'Know the offer price, minimum subscription, fees, allocation rules, refund process, and whether you can afford for the capital to be unavailable longer than expected. An IPO price is not a promise of a first-day trading price.'],
  ['How does this fit my emergency fund and obligations?', 'Do not invest money needed for rent, food, debt payments, school fees, medical needs, or near-term family commitments. Keep your emergency reserve separate from any speculative allocation.'],
  ['What would make this investment unsuitable for me?', 'Write your own red lines before applying: concentration in one company or sector, inability to tolerate a loss, unclear paperwork, borrowing to invest, or pressure to decide quickly.'],
  ['What is my Shariah due diligence process?', 'A company’s familiar name is not a Shariah ruling. Review the underlying business, financing, interest-bearing debt, cash and receivables, and any guidance from a qualified scholar or trusted screening methodology. Different methodologies can reach different conclusions.'],
  ['How will I record and revisit the decision?', 'Keep the application confirmation, allocation, fees, purchase price, and the reason you invested. Revisit the position as financial statements and circumstances change, rather than treating an IPO as a one-time decision.'],
];

export default function DangoteRefineryIpoGuidePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dangote Refinery IPO: Questions to Ask Before You Invest',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    author: { '@type': 'Organization', name: 'Barakah' },
    publisher: { '@type': 'Organization', name: 'Barakah' },
    mainEntityOfPage: 'https://trybarakah.com/learn/dangote-refinery-ipo-guide',
  };

  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-14 text-gray-900">
      <article className="mx-auto max-w-3xl">
        <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link><span className="mx-2">/</span><span>Dangote Refinery IPO</span>
        </nav>
        <header className="border-b border-green-200 pb-9">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1B5E20]">Nigerian investor education</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight">Dangote Refinery IPO: questions to ask before you invest</h1>
          <p className="mt-5 text-lg leading-8 text-gray-700">
            A high-profile offer is a reason to slow down, verify the facts, and make a decision that fits your finances. This is a due-diligence checklist, not an offer, recommendation, or Shariah ruling.
          </p>
          <p className="mt-5 text-sm text-gray-500">Published September 29, 2026 · 6 min read</p>
        </header>

        <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <strong>Start with the official record.</strong> Nigeria&apos;s Securities and Exchange Commission announced that the IPO opened on September 14, 2026 and cautioned the public to use only authorised receiving agents, channels, and platforms. Read the <a className="font-semibold underline" href={secNoticeUrl} target="_blank" rel="noreferrer">SEC notice</a> before acting.
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#1B5E20]">Seven questions worth answering in writing</h2>
          <div className="mt-5 space-y-4">
            {questions.map(([title, body], index) => (
              <section key={title} className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-bold text-[#1B5E20]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">{body}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-[#1B5E20]">A simple decision record</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700">
            <li>• The official document and channel I verified</li>
            <li>• The maximum amount I can afford to allocate without borrowing or touching obligations</li>
            <li>• My Shariah review source and any unresolved questions for a qualified scholar</li>
            <li>• The facts that would make me reduce, avoid, or revisit the position</li>
          </ul>
        </section>

        <DangoteIpoGuideClient />
        <p className="mt-8 text-xs leading-5 text-gray-500">Barakah provides educational and organisational tools only. It does not provide investment, legal, tax, or personal Shariah advice. Consult regulated professionals and qualified scholars for your circumstances.</p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </main>
  );
}
