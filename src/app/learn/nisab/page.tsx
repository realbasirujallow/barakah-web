import type { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices, { GoldNisabUSD, SilverNisabUSD } from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Nisab Threshold 2026 USD: Live Gold & Silver Calculator | Barakah',
  description:
    'The exact 2026 nisab threshold in USD, calculated from live gold and silver spot prices. Understand which methodology (AMJA gold, classical silver, or lower-of-two) applies to your madhab and why.',
  keywords: [
    'nisab threshold usd',
    'nisab 2026',
    'nisab calculator',
    'nisab gold silver',
    'what is nisab',
    'hanafi nisab silver',
    'amja nisab gold',
    'classical silver nisab',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/nisab',
  },
  openGraph: {
    title: 'Nisab Threshold 2026 USD: Live Gold & Silver Calculator | Barakah',
    description:
      'The exact 2026 nisab threshold in USD, calculated from live gold and silver spot prices.',
    url: 'https://trybarakah.com/learn/nisab',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nisab is the minimum amount of wealth a Muslim must own — above basic needs and debts — before zakat becomes obligatory. Barakah uses the AMJA standard of 85g of gold or 595g of silver (classical fiqh texts specify 87.48g / 612.36g; the modern rounded values are within ~3% and are what AMJA and most practical calculators use today). In 2026 USD, gold nisab sits around $13,000–14,000 and silver nisab around $1,500–1,700, depending on daily spot prices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I use gold nisab or silver nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The classical Hanafi position uses silver; AMJA, ISNA, and the Fiqh Council of North America recommend gold for North American Muslims. Silver is the more pro-obligation choice (lower threshold means more people qualify to pay zakat). Shafi\'i, Maliki, and Hanbali madhabs generally use gold for cash/savings and silver for silver holdings. Barakah auto-switches your nisab methodology when you change your madhab; you can always override in Zakat settings.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is "lower of two" nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The lower-of-two methodology (associated with Shaykh Yusuf al-Qaradawi and several contemporary scholars) uses whichever of gold or silver nisab is lower at the current market — in practice silver for 99% of the past 50 years. It is the most pro-obligation option because it captures the maximum number of zakat-eligible Muslims.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Barakah calculate the live nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah pulls live gold and silver spot prices from our data vendor, caches them for an hour, and falls back to conservative constants if the upstream API is unreachable (currently $165/g gold and $2.73/g silver). The methodology you select on your Fiqh Settings page determines whether we multiply by 85g (gold) or 595g (silver) to produce your personal nisab. Every zakat snapshot records which methodology and which live price produced the threshold.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does my hawl restart if my wealth falls below nisab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "That depends on your madhab. Shafi'i, Maliki, and Hanbali traditions reset the hawl (354-day lunar year) if your wealth falls below nisab mid-year. The Hanafi view considers only the start and end of the hawl; dips in between don't restart it. Barakah's Hawl Continuity feature honors your selected fiqh rule and tracks daily snapshots either way.",
      },
    },
  ],
};

