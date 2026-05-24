import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/what-is-zakat',
  fr: 'https://trybarakah.com/fr/learn/what-is-zakat',
  ar: 'https://trybarakah.com/ar/learn/what-is-zakat',
  ur: 'https://trybarakah.com/ur/learn/what-is-zakat',
  'x-default': 'https://trybarakah.com/learn/what-is-zakat',
};

export const metadata: Metadata = {
  title: 'ما هي الزكاة؟ دليل 2026 الكامل — الأحكام، الحساب، ومن تجب عليه',
  description:
    'ما هي الزكاة؟ الدليل الكامل: التعريف، الشروط الخمسة، نصاب الزكاة، كيفية حساب 2.5% على جميع أنواع الأموال، ومن تجب عليه ومتى. مع حاسبة زكاة مجانية.',
  keywords: ['ما هي الزكاة', 'أحكام الزكاة', 'كيفية حساب الزكاة', 'النصاب', 'الحول', 'زكاة 2.5%', 'من تجب عليه الزكاة'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'ما هي الزكاة؟ دليل 2026 الكامل',
    description: 'كل ما تحتاج معرفته عن الزكاة: الشروط، النصاب، حساب 2.5%، الأموال الزكوية، ووقت الإخراج.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'ما هي الزكاة في الإسلام؟', acceptedAnswer: { '@type': 'Answer', text: 'الزكاة هي الركن الثالث من أركان الإسلام، وهي صدقة سنوية واجبة يؤديها المسلمون المستحقون على أموالهم الزكوية. وتعني كلمة «زكاة» التطهير والنماء. من بلغ ماله النصاب أخرج 2.5% من صافي ماله الزكوي كل عام قمري (حول).' } },
    { '@type': 'Question', name: 'كم مقدار الزكاة؟', acceptedAnswer: { '@type': 'Answer', text: 'مقدار الزكاة 2.5% من صافي مالك الزكوي الذي بلغ النصاب ومضى عليه حول كامل.' } },
    { '@type': 'Question', name: 'ما هو النصاب؟', acceptedAnswer: { '@type': 'Answer', text: 'النصاب هو الحد الأدنى من المال الذي تجب عنده الزكاة، ويعادل 85 جرامًا من الذهب أو 595 جرامًا من الفضة، ويتغير بتغير أسعارهما.' } },
  ],
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'تعلّم', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'ما هي الزكاة؟', item: LANGS.ar },
  ],
};

export default function Page() {
  return (
    <main lang="ar" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">تعلّم</Link> · متوفّر بـ: <Link href="/learn/what-is-zakat" className="underline">English</Link> · <Link href="/fr/learn/what-is-zakat" className="underline">Français</Link> · <Link href="/ur/learn/what-is-zakat" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">ما هي الزكاة؟</h1>

      <p className="mb-4"><strong>الزكاة</strong> هي الركن الثالث من أركان الإسلام: صدقة سنوية واجبة يؤديها المسلمون المستحقون على أموالهم الزكوية. ومعناها «التطهير» و«النماء» — فبالإخراج يُطهَّر سائر المال.</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">المقدار: 2.5%</h2>
      <p className="mb-4">مقدار الزكاة <strong>2.5% من صافي مالك الزكوي</strong> الذي بلغ <em>النصاب</em> ومضى عليه <em>حول</em> كامل. وهي ليست 2.5% من دخلك، بل من مالك الزكوي.</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">الشروط الخمسة</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>الإسلام</li>
        <li>بلوغ المال <strong>النصاب</strong></li>
        <li>الملك التام للمال</li>
        <li>مضي <strong>حول</strong> قمري كامل</li>
        <li>أن يزيد المال عن الحاجات الأساسية</li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">النصاب</h2>
      <p className="mb-4">النصاب هو الحد الأدنى: ما يعادل <strong>85 جرامًا من الذهب</strong> أو <strong>595 جرامًا من الفضة</strong>. ولأن الأسعار تتغير، فإن المبلغ بالعملة يتغير — لذا يجب التحقق منه وقت الحساب.</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">الأموال الزكوية</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>النقود وحسابات الادخار</li>
        <li>الذهب والفضة</li>
        <li>الأسهم والاستثمارات (الجزء الزكوي)</li>
        <li>حسابات التقاعد (بحسب إمكانية الوصول)</li>
        <li>عروض التجارة والديون المرجوّة</li>
      </ul>
      <p className="mb-4">أما مسكن السكنى وسيارتك الشخصية وأمتعتك فلا زكاة فيها.</p>

      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">احسب زكاتك مجانًا</p>
        <p className="mb-3 text-sm">تابِع نصابك وحولك طوال العام واحصل على المبلغ الدقيق في اليوم الدقيق.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">افتح حاسبة الزكاة →</Link>
      </div>

      <p className="text-xs text-gray-500 mt-8">يعرض هذا المقال أقوالًا متداولة على سبيل العلم؛ يُرجى التحقق من عالِمك الخاص. ولا يدّعي تطبيق برَكة سلطةً شرعية.</p>
    </main>
  );
}
