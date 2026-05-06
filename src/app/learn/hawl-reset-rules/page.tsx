import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hawl Reset Rules — Does Your Lunar Year Restart? | Barakah',
  description:
    'When does the hawl (lunar zakat year) reset? What if your wealth dipped below nisab and recovered? Hanafi vs Shafi&apos;i positions explained with worked examples.',
  keywords: [
    'hawl reset',
    'when does hawl reset',
    'hawl below nisab',
    'lunar year zakat reset',
    'hawl rules',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/hawl-reset-rules' },
  openGraph: {
    title: 'Hawl Reset Rules — Does the Lunar Year Restart?',
    description:
      'Hanafi vs Shafi&apos;i / Maliki / Hanbali positions on what triggers a hawl reset.',
    url: 'https://trybarakah.com/learn/hawl-reset-rules',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function HawlResetRulesPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Hawl Reset Rules</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Hawl reset rules — when does the lunar year restart?
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Methodology summary, not a fatwa. See our{' '}
          <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
            full methodology
          </Link>
          {' '}for sources.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The base rule</h2>
          <p className="text-base text-gray-700">
            Hawl is the lunar year — approximately 354 days — that wealth must remain at or
            above nisab before zakat becomes due. The clock starts the day your wealth first
            reaches nisab. When 354 lunar days pass with continuous nisab-level wealth, you owe
            zakat on the wealth you hold on the anniversary.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The three classical positions on dips below nisab</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">1. Hanafi — strict reset only on full year below nisab</h3>
              <p className="text-base text-gray-700 mt-1">
                A brief dip below nisab during the year does NOT reset the hawl, as long as you
                START and END the year above nisab. You owe zakat on the anniversary based on the
                ending balance.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900">2. Shafi&apos;i / Maliki / Hanbali — any dip resets</h3>
              <p className="text-base text-gray-700 mt-1">
                Any moment during the lunar year where wealth drops below nisab — even briefly —
                breaks the continuity and resets the hawl clock. The new clock starts the next time
                wealth reaches nisab.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900">3. Contemporary AMJA-aligned position</h3>
              <p className="text-base text-gray-700 mt-1">
                Many modern scholars follow the Hanafi continuity principle for cash and trade
                wealth (because day-to-day fluctuations are normal in modern household finance) and
                the stricter Shafi&apos;i rule only for clear, sustained drops below nisab.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Worked examples</h2>
          <p className="text-base text-gray-700 mb-3">
            <strong>Scenario:</strong> You first hit nisab on 1 Muharram 1447. Suppose nisab in
            local currency is $5,000.
          </p>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700 mb-4">
            <li>1 Muharram 1447: $5,200. Hawl clock starts.</li>
            <li>15 Rabi&apos; al-Thani 1447: a one-time car repair drops you to $4,800 for two
              days, then back to $5,300.</li>
            <li>1 Muharram 1448: balance is $5,500.</li>
          </ul>
          <p className="text-base text-gray-700 mb-3">
            <strong>Hanafi outcome:</strong> Hawl held. You owe 2.5% × $5,500 = $137.50 on 1
            Muharram 1448.
          </p>
          <p className="text-base text-gray-700">
            <strong>Shafi&apos;i / Maliki / Hanbali outcome:</strong> Hawl broke when you dipped.
            New hawl starts on whatever day you crossed back above nisab — let&apos;s say 17
            Rabi&apos; al-Thani 1447. Zakat is due 354 lunar days from THAT date.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Edge cases</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Adding new wealth mid-year:</strong> Most scholars say the new wealth gets the same hawl as the original. You don&apos;t track each contribution separately.</li>
            <li><strong>Switching nisab thresholds (silver → gold or vice versa):</strong> Stick with the same threshold across the year for consistency. Switch only at the start of a new hawl.</li>
            <li><strong>Investments + cash:</strong> Most scholars combine cash, investments, and trade goods into a single hawl base.</li>
            <li><strong>First-time crossing:</strong> The day you first hit nisab matters — record it. If you don&apos;t know exactly, scholars often allow you to use a reasonable estimate.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">How Barakah handles this</h2>
          <p className="text-base text-gray-700">
            Barakah lets you set your hawl-reset preference (strict / lenient / madhab default)
            in your fiqh settings. The dashboard tracks your nisab-crossing date and warns you
            when wealth dips below nisab so you can decide whether to record a reset.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Calculate yours</h2>
          <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the zakat calculator →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/fiqh-terms/hawl" className="text-[#1B5E20] underline">Hawl — full definition</Link></li>
            <li>· <Link href="/learn/nisab-gold-vs-silver" className="text-[#1B5E20] underline">Gold vs silver nisab</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Full methodology + sources</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
