import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Stocks List 2026 — Shariah-Compliant Stocks (AAOIFI Screened)',
  description:
    'A 2026 list of halal, Shariah-compliant stocks screened against AAOIFI Standard 21 — business activity plus the three financial ratios. Each ticker links to a full review, with a note on which are borderline and which are commonly flagged non-compliant.',
  keywords: [
    'halal stocks list',
    'halal stocks',
    'shariah compliant stocks',
    'halal shares',
    'top halal stocks',
    'list of halal stocks',
    'aaoifi stocks list',
    'halal stocks 2026',
  ],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/list' },
  openGraph: {
    title: 'Halal Stocks List 2026 — Shariah-Compliant Stocks (AAOIFI Screened)',
    description: 'AAOIFI-screened list of halal stocks for 2026, each linking to a full Shariah review.',
    url: 'https://trybarakah.com/halal-stocks/list',
    type: 'article',
  },
};

type Status = 'Generally halal' | 'Verify ratios' | 'Borderline — verify debt';

const stocks: { symbol: string; name: string; sector: string; status: Status }[] = [
  { symbol: 'AAPL', name: 'Apple', sector: 'Technology', status: 'Generally halal' },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology', status: 'Generally halal' },
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Technology', status: 'Generally halal' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', status: 'Generally halal' },
  { symbol: 'ADBE', name: 'Adobe', sector: 'Technology', status: 'Generally halal' },
  { symbol: 'CRM', name: 'Salesforce', sector: 'Technology', status: 'Generally halal' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)', sector: 'Technology', status: 'Verify ratios' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', status: 'Verify ratios' },
  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer / Tech', status: 'Verify ratios' },
  { symbol: 'NFLX', name: 'Netflix', sector: 'Media / Tech', status: 'Verify ratios' },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Automotive / Tech', status: 'Verify ratios' },
  { symbol: 'ORCL', name: 'Oracle', sector: 'Technology', status: 'Borderline — verify debt' },
  { symbol: 'UL', name: 'Unilever', sector: 'Consumer Staples', status: 'Borderline — verify debt' },
  { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples', status: 'Verify ratios' },
  { symbol: 'KO', name: 'Coca-Cola', sector: 'Consumer Staples', status: 'Borderline — verify debt' },
  { symbol: 'NSRGY', name: 'Nestlé (ADR)', sector: 'Consumer Staples', status: 'Verify ratios' },
];

const commonlyNonCompliant = [
  { name: 'Conventional banks (JPMorgan, Bank of America, Wells Fargo)', why: 'Core business is interest-based lending (riba).' },
  { name: 'Insurance companies (conventional)', why: 'Conventional insurance involves gharar and interest-bearing reserves.' },
  { name: 'Payment lenders & card issuers built on interest', why: 'Revenue is largely interest and late fees.' },
  { name: 'Alcohol, tobacco, gambling, and adult-entertainment companies', why: 'Prohibited core business activity.' },
];

const faqItems = [
  {
    q: 'How are these stocks screened for being halal?',
    a: 'Each company is checked in two stages using AAOIFI Standard 21: first a business-activity screen (no material revenue from interest, alcohol, gambling, tobacco, pork, or adult content), then three financial ratios — interest-bearing debt, interest-bearing securities plus cash, and non-permissible income — each measured against the trailing-12-month average market cap.',
  },
  {
    q: 'Why do some stocks say "verify ratios" or "borderline"?',
    a: 'Compliance is recalculated every quarter and depends on figures that move with the share price and balance sheet. A company can pass one quarter and fail the next — especially names carrying more debt, like Oracle or Unilever. The labels here flag how close a stock typically sits to the thresholds; always confirm the live status before buying.',
  },
  {
    q: 'Is this a list of halal stocks for the UK too?',
    a: 'The screening methodology (AAOIFI) is the same for UK investors — a company that passes is halal regardless of where you buy it. UK investors can hold most of these via a stocks-and-shares ISA through a broker that offers US shares. Always verify current compliance and any currency or tax considerations for your jurisdiction.',
  },
  {
    q: 'Do I need to purify income from halal stocks?',
    a: 'Usually yes. Even compliant companies earn a small amount of interest on cash, so scholars require purifying that non-permissible share of dividends or gains by donating it to charity. Barakah calculates the exact purification amount per holding.',
  },
];

