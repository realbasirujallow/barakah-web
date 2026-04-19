import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hawl Meaning: Your Zakat Anniversary Year, Explained | Barakah',
  description:
    "Hawl is the 354-day Islamic lunar year your wealth must sit above nisab for zakat to become due. Learn how hawl starts, resets, and why Barakah tracks daily continuity for signed-in users.",
  keywords: [
    'hawl meaning',
    'what is hawl',
    'hawl in zakat',
    'how to calculate my hawl date',
    'zakat anniversary',
    'islamic lunar year zakat',
    'hawl reset nisab drop',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/hawl',
  },
  openGraph: {
    title: 'Hawl Meaning: Your Zakat Anniversary Year, Explained | Barakah',
    description: 'Hawl is the 354-day Islamic lunar year your wealth must sit above nisab for zakat to become due.',
    url: 'https://trybarakah.com/learn/hawl',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does hawl mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hawl (Arabic: الحول) means "a full Islamic lunar year" — specifically 354 days. In zakat, the hawl is the period your zakatable wealth must remain above the nisab threshold before zakat becomes obligatory. The concept appears in the Prophet\'s (ﷺ) famous hadith: "No zakat is due on wealth until a year has passed." (Abu Dawud 1573)',
      },
    },
    {
      '@type': 'Question',
      name: 'When does my hawl start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your hawl begins on the exact day your total zakatable wealth first crossed the nisab threshold. If you crossed nisab on 1 Ramadan, your hawl completes on 1 Ramadan the following Islamic year. Barakah tracks this per asset class and per user automatically — the /dashboard/hawl page shows you your current anchor date.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if my wealth drops below nisab mid-year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "This is madhab-sensitive. The Shafi'i, Maliki, and Hanbali schools require continuous possession — if your wealth falls below nisab at any point during the 354 days, your hawl resets. The Hanafi school considers only the start and end of the hawl; dips in between don't restart it. Barakah's Hawl Continuity feature honors your selected fiqh rule via the 'Hawl resets on nisab drop' toggle in Fiqh Settings.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Ramadan as my hawl anchor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Many Muslims choose to align their hawl to Ramadan for practical and spiritual reasons — the month of heightened giving, reflection, and community distribution. This is allowed by all four madhabs. In Barakah, you can set or reset your hawl start date through the app, including using Hijri input (year/month/day) rather than Gregorian dates.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does Barakah track my hawl continuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah takes a daily snapshot of your total zakatable wealth and compares it against the live nisab threshold for your selected methodology. If your wealth drops below nisab, the app either pauses or resets the hawl depending on your fiqh preference. The daily snapshots are recorded immutably with integrity hashes, so you can audit your hawl history years later.',
      },
    },
  ],
};

