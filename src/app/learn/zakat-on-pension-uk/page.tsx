import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on UK Pensions (2026): DC, DB, SIPP, and Workplace Schemes',
  description:
    'A 2026 guide to calculating zakat on UK pensions — defined-contribution vs defined-benefit, SIPP vs workplace, accessible vs locked pots, and how to handle the non-halal fund problem.',
  keywords: [
    'zakat on uk pension',
    'zakat on sipp',
    'zakat on workplace pension',
    'zakat on dc pension',
    'zakat on defined benefit',
    'halal pension uk',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-pension-uk' },
  openGraph: {
    title: 'Zakat on UK Pensions (2026)',
    description: 'How to calculate zakat on DC, DB, SIPP, and workplace pensions in the UK — with worked examples.',
    url: 'https://trybarakah.com/learn/zakat-on-pension-uk',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I owe zakat on my UK pension before I can access it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The dominant contemporary scholarly view is yes — if you have a defined-contribution (DC) pension that has a transfer value you could realize (even at a tax cost), you owe zakat annually on the accessible portion. A minority view treats pre-access pensions as not yet 'in your hand' and only requires zakat from age 55/57 onwards. Both views require purification of non-halal holdings inside the pension.",
      },
    },
    {
      '@type': 'Question',
      name: 'What about defined-benefit (DB) pensions like the NHS or USS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Defined-benefit pensions promise a future income, not a present pot. Most scholars exempt DB pensions from annual zakat until you start receiving payments — at which point each payment becomes part of your zakatable wealth that year. A transfer value (CETV) can be requested but is typically not treated as wealth-in-hand for zakat purposes.",
      },
    },
    {
      '@type': 'Question',
      name: 'My workplace pension is invested in a non-halal default fund. What do I do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Three steps. (1) Check the fund menu for a Shariah option — most large providers (Aviva, Legal & General, Scottish Widows, NEST) now offer at least one Shariah fund. Switch to it. (2) If no halal fund is available, contribute the employer-match amount only and use a SIPP for the rest. (3) Purify any historical growth attributable to non-permissible holdings when you switch — typically 1–4% of the gain. The HSBC Islamic Global Equity Index Fund and L&G Future World Islamic Index are common halal pension fund choices.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate zakat on a DC pension?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Take the current pension fund value (as shown on your provider's portal). If you can access it now (over 55/57), 100% of the value is zakatable at 2.5%. If you can't access it yet, the majority view is to zakat the transfer value — typically 100% of the pot for a DC pension. Subtract any non-halal portion you plan to purify (donate to charity) — only the halal portion of the pot is your own zakatable wealth. Multiply the resulting figure by 2.5%.",
      },
    },
  ],
};

