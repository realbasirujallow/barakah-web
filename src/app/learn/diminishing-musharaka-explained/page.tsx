import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Diminishing Musharaka Explained: How Islamic Mortgages Work | Barakah',
  description:
    'A step-by-step explanation of diminishing musharaka (declining co-ownership) — the most widely used Shariah-compliant home financing structure in the US and UK. Learn how it works, why scholars prefer it, and how it differs from conventional mortgages.',
  alternates: { canonical: 'https://trybarakah.com/learn/diminishing-musharaka-explained' },
  openGraph: {
    title: 'Diminishing Musharaka Explained: How Islamic Mortgages Work',
    description:
      'Step-by-step: how diminishing musharaka works, why scholars prefer it, and how it compares to conventional mortgages and other halal structures.',
    url: 'https://trybarakah.com/learn/diminishing-musharaka-explained',
    type: 'article',
  },
};

const faqItems = [
  {
    q: 'What is musharaka in Islam?',
    a: 'Musharaka is a joint venture or partnership where all parties share both profits and losses proportionally. It is one of the fundamental Islamic finance contracts, considered Shariah-compliant because it involves genuine risk-sharing rather than guaranteed returns from lending money.',
  },
  {
    q: 'Is diminishing musharaka truly halal?',
    a: 'The majority of contemporary Islamic scholars consider diminishing musharaka to be Shariah-compliant when structured correctly. The key requirement is genuine co-ownership, meaning the financier must actually bear risk as a co-owner. Some scholars have raised concerns when the rental income is calculated to exactly mirror a conventional mortgage rate — verify that your provider\'s Shariah board has specifically reviewed and approved their structure.',
  },
  {
    q: 'How does diminishing musharaka differ from a conventional mortgage?',
    a: "In a conventional mortgage: you borrow money and pay interest on the debt. In diminishing musharaka: you and the bank co-own the property; you pay rent on the bank's share (not interest on a loan) and gradually buy out their stake. The bank profits from rent and shared ownership risk, not from lending money at interest.",
  },
  {
    q: 'What happens if the property value falls in a diminishing musharaka?',
    a: "Unlike a conventional mortgage where the lender is fully protected (you still owe the full loan amount), in diminishing musharaka the bank shares in the property's value decline. If you sell at a loss, the loss is shared proportionally to current ownership. This genuine risk-sharing is what makes it Shariah-compliant.",
  },
  {
    q: 'Can I make extra payments to buy out the bank faster?',
    a: 'Yes — most diminishing musharaka providers allow you to make additional unit purchases to accelerate the buyout. Each extra payment transfers a greater ownership stake to you and reduces your rental obligation proportionally.',
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Diminishing Musharaka Explained: How Islamic Mortgages Work',
    description: metadata.description,
    url: 'https://trybarakah.com/learn/diminishing-musharaka-explained',
    publisher: {
      '@type': 'Organization',
      name: 'Barakah',
      url: 'https://trybarakah.com',
    },
    dateModified: '2026-04-15',
  };

  return (
    <>
      <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

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
            <span className="text-gray-600 dark:text-gray-400">Diminishing Musharaka</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Diminishing Musharaka Explained
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-04-19</p>
          <p className="text-lg text-gray-600 mb-2 leading-relaxed dark:text-gray-400">
            Diminishing musharaka (also called diminishing partnership or declining co-ownership) is the most widely used Shariah-compliant
            home financing structure in the United States and United Kingdom. It is the model used by Guidance Residential, Devon Bank,
            Gatehouse Bank (UK), and others.
          </p>
          <p className="text-gray-500 text-sm mb-8 dark:text-gray-400">
            <em>Arabic: Musharaka Mutanaqisa (مشاركة متناقصة) — literally &ldquo;diminishing partnership.&rdquo;</em>
          </p>

          {/* Quick definition */}
          <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-5 mb-10">
            <h2 className="font-bold text-green-900 mb-2">In One Sentence</h2>
            <p className="text-green-900">
              You and the financier co-own the property; you pay <strong>rent</strong> on the financier&apos;s share and
              incrementally <strong>buy out</strong> their stake until you own 100% — no interest involved.
            </p>
          </div>

          {/* Step-by-step */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">How It Works: Step by Step</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">Co-Purchase</h3>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    You and the financier jointly purchase the property. If the home costs $400,000 and you put 20% down ($80,000),
                    you own <strong>20%</strong> and the financier owns <strong>80%</strong> from day one.
                    Both parties are true co-owners — the title reflects this shared ownership.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">You Pay Rent on the Bank&apos;s Share</h3>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    You live in the whole property, so you pay the financier rent for using their 80% ownership stake.
                    This is a legitimate rental payment — the financier earns profit as a <em>landlord</em>, not as a lender.
                    The rental rate is typically tied to a benchmark (like the prevailing rental market) rather than an interest rate.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">You Gradually Buy Out the Bank</h3>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    Each month, part of your payment goes toward purchasing additional ownership units from the financier.
                    As your ownership share grows (e.g., from 20% → 21% → 22%…), the financier&apos;s share <em>diminishes</em>
                    — hence the name. As their share shrinks, your rental obligation decreases proportionally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#1B5E20] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">Full Ownership at the End</h3>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    After 30 years (or however long your term is), you&apos;ve purchased 100% of the financier&apos;s stake.
                    At this point, you own the property outright — no more rental payments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Worked example */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Worked Example</h2>
            <div className="bg-gray-50 rounded-xl overflow-hidden dark:bg-gray-800">
              <div className="bg-[#1B5E20] text-white px-5 py-3 text-sm font-semibold">
                $400,000 home · 20% down ($80,000) · 30-year term
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs mb-1 dark:text-gray-400">Your Initial Share</p>
                    <p className="text-2xl font-bold text-[#1B5E20]">20%</p>
                    <p className="text-gray-600 text-xs dark:text-gray-400">$80,000</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs mb-1 dark:text-gray-400">Bank&apos;s Initial Share</p>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">80%</p>
                    <p className="text-gray-600 text-xs dark:text-gray-400">$320,000</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 dark:bg-gray-800">
                    <p className="text-gray-500 text-xs mb-1 dark:text-gray-400">Your Monthly Payment</p>
                    <p className="text-2xl font-bold text-amber-700">~$2,400</p>
                    <p className="text-gray-600 text-xs dark:text-gray-400">Rent + buyout</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="p-2 text-left font-semibold">Year</th>
                        <th className="p-2 text-right font-semibold">Your Ownership</th>
                        <th className="p-2 text-right font-semibold">Bank&apos;s Share</th>
                        <th className="p-2 text-right font-semibold">Monthly Rent Component</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { yr: 1,  you: '20%',  bank: '80%', rent: '$1,600' },
                        { yr: 5,  you: '34%',  bank: '66%', rent: '$1,320' },
                        { yr: 10, you: '53%',  bank: '47%', rent: '$940' },
                        { yr: 20, you: '78%',  bank: '22%', rent: '$440' },
                        { yr: 30, you: '100%', bank: '0%',  rent: '$0' },
                      ].map(row => (
                        <tr key={row.yr}>
                          <td className="p-2 text-gray-700 dark:text-gray-300">Year {row.yr}</td>
                          <td className="p-2 text-right font-semibold text-[#1B5E20]">{row.you}</td>
                          <td className="p-2 text-right text-gray-600 dark:text-gray-400">{row.bank}</td>
                          <td className="p-2 text-right text-amber-700">{row.rent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-500 text-xs dark:text-gray-400">*Illustrative figures — actual amounts vary by provider, rental rate, and structure.</p>
              </div>
            </div>
          </section>

          {/* Why scholars prefer it */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Why Scholars Prefer Diminishing Musharaka</h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed dark:text-gray-300">
              <div className="flex gap-3 items-start">
                <span className="text-green-700 font-bold flex-shrink-0 mt-0.5">✅</span>
                <p><strong>Genuine risk-sharing:</strong> The financier is a true co-owner who bears the risk of property value changes. If the property falls in value, both parties lose proportionally — unlike a conventional mortgage where only the borrower bears the risk.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-green-700 font-bold flex-shrink-0 mt-0.5">✅</span>
                <p><strong>No loan contract:</strong> There is no loan (qard) contract. The financier earns profit as a co-owner receiving rent, not as a lender charging interest.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-green-700 font-bold flex-shrink-0 mt-0.5">✅</span>
                <p><strong>Endorsed by major bodies:</strong> The AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions), OIC Fiqh Academy, and most contemporary Islamic finance scholars endorse properly-structured diminishing musharaka.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-amber-600 font-bold flex-shrink-0 mt-0.5">⚠️</span>
                <p><strong>Watch out for:</strong> Some providers calculate rental rates using LIBOR/SOFR derivatives to closely mirror conventional mortgage rates. Scholars accept this in principle, but the underlying ownership structure must be genuine. Always ask to see the Shariah supervisory board review.</p>
              </div>
            </div>
          </section>

          {/* Comparison with other structures */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Comparison with Other Halal Structures</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1B5E20] text-white">
                    <th className="p-3 text-left rounded-tl-lg">Structure</th>
                    <th className="p-3 text-center">Bank Earns From</th>
                    <th className="p-3 text-center">Shared Risk</th>
                    <th className="p-3 text-center rounded-tr-lg">Most Common In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-green-50 font-medium">
                    <td className="p-3 text-[#1B5E20]">Diminishing Musharaka ★</td>
                    <td className="p-3 text-center">Rent on ownership share</td>
                    <td className="p-3 text-center text-green-700">Yes — both parties</td>
                    <td className="p-3 text-center">US, UK, Malaysia</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-800 dark:text-gray-100">Ijara (Lease-to-Own)</td>
                    <td className="p-3 text-center">Rental income</td>
                    <td className="p-3 text-center text-amber-600">Partial</td>
                    <td className="p-3 text-center">UK, GCC</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-800 dark:text-gray-100">Murabaha</td>
                    <td className="p-3 text-center">Markup on sale price</td>
                    <td className="p-3 text-center text-red-500">Minimal</td>
                    <td className="p-3 text-center">US, GCC</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            <h2 className="text-2xl font-bold mb-3">Manage Your Home Purchase Journey with Barakah</h2>
            <p className="text-green-200 mb-6 max-w-xl mx-auto">
              Track savings toward your down payment, manage your existing mortgage or halal financing,
              and calculate zakat with full madhab support — all in one Islamic finance platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free — 30 Days Plus
              </Link>
              <Link href="/learn/halal-mortgage-providers-usa" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition">
                Compare Providers
              </Link>
            </div>
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
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal Mortgage Providers (USA)</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Compare Guidance Residential, UIF & more.</p>
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
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
