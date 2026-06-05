import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'La Wasiyyata li Warith: "No Bequest to an Heir" Hadith Explained',
  description:
    '"La wasiyyata li warith" means "there is no bequest for an heir." Read the hadith\'s wording, its source and grading (Abu Dawud, Tirmidhi, Ibn Majah), why an heir cannot be left extra by will, and the one-third rule for a valid Islamic will.',
  keywords: [
    'la wasiyyata li warith',
    'la wasiyyata li warith hadith',
    'no bequest to an heir',
    'wasiyyah for heir',
    'can you leave a bequest to an heir in islam',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/la-wasiyyata-li-warith' },
  openGraph: {
    title: 'La Wasiyyata li Warith: The "No Bequest to an Heir" Hadith',
    description:
      'Source, grading, and meaning of the hadith "no bequest to an heir," the one-third rule, and what it means for your Islamic will.',
    url: 'https://trybarakah.com/learn/la-wasiyyata-li-warith',
    type: 'article',
  },
};

const faqItems = [
  {
    q: 'What does "la wasiyyata li warith" mean?',
    a: 'It translates as "there is no bequest (wasiyyah) for an heir." It means you cannot use the discretionary one-third of your estate to leave an extra gift to someone who already inherits a fixed share under the rules of faraid — unless the other heirs consent after your death.',
  },
  {
    q: 'Who is considered an "heir" for this rule?',
    a: 'An heir is anyone who is entitled to a fixed share at the moment of your death — typically your spouse, children, parents, and in some cases siblings or grandparents. Whether a particular relative is an heir depends on who else survives you, so the set of heirs is determined at the time of death, not when the will is written.',
  },
  {
    q: 'Can I ever leave something extra to one of my children?',
    a: 'Not through a binding bequest in your will. After your death, the other heirs may voluntarily agree to allow it, but it cannot be imposed. During your lifetime, a genuine, completed gift (hibah) is treated differently from a bequest — though scholars encourage fairness among children even in lifetime gifts.',
  },
  {
    q: 'Does this hadith cancel the one-third bequest rule?',
    a: 'No. You may still bequeath up to one-third of your estate — but only to non-heirs (for example, charity, a friend, a grandchild whose parent is alive, or an Islamic cause). The "no bequest to an heir" rule restricts who can receive it, not the one-third limit itself.',
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="min-h-screen bg-white px-4 sm:px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn/islamic-will" className="text-green-700 hover:underline">Islamic Will</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">La Wasiyyata li Warith</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
            La Wasiyyata li Warith: &quot;No Bequest to an Heir&quot;
          </h1>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Last reviewed: 2026-05-22</p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
            One of the most-cited principles in Islamic inheritance is the hadith
            &quot;<em>la wasiyyata li warith</em>&quot; — there is no bequest for an heir. It draws the line between
            the fixed shares of faraid and the discretionary one-third you may give by will. Here is what it says,
            where it comes from, and how it shapes a valid Islamic will.
          </p>

          {/* The hadith */}
          <section className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">The hadith</h2>
            <p className="text-xl font-semibold text-[#1B5E20] mb-2" dir="rtl" lang="ar">لا وصية لوارث</p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Transliteration:</strong> <em>La wasiyyata li warith.</em>
            </p>
            <p className="text-gray-800 dark:text-gray-200 mt-1">
              <strong>Translation:</strong> &quot;There is no bequest for an heir.&quot;
            </p>
            <p className="text-sm text-gray-600 mt-3 dark:text-gray-400">
              Reported from the Prophet ﷺ in the major collections, including the Sunan of Abu Dawud, al-Tirmidhi,
              al-Nasa&apos;i, and Ibn Majah. It is widely accepted by the scholars as established, and many graded it
              authentic or strengthened by its numerous chains and by scholarly consensus on acting upon it.
            </p>
          </section>

          {/* Meaning */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">What it actually means</h2>
            <p className="text-gray-700 leading-relaxed mb-3 dark:text-gray-300">
              In Islamic law, an estate divides into two parts. The first is the <strong>fixed shares (faraid)</strong>:
              Allah has already assigned exact portions to specific relatives — spouse, children, parents and others.
              The second is the <strong>discretionary bequest (wasiyyah)</strong>: up to one-third of the estate that
              the deceased may direct by will.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3 dark:text-gray-300">
              &quot;La wasiyyata li warith&quot; closes a loophole. Without it, someone could use the one-third to favor
              one heir over another — giving, say, an extra portion to one son — and undermine the balance the fixed
              shares are meant to protect. The hadith forbids exactly that: <strong>the discretionary third may not be
              directed to anyone who already inherits a fixed share.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              The one exception the scholars recognize is consent: <em>after</em> the death, if the other adult heirs
              freely agree to let an heir receive an additional bequest, it may be honored. It cannot be imposed in the
              will itself.
            </p>
          </section>

          {/* The two rules together */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">The two limits on a bequest</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Limit</th>
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Rule</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 dark:text-gray-200">
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 font-semibold">How much</td>
                    <td className="p-3">Maximum one-third of the net estate (after debts and funeral costs).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">To whom</td>
                    <td className="p-3">Only to non-heirs — never to someone who already inherits a fixed share (unless the other heirs consent after death).</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-3 dark:text-gray-400">
              So the two rules work together: stay within one-third, and direct it only to people who are not your
              fixed-share heirs.
            </p>
          </section>

          {/* Practical examples */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Practical examples</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              <li><strong>Allowed:</strong> leaving up to one-third to charity, an Islamic school, a needy friend, or a grandchild whose own parent (your child) predeceased you and who therefore does not inherit.</li>
              <li><strong>Not allowed by will:</strong> &quot;I leave an extra 10% to my eldest son&quot; — he is already an heir.</li>
              <li><strong>Conditional:</strong> a bequest to an heir takes effect only if the remaining heirs agree to it after your death.</li>
              <li><strong>Lifetime gift (hibah):</strong> a completed, transferred gift while you are alive is a different matter from a bequest — though fairness among children is still encouraged.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl group dark:border-gray-700">
                  <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 flex justify-between items-center select-none dark:text-gray-100">
                    <span>{item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 dark:text-gray-300 dark:border-gray-700">{item.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 text-sm text-amber-900">
            <strong>Note:</strong> This is educational information, not a fatwa. Inheritance outcomes depend on exactly
            who survives the deceased and can vary by school of thought. Consult a qualified scholar and, for a legally
            binding document, a licensed estate attorney in your jurisdiction.
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-teal-700 rounded-2xl p-8 text-white text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Build a Faraid-Correct Islamic Will</h2>
            <p className="text-green-200 mb-6">
              Barakah&apos;s wasiyyah builder and faraid calculator help you distribute the fixed shares correctly and
              direct your one-third bequest where it&apos;s actually allowed.
            </p>
            <Link href="/signup" className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Get Started Free
            </Link>
          </div>

          {/* Hub navigation */}
          <nav aria-label="Related articles">
            <h2 className="text-lg font-bold text-gray-900 mb-4 dark:text-gray-100">Islamic Inheritance Hub</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/learn/islamic-will" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Overview</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">How to Write an Islamic Will</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">The complete wasiyyah guide.</p>
              </Link>
              <Link href="/learn/faraid-awl-radd-explained" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Fixed Shares</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Faraid, Awl &amp; Radd Explained</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">How the fixed shares are calculated.</p>
              </Link>
              <Link href="/faraid-calculator" className="block p-4 border border-gray-200 rounded-xl hover:border-green-700 transition dark:border-gray-700">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Tool</p>
                <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">Faraid Calculator</h3>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Calculate each heir&apos;s share instantly.</p>
              </Link>
            </div>
          </nav>

          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/wassiyah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Wasiyyah →</Link>
              <Link href="/fiqh-terms/faraid" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Faraid →</Link>
              <Link href="/fiqh-terms/hibah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hibah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All terms →</Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
