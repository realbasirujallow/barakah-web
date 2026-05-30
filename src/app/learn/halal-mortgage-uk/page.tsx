import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Mortgage UK 2026 — Al Rayan, Gatehouse, Habib Bank Zurich Compared',
  description:
    "How a halal mortgage works in the UK: the three main providers (Al Rayan, Gatehouse, Habib Bank Zurich), how diminishing musharaka and ijara structures differ, typical deposit and rent share, and what to verify before you apply.",
  keywords: [
    'halal mortgage uk',
    'islamic mortgage uk',
    'al rayan bank mortgage',
    'gatehouse bank mortgage',
    'habib bank zurich mortgage',
    'sharia mortgage uk',
    'islamic home purchase plan',
    'diminishing musharaka uk',
    'halal mortgage london',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-uk' },
  openGraph: {
    title: 'Halal Mortgage UK 2026 — Al Rayan, Gatehouse, Habib Bank Zurich',
    description: 'The three UK halal mortgage providers, the structures they offer, and what to verify before you apply.',
    url: 'https://trybarakah.com/learn/halal-mortgage-uk',
    type: 'article',
  },
};

const providers = [
  {
    name: 'Al Rayan Bank',
    yearsActive: 'Since 2004 (originally Islamic Bank of Britain)',
    products: 'Home Purchase Plan (HPP) — a diminishing musharaka structure where you and the bank are co-owners of the property and you gradually buy out the bank\'s share.',
    deposit: 'Typical minimum 25% deposit, with better rent rates at higher deposit tiers.',
    notes: 'UK\'s largest and longest-established Islamic bank. FCA-regulated, FSCS-protected deposits. Branches in London, Birmingham, Manchester, Leicester, Glasgow, Edinburgh.',
    aaoifiAligned: true,
  },
  {
    name: 'Gatehouse Bank',
    yearsActive: 'Since 2008',
    products: 'Home Purchase Plan and Buy-to-Let Purchase Plan, both diminishing-musharaka based.',
    deposit: 'Minimum deposit varies; typically 20% for residential, 25%+ for buy-to-let.',
    notes: 'Originally a wholesale bank; expanded into residential property. Strong buy-to-let offering. London-headquartered.',
    aaoifiAligned: true,
  },
  {
    name: 'Habib Bank AG Zurich (UK Branch)',
    yearsActive: 'UK Islamic offering since the 2010s',
    products: 'Islamic Home Finance via murabaha or diminishing musharaka structures depending on case.',
    deposit: 'Negotiated case by case.',
    notes: 'Boutique offering; useful when Al Rayan and Gatehouse decline a case. Smaller but legitimately Shariah-supervised.',
    aaoifiAligned: true,
  },
];

