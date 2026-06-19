import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

/**
 * /about/founder
 *
 * Named-human trust signal. The overnight readiness audit flagged that
 * Barakah cites scholarly references (AMJA, AAOIFI, etc.) honestly and
 * keeps an honest empty Scholar Board, but the founder's own bio was
 * stripped from the home page in phase-20 (Apr 30, homepage-v2). This
 * page is the deeper version — the home page now has the photo + summary,
 * this page has the longer story.
 *
 * Bio facts sourced from the pre-phase-20 home page (commit df66854,
 * Apr 13). LinkedIn link still pending.
 */

export const metadata: Metadata = {
  title: 'Meet the Founder of Barakah | Basiru Jallow',
  description:
    'Barakah is built by a halal-finance founder. Read about Basiru Jallow — background, motivation, and accountability for the methodology behind every calculation.',
  alternates: {
    canonical: 'https://trybarakah.com/about/founder',
  },
  openGraph: {
    title: 'Meet the Founder of Barakah | Basiru Jallow',
    description: 'Why Barakah exists and who you are trusting with your fiqh-aware finances.',
    url: 'https://trybarakah.com/about/founder',
    siteName: 'Barakah',
    type: 'profile',
  },
};

export default function FounderPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/trust" className="hover:text-[#1B5E20]">Trust</Link>
          {' / '}
          <span className="text-gray-700">Founder</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Meet the founder
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Barakah is built by Basiru Jallow. Below is a public statement of who I
          am and why this exists, so you know who you&apos;re trusting with the
          methodology behind every zakat number.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#1B5E20]/20">
              <Image
                src="/basiru-jallow.png"
                alt="Basiru Jallow, founder of Barakah"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Basiru Jallow</h2>
              <p className="text-sm text-[#1B5E20] font-semibold mt-1">Founder &amp; Senior Security Engineer · Barakah</p>
              <p className="text-base text-gray-700 mt-4">
                10+ years in enterprise cybersecurity and identity and access
                management. Former Senior SailPoint Developer at Deloitte GPS
                supporting the Social Security Administration, IAM engineering at
                Navient, and cybersecurity lead at CBRE Group (Fortune 200).
                Full-stack engineer across Java, Python, TypeScript, and Flutter.
                Built Barakah to give Muslim households the same caliber of secure,
                well-engineered financial tools that Fortune 500 companies rely on —
                with security practices from the identity and access management industry.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Why Barakah exists
          </h2>
          <p className="text-base text-gray-700 mb-3">
            Most personal-finance apps assume an interest-bearing world. Most
            zakat tools are spreadsheets that don&apos;t track the lunar year.
            Most Islamic-finance apps focus on one thing — investing, or
            zakat, or budgeting — and leave the household to stitch them
            together.
          </p>
          <p className="text-base text-gray-700 italic border-l-2 border-[#1B5E20]/30 pl-4 my-4">
            &ldquo;Barakah exists because every other money app forgot the Muslim
            household. Zakat is not a side feature; halal is not a filter.
            We&apos;re building the financial home our families actually need.&rdquo;
          </p>
          <p className="text-base text-gray-700">
            Barakah is the single trusted system where a Muslim family budgets,
            tracks, purifies, gives, invests, and plans — under the same fiqh
            assumptions, with explicit methodology.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Islamic studies engagement
          </h2>
          <p className="text-base text-gray-700 mb-3">
            I am an engineer, not a scholar. The methodology behind Barakah is
            sourced from published references — AMJA resolutions, AAOIFI Standard
            21, the Quran, classical hadith, and the four Sunni madhabs — with
            independent scholar review slated on a per-feature basis as our{' '}
            <Link href="/scholars" className="underline text-[#1B5E20]">
              Scholar Board
            </Link>
            {' '}fills out (target: Q3 2026).
          </p>
          <p className="text-base text-gray-700">
            Where there is scholarly disagreement, Barakah surfaces the
            assumptions instead of hiding them — see our{' '}
            <Link href="/methodology" className="underline text-[#1B5E20]">
              methodology page
            </Link>
            {' '}for every position the product takes and the source it&apos;s
            grounded in.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Accountability
          </h2>
          <p className="text-base text-gray-700 mb-3">
            My name is on the site, the App Store listing, the Play Store listing,
            and the company. If a calculation looks wrong, an Islamic finance claim
            is overconfident, or a feature feels off, the buck stops with me.
          </p>
          <p className="text-base text-gray-700">
            Reach me at{' '}
            <a href="mailto:basiru@trybarakah.com" className="text-[#1B5E20] underline">
              basiru@trybarakah.com
            </a>
            {' '}or via the in-app feedback form. I read every message.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Where you can verify me
          </h2>
          <ul className="space-y-2 text-base text-gray-700">
            <li>
              <span className="text-gray-500">GitHub:</span>{' '}
              <a href="https://github.com/realbasirujallow" className="text-[#1B5E20] underline" rel="me">
                github.com/realbasirujallow
              </a>
            </li>
            <li>
              <span className="text-gray-500">Email:</span>{' '}
              <a href="mailto:basiru@trybarakah.com" className="text-[#1B5E20] underline">
                basiru@trybarakah.com
              </a>
            </li>
            {/* Founder TODO: add LinkedIn (and X/Twitter if active) here once those profiles
                are public. Leaving them out of v1 rather than linking a dead profile. */}
          </ul>
        </section>
      </div>
    </main>
  );
}
