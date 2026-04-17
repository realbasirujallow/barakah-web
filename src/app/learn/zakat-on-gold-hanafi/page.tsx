import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Zakat on Gold Jewelry — Hanafi, Shafi\'i & All Madhab Rulings | Barakah',
  description: 'Is gold jewelry zakatable? The Hanafi, Shafi\'i, Maliki, and Hanbali rulings on zakat for gold and silver jewelry — with live calculation examples.',
  keywords: ['zakat on gold jewelry', 'zakat gold hanafi', 'is jewelry zakatable', 'hanafi gold zakat', 'shafii gold exempt', 'zakat on gold', 'gold nisab 2026', 'zakat gold calculation', 'how to calculate gold zakat'],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-gold-hanafi' },
  openGraph: {
    title: 'Zakat on Gold Jewelry — Hanafi, Shafi\'i & All Madhab Rulings | Barakah',
    description: 'Is gold jewelry zakatable? The Hanafi, Shafi\'i, Maliki, and Hanbali rulings on zakat for gold and silver jewelry — with live calculation examples.',
    url: 'https://trybarakah.com/learn/zakat-on-gold-hanafi',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
      { '@type': 'ListItem', position: 3, name: 'Zakat on Gold Jewelry', item: 'https://trybarakah.com/learn/zakat-on-gold-hanafi' },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Zakat on Gold Jewelry — Hanafi, Shafi'i & All Madhab Rulings",
    description: "Is gold jewelry zakatable? The Hanafi, Shafi'i, Maliki, and Hanbali rulings on zakat for gold and silver jewelry — with live calculation examples.",
    url: 'https://trybarakah.com/learn/zakat-on-gold-hanafi',
    dateModified: '2026-04-15',
    publisher: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the nisab for gold in grams and dollars?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The nisab for gold is 85 grams of pure (24K) gold. At April 2026 gold prices (~$99-100 per gram), this is approximately $8,400–$8,500. If your total gold holdings (plus other zakatable wealth) exceed this threshold after a full hawl year, zakat (2.5%) is due. Note: this is the AMJA and Hanafi gold nisab — some use 87.48g (the classical 7.5 tolas).',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I pay zakat on inherited gold jewelry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes, once you inherit gold and it remains in your possession for a full hawl (lunar year) while exceeding nisab, zakat is due — under the Hanafi ruling. If you follow Shafi'i/Maliki/Hanbali and the jewelry is for personal use, you may be exempt. The starting point of the hawl is from the date of inheritance, not the original owner's hawl date.",
        },
      },
      {
        '@type': 'Question',
        name: 'How do I value 18K gold jewelry for zakat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Weigh the piece in grams. Multiply by 0.75 (18/24 = 75% purity) to get pure gold grams. Multiply pure gold grams by today's spot price per gram. This gives you the market value for zakat calculation. Example: A 20g, 18K bracelet = 20 × 0.75 = 15g pure gold × $99.68 = $1,495. Add to all other zakatable wealth and compare to nisab.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Zakat on Gold Jewelry</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">Zakat on Gold Jewelry — Hanafi, Shafi&apos;i &amp; All Madhab Rulings</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 dark:text-gray-300">
            Is gold jewelry zakatable? It depends on which madhab you follow — and this is one of the most practically significant disagreements in zakat fiqh. Millions of Muslim women own gold jewelry passed down through generations or gifted at marriage. Whether that jewelry triggers zakat can represent hundreds or thousands of dollars annually. This guide explains every madhab position, how to calculate the zakat if it applies, and how Barakah&apos;s calculator applies your selected madhab automatically.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">The Core Question: Is Gold Jewelry Zakatable?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              This is one of the most commonly debated zakat questions among scholars. The disagreement traces back to two sets of authentic hadith:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-4 dark:text-gray-300">
              <li>The Prophet (PBUH) saw a woman wearing gold bracelets and asked her, &quot;Do you pay zakat on these?&quot; When she said no, he said they would become fire around her wrists on the Day of Judgment — implying gold jewelry IS zakatable (narrated in Abu Dawud and Tirmidhi).</li>
              <li>In another narration, personal-use jewelry was treated as exempt from zakat — leading some scholars to distinguish between jewelry held as wealth and jewelry worn for adornment.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              From these narrations, the four major madhabs developed distinct legal positions. The position you follow depends on your madhab — and Barakah allows you to select your school of thought before calculating.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Hanafi Ruling: All Gold Is Zakatable</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The Hanafi madhab holds that <strong>all gold and silver — including jewelry worn regularly — is subject to zakat</strong> if it meets the nisab threshold of 85 grams of pure gold. There is no exemption for personal use.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              <strong>Rationale:</strong> Gold has intrinsic monetary value regardless of its form. A bracelet, a ring, a necklace — these are all effectively stored wealth. Wearing gold does not change its nature as zakatable property any more than keeping cash in your pocket rather than a bank exempts it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              <strong>Worked example (Hanafi):</strong> A woman owns gold jewelry totaling 100 grams of 22K gold. Pure gold equivalent = 100g &times; 0.917 = 91.7g of pure gold. This exceeds the 85g nisab. At $99.68/g: market value = 91.7g &times; $99.68 = ~$9,140. Zakat = $9,140 &times; 2.5% = <strong>$228.50</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Hanafi women in North America frequently ask about this ruling — it is often a surprise that jewelry worn every day is zakatable. Barakah&apos;s calculator applies the Hanafi rule automatically when selected and uses live gold API prices updated in real time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Shafi&apos;i, Maliki &amp; Hanbali: Personal-Use Jewelry May Be Exempt</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              These three madhabs generally <strong>exempt gold and silver jewelry that is (a) used personally and regularly, and (b) is not excessive in quantity</strong>. Jewelry held purely for adornment, in moderate amounts, is not considered &quot;stored wealth&quot; in the same sense as hoarded gold.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              <strong>Rationale:</strong> The purpose of the wealth matters. Jewelry worn as adornment serves a different function than gold coins kept in a vault. These scholars point to the narrations where the Prophet (PBUH) did not explicitly tax personal jewelry worn by his wives.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              However, all three madhabs <strong>agree that the following gold IS zakatable</strong> even under their position:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4 dark:text-gray-300">
              <li>Jewelry held as investment or savings (not worn)</li>
              <li>Jewelry rented out or lent to others</li>
              <li>Jewelry in excessive quantities beyond what is moderate for personal adornment</li>
              <li>Jewelry that is unused and stored away</li>
            </ul>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              The line between &quot;moderate personal use&quot; and &quot;excessive&quot; varies by scholar. Many contemporary Shafi&apos;i and Hanbali scholars suggest that beyond the equivalent of 3–4 simple rings or a basic set of jewelry, the excess becomes zakatable even under these madhabs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">How to Calculate Gold Zakat</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Whether you follow Hanafi or another madhab (for gold held for investment), the calculation steps are the same:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-4 dark:text-gray-300">
              <li><strong>Weigh your gold in grams.</strong> Use a digital scale, or ask a jeweler to weigh your pieces.</li>
              <li><strong>Determine the purity (karat):</strong> 24K = 100% pure, 22K = 91.7%, 21K = 87.5%, 18K = 75%, 14K = 58.3%.</li>
              <li><strong>Calculate pure gold equivalent:</strong> Weight (g) &times; purity fraction = pure gold grams.</li>
              <li><strong>Check against nisab:</strong> If pure gold grams &ge; 85g, you have met the nisab threshold (when combined with all other zakatable wealth).</li>
              <li><strong>Calculate zakat:</strong> Current market value of your gold &times; 2.5%.</li>
            </ol>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <p className="font-semibold mb-2">Current gold price reference (April 2026):</p>
              <p>~$3,100/oz = ~$99.68/gram (pure 24K gold)</p>
              <p className="mt-2">Nisab in USD = 85g &times; $99.68/g &asymp; <strong>$8,473</strong></p>
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Barakah uses live gold API prices updated every minute, so your nisab threshold and zakat amount always reflect the current spot price — not an estimate from weeks ago.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  What is the nisab for gold in grams and dollars?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  The nisab for gold is 85 grams of pure (24K) gold. At April 2026 gold prices (~$99–100 per gram), this is approximately $8,400–$8,500. If your total gold holdings — plus other zakatable wealth — exceed this threshold after a full hawl year, zakat (2.5%) is due. Note: this is the AMJA and Hanafi gold nisab. Some classical texts use 87.48g (7.5 tolas) — the difference is minor but worth knowing if your holdings are close to the threshold.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  Do I pay zakat on inherited gold jewelry?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  Yes, once you inherit gold and it remains in your possession for a full hawl (lunar year) while exceeding nisab, zakat is due — under the Hanafi ruling. If you follow Shafi&apos;i/Maliki/Hanbali and the jewelry is for personal use, you may be exempt. The starting point of the hawl is from the date of inheritance, not the original owner&apos;s hawl date. The inheritance itself does not reset the nisab requirement — you start a fresh hawl from when you receive it.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  How do I value 18K gold jewelry for zakat?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  Weigh the piece in grams. Multiply by 0.75 (18/24 = 75% purity) to get pure gold grams. Multiply pure gold grams by today&apos;s spot price per gram. This gives you the market value for zakat calculation. Example: A 20g, 18K bracelet = 20 &times; 0.75 = 15g pure gold &times; $99.68 = $1,495. Add to all other zakatable wealth and compare to the nisab threshold to determine if zakat is due.
                </div>
              </details>
            </div>
          </section>

          <RamadanEmailCapture source="learn-zakat-on-gold-hanafi" variant="inline" />

          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Calculate Gold Zakat with Live Prices — Free</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">Enter your gold weight and karat. Barakah fetches the live spot price and applies your madhab&apos;s ruling automatically — Hanafi, Shafi&apos;i, Maliki, or Hanbali.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">Calculate Gold Zakat with Live Prices — Free</Link>
              <Link href="/signup" className="border border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">Create Free Account</Link>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/learn/zakat-on-savings-account" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Zakat on Savings</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">How to calculate zakat on bank savings and cash.</p>
            </Link>
            <Link href="/learn/nisab-threshold" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Nisab Threshold</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Gold vs. silver nisab — which to use and why it matters.</p>
            </Link>
            <Link href="/learn/what-is-zakat" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">What Is Zakat?</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">The fundamentals of zakat — pillars, eligibility, and timing.</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
