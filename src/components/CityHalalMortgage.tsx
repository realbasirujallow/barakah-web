import Link from 'next/link';

export interface CityMortgageData {
  city: string;
  state: string;
  stateAbbr: string;
  /** 2-3 sentence localized intro about the metro's Muslim community + housing market. */
  intro: string;
  /** Honest, qualitative note on the local housing market (no fabricated figures). */
  marketNote: string;
  /** Which halal providers serve this state, with any genuine local angle. */
  providerNote: string;
  /** Providers known to operate in the state (display chips). */
  providers: string[];
  /** Two city-specific FAQ entries (in addition to the shared ones). */
  localFaq: { q: string; a: string }[];
}

const sharedFaq = [
  {
    q: 'Is a halal mortgage actually available where I live?',
    a: 'Availability is set at the state level, not the city level. If a Shariah-compliant provider is licensed in your state, residents of any city in that state can usually apply. The providers listed on this page operate in this state.',
  },
  {
    q: 'How is a halal home purchase different from a conventional mortgage?',
    a: 'Instead of lending you money at interest (riba), the financier either co-owns the home with you and you buy out their share over time (diminishing musharaka), leases it to you with payments that build equity (ijara), or buys the home and resells it to you at a disclosed markup (murabaha). You owe a price or rent, not interest.',
  },
];

export default function CityHalalMortgage({ data }: { data: CityMortgageData }) {
  const allFaq = [...data.localFaq, ...sharedFaq];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaq.map((f) => ({
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
            <Link href="/learn/halal-mortgage-providers-usa" className="text-green-700 hover:underline">Halal Mortgage Providers</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{data.city}</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Halal Mortgages in {data.city}, {data.stateAbbr} (2026)
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-05-22</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">{data.intro}</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Important:</strong> Educational information only. Programs, rates, and state availability change
            frequently — verify current terms directly with each provider and consult a qualified scholar before
            committing.
          </div>

          {/* Local market */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              The {data.city} housing market
            </h2>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">{data.marketNote}</p>
          </section>

          {/* Providers serving the state */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              Halal financing available in {data.state}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">{data.providerNote}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.providers.map((p) => (
                <span key={p} className="rounded-full bg-green-50 text-[#1B5E20] border border-[#1B5E20] px-3 py-1 text-sm">{p}</span>
              ))}
            </div>
            <Link href="/learn/halal-mortgage-providers-usa" className="text-sm text-[#1B5E20] font-semibold hover:underline">
              Compare all US halal mortgage providers →
            </Link>
            <p className="text-xs text-gray-500 mt-3 dark:text-gray-400">
              Other AMJA-permissible providers — <strong>Neeyah</strong> (a shared-equity model in a
              growing number of states) and <strong>Mubarak Mortgage</strong> (murabaha) — may also
              serve {data.state}; confirm current availability directly with each.
            </p>
          </section>

          {/* Structures */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Which structure will you be offered?</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Diminishing musharaka (co-ownership)</strong> — the most common; you and the financier co-own the home and you buy out their share over time. <Link href="/learn/diminishing-musharaka-explained" className="text-green-700 hover:underline">How it works →</Link></li>
              <li><strong>Ijara (lease-to-own)</strong> — the financier owns the home and leases it to you, with payments building toward ownership.</li>
              <li><strong>Murabaha (cost-plus sale)</strong> — the financier buys the home and resells it to you at a disclosed, fixed markup paid in installments.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">
              Halal mortgages in {data.city} — FAQ
            </h2>
            <div className="space-y-3">
              {allFaq.map((item, i) => (
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
            <h2 className="text-2xl font-bold mb-3">Plan your {data.city} home purchase the halal way</h2>
            <p className="text-green-200 mb-6">
              Barakah helps you save a down payment, screen your finances for riba, and track a diminishing-musharaka
              or ijara home as you build equity.
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
              <Link href="/learn/halal-mortgage-providers-usa" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Providers</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">US Provider Comparison</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">AMJA-permissible providers compared.</p>
              </Link>
              <Link href="/learn/halal-mortgage-vs-rent-2026" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Decision</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal Mortgage vs Rent</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">When buying beats renting.</p>
              </Link>
            </div>
          </nav>
        </div>
      </article>
    </>
  );
}
