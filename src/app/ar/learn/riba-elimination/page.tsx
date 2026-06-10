import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/riba-elimination',
  fr: 'https://trybarakah.com/fr/learn/riba-elimination',
  ar: 'https://trybarakah.com/ar/learn/riba-elimination',
  ur: 'https://trybarakah.com/ur/learn/riba-elimination',
  'x-default': 'https://trybarakah.com/learn/riba-elimination',
};

export const metadata: Metadata = {
  title: 'كيف تتخلّص من الربا في أموالك — دليل عملي 2026',
  description:
    'ما هو الربا، وأنواعه (ربا النسيئة وربا الفضل)، وأين يختبئ في الحياة المالية المعاصرة، وخطوات عملية للتخلص منه وتطهير ما دخل من فوائد، مع أدوات Barakah للكشف والمتابعة.',
  keywords: ['الربا', 'التخلص من الربا', 'ربا النسيئة', 'ربا الفضل', 'الفوائد البنكية حرام', 'تطهير الفوائد', 'تمويل بلا ربا'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'كيف تتخلّص من الربا في أموالك — دليل عملي 2026',
    description: 'أنواع الربا، وأين يختبئ في الحياة المالية المعاصرة، وخطوات عملية للتخلص منه وتطهير الفوائد.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'ما هو الربا؟',
    a: 'الربا هو الزيادة المحرّمة في عقود معينة. وله نوعان رئيسان: ربا النسيئة (الزيادة المشروطة مقابل الأجل، كفائدة القرض)، وربا الفضل (التفاضل في مبادلة الجنس الربوي بجنسه كذهب بذهب أو برّ ببرّ). وتحريم الربا ثابت بنصوص القرآن والسنة وبإجماع العلماء، وإنما يقع الخلاف في تنزيله على بعض المعاملات المعاصرة.',
  },
  {
    q: 'أين يختبئ الربا في حياتي المالية اليوم؟',
    a: 'من أكثر صوره شيوعاً: فوائد حسابات التوفير، وفوائد بطاقات الائتمان، والقروض الشخصية وقروض السيارات بفائدة، والرهن العقاري التقليدي، والسندات ذات الفائدة، وغرامات التأخير المحسوبة كفائدة. الخطوة الأولى أن تتعرّف على هذه المصادر في معاملاتك قبل أن تعالجها.',
  },
  {
    q: 'ماذا أفعل بالفوائد التي دخلت حسابي بالفعل؟',
    a: 'ذهب كثير من العلماء إلى أن ما دخل من فوائد لا يجوز الانتفاع به، ويُتخلّص منه بإخراجه للفقراء والمصالح العامة دون نية التقرّب والثواب، وإنما تخلّصاً من الحرام. أما رأس مالك الأصلي فهو لك. ولتفاصيل حالتك ارجع إلى عالم مختص.',
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
    { '@type': 'ListItem', position: 3, name: 'التخلص من الربا', item: LANGS.ar },
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
          <span className="text-gray-900">التخلص من الربا</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            متوفّر بـ:{' '}
            <Link href="/learn/riba-elimination" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/fr/learn/riba-elimination" className="underline hover:text-[#1B5E20]">Français</Link> ·{' '}
            <Link href="/ur/learn/riba-elimination" className="underline hover:text-[#1B5E20]">اردو</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">كيف تتخلّص من الربا</h1>
          <p className="text-base text-gray-600 mb-6">آخر مراجعة: 2026-06-09 · صفحة تعليمية لا تُصدر فتوى</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-8 text-gray-800">
              الربا زيادة محرّمة، وتحريمه ثابت بالكتاب والسنة وإجماع العلماء. والتخلّص منه رحلة من ثلاث خطوات:
              <strong> اكتشاف</strong> مصادر الربا في معاملاتك، ثم <strong>الإيقاف والسداد</strong> لما عليك من ديون ربوية،
              ثم <strong>التطهير</strong> لما دخل حسابك من فوائد بإخراجه دون نية الثواب. وهذا ما صُمّم Barakah لمساعدتك عليه.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">أنواع الربا</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>ربا النسيئة:</strong> الزيادة المشروطة في الدَّين مقابل الأجل، وهو أصل فائدة القروض الحديثة.</li>
              <li><strong>ربا الفضل:</strong> التفاضل في مبادلة الجنس الربوي بجنسه يداً بيد (كذهب بذهب متفاضلاً).</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">أين يختبئ الربا اليوم؟</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li>فوائد حسابات التوفير والودائع.</li>
              <li>فوائد بطاقات الائتمان والقروض الشخصية.</li>
              <li>الرهن العقاري التقليدي بفائدة.</li>
              <li>السندات وأدوات الدخل الثابت ذات الفائدة.</li>
              <li>غرامات التأخير المحسوبة على أنها فائدة.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">خطوات عملية للتخلص</h2>
            <ol className="list-decimal space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>اكتشف:</strong> راجع معاملاتك وحدّد كل دخل أو مصروف ربوي.</li>
              <li><strong>أوقف الجديد:</strong> أغلق المنتجات الربوية وتحوّل إلى بدائل متوافقة مع الشريعة.</li>
              <li><strong>اسدد الأثقل أولاً:</strong> ضع خطة لسداد الديون الربوية بدءاً بالأعلى كلفةً.</li>
              <li><strong>طهّر ما دخل:</strong> أخرج الفوائد التي وصلتك للفقراء دون نية الثواب.</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">تنبيه فقهي</h2>
            <p className="text-sm leading-8 text-amber-900">
              تحريم أصل الربا محل إجماع، لكن تنزيله على معاملة بعينها قد يحتاج نظراً وتفصيلاً. هذه صفحة تعليمية ولا تصدر Barakah فتاوى،
              فاستعن بعالم مختص فيما يخص حالتك ومنتجاتك المالية.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">اكتشف الربا وتابع التطهير في Barakah</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              يكشف Barakah مصادر الفوائد في معاملاتك تلقائياً، ويساعدك على وضع أهداف للتخلص من الديون الربوية، ويتابع مبالغ التطهير حتى تطمئن إلى نقاء مالك.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/ar/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">الأسهم الحلال</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">ابدأ مجاناً ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
