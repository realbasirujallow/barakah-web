import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sukuk (صكوك) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Sukuk are Shariah-compliant investment certificates — the Islamic equivalent of bonds, but backed by real assets rather than debt. Explained with common structures.',
  keywords: ['sukuk', 'sukuk definition', 'islamic bonds', 'sukuk meaning', 'halal bonds'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/sukuk' },
  openGraph: {
    title: 'Sukuk (صكوك) — Definition & Meaning | Barakah',
    description: 'Asset-backed Islamic investment certificates, often called "Islamic bonds".',
    url: 'https://trybarakah.com/fiqh-terms/sukuk',
    type: 'article',
  },
};

export default function SukukTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Sukuk',
    alternateName: 'صكوك',
    description:
      'Asset-backed investment certificates representing undivided ownership in a tangible asset, usufruct, or project, and providing returns derived from that underlying.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/sukuk',
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/fiqh-terms" className="hover:text-[#1B5E20] transition">Fiqh Terms</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Sukuk</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Sukuk</h1>
            <span className="text-3xl text-gray-500" dir="rtl">صكوك</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Sukuk</strong> are Shariah-compliant investment certificates often called
              &quot;Islamic bonds,&quot; though the comparison is imperfect. A bond is a debt
              instrument that pays <Link href="/fiqh-terms/riba" className="text-[#1B5E20] underline">riba</Link>;
              sukuk represent <em>undivided ownership</em> in a real asset or project and return
              profit-share from that underlying.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              The singular is <em>sakk</em> (صك), meaning &quot;deed&quot; or &quot;certificate.&quot;
              Sukuk is the plural: a set of ownership claims.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Common structures</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Ijara sukuk</strong> — certificate holders own the asset; income is rent from leasing it</li>
              <li><strong>Musharaka sukuk</strong> — holders own equity in a project; income is profit share</li>
              <li><strong>Murabaha sukuk</strong> — holders finance a commodity purchase; income is disclosed markup</li>
              <li><strong>Wakala sukuk</strong> — holders delegate investment management under agency contract</li>
              <li><strong>Hybrid sukuk</strong> — blend of the above to meet specific risk/return needs</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Why they aren&apos;t bonds</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Sukuk holders <em>own</em> the underlying asset; bondholders lend money</li>
              <li>Sukuk returns are <em>asset-derived</em>; bond returns are interest</li>
              <li>Sukuk prices fluctuate with asset value; bonds fluctuate with rates</li>
              <li>In default, sukuk holders have recourse to the asset; bondholders become unsecured creditors</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Investing via Barakah</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah tracks sukuk ETFs like <strong>SPSK</strong> (SP Funds Dow Jones Global Sukuk
              ETF) alongside your other holdings — so your zakat calculation includes sukuk income
              correctly. Barakah does not execute trades; link Wahed or a brokerage for sukuk
              exposure.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms/murabaha" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Murabaha →</Link>
              <Link href="/learn/halal-etfs" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Halal ETFs →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
