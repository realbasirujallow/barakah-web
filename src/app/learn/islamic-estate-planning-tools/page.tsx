import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sharia-Compliant Estate Planning Tools: What to Look For (2026)',
  description:
    'A 2026 buyer’s guide to Sharia-compliant estate planning tools and platforms — the categories of solutions, the criteria that matter (faraid accuracy, the one-third rule, legal validity, multi-asset support), and how to choose one as a non-technical user.',
  keywords: [
    'sharia compliant estate planning platforms 2026',
    'islamic estate planning tools',
    'sharia compliant estate planning tools',
    'islamic will software',
    'muslim estate planning platform',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-estate-planning-tools' },
  openGraph: {
    title: 'Sharia-Compliant Estate Planning Tools: What to Look For (2026)',
    description: 'The categories of Islamic estate planning solutions and the criteria that matter when choosing one.',
    url: 'https://trybarakah.com/learn/islamic-estate-planning-tools',
    type: 'article',
  },
};

const categories = [
  {
    name: 'Integrated apps (faraid + wasiyyah + assets)',
    fit: 'Best for households that want the calculation, the will, and their actual asset picture in one place.',
    watch: 'Confirm it produces a legally valid document in your jurisdiction or pairs with one.',
  },
  {
    name: 'Online Islamic will services',
    fit: 'Good for a guided, document-focused process, often reviewed for Shariah compliance.',
    watch: 'Check who reviews the faraid logic and whether updates cost extra.',
  },
  {
    name: 'Estate attorneys with Islamic-finance expertise',
    fit: 'Best for complex estates — business interests, international assets, blended families.',
    watch: 'Most expensive; verify genuine familiarity with faraid, not just general estate law.',
  },
  {
    name: 'DIY templates',
    fit: 'Lowest cost for very simple estates.',
    watch: 'Highest risk of faraid or legal-validity errors; least support.',
  },
];

const criteria = [
  'Calculates faraid (fixed shares) correctly for your exact set of surviving heirs, including awl and radd cases.',
  'Handles the wasiyyah one-third limit and enforces "no bequest to an heir" (la wasiyyata li warith).',
  'Produces a document that is legally valid where you live — or clearly tells you to have an attorney finalize it.',
  'Supports all your asset types: cash, property, investments, business, retirement accounts, international holdings.',
  'Has credible Shariah review, and is transparent about who did it.',
  'Is usable by a non-technical person — clear steps, plain language, no jargon walls.',
  'Lets you update the plan as your family and assets change, without starting over.',
];

const faqItems = [
  {
    q: 'What is the most important feature in a Sharia-compliant estate planning tool?',
    a: 'Correct faraid calculation for your specific heirs. The fixed shares change depending on exactly who survives you, so a tool that hard-codes generic ratios — or ignores awl and radd adjustments — can produce an invalid distribution. Accuracy here matters more than design or price.',
  },
  {
    q: 'Can a tool alone make my Islamic will legally binding?',
    a: 'Not always. A tool can get the faraid and wasiyyah right Islamically, but legal validity depends on your jurisdiction’s rules for signing and witnessing. The best workflow is a tool that gets the Islamic distribution correct and then a licensed attorney who makes it legally enforceable where you live.',
  },
  {
    q: 'Are these tools suitable for non-technical users?',
    a: 'The better platforms are built for exactly that — guided questions, plain-language explanations, and sensible defaults. When evaluating one, do a short trial of the heir-entry flow; if it confuses you in five minutes, it is not the right fit.',
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
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
            <Link href="/learn/islamic-estate-planning" className="text-green-700 hover:underline">Islamic Estate Planning</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Tools</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Sharia-Compliant Estate Planning Tools: What to Look For in 2026
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-05-22</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            &quot;Islamic estate planning platform&quot; can mean very different things — from a DIY template to a full
            attorney engagement. This guide breaks down the categories of solutions and the criteria that actually
            matter, so you can choose one with confidence even if you are not technical.
          </p>

          {/* Categories */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">The four categories of solution</h2>
            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.name} className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{c.name}</h3>
                  <p className="text-sm text-gray-700 mt-1 dark:text-gray-300"><strong>Best for:</strong> {c.fit}</p>
                  <p className="text-sm text-gray-600 mt-1 dark:text-gray-400"><strong>Watch out:</strong> {c.watch}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Criteria checklist */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">The checklist that matters</h2>
            <ul className="space-y-2 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              {criteria.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-700 font-bold flex-shrink-0">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Where Barakah fits — honest */}
          <section className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-gray-100">Where Barakah fits</h2>
            <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
              Barakah is the integrated-app category: a <Link href="/faraid-calculator" className="text-green-700 hover:underline">faraid calculator</Link> and
              wasiyyah builder that work from your actual tracked assets, with the one-third rule and
              &quot;<Link href="/learn/la-wasiyyata-li-warith" className="text-green-700 hover:underline">no bequest to an heir</Link>&quot;
              built in. It is designed for non-technical users — but, as with any tool, have a licensed attorney finalize
              the document so it is legally enforceable where you live.
            </p>
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

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Note:</strong> Educational information only, not legal advice or a fatwa. Estate law varies by
            jurisdiction and inheritance rulings can vary by school of thought. Consult a qualified scholar and a
            licensed estate attorney before finalizing any plan.
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-teal-700 rounded-2xl p-8 text-white text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Plan your estate the Islamic way</h2>
            <p className="text-green-200 mb-6">
              Calculate each heir&apos;s fixed share, direct your one-third bequest correctly, and keep it current as
              your assets change — all in Barakah.
            </p>
            <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Get Started Free
            </Link>
          </div>

          {/* Hub navigation */}
          <nav aria-label="Related articles">
            <h2 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Islamic Inheritance Hub</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/learn/islamic-estate-planning" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Overview</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Islamic Estate Planning</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">The full concept and process.</p>
              </Link>
              <Link href="/learn/la-wasiyyata-li-warith" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Key Rule</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">No Bequest to an Heir</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">The hadith that shapes every will.</p>
              </Link>
              <Link href="/faraid-calculator" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Tool</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Faraid Calculator</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Calculate each heir&apos;s share.</p>
              </Link>
            </div>
          </nav>
        </div>
      </article>
    </>
  );
}
