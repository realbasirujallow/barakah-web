import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Islamic Finance Apps Compared (2026) — Barakah, Zoya, Wahed, Saturna, Musaffa | Barakah',
  description:
    'Side-by-side comparison of the leading Islamic finance apps: zakat tools, halal stock screening, Plus/Family pricing, fiqh assumptions, and what each one actually does well.',
  keywords: [
    'best islamic finance app',
    'islamic finance apps compared',
    'halal investing apps',
    'zakat app comparison',
    'barakah vs zoya vs wahed',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/islamic-finance-apps' },
  openGraph: {
    title: 'Best Islamic Finance Apps Compared (2026)',
    description:
      'Pick the right Islamic finance app for your household. What zakat / halal investing / family-plan support each tool actually delivers.',
    url: 'https://trybarakah.com/compare/islamic-finance-apps',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function IslamicFinanceAppsComparePage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/compare" className="hover:text-[#1B5E20]">Compare</Link>
          {' / '}
          <span className="text-gray-700">Islamic Finance Apps</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-4">
          Best Islamic finance apps compared (2026)
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Comparison summarises each app&apos;s public website, app-store
          listing, and our own use. Specific feature presence may change — verify before relying on
          a single line in this table.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6 overflow-x-auto">
          <table className="w-full text-sm text-gray-800">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4">Capability</th>
                <th className="text-left py-2 pr-4">Barakah</th>
                <th className="text-left py-2 pr-4">Zoya</th>
                <th className="text-left py-2 pr-4">Wahed</th>
                <th className="text-left py-2 pr-4">Saturna (Amana)</th>
                <th className="text-left py-2">Musaffa</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_td]:pr-4 [&_tr]:border-b [&_tr]:border-gray-100">
              <tr>
                <td><strong>Zakat calculator</strong></td>
                <td>Yes — gold/silver/lower-of, all 4 madhabs</td>
                <td>Basic</td>
                <td>No</td>
                <td>No</td>
                <td>Basic</td>
              </tr>
              <tr>
                <td><strong>Hawl tracking (lunar year)</strong></td>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td><strong>Bank linking (Plaid)</strong></td>
                <td>Yes</td>
                <td>No</td>
                <td>Investing only</td>
                <td>Investing only</td>
                <td>No</td>
              </tr>
              <tr>
                <td><strong>Halal stock screener</strong></td>
                <td>Yes — AAOIFI Std. 21</td>
                <td>Yes — AAOIFI</td>
                <td>Pre-screened portfolio</td>
                <td>Pre-screened funds</td>
                <td>Yes — AAOIFI</td>
              </tr>
              <tr>
                <td><strong>Halal robo-advisor</strong></td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
                <td>Yes (mutual funds)</td>
                <td>No</td>
              </tr>
              <tr>
                <td><strong>Riba detector</strong></td>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td><strong>Faraid (inheritance) calculator</strong></td>
                <td>Yes — 4 madhabs + Awl/Radd</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td><strong>Family plan</strong></td>
                <td>Yes — household OS</td>
                <td>Single-user</td>
                <td>Single-user</td>
                <td>Single-account</td>
                <td>Single-user</td>
              </tr>
              <tr>
                <td><strong>Free tier</strong></td>
                <td>Yes — calculator unsigned</td>
                <td>Limited</td>
                <td>Account minimum</td>
                <td>Fund minimums</td>
                <td>Limited</td>
              </tr>
              <tr>
                <td><strong>Pricing (paid)</strong></td>
                <td>Plus $9.99/mo · Family $14.99/mo</td>
                <td>Premium ~$10/mo</td>
                <td>0.49% AUM (varies)</td>
                <td>Fund expense ratios</td>
                <td>Free + premium</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Pick by what you need</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Zakat clarity + budgeting + faraid in one place:</strong> Barakah. Designed as a household OS, not a single-feature tool.</li>
            <li><strong>Halal stock screening only:</strong> Zoya is the most well-known dedicated stock-screening app. Musaffa is similar.</li>
            <li><strong>Auto-investing in halal funds:</strong> Wahed (robo-advisor) or Saturna&apos;s Amana mutual funds (longer track record).</li>
            <li><strong>Multiple users in the same household:</strong> Barakah Family is the only Family plan in this set.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Single-page comparisons</h2>
          <ul className="grid grid-cols-2 gap-2 text-base">
            <li>· <Link href="/compare/barakah-vs-zoya" className="text-[#1B5E20] underline">Barakah vs Zoya</Link></li>
            <li>· <Link href="/compare/barakah-vs-wahed" className="text-[#1B5E20] underline">Barakah vs Wahed</Link></li>
            <li>· <Link href="/compare/barakah-vs-saturna" className="text-[#1B5E20] underline">Barakah vs Saturna</Link></li>
            <li>· <Link href="/compare/barakah-vs-musaffa" className="text-[#1B5E20] underline">Barakah vs Musaffa</Link></li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Try Barakah free</h2>
          <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the free zakat calculator →
          </Link>
        </section>
      </div>
    </main>
  );
}
