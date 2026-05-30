import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/halal-stocks',
  fr: 'https://trybarakah.com/fr/learn/halal-stocks',
  ar: 'https://trybarakah.com/ar/learn/halal-stocks',
  ur: 'https://trybarakah.com/ur/learn/halal-stocks',
  'x-default': 'https://trybarakah.com/learn/halal-stocks',
};

export const metadata: Metadata = {
  title: 'الأسهم الحلال 2026 — كيف تتحقق من توافق الأسهم مع الشريعة',
  description:
    'دليل عملي للأسهم الحلال: معيار AAOIFI رقم 21 للتدقيق الشرعي، الفحص النشاطي والمالي، نسب الدين والفوائد، وحساب التطهير من الأرباح غير الجائزة.',
  keywords: ['الأسهم الحلال', 'أسهم متوافقة مع الشريعة', 'تدقيق الأسهم الإسلامي', 'معيار AAOIFI', 'فحص الأسهم الشرعي', 'أرامكو حلال', 'الاستثمار الحلال'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'الأسهم الحلال 2026 — دليل التدقيق الشرعي',
    description: 'كيف تتحقق من توافق الأسهم مع الشريعة وفق معيار AAOIFI، مع شرح نسب الفحص المالي وحساب التطهير.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'ما الذي يجعل السهم حلالاً؟',
    a: 'يُعدّ السهم حلالاً عندما يجتاز الشركة فحصين: الأول هو الفحص النشاطي (لا تأتي إيراداتها من نشاطات محرمة كالكحول، والقمار، والبنوك التقليدية، والتأمين الربوي، والسلاح، والمحتوى المنحرف)، والثاني هو الفحص المالي وفق معيار AAOIFI رقم 21 (الديون ذات الفائدة أقل من 30% من القيمة السوقية، والأصول الربوية والنقد أقل من 30%، والدخل غير الجائز أقل من 5%). وتتغير النتائج كل ربع سنة مع تغير النسب المالية.',
  },
  {
    q: 'ما هو معيار AAOIFI رقم 21؟',
    a: 'معيار AAOIFI رقم 21 (هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية) هو المعيار الدولي الأكثر اعتماداً للفحص الشرعي للأسهم. يحدد الفحص النشاطي، والنسب المالية الثلاث (الديون، والأوراق المالية ذات الفائدة، والدخل غير الجائز)، وكيفية حساب مبلغ التطهير على الأرباح. هناك معايير أخرى (MSCI وS&P وFTSE Russell) بحدود مختلفة قليلاً.',
  },
  {
    q: 'هل أحتاج إلى تطهير الأرباح من الأسهم الحلال؟',
    a: 'نعم. حتى عندما تجتاز الشركة الفحص الشرعي، تأتي نسبة صغيرة من دخلها من مصادر غير جائزة (كفوائد النقد). وقد ذهب جمهور العلماء إلى وجوب تطهير هذه النسبة من الأرباح أو الأرباح الرأسمالية بالتصدق بها دون نية الثواب. تُحسب نسبة التطهير كل ربع سنة من إفصاح الشركة عن دخلها غير الجائز.',
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
    { '@type': 'ListItem', position: 3, name: 'الأسهم الحلال', item: LANGS.ar },
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
          <span className="text-gray-900">الأسهم الحلال</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">الأسهم الحلال 2026</h1>
          <p className="text-base text-gray-600 mb-6">آخر مراجعة: 2026-05-28 · وفق معيار AAOIFI رقم 21</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-7 text-gray-800">
              السهم الحلال هو سهم في شركة تجتاز فحصين: <strong>فحص النشاط</strong> (لا تأتي إيراداتها من محرمات) و<strong>فحص النسب المالية</strong> وفق معيار AAOIFI رقم 21. وحتى عند الاجتياز، يبقى واجب التطهير على نسبة صغيرة من الأرباح تأتي من دخل غير جائز (كفوائد النقد). يُعاد حساب النسب كل ربع سنة، فتحقق دائماً من الوضع الحالي قبل الشراء.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">المرحلة الأولى: فحص النشاط</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">يُستبعد السهم إذا حصلت الشركة على إيرادات جوهرية من:</p>
            <ul className="list-disc space-y-1 pr-6 text-base leading-7 text-gray-800">
              <li>الكحول والمشروبات الكحولية</li>
              <li>القمار والميسر</li>
              <li>البنوك التقليدية وشركات التأمين الربوية</li>
              <li>لحم الخنزير ومشتقاته</li>
              <li>صناعة الأسلحة (في بعض المنهجيات)</li>
              <li>المحتوى المنحرف والإباحي</li>
              <li>التبغ (في بعض المنهجيات)</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              ويسمح معيار AAOIFI ببقاء نسبة صغيرة (أقل من 5%) من الدخل غير الجائز لتطهيرها لاحقاً، إذ لا تكاد شركة كبرى تخلو تماماً من هذه المصادر.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">المرحلة الثانية: نسب AAOIFI المالية</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-right">
                    <th className="p-3 font-semibold text-gray-700">النسبة</th>
                    <th className="p-3 font-semibold text-gray-700">الحد المسموح</th>
                    <th className="p-3 font-semibold text-gray-700">المقام</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">الديون ذات الفائدة</td><td className="p-3">&lt; 30%</td><td className="p-3">القيمة السوقية (متوسط 12 شهراً)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">الأوراق المالية ذات الفائدة + النقد</td><td className="p-3">&lt; 30%</td><td className="p-3">القيمة السوقية</td></tr>
                  <tr><td className="p-3 font-semibold">الدخل غير الجائز</td><td className="p-3">&lt; 5%</td><td className="p-3">إجمالي الإيرادات</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              تتغير النسب مع تذبذب القيمة السوقية، فقد يجتاز السهم الفحص هذا الربع ويفشل في الذي يليه. لذا يلزم التحقق الدوري.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">تطهير الأرباح</h2>
            <p className="text-base leading-7 text-gray-800">
              حتى عندما تجتاز الشركة الفحص الشرعي، تأتي نسبة صغيرة من دخلها من مصادر غير جائزة. يجب على المسلم تطهير حصته من تلك النسبة بالتصدق بها على من يستحق دون أن ينتظر الثواب. ويُحسب مبلغ التطهير من الإفصاحات الربعية للشركة عن دخلها غير الجائز.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">تنبيه فقهي</h2>
            <p className="text-sm leading-7 text-amber-900">
              هذه صفحة معلوماتية تعتمد على معيار AAOIFI ومنهجيات الفحص المعتمدة. اختلف بعض العلماء في تفاصيل النسب وحدود التطهير، ولا تُغني هذه الصفحة عن سؤال عالم مختص فيما يخص حالتك الخاصة. لا تصدر Barakah فتاوى.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">تحقق من الأسهم مباشرةً في Barakah</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              يفحص Barakah Plus أي سهم أمريكي أو خليجي أو بريطاني وفق نسب AAOIFI الحية، ويحسب مبلغ التطهير تلقائياً، ويتابع زكاتك على المحفظة سنوياً.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/ar/learn/what-is-sukuk" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الصكوك؟</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">ابدأ مجاناً ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
