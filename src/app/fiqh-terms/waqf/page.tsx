import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Waqf (وقف) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    "Waqf is a perpetual endowment: the asset's principal is preserved forever and only its income is used for charitable purposes. The oldest form of sadaqah jariyah.",
  keywords: ['waqf', 'awqaf', 'waqf definition', 'islamic endowment', 'sadaqah jariyah', 'waqf meaning'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/waqf' },
  openGraph: {
    title: 'Waqf (وقف) — Definition & Meaning | Barakah',
    description: 'Perpetual Islamic endowment — the oldest form of continuous charity.',
    url: 'https://trybarakah.com/fiqh-terms/waqf',
    type: 'article',
  },
};

export default function WaqfTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Waqf',
    alternateName: 'وقف',
    description:
      'A Shariah-compliant perpetual endowment in which an asset is dedicated to charitable use in perpetuity; the principal is preserved and only the income is deployed for the stated beneficiaries.',
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/waqf',
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
          <span className="text-gray-900">Waqf</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Waqf</h1>
            <span className="text-3xl text-gray-500" dir="rtl">وقف</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Waqf</strong> is a perpetual Islamic endowment. An asset is dedicated
              irrevocably to a charitable purpose; the <em>principal is preserved forever</em> and
              only its income funds the beneficiaries. It is the oldest institutionalized form of{' '}
              <Link href="/fiqh-terms/sadaqah" className="text-[#1B5E20] underline">sadaqah jariyah</Link>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>w-q-f</em> (و-ق-ف), meaning &quot;to stop&quot; or &quot;to hold.&quot; The
              waqf asset is <em>held in place</em> — frozen from ordinary market transfer so its
              benefit flows perpetually.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Historical examples</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Umar ibn al-Khattab&apos;s palm grove at Khaybar — the earliest documented waqf</li>
              <li>Al-Azhar University in Cairo — operating from waqf revenues since 970 CE</li>
              <li>Ottoman <em>awqaf</em> (plural) — at peak, funded 3/4 of social services in Muslim lands</li>
              <li>Modern waqf funds — securitized into waqf-sukuk for scalable endowment giving</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Essential conditions</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Irrevocability — once dedicated, cannot be sold, inherited, or gifted</li>
              <li>Perpetuity — must last &quot;as long as the asset endures&quot;</li>
              <li>Specific lawful purpose — mosque, school, hospital, orphanage, scholarship, etc.</li>
              <li>Asset must produce durable benefit (land, buildings, shares — traditionally real estate)</li>
              <li>Trustee (<em>mutawalli</em>) administers per the founder&apos;s stipulations</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Modern forms</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Cash waqf</strong> — revived in modern Turkey; principal invested in halal funds, income distributed</li>
              <li><strong>Waqf sukuk</strong> — pooled perpetual endowment through securitized investment certificates</li>
              <li><strong>Family waqf</strong> — benefits family descendants first, then broader charity when lineage ends</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/wassiyah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Wassiyah →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
