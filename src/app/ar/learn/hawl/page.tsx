import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/hawl',
  fr: 'https://trybarakah.com/fr/learn/hawl',
  ar: 'https://trybarakah.com/ar/learn/hawl',
  ur: 'https://trybarakah.com/ur/learn/hawl',
  'x-default': 'https://trybarakah.com/learn/hawl',
};

export const metadata: Metadata = {
  title: 'ما هو الحول في الزكاة؟ شرح السنة القمرية (2026)',
  description:
    'ما هو الحول في الزكاة؟ تعريف السنة القمرية لوجوب الزكاة، متى يبدأ الحول، ما الذي يقطعه، وكيف تتابع موعد إخراج زكاتك.',
  keywords: ['ما هو الحول', 'الحول', 'السنة القمرية للزكاة', 'متى تجب الزكاة', 'حساب الحول'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'ما هو الحول في الزكاة؟ شرح السنة القمرية',
    description: 'كيف يُحسب الحول، متى يبدأ، ما الذي يقطعه، وكيفية متابعة موعد زكاتك.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'ما هو الحول في الزكاة؟',
    a: 'الحول هو السنة القمرية (نحو 354 يومًا) التي يجب أن يبقى مالك الزكوي خلالها فوق النصاب حتى تجب عليك الزكاة. ويُحسب بالتقويم الهجري لا الميلادي.',
  },
  {
    q: 'متى يبدأ الحول؟',
    a: 'يبدأ الحول من اليوم الذي يبلغ فيه مالك الزكوي النصاب لأول مرة. ومن ذلك التاريخ تعدّ سنةً قمريةً كاملة. فإن بقي المال فوق النصاب عند انتهاء الحول، أخرجت 2.5% من صافي مالك الزكوي في ذلك اليوم.',
  },
  {
    q: 'ما الذي يقطع الحول؟',
    a: 'ينقطع الحول إذا نقص مالك الزكوي عن النصاب في أي وقت أثناء السنة. ويبدأ حول جديد عند تجاوزه النصاب من جديد. وقد ذهب جمهور الفقهاء إلى أن التذبذبات اليسيرة جدًا الناتجة عن مصروفات اعتيادية لا تقطع الحول ما دمت تعود إلى ما فوق النصاب سريعًا.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'تعلّم', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'ما هو الحول؟', item: LANGS.ar },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">الرئيسية</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">تعلّم</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">ما هو الحول؟</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">ما هو الحول في الزكاة؟</h1>
          <p className="text-base text-gray-600 mb-6">شرح السنة القمرية للزكاة — 2026</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-7 text-gray-800">
              الحول (حَوْل) هو مدة سنة قمرية كاملة (نحو 354 يومًا) يجب أن يبقى فيها مالك الزكوي فوق النصاب لتجب فيه الزكاة. ويُعدّ بالتقويم الهجري.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">كيف يُحسب الحول؟</h2>
            <ol className="list-decimal space-y-2 pr-6 text-base leading-7 text-gray-800">
              <li>يبلغ مالك الزكوي (نقدًا أو ذهبًا أو فضةً أو أسهمًا...) النصاب لأول مرة، ويصبح هذا التاريخ هو «تاريخ الحول».</li>
              <li>تعدّ سنةً قمريةً كاملةً من ذلك التاريخ.</li>
              <li>إن بقيت فوق النصاب في نهاية تلك السنة، أخرجت 2.5% من صافي مالك الزكوي في ذلك اليوم.</li>
              <li>إن نقص مالك عن النصاب أثناء السنة انقطع الحول، ويبدأ حول جديد متى تجاوزته مرةً أخرى.</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">ما الذي يقطع الحول</h2>
            <ul className="list-disc space-y-1 pr-6 text-base leading-7 text-gray-800">
              <li>نزول المال نزولًا مستمرًا عن النصاب.</li>
              <li>الفقد أو الهلاك غير الاختياري (حالة خاصة تُراجع مع أهل العلم).</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              التذبذبات اليسيرة جدًا أثناء الشهر بسبب فواتير ومصروفات اعتيادية لا تُعدّ قاطعةً للحول ما دمت تعود سريعًا فوق النصاب.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">كيف تتابع حولك</h2>
            <p className="text-base leading-7 text-gray-800">
              سجّل التاريخ الهجري الذي تجاوز فيه مالك النصاب لأول مرة. وفي اليوم نفسه من السنة التالية احسب مالك الزكوي وأخرج 2.5%. يتولّى Barakah ذلك تلقائيًا: أسعار نصاب حيّة، وتحويل ميلادي ↔ هجري، وتنبيهات قبل موعد الإخراج.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">لمعرفة المزيد</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              يتابع Barakah حولك يوميًا، مقارنًا مالك الزكوي بالنصاب الحيّ، وينبّهك إلى موعد وجوب الزكاة.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/ar/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">النصاب</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">ابدأ مجانًا ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
