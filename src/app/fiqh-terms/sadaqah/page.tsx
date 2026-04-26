import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sadaqah (صدقة) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Sadaqah is voluntary charity — any time, any amount, any asset. Learn the distinction from zakat, the reward structure, and types (sadaqah jariyah).',
  keywords: ['sadaqah', 'sadaqah definition', 'sadaqah meaning', 'voluntary charity', 'sadaqah jariyah'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/sadaqah' },
  openGraph: {
    title: 'Sadaqah (صدقة) — Definition & Meaning | Barakah',
    description: 'Voluntary charity given any time, any amount, any asset.',
    url: 'https://trybarakah.com/fiqh-terms/sadaqah',
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

export default function SadaqahTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Sadaqah',
    alternateName: 'صدقة',
    description:
      'Voluntary charitable giving with no threshold, no fixed rate, and no calendar. Distinct from the obligatory zakat.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/sadaqah',
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
          <span className="text-gray-900">Sadaqah</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Sadaqah</h1>
            <span className="text-3xl text-gray-500" dir="rtl">صدقة</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Sadaqah</strong> is voluntary charity. No threshold, no fixed rate, no calendar,
              no category of recipients. Any act of goodness — financial or otherwise — offered
              sincerely for Allah&apos;s sake counts as sadaqah.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>s-d-q</em> (ص-د-ق), the root of <em>sidq</em> (truthfulness). Sadaqah is an
              outward confirmation of inward faith — truthful action proving sincere belief.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Sadaqah vs zakat</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Dimension</th>
                    <th className="p-3 font-semibold text-gray-700">Zakat</th>
                    <th className="p-3 font-semibold text-gray-700">Sadaqah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Obligation</td><td className="p-3">Fard (required)</td><td className="p-3">Sunnah (recommended)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Rate</td><td className="p-3">Fixed (2.5%)</td><td className="p-3">Any amount</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Threshold</td><td className="p-3">Nisab</td><td className="p-3">None</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Calendar</td><td className="p-3">Annual (hawl)</td><td className="p-3">Anytime</td></tr>
                  <tr><td className="p-3 font-semibold">Recipients</td><td className="p-3">8 specific categories</td><td className="p-3">Anyone</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Sadaqah Jariyah (continuous charity)</h2>
            <p className="text-base leading-7 text-gray-800">
              A special category: charity whose benefit continues after death. Classical examples:
              digging a well, planting a tree, building a mosque, or funding beneficial knowledge.
              Modern examples include endowing a <Link href="/fiqh-terms/waqf" className="text-[#1B5E20] underline">waqf</Link>,
              scholarship funds, or publishing Islamic content. The Prophet ﷺ said its reward continues
              until Judgment Day.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah&apos;s Ramadan Giving Tracker and year-round sadaqah log help you record
              voluntary giving separately from zakat, so you can see both obligation and generosity
              in one dashboard — and export receipts for tax-deduction purposes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/waqf" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Waqf →</Link>
              <Link href="/learn/sadaqah-vs-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah vs zakat →</Link>
              <Link href="/learn/ramadan-giving-tracker" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ramadan giving →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
