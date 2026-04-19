import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat (زكاة) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Zakat is the 2.5% obligatory annual charity on qualifying wealth held above the nisab for a lunar year. Scholar-aligned definition, calculation, and modern application.',
  keywords: ['zakat', 'zakat definition', 'zakat meaning', 'what is zakat', 'zakat in islam'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/zakat' },
  openGraph: {
    title: 'Zakat (زكاة) — Definition & Meaning | Barakah',
    description: 'Scholar-aligned definition of zakat in Islamic finance.',
    url: 'https://trybarakah.com/fiqh-terms/zakat',
    type: 'article',
  },
};

export default function ZakatTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Zakat',
    alternateName: 'زكاة',
    description:
      'Zakat is the third pillar of Islam: an annual obligatory charity of 2.5% on qualifying wealth that has been held above the nisab threshold for one lunar year (hawl).',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/zakat',
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
          <span className="text-gray-900">Zakat</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Zakat</h1>
            <span className="text-3xl text-gray-500" dir="rtl">زكاة</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Zakat</strong> is the third pillar of Islam: an annual obligatory charity of
              <strong> 2.5% of qualifying wealth</strong> once it passes the <Link href="/fiqh-terms/nisab" className="text-[#1B5E20] underline">nisab</Link> threshold
              and is held for one lunar year (<Link href="/fiqh-terms/hawl" className="text-[#1B5E20] underline">hawl</Link>).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              The Arabic root <em>z-k-y</em> (ز-ك-ي) carries two simultaneous meanings: <em>purification</em>
              and <em>growth</em>. Paying zakat purifies the remaining 97.5% of your wealth and — in the
              divine economy of Islam — causes it to grow in barakah (blessing), not diminish.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Fiqh ruling</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Zakat is <em>fard &apos;ayn</em> (an individual obligation) on every adult, sane, free Muslim who
              owns wealth above the nisab for a full hawl. It is owed on:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Cash, bank balances, and digital money</li>
              <li>Gold and silver — in any form, including jewelry (per the majority of madhabs)</li>
              <li>Liquid investments: stocks, ETFs, cryptocurrency</li>
              <li>Retirement accounts with access (401k, IRA, pension) — partial or full depending on withdrawal rights</li>
              <li>Business inventory and receivables</li>
              <li>Rental income retained past the hawl</li>
              <li>Livestock and agricultural produce (with separate thresholds)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">The 8 eligible recipients</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Qur&apos;an 9:60 lists the only eight categories eligible to receive zakat:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Al-fuqara</strong> — the poor</li>
              <li><strong>Al-masakin</strong> — the destitute</li>
              <li><strong>Al-&apos;amilin &apos;alayha</strong> — zakat administrators</li>
              <li><strong>Al-mu&apos;allafati qulubuhum</strong> — those whose hearts are being reconciled</li>
              <li><strong>Fir-riqab</strong> — freeing captives</li>
              <li><strong>Al-gharimin</strong> — debtors</li>
              <li><strong>Fi sabilillah</strong> — in the cause of Allah</li>
              <li><strong>Ibn as-sabil</strong> — the stranded traveler</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah&apos;s zakat engine aggregates every asset class through Plaid-linked accounts, applies
              daily <Link href="/fiqh-terms/nisab" className="underline">nisab</Link> checks using three
              methodologies (AMJA-gold, Classical-silver, Lower-of-Two), and produces a SHA-256 integrity
              hash for every snapshot so your calculation is reproducible and auditable.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Nisab →</Link>
              <Link href="/fiqh-terms/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hawl →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Full guide →</Link>
              <Link href="/zakat-calculator" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Calculate zakat →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