function statusClass(s: Status) {
  if (s === 'Generally halal') return 'bg-[#1B5E20] text-white';
  if (s === 'Verify ratios') return 'bg-amber-100 text-amber-900';
  return 'bg-orange-100 text-orange-900';
}

export default function HalalStocksListPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Halal Stocks List 2026 (AAOIFI Screened)',
    itemListElement: stocks.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${s.name} (${s.symbol})`,
      url: `https://trybarakah.com/halal-stocks/${s.symbol.toLowerCase()}`,
    })),
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/halal-stocks" className="hover:text-[#1B5E20] transition">Halal Stocks</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">List 2026</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Halal Stocks List 2026</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-22 · AAOIFI Standard 21 methodology</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            A working list of widely-held <strong>Shariah-compliant stocks</strong>, each screened against AAOIFI&apos;s
            business-activity and financial-ratio tests. Tap any ticker for the full review — popular checks include
            whether <Link href="/halal-stocks/aapl" className="text-[#1B5E20] font-semibold hover:underline">Apple (AAPL) is halal</Link> or
            whether <Link href="/halal-stocks/msft" className="text-[#1B5E20] font-semibold hover:underline">Microsoft (MSFT) is halal</Link>.
            Compliance is recalculated every quarter, so treat this as a starting point and verify the live status before
            you buy.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900">
            <strong>Important:</strong> This is educational information, not investment advice or a fatwa. Halal status
            changes quarter to quarter with each company&apos;s balance sheet and share price. Always confirm current
            compliance and consult a qualified scholar before investing.
          </div>

          {/* The list table */}
          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">The list</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Ticker</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Company</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Sector</th>
                  <th className="py-2 font-semibold text-gray-700">Screening status</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s.symbol} className="border-b border-gray-100 align-middle">
                    <td className="py-3 pr-3 font-bold text-[#1B5E20]">
                      <Link href={`/halal-stocks/${s.symbol.toLowerCase()}`} className="hover:underline">{s.symbol}</Link>
                    </td>
                    <td className="py-3 pr-3 text-gray-800">{s.name}</td>
                    <td className="py-3 pr-3 text-gray-600 text-xs">{s.sector}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(s.status)}`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-4">
              <strong>Generally halal</strong>: clean business, ratios usually well within AAOIFI limits ·
              <strong> Verify ratios</strong>: passes business screen, ratios closer to limits ·
              <strong> Borderline</strong>: business is fine but debt can approach the 30% cap.
            </p>
          </section>

          {/* Methodology */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">How the screening works</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              A stock is screened in two stages under AAOIFI Standard 21:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-base leading-7 text-gray-800">
              <li><strong>Business activity</strong> — no material revenue from interest, alcohol, gambling, tobacco, pork, conventional finance, or adult content.</li>
              <li><strong>Financial ratios</strong> (vs. trailing-12-month average market cap): interest-bearing debt &lt; 30%, interest-bearing securities + cash &lt; 30%, and non-permissible income &lt; 5%.</li>
            </ol>
          </section>

          {/* Commonly non-compliant */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Commonly asked about — usually not compliant</h2>
            <div className="space-y-2">
              {commonlyNonCompliant.map((c) => (
                <div key={c.name} className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-sm text-gray-600">{c.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="rounded-xl bg-white shadow-sm group">
                  <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-[#1B5E20] flex justify-between items-center select-none">
                    <span>{item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Related reading */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related reading</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/learn/halal-etfs" className="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="font-semibold text-[#1B5E20] text-sm">Halal ETFs →</p>
                <p className="text-xs text-gray-600 mt-1">Shariah-compliant funds compared.</p>
              </Link>
              <Link href="/learn/what-is-sukuk" className="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="font-semibold text-[#1B5E20] text-sm">What Is Sukuk? →</p>
                <p className="text-xs text-gray-600 mt-1">Islamic bonds explained.</p>
              </Link>
              <Link href="/learn/halal-investing-for-beginners" className="block rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition">
                <p className="font-semibold text-[#1B5E20] text-sm">Investing for Beginners →</p>
                <p className="text-xs text-gray-600 mt-1">New to halal investing? Start here.</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Screen any ticker live — not just this list</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah runs the full AAOIFI Standard 21 ratio screen on demand for thousands of stocks, re-checks the
              tickers you hold automatically, and calculates the purification amount on your dividends.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Get started free →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
