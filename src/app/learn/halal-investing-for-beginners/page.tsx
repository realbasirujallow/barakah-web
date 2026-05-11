import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Investing for Beginners — Your First Steps in 2026',
  description:
    'Brand new to halal investing? Start here. What halal investing is, what to avoid, the simplest first portfolio (3 ETFs), and how to scale up — with no jargon.',
  keywords: [
    'halal investing for beginners',
    'how to start halal investing',
    'halal investing 2026',
    'first halal investments',
    'beginner halal portfolio',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-investing-for-beginners' },
  openGraph: {
    title: 'Halal Investing for Beginners — First Steps',
    description:
      'A no-jargon walkthrough of halal investing for someone starting from zero.',
    url: 'https://trybarakah.com/learn/halal-investing-for-beginners',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function HalalInvestingBeginnersPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Halal Investing for Beginners</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Halal investing for beginners — your first steps in 2026
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Educational, not financial advice. Talk to a qualified
          financial advisor and a scholar before investing real money.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">What halal investing actually is</h2>
          <p className="text-base text-gray-700 mb-3">
            Halal investing means putting your money to work in ways that don&apos;t conflict
            with Islamic principles. Three rules cover most of it:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-base text-gray-700">
            <li><strong>No riba (interest).</strong> No bonds, no savings accounts paying interest, no companies whose primary business is interest-based lending.</li>
            <li><strong>No haram industries.</strong> No companies whose primary revenue is alcohol, pork, gambling, conventional insurance, adult content, or tobacco.</li>
            <li><strong>No excessive uncertainty (gharar).</strong> No speculative gambling-like instruments. Most options trading and high-leverage products are out.</li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Where most people start</h2>
          <p className="text-base text-gray-700 mb-3">
            The simplest beginner portfolio — three halal ETFs — gives you broad diversification
            without picking individual stocks:
          </p>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>HLAL</strong> — Wahed FTSE USA Shariah ETF, US large-cap halal-screened</li>
            <li><strong>SPUS</strong> — SP Funds Shariah Industry Exclusions ETF, S&amp;P 500 halal version</li>
            <li><strong>SPRE</strong> — SP Funds S&amp;P Global REIT Shariah ETF, halal real estate exposure</li>
          </ul>
          <p className="text-base text-gray-700 mt-3">
            These are not recommendations — they&apos;re the most commonly-cited halal ETFs.
            Verify each one&apos;s current holdings against your madhab&apos;s preferred screen
            before buying.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Step-by-step first portfolio</h2>
          <ol className="list-decimal list-inside space-y-3 text-base text-gray-700">
            <li><strong>Open a brokerage account.</strong> Schwab, Fidelity, and Vanguard are common — none charge to open or hold. Avoid margin accounts.</li>
            <li><strong>Connect a halal-funded bank account.</strong> If your savings has been in an interest-bearing account, the interest portion should be donated to charity (not your zakat — separate).</li>
            <li><strong>Build the 3-ETF starter.</strong> A simple split: 50% HLAL or SPUS for broad US exposure, 30% SPRE for real estate, 20% reserved for future allocation as you learn.</li>
            <li><strong>Set up automatic monthly contributions.</strong> Even $100/month compounded over decades matters far more than picking a winning stock.</li>
            <li><strong>Track halal status.</strong> Use Barakah&apos;s halal screener to verify each ETF stays halal — fund holdings change over time and a stock that passes today may not tomorrow.</li>
            <li><strong>Track zakat on the portfolio.</strong> Zakat on investments has its own rules — see <Link href="/learn/zakat-on-stocks-and-etfs" className="text-[#1B5E20] underline">Zakat on stocks and ETFs</Link>.</li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">What to avoid as a beginner</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Day trading.</strong> Often closer to gambling than investing; high churn = high purification needed.</li>
            <li><strong>Crypto as your starter.</strong> Scholarly opinion on crypto is still forming. Some scholars deem it permissible, others forbid it. Beginner-grade halal investing is settled territory; crypto isn&apos;t.</li>
            <li><strong>Margin trading.</strong> Borrowing on interest to invest is riba.</li>
            <li><strong>Robo-advisors that aren&apos;t halal-aware.</strong> Most robo-advisors put 30–40% in bonds by default, which is riba. Wahed is the well-known halal robo-advisor.</li>
            <li><strong>Buying individual stocks before you can read a balance sheet.</strong> ETFs first, individual stocks once you can verify the AAOIFI ratios yourself.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Use Barakah to track halal status</h2>
          <Link href="/halal-stocks" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the halal stock screener →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/learn/halal-investing-guide" className="text-[#1B5E20] underline">The full halal investing guide (intermediate)</Link></li>
            <li>· <Link href="/learn/aaoifi-halal-screening" className="text-[#1B5E20] underline">AAOIFI halal screening explained</Link></li>
            <li>· <Link href="/learn/halal-etfs" className="text-[#1B5E20] underline">Halal ETFs deep dive</Link></li>
            <li>· <Link href="/learn/zakat-on-stocks-and-etfs" className="text-[#1B5E20] underline">Zakat on stocks and ETFs</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
