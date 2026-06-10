import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/zakat-on-gold',
  fr: 'https://trybarakah.com/fr/learn/zakat-on-gold',
  ar: 'https://trybarakah.com/ar/learn/zakat-on-gold',
  ur: 'https://trybarakah.com/ur/learn/zakat-on-gold',
  'x-default': 'https://trybarakah.com/learn/zakat-on-gold',
};

export const metadata: Metadata = {
  title: 'الزكاة على الذهب 2026 — النصاب والنسبة وحكم الحُلي',
  description:
    'كيف تُحسب زكاة الذهب: نصاب 85 غراماً، ونسبة 2.5% بعد حَوَلان الحول، واختلاف المذاهب في زكاة حُلي المرأة، مع طريقة عملية لحساب القيمة بسعر اليوم.',
  keywords: ['الزكاة على الذهب', 'زكاة الذهب', 'نصاب الذهب', 'زكاة الحلي', 'كم نصاب الذهب', 'حساب زكاة الذهب', 'زكاة ذهب المرأة'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'الزكاة على الذهب 2026 — النصاب والنسبة وحكم الحُلي',
    description: 'نصاب الذهب 85 غراماً ونسبة 2.5% بعد حول كامل، مع شرح اختلاف المذاهب في زكاة الحُلي وطريقة الحساب العملية.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'ما نصاب الذهب الذي تجب فيه الزكاة؟',
    a: 'نصاب الذهب هو 85 غراماً تقريباً (وهو ما يعادل 20 مثقالاً). فإذا بلغ ما تملكه من الذهب هذا القدر أو زاد عليه، ومرّ عليه حول قمري كامل، وجبت فيه الزكاة بنسبة 2.5%. وتُحسب القيمة بسعر الذهب يوم وجوب الزكاة لا يوم الشراء.',
  },
  {
    q: 'هل في حُلي المرأة الذي تلبسه زكاة؟',
    a: 'هذه من أشهر مسائل الخلاف بين العلماء. ذهب الحنفية إلى وجوب الزكاة في الحُلي مطلقاً ولو كان للُّبس. وذهب جمهور العلماء (المالكية والشافعية والحنابلة) إلى أنه لا زكاة في حُلي المرأة المُعدّ للُّبس والاستعمال المباح في حدود المعتاد، وتجب الزكاة فيه إن كان للادخار أو التجارة أو زاد عن المعتاد زيادة ظاهرة. والأحوط لمن أراد الاحتياط أن يزكّيه. والمسألة تُرجع فيها إلى عالم مختص.',
  },
  {
    q: 'كيف أحسب زكاة الذهب عملياً؟',
    a: 'زِن ذهبك بالغرام (مع مراعاة العيار: 24 أو 22 أو 21 أو 18)، ثم اضرب الوزن في سعر الغرام اليوم للحصول على القيمة، فإن بلغت القيمة نصاباً (قيمة 85 غراماً من الذهب الخالص) ومرّ عليها حول، أخرج 2.5% منها. ويمكن إخراج الزكاة نقداً بقيمة 2.5% أو ذهباً.',
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
    { '@type': 'ListItem', position: 3, name: 'الزكاة على الذهب', item: LANGS.ar },
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
          <span className="text-gray-900">الزكاة على الذهب</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            متوفّر بـ:{' '}
            <Link href="/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/fr/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">Français</Link> ·{' '}
            <Link href="/ur/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">اردو</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">الزكاة على الذهب</h1>
          <p className="text-base text-gray-600 mb-6">آخر مراجعة: 2026-06-09 · صفحة تعليمية لا تُغني عن سؤال العلماء</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-8 text-gray-800">
              تجب الزكاة في الذهب إذا بلغ <strong>نصاباً (85 غراماً تقريباً)</strong> ومرّ عليه <strong>حول قمري كامل</strong>،
              ومقدارها <strong>2.5%</strong> من قيمته بسعر يوم الوجوب. وأشهر مسائل الخلاف هي زكاة حُلي المرأة المُعدّ للُّبس،
              فأوجبها الحنفية ولم يوجبها الجمهور. تحقّق من سعر الذهب الحالي ومن مذهبك قبل الحساب.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">شروط وجوب زكاة الذهب</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>بلوغ النصاب:</strong> 85 غراماً من الذهب الخالص (24 قيراطاً) أو ما يعادل قيمته.</li>
              <li><strong>حولان الحول:</strong> مرور سنة قمرية كاملة على ملك النصاب.</li>
              <li><strong>الملك التام:</strong> أن يكون الذهب مملوكاً لك ملكاً مستقراً.</li>
              <li><strong>الفائض عن الحاجة الأصلية:</strong> عند من يشترط ذلك في بعض صور الحُلي.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">أرقام أساسية</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-right">
                    <th className="p-3 font-semibold text-gray-700">البند</th>
                    <th className="p-3 font-semibold text-gray-700">القيمة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">نصاب الذهب</td><td className="p-3">85 غراماً (≈ 20 مثقالاً)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">نسبة الزكاة</td><td className="p-3">2.5% (ربع العُشر)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">المدة</td><td className="p-3">حول قمري كامل (≈ 354 يوماً)</td></tr>
                  <tr><td className="p-3 font-semibold">سعر التقييم</td><td className="p-3">سعر السوق يوم وجوب الزكاة</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              ملاحظة: الذهب عيار 22 أو 21 أو 18 يُحسب بقدر ما فيه من الذهب الخالص؛ والكثير من الناس يقدّرون القيمة بسعر السوق للقطعة كاملةً تيسيراً.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">مسألة حُلي المرأة</h2>
            <p className="text-base leading-8 text-gray-800 mb-3">
              اختلف الفقهاء في زكاة الذهب الذي تتخذه المرأة حُلياً للُّبس:
            </p>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>الحنفية:</strong> تجب الزكاة في الحُلي مطلقاً ما دام بلغ النصاب ومرّ عليه الحول.</li>
              <li><strong>الجمهور (المالكية والشافعية والحنابلة):</strong> لا زكاة في الحُلي المُعدّ للُّبس والاستعمال المباح في حدود المعتاد، وتجب إن كان للادخار أو التجارة أو زاد على المعتاد زيادة ظاهرة.</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              ومن أراد الاحتياط أخرج الزكاة، والأمر فيه سعة، ويُرجع في تفاصيل حالتك إلى عالم مختص.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">تنبيه فقهي</h2>
            <p className="text-sm leading-8 text-amber-900">
              هذه صفحة معلوماتية تعرض أقوال المذاهب المعتبرة في زكاة الذهب، ولا تصدر Barakah فتاوى ولا ترجّح قولاً على آخر في حقّك.
              اختر منهجك بإرشاد عالم تثق به، فالمسائل تختلف باختلاف نوع الذهب والنية والعُرف.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">احسب زكاتك في Barakah</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              يتتبّع Barakah ذهبك وادخارك واستثماراتك، ويحسب النصاب وتاريخ الحول تلقائياً وفق المنهج الذي تختاره، ويذكّرك عند وجوب الزكاة.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/zakat-calculator" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">حاسبة الزكاة ←</Link>
              <Link href="/ar/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هو النصاب؟</Link>
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/signup" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ابدأ مجاناً</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
