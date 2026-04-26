import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hawl (حول) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Hawl is the lunar year holding period that makes zakat due. Explained with scholarly rulings on interruptions, resets, and daily wealth tracking.',
  keywords: ['hawl', 'hawl definition', 'zakat hawl', 'hawl meaning', 'lunar year zakat'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/hawl' },
  openGraph: {
    title: 'Hawl (حول) — Definition & Meaning | Barakah',
    description: 'The lunar year holding period that makes zakat due.',
    url: 'https://trybarakah.com/fiqh-terms/hawl',
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

export default function HawlTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Hawl',
    alternateName: 'حول',
    description:
      'The lunar-year holding period (~354 days) over which wealth must remain at or above the nisab for zakat to become due.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/hawl',
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
          <span className="text-gray-900">Hawl</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Hawl</h1>
            <span className="text-3xl text-gray-500" dir="rtl">حول</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Hawl</strong> is the lunar-year holding period — approximately 354 days — during
              which your wealth must remain at or above the <Link href="/fiqh-terms/nisab" className="text-[#1B5E20] underline">nisab</Link>{' '}
              for <Link href="/fiqh-terms/zakat" className="text-[#1B5E20] underline">zakat</Link> to
              become due.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>h-w-l</em> (ح-و-ل) meaning &quot;to turn&quot; or &quot;to revolve.&quot; The hawl
              is a <em>turning</em> of the year — one full orbit of the lunar calendar from the day your
              wealth first crossed the nisab.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">The four reset rulings</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              What happens when your wealth dips below nisab mid-year? The four Sunni madhabs differ:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Madhab</th>
                    <th className="p-3 font-semibold text-gray-700">If wealth dips below nisab mid-hawl</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Hanafi</td><td className="p-3">Hawl only resets if wealth stays below nisab at year-end</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Maliki</td><td className="p-3">Hawl resets only on complete loss of all zakatable wealth</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Shafi&apos;i</td><td className="p-3">Hawl resets the moment wealth drops below nisab</td></tr>
                  <tr><td className="p-3 font-semibold">Hanbali</td><td className="p-3">Hawl resets the moment wealth drops below nisab</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah checks your net zakatable wealth <em>daily</em> and tracks your hawl anchor date
              per your madhab&apos;s reset rule. When you cross below nisab, the app logs the event and
              applies the correct ruling — so you always know whether your hawl is continuing,
              pausing, or resetting.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Nisab →</Link>
              <Link href="/learn/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Full guide →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
