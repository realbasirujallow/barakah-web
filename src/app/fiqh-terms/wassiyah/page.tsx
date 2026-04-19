import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wassiyah (وصية) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    'Wassiyah is the discretionary Islamic will — up to 1/3 of the estate to non-heirs. Learn why it\'s required, the 1/3 cap, and how it coexists with faraid.',
  keywords: ['wassiyah', 'wasiyyah', 'wasiyah', 'islamic will', 'wassiyah definition', 'wassiyah meaning'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/wassiyah' },
  openGraph: {
    title: 'Wassiyah (وصية) — Definition & Meaning | Barakah',
    description: 'The Islamic will: discretionary bequests up to 1/3 of the estate.',
    url: 'https://trybarakah.com/fiqh-terms/wassiyah',
    type: 'article',
  },
};

export default function WassiyahTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Wassiyah',
    alternateName: 'وصية',
    description:
      "The discretionary portion of a Muslim's estate, capped at one-third of the net estate, that can be bequeathed to non-heirs or to charity under an Islamic will.",
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/wassiyah',
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
          <span className="text-gray-900">Wassiyah</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Wassiyah</h1>
            <span className="text-3xl text-gray-500" dir="rtl">وصية</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Wassiyah</strong> is the Islamic will — the <em>discretionary</em> portion of
              your estate. You may bequeath <strong>up to one-third</strong> to anyone <em>other
              than</em> your Qur&apos;anic heirs. The other two-thirds (minimum) flow through{' '}
              <Link href="/fiqh-terms/faraid" className="text-[#1B5E20] underline">faraid</Link>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>w-s-y</em> (و-ص-ي), meaning &quot;to enjoin,&quot; &quot;to instruct,&quot;
              or &quot;to commend.&quot; Wassiyah is a <em>testamentary instruction</em> — your last
              commands to the living.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Why it is required</h2>
            <p className="text-base leading-7 text-gray-800">
              The Prophet ﷺ said: <em>&quot;It is not permissible for a Muslim who has something to
              bequeath to pass two nights without having his will written with him.&quot;</em>
              (Bukhari 2738, Muslim 1627). Every Muslim adult with assets should have a written
              wassiyah.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">The 1/3 rule</h2>
            <p className="text-base leading-7 text-gray-800 mb-2">
              When Sa&apos;d ibn Abi Waqqas asked the Prophet ﷺ how much of his wealth he could
              bequeath, the Prophet said: <em>&quot;A third, and a third is a lot. Indeed to leave
              your inheritors wealthy is better than to leave them poor, begging from others.&quot;</em>
              (Bukhari 1295)
            </p>
            <p className="text-base leading-7 text-gray-800">
              The 1/3 cap protects heirs from being disinherited. Bequests beyond 1/3 are invalid
              unless <em>all</em> heirs consent after your death.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Common wassiyah contents</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Debts owed by you</strong> — including unpaid zakat (a debt to Allah)</li>
              <li><strong>Charity bequests</strong> — mosque, orphanage, Qur&apos;an printing, waqf</li>
              <li><strong>Non-heir beneficiaries</strong> — adopted children, non-Muslim spouses (who don&apos;t inherit under faraid), long-time caregivers</li>
              <li><strong>Executor (wasi)</strong> — the trustworthy adult you name to administer</li>
              <li><strong>Funeral instructions</strong> — Islamic burial preferences</li>
              <li><strong>Guardian for minor children</strong> — critical for Muslim parents in non-Muslim jurisdictions</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">How Barakah applies this</h2>
            <p className="text-sm leading-7 text-amber-900">
              Barakah&apos;s wassiyah builder (Plus/Family tier) generates a Shariah-compliant
              Islamic will with clauses validated against your jurisdiction&apos;s secular probate
              requirements — plus a paired <Link href="/faraid-calculator" className="underline font-semibold">faraid calculator</Link> so
              you see both the obligatory shares and your discretionary 1/3 in one projection.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/faraid" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Faraid →</Link>
              <Link href="/fiqh-terms/hibah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hibah →</Link>
              <Link href="/fiqh-terms/waqf" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Waqf →</Link>
              <Link href="/learn/islamic-will" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Islamic will guide →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