export default function HawlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Hawl</span>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
              Hawl — Your 354-Day Zakat Anniversary, Explained
            </h1>
            <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

            <p className="text-lg leading-8 text-gray-800 mb-6">
              Hawl (الحول) is the single most misunderstood concept in zakat for everyday Muslims.
              It&apos;s not about the calendar year. It&apos;s not about Ramadan. It&apos;s about
              one specific Islamic lunar year — 354 days — during which your wealth must stay above
              the nisab threshold for zakat to become due.
            </p>

            {/* Hadith callout */}
            <section className="mb-10 rounded-2xl bg-green-900 p-6 text-white">
              <p className="text-xs uppercase tracking-wider font-semibold text-green-300 mb-3">
                The Prophet (ﷺ) said:
              </p>
              <blockquote className="text-lg font-semibold leading-relaxed italic mb-3">
                &ldquo;No zakat is due on wealth until a year has passed.&rdquo;
              </blockquote>
              <p className="text-green-300 text-sm font-medium">— Abu Dawud 1573, narrated by Ibn Umar (ra)</p>
            </section>

            {/* The basics */}
            <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">The short version</h2>
              <ol className="list-decimal space-y-3 pl-6 text-base leading-7 text-gray-800">
                <li>
                  On the day your total <Link href="/learn/nisab" className="text-[#1B5E20] underline hover:no-underline">zakatable wealth</Link> first crosses the nisab threshold, your hawl begins.
                </li>
                <li>
                  354 days later (one Islamic lunar year), if your wealth is still above nisab, your zakat is due.
                </li>
                <li>
                  What happens if your wealth drops below nisab mid-year depends on your madhab (see below).
                </li>
                <li>
                  Every year afterward, the hawl completes on the same Islamic calendar date — so your zakat anniversary stays consistent.
                </li>
              </ol>
            </section>

            {/* By madhab */}
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">
                What happens if wealth dips below nisab?
              </h2>
              <p className="mb-4 text-base leading-7 text-gray-800">
                This is the madhab-sensitive question Barakah automates for you. The four Sunni
                madhabs split into two camps:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-300 bg-white p-5">
                  <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Hawl resets on nisab drop</h3>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Shafi&apos;i · Maliki · Hanbali
                  </p>
                  <p className="text-sm leading-7 text-gray-800">
                    These schools require <strong>continuous possession</strong>. If your total
                    zakatable wealth falls below nisab at any point during the 354 days, your hawl
                    restarts from zero the next time you cross nisab again. This is the majority
                    global-Muslim position.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-300 bg-white p-5">
                  <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Only start and end matter</h3>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Hanafi
                  </p>
                  <p className="text-sm leading-7 text-gray-800">
                    The classical Hanafi view: what matters is whether you were above nisab on the
                    day your hawl started AND on the day it completes. Dips in between do not
                    restart the hawl. Zakat is still calculated on your total wealth at the end of
                    the hawl, not the average.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm italic text-gray-700">
                In Barakah, this is controlled by the &ldquo;Hawl resets on nisab drop&rdquo; toggle
                in Fiqh Settings. Selecting your madhab sets a sensible default; you can override at
                any time.
              </p>
            </section>

            {/* Practical example */}
            <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">A practical example</h2>
              <p className="mb-4 text-base leading-7 text-gray-800">
                Imagine you crossed nisab on 1 Ramadan 1446 (roughly 10 February 2026). Here&apos;s
                what happens under both positions:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                      <th className="py-2 pr-4 font-semibold text-gray-700">Date</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">Zakatable wealth</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">Above nisab?</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">Shafi&apos;i/Maliki/Hanbali</th>
                      <th className="py-2 font-semibold text-gray-700">Hanafi</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">1 Ramadan 1446</td>
                      <td className="py-2 pr-4">$18,000</td>
                      <td className="py-2 pr-4 text-green-700">✓</td>
                      <td className="py-2 pr-4">Hawl begins</td>
                      <td className="py-2">Hawl begins</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">1 Shawwal 1446</td>
                      <td className="py-2 pr-4">$22,500</td>
                      <td className="py-2 pr-4 text-green-700">✓</td>
                      <td className="py-2 pr-4">Hawl continues</td>
                      <td className="py-2">Hawl continues</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-amber-50">
                      <td className="py-2 pr-4">15 Dhul Qadah 1446</td>
                      <td className="py-2 pr-4">$12,000 (below gold nisab)</td>
                      <td className="py-2 pr-4 text-amber-700">⚠</td>
                      <td className="py-2 pr-4 font-semibold text-amber-900">Hawl RESETS</td>
                      <td className="py-2 text-gray-600">Hawl continues (if above at end)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">20 Rabi al-Thani 1447</td>
                      <td className="py-2 pr-4">$19,500</td>
                      <td className="py-2 pr-4 text-green-700">✓</td>
                      <td className="py-2 pr-4">New hawl begins</td>
                      <td className="py-2">Still within original hawl</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">1 Ramadan 1447</td>
                      <td className="py-2 pr-4">$21,000</td>
                      <td className="py-2 pr-4 text-green-700">✓</td>
                      <td className="py-2 pr-4 text-gray-600">Not yet due — new hawl</td>
                      <td className="py-2 font-semibold text-green-700">Zakat due at 2.5% = $525</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-700">
                Same wealth pattern; different outcomes by madhab. Barakah tracks the daily
                snapshots so you can verify this trace in your own /dashboard/hawl page — no spreadsheet
                required.
              </p>
            </section>

            {/* Using Ramadan as anchor */}
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">
                Can I use Ramadan as my hawl anchor?
              </h2>
              <p className="mb-3 text-base leading-7 text-gray-800">
                Yes. Many Muslims align their hawl to Ramadan for community, giving-season, and
                spiritual reasons. All four madhabs accept this. In Barakah you can set or reset
                your hawl start to a specific Hijri date (year / month / day) through the &ldquo;Reset hawl to
                date&rdquo; flow on the Hawl Tracker page.
              </p>
              <p className="text-base leading-7 text-gray-800">
                <strong>Caveat:</strong> if you pick a Ramadan anchor but crossed nisab earlier in the year,
                you&apos;re technically delaying zakat slightly — that&apos;s fine for most contemporary
                scholars but worth noting. For Hanafi users, the practical difference is minimal; for
                Shafi&apos;i/Maliki/Hanbali users, make sure your wealth stays above nisab continuously
                from your Ramadan anchor forward.
              </p>
            </section>

            {/* Related */}
            <section className="mb-10 rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-4 text-2xl font-bold">Related guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/learn/nisab" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Nisab threshold →</strong>
                  <p className="mt-1 text-sm text-green-100">Live 2026 USD figures by methodology.</p>
                </Link>
                <Link href="/learn/what-is-zakat" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>What is zakat? →</strong>
                  <p className="mt-1 text-sm text-green-100">The fundamentals before the mechanics.</p>
                </Link>
                <Link href="/learn/madhab-finance" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Fiqh & madhab differences →</strong>
                  <p className="mt-1 text-sm text-green-100">Why the 4 schools disagree here.</p>
                </Link>
                <Link href="/zakat-calculator" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Zakat calculator →</strong>
                  <p className="mt-1 text-sm text-green-100">Open the live calculator now.</p>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