const faqItems = [
  {
    q: 'Is a halal mortgage really halal in the UK?',
    a: 'A properly structured Home Purchase Plan (HPP) using diminishing musharaka or ijara avoids the loan-at-interest structure that makes a conventional mortgage problematic from a fiqh standpoint. The bank and you are co-owners of the property; you pay rent on the bank\'s share and gradually buy that share out. The cash flow can resemble a conventional mortgage, but the underlying contract is fundamentally different and is reviewed by a Shariah supervisory board at each FCA-regulated UK Islamic bank. Scholars who have endorsed AAOIFI Standard 8 (Ijara) and 12 (Musharaka) generally accept these structures; some scholars do raise concerns about specific clauses, so reading the product disclosure and consulting your own scholar is recommended.',
  },
  {
    q: 'How does a UK halal mortgage compare in cost to a conventional one?',
    a: 'In recent years UK halal mortgages have been broadly cost-competitive with conventional ones — sometimes slightly more, sometimes slightly less, depending on deposit tier and the rate environment. The "rent" rate is set against a benchmark (historically LIBOR, now SONIA-linked), so when conventional mortgage rates move, halal rates move with them. Always compare effective total cost over the term, not just the headline rate.',
  },
  {
    q: 'Do I need a higher deposit for a halal mortgage in the UK?',
    a: 'Typically yes, slightly. The mainstream UK halal mortgage providers (Al Rayan, Gatehouse) generally require a minimum 20–25% deposit, while some conventional UK lenders accept 5–10%. This reflects both the providers\' more conservative risk posture and the structural reality that musharaka requires a meaningful co-ownership stake upfront. First-time buyers often combine savings, family gifts (which are permissible), and government schemes where compatible.',
  },
  {
    q: 'What about Help to Buy or other UK government schemes?',
    a: 'Help to Buy (now closed to new applications in England), Shared Ownership, and the Mortgage Guarantee Scheme were all designed around conventional mortgages and don\'t all work cleanly with Islamic Home Purchase Plans. Some Islamic banks have offered Shared Ownership compatibility; verify with the provider you apply with. The First Homes scheme may be available depending on your local authority — check whether your chosen Islamic lender participates.',
  },
  {
    q: 'Where do most UK halal mortgages get done?',
    a: 'Greater London, Manchester, Birmingham, Bradford, Leicester, and Glasgow account for the bulk of UK halal mortgage volume — the same urban areas where the UK Muslim population concentrates. Al Rayan in particular has a strong physical presence in those cities, which matters because some first-time-buyer cases benefit from in-branch conversation rather than purely online flows.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Halal Mortgage UK', item: 'https://trybarakah.com/learn/halal-mortgage-uk' },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Halal Mortgage UK</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">

          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Halal mortgage in the UK — 2026</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-28</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">The short version</h2>
            <p className="text-base leading-7 text-gray-800">
              Three UK banks offer mainstream halal home financing — <strong>Al Rayan Bank</strong>, <strong>Gatehouse Bank</strong>, and <strong>Habib Bank AG Zurich (UK Branch)</strong>. All three use Home Purchase Plan structures based on <em>diminishing musharaka</em> (you and the bank are co-owners; you buy the bank&apos;s share out gradually) and are regulated by the FCA. Expect a 20–25% minimum deposit, rent rates that track market benchmarks, and a Shariah supervisory board behind the contracts. The mainstream UK halal mortgage market is small (3 banks) but well-established; the bigger questions are deposit size, deposit source, and which provider&apos;s product disclosure your own scholar is comfortable with.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">The three UK halal mortgage providers</h2>
            <div className="space-y-5">
              {providers.map((p) => (
                <div key={p.name} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <p className="text-xs italic text-gray-500 mb-2">{p.yearsActive}</p>
                  <p className="text-sm leading-6 text-gray-700"><strong>Products:</strong> {p.products}</p>
                  <p className="text-sm leading-6 text-gray-700"><strong>Deposit:</strong> {p.deposit}</p>
                  <p className="text-sm leading-6 text-gray-700"><strong>Notes:</strong> {p.notes}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">How a UK Home Purchase Plan actually works</h2>
            <ol className="list-decimal space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li>You and the Islamic bank agree to co-purchase the property. You contribute your deposit (e.g. 25%); the bank contributes the rest (75%).</li>
              <li>The property is held by the bank in trust; you have the right to occupy it.</li>
              <li>Each month you make two payments: <strong>rent</strong> on the share you do not yet own, and an <strong>acquisition payment</strong> that buys a small additional slice of the bank&apos;s share.</li>
              <li>Over the term (commonly 25 years), the acquisition payments grow your share from 25% to 100% and the rent payments correspondingly shrink to zero.</li>
              <li>At the end of the term, you fully own the property; the bank&apos;s share has been bought out.</li>
            </ol>
            <p className="text-sm italic text-gray-600 mt-3">
              The economic shape resembles a conventional mortgage&apos;s monthly amortising payment, but the underlying contract is co-ownership + lease + gradual purchase — not a loan with interest. That distinction is what the Shariah supervisory boards review.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">What to verify before you apply</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Read the Shariah supervisory board statement</strong> the provider publishes for the specific product you&apos;re applying for. Each product has its own contract.</li>
              <li><strong>Confirm rent benchmark and reset schedule.</strong> UK halal mortgage rents typically reset annually or semi-annually against a published benchmark; verify how yours moves.</li>
              <li><strong>Compare effective total cost across the term</strong> — headline rates are not directly comparable across providers because acquisition profiles differ.</li>
              <li><strong>Check early repayment terms.</strong> Most UK Islamic mortgages allow partial early repayment (good for zakat-on-equity planning); confirm the specifics.</li>
              <li><strong>Confirm provider response if your circumstances change</strong> (illness, redundancy). The forbearance posture matters; ask explicitly.</li>
              <li><strong>Consult your own scholar</strong> if you have specific concerns. The mainstream UK Islamic mortgage providers are widely accepted, but no third party should substitute for your own due diligence.</li>
            </ul>
          </section>

          <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">A note on scholarly opinion</h2>
            <p className="text-sm leading-6 text-amber-900">
              The UK Islamic banks each retain a Shariah supervisory board that publicly endorses their products. There is broad acceptance across most scholarly bodies (including those aligned with AAOIFI Standards 8 and 12) of properly-structured Home Purchase Plans. A minority of scholars raise concerns about specific contractual clauses; if you follow a scholar with such a position, read their reasoning and discuss directly. This page is informational; Barakah does not issue fatwas and is not a substitute for scholarly counsel.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Frequently asked</h2>
            <div className="space-y-4">
              {faqItems.map((f) => (
                <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                  <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">Related guides</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/learn/halal-mortgage-providers-usa" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">US providers</Link>
              <Link href="/learn/diminishing-musharaka-explained" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Diminishing musharaka</Link>
              <Link href="/learn/ijara-vs-murabaha-vs-musharaka-explained" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara vs murabaha vs musharaka</Link>
              <Link href="/learn/is-my-mortgage-halal" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Is my current mortgage halal?</Link>
              <Link href="/learn/halal-mortgage-vs-rent-2026" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Buy vs rent 2026</Link>
              <Link href="/zakat-uk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat UK</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Track the halal-mortgage payments in Barakah</h2>
            <p className="text-sm leading-6 text-green-100 mb-4">
              Once your Home Purchase Plan is live, Barakah Plus lets you separate the rent share from the acquisition share, track your growing equity ownership, and compute zakat on that equity when it becomes due — all alongside your other halal household finances.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Start free →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
