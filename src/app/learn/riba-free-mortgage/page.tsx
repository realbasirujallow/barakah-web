import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Riba-Free Mortgage 2026 — Halal Islamic Home Financing Options for Muslims | Barakah',
  description:
    'Complete guide to riba-free mortgage alternatives for Muslims in the US — murabaha, diminishing musharakah, ijara, and LARIBA. Compare providers and understand Islamic home finance.',
  keywords: [
    'riba free mortgage',
    'halal mortgage',
    'islamic mortgage',
    'sharia compliant mortgage',
    'halal home financing',
    'murabaha mortgage',
    'diminishing musharakah',
    'islamic home loan',
    'halal home loan usa',
    'lariba financing',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/riba-free-mortgage' },
  openGraph: {
    title: 'Riba-Free Mortgage 2026 — Halal Islamic Home Financing',
    description: 'Murabaha, diminishing musharakah, ijara — the complete guide to riba-free home financing for Muslims in the US.',
    url: 'https://trybarakah.com/learn/riba-free-mortgage',
    siteName: 'Barakah',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Riba-Free Mortgage', item: 'https://trybarakah.com/learn/riba-free-mortgage' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Riba-Free Mortgage 2026 — Halal Islamic Home Financing Options for Muslims',
  description: 'A comprehensive guide to halal home financing options for Muslims in the US — murabaha, diminishing musharakah, ijara, and how to find Islamic mortgage providers.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-04-01',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/riba-free-mortgage' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is a conventional mortgage haram in Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, a conventional interest-bearing mortgage is generally considered haram in Islam. The Quran explicitly prohibits riba (interest) in multiple verses. A conventional mortgage involves paying a predetermined amount of interest on a loan — this is riba. The Quran warns: "O you who believe! Fear Allah and give up what remains of your demand for riba, if you are indeed believers." (Quran 2:278). Most major Islamic scholars and fatwa bodies classify conventional mortgages as impermissible. However, some contemporary scholars allow them when no halal alternative is available, under the concept of darura (necessity) — this is a minority view.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a murabaha mortgage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Murabaha (مرابحة) is a cost-plus-profit sale. In a murabaha home financing arrangement: (1) The Islamic bank buys the home at market price; (2) The bank sells the home to you at a higher agreed price (cost + profit margin); (3) You pay the agreed price in installments over the financing term. Because the bank buys and sells the home (a real asset), the profit is from trade — not interest. This is permitted in Islam. The effective monthly payment may be similar to a conventional mortgage, but the structure avoids riba.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is diminishing musharakah (co-ownership)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Diminishing musharakah (مشاركة متناقصة) is a co-ownership structure: (1) You and the Islamic institution jointly purchase the home; (2) You gradually buy out the institution\'s share month by month; (3) You pay rent on the institution\'s remaining share (ijara); (4) Over time, your ownership grows to 100% and payments end. This is the most widely used Islamic home finance structure in the US, offered by providers like Guidance Residential, UIF, and Devon Bank.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Islamic home financing more expensive than a conventional mortgage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Islamic home financing has historically been slightly more expensive than conventional mortgages because of lower market volume and higher regulatory compliance costs. However, the gap has narrowed significantly as Islamic finance has grown. Some Muslims also argue that the comparison ignores the spiritual cost of riba — Allah's prohibition has a value that market rates don't capture. Compare total cost of financing, not just monthly payment, when evaluating halal vs conventional options.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who offers halal/Islamic home financing in the United States?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Major Islamic home financing providers in the US include: Guidance Residential (largest US Islamic home finance provider, diminishing musharakah), University Islamic Financial (UIF, diminishing musharakah), Devon Bank (Chicago, various Islamic structures), LARIBA (American Finance House, installment sale method). Availability varies by state. Always verify the Sharia compliance through the provider\'s Sharia board and consult your local Islamic scholar before signing.',
      },
    },
  ],
};

const methods = [
  {
    name: 'Diminishing Musharakah',
    arabic: 'مشاركة متناقصة',
    how: 'You and the bank jointly own the home. You buy back the bank\'s share monthly while paying rent on the bank\'s remaining ownership. Ownership transfers fully to you at the end.',
    pros: ['True co-ownership model', 'Most widely used in the US', 'Clean Sharia structure', 'Offered by Guidance Residential, UIF'],
    cons: ['Slightly higher effective rate', 'Limited geographic availability', 'Not all states covered'],
    scholars: 'Approved by AAOIFI and most major Islamic scholars',
  },
  {
    name: 'Murabaha (Cost-Plus Sale)',
    arabic: 'مرابحة',
    how: 'The bank buys the home then immediately sells it to you at a higher price (cost + profit). You pay in monthly installments at the agreed price.',
    pros: ['Clear purchase structure', 'Fixed total price agreed upfront', 'No interest — profit from trade'],
    cons: ['If you need to sell before term, complications may arise', 'Less flexibility than conventional mortgage', 'Price fixed — no benefit if rates drop'],
    scholars: 'Widely accepted across Hanafi, Shafi\'i, and Maliki schools',
  },
  {
    name: 'Ijara (Islamic Lease)',
    arabic: 'إجارة',
    how: 'The bank owns the home and leases it to you. You pay rent, with part going toward eventual purchase. Rent is halal, and you have option to buy at end of term.',
    pros: ['Simple rental structure', 'No ownership risk during term', 'Flexible for those unsure about long-term plans'],
    cons: ['You do not own the home during the term', 'Equity builds slowly', 'Less common in the US'],
    scholars: 'Permitted under AAOIFI and most madhabs',
  },
];

