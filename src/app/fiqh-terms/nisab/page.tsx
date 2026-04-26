import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nisab (نصاب) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Nisab is the minimum wealth threshold that triggers zakat. Explained with the gold standard, silver standard, and the scholarly reasoning behind each.',
  keywords: ['nisab', 'nisab definition', 'nisab threshold', 'zakat threshold', 'nisab meaning'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/nisab' },
  openGraph: {
    title: 'Nisab (نصاب) — Definition & Meaning | Barakah',
    description: 'The minimum wealth threshold that triggers zakat.',
    url: 'https://trybarakah.com/fiqh-terms/nisab',
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

export default function NisabTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Nisab',
    alternateName: 'نصاب',
    description:
      'The minimum threshold of wealth that obligates zakat. Barakah uses the AMJA standard of 85g of gold or 595g of silver (classical weights: 87.48g / 612.36g), whichever your methodology selects.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/nisab',
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
          <span className="text-gray-900">Nisab</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Nisab</h1>
            <span className="text-3xl text-gray-500" dir="rtl">نصاب</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Nisab</strong> is the minimum wealth threshold that obligates{' '}
              <Link href="/fiqh-terms/zakat" className="text-[#1B5E20] underline">zakat</Link>.
              Below it, no zakat is due. Barakah applies the AMJA standard of{' '}
              <strong>85g of gold</strong> or <strong>595g of silver</strong> (classical weights
              are 87.48g / 612.36g — the modern rounded values are within ~3% and are what
              AMJA, many US scholars, and most practical calculators use today).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From the Arabic root <em>n-s-b</em> (ن-ص-ب), meaning &quot;to set up&quot; or &quot;to
              establish.&quot; A nisab is a <em>marker</em> — the line at which wealth becomes
              zakatable.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">The three methodologies</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#1B5E20] mb-1">1. Gold nisab (AMJA default)</h3>
                <p className="text-sm leading-7 text-gray-800">
                  20 <em>mithqal</em>. Barakah uses <strong>85g</strong> of gold — the AMJA
                  standard adopted by many modern US scholars. Classical fiqh texts specify
                  87.48g (20 × 4.374g per mithqal); AMJA rounds to 85g for practical use.
                  Both reflect the buying power the Prophet ﷺ specified in dinars.
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#1B5E20] mb-1">2. Silver nisab (classical Hanafi)</h3>
                <p className="text-sm leading-7 text-gray-800">
                  200 <em>dirham</em>. Barakah uses <strong>595g</strong> of silver (classical
                  weight is 612.36g; AMJA rounds to 595g). This is the Hanafi madhab&apos;s preferred
                  threshold because it&apos;s lower in modern dollar terms — making zakat due on more
                  households and thus benefiting more recipients.
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#1B5E20] mb-1">3. Lower-of-two (safest)</h3>
                <p className="text-sm leading-7 text-gray-800">
                  Use whichever nisab is lower today, so you err on the side of fulfilling the
                  obligation. This is the most precautionary (<em>ihtiyat</em>) option.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah runs a <strong>daily nisab check</strong> against live gold and silver spot
              prices. Hanafi users default to silver (automatically, with scholar-reviewed justification);
              others can switch between the three methodologies at any time. Every snapshot records
              which nisab was used and the exact USD value.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hawl →</Link>
              <Link href="/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Full guide →</Link>
              <Link href="/zakat-calculator" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Check nisab now →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
