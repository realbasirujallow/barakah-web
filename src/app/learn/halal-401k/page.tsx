import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal 401(k) Options in the US 2026: HR Template + Fund Guide | Barakah',
  description:
    "Can you have a halal 401(k) in the US? Usually yes — with the right fund selection or employer conversation. Complete guide with ShariaPortfolio, Amana, Guidestone options + an email template to send HR.",
  keywords: [
    'halal 401k',
    'halal 401k options',
    'halal retirement account',
    'shariah compliant 401k',
    'how to have halal 401k',
    'shariaportfolio 401k',
    'amana mutual funds 401k',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/halal-401k',
  },
  openGraph: {
    title: 'Halal 401(k) Options in the US 2026: HR Template + Fund Guide | Barakah',
    description: 'Can you have a halal 401(k)? Yes — with the right fund selection or employer conversation.',
    url: 'https://trybarakah.com/learn/halal-401k',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I have a halal 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, with some caveats. Your 401(k) plan must offer at least one Shariah-compliant fund (which most default plans do not). You have three realistic paths: (1) ask your HR to add halal funds to the plan menu — usually ShariaPortfolio, Amana Mutual Funds, or Guidestone, all of which are designed to be accessible through 401(k) recordkeepers. (2) Contribute enough to capture any employer match, then roll over to a self-directed IRA. (3) If neither is available, some scholars permit contributing to any available fund and then purifying the haram portion when you withdraw — this is a minority view that not every scholar accepts.',
      },
    },
    {
      '@type': 'Question',
      name: 'What funds are halal for 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The three providers most 401(k) plans can add without friction: (1) ShariaPortfolio — manages 401(k)-accessible Shariah-compliant portfolios; (2) Amana Mutual Funds (Saturna Capital) — four funds including Amana Income (AMANX), Growth (AMAGX), Developing World (AMDWX), and Participation (sukuk/AMAPX); (3) Guidestone Funds — Christian-values-screened funds overlap significantly with halal screening though not identical. HLAL and SPUS ETFs are usually NOT available in 401(k) plans without employer setup — save those for IRAs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay zakat on my 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, but the methodology is madhab-sensitive. Three scholarly positions: (1) Full accessible value (majority/AMJA) — zakat 2.5% on the current balance minus estimated early-withdrawal penalty (10% IRS) and ordinary income tax. (2) Employer match only — zakat only on the employer-matched portion if vested, not on your own contributions until accessed. (3) On withdrawal only — zakat only applies when you actually receive the money post-retirement. Barakah's retirement zakat calculator supports all three and defaults to AMJA. Our state-tax service accounts for your state's income-tax treatment so the accessible-value calculation is accurate.",
      },
    },
    {
      '@type': 'Question',
      name: 'What about interest earned in a conventional 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If your 401(k) has any fixed-income holdings (bond funds, stable-value funds, money market), the interest portion is riba-adjacent. Most scholars require you to either (1) move to Shariah-compliant alternatives as soon as possible, (2) purify interest earned by donating it to charity at each year-end, or (3) a combination. Barakah flags interest-bearing holdings in your /dashboard/halal portfolio view when you link your 401(k) via Plaid.',
      },
    },
  ],
};

const hrTemplate = `Subject: Request to Add Shariah-Compliant Fund Options to Our 401(k) Plan

Hi [HR Contact],

I'm writing to formally request that our 401(k) plan menu include at least one Shariah-compliant (halal) investment option. Several of our Muslim colleagues — and I — are currently unable to fully utilize our 401(k) benefits because the existing menu doesn't include funds that meet Islamic investment guidelines.

Three commonly-adopted Shariah-compliant fund families are designed to plug into existing 401(k) recordkeepers:

1. Amana Mutual Funds (Saturna Capital) — AMANX (Income), AMAGX (Growth), AMDWX (Developing World), AMAPX (Participation/sukuk). Founded 1986; one of the oldest halal fund families in the US.

2. ShariaPortfolio — specializes in Shariah-compliant 401(k) plan integrations with major recordkeepers (Empower, Fidelity, Vanguard).

3. Guidestone Funds — religiously-screened funds with significant overlap in exclusions.

Adding one or more of these to the plan menu would let Muslim employees (and, frankly, anyone with values-aligned investing preferences) participate fully in our retirement benefit. It doesn't change the plan for anyone else.

Would you be open to raising this with our plan administrator / fiduciary committee? Happy to share more background or forward sources.

Thank you for considering.

[Your name]`;

