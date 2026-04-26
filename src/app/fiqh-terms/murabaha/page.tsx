import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Murabaha (مرابحة) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Murabaha is a cost-plus sale where the seller discloses the purchase cost and adds an agreed markup. The structure behind most halal trade and asset financing.',
  keywords: ['murabaha', 'murabahah', 'murabaha definition', 'cost-plus sale', 'islamic trade finance'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/murabaha' },
  openGraph: {
    title: 'Murabaha (مرابحة) — Definition & Meaning | Barakah',
    description: 'The disclosed cost-plus sale used throughout Islamic trade finance.',
    url: 'https://trybarakah.com/fiqh-terms/murabaha',
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

export default function MurabahaTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Murabaha',
    alternateName: 'مرابحة',
    description:
      'A Shariah-compliant sale contract where the seller discloses their purchase cost and the buyer agrees to that cost plus a transparent markup.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/murabaha',
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
          <span className="text-gray-900">Murabaha</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Murabaha</h1>
            <span className="text-3xl text-gray-500" dir="rtl">مرابحة</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Murabaha</strong> is a cost-plus sale. The seller tells the buyer, in full
              transparency: <em>I bought this for $X and I&apos;m selling it to you for $X + $Y
              markup.</em> The buyer may pay immediately or on deferred installments — but the price
              is locked at agreement.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>r-b-h</em> (ر-ب-ح) meaning &quot;to profit.&quot; The <em>mu-</em> prefix makes
              it a participle: <em>the profit-disclosing sale</em>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Why it isn&apos;t riba</h2>
            <p className="text-base leading-7 text-gray-800 mb-2">
              Critics sometimes say murabaha is just interest in disguise. Scholars draw three clear
              distinctions:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Actual goods change hands</strong> — this is a sale, not a loan</li>
              <li><strong>Seller bears risk</strong> between acquisition and resale, however briefly</li>
              <li><strong>Price is fixed</strong> — cannot be increased for late payment (late fees, if any, must go to charity, not the seller)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Modern applications</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Commodity murabaha (Islamic bank liquidity)</li>
              <li>Asset finance — equipment, vehicles, inventory</li>
              <li>Home finance via murabaha (alternative to diminishing musharaka)</li>
              <li>Shariah-compliant credit cards with disclosed fixed fee</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/learn/halal-mortgage-providers-usa" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Halal mortgages →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
