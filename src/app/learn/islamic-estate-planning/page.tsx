import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Islamic Estate Planning 2026 — Wasiyyah, Faraid & Waqf Guide for Muslims | Barakah',
  description:
    'Complete guide to Islamic estate planning for Muslims in the US. Understand Wasiyyah (Islamic will), Faraid (inheritance shares), and Waqf (endowment) — and how they work together.',
  keywords: [
    'islamic estate planning',
    'muslim estate planning',
    'wasiyyah',
    'faraid',
    'islamic inheritance',
    'halal estate planning',
    'muslim will',
    'islamic will usa',
    'faraid calculator',
    'waqf',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-estate-planning' },
  openGraph: {
    title: 'Islamic Estate Planning 2026 — Wasiyyah, Faraid & Waqf Guide for Muslims',
    description: 'Complete guide to Islamic estate planning for Muslims in the US. Understand Wasiyyah, Faraid, and Waqf — and how they work together.',
    url: 'https://trybarakah.com/learn/islamic-estate-planning',
    siteName: 'Barakah',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Islamic Estate Planning 2026 — Wasiyyah, Faraid & Waqf Guide for Muslims | Barakah', item: 'https://trybarakah.com/learn/islamic-estate-planning' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Islamic Estate Planning 2026 — Wasiyyah, Faraid & Waqf Guide for Muslims',
  description: 'Complete guide to Islamic estate planning for Muslims in the US. Understand Wasiyyah (Islamic will), Faraid (inheritance shares), and Waqf (endowment) — and how they work together.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-04-01',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/islamic-estate-planning' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do Muslims need a separate Islamic will?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, a standard will is not sufficient for Islamic estate planning. A regular will lets you distribute assets as you choose, but Islam requires Faraid (fixed shares) for specific heirs. You need a Wasiyyah that acknowledges Faraid obligations and separately handles the discretionary 1/3 portion. Some Muslim attorneys draft a dual-purpose document that is valid under state law AND incorporates Islamic inheritance principles.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if a Muslim dies without a will in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Without a will, US intestacy laws apply — which are very different from Faraid. For example, US law may give 100% to a surviving spouse, while Faraid would give the spouse 1/4 or 1/8 (depending on children) with the remainder to children. Without a Wasiyyah, there is also no mechanism to make charitable donations or care for non-heir dependents. Dying without an Islamic will (wasiyyah) is considered a serious oversight in Islamic jurisprudence.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can 401(k) and life insurance proceeds follow Islamic inheritance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Retirement accounts and life insurance policies pass via beneficiary designation, not your will. This means they can easily bypass Faraid. One approach: name your estate as the beneficiary (though this has tax implications), then distribute via your will. Another: consult a Muslim financial planner to structure designations that approximate Faraid shares while preserving tax efficiency.',
      },
    },
  ],
};

