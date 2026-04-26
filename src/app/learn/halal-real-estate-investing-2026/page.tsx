import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Real Estate Investing 2026 | Barakah',
  description:
    'Halal real estate investing in 2026: direct ownership, which REITs are halal, crowdfunding platforms, and Diminishing Musharaka structures for Muslim investors.',
  keywords: [
    'halal real estate investing',
    'halal reits',
    'islamic real estate',
    'halal property investing 2026',
    'sharia compliant real estate',
    'diminishing musharaka real estate',
    'halal real estate crowdfunding',
    'manzil real estate',
    'islamic property fund',
    'aaoifi real estate',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-real-estate-investing-2026' },
  openGraph: {
    title: 'Halal Real Estate Investing 2026 — Direct, REITs, Crowdfunding, Musharaka',
    description: 'The four routes Muslim investors actually use to own real estate in 2026: direct ownership, halal REITs, crowdfunding, and Diminishing Musharaka.',
    url: 'https://trybarakah.com/learn/halal-real-estate-investing-2026',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halal Real Estate Investing 2026',
    description: 'Direct ownership, halal REITs, crowdfunding, and Diminishing Musharaka explained.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Halal Real Estate Investing 2026', item: 'https://trybarakah.com/learn/halal-real-estate-investing-2026' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Real Estate Investing 2026',
  description: 'Direct ownership, halal REITs, crowdfunding platforms, and Diminishing Musharaka for Muslim real estate investors in 2026.',
  url: 'https://trybarakah.com/learn/halal-real-estate-investing-2026',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function HalalRealEstatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Plan Halal Investments →
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Halal Real Estate Investing 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 9 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Halal Real Estate Investing 2026 — The Four Routes That Actually Work
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Real estate is one of the few asset classes the classical scholars unambiguously praise. The Prophet (peace be upon him) himself owned property. The structure is what trips most Muslim investors up — most US REITs and crowdfunding platforms involve riba at the corporate level. Here are the four routes that work in 2026, what scholars say about each, and where the traps are.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Route 1: Direct ownership of rental property</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The cleanest form. You buy a property, rent it out, collect rent, pay maintenance, keep the surplus. AAOIFI scholars treat rental income as halal earning by definition because it is compensation for the use of a real asset. Capital gain on sale is also halal.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The trap: how you finance it. A conventional 30-year mortgage is riba on contract. To keep direct ownership halal, you need either:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>All cash — the cleanest path, the slowest.</li>
            <li>Halal financing via Guidance Residential, UIF, or ICFAL using Diminishing Musharaka. These will finance investment properties in some states, with stricter terms and higher down payments than primary residence.</li>
            <li>Lariba American Finance House, which offers profit-sharing structures for rental property in select markets.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            One more catch: the tenants. Mufti Faraz Adam and other contemporary scholars recommend screening tenants and uses. Renting to a bar, casino, or interest-based business is impermissible because you are facilitating haram earning. Standard residential tenants are fine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Route 2: REITs (be selective)</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Most US REITs fail AAOIFI Standard 21. They typically carry debt at 40-60% of total assets (a feature of the REIT business model, not a bug), which busts the 33% debt ratio. They earn interest on cash holdings and sometimes on tenant escrows. The underlying tenant mix often includes haram industries (casinos in gaming REITs, banks in office REITs).
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            That said, a small number of REITs and REIT-like structures do pass:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>Equinix (EQIX)</strong> — historically passes AAOIFI screens (debt ratio sometimes hits 33-35%, watch quarterly). Halal tenants (data center colocation).</li>
            <li><strong>Public Storage (PSA)</strong> — periodically passes. Storage tenant mix is benign. Debt ratio fluctuates with acquisitions.</li>
            <li><strong>Sabana Industrial REIT</strong> (Singapore SGX) — a fully Sharia-compliant REIT with AAOIFI certification. Listed on SGX.</li>
            <li><strong>Yarlung Tangco REIT</strong> (Malaysia) — KLSE-listed Islamic REIT.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Sheikh Joe Bradford&apos;s rule: screen every REIT individually each quarter. Sector-level assumptions are misleading because debt ratios swing with refinancings. Barakah re-screens every public REIT after every 10-Q.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Route 3: Halal real estate crowdfunding</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Crowdfunding lets you buy fractional interest in a specific property or pool. The Sharia question is about the legal structure: are you buying equity in the asset (halal) or making an interest-bearing loan (haram)?
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Most US platforms (Fundrise, RealtyMogul, CrowdStreet) use a mix of debt and equity offerings. Their debt deals are typically interest-bearing notes — haram. Their equity deals are sometimes structured cleanly enough to be halal, but the underlying property may be financed with a conventional mortgage at the LLC level, which contaminates the structure.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Cleaner alternatives:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li><strong>Manzil Communities</strong> (Canada/US) — Sharia-compliant fractional ownership in specific rental properties. Audited by an in-house scholarly board.</li>
            <li><strong>Yieldstreet Sharia track</strong> — limited but growing. Verify each deal.</li>
            <li><strong>Cur8 Capital</strong> (UK) — Sharia-compliant property funds, accessible from the US for accredited investors.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Mufti Faraz Adam vets some of these structures. Look for explicit Sharia certification on the offering memo, not generic platform-level claims.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Route 4: Diminishing Musharaka co-ownership</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            This is the structure US halal mortgages use. You and the financier (a halal bank or a private partner) co-buy the property. The bank initially holds 80%, you 20%. You pay rent on the bank&apos;s share plus a buyout payment that increases your equity. After the term, you own 100%.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Why it is the gold standard for Muslims investing in real estate:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>The bank carries genuine ownership risk during the term. If property values fall, both partners take the hit proportionally.</li>
            <li>Rent is tied to a market rental rate, not a fixed interest rate. AAOIFI Standard 12 governs the structure.</li>
            <li>Mufti Taqi Usmani considers Musharaka the most authentically Islamic financing structure — it forces real risk-sharing.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            For investors building a small rental portfolio, you can replicate Diminishing Musharaka informally with a family member or business partner: co-buy the property, agree on rental split, and have one partner gradually buy out the other over a defined timeline. Document everything, get scholar review on the contract, and split rent and capital gain proportionally.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Zakat treatment</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            A property you live in or rent out is not zakatable. Rental income is zakatable on whatever cash you still hold on your hawl date. Property held for resale (a flip) is zakatable on its market value each year. AAOIFI Standard 35 codifies this. Halal REITs and crowdfunding investments are zakatable on their fair market value annually if you hold them with trade intent.
          </p>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Direct ownership financed via Diminishing Musharaka (Guidance, UIF, ICFAL) is the cleanest path. Halal REIT options exist but require quarterly re-screening — Equinix and a few Asian Islamic REITs are the usual passes. Most US crowdfunding platforms have riba at the LLC level; lean on Manzil and Cur8 instead. Avoid conventional mortgage financing for any investment property.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/halal-mortgage-providers-usa', title: 'Halal Mortgage Providers (USA)', desc: 'Guidance, UIF, ICFAL compared.' },
                { href: '/learn/diminishing-musharaka-explained', title: 'Diminishing Musharaka', desc: 'The contract behind US halal mortgages.' },
                { href: '/learn/zakat-on-rental-property', title: 'Zakat on Rental Property', desc: 'How rental income and property are taxed.' },
                { href: '/learn/halal-mortgage-vs-rent-2026', title: 'Halal Mortgage vs Rent', desc: 'When buying makes sense for Muslims.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Track halal real estate in Barakah</h2>
            <p className="text-green-200 mb-6">Connect rental property, REIT positions, and crowdfunding investments. Barakah handles the Sharia screening, zakat, and cash flow tracking in one place.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free Account
              </Link>
              <Link href="/learn/diminishing-musharaka-explained" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Diminishing Musharaka →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
