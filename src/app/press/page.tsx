import type { Metadata } from 'next';
import Link from 'next/link';
import { PRICING } from '../../lib/pricing';

export const metadata: Metadata = {
  title: 'Press & Media Kit | Barakah Islamic Finance',
  description:
    'Press resources for Barakah — the Muslim-household financial OS covering zakat, hawl, halal investing, riba detection, faraid, and wasiyyah in one app.',
  alternates: { canonical: 'https://trybarakah.com/press' },
  openGraph: {
    title: 'Press & Media Kit | Barakah',
    description: 'Press resources, fact sheet, screenshots, and founder contact for Barakah Islamic Finance.',
    url: 'https://trybarakah.com/press',
    type: 'website',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630, alt: 'Barakah press kit' }],
  },
};

const PLUS = `${PRICING.plus.monthly}${PRICING.plus.monthlyPeriod}`;
const FAMILY = `${PRICING.family.monthly}${PRICING.family.monthlyPeriod}`;

export default function PressPage() {
  return (
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
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Press</span>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Press & Media Kit</h1>
          <p className="text-lg text-gray-700 mb-8">For journalists, podcasters, and partners covering Muslim fintech.</p>

          {/* ── 30-Second Pitch ──────────────────────────────────── */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">30-second pitch</h2>
            <p className="text-base leading-7 text-gray-800">
              Barakah is the financial OS Muslim households have been building on spreadsheets for decades — now in one
              app. Zakat (multi-asset), hawl tracking, halal stock screening (30,000+ tickers, AAOIFI Standard 21),
              automatic riba detection, faraid calculator, wasiyyah builder, waqf ledger, and a Family plan covering
              up to 6 members. Iif Monarch and Mint forgot Muslims exist, Barakah is what they would have built if
              they hadn&apos;t. Live on iOS, Android, and the web.
            </p>
          </section>

          {/* ── Fast Facts ────────────────────────────────────────── */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Fast facts</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Founded', '2026'],
                ['Headquarters', 'Remote — US-incorporated'],
                ['Founder', 'Basiru Jallow (cybersecurity professional)'],
                ['Team size', 'Founder-led'],
                ['Platforms', 'iOS · Android · Web'],
                ['Languages', 'English · Arabic · Urdu · French'],
                ['Pricing', `Free · Plus ${PLUS} · Family ${FAMILY}`],
                ['Free trial', '30 days of Plus, no credit card'],
                ['Bank coverage', 'Plaid (12,000+ US institutions)'],
                ['Stock screener size', '30,000+ tickers, daily AAOIFI re-screen'],
                ['Fiqh schools supported', 'Hanafi · Shafi&apos;i · Maliki · Hanbali · General'],
                ['Privacy', 'No data sold; AES-256 for bank secrets; TLS 1.2+ in transit'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{k}</dt>
                  <dd className="text-sm text-gray-800 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Why It Matters ───────────────────────────────────── */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Why it matters</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Underserved market:</strong> 1.9 billion Muslims globally, ~3.5 million in the US. Mainstream personal-finance apps treat interest as ordinary income, can&apos;t screen a stock for halal status, and have no concept of zakat or hawl.</li>
              <li><strong>Trust + religious obligation:</strong> Zakat is one of the five pillars of Islam. Getting the calculation wrong has spiritual weight. Barakah&apos;s zakat figure is the same number across web, iOS, Android, and email.</li>
              <li><strong>Daily auto-rescreen:</strong> Stock halal status changes when financial ratios cross AAOIFI thresholds. Barakah re-checks every holding daily and notifies users if a stock flips.</li>
              <li><strong>Multi-madhab:</strong> Hanafi nisab uses silver; Shafi&apos;i/Maliki/Hanbali use gold. Barakah honors the user&apos;s chosen school in every calculation.</li>
              <li><strong>Family-first:</strong> Family plan ($14.99/mo or $119/yr) covers up to 6 household members with shared budgets, shared zakat tracking, and shared estate-plan visibility — built for the multigenerational Muslim home.</li>
            </ul>
          </section>

          {/* ── Quotes ───────────────────────────────────────────── */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Quotes from the founder</h2>
            <blockquote className="border-l-4 border-[#1B5E20] pl-4 text-base leading-7 text-gray-800 italic mb-4">
              &ldquo;Every Muslim I know has a spreadsheet they update every Ramadan to estimate their zakat. The math
              is hard, the rules differ by madhab, and the prices change daily. Barakah is what those spreadsheets
              wanted to be when they grew up.&rdquo;
            </blockquote>
            <blockquote className="border-l-4 border-[#1B5E20] pl-4 text-base leading-7 text-gray-800 italic mb-4">
              &ldquo;We don&apos;t sell data. We don&apos;t do interest. We don&apos;t take ad money. We charge a fair price and we
              answer to the deen first.&rdquo;
            </blockquote>
            <blockquote className="border-l-4 border-[#1B5E20] pl-4 text-base leading-7 text-gray-800 italic">
              &ldquo;Personal finance for Muslim households shouldn&apos;t require a side career as a fiqh student. The app
              should know the rules. The user should just live.&rdquo;
            </blockquote>
          </section>

          {/* ── Logos & Brand ───────────────────────────────────── */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Logos & brand assets</h2>
            <p className="mb-4 text-sm text-gray-600">For digital and print use. Don&apos;t modify, recolor, or stretch.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <a href="/icon.png" download className="block rounded-xl border border-gray-200 p-6 text-center hover:bg-gray-50">
                <p className="text-3xl mb-2">🌙</p>
                <p className="text-xs font-medium text-gray-700">Barakah icon (PNG)</p>
              </a>
              <a href="/og-image.png" download className="block rounded-xl border border-gray-200 p-6 text-center hover:bg-gray-50">
                <p className="text-3xl mb-2">🖼️</p>
                <p className="text-xs font-medium text-gray-700">Open-graph card (PNG)</p>
              </a>
              <a href="/apple-touch-icon.png" download className="block rounded-xl border border-gray-200 p-6 text-center hover:bg-gray-50">
                <p className="text-3xl mb-2">📱</p>
                <p className="text-xs font-medium text-gray-700">App touch icon (PNG)</p>
              </a>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-[#1B5E20] text-white p-3 rounded-lg">
                <p className="text-xs uppercase tracking-wide opacity-70">Primary green</p>
                <p className="font-mono font-semibold">#1B5E20</p>
              </div>
              <div className="bg-[#FFF8E1] border border-gray-200 p-3 rounded-lg">
                <p className="text-xs uppercase tracking-wide text-gray-500">Cream background</p>
                <p className="font-mono font-semibold text-gray-800">#FFF8E1</p>
              </div>
            </div>
          </section>

          {/* ── App Store Links ──────────────────────────────────── */}
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">App store links</h2>
            <ul className="space-y-2 text-sm">
              <li><strong>iOS:</strong> <a href="https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229" className="text-[#1B5E20] underline">apps.apple.com/us/app/barakah-islamic-finance</a></li>
              <li><strong>Android:</strong> <a href="https://play.google.com/store/apps/details?id=com.trybarakah.app" className="text-[#1B5E20] underline">play.google.com/store/apps/details?id=com.trybarakah.app</a></li>
              <li><strong>Web:</strong> <a href="https://trybarakah.com" className="text-[#1B5E20] underline">trybarakah.com</a></li>
            </ul>
          </section>

          {/* ── Contact ──────────────────────────────────────────── */}
          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Founder contact</h2>
            <p className="mb-2 text-sm leading-7 text-green-100">
              Press inquiries, podcast bookings, partnership questions:
            </p>
            <p className="mb-4 text-base font-semibold">press@trybarakah.com</p>
            <p className="text-xs text-green-200">Response within 48 hours. For urgent broadcast or print deadlines, mention &ldquo;DEADLINE&rdquo; in the subject line.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