export default function NisabThresholdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-[#1B5E20]">
              🌙 Barakah
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">
                Learn
              </Link>
              <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">
                Learn
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Nisab Threshold</span>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Headline */}
            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
              Nisab Threshold 2026 — Live USD Calculator
            </h1>
            <p className="text-base text-gray-600 mb-2">
              Last reviewed: 2026-04-19 · Prices update every hour
            </p>
            <p className="text-lg leading-8 text-gray-800 mb-6">
              Nisab is the minimum wealth a Muslim must hold for zakat to become obligatory. Barakah
              applies the AMJA standard of <strong>85 grams of pure gold</strong> or{' '}
              <strong>595 grams of pure silver</strong> (classical fiqh texts specify 87.48g / 612.36g;
              the modern rounded values are within ~3%). The USD equivalents move every day with the
              market. This page shows today&apos;s live figures, explains which methodology fits your
              madhab, and links out to the zakat calculations that use them.
            </p>

            {/* Live nisab widget */}
            <section className="mb-10 rounded-2xl border-2 border-[#1B5E20] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#1B5E20]">
                Today&apos;s nisab, live from the market
              </h2>
              <NisabLivePrices variant="card" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
                    AMJA Gold (85g)
                  </p>
                  <p className="text-3xl font-bold text-amber-900">
                    <GoldNisabUSD />
                  </p>
                  <p className="mt-1 text-xs text-amber-800">
                    Default for Shafi&apos;i, Maliki, Hanbali, and AMJA / ISNA guidance.
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Classical Silver (595g)
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    <SilverNisabUSD />
                  </p>
                  <p className="mt-1 text-xs text-gray-700">
                    Classical Hanafi default + contemporary pro-obligation choice.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-[#1B5E20] p-5 text-white">
                <p className="text-sm leading-relaxed">
                  <strong>Calculate your zakat with today&apos;s nisab →</strong> Barakah&apos;s
                  dashboard picks the right methodology automatically based on your madhab, tracks
                  your daily hawl continuity, and records an integrity-hashed snapshot of every
                  calculation.
                </p>
                <Link
                  href="/zakat-calculator"
                  className="mt-3 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
                >
                  Open the Zakat Calculator →
                </Link>
              </div>
            </section>

            {/* Which methodology */}
            <section className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-[#1B5E20]">
                Which methodology applies to you?
              </h2>
              <p className="mb-4 text-base leading-7 text-gray-800">
                Three recognized methodologies are in common use in 2026. Barakah supports all three;
                your madhab setting in the app determines the default, and you can override at any
                time.
              </p>

              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="mb-2 text-xl font-bold text-amber-900">AMJA Gold Standard</h3>
                  <p className="mb-2 text-sm leading-7 text-amber-900">
                    <strong>85 g gold × live spot.</strong> Recommended by the Assembly of Muslim
                    Jurists of America (AMJA), the Islamic Society of North America (ISNA), and the
                    Fiqh Council of North America for North American Muslims. Follows the majority
                    contemporary position that gold is the most stable reference for cash-dominant
                    wealth in inflation-adjusted economies.
                  </p>
                  <p className="text-sm font-semibold text-amber-900">
                    Default for Shafi&apos;i, Maliki, Hanbali, and &ldquo;General / AMJA&rdquo; users in
                    Barakah.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-300 bg-gray-50 p-5">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Classical Silver Standard</h3>
                  <p className="mb-2 text-sm leading-7 text-gray-800">
                    <strong>595 g silver × live spot.</strong> The classical Hanafi position, rooted
                    in the Prophet&apos;s (ﷺ) explicit reference to 200 dirhams of silver. Supported
                    by Darul Uloom Deoband, Darul Uloom Karachi, and the written guidance of
                    Shaykh Taqi Usmani for Western Muslim wealth patterns. Produces a lower
                    threshold, so more Muslims qualify as zakat-eligible — the pro-obligation
                    choice.
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Default for Hanafi users in Barakah (auto-switched when you select Hanafi in
                    Fiqh Settings).
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <h3 className="mb-2 text-xl font-bold text-blue-900">
                    Lower-of-Two (Al-Qaradawi)
                  </h3>
                  <p className="mb-2 text-sm leading-7 text-blue-900">
                    <strong>min(gold nisab, silver nisab).</strong> Associated with Shaykh Yusuf
                    al-Qaradawi and adopted by several contemporary scholars. Produces the most
                    pro-obligation threshold — in practice always silver in 2026 — and aligns with
                    the Prophet&apos;s (ﷺ) recorded practice of accepting whichever threshold was
                    lower.
                  </p>
                  <p className="text-sm font-semibold text-blue-900">
                    Available as an explicit choice in Barakah&apos;s Zakat settings.
                  </p>
                </div>
              </div>
            </section>

            {/* Worked example */}
            <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">A worked example</h2>
              <p className="mb-3 text-sm leading-7 text-gray-800">
                Imagine you&apos;re a Hanafi Muslim with $18,000 in savings, $2,400 in a brokerage
                halal-compliant portfolio, and $3,000 in gold. With the classical silver nisab at
                roughly <SilverNisabUSD /> in 2026:
              </p>
              <ul className="mb-3 list-disc space-y-2 pl-6 text-sm leading-7 text-gray-800">
                <li>Total zakatable wealth: $23,400</li>
                <li>Nisab (Hanafi silver): ~$1,600</li>
                <li>Above nisab? Yes — by ~$21,800</li>
                <li>Zakat due at 2.5%: <strong>$585</strong></li>
              </ul>
              <p className="text-sm leading-7 text-gray-800">
                Switch to AMJA Gold and the same portfolio would only be zakat-eligible once your
                total crossed ~<GoldNisabUSD />. Same wealth, different obligation — which is
                exactly why Barakah records the methodology with every zakat snapshot and shows the
                breakdown on your /methodology page.
              </p>
            </section>

            {/* What counts toward nisab */}
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">
                What counts toward your nisab?
              </h2>
              <p className="mb-3 text-sm leading-7 text-gray-800">
                The nisab threshold is applied to the sum of your <strong>zakatable wealth</strong>,
                not every dollar you own. In practice that means:
              </p>
              <ul className="list-disc space-y-1 pl-6 text-sm leading-7 text-gray-800">
                <li>Cash (all currencies, converted to USD at spot)</li>
                <li>Savings and checking balances</li>
                <li>Stocks, ETFs, and mutual funds held for investment (not trade-only)</li>
                <li>Gold and silver — in any form (bullion, jewelry is madhab-sensitive)</li>
                <li>Cryptocurrency held as an investment</li>
                <li>Business inventory and trade goods</li>
                <li>Receivables you reasonably expect to collect</li>
              </ul>
              <p className="mt-3 text-sm leading-7 text-gray-800">
                Explicitly <strong>excluded</strong> from the nisab check: your primary home, personal
                vehicle, personal clothing, household goods, retirement accounts (if you follow the
                non-accessible view), and any debts you owe.
              </p>
            </section>

            {/* Related pages */}
            <section className="mb-10 rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-4 text-2xl font-bold">Related guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/learn/what-is-zakat" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>What is Zakat? →</strong>
                  <p className="mt-1 text-sm text-green-100">The fundamentals, rates, and categories.</p>
                </Link>
                <Link href="/learn/hawl" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Hawl explained →</strong>
                  <p className="mt-1 text-sm text-green-100">The 354-day lunar year and how it resets.</p>
                </Link>
                <Link href="/learn/zakat-on-gold" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Zakat on gold →</strong>
                  <p className="mt-1 text-sm text-green-100">Physical and investment gold, by madhab.</p>
                </Link>
                <Link href="/learn/zakat-on-stocks" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Zakat on stocks →</strong>
                  <p className="mt-1 text-sm text-green-100">Investments and halal-screened portfolios.</p>
                </Link>
                <Link href="/learn/zakat-on-401k" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Zakat on 401(k) →</strong>
                  <p className="mt-1 text-sm text-green-100">Retirement accounts and state-tax logic.</p>
                </Link>
                <Link href="/methodology" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Methodology →</strong>
                  <p className="mt-1 text-sm text-green-100">How every Barakah calculation is done.</p>
                </Link>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mb-6 rounded-2xl bg-gray-50 p-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Important note</h3>
              <p className="text-sm leading-7 text-gray-700">
                This page describes the methodology Barakah implements. It is not a personal fatwa
                or a substitute for your own scholar. Where madhabs differ, Barakah surfaces the
                difference instead of hiding it — but the choice of which methodology to follow, and
                how to treat edge cases in your own wealth, should be made with a qualified
                scholar. See{' '}
                <Link href="/methodology" className="font-semibold text-[#1B5E20] hover:underline">
                  our methodology
                </Link>{' '}
                and the{' '}
                <Link href="/methodology/changelog" className="font-semibold text-[#1B5E20] hover:underline">
                  changelog
                </Link>{' '}
                for the full decision trail.
              </p>
            </section>
          </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hawl →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
