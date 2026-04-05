import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'How to Write an Islamic Will (Wasiyyah): Complete Guide 2026 | Barakah',
  description: 'Learn how to write a valid Islamic will (wasiyyah) that follows Shariah inheritance rules. Covers the 1/3 rule, faraid shares, legal heirs, and estate planning for Muslims in the West.',
  keywords: ['islamic will', 'wasiyyah', 'islamic inheritance', 'faraid calculator', 'islamic estate planning', 'muslim will', 'shariah inheritance', 'islamic succession'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/islamic-will',
  },
  openGraph: {
    title: 'How to Write an Islamic Will (Wasiyyah): Complete Guide 2026 | Barakah',
    description: 'Complete guide to Islamic wills covering the 1/3 rule, faraid shares, legal heirs, and practical steps for Muslims in the West.',
    url: 'https://trybarakah.com/learn/islamic-will',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is writing a will obligatory in Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The majority of scholars consider writing a will (wasiyyah) to be highly recommended (mustahab) or obligatory (wajib) for Muslims, especially those living in non-Muslim-majority countries where secular inheritance laws may override Islamic distribution. The Prophet Muhammad (peace be upon him) said it is not right for a Muslim who has something to bequeath to let two nights pass without having a written will.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the 1/3 rule in Islamic wills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 1/3 rule means you can bequeath up to one-third of your estate to non-heirs (such as charities, friends, or non-inheriting relatives) through your wasiyyah. The remaining two-thirds must be distributed according to the fixed faraid shares prescribed in the Quran. You cannot will any portion of the fixed two-thirds to deviate from Shariah inheritance rules.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is faraid in Islamic inheritance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Faraid refers to the fixed shares of inheritance prescribed in the Quran (Surah An-Nisa, verses 11-12). These shares specify exact fractions for each category of heir: spouse, children, parents, and siblings. For example, a wife receives 1/8 if there are children, daughters receive 2/3 (if two or more with no sons), and parents each receive 1/6 if the deceased has children.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a lawyer for an Islamic will?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While Islamic law does not require a lawyer, having your will reviewed by a legal professional ensures it is enforceable under your local jurisdiction. In the US, UK, and Canada, a will must meet specific legal requirements (witnesses, notarization, etc.) to be valid. Combining Islamic provisions with local legal compliance is strongly recommended.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I leave my entire estate to charity in Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. You can only bequeath up to one-third of your estate to charity or non-heirs. The remaining two-thirds must go to your legal Islamic heirs according to faraid shares. Leaving more than one-third to non-heirs requires the consent of all heirs after the death of the testator, and scholars generally discourage this.',
      },
    },
  ],
};

