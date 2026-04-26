import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Faraid (فرائض) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    "Faraid is the Qur'anic science of inheritance — fixed, divinely-allocated shares for each heir. Learn the spouse, parent, child, and residuary shares.",
  keywords: ['faraid', "fara'id", 'faraid definition', 'islamic inheritance', 'faraid meaning'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/faraid' },
  openGraph: {
    title: 'Faraid (فرائض) — Definition & Meaning | Barakah',
    description: 'Qur\'anically-fixed inheritance shares for Muslim heirs.',
    url: 'https://trybarakah.com/fiqh-terms/faraid',
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

export default function FaraidTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Faraid',
    alternateName: 'فرائض',
    description:
      'The Islamic science of inheritance: Qur\'anically-specified fixed shares allocated to designated heirs from the estate of a deceased Muslim.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/faraid',
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
          <span className="text-gray-900">Faraid</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Faraid</h1>
            <span className="text-3xl text-gray-500" dir="rtl">فرائض</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Faraid</strong> is the Islamic science of inheritance. Unlike most legal
              systems, Islam specifies <em>fixed Qur&apos;anic shares</em> for specific relatives — you
              cannot disinherit a Qur&apos;anic heir, and the shares are set by revelation
              (Qur&apos;an 4:11, 4:12, 4:176) rather than discretion.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>f-r-d</em> (ف-ر-ض), meaning &quot;to fix&quot; or &quot;to prescribe.&quot;
              Faraid is the plural of <em>faridah</em> — a <em>fixed obligation</em>, not a suggestion.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Order of distribution</h2>
            <p className="text-base leading-7 text-gray-800 mb-2">Before faraid shares are calculated, four prior claims settle:</p>
            <ol className="list-decimal space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Funeral expenses</li>
              <li>Debts (both to Allah — unpaid zakat — and to people)</li>
              <li>Wassiyah (up to 1/3 to non-heirs)</li>
              <li><strong>Faraid shares to Qur&apos;anic heirs from the remaining 2/3+</strong></li>
            </ol>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Common share examples</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Heir</th>
                    <th className="p-3 font-semibold text-gray-700">Share</th>
                    <th className="p-3 font-semibold text-gray-700">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Wife</td><td className="p-3">1/8</td><td className="p-3">If deceased left children</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Wife</td><td className="p-3">1/4</td><td className="p-3">No children</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Husband</td><td className="p-3">1/4</td><td className="p-3">If deceased left children</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Husband</td><td className="p-3">1/2</td><td className="p-3">No children</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Mother</td><td className="p-3">1/6</td><td className="p-3">If deceased left children or multiple siblings</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Father</td><td className="p-3">1/6 + residue</td><td className="p-3">If deceased left children</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Daughters</td><td className="p-3">1/2 (one) or 2/3 (multiple)</td><td className="p-3">No sons present</td></tr>
                  <tr><td className="p-3 font-semibold">Son</td><td className="p-3">Residue (2:1 vs daughters)</td><td className="p-3">Son takes twice a daughter&apos;s share</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah&apos;s <Link href="/faraid-calculator" className="underline font-semibold">faraid calculator</Link>{' '}
              lets you enter your family composition and net estate; the app computes every heir&apos;s
              share according to the classical faraid tables, including <em>radd</em> (return) and
              <em> awl</em> (reduction) edge cases.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/wassiyah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Wassiyah →</Link>
              <Link href="/fiqh-terms/hibah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hibah →</Link>
              <Link href="/faraid-calculator" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Calculate faraid →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
