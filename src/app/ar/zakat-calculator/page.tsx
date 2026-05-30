import type { Metadata } from 'next';
import Link from 'next/link';
import Calculator from '../../zakat-calculator/Calculator';

const LANGS = {
  en: 'https://trybarakah.com/zakat-calculator',
  fr: 'https://trybarakah.com/fr/zakat-calculator',
  ar: 'https://trybarakah.com/ar/zakat-calculator',
  ur: 'https://trybarakah.com/ur/zakat-calculator',
  'x-default': 'https://trybarakah.com/zakat-calculator',
};

export const metadata: Metadata = {
  title: 'حاسبة الزكاة 2026 — احسب زكاتك مجاناً في 60 ثانية',
  description:
    'احسب زكاتك في 60 ثانية مع حاسبة الزكاة المجانية: نصاب الذهب والفضة الحي، النقد، الأسهم، التقاعد، وأصول الأعمال. مع تفصيل مذاهب الحنفي والشافعي والمالكي والحنبلي.',
  keywords: ['حاسبة الزكاة', 'حساب الزكاة', 'زكاة 2026', 'النصاب', 'زكاة المال', 'زكاة الذهب', 'زكاة الأسهم', 'كيف أحسب زكاتي'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'حاسبة الزكاة 2026 — مجانية ودقيقة',
    description: 'احسب زكاتك على الذهب والفضة والنقد والأسهم والتقاعد وأصول الأعمال مع النصاب الحي.',
    url: LANGS.ar, siteName: 'Barakah', type: 'website', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'كم تبلغ الزكاة؟',
    a: 'الزكاة 2.5% من صافي مالك الزكوي الذي بلغ النصاب ومضى عليه حول قمري كامل. فإذا كان صافي مالك الزكوي 10,000 ريال، فإن زكاتك 250 ريالاً.',
  },
  {
    q: 'ما هو النصاب وكيف يُحدَّد؟',
    a: 'النصاب هو الحد الأدنى من المال الذي تجب عنده الزكاة، ويعادل 85 جراماً من الذهب أو 595 جراماً من الفضة بسعر السوق الحالي. يعرض Barakah كلا النصابين بشكل مباشر.',
  },
  {
    q: 'هل تجب الزكاة على بيت السكنى؟',
    a: 'لا. لا تجب الزكاة على بيت السكنى باتفاق المذاهب الأربعة. أما الدخل من الإيجار والعقارات المعدة للبيع فعليهما الزكاة.',
  },
  {
    q: 'متى يجب إخراج الزكاة؟',
    a: 'تجب الزكاة عند تمام السنة القمرية (الحول) على المال الذي بلغ النصاب. كثير من المسلمين يفضّلون إخراجها في رمضان، لكنها واجبة في موعد الحول مهما كان.',
  },
  {
    q: 'هل تجب الزكاة على حسابات التقاعد (401k، IRA)؟',
    a: 'اختلف العلماء في ذلك بسبب القيود على السحب والضرائب. ومن المناهج المعاصرة المتبعة حساب الزكاة على المبلغ القابل للوصول الفعلي بعد خصم الضرائب والغرامات المقدّرة. راجع عالماً موثوقاً للقول الذي تتبعه.',
  },
  {
    q: 'ما الفرق بين الزكاة والصدقة؟',
    a: 'الزكاة فريضة ومن أركان الإسلام، تُحسب بـ 2.5% من المال الذي بلغ النصاب ومضى عليه حول. أما الصدقة فهي تطوع، لا تحدد بمقدار ولا وقت. كلتاهما مهمتان، لكن الزكاة وحدها ركن.',
  },
];