export default function IslamicWillPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <div className="flex items-center gap-3">
              <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
              <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
              <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Islamic Will (Wasiyyah)</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Estate Planning
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">How to Write an Islamic Will (Wasiyyah): Complete Guide 2026</h1>
              <p className="text-lg text-gray-700">Every Muslim needs a will. Learn the Shariah rules of inheritance, the 1/3 bequest limit, faraid shares for legal heirs, and how to create a legally valid Islamic will in the West.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <span>By Barakah Editorial Team</span>
                <span>14 min read</span>
                <span>Published: April 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#why-will" className="text-[#1B5E20] hover:underline">Why Every Muslim Needs a Will</Link></li>
                <li><Link href="#one-third" className="text-[#1B5E20] hover:underline">The 1/3 Rule (Wasiyyah)</Link></li>
                <li><Link href="#faraid" className="text-[#1B5E20] hover:underline">Faraid: Fixed Inheritance Shares</Link></li>
                <li><Link href="#heirs" className="text-[#1B5E20] hover:underline">Legal Heirs in Islam</Link></li>
                <li><Link href="#steps" className="text-[#1B5E20] hover:underline">Step-by-Step: Writing Your Will</Link></li>
                <li><Link href="#western-law" className="text-[#1B5E20] hover:underline">Islamic Wills & Western Law</Link></li>
                <li><Link href="#barakah-planner" className="text-[#1B5E20] hover:underline">Using Barakah&apos;s Wasiyyah Planner</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">Frequently Asked Questions</Link></li>
              </ul>
            </nav>

            {/* Main Content */}
            <section id="why-will" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Why Every Muslim Needs a Will</h2>
              <p className="text-gray-700 leading-relaxed">
                The Prophet Muhammad (peace be upon him) emphasized the importance of having a will prepared at all times. Without a valid will, your estate may be distributed according to secular inheritance laws in your country of residence, which often differ significantly from Islamic rules.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In the United States, for example, intestacy laws (laws governing estates without a will) typically give the entire estate to the surviving spouse, potentially excluding parents and other relatives who have fixed rights under Islamic law. In the UK, a surviving spouse may receive the first portion with the remainder split among children, again not matching faraid shares.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Hadith on Writing a Will</h3>
                <p className="text-blue-900 text-sm">
                  Ibn Umar (may Allah be pleased with him) reported that the Messenger of Allah (peace be upon him) said: &quot;It is not right for a Muslim who has something to bequeath to sleep two nights without having his will written down with him.&quot; (Sahih al-Bukhari 2738, Sahih Muslim 1627)
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Without a will:</strong> Your estate may be divided by secular courts in ways that contradict Islamic inheritance rules, potentially depriving rightful heirs of their shares.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Without a will:</strong> Your children may be placed under the guardianship of non-Muslim relatives or state authorities if both parents pass away.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700"><strong className="text-red-600">Without a will:</strong> You cannot designate bequests to charity, mosques, or Islamic organizations from the permissible one-third.</p>
                </div>
              </div>
            </section>

            <section id="one-third" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">The 1/3 Rule (Wasiyyah)</h2>
              <p className="text-gray-700 leading-relaxed">
                In Islamic inheritance law, your estate is divided into two parts:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">The Wasiyyah (Up to 1/3)</h3>
                  <p className="text-gray-700 text-sm">
                    You may freely bequeath up to <strong>one-third</strong> of your net estate to anyone who is <strong>not</strong> a faraid heir. This includes charities, mosques, friends, non-inheriting relatives, or Islamic organizations. The Prophet (peace be upon him) told Sa&apos;d ibn Abi Waqqas that one-third is the maximum, and even that is much.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">The Faraid (Remaining 2/3 or more)</h3>
                  <p className="text-gray-700 text-sm">
                    The remaining portion (at least two-thirds) must be distributed according to the <strong>fixed Quranic shares</strong> among your legal heirs. You cannot change, increase, or decrease any heir&apos;s share through your will. A bequest to a faraid heir is not valid unless all other heirs consent after the death.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed font-semibold bg-yellow-50 border border-yellow-200 p-4 rounded">
                <strong>Important:</strong> Before distributing either portion, debts must be paid in full and funeral expenses settled. The estate is calculated as total assets minus total liabilities.
              </p>
            </section>

            <section id="faraid" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Faraid: Fixed Inheritance Shares</h2>
              <p className="text-gray-700 leading-relaxed">
                The Quran specifies exact shares for each category of heir in Surah An-Nisa (4:11-12). These shares are divinely mandated and cannot be altered by the deceased. Here are the primary fixed shares:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left">Heir</th>
                      <th className="border border-gray-300 p-3 text-left">Share (with children)</th>
                      <th className="border border-gray-300 p-3 text-left">Share (without children)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Husband</td>
                      <td className="border border-gray-300 p-3">1/4 of wife&apos;s estate</td>
                      <td className="border border-gray-300 p-3">1/2 of wife&apos;s estate</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Wife</td>
                      <td className="border border-gray-300 p-3">1/8 of husband&apos;s estate</td>
                      <td className="border border-gray-300 p-3">1/4 of husband&apos;s estate</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Father</td>
                      <td className="border border-gray-300 p-3">1/6</td>
                      <td className="border border-gray-300 p-3">Residuary (asaba)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Mother</td>
                      <td className="border border-gray-300 p-3">1/6</td>
                      <td className="border border-gray-300 p-3">1/3</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Son(s)</td>
                      <td className="border border-gray-300 p-3" colSpan={2}>Residuary (receives remainder after fixed shares)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Daughter(s) only</td>
                      <td className="border border-gray-300 p-3" colSpan={2}>2/3 if two or more; 1/2 if one (no sons)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Son(s) and Daughter(s)</td>
                      <td className="border border-gray-300 p-3" colSpan={2}>Males receive twice the female share from the residuary</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Quranic Reference</h3>
                <p className="text-gray-700 text-sm">
                  These shares are detailed in the Quran, Surah An-Nisa (4:11-12). Allah (SWT) concludes the inheritance verses with: &quot;These are the limits set by Allah. Whoever obeys Allah and His Messenger will be admitted to gardens under which rivers flow, to stay there forever. That is the ultimate triumph.&quot; (An-Nisa 4:13)
                </p>
              </div>
            </section>

            <section id="heirs" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Legal Heirs in Islam</h2>
              <p className="text-gray-700 leading-relaxed">
                Islamic law defines specific categories of heirs who are entitled to inherit. These are divided into three groups:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Dhawu al-Furud (Fixed Share Holders)</h3>
                  <p className="text-gray-700 text-sm">
                    Heirs with fixed Quranic shares: husband, wife, father, mother, grandfather, grandmother, daughters, son&apos;s daughters, full sisters, half-sisters (paternal and maternal), and half-brothers (maternal). Their shares are specified by the Quran and Sunnah.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Asaba (Residuary Heirs)</h3>
                  <p className="text-gray-700 text-sm">
                    Heirs who receive the remainder after fixed shares are distributed: sons, father (in some cases), paternal grandfather, brothers, nephews, and paternal uncles. If there is no remainder, they receive nothing. If there are no fixed-share heirs, they receive the entire estate.
                  </p>
                </div>

                <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded">
                  <h3 className="font-bold text-amber-900 mb-2">Dhawu al-Arham (Extended Relatives)</h3>
                  <p className="text-gray-700 text-sm">
                    Relatives who inherit only when there are no fixed-share or residuary heirs: maternal uncles, maternal aunts, paternal aunts, daughter&apos;s children, and sister&apos;s children. Their inheritance is recognized by the Hanafi and Hanbali schools.
                  </p>
                </div>
              </div>
            </section>

            <section id="steps" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Step-by-Step: Writing Your Islamic Will</h2>
              <p className="text-gray-700 leading-relaxed">
                Follow these steps to create a comprehensive Islamic will:
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li><strong>Declare your shahada and faith.</strong> Begin with the testimony of faith and your intention that the will be executed according to Islamic law.</li>
                <li><strong>Appoint an executor (wasi).</strong> Choose a trustworthy Muslim who understands Islamic inheritance to administer your estate.</li>
                <li><strong>Designate guardians for minor children.</strong> Name Muslim guardians for your children in case both parents pass away.</li>
                <li><strong>Specify funeral instructions.</strong> Request an Islamic funeral (ghusl, janazah prayer, burial without cremation) and specify which Islamic cemetery or community to contact.</li>
                <li><strong>List your debts.</strong> Document all outstanding debts (loans, mortgages, unpaid zakat) that must be settled before distribution.</li>
                <li><strong>Allocate the wasiyyah (up to 1/3).</strong> Specify bequests to charities, mosques, or non-heirs. Do not exceed one-third.</li>
                <li><strong>Declare faraid distribution.</strong> State that the remaining estate should be distributed according to Islamic inheritance law (faraid), and reference the Quranic verses (4:11-12).</li>
                <li><strong>List all assets.</strong> Document bank accounts, investments, real estate, vehicles, gold, jewelry, and any other valuable property.</li>
                <li><strong>Have it witnessed.</strong> Two adult Muslim witnesses should sign the will. In Western jurisdictions, also follow local notarization requirements.</li>
                <li><strong>Store securely.</strong> Keep the original in a safe place and give copies to your executor and close family members.</li>
              </ol>
            </section>

            <section id="western-law" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Islamic Wills & Western Law</h2>
              <p className="text-gray-700 leading-relaxed">
                Muslims living in the US, UK, Canada, and other Western countries face a unique challenge: ensuring their Islamic will is legally enforceable under local law. Here are key considerations:
              </p>

              <div className="space-y-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-[#1B5E20] mb-2">United States</h3>
                  <p className="text-gray-700 text-sm">
                    Each state has its own probate laws. Most states honor the testator&apos;s wishes as long as the will meets formal requirements (written, signed, witnessed). Some states have &quot;elective share&quot; laws that guarantee a surviving spouse a minimum portion (typically 1/3), which may conflict with Islamic shares in some scenarios. Consult a local attorney.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-[#1B5E20] mb-2">United Kingdom</h3>
                  <p className="text-gray-700 text-sm">
                    English law gives testators broad freedom to distribute their estate. However, dependents can challenge a will under the Inheritance (Provision for Family and Dependants) Act 1975 if they feel inadequately provided for. Draft your will with both Islamic provisions and awareness of potential claims.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Canada</h3>
                  <p className="text-gray-700 text-sm">
                    Provincial laws govern wills. Similar to the US, some provinces guarantee spousal rights that may override will provisions. Work with a lawyer experienced in Islamic estate planning.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed font-semibold bg-yellow-50 border border-yellow-200 p-4 rounded">
                <strong>Recommendation:</strong> Always have your Islamic will reviewed by both a knowledgeable Islamic scholar and a local attorney to ensure it is both Shariah-compliant and legally enforceable.
              </p>
            </section>

            <section id="barakah-planner" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Using Barakah&apos;s Wasiyyah Planner</h2>
              <p className="text-gray-700 leading-relaxed">
                Barakah offers a guided Wasiyyah planner that simplifies the process of creating an Islamic will:
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li><strong>Enter your family members.</strong> Add your spouse, children, parents, and siblings. Barakah automatically calculates faraid shares based on your family structure.</li>
                <li><strong>List your assets.</strong> Input your bank accounts, investments, real estate, gold, and other property. Barakah pulls live asset values where possible.</li>
                <li><strong>Allocate your wasiyyah.</strong> Choose bequests for charities, mosques, or non-heirs (up to 1/3). Barakah prevents you from exceeding the limit.</li>
                <li><strong>Review the distribution.</strong> See a clear breakdown of exactly how much each heir receives, with Quranic references for each share.</li>
                <li><strong>Generate the document.</strong> Download a formatted will document ready for review by your attorney and witnesses.</li>
              </ol>

              <NisabLivePrices />
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Is writing a will obligatory in Islam?</h3>
                <p className="text-gray-700 text-sm">
                  The majority of scholars consider it highly recommended (mustahab), and many say it becomes obligatory (wajib) for Muslims living in non-Muslim countries where secular inheritance laws would otherwise apply. The hadith in Sahih Bukhari and Muslim strongly encourages having a written will at all times.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I leave my entire estate to charity?</h3>
                <p className="text-gray-700 text-sm">
                  No. You can only bequeath up to one-third of your estate to charity or non-heirs. The remaining two-thirds (or more) must go to your legal Islamic heirs according to faraid shares. This is a clear Quranic mandate.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I have debts when I die?</h3>
                <p className="text-gray-700 text-sm">
                  All debts must be paid from the estate before any inheritance distribution. This includes loans, mortgages, unpaid zakat, and funeral expenses. If debts exceed the estate value, heirs do not inherit the debt (unlike some secular jurisdictions).
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can a non-Muslim inherit from a Muslim?</h3>
                <p className="text-gray-700 text-sm">
                  According to the majority of scholars, a non-Muslim cannot inherit from a Muslim through faraid (and vice versa). However, you may include non-Muslim relatives in the wasiyyah (one-third portion) as a bequest. Consult a scholar for your specific situation.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I need to update my will regularly?</h3>
                <p className="text-gray-700 text-sm">
                  Yes. Update your will whenever there is a significant life change: marriage, divorce, birth of a child, death of an heir, significant change in assets, or relocation to a different country or state. Barakah&apos;s planner makes it easy to update and regenerate your will at any time.
                </p>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Create Your Islamic Will Today</h2>
              <p className="text-green-100">
                Barakah&apos;s Wasiyyah planner calculates faraid shares, enforces the 1/3 rule, and generates a legally-formatted document ready for your attorney.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Start Your Wasiyyah
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/zakat-on-savings"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Savings</h3>
                  <p className="text-gray-600 text-sm">Calculate zakat on your cash and savings before estate planning.</p>
                </Link>
                <Link
                  href="/learn/islamic-finance-basics"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Islamic Finance Basics</h3>
                  <p className="text-gray-600 text-sm">Core principles of Islamic finance including riba, gharar, and halal investing.</p>
                </Link>
              </div>
            </section>

            {/* Author & Update Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last reviewed:</strong> April 2026</p>
              <p className="mt-2">This article is based on the Quran (Surah An-Nisa 4:7-14), Sahih al-Bukhari (Book of Wills), Sahih Muslim (Book of Bequests), and guidance from AMJA, the Islamic Fiqh Academy (OIC), and classical texts on Islamic inheritance law (ilm al-faraid).</p>
            </footer>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600">Islamic finance tools for modern Muslims.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/nisab-threshold" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                  <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">Finance 101</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
