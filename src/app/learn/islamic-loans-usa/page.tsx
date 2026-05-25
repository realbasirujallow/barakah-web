import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Islamic Loans in the USA (2026) — How Halal Financing Actually Works',
  description:
    'Are there halal loans in the USA? Islam prohibits interest (riba), so there are no interest-based Islamic loans — but there are Shariah-compliant financing structures for homes, cars, and businesses. Here is how they work.',
  keywords: ['islamic loans usa', 'sharia loans in usa', 'halal loans', 'muslim mortgage loan', 'halal home financing', 'islamic financing usa', 'halal personal loan'],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-loans-usa' },
  openGraph: {
    title: 'Islamic Loans in the USA (2026) — How Halal Financing Works',
    description: 'No interest-based loans — but real Shariah-compliant financing for homes, cars, and businesses. How halal financing works in America.',
    url: 'https://trybarakah.com/learn/islamic-loans-usa',
    type: 'article',
  },
};

const faq = [
  {
    q: 'Are there halal loans in the USA?',
    a: 'Not in the conventional sense. A "loan" in everyday English usually means borrowing money and paying it back with interest, and interest (riba) is prohibited in Islam. What does exist is Shariah-compliant financing: arrangements where a financier buys, co-owns, or leases an asset and you pay a price or rent rather than interest. These cover homes, and to a lesser extent cars and business assets.',
  },
  {
    q: 'What is the difference between a halal financing and a regular loan?',
    a: 'A regular loan rents you money at interest. Halal financing instead involves a real asset: the financier might co-own a home with you and sell you its share over time (musharaka), buy an item and resell it to you at a disclosed markup (murabaha), or lease an asset to you with payments building toward ownership (ijara). You owe a price or rent tied to a real transaction — not interest on money.',
  },
  {
    q: 'Can I get a halal car loan or personal loan?',
    a: 'Halal auto financing exists through murabaha (the financier buys the car and resells it to you at a fixed markup) and is offered by some Islamic financial institutions and credit unions, though availability is far narrower than for home financing. Genuinely Shariah-compliant unsecured personal "loans" are rare, because lending cash at a profit is exactly what riba prohibits; the Islamic alternative is usually a benevolent loan (qard hasan) repaid without any increase.',
  },
  {
    q: 'Is halal financing more expensive than a conventional loan?',
    a: 'It can cost more or less depending on the provider, the structure, and the market. Because the headline numbers are not always directly comparable, focus on the total amount you will pay over the full term, plus fees, rather than any single rate-equivalent. Always verify current terms directly with the provider.',
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
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
            <span className="text-gray-600 dark:text-gray-400">Islamic Loans in the USA</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Islamic Loans in the USA: How Halal Financing Actually Works (2026)
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-05-24</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            If you have searched for an &ldquo;Islamic loan&rdquo; or &ldquo;sharia loan&rdquo; in the US, the honest
            first answer is that the word <em>loan</em> is slightly misleading. Islam prohibits interest (riba), so
            there is no halal version of borrowing money at interest. What <em>does</em> exist — and is widely
            available for homes — is Shariah-compliant <strong>financing</strong> built around real assets. Here is
            how it works and where to find it.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Important:</strong> Educational information only — not financial or religious advice. Programs and
            availability change frequently; verify current terms directly with each provider and consult a qualified
            scholar about a specific contract before committing.
          </div>

          {/* Why there are no interest loans */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Why there are no halal interest-based loans</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              In Islam, money is treated as a medium of exchange, not a commodity you can rent out for profit. Charging
              a guaranteed return for the use of money — interest — is riba, which is clearly prohibited. That is why a
              &ldquo;halal loan with low interest&rdquo; is a contradiction: any interest at all makes it impermissible.
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              The Islamic answer is not to disguise interest, but to structure financing around a real asset and a real
              transaction, so the financier earns a profit from buying, owning, or leasing something — not from lending
              cash. <Link href="/learn/riba-elimination" className="text-green-700 hover:underline">More on eliminating riba →</Link>
            </p>
          </section>

          {/* The structures */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">The Shariah-compliant alternatives to a loan</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Diminishing musharaka (co-ownership)</strong> — you and the financier jointly buy an asset, usually a home, and you gradually buy out their share while paying rent on the portion you do not yet own. <Link href="/learn/diminishing-musharaka-explained" className="text-green-700 hover:underline">How it works →</Link></li>
              <li><strong>Murabaha (cost-plus sale)</strong> — the financier buys the item (a house, a car, equipment) and resells it to you at a disclosed, fixed markup paid in installments. You owe a known price, not interest.</li>
              <li><strong>Ijara (lease-to-own)</strong> — the financier owns the asset and leases it to you, with payments building toward eventual ownership.</li>
              <li><strong>Qard hasan (benevolent loan)</strong> — an interest-free loan repaid in the same amount, often between individuals or through community funds and some mosques. This is the only true &ldquo;loan&rdquo; in Islamic finance, and it carries no profit. <Link href="/learn/ijara-vs-murabaha-vs-musharaka-explained" className="text-green-700 hover:underline">Compare the structures →</Link></li>
            </ul>
          </section>

          {/* By category */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">What you can finance the halal way in the US</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">Home financing — the most established</h3>
                <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                  This is by far the most developed category. Several providers offer Shariah-compliant home financing
                  across most US states, typically using diminishing musharaka or murabaha.
                  {' '}<Link href="/learn/halal-mortgage-providers-usa" className="text-green-700 hover:underline">Compare US providers →</Link>{' '}
                  or <Link href="/learn/halal-mortgage-near-me" className="text-green-700 hover:underline">find options near you →</Link>
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">Auto financing — narrower availability</h3>
                <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                  Some Islamic financial institutions and a few credit unions offer murabaha-based car financing, where
                  the institution buys the car and resells it to you at a fixed markup. Availability is much more limited
                  than for homes, so you may need to contact providers directly or save and buy in cash.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">Business financing</h3>
                <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                  Murabaha (asset purchase) and musharaka/mudaraba (profit-sharing partnership) are used for business and
                  equipment financing through Islamic banks and some community banks. Terms vary widely; this space is
                  smaller and more relationship-driven than home financing.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">Everyday spending &amp; credit cards</h3>
                <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                  Conventional credit cards charge interest, so most scholars treat carrying a balance as impermissible.
                  There are interest-avoiding approaches and a few alternatives worth understanding.
                  {' '}<Link href="/learn/halal-credit-card-alternatives-2026" className="text-green-700 hover:underline">Halal credit card alternatives →</Link>
                </p>
              </div>
            </div>
          </section>

          {/* What to verify */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">How to evaluate a halal financing offer</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Look at the contract, not the marketing.</strong> &ldquo;Islamic&rdquo; branding is not a guarantee — read how the structure actually works.</li>
              <li><strong>Compare total cost over the full term</strong>, including fees, rather than a single rate-equivalent.</li>
              <li><strong>Check the Shariah governance</strong> — who reviews the product, and is documentation available.</li>
              <li><strong>Confirm state availability</strong>, since financing is licensed state by state.</li>
              <li><strong>Consult a qualified scholar</strong> about the specific contract if you are unsure.</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-4 dark:text-gray-300">
              For the difference between Islamic and conventional banking more broadly, see
              {' '}<Link href="/learn/islamic-banking-vs-conventional" className="text-green-700 hover:underline">Islamic banking vs conventional →</Link>
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Islamic loans in the USA — FAQ</h2>
            <div className="space-y-3">
              {faq.map((item, i) => (
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
            <h2 className="text-2xl font-bold mb-3">Keep your finances riba-free</h2>
            <p className="text-green-200 mb-6">
              Barakah helps Muslim households budget, screen for riba, calculate zakat, and plan major purchases the
              halal way — in one private place.
            </p>
            <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Get Started Free
            </Link>
          </div>

          {/* Hub navigation */}
          <nav aria-label="Related articles">
            <h2 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Related guides</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/learn/halal-mortgage-providers-usa" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Home</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">US Halal Mortgage Providers</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Compare Shariah-compliant home financiers.</p>
              </Link>
              <Link href="/learn/riba-elimination" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Foundations</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Eliminating Riba</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Why interest is prohibited and how to avoid it.</p>
              </Link>
              <Link href="/learn/halal-credit-card-alternatives-2026" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Spending</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal Credit Card Alternatives</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Interest-free ways to handle everyday spending.</p>
              </Link>
            </div>
          </nav>
        </div>
      </article>
    </>
  );
}
