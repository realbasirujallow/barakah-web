import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Takaful (تكافل) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Takaful is cooperative mutual-aid risk-sharing — the halal alternative to conventional insurance. Learn the structures, models, and why it avoids gharar and riba.',
  keywords: ['takaful', 'takaful definition', 'islamic insurance', 'halal insurance', 'takaful meaning'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/takaful' },
  openGraph: {
    title: 'Takaful (تكافل) — Definition & Meaning | Barakah',
    description: 'The halal alternative to conventional insurance.',
    url: 'https://trybarakah.com/fiqh-terms/takaful',
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

export default function TakafulTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Takaful',
    alternateName: 'تكافل',
    description:
      'A Shariah-compliant cooperative risk-sharing arrangement in which members contribute to a pool that compensates any member who suffers a defined loss.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/takaful',
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
          <span className="text-gray-900">Takaful</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Takaful</h1>
            <span className="text-3xl text-gray-500" dir="rtl">تكافل</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Takaful</strong> is cooperative mutual-aid. Members contribute to a collective
              pool under a donation (<em>tabarru&apos;</em>) arrangement; when any member suffers a
              defined loss, the pool compensates them. It is the halal alternative to conventional
              insurance.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>k-f-l</em> (ك-ف-ل), meaning &quot;to guarantee&quot; or &quot;to stand
              surety.&quot; The <em>ta-</em> prefix makes it reciprocal: <em>mutual
              guarantee</em>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Why conventional insurance is problematic</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Gharar</strong> (excessive uncertainty) — you pay premiums without knowing if you&apos;ll ever claim</li>
              <li><strong>Riba</strong> — insurers invest floats in interest-bearing bonds</li>
              <li><strong>Maysir</strong> (gambling-like) — one side wins, the other loses based on chance</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">How takaful solves it</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Contributions are <em>donations</em>, not premiums — members mutually indemnify each other</li>
              <li>Pool is invested only in <Link href="/learn/halal-investing-guide" className="text-[#1B5E20] underline">Shariah-compliant instruments</Link></li>
              <li>Operating company is a manager (<em>wakil</em>), paid a fixed fee or profit share — not a counter-party</li>
              <li>Surplus in the pool returns to participants proportionally</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Models</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Wakala model</strong> — operator paid a fixed agency fee</li>
              <li><strong>Mudaraba model</strong> — operator shares profit on the pool&apos;s investments</li>
              <li><strong>Hybrid wakala-mudaraba</strong> — most common modern structure</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms/waqf" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Waqf →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