export default function RibaFreeMortgagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Riba-Free Mortgage</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">ISLAMIC HOME FINANCE</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Riba-Free Mortgage 2026 — Halal Islamic Home Financing Options for Muslims
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Owning a home is a legitimate aspiration for every Muslim family — but a conventional interest-bearing mortgage involves riba. This guide explains why conventional mortgages are impermissible, the three halal home financing alternatives, and which US providers offer them.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📅 Updated April 2026</span>
              <span>⏱ 10 min read</span>
              <span>⚠️ Not financial advice — consult a qualified Islamic scholar</span>
            </div>
          </header>

          {/* Why Conventional Mortgage Is Haram */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why a Conventional Mortgage Is Haram</h2>
            <div className="bg-red-50 border-l-4 border-red-600 rounded-r-xl p-5 mb-6">
              <p className="text-red-800 italic text-sm">
                &ldquo;O you who believe! Fear Allah and give up what remains of riba, if you are believers. And if you do not, then be informed of a war [against you] from Allah and His Messenger.&rdquo; — Quran 2:278–279
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              In a conventional mortgage, a bank lends you money and charges a predetermined percentage of interest above the principal. This is the textbook definition of riba al-nasiah (interest on debt) — which is prohibited in Islam by explicit Quranic verses, multiple authentic hadiths, and scholarly consensus (ijma).
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: '📖', title: 'Quranic Prohibition', detail: 'Riba is prohibited in 4 separate Quranic passages (2:275, 2:276, 2:278, 3:130, 30:39)' },
                { icon: '📜', title: 'Hadith Evidence', detail: 'The Prophet ﷺ cursed the consumer of riba, the payer, the recorder, and the two witnesses (Muslim 1598)' },
                { icon: '🕌', title: 'Scholarly Consensus', detail: 'All four major madhabs (Hanafi, Maliki, Shafi\'i, Hanbali) prohibit interest-bearing loans' },
              ].map((item) => (
                <div key={item.title} className="border border-red-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="font-bold text-red-800 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-red-700">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Islamic Alternatives */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3 Halal Home Financing Alternatives</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Islamic home finance structures avoid riba by replacing the loan-with-interest model with legitimate commercial contracts — co-ownership, trade, or lease.
            </p>
            <div className="space-y-8">
              {methods.map((method) => (
                <div key={method.name} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-green-700 text-white px-5 py-4">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-bold text-lg">{method.name}</h3>
                      <span className="text-green-200 text-sm" dir="rtl">{method.arabic}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 text-sm mb-4"><strong>How it works:</strong> {method.how}</p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-green-700 mb-1">PROS</p>
                        <ul className="space-y-1">
                          {method.pros.map((p) => <li key={p} className="text-xs text-gray-600 flex gap-1"><span className="text-green-600">✓</span>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-600 mb-1">CONSIDERATIONS</p>
                        <ul className="space-y-1">
                          {method.cons.map((c) => <li key={c} className="text-xs text-gray-600 flex gap-1"><span className="text-amber-500">!</span>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-green-800 bg-green-50 rounded-lg px-3 py-2">✅ {method.scholars}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* US Providers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Halal Mortgage Providers in the United States</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b">Provider</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b">Structure</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b">Coverage</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { provider: 'Guidance Residential', structure: 'Diminishing Musharakah', coverage: 'All 50 states', notes: 'Largest US Islamic home finance provider — AAOIFI certified' },
                    { provider: 'University Islamic Financial (UIF)', structure: 'Diminishing Musharakah', coverage: 'Most US states', notes: 'Wholly Sharia-compliant, Sharia supervisory board' },
                    { provider: 'Devon Bank', structure: 'Murabaha / Musharakah', coverage: 'Nationwide (Illinois-based)', notes: 'One of the oldest US Islamic mortgage providers' },
                    { provider: 'LARIBA', structure: 'Installment Sale', coverage: 'Most US states', notes: 'American Finance House — unique declining balance method' },
                    { provider: 'Ameen Housing Cooperative', structure: 'Co-op / Musharakah', coverage: 'California', notes: 'Community-based model for California Muslims' },
                  ].map((row, i) => (
                    <tr key={row.provider} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-semibold text-gray-900 border-b border-gray-100">{row.provider}</td>
                      <td className="p-3 text-green-700 border-b border-gray-100 text-xs">{row.structure}</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100 text-xs">{row.coverage}</td>
                      <td className="p-3 text-gray-500 border-b border-gray-100 text-xs">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              ⚠️ Always verify current Sharia compliance certification with the provider&apos;s Sharia supervisory board before signing. This table is for informational purposes only.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Ramadan email capture */}
          <RamadanEmailCapture source="learn-riba-free-mortgage" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Track Your Riba Exposure with Barakah — Free</h2>
            <p className="text-green-100 mb-6">Barakah&apos;s riba detector flags all interest-bearing accounts, calculates purification amounts, and maps your journey to riba-free finances.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition">Start Free — No Card Needed</Link>
              <Link href="/learn/is-my-mortgage-halal" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">Is My Mortgage Halal?</Link>
            </div>
          </div>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/is-my-mortgage-halal', title: 'Is My Mortgage Halal?', desc: 'Checking your existing mortgage against Islamic criteria.' },
                { href: '/learn/riba-elimination', title: 'Riba Elimination Guide', desc: 'Step-by-step plan to remove riba from your finances.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'How to invest your savings in Sharia-compliant assets.' },
                { href: '/learn/what-is-riba', title: 'What is Riba?', desc: "Islam's complete prohibition on interest explained." },
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting', desc: 'Building a budget that avoids riba in all forms.' },
                { href: '/learn/islamic-finance-basics', title: 'Islamic Finance Basics', desc: 'The foundations of Islamic financial principles.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors">
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