export default function Halal401kPage() {
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
              <span className="text-gray-900">Halal 401(k)</span>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
              Halal 401(k) Options in the US 2026
            </h1>
            <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

            <p className="text-lg leading-8 text-gray-800 mb-6">
              The 401(k) is America&apos;s default retirement account. For Muslim employees it&apos;s
              also America&apos;s most frustrating benefit — most 401(k) plans offer no halal
              options, forcing you to either invest in non-compliant funds or leave employer-match
              money on the table. The good news: this is fixable. Three concrete paths below, plus
              a template email you can send HR tonight.
            </p>

            {/* Three paths */}
            <section className="mb-10 space-y-4">
              <h2 className="text-3xl font-bold text-[#1B5E20]">Your three real options</h2>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#1B5E20]">1. Ask HR to add halal funds to the plan</h3>
                <p className="mb-3 text-sm leading-7 text-gray-800">
                  Most 401(k) plans can add a new fund to the menu within 60–90 days if the plan
                  fiduciary approves. Three providers integrate with major recordkeepers (Empower,
                  Fidelity, Vanguard, Principal): <strong>Amana Mutual Funds</strong> (Saturna
                  Capital), <strong>ShariaPortfolio</strong>, and — if your plan uses Guidestone
                  — their values-screened funds which overlap significantly with halal screening.
                </p>
                <p className="mb-3 text-sm leading-7 text-gray-800">
                  The template email below is the one to send. Most HR teams respond favorably
                  because it&apos;s a reasonable request, doesn&apos;t change the plan for anyone
                  else, and signals that Muslim employees aren&apos;t fully utilizing the benefit.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#1B5E20]">2. Match + rollover strategy</h3>
                <p className="text-sm leading-7 text-gray-800">
                  Contribute just enough to your 401(k) to capture the full employer match (most
                  common: 3–6% of salary matched dollar-for-dollar or 50% match). Put that amount
                  in whatever the <em>least-bad</em> option is — typically a broad-market index
                  fund that you&apos;ll later purify. Then invest the rest of your retirement
                  allocation in a self-directed IRA where you have access to SPUS, HLAL, UMMA,
                  SPSK, and Amana funds. When you change jobs, roll over the 401(k) balance into
                  the IRA and invest it into halal funds. See{' '}
                  <Link href="/learn/halal-etfs" className="text-[#1B5E20] underline hover:no-underline">halal ETFs</Link>{' '}
                  for IRA allocation ideas.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#1B5E20]">3. Contribute + purify (minority view)</h3>
                <p className="text-sm leading-7 text-gray-800">
                  A minority scholarly view permits contributing to any available fund and
                  purifying the haram portion at year-end (donating the prohibited revenue&apos;s
                  proportional share to charity). This view is not universally accepted — AMJA
                  generally discourages it for ongoing contributions, but some scholars permit it
                  for employees who would otherwise miss out on substantial employer match. Check
                  with your own qualified scholar before relying on this path.
                </p>
              </div>
            </section>

            {/* HR Template */}
            <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
              <h2 className="mb-4 text-2xl font-bold text-amber-900">Template: email to send HR</h2>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-xs leading-6 text-gray-800 font-mono">{hrTemplate}</pre>
              <p className="mt-4 text-sm italic text-amber-900">
                Copy, personalize the brackets, send. Response rate from Muslim community members
                who&apos;ve used similar templates: high.
              </p>
            </section>

            {/* Zakat on 401k */}
            <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">What about zakat on your 401(k)?</h2>
              <p className="mb-3 text-sm leading-7 text-gray-800">
                Zakat on retirement accounts is one of the most madhab-sensitive zakat topics.
                Three scholarly positions are in common use:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-sm leading-7 text-gray-800">
                <li><strong>Full accessible value (majority, AMJA default in Barakah):</strong> 2.5% zakat annually on your 401(k) balance minus estimated early-withdrawal penalty (10% IRS) and ordinary income tax.</li>
                <li><strong>Employer match only:</strong> zakat only on the employer-matched portion once vested; your own contributions are treated as inaccessible until retirement.</li>
                <li><strong>On withdrawal only:</strong> zakat only when you actually receive retirement income.</li>
              </ul>
              <p className="mt-3 text-sm leading-7 text-gray-800">
                Barakah&apos;s retirement-zakat engine supports all three methodologies via the
                Fiqh Settings toggle and uses our state-tax service to compute the accessible
                value accurately. See{' '}
                <Link href="/learn/zakat-on-401k" className="text-[#1B5E20] underline hover:no-underline">
                  zakat on 401(k) full guide
                </Link>.
              </p>
            </section>

            {/* Related */}
            <section className="mb-10 rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-4 text-2xl font-bold">Related guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/learn/halal-etfs" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Halal ETFs →</strong>
                  <p className="mt-1 text-sm text-green-100">SPUS, HLAL, UMMA, IGDA, SPSK comparison.</p>
                </Link>
                <Link href="/learn/zakat-on-401k" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Zakat on 401(k) →</strong>
                  <p className="mt-1 text-sm text-green-100">Full zakat methodology breakdown.</p>
                </Link>
                <Link href="/learn/halal-investing-guide" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Halal investing guide →</strong>
                  <p className="mt-1 text-sm text-green-100">The complete Muslim investor playbook.</p>
                </Link>
                <Link href="/learn/nisab" className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                  <strong>Nisab threshold →</strong>
                  <p className="mt-1 text-sm text-green-100">How much wealth before zakat applies.</p>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
