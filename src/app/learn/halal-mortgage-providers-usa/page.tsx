import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Mortgage Providers in the USA (2025) | Barakah',
  description:
    'Compare Shariah-compliant home financing providers in the United States: Guidance Residential, UIF Corporation, Ameen Housing, Devon Bank, and more. Rates, structures, and availability.',
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-providers-usa' },
  openGraph: {
    title: 'Halal Mortgage Providers in the USA (2025)',
    description:
      'Compare Guidance Residential, UIF, Ameen Housing, and more — Shariah-compliant home financing options for American Muslims.',
    url: 'https://trybarakah.com/learn/halal-mortgage-providers-usa',
    type: 'article',
  },
};

const providers = [
  {
    name: 'Guidance Residential',
    structure: 'Diminishing Musharaka (co-ownership)',
    states: '40+ states',
    minDown: '3% (FHA-equivalent programs available)',
    scholars: 'Shariah Supervisory Board with global scholars',
    notes: 'The largest halal home financing provider in the US. Often considered the gold standard by scholars.',
    url: 'https://www.guidanceresidential.com',
    recommended: true,
  },
  {
    name: 'UIF Corporation (University Islamic Financial)',
    structure: 'Murabaha & Diminishing Musharaka',
    states: 'Most US states',
    minDown: '10–20%',
    scholars: 'Shariah Supervisory Board',
    notes: 'Subsidiary of University Bank, Michigan. FDIC-insured parent company.',
    url: 'https://www.uifcorp.com',
    recommended: false,
  },
  {
    name: 'Ameen Housing',
    structure: 'Ijara (lease-to-own)',
    states: 'California, Illinois, Texas, select others',
    minDown: '20%',
    scholars: 'AMJA and independent scholars',
    notes: 'Non-profit model focused on affordability for lower-income Muslim families.',
    url: 'https://www.ameenhousing.com',
    recommended: false,
  },
  {
    name: 'Devon Bank',
    structure: 'Diminishing Musharaka & Murabaha',
    states: 'Nationwide',
    minDown: '5–20% depending on program',
    scholars: 'Internal Shariah review',
    notes: 'Chicago-based community bank with Islamic finance programs. Available nationwide for existing customers.',
    url: 'https://www.devonbank.com',
    recommended: false,
  },
  {
    name: 'Lariba / Bank of Whittier',
    structure: 'Declining-participation (co-investment model)',
    states: 'Most US states',
    minDown: 'Varies',
    scholars: 'LARIBA Shariah Board',
    notes: 'One of the oldest Islamic finance institutions in the US. Uses a unique declining-participation model distinct from mainstream diminishing musharaka.',
    url: 'https://www.lariba.com',
    recommended: false,
  },
];

const faqItems = [
  {
    q: 'Are halal mortgages more expensive than conventional mortgages?',
    a: 'Monthly payments are often comparable, but the total cost can vary. Halal structures involve the financier earning profit through ownership or rental income rather than interest. The effective rate may be similar to or slightly above conventional rates, depending on the provider and market conditions. Some programs have become more competitive as they scale.',
  },
  {
    q: 'Can I use a halal mortgage for an investment property?',
    a: 'Some providers (UIF, Guidance Residential) offer financing for investment properties, though terms differ. Most halal programs are designed primarily for primary residences.',
  },
  {
    q: 'Are halal mortgages available for refinancing?',
    a: "Yes, refinancing options are available through most major providers. If you have an existing conventional mortgage, you can potentially refinance into a halal product — though you'll need to qualify and the timing matters.",
  },
  {
    q: 'What about halal mortgages in the UK?',
    a: 'The UK has several well-established halal mortgage providers, including Al Rayan Bank (the largest Islamic bank in the UK), Gatehouse Bank, and Ahli United Bank. These use ijara and diminishing musharaka structures. UK options are generally more competitive and widely available than US equivalents.',
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="min-h-screen bg-white px-4 sm:px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn/is-my-mortgage-halal" className="text-green-700 hover:underline">Is My Mortgage Halal?</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Providers (USA)</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Halal Mortgage Providers in the USA (2025)
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-04-19</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            Shariah-compliant home financing has grown significantly in the US. Here&apos;s a comparison of the major halal mortgage providers
            available to American Muslims, with details on structure, availability, and scholarly endorsement.
          </p>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Important:</strong> This is educational information only. Rates, programs, and availability change frequently.
            Always verify current terms directly with the provider and consult a qualified Islamic scholar before making a decision.
          </div>

          {/* Provider table/cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Provider Comparison</h2>
            <div className="space-y-6">
              {providers.map((p) => (
                <div
                  key={p.name}
                  className={`border rounded-2xl p-6 ${p.recommended ? 'border-[#1B5E20] border-2 bg-green-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{p.name}</h3>
                        {p.recommended && (
                          <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">Most Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-green-700 font-medium mt-0.5">{p.structure}</p>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#1B5E20] font-semibold hover:underline flex-shrink-0"
                    >
                      Visit →
                    </a>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide dark:text-gray-400">Available In</p>
                      <p className="text-gray-800 mt-0.5 dark:text-gray-100">{p.states}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide dark:text-gray-400">Min Down Payment</p>
                      <p className="text-gray-800 mt-0.5 dark:text-gray-100">{p.minDown}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide dark:text-gray-400">Shariah Review</p>
                      <p className="text-gray-800 mt-0.5 dark:text-gray-100">{p.scholars}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic dark:text-gray-400">{p.notes}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How to choose */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">How to Choose a Provider</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Check availability in your state</strong> — not all providers operate everywhere.</li>
              <li><strong>Verify the Shariah certificate</strong> — ask for the Shariah board member names and their credentials.</li>
              <li><strong>Compare effective cost</strong> — get a detailed APR equivalent from each provider to compare fairly.</li>
              <li><strong>Understand the structure</strong> — diminishing musharaka and ijara have different risk profiles; consult a scholar to understand which suits your situation.</li>
              <li><strong>Ask about PMI equivalents</strong> — some Islamic structures have takaful (Islamic insurance) requirements.</li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl group dark:border-gray-700">
                  <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 flex justify-between items-center select-none dark:text-gray-100">
                    <span>{item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 dark:text-gray-300 dark:border-gray-700">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-teal-700 rounded-2xl p-8 text-white text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Track All Your Finances, Not Just Your Mortgage</h2>
            <p className="text-green-200 mb-6">
              Saving for a down payment, tracking riba payments, or managing a halal mortgage? Barakah keeps your
              full financial picture together with Islamic principles.
            </p>
            <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Get Started Free
            </Link>
          </div>

          {/* Hub navigation */}
          <nav aria-label="Related articles">
            <h2 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Islamic Mortgage Hub</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/learn/is-my-mortgage-halal" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Overview</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Is My Mortgage Halal?</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">The complete Islamic home financing guide.</p>
              </Link>
              <Link href="/learn/diminishing-musharaka-explained" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">How It Works</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Diminishing Musharaka Explained</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">The most popular halal structure, step by step.</p>
              </Link>
              <Link href="/learn/riba-free-mortgage" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Deep Dive</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Riba-Free Mortgage Guide</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">What does &quot;halal&quot; really mean for home loans?</p>
              </Link>
            </div>
          </nav>
        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms/murabaha" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Murabaha →</Link>
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
