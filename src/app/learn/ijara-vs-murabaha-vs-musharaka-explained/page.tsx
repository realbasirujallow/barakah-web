import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ijara vs Murabaha vs Musharaka Explained | Barakah',
  description:
    'The three pillars of Islamic financing compared with real examples: Ijara (lease), Murabaha (cost-plus sale), and Musharaka (partnership). Which to use when in 2026.',
  keywords: [
    'ijara vs murabaha',
    'murabaha vs musharaka',
    'islamic financing types',
    'islamic mortgage structures',
    'ijara explained',
    'murabaha explained',
    'musharaka explained',
    'aaoifi islamic contracts',
    'sharia compliant financing',
    'three islamic finance contracts',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/ijara-vs-murabaha-vs-musharaka-explained' },
  openGraph: {
    title: 'Ijara vs Murabaha vs Musharaka — The Three Pillars of Islamic Finance',
    description: 'Side-by-side breakdown of the three core Islamic financing contracts with real-world examples and AAOIFI references.',
    url: 'https://trybarakah.com/learn/ijara-vs-murabaha-vs-musharaka-explained',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ijara vs Murabaha vs Musharaka Explained',
    description: 'The three pillars of Islamic financing compared with real examples.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Ijara vs Murabaha vs Musharaka', item: 'https://trybarakah.com/learn/ijara-vs-murabaha-vs-musharaka-explained' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Ijara vs Murabaha vs Musharaka — The Three Pillars of Islamic Finance',
  description: 'Comparative guide to the three foundational Islamic finance contracts: lease, cost-plus sale, and partnership.',
  url: 'https://trybarakah.com/learn/ijara-vs-murabaha-vs-musharaka-explained',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function IjaraMurabahaMusharakaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Ijara vs Murabaha vs Musharaka</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 9 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Ijara vs Murabaha vs Musharaka — The Three Pillars of Islamic Financing
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Almost every Islamic finance product you will see in 2026 — halal mortgages, auto financing, business loans, sukuk — is built from three classical contracts. If you understand Ijara, Murabaha, and Musharaka, you can read any product offering and know exactly what you are signing.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Why three contracts and not one</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Conventional finance solves every problem with one tool: a loan with interest. Islamic finance refuses that tool. Money cannot generate money on its own. So scholars built three different mechanisms, each tied to a real economic substance: leasing an asset, selling an asset at a markup, or sharing equity in an asset. The risk and reward look different in each. AAOIFI has standards on all three (Standards 8, 9, and 12 respectively).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">1. Murabaha — cost-plus sale</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Murabaha is a sale, not a loan. The bank buys the asset on your behalf, then sells it to you at a disclosed markup. You repay in fixed installments. The markup is locked in at signing. There is no interest because you are not borrowing money — you are buying an asset on deferred payment.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Example: auto financing</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            You want a $30,000 car. UIF buys the car for $30,000 from the dealer. UIF sells it to you for $35,000, payable in 60 monthly installments of $583. You owe $35,000 regardless of how fast or slow you pay. If you miss a payment, you pay a flat late fee that goes to charity, not to the bank as profit. Mufti Taqi Usmani&apos;s 1998 framework on Murabaha (in <em>An Introduction to Islamic Finance</em>) governs this structure.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Where Murabaha shines</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>One-time asset purchases (cars, equipment, inventory).</li>
            <li>Short to medium term (3-7 years).</li>
            <li>When the customer wants payment certainty.</li>
          </ul>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Where it gets criticized</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Mufti Taqi has openly criticized the over-use of Murabaha. The structure is technically halal but it can mimic a fixed-interest loan so closely that some scholars feel it dilutes the spirit of Islamic finance. Use it for genuine asset purchases, not as a workaround for cash loans.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">2. Ijara — leasing</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Ijara is a lease. The bank buys the asset and leases it to you for a fixed term. You pay rent. At the end of the term, ownership either transfers to you (Ijara wa Iqtina) or returns to the bank. The bank carries the asset on its balance sheet during the lease, which means the bank carries the risk of damage, destruction, and major maintenance.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Example: equipment lease</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Your bakery needs a $50,000 industrial oven. An Islamic bank buys the oven and leases it to you for $1,200/month over 5 years. The bank insures it (because they own it) and is on the hook if the oven fails through no fault of yours. At month 60, you pay a token amount and the title transfers to you.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Where Ijara shines</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Long-life productive assets (equipment, vehicles, aircraft).</li>
            <li>When the customer wants flexibility to walk away.</li>
            <li>Aircraft leasing globally is dominated by Sharia-compliant Ijara structures.</li>
          </ul>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">The pitfall</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            If the bank tries to pass major maintenance and asset risk back to you through clauses, the contract may slide into a disguised loan. AAOIFI Standard 9 requires the lessor to bear ownership risk genuinely. Read every clause.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">3. Musharaka — partnership</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Musharaka is a partnership. You and the bank both contribute capital to a venture or asset. You share profits in pre-agreed ratios. You share losses in proportion to capital contributed. There is no fixed return. If the deal makes nothing, the bank makes nothing. If it loses money, the bank loses too.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Diminishing Musharaka — the home version</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Diminishing Musharaka is the most popular Islamic mortgage structure (Guidance Residential, UIF, ICFAL all use it). You and the bank co-buy the home. Initially the bank owns 80%, you own 20%. Each month you pay rent on the bank&apos;s share plus a buyout payment that increases your equity. After 30 years, you own 100%. The bank carries genuine ownership risk during the term.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Where Musharaka shines</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Home financing (Diminishing Musharaka is the gold standard).</li>
            <li>Business equity financing.</li>
            <li>Project finance where partners share genuine risk.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Mufti Taqi Usmani considers Musharaka the most authentically Islamic of the three contracts because it forces real risk-sharing. He has argued in print that Islamic banks should use Musharaka as a default, not as an exception.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Side by side</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-gray-200 rounded-xl dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Feature</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Murabaha</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Ijara</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Musharaka</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-t border-gray-200 dark:border-gray-700"><td className="p-3 font-medium">Nature</td><td className="p-3">Sale</td><td className="p-3">Lease</td><td className="p-3">Partnership</td></tr>
                <tr className="border-t border-gray-200 dark:border-gray-700"><td className="p-3 font-medium">Customer return</td><td className="p-3">Owns at signing</td><td className="p-3">Owns at end</td><td className="p-3">Acquires gradually</td></tr>
                <tr className="border-t border-gray-200 dark:border-gray-700"><td className="p-3 font-medium">Bank profit</td><td className="p-3">Fixed markup</td><td className="p-3">Rent</td><td className="p-3">Profit share</td></tr>
                <tr className="border-t border-gray-200 dark:border-gray-700"><td className="p-3 font-medium">Risk holder</td><td className="p-3">Customer (post-sale)</td><td className="p-3">Bank (during lease)</td><td className="p-3">Both, proportionally</td></tr>
                <tr className="border-t border-gray-200 dark:border-gray-700"><td className="p-3 font-medium">Best for</td><td className="p-3">One-time purchase</td><td className="p-3">Equipment, autos</td><td className="p-3">Homes, businesses</td></tr>
              </tbody>
            </table>
          </div>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Murabaha is a sale at markup. Ijara is a lease. Musharaka is a partnership. For a US home, Diminishing Musharaka through Guidance or UIF is usually the cleanest path. For business equipment, Ijara. For a one-time purchase, Murabaha. Read the contract — the label is not a guarantee of substance.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/diminishing-musharaka-explained', title: 'Diminishing Musharaka', desc: 'Deep dive on the most popular halal mortgage structure.' },
                { href: '/learn/halal-mortgage-providers-usa', title: 'Halal Mortgage Providers (USA)', desc: 'Guidance, UIF, ICFAL compared.' },
                { href: '/learn/riba-free-mortgage', title: 'Riba-Free Mortgages', desc: 'How to buy a home without interest.' },
                { href: '/learn/islamic-finance-basics', title: 'Islamic Finance Basics', desc: 'The principles behind every halal product.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Plan your halal finances in Barakah</h2>
            <p className="text-green-200 mb-6">Track Ijara, Murabaha, and Musharaka contracts inside your dashboard. See your true equity, remaining payments, and zakat exposure in one place.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free Account
              </Link>
              <Link href="/fiqh-terms" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Browse Fiqh Terms →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
