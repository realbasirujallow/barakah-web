import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Riba (ربا) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Riba is interest or usury — categorically forbidden in Islam. Learn the two classical types (riba al-nasi\'a, riba al-fadl) and what counts today.',
  keywords: ['riba', 'riba definition', 'riba meaning', 'what is riba', 'interest in islam', 'islamic interest'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/riba' },
  openGraph: {
    title: 'Riba (ربا) — Definition & Meaning | Barakah',
    description: 'Interest or usury — categorically prohibited in Islam.',
    url: 'https://trybarakah.com/fiqh-terms/riba',
    type: 'article',
  },
};

export default function RibaTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Riba',
    alternateName: 'ربا',
    description:
      'The prohibition of interest and usury. Any predetermined, guaranteed return on a loan, or unequal exchange of the same commodity, is riba and is categorically forbidden.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/riba',
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
          <span className="text-gray-900">Riba</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Riba</h1>
            <span className="text-3xl text-gray-500" dir="rtl">ربا</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Riba</strong> is interest or usury: any predetermined, guaranteed return on a
              loan. It is categorically forbidden in the Qur&apos;an (2:275&ndash;279) and all four
              Sunni madhabs. It is the most explicit prohibition in Islamic commercial law.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From the Arabic <em>r-b-w</em> (ر-ب-و), meaning &quot;to increase&quot; or &quot;to
              grow.&quot; Riba refers specifically to the <em>unjustified</em> increase: wealth that
              grows without productive economic activity or risk-sharing.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">The two classical types</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#1B5E20] mb-1">1. Riba al-nasi&apos;a (debt riba)</h3>
                <p className="text-sm leading-7 text-gray-800">
                  Interest charged for deferring repayment of a loan. This is the modern
                  conventional banking model: lend $1,000 today, demand $1,050 back in a year. The
                  $50 is riba.
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#1B5E20] mb-1">2. Riba al-fadl (exchange riba)</h3>
                <p className="text-sm leading-7 text-gray-800">
                  Unequal hand-to-hand exchange of the same commodity (gold for gold, dates for dates,
                  etc.) in different quantities or qualities. The ruling is to exchange equal-for-equal
                  or sell one for money and buy the other separately.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">What counts as riba today</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Credit-card interest and late fees</li>
              <li>Conventional mortgage interest</li>
              <li>Savings-account interest (including HYSA)</li>
              <li>Bond yields (except sukuk, which are asset-backed)</li>
              <li>Auto loans, student loans, personal loans with interest</li>
              <li>Peer-to-peer lending with fixed return</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah flags riba-contaminated transactions in real time on your linked accounts: bank
              interest income, credit-card charges, and debt-service payments. The app computes a
              purification amount to dispose of incidentally earned riba, and tracks your
              <em> riba elimination</em> journey.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/murabaha" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Murabaha →</Link>
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/learn/riba-elimination" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba elimination →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
