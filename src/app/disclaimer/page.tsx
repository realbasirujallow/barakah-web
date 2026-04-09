'use client';

import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0E8] to-white">
      {/* Header */}
      <header className="bg-[#1B5E20] text-white py-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">☪ Barakah</Link>
          <Link href="/" className="text-sm bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 transition">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-[#1B5E20]">Disclaimer &amp; Islamic Guidance Notice</h1>

        {/* Not a Fatwa */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">⚠️ This Is Not a Fatwa</h2>
          <p className="text-amber-900 leading-relaxed">
            Barakah is a <strong>financial tracking and educational tool</strong>. It is <strong>not</strong> a
            substitute for the ruling (fatwa) of a qualified Islamic scholar (Mufti). The calculations,
            classifications, and guidance provided by this application are based on general principles of
            Islamic jurisprudence (fiqh) and should be verified with your local scholar for your specific
            circumstances.
          </p>
        </section>

        {/* Scholarly References */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[#1B5E20]">Scholarly References</h2>
          <p className="text-gray-700 leading-relaxed">
            The Islamic rulings implemented in Barakah are primarily derived from:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>AMJA (Assembly of Muslim Jurists of America)</strong> — Resolutions and fatwas on zakat,
              Islamic finance, and estate planning. Key references:
              <ul className="list-disc list-inside ml-6 mt-1 text-sm text-gray-600">
                <li>AMJA Fatwa #96 — Nisab at 85 grams of gold</li>
                <li>AMJA Resolutions on zakat of stocks and investments</li>
                <li>AMJA guidance on debt deduction methodology</li>
              </ul>
            </li>
            <li>
              <strong>AAOIFI Shariah Standard No. 21</strong> — Guidelines for halal stock screening
              (debt ratio, interest-bearing securities, revenue purity thresholds)
            </li>
            <li>
              <strong>Quran, Surah An-Nisa (4:11-12)</strong> — Islamic inheritance (fara&apos;id) shares
            </li>
            <li>
              <strong>Hadith Collections</strong> — Including Sahih Bukhari, Sahih Muslim, Abu Dawud, and
              Tirmidhi for zakat, riba, and estate rulings
            </li>
          </ul>
        </section>

        {/* Zakat Calculations */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">Zakat Calculations</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Nisab is calculated using the <strong>85g gold standard</strong> with live gold pricing, following the AMJA (Assembly of Muslim Jurists of America) recommendation. Some scholars prefer the silver standard (595g) which produces a lower threshold — consult your local scholar if unsure.</li>
            <li>Zakat rate is fixed at <strong>2.5%</strong> of zakatable wealth above nisab.</li>
            <li>Asset classifications (zakatable vs. exempt) follow majority scholarly opinion but may differ from your school of thought (madhhab).</li>
            <li>Debt deduction uses the <strong>annual installment method</strong> for long-term debts per contemporary scholarly guidance.</li>
            <li>The Hawl (lunar year) tracker is a convenience tool — you are responsible for verifying your own Hawl dates.</li>
          </ul>
        </section>

        {/* Halal Screening */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">Halal Investment Screening</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Stock screening follows <strong>AAOIFI Shariah Standard No. 21</strong>: debt ratio &lt; 33%, interest-bearing securities &lt; 33%, haram revenue &lt; 5%.</li>
            <li>Financial data is sourced from third-party APIs and may have delays or inaccuracies.</li>
            <li>Screening is a <strong>general guideline</strong> — some scholars may apply stricter or more lenient criteria.</li>
          </ul>
        </section>

        {/* Inheritance / Wasiyyah */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">Islamic Inheritance &amp; Wasiyyah</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Inheritance shares are based on <strong>Quran 4:11-12</strong> and the classical fiqh rules of fara&apos;id.</li>
            <li>&apos;Awl (proportional reduction) and Radd (redistribution of surplus) are applied following the majority scholarly opinion.</li>
            <li>Voluntary bequests (wasiyyah) are <strong>capped at 1/3</strong> of the estate after debts and funeral expenses, and <strong>cannot be made to legal heirs</strong> (Hadith: La wasiyyata li-warith).</li>
            <li>For complex estate situations, <strong>always consult a qualified Islamic scholar</strong> familiar with your jurisdiction&apos;s laws.</li>
          </ul>
        </section>

        {/* Riba Detection */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">Riba Detection</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>The riba scanner uses keyword and context analysis to <strong>flag potential</strong> interest-bearing transactions.</li>
            <li>It may produce false positives or miss certain transactions — always review flagged items manually.</li>
            <li>Islamic alternatives suggested are general guidance from Islamic finance literature.</li>
          </ul>
        </section>

        {/* Legal Disclaimer */}
        <section className="bg-gray-50 rounded-xl border p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Legal Disclaimer</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Barakah is provided &quot;as is&quot; without warranty of any kind. The developers are not
            responsible for any financial, legal, or religious consequences arising from the use of this
            application. All financial data is sourced from third-party APIs and may contain errors or
            delays. Users are solely responsible for verifying calculations and consulting qualified
            professionals for financial, tax, and religious guidance.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            By using Barakah, you acknowledge that this tool is for <strong>informational and
            educational purposes only</strong> and does not constitute financial advice, legal counsel,
            or an Islamic legal ruling (fatwa).
          </p>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>بسم الله الرحمن الرحيم</p>
          <p className="mt-1">May Allah grant us barakah in our wealth and guide us to what is halal and pure.</p>
          <Link href="/" className="inline-block mt-4 text-[#1B5E20] font-medium hover:underline">
            ← Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
