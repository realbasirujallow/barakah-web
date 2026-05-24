import type { Metadata } from 'next';
import Link from 'next/link';

const L = {
  en: 'https://trybarakah.com/learn/how-much-zakat-do-i-owe',
  fr: 'https://trybarakah.com/fr/learn/how-much-zakat-do-i-owe',
  ar: 'https://trybarakah.com/ar/learn/how-much-zakat-do-i-owe',
  ur: 'https://trybarakah.com/ur/learn/how-much-zakat-do-i-owe',
  'x-default': 'https://trybarakah.com/learn/how-much-zakat-do-i-owe',
};
export const metadata: Metadata = {
  title: 'كم مقدار الزكاة التي عليّ؟ طريقة الحساب 2026 (مع مثال)',
  description: 'كم تبلغ زكاتك؟ احسب 2.5% من صافي مالك الزكوي الذي بلغ النصاب ومضى عليه حول. الطريقة، مثال محلول، وحاسبة مجانية.',
  keywords: ['كم مقدار الزكاة', 'حساب الزكاة', 'نسبة الزكاة', '2.5% زكاة', 'النصاب', 'حاسبة الزكاة'],
  alternates: { canonical: L.ar, languages: L },
  openGraph: { title: 'كم مقدار الزكاة التي عليّ؟', description: 'الطريقة ومثال محلول وحاسبة مجانية لمعرفة مقدار زكاتك بدقة.', url: L.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'ما نسبة الزكاة؟', acceptedAnswer: { '@type': 'Answer', text: 'الزكاة 2.5% من صافي مالك الزكوي الذي بلغ النصاب ومضى عليه حول كامل.' } },
  { '@type': 'Question', name: 'هل تُحسب الزكاة على الدخل؟', acceptedAnswer: { '@type': 'Answer', text: 'لا، تُحسب على المال المدّخر (الادخار والذهب والاستثمارات) لا على الدخل السنوي.' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'تعلّم', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'كم مقدار الزكاة؟', item: L.ar },
]};

export default function Page() {
  return (
    <main lang="ar" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">تعلّم</Link> · <Link href="/learn/how-much-zakat-do-i-owe" className="underline">English</Link> · <Link href="/fr/learn/how-much-zakat-do-i-owe" className="underline">Français</Link> · <Link href="/ur/learn/how-much-zakat-do-i-owe" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">كم مقدار الزكاة التي عليّ؟</h1>
      <p className="mb-4">القاعدة بسيطة: <strong>2.5% من صافي مالك الزكوي</strong>، بشرط أن يبلغ <em>النصاب</em> وأن يمضي عليه <em>حول</em> قمري كامل.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">المعادلة</h2>
      <p className="mb-4">(النقود + الذهب/الفضة + الاستثمارات الزكوية + الديون المرجوّة) − الديون الحالّة = صافي المال الزكوي. ثم × 2.5%.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">مثال محلول</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>الادخار: 10000</li>
        <li>الذهب: 3000</li>
        <li>الأسهم (الجزء الزكوي): 5000</li>
        <li>ديون حالّة: −2000</li>
        <li><strong>الصافي الزكوي: 16000 ← الزكاة = 400</strong></li>
      </ul>
      <p className="mb-4">مسكن السكنى والسيارة الشخصية والأمتعة لا تدخل في الحساب.</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">احسب المبلغ الدقيق مجانًا</p>
        <p className="mb-3 text-sm">بنصاب محدّث وفق سعر الذهب ومتابعة حولك.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">افتح الحاسبة →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">أقوال متداولة للعلم؛ تحقّق من عالِمك الخاص. ولا يدّعي تطبيق برَكة سلطةً شرعية.</p>
    </main>
  );
}
