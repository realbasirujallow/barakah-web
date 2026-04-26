import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hibah (هبة) — Definition & Meaning in Islamic Finance | Barakah',
  description:
    "Hibah is a gift transferring ownership during the giver's lifetime. Unlike wassiyah (will), hibah is irrevocable once accepted and takes effect immediately.",
  keywords: ['hibah', 'hiba', 'hibah definition', 'islamic gift', 'lifetime gift', 'hibah meaning'],
  alternates: { canonical: 'https://trybarakah.com/fiqh-terms/hibah' },
  openGraph: {
    title: 'Hibah (هبة) — Definition & Meaning | Barakah',
    description: "The Islamic gift that transfers ownership during the giver's lifetime.",
    url: 'https://trybarakah.com/fiqh-terms/hibah',
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

export default function HibahTermPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Hibah',
    alternateName: 'هبة',
    description:
      "An irrevocable gift of property from giver to recipient that takes effect during the giver's lifetime, distinct from a testamentary bequest.",
    inDefinedTermSet: 'https://trybarakah.com/fiqh-terms',
    url: 'https://trybarakah.com/fiqh-terms/hibah',
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
          <span className="text-gray-900">Hibah</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Hibah</h1>
            <span className="text-3xl text-gray-500" dir="rtl">هبة</span>
          </div>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">At a glance</h2>
            <p className="text-base leading-7 text-gray-800">
              <strong>Hibah</strong> is a gift — a voluntary, gratuitous transfer of ownership from
              one living person to another. Unlike <Link href="/fiqh-terms/wassiyah" className="text-[#1B5E20] underline">wassiyah</Link>{' '}
              (a bequest that takes effect at death), hibah is effective immediately upon acceptance
              and delivery.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Linguistic root</h2>
            <p className="text-base leading-7 text-gray-800">
              From <em>w-h-b</em> (و-ه-ب), meaning &quot;to give freely,&quot; &quot;to bestow.&quot;
              It is one of Allah&apos;s names — <em>Al-Wahhab</em>, the Bestower — emphasizing the
              theological weight of generosity.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Valid hibah conditions</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Offer and acceptance</strong> — giver formally offers; recipient accepts</li>
              <li><strong>Delivery of possession</strong> (<em>qabd</em>) — the recipient must take the asset; mere verbal declaration is insufficient in most madhabs</li>
              <li><strong>Giver is competent</strong> — adult, sane, owner of the asset, not under duress</li>
              <li><strong>Asset is identifiable</strong> — cannot gift &quot;something&quot; ambiguously</li>
              <li><strong>Not contingent on death</strong> — such transfers fall under wassiyah rules instead</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Revocability</h2>
            <p className="text-base leading-7 text-gray-800">
              Once accepted and delivered, hibah is <em>generally irrevocable</em>. Exception: a gift
              from a parent to a child may be revoked while the child is still under the parent&apos;s
              guardianship (per the majority of scholars). Revoking a gift after broad delivery is
              discouraged by hadith: <em>&quot;The one who takes back his gift is like the dog that
              vomits and returns to its vomit.&quot;</em> (Bukhari 2621)
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Hibah as estate planning</h2>
            <p className="text-base leading-7 text-gray-800">
              Because <Link href="/fiqh-terms/wassiyah" className="text-[#1B5E20] underline">wassiyah</Link>{' '}
              cannot exceed 1/3 of your estate and cannot benefit Qur&apos;anic heirs, hibah during
              lifetime is a powerful tool: you can gift any amount to anyone (including heirs) —
              provided it&apos;s a real, completed transfer. Scholars advise fairness among children
              to avoid discord.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/wassiyah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Wassiyah →</Link>
              <Link href="/fiqh-terms/faraid" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Faraid →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
