import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Musharaka (مشاركة) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Musharaka is a profit-and-loss partnership contract — the foundation of Shariah-compliant home financing and Islamic venture capital. Learn how it works.',
  keywords: ['musharaka', 'musharakah', 'musharaka definition', 'islamic partnership', 'diminishing musharaka'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/musharaka' },
  openGraph: {
    title: 'Musharaka (مشاركة) — Definition & Meaning | Barakah',
    description: 'The profit-and-loss partnership behind halal home finance.',
    url: 'https://trybarakah.com/fiqh-terms/musharaka',
    type: 'article',
    images: [
      {
        url: 'https://trybarakah.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Barakah — Islamic finance glossary',
      },
    ],
},
};

export default function MusharakaTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Musharaka',
    alternateName: 'مشاركة',
    description:
      'A Shariah-compliant partnership contract in which two or more parties contribute capital and share in profits and losses in proportion to their equity.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/musharaka',
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/fiqh-terms" className="hover:text-[#1B5E20] transition">Fiqh Terms</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Musharaka</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Musharaka</h1>
            <span className="text-3xl text-gray-500" dir="rtl">مشاركة</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Musharaka</strong> is a Shariah-compliant partnership. Two or more parties pool
              capital, share profits by agreement, and share losses strictly in proportion to their
              capital stake. It is one of the two classical alternatives to{' '}
              <Link href="/fiqh-terms/riba" className="text-[#1B5E20] underline">riba</Link>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>sh-r-k</em> (ش-ر-ك), meaning &quot;to share&quot; or &quot;to participate.&quot;
              Musharaka literally means <em>co-participation</em> — each partner genuinely at risk in the
              outcome.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Core requirements</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Each partner contributes capital (cash, inventory, or labor in some variations)</li>
              <li>Profits shared by pre-agreed ratio — may differ from capital ratio</li>
              <li><strong>Losses shared strictly by capital ratio</strong> — this is the Shariah anchor</li>
              <li>No guaranteed return; no fixed-income payments</li>
              <li>All partners have right to manage unless they formally delegate</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Diminishing musharaka (home finance)</h2>
            <p className="text-base leading-7 text-gray-800 mb-2">
              The most common modern application: <em>musharaka mutanaqisa</em>. The bank and buyer
              jointly purchase a home. The buyer pays monthly:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Rent for the bank&apos;s share of usage (an <Link href="/fiqh-terms/ijara" className="text-[#1B5E20] underline">ijara</Link> component)</li>
              <li>A principal payment that buys out the bank&apos;s equity over time</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-2">
              At the end of the contract, the buyer owns 100% and the bank has exited. Unlike a
              conventional mortgage, the bank genuinely shared ownership risk throughout.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/murabaha" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Murabaha →</Link>
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/learn/diminishing-musharaka-explained" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Full guide →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