export default function IslamicEstatePlanningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">

          {/* Breadcrumb */}

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">ISLAMIC ESTATE PLANNING</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Islamic Estate Planning 2026 — Wasiyyah, Faraid &amp; Waqf Guide for Muslims
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              The Prophet Muhammad (PBUH) said: &ldquo;It is not right for a Muslim who has something to bequeath to let two nights pass without having written a will.&rdquo; (Bukhari &amp; Muslim). Yet most Muslims in the US die without an Islamic estate plan — leaving their families exposed to US intestacy laws that bear no resemblance to Faraid. This guide explains how Islamic estate planning works, the three pillars of a complete plan, and how to get started.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Updated April 2026</span>
              <span>10 min read</span>
              <span>Not legal advice — consult a qualified Muslim attorney</span>
            </div>
          </header>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">What Is Islamic Estate Planning?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Islamic estate planning is the process of distributing your wealth after death in a way that satisfies both Islamic law (Sharia) and civil law in your country. It goes beyond a standard will because Islam has a detailed inheritance system — <strong>Faraid</strong> — that pre-determines shares for specific heirs, and a customizable bequest system — <strong>Wasiyyah</strong> — for the remaining one-third of the estate. A proper Islamic estate plan typically includes three interlocking components:
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { title: 'Wasiyyah', sub: 'Islamic Will', detail: 'Your bequest covering up to 1/3 of your estate for people and causes outside Faraid heirs.' },
                { title: 'Faraid', sub: 'Islamic Inheritance', detail: 'Quranic fixed shares for parents, spouse, children, and other relatives — these cannot be changed.' },
                { title: 'Waqf', sub: 'Charitable Endowment', detail: 'A permanent dedication of an asset to an Islamic cause — the income benefits the cause while the principal remains intact.' },
              ].map((item) => (
                <div key={item.title} className="border border-green-200 rounded-xl p-4 text-center bg-green-50">
                  <p className="font-bold text-green-800 text-lg">{item.title}</p>
                  <p className="text-green-600 text-xs mb-2">{item.sub}</p>
                  <p className="text-gray-700 text-sm dark:text-gray-300">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Unlike secular estate planning — which gives you nearly unlimited discretion over your assets — Islamic estate planning operates within Sharia boundaries. These boundaries are not restrictions but protections: they ensure that no heir is unfairly disinherited, outstanding debts are paid first, and charitable legacy is preserved through Waqf.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">The Three Pillars: Wasiyyah, Faraid, and Waqf</h2>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-2xl overflow-hidden dark:border-gray-700">
                <div className="bg-green-700 text-white px-5 py-4">
                  <h3 className="font-bold text-lg">1. Wasiyyah — Your Islamic Will</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 dark:text-gray-300">
                    The Wasiyyah is your Islamic will. It governs up to <strong>one-third</strong> of your net estate (after debts are paid) and allows you to direct assets to people and causes not covered by Faraid — non-Muslim relatives, stepchildren, friends, charitable organizations, or waqf endowments.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    The Prophet (PBUH) said: &ldquo;It is not right for a Muslim who has something to bequeath to let two nights pass without having written a will.&rdquo; Many scholars consider writing a Wasiyyah obligatory (wajib) if you have significant assets or dependents who might otherwise be left unprotected.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden dark:border-gray-700">
                <div className="bg-green-700 text-white px-5 py-4">
                  <h3 className="font-bold text-lg">2. Faraid — Islamic Inheritance Law</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 dark:text-gray-300">
                    Faraid is the system of fixed inheritance shares derived directly from the Quran (Surah An-Nisa, 4:11–12). These shares are not negotiable — they are Quranic obligations that apply automatically upon death, regardless of what a will says. The Wasiyyah cannot override Faraid for eligible heirs.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    Example: A $500,000 estate with a surviving wife, two sons, and one daughter would be distributed as follows — wife receives 1/8 ($62,500), and the remaining 7/8 ($437,500) goes to the children with sons receiving double a daughter&apos;s share (each son: ~$145,833; daughter: ~$72,917). These amounts cannot be altered by the Wasiyyah.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden dark:border-gray-700">
                <div className="bg-green-700 text-white px-5 py-4">
                  <h3 className="font-bold text-lg">3. Waqf — Permanent Charitable Endowment</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 dark:text-gray-300">
                    A Waqf is a charitable endowment where you permanently dedicate an asset — cash, property, or a business interest — to an Islamic cause. The asset itself cannot be sold or transferred; only its income or benefit flows to the designated cause. A Waqf continues generating charity long after your death, earning you Sadaqah al-Jariyah (ongoing reward).
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
                    Common Waqf uses: funding a mosque, supporting Islamic education, maintaining a well or water project, providing for a madrasa. The Waqf can be set up during your lifetime (Waqf al-ahya) or activated upon your death through your Wasiyyah (Waqf al-wasiyya).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Common Estate Planning Mistakes Muslims Make</h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              Most Muslims in the US are unaware of how dramatically US default laws conflict with Islamic inheritance. These are the five most dangerous mistakes — each capable of completely derailing your Islamic estate plan.
            </p>
            <div className="space-y-4">
              {[
                {
                  num: '01',
                  title: 'Relying only on a US will that ignores Faraid',
                  detail: 'A standard US will lets you direct 100% of your estate to anyone you choose — but this directly violates Faraid obligations. A US will that says "I leave everything to my spouse" is legally valid but Islamically impermissible if you have children, parents, or other Faraid heirs.',
                },
                {
                  num: '02',
                  title: 'Joint tenancy with right of survivorship',
                  detail: 'Many couples hold property as "joint tenants with right of survivorship" (JTWROS), which means the surviving spouse automatically inherits 100% — bypassing Faraid entirely. Muslim estate planning attorneys often recommend converting to "tenants in common" so each share passes through the estate and can follow Faraid.',
                },
                {
                  num: '03',
                  title: 'Beneficiary designations that bypass Faraid',
                  detail: '401(k), IRA, and life insurance proceeds pass directly to named beneficiaries — completely outside your will and Faraid. If you name only your spouse, your children and parents receive nothing from those assets. Review all beneficiary designations with a Muslim financial planner.',
                },
                {
                  num: '04',
                  title: 'Not specifying Islamic funeral preferences',
                  detail: 'Without written instructions, hospitals and funeral homes default to local norms. Specify: ghusl by a Muslim, no embalming, burial within 24 hours if possible, no cremation, salat al-janazah before burial. These instructions belong in your Wasiyyah and in a separate healthcare directive.',
                },
                {
                  num: '05',
                  title: 'Not documenting outstanding debts',
                  detail: 'In Islam, all debts — including unpaid zakat, unfulfilled kaffarah, outstanding loans — must be paid before any inheritance is distributed. If your executor does not know about these debts, they may distribute the estate before obligations are cleared, which is a significant sin.',
                },
              ].map((item) => (
                <div key={item.num} className="flex gap-4 border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <div className="flex-shrink-0 text-2xl font-bold text-gray-200">{item.num}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-gray-100">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">How to Start Your Islamic Estate Plan</h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              Islamic estate planning does not need to be overwhelming. These five steps create a complete, Sharia-compliant plan that also holds up in US courts.
            </p>
            <ol className="space-y-5">
              {[
                { step: 1, title: 'Calculate your Faraid shares', detail: 'Use a Faraid calculator to determine the exact Islamic inheritance shares for your specific family structure. The shares differ based on who is alive — spouse, children, parents, siblings all affect the calculation.' },
                { step: 2, title: 'Write your Wasiyyah (up to 1/3 of estate)', detail: 'Draft your Wasiyyah covering the discretionary 1/3 of your estate. This is where you can care for non-Faraid dependents, make charitable bequests, and establish or fund a Waqf. Work with a Muslim attorney to make it legally enforceable.' },
                { step: 3, title: 'Update beneficiary designations', detail: 'Review every 401(k), IRA, pension, and life insurance policy. Update beneficiaries to reflect your Islamic intent — either by naming multiple heirs with appropriate percentages or by naming your estate (with tax advice from an accountant).' },
                { step: 4, title: 'Consult a Muslim estate planning attorney', detail: 'A Muslim attorney specializing in Islamic estate planning can draft a dual-purpose document valid under US state law that also incorporates Islamic inheritance principles. They know how to structure trusts and deeds to avoid JTWROS traps.' },
                { step: 5, title: 'Store documents and inform your executor', detail: 'Keep your Wasiyyah, Faraid calculation, beneficiary change forms, and funeral instructions in a secure but accessible location. Tell your executor (wasi) exactly where these documents are. Consider a digital copy with a trusted family member.' },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-gray-100">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Ramadan email capture */}
          <RamadanEmailCapture source="learn-islamic-estate-planning" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Plan Your Islamic Estate — Free</h2>
            <p className="text-green-100 mb-6">Use Barakah&apos;s Faraid Calculator to determine your family&apos;s exact Islamic inheritance shares — the first step in a complete Islamic estate plan.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">Start Free — No Card Needed</Link>
              <Link href="/faraid-calculator" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">Try Faraid Calculator</Link>
            </div>
          </div>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/islamic-will-template', title: 'Islamic Will Template', desc: 'What to include in your Wasiyyah and how to make it legally valid.' },
                { href: '/learn/zakat-on-retirement-accounts', title: 'Zakat on Retirement Accounts', desc: 'How 401(k) and IRA interact with your annual zakat obligation.' },
                { href: '/learn/what-is-zakat', title: 'What Is Zakat?', desc: 'The complete guide to the third pillar of Islam.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700">
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/wassiyah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Wassiyah →</Link>
              <Link href="/fiqh-terms/faraid" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Faraid →</Link>
              <Link href="/fiqh-terms/waqf" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Waqf →</Link>
              <Link href="/fiqh-terms/hibah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hibah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
