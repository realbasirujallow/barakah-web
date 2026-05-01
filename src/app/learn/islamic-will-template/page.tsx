import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Islamic Will Template 2026 — Wasiyyah Guide & What to Include | Barakah',
  description:
    'What to include in an Islamic will (Wasiyyah). The 1/3 rule, Faraid shares, required clauses, and how to make your will Sharia-compliant in the US.',
  keywords: [
    'islamic will template',
    'wasiyyah template',
    'muslim will template',
    'how to write islamic will',
    'wasiyyah example',
    'shariah compliant will',
    'islamic will usa',
    '1/3 rule islam',
    'faraid heirs',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-will-template' },
  openGraph: {
    title: 'Islamic Will Template 2026 — Wasiyyah Guide & What to Include',
    description: 'What to include in an Islamic will (Wasiyyah). The 1/3 rule, Faraid shares, required clauses, and how to make your will Sharia-compliant in the US.',
    url: 'https://trybarakah.com/learn/islamic-will-template',
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
    { '@type': 'ListItem', position: 3, name: 'Islamic Will Template 2026 — Wasiyyah Guide & What to Include | Barakah', item: 'https://trybarakah.com/learn/islamic-will-template' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Islamic Will Template 2026 — Wasiyyah Guide & What to Include',
  description: 'What to include in an Islamic will (Wasiyyah). The 1/3 rule, Faraid shares, required clauses, and how to make your will Sharia-compliant in the US.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-04-01',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/islamic-will-template' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the 1/3 rule in Islamic inheritance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 1/3 rule means your Wasiyyah (will) can only direct UP TO 1/3 of your net estate (after all debts are paid). This cap exists to prevent people from unfairly diverting wealth away from Faraid heirs. The remaining 2/3 (or more) must follow Faraid — the Quranic inheritance shares. This rule comes from the hadith where a companion asked the Prophet if he could give all his wealth in charity, and the Prophet replied he could give at most 1/3, saying "Even 1/3 is much."',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I leave everything to my spouse in an Islamic will?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. In Islam, you cannot override Faraid by leaving 100% to your spouse. Your spouse has a fixed Faraid share (1/4 or 1/8 depending on children). The remaining estate goes to other Faraid heirs (children, parents, siblings depending on the situation). You CAN use your 1/3 Wasiyyah portion to provide extra support for your spouse beyond their Faraid share, but you cannot cut out other legitimate Faraid heirs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who should be my executor (Wasi) in an Islamic will?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your executor (Wasi) should ideally be: (a) A Muslim who understands Islamic inheritance law; (b) Someone you trust deeply and who will survive you; (c) A person who is organized and can handle financial and legal matters; (d) Possibly a Muslim estate attorney if you do not have a suitable family member. The Wasi is responsible for paying your debts, distributing your Wasiyyah bequests, and ensuring Faraid is correctly applied.',
      },
    },
  ],
};

const faraidHeirs = [
  { heir: 'Husband', withChildren: '1/4', withoutChildren: '1/2' },
  { heir: 'Wife', withChildren: '1/8', withoutChildren: '1/4' },
  { heir: 'Son', withChildren: 'Residuary (2x daughter share)', withoutChildren: 'Residuary' },
  { heir: 'Daughter (alone)', withChildren: '1/2', withoutChildren: '1/2' },
  { heir: 'Daughters (multiple)', withChildren: '2/3 shared', withoutChildren: '2/3 shared' },
  { heir: 'Father', withChildren: '1/6 + residuary', withoutChildren: 'Residuary' },
  { heir: 'Mother', withChildren: '1/6', withoutChildren: '1/3' },
];

