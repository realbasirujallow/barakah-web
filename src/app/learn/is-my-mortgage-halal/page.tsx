import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is My Mortgage Halal? Complete Islamic Home Financing Guide | Barakah',
  description:
    'Is your mortgage halal or haram? Understand riba in conventional mortgages, explore Shariah-compliant alternatives (murabaha, ijara, diminishing musharaka), and learn what top scholars say about the necessity exception.',
  alternates: { canonical: 'https://trybarakah.com/learn/is-my-mortgage-halal' },
  openGraph: {
    title: 'Is My Mortgage Halal? Complete Islamic Home Financing Guide',
    description:
      'Is your mortgage halal or haram? Understand riba, Shariah-compliant alternatives, and the necessity exception — with guidance from top scholars.',
    url: 'https://trybarakah.com/learn/is-my-mortgage-halal',
    type: 'article',
  },
};

const faqItems = [
  {
    q: 'Is a conventional mortgage haram in Islam?',
    a: "Yes — the majority scholarly view is that conventional mortgages involve riba (interest), which the Quran explicitly prohibits (2:275-279). However, some contemporary scholars permit them in Western countries where halal alternatives are scarce, under the principle of necessity (darurah). The safest position is to use a Shariah-compliant alternative where available.",
  },
  {
    q: 'What are the main halal mortgage alternatives?',
    a: "The three most common structures are: (1) Murabaha — the bank buys the property and sells it to you at a marked-up price, paid in installments; (2) Ijara (lease-to-own) — you lease the property while building equity; (3) Diminishing Musharaka — you and the bank co-own the property; you buy out the bank's share incrementally. In the US, Guidance Residential, UIF, and Ameen Housing offer these products.",
  },
  {
    q: 'Can I deduct my mortgage from zakatable wealth?',
    a: "Scholars differ. The Hanafi position allows deducting the full outstanding mortgage from zakatable assets. The majority Shafi'i / Maliki view limits deductions to the current year's installments. Barakah supports both methods in Fiqh Settings so you can use the calculation that matches your madhab.",
  },
  {
    q: 'Should I pay off my conventional mortgage early?',
    a: 'Yes, if you have a conventional mortgage, paying it off early reduces the total riba paid. Many scholars strongly encourage this — even if the initial taking was considered a necessity, reducing the harm is praiseworthy. Barakah\'s Riba Elimination Journey helps you build a payoff plan.',
  },
  {
    q: 'What is the necessity (darurah) exception for mortgages?',
    a: "Some scholars — including the European Council for Fatwa and Research, Sheikh Yusuf al-Qaradawi, and ISNA scholars — permit conventional mortgages for Muslims in Western countries where Shariah-compliant alternatives are genuinely unavailable, under Islamic necessity principles. This is a minority position and scholars generally require that the necessity be real, not merely a preference for a better rate.",
  },
  {
    q: 'Is Guidance Residential halal?',
    a: "Guidance Residential uses a declining balance co-ownership (diminishing musharaka) structure reviewed and certified by the Shariah Supervisory Board. It is widely considered one of the most established halal home financing options in the US.",
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Is My Mortgage Halal? Complete Islamic Home Financing Guide',
    description: metadata.description,
    url: 'https://trybarakah.com/learn/is-my-mortgage-halal',
    publisher: {
      '@type': 'Organization',
      name: 'Barakah',
      url: 'https://trybarakah.com',
    },
    dateModified: '2026-04-15',
  };

  return (
    <>
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <article className="min-h-screen bg-white px-4 sm:px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Is My Mortgage Halal?</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            Is My Mortgage Halal?
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-04-19</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            The short answer for most conventional mortgages: <strong>no</strong> — they involve riba (interest), which the Quran
            explicitly prohibits. But the fuller answer is more nuanced: Shariah-compliant alternatives exist, scholars differ on necessity
            exceptions, and what you do <em>next</em> matters greatly.
          </p>

          {/* Quick-answer summary box */}
          <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-5 mb-10">
            <h2 className="font-bold text-green-900 mb-3 text-base">Quick Summary</h2>
            <ul className="space-y-2 text-sm text-green-900">
              <li>✅ <strong>Halal options exist</strong> in the US and UK (Guidance Residential, UIF, Ameen Housing, Gatehouse Bank)</li>
              <li>⚠️ <strong>Conventional mortgages involve riba</strong> — the majority of scholars consider them prohibited</li>
              <li>📖 <strong>Necessity exception:</strong> some scholars permit them where halal alternatives are genuinely unavailable</li>
              <li>🧮 <strong>Zakat deduction</strong> depends on your madhab — Barakah supports both Hanafi and majority approaches</li>
            </ul>
          </div>

          {/* Section 1: What makes a mortgage haram */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">What Makes a Conventional Mortgage Haram?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Conventional mortgages charge interest on borrowed money. In Islamic finance, this is called <strong>riba</strong> — literally
              &nbsp;&ldquo;increase&rdquo; or &ldquo;growth.&rdquo; The Quran states:
            </p>
            <blockquote className="bg-amber-50 border-l-4 border-amber-500 px-5 py-4 rounded-r-xl text-gray-800 italic mb-4 text-sm leading-relaxed dark:text-gray-100">
              &ldquo;Those who consume riba will not stand [on the Day of Resurrection] except as one stands who is being beaten by Satan into insanity…
              Allah has permitted trade and has forbidden riba.&rdquo;<br />
              <span className="not-italic font-medium text-amber-900">— Quran 2:275</span>
            </blockquote>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Elsewhere, Allah declares &ldquo;war&rdquo; on those who consume riba (2:279), making it one of the most severely warned-against
              acts in Islamic jurisprudence. The Prophet Muhammad (ﷺ) cursed the one who takes riba, gives it, records it, and witnesses it
              (Sahih Muslim 1598).
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              In a standard 30-year US mortgage at a 7% rate, a homebuyer purchasing a $400,000 house will pay over <strong>$560,000 in interest</strong> alone over the life of the loan — interest paid to the bank simply for the time-value of money, which is the core of riba.
            </p>
          </section>

          {/* Section 2: Halal alternatives */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Shariah-Compliant Home Financing Structures</h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              Islamic finance scholars and institutions have developed several structures that allow home ownership without riba. Here are the three most widely available:
            </p>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                <h3 className="font-bold text-lg text-[#1B5E20] mb-2">1. Murabaha (Cost-Plus Financing)</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-2 dark:text-gray-300">
                  The financier purchases the property outright, then sells it to you at a marked-up price, payable in installments.
                  Because this is a sale transaction — not a loan with interest — it is Shariah-compliant.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Used by:</strong> UIF Corporation (US), HSBC Amanah (UK)<br />
                  <strong>Watch out for:</strong> Some murabaha contracts are structured to mirror conventional loans — verify the Shariah board certificate.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                <h3 className="font-bold text-lg text-[#1B5E20] mb-2">2. Ijara (Islamic Lease-to-Own)</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-2 dark:text-gray-300">
                  The financier buys and owns the property; you pay rent to live in it and gradually acquire ownership. At the end of the
                  term, ownership transfers to you. No interest — the bank earns profit through the rental agreement.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Used by:</strong> Ameen Housing (US), Al Rayan Bank (UK)<br />
                  <strong>Watch out for:</strong> Ensure rent reviews are transparent and not simply &ldquo;interest by another name.&rdquo;
                </p>
              </div>

              <div className="border border-[#1B5E20] border-2 rounded-xl p-5 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-[#1B5E20]">3. Diminishing Musharaka (Co-Ownership)</h3>
                  <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">Most Popular</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2 dark:text-gray-300">
                  You and the financier co-own the property. You pay rent on the bank&apos;s share <em>and</em> gradually buy out their stake.
                  As your ownership grows, the rental payment decreases. The bank profits from rent, not interest.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Used by:</strong> Guidance Residential (US), Devon Bank (US), Gatehouse Bank (UK)<br />
                  <strong>Why scholars prefer it:</strong> Most closely mirrors real co-ownership with genuine risk-sharing between buyer and financier.
                </p>
                <Link href="/learn/diminishing-musharaka-explained" className="inline-block mt-3 text-sm text-[#1B5E20] font-semibold hover:underline">
                  Deep dive: How Diminishing Musharaka works →
                </Link>
              </div>
            </div>
          </section>

          {/* Section 3: Necessity exception */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">The Necessity (Darurah) Exception</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Not everyone has access to halal financing. In some US cities and most European countries outside the UK, Shariah-compliant
              providers simply don&apos;t operate. Several prominent scholars have issued rulings permitting conventional mortgages in these
              specific circumstances.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 text-sm text-gray-800 space-y-3 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
              <p><strong>Sheikh Yusuf al-Qaradawi</strong> (European Council for Fatwa and Research): permitted conventional mortgages for Muslims
                in non-Muslim-majority countries where halal alternatives are genuinely unavailable, under the principle of darurah (necessity).</p>
              <p><strong>ISNA Fiqh Council (North America)</strong>: issued a fatwa permitting conventional mortgages for primary residences
                where no halal alternative is accessible in the area.</p>
              <p className="text-amber-900 bg-amber-50 p-3 rounded-lg"><strong>Important:</strong> This is a minority position. The majority of scholars
                maintain the prohibition even in Western countries. If halal financing is available in your area, that position does not apply.
                Always verify with a qualified scholar (mufti) for your specific situation.</p>
            </div>
          </section>

          {/* Section 4: What if I already have a conventional mortgage */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">I Already Have a Conventional Mortgage — What Now?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              If you already have a conventional mortgage, scholars generally advise:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Make tawbah (repentance)</strong> and intend to remedy the situation.</li>
              <li><strong>Explore refinancing</strong> with a halal provider as soon as practically possible.</li>
              <li><strong>Pay extra principal</strong> whenever you can — every dollar of extra principal reduces future riba payments.</li>
              <li><strong>Seek a scholar&apos;s guidance</strong> on your specific circumstances.</li>
              <li><strong>Track riba paid</strong> and consider making additional charity (sadaqah) to offset the harm — though scholars differ on whether this is required.</li>
            </ol>
            <div className="mt-5">
              <Link
                href="/dashboard/riba"
                className="inline-flex items-center gap-2 bg-[#1B5E20] text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-[#2E7D32] transition"
              >
                🛡️ Barakah Riba Elimination Journey →
              </Link>
            </div>
          </section>

          {/* Section 5: Zakat implications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Does My Mortgage Affect My Zakat?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Whether you can deduct your mortgage from your zakatable wealth depends on your madhab:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 mb-2 dark:text-gray-100">Hanafi School</h4>
                <p className="text-gray-700 dark:text-gray-300">The full outstanding mortgage balance may be deducted from zakatable assets. This is because Hanafi fiqh treats the entire debt as a liability against your wealth.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 mb-2 dark:text-gray-100">Majority View (Shafi&apos;i / Maliki)</h4>
                <p className="text-gray-700 dark:text-gray-300">Only the current year&apos;s mortgage installments may be deducted. The full outstanding balance cannot be deducted because the debt is long-term and not immediately due.</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4 dark:text-gray-400">
              Barakah supports both methods in{' '}
              <Link href="/dashboard/fiqh" className="text-[#1B5E20] underline">Fiqh Settings</Link>{' '}
              so your zakat calculation reflects your madhab.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl group dark:border-gray-700">
                  <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 flex items-center justify-between select-none dark:text-gray-100">
                    <span>{item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 dark:text-gray-300 dark:border-gray-700">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-teal-700 rounded-2xl p-8 text-white text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Track Riba, Zakat & Debt in One Place</h2>
            <p className="text-green-200 mb-6 max-w-xl mx-auto">
              Barakah&apos;s Riba Elimination Journey, multi-madhab Zakat Calculator, and Debt Tracker help Muslim households
              manage their finances with Islamic principles in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free — 30 Days Plus
              </Link>
              <Link href="/dashboard/riba" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition">
                Riba Elimination Journey
              </Link>
            </div>
          </div>

          {/* Related articles cluster */}
          <nav aria-label="Related articles">
            <h2 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Islamic Mortgage Hub</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/learn/halal-mortgage-providers-usa" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Providers</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Halal Mortgage Providers in the USA</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Compare Guidance Residential, UIF, Ameen Housing & more.</p>
              </Link>
              <Link href="/learn/diminishing-musharaka-explained" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">How It Works</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Diminishing Musharaka Explained</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Step-by-step breakdown of the most popular halal structure.</p>
              </Link>
              <Link href="/learn/riba-free-mortgage" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Riba-Free</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Riba-Free Mortgage Guide</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Is there such a thing? A deep look at what halal really means.</p>
              </Link>
            </div>
          </nav>
        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/musharaka" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Musharaka →</Link>
              <Link href="/fiqh-terms/ijara" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Ijara →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