export default function ZakatOnPensionUkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }} />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Zakat on UK Pensions</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide · UK
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Zakat on UK Pensions (2026)</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                How to calculate zakat on DC, DB, SIPP, and workplace pension schemes — and what to do about non-halal fund choices.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>11 min read</span>
                <span>Published: May 2026 • Last updated: May 17, 2026</span>
              </div>
            </header>

            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#types" className="text-[#1B5E20] hover:underline">UK pension types in one minute</Link></li>
                <li><Link href="#dc" className="text-[#1B5E20] hover:underline">Zakat on DC pensions (workplace, SIPP)</Link></li>
                <li><Link href="#db" className="text-[#1B5E20] hover:underline">Zakat on DB pensions (NHS, USS, civil service)</Link></li>
                <li><Link href="#state" className="text-[#1B5E20] hover:underline">Zakat on the State Pension</Link></li>
                <li><Link href="#halal-funds" className="text-[#1B5E20] hover:underline">Handling non-halal default funds</Link></li>
                <li><Link href="#example" className="text-[#1B5E20] hover:underline">Worked example</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQ</Link></li>
              </ul>
            </nav>

            <section id="types" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">UK pension types in one minute</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Defined Contribution (DC)</strong> — you build up a pot of money. Most workplace pensions and all SIPPs are DC. Includes NEST, Aviva, Smart Pension, Standard Life, etc.</li>
                <li><strong>Defined Benefit (DB)</strong> — your employer promises a future income based on salary + years of service. NHS Pension, Teachers&apos; Pension, USS (for academics), Civil Service Pension are DB.</li>
                <li><strong>SIPP (Self-Invested Personal Pension)</strong> — DC pension you control yourself, often with broad fund choice including halal options.</li>
                <li><strong>State Pension</strong> — government-paid income from State Pension age (currently 67), based on National Insurance contributions.</li>
              </ul>
            </section>

            <section id="dc" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat on DC pensions (workplace + SIPP)</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Dominant view (AMJA, most contemporary scholars):</strong> A DC pension pot is your wealth even if locked
                until age 55/57. You can technically request a transfer value or take early-access penalties — the wealth is
                yours; it&apos;s just illiquid. Zakat is therefore due annually on the pot value, at 2.5%.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Minority view:</strong> The pension is &ldquo;not in your hand&rdquo; until you can freely access it (typically
                age 55/57). Under this view, no zakat is due before access age; once you start drawing, each payment becomes part
                of your zakatable wealth in the year you receive it.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Both views agree on the halal/non-halal question — see the{' '}
                <Link href="#halal-funds" className="text-[#1B5E20] underline">handling non-halal funds</Link> section below.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Pick a view, document your choice, and apply it consistently year-to-year. Switching views to minimize zakat is
                discouraged by scholars.
              </p>
            </section>

            <section id="db" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat on DB pensions (NHS, USS, Teachers&apos;, Civil Service)</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A DB pension promises a future income, not a present pot. The Cash Equivalent Transfer Value (CETV) is the actuarial
                price of buying out the future income — but it&apos;s not money you can spend, and you typically lose substantial value
                if you transfer out.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Mainstream view:</strong> No annual zakat on the CETV. When you start receiving payments (typically at scheme
                normal retirement age), each payment is added to your zakatable wealth that year — like any other income — and zakat
                is due on whatever portion you still hold on your zakat anniversary.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Halal question for DB:</strong> DB schemes are funded by employer-managed portfolios containing bonds, equities,
                and other investments. The pension you receive is a contractual payment from your employer/scheme, not directly from
                those investments — most scholars accept it as permissible income without requiring purification, though some recommend
                a small purification (~2–5%) on the income side.
              </p>
            </section>

            <section id="state" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Zakat on the State Pension</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The State Pension is a government-paid income, not a fund. It begins at State Pension age (currently 67). Each payment
                received becomes part of your zakatable wealth that year and is zakatable at 2.5% on the balance you hold on your zakat
                anniversary, like any other income.
              </p>
            </section>

            <section id="halal-funds" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Handling non-halal default funds</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Most UK workplace pensions default new members into a &ldquo;balanced&rdquo; or &ldquo;lifestyle&rdquo; fund that
                contains conventional bonds, financial-sector equities, and other non-halal holdings. Three practical steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Switch to a Shariah fund within your plan.</strong> Most major UK pension providers now offer at least one option:
                  <ul className="list-disc pl-6 mt-1 text-sm">
                    <li><strong>HSBC Islamic Global Equity Index Fund</strong> — widely available, passive global equity</li>
                    <li><strong>Legal &amp; General Future World Islamic Global Equity Index</strong> — passive, ESG + Shariah</li>
                    <li><strong>Aviva Stewardship Shariah</strong> — actively managed</li>
                    <li><strong>HSBC Life Amanah Pension</strong> — Shariah-compliant pension default for some schemes</li>
                  </ul>
                </li>
                <li><strong>If no halal fund is available in your scheme:</strong> Contribute only enough to capture the employer match (free money you shouldn&apos;t leave behind), then use a personal SIPP for the rest. A SIPP gives you access to halal ETFs (ISWD, ISUS) and the HSBC Islamic fund.</li>
                <li><strong>Purify historical growth when switching.</strong> If you&apos;ve been in a non-halal fund for years, on the day you switch, calculate the proportion of growth attributable to non-permissible holdings (often 1–4% per scholars&apos; guidance) and donate it to charity as purification.</li>
              </ol>
            </section>

            <section id="example" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Worked example</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <p className="text-sm text-amber-900"><strong>Scenario:</strong> Aisha, age 35, has a Smart Pension workplace pot worth £42,000. She follows the dominant view that DC pensions are zakatable annually. She switched to the HSBC Islamic fund last year so her current holdings are 100% halal.</p>
                <p className="text-sm text-amber-900 mt-3"><strong>Calculation:</strong></p>
                <pre className="text-xs bg-white border border-amber-200 p-3 rounded text-amber-900 my-2 overflow-x-auto">
{`Pension pot value:           £42,000
Halal portion:                100% × £42,000 = £42,000
Less non-halal to purify:     £0
Zakatable from pension:       £42,000
Zakat due on pension:         £42,000 × 2.5% = £1,050`}
                </pre>
                <p className="text-sm text-amber-900">She adds £1,050 to her zakat owed for the year alongside zakat on cash, savings, and other assets.</p>
              </div>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                If Aisha&apos;s pot was still 60% in the non-halal default fund, she would purify the proportional growth (~2% of the
                non-halal portion = ~£500 to charity) and zakat only the remaining halal portion (£42k − £500 ≈ £41,500 × 2.5% =
                £1,038). The purification donation is separate from zakat.
              </p>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>
              {FaqSchema.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Q: {q.name}</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </section>

            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Zakat on your UK pension, in GBP</h2>
              <p className="text-green-100">
                Barakah works in GBP natively — link your SIPP and workplace pension, pick your scholar view, and Barakah computes zakat plus purification across all holdings.
              </p>
              <Link href="/zakat-uk" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Open UK Zakat Calculator
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/nisab-gbp" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Nisab in GBP</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">The current zakat threshold in Sterling.</p>
                </Link>
                <Link href="/learn/is-my-401k-halal" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Is My 401(k) Halal?</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">US equivalent: the workplace-pension halal question for American Muslims.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