export default function IslamicWillTemplatePage() {
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
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">WASIYYAH GUIDE</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Islamic Will Template 2026 — Wasiyyah Guide &amp; What to Include
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              A Wasiyyah is not just a document — it is a final act of justice toward your family. This guide explains the 1/3 rule, every required clause, the Faraid shares your heirs are owed, and how to ensure your will is both Sharia-compliant and legally enforceable in the United States.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Updated April 2026</span>
              <span>10 min read</span>
              <span>Not legal advice — consult a qualified Muslim attorney</span>
            </div>
          </header>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">What Is a Wasiyyah (Islamic Will)?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              A Wasiyyah is the Islamic equivalent of a last will and testament — but it operates under strict Sharia constraints that do not exist in secular law. The most important constraint: a Wasiyyah can only cover <strong>up to one-third</strong> of your net estate after all debts are paid. The remaining two-thirds (or more) is distributed automatically by Faraid — the Quranic inheritance system.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 mb-6">
              <p className="text-amber-800 text-sm italic">
                &ldquo;A man may do good deeds for 70 years and then when he is close to death, he wrongs his heirs in his will, and so he ends up in Hell.&rdquo; — Abu Dawud
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The 1/3 cap exists to prevent a person from deliberately bypassing Faraid — for example, leaving everything to a favorite child and cutting out the others. Allah (SWT) set the Faraid shares directly in the Quran (Surah An-Nisa 4:11–12) and warned: <em>&ldquo;These are the limits set by Allah. Whoever obeys Allah and His Messenger will be admitted to Gardens... and whoever disobeys Allah and His Messenger... will be in a Fire.&rdquo;</em> (4:13–14).
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Practically speaking, the Wasiyyah is your tool to: care for dependents who are not Faraid heirs (non-Muslim relatives, stepchildren, close friends), make charitable bequests, establish or fund a Waqf (endowment), and specify Islamic funeral arrangements. It is the customizable portion of your estate — but it operates within Sharia&apos;s 1/3 ceiling.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">What to Include in Your Wasiyyah</h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              A complete Wasiyyah has six essential components. Missing any one of them creates legal or Islamic gaps that can harm your family.
            </p>
            <div className="space-y-4">
              {[
                {
                  num: '1',
                  title: 'Declaration of Islamic faith (Shahada)',
                  detail: 'Begin with the Shahada — "I bear witness that there is no god but Allah and that Muhammad is His Messenger" — and a statement that you are a Muslim writing this will in accordance with Islamic law. This establishes the Islamic intent of the document.',
                },
                {
                  num: '2',
                  title: 'Appointment of an executor (Wasi)',
                  detail: 'Name a Wasi — ideally a Muslim who understands Faraid and can manage financial and legal affairs. Name a backup executor in case your primary Wasi predeceases you or is unable to serve. The Wasi is responsible for paying debts, distributing your Wasiyyah bequests, and ensuring Faraid is correctly applied.',
                },
                {
                  num: '3',
                  title: 'Funeral and burial instructions',
                  detail: 'Specify: ghusl (ritual washing by Muslims of the same gender), kafan (Islamic shroud), salat al-janazah, burial within 24 hours where possible, and no cremation under any circumstances. State explicitly: "I do not consent to cremation, embalming, or any burial practice contrary to Islamic law."',
                },
                {
                  num: '4',
                  title: 'Debt repayment instructions',
                  detail: 'All debts must be paid before any estate is distributed. List known debts explicitly: loans, unpaid zakat (for past years), outstanding kaffarah (expiations), unfulfilled oaths, and any financial obligations to family members. Instruct your Wasi to settle all debts from the estate before distribution.',
                },
                {
                  num: '5',
                  title: 'Charitable bequests (up to 1/3)',
                  detail: 'This is the heart of your Wasiyyah. You may direct up to 1/3 of your net estate to: non-Faraid dependents (non-Muslim parents, stepchildren), charitable organizations, mosque donations, and Waqf endowments. Be specific — name the organization, the amount or percentage, and the purpose.',
                },
                {
                  num: '6',
                  title: 'Explicit reference to Faraid for the remainder',
                  detail: 'State clearly: "The remainder of my estate (after debts and Wasiyyah bequests) shall be distributed according to Faraid as prescribed in the Quran and Sunnah." This instruction, incorporated into a US-valid legal will, gives your executor legal authority to follow Faraid.',
                },
              ].map((item) => (
                <div key={item.num} className="flex gap-4 border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 dark:text-gray-100">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Faraid: Who Gets What?</h2>
            <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
              Faraid shares are fixed by the Quran — they cannot be altered by your Wasiyyah. The shares depend on which heirs are alive at the time of your death. Below are the primary Faraid heirs and their shares under standard conditions. Note: the presence or absence of children significantly changes spousal and parental shares.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 mb-6 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Heir</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Share (with children)</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Share (no children)</th>
                  </tr>
                </thead>
                <tbody>
                  {faraidHeirs.map((row, i) => (
                    <tr key={row.heir} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-semibold text-gray-900 border-b border-gray-100 dark:text-gray-100 dark:border-gray-700">{row.heir}</td>
                      <td className="p-3 text-green-700 border-b border-gray-100 dark:border-gray-700">{row.withChildren}</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100 dark:text-gray-400 dark:border-gray-700">{row.withoutChildren}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              This table covers primary scenarios only. Faraid calculations become more complex with multiple wives, grandchildren, half-siblings, and other family configurations. Always use a Faraid calculator or consult a scholar for your specific situation.
            </p>
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-2">Example: $500,000 Estate</h3>
              <p className="text-green-900 text-sm leading-relaxed">
                Deceased leaves a wife, two sons, and one daughter. Wife receives 1/8 = <strong>$62,500</strong>. Remaining $437,500 goes to children in a 2:2:1 ratio (each son double a daughter&apos;s share): each son receives <strong>~$145,833</strong>, daughter receives <strong>~$72,917</strong>. The Wasiyyah can direct up to $166,667 (1/3 of $500,000) to charity or non-Faraid recipients — but this comes out of the estate before Faraid is applied.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Making Your Islamic Will Legal in the US</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              A Wasiyyah that is spiritually valid but legally unenforceable leaves your family exposed to US intestacy laws. To be enforceable, your Islamic will must also meet your state&apos;s legal requirements for a valid will.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Written and signed', detail: 'Your will must be in writing and signed by you. Oral wills are not enforceable in most US states.' },
                { title: 'Two witnesses', detail: 'Most states require two witnesses who are not beneficiaries under the will to sign in your presence. Some states allow holographic (entirely handwritten) wills without witnesses.' },
                { title: 'Notarization', detail: 'While not required in all states, notarization creates a self-proving will — meaning the court can admit it without calling witnesses to testify about its validity.' },
                { title: 'Islamic declaration', detail: 'Include the explicit statement: "I want my estate distributed according to Islamic law (Faraid)" to give your executor clear legal authority to follow Sharia inheritance rules.' },
              ].map((item) => (
                <div key={item.title} className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 dark:text-gray-100">{item.title}</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Muslim attorneys who specialize in Islamic estate planning — particularly those familiar with ISNA&apos;s model Wasiyyah — can draft a dual-purpose document that is valid under your state&apos;s law while fully incorporating Islamic inheritance principles. They also help navigate trust structures that can approximate Faraid for assets like 401(k)s and life insurance that pass outside the will.
            </p>
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
          <RamadanEmailCapture source="learn-islamic-will-template" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Create Your Wasiyyah — Free</h2>
            <p className="text-green-100 mb-6">Start with Barakah&apos;s Faraid Calculator to determine your family&apos;s exact inheritance shares — the essential foundation of every Islamic will.</p>
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
                { href: '/learn/islamic-estate-planning', title: 'Islamic Estate Planning', desc: 'The complete guide to Wasiyyah, Faraid, and Waqf for Muslims in the US.' },
                { href: '/learn/zakat-on-retirement-accounts', title: 'Zakat on Retirement Accounts', desc: 'How 401(k) and IRA interact with your annual zakat obligation.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'How to invest your savings in Sharia-compliant assets.' },
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
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
