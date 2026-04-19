import type { Metadata } from 'next';
import Link from 'next/link';
import VerifyHashInput from './VerifyHashInput';

export const metadata: Metadata = {
  title: 'Verify a Zakat Snapshot Hash | Barakah',
  description:
    'Every zakat calculation in Barakah produces a SHA-256 integrity hash. Paste a hash to verify the calculation is authentic and see the methodology + inputs that produced it.',
  keywords: [
    'barakah integrity hash',
    'zakat verify',
    'zakat snapshot audit',
    'barakah audit trail',
    'zakat hash check',
  ],
  alternates: { canonical: 'https://trybarakah.com/verify' },
  openGraph: {
    title: 'Verify a Zakat Snapshot Hash | Barakah',
    description: 'Paste a Barakah integrity hash to verify a zakat calculation.',
    url: 'https://trybarakah.com/verify',
    type: 'website',
  },
};

export default function VerifyIndexPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/methodology" className="text-sm text-[#1B5E20] font-medium hover:underline">Methodology</Link>
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Verify</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Verify a zakat snapshot</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-base leading-7 text-gray-800 mb-4">
              Every zakat calculation in Barakah produces a SHA-256 integrity hash that commits to
              the complete set of inputs and methodology settings used. Paste a hash below to
              reproduce the calculation independently — either here or against the published
              reference implementation on GitHub.
            </p>
            <VerifyHashInput />
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">What the hash commits to</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Each snapshot hash is computed over a canonical JSON representation of:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Every asset value at the snapshot moment (cash, gold, silver, stocks, 401k, crypto, business, rental)</li>
              <li>Every liability deducted (zakatable debts due within the hawl)</li>
              <li>The exact <Link href="/fiqh-terms/nisab" className="text-[#1B5E20] underline">nisab</Link> thresholds in your currency (gold + silver) at that instant</li>
              <li>The nisab methodology selected (AMJA-gold, Classical-silver, Lower-of-Two)</li>
              <li>The <Link href="/fiqh-terms/hawl" className="text-[#1B5E20] underline">hawl</Link> madhab reset rule applied (Hanafi, Maliki, Shafi&apos;i, Hanbali)</li>
              <li>The fiqh toggles you set (jewellery inclusion, retirement-account rule, etc.)</li>
              <li>The final <Link href="/fiqh-terms/zakat" className="text-[#1B5E20] underline">zakat</Link> amount at 2.5% of zakatable wealth above the applicable nisab</li>
            </ul>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Why this matters</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Islamic finance has historically depended on the trustworthiness of the scholar or
              institution computing your zakat. That trust is irreplaceable, but it&apos;s also
              unfalsifiable after the fact — you have no way to re-check last year&apos;s calculation
              if the methodology silently changed.
            </p>
            <p className="text-base leading-7 text-gray-800">
              An integrity hash is cryptographic proof that the calculation you saw is the
              calculation that ran. Change a single input by 1 cent, change the nisab methodology,
              change a fiqh toggle — and the hash changes completely. You (or anyone) can verify the
              hash against the same inputs years later and get the same number — or see immediately
              that something was altered.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">Backend verification endpoint</h2>
            <p className="text-sm leading-7 text-amber-900">
              Today the public-verify endpoint is in beta. If the page above shows &quot;backend
              integration pending&quot;, the reference implementation is in the{' '}
              <a
                href="https://github.com/realbasirujallow/barakah-backend/tree/main/docs/integrity"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                barakah-backend repo
              </a>{' '}
              — you can recompute the hash locally from the snapshot JSON and compare.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Methodology transparency</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Every methodology change Barakah makes is logged in the public changelog — with the
              date, reason, scholars consulted, and effective-date for existing users. Combined with
              the per-snapshot integrity hash, you can reconstruct the exact fiqh config that
              produced any past zakat calculation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/methodology" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
                Methodology →
              </Link>
              <Link href="/methodology/changelog" className="inline-flex items-center justify-center rounded-xl border border-white px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#1B5E20]">
                Changelog →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
