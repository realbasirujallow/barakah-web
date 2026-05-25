import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Mortgage Near Me (2026) — Find Islamic Home Financing by City & State',
  description:
    'How to find a halal mortgage near you. Shariah-compliant home financing is licensed by state, not city — see which providers serve your state and browse our city guides for major US Muslim communities.',
  keywords: ['halal mortgage near me', 'islamic home loan near me', 'halal mortgage my city', 'shariah compliant mortgage near me', 'muslim home financing near me'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-near-me' },
  openGraph: {
    title: 'Halal Mortgage Near Me (2026)',
    description: 'Find Shariah-compliant home financing in your state — provider availability explained, plus city-by-city guides.',
    url: 'https://trybarakah.com/learn/halal-mortgage-near-me',
    type: 'article',
  },
};

const cities: { name: string; slug: string }[] = [
  { name: 'Atlanta, GA', slug: 'halal-mortgage-atlanta' },
  { name: 'Boston, MA', slug: 'halal-mortgage-boston' },
  { name: 'Chicago, IL', slug: 'halal-mortgage-chicago' },
  { name: 'Columbus, OH', slug: 'halal-mortgage-columbus' },
  { name: 'Dallas, TX', slug: 'halal-mortgage-dallas' },
  { name: 'Denver, CO', slug: 'halal-mortgage-denver' },
  { name: 'Detroit, MI', slug: 'halal-mortgage-detroit' },
  { name: 'Houston, TX', slug: 'halal-mortgage-houston' },
  { name: 'Los Angeles, CA', slug: 'halal-mortgage-los-angeles' },
  { name: 'Minneapolis, MN', slug: 'halal-mortgage-minneapolis' },
  { name: 'Nashville, TN', slug: 'halal-mortgage-nashville' },
  { name: 'Philadelphia, PA', slug: 'halal-mortgage-philadelphia' },
  { name: 'Phoenix, AZ', slug: 'halal-mortgage-phoenix' },
  { name: 'Raleigh-Durham, NC', slug: 'halal-mortgage-raleigh' },
  { name: 'San Antonio, TX', slug: 'halal-mortgage-san-antonio' },
  { name: 'San Jose, CA', slug: 'halal-mortgage-san-jose' },
  { name: 'Seattle, WA', slug: 'halal-mortgage-seattle' },
  { name: 'Tulsa, OK', slug: 'halal-mortgage-tulsa' },
  { name: 'Washington, DC', slug: 'halal-mortgage-washington-dc' },
];

const faq = [
  {
    q: 'Is a halal mortgage available near me?',
    a: 'Availability is set at the state level, not the city level. If a Shariah-compliant provider is licensed in your state, you can usually apply no matter which city or town you live in. The most widely available AMJA-permissible provider is Guidance Residential, licensed in 30-plus states; in California, the member-owned Ameen Housing Cooperative was also found permissible by AMJA.',
  },
  {
    q: 'What if no provider is based in my city?',
    a: 'That is normal and not a problem. Halal home financiers operate by state license and originate remotely, so a provider headquartered elsewhere can still finance your home as long as it is licensed in your state. A local branch is convenient but not required.',
  },
  {
    q: 'How is a halal home purchase different from a regular mortgage?',
    a: 'Instead of lending you money at interest (riba), the financier either co-owns the home with you and you buy out their share over time (diminishing musharaka), leases it to you with payments that build equity (ijara), or buys the home and resells it to you at a disclosed markup (murabaha). You owe a price or rent, not interest.',
  },
  {
    q: 'How do I choose between providers?',
    a: 'Compare the effective total cost (not just the headline rate-equivalent), the structure offered, down payment requirements, fees, and state availability. Always verify current terms directly with each provider, and consider consulting a qualified scholar about the specific contract before signing.',
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
            <Link href="/learn/halal-mortgage-providers-usa" className="text-green-700 hover:underline">Halal Mortgage Providers</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Near Me</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Halal Mortgage Near Me (2026)
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-05-24</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            Looking for a Shariah-compliant home loan close to you? The most important thing to know is that
            halal home financing is licensed <strong>by state, not by city</strong> — so &ldquo;near me&rdquo;
            really means &ldquo;available in my state.&rdquo; Here is how to find your options.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Important:</strong> Educational information only. Programs, rates, and state availability change
            frequently — verify current terms directly with each provider and consult a qualified scholar before
            committing.
          </div>

          {/* How availability works */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">How &ldquo;near me&rdquo; works for halal financing</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Unlike a local bank branch, halal home financiers operate under state mortgage licenses and originate
              remotely. That means a provider headquartered in another state can still finance your home, as long as
              it holds a license in <em>your</em> state. So the question is rarely &ldquo;is there one in my city?&rdquo;
              and almost always &ldquo;which providers are licensed in my state?&rdquo;
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Guidance Residential</strong> — found permissible by AMJA&rsquo;s Resident Fatwa Committee; one of the largest providers, licensed in 30-plus states.</li>
              <li><strong>Ameen Housing Cooperative</strong> — found permissible by AMJA; a member-owned co-op operating only in California.</li>
              <li><strong>Neeyah</strong> — found permissible by AMJA; a shared-equity (diminishing partnership) model operating in around 17 states as of 2026.</li>
              <li><strong>Mubarak Mortgage</strong> — found permissible by AMJA; a murabaha (cost-plus) provider in select states.</li>
              <li><strong>UIF Corporation</strong> and <strong>Devon Bank</strong> — AMJA permitted these only in cases of dire need.</li>
              <li>AMJA ruled that some companies whose contracts contain disguised interest are <strong>not permissible</strong>. Always confirm a provider&rsquo;s current AMJA status, and consult a scholar, before committing.</li>
            </ul>
            <Link href="/learn/halal-mortgage-providers-usa" className="inline-block mt-4 text-sm text-[#1B5E20] font-semibold hover:underline">
              Compare all US halal mortgage providers →
            </Link>
          </section>

          {/* City guides */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Halal mortgage guides by city</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              We&rsquo;ve written local guides for metros with large Muslim communities. Each one covers which providers
              serve that state and any genuine local angle.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/learn/${c.slug}`}
                  className="block p-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 hover:border-green-700 hover:text-green-700 transition dark:border-gray-700 dark:text-gray-100"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 dark:text-gray-400">
              Don&rsquo;t see your city? Availability still depends on your <em>state</em> — check the provider comparison
              above to see who is licensed where you live.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Halal mortgage near me — FAQ</h2>
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
            <h2 className="text-2xl font-bold mb-3">Plan your home purchase the halal way</h2>
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
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">AMJA-permissible options compared.</p>
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
