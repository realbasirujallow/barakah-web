import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ijara (إجارة) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Ijara is the Islamic leasing contract — a transfer of usufruct (use) for rent, while ownership stays with the lessor. The backbone of halal auto and equipment finance.',
  keywords: ['ijara', 'ijarah', 'ijara definition', 'islamic leasing', 'halal lease'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/ijara' },
  openGraph: {
    title: 'Ijara (إجارة) — Definition & Meaning | Barakah',
    description: 'The Islamic lease contract that underpins halal auto and equipment finance.',
    url: 'https://trybarakah.com/fiqh-terms/ijara',
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

export default function IjaraTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Ijara',
    alternateName: 'إجارة',
    description:
      'A Shariah-compliant lease contract in which the lessor transfers the right to use an asset (usufruct) to the lessee for an agreed rental, while retaining ownership and responsibility for major maintenance.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/ijara',
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
          <span className="text-gray-900">Ijara</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Ijara</h1>
            <span className="text-3xl text-gray-500" dir="rtl">إجارة</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Ijara</strong> is the Islamic lease. The lessor (owner) transfers the
              <em> right to use</em> an asset to the lessee in exchange for rent. Ownership — and
              therefore major risks of ownership — stay with the lessor throughout.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>a-j-r</em> (أ-ج-ر), meaning &quot;to reward&quot; or &quot;to compensate.&quot;
              Ijara is the <em>compensated transfer of usufruct</em>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Core principles</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Asset must exist and be usable at contract time</li>
              <li>Asset must have a permissible use (no ijara over haram assets or activities)</li>
              <li>Rent must be known and agreed in advance</li>
              <li>Major maintenance and insurance are the lessor&apos;s responsibility (they hold the ownership risk)</li>
              <li>Routine operating costs are the lessee&apos;s</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Ijara muntahia bittamleek (lease-to-own)</h2>
            <p className="text-base leading-7 text-gray-800">
              A lease that culminates in ownership transfer. At the end of the lease period, the
              lessor gifts or sells the asset to the lessee. This is the structure behind most
              <em> halal auto loans</em>: the bank owns the car, rents it to you, and transfers
              ownership at the final payment.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms/murabaha" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Murabaha →</Link>
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