const howToSteps = [
  { name: 'تحقق من بلوغ النصاب', text: 'قارن صافي مالك الزكوي (الأصول مطروحاً منها الديون) بالنصاب الحالي المبني على 85 جراماً من الذهب أو 595 جراماً من الفضة بسعر السوق. إن كان مالك دون النصاب فلا زكاة عليك.' },
  { name: 'احسب مجموع مالك الزكوي', text: 'اجمع النقد والمدخرات والذهب والفضة والأسهم وأصول الأعمال ودخل الإيجار المقبوض وغيرها. قيّم المعادن الثمينة بسعرها الجاري.' },
  { name: 'اخصم الديون المستحقة', text: 'اطرح الديون المستحقة الحالة (قروض، بطاقات، التزامات فورية أخرى). يُطبَّق النصاب على صافي المال بعد الخصم.' },
  { name: 'طبّق نسبة 2.5%', text: 'إن بلغ مالك النصاب، فاضربه في 0.025. الناتج هو زكاتك. ونسبة 2.5% ثابتة عند المذاهب الأربعة.' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const howToSchema = {
  '@context': 'https://schema.org', '@type': 'HowTo',
  name: 'كيف تحسب زكاتك', description: 'دليل خطوة بخطوة لحساب الزكاة وفق منهجية AAOIFI والمذاهب الأربعة.',
  step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'حاسبة الزكاة', item: LANGS.ar },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">الرئيسية</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">حاسبة الزكاة</span>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">حاسبة الزكاة 2026</h1>
            <p className="text-base text-gray-600 mb-6">حساب مجاني في 60 ثانية · نصاب الذهب والفضة حيّ · المذاهب الأربعة</p>

            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
              <p className="text-base leading-7 text-gray-800">
                الزكاة الركن الثالث من أركان الإسلام. يجب على كل مسلم بلغ <strong>صافي مالك الزكوي</strong> النصاب (85 جراماً من الذهب أو 595 جراماً من الفضة) ومضى عليه <strong>حول قمري كامل</strong> أن يُخرج <strong>2.5%</strong> من ذلك المال. تحسب هذه الأداة زكاتك على كل أصولك: النقد، والذهب، والفضة، والأسهم، وحسابات التقاعد، وأصول الأعمال، وغيرها.
              </p>
            </section>

            <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm leading-6 text-blue-900">
                <strong>ملاحظة:</strong> واجهة الحاسبة أدناه تعمل حالياً باللغة الإنجليزية. الأرقام والنصاب الحي ومنطق الفقه واحد لجميع المستخدمين؛ ستُترجم الواجهة في إصدار قادم.
              </p>
            </section>

            <Calculator />

            <section className="mt-10 mb-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">كيف تحسب زكاتك — خطوة بخطوة</h2>
              <ol className="list-decimal space-y-2 pr-6 text-base leading-7 text-gray-800">
                {howToSteps.map((s) => (
                  <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>
                ))}
              </ol>
            </section>

            <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">أسئلة شائعة</h2>
              <div className="space-y-4">
                {faqItems.map((f) => (
                  <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                    <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                    <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-2">تنبيه فقهي</h2>
              <p className="text-sm leading-7 text-amber-900">
                تعتمد هذه الأداة على ما تتفق عليه المذاهب الأربعة في معظم الأصول، وتُشير إلى مواطن الاختلاف حين توجد (كزكاة حُليّ الذهب بحسب المذهب). للحالات الخاصة (حسابات التقاعد، خيارات الأسهم، الأعمال المركبة) راجع عالماً مختصاً. لا تُصدر Barakah فتاوى.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-3">لمعرفة المزيد</h2>
              <div className="flex flex-wrap gap-2">
                <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">ما هي الزكاة؟</Link>
                <Link href="/ar/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">النصاب</Link>
                <Link href="/ar/learn/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">الحول</Link>
                <Link href="/ar/learn/types-of-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">أنواع الزكاة</Link>
                <Link href="/ar/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">الأسهم الحلال</Link>
                <Link href="/ar/learn/what-is-sukuk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">الصكوك</Link>
              </div>
            </section>

            <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-3 text-xl font-bold">تابِع زكاتك سنة بعد سنة</h2>
              <p className="mb-4 text-sm leading-7 text-green-100">
                Barakah Plus يتابع حولك تلقائياً، ويقارن مالك بالنصاب الحي يومياً، ويحسب الزكاة على جميع أصولك: النقد، والذهب، والأسهم، والتقاعد، وأصول الأعمال، وأكثر. لا يحتاج إلى بطاقة ائتمان للبدء.
              </p>
              <Link href="/signup?source=ar-zakat-calculator" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
                إنشاء حساب مجاني ←
              </Link>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
