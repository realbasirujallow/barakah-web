import type { Metadata } from 'next';
import Link from 'next/link';

const L = {
  en: 'https://trybarakah.com/learn/types-of-zakat',
  fr: 'https://trybarakah.com/fr/learn/types-of-zakat',
  ar: 'https://trybarakah.com/ar/learn/types-of-zakat',
  ur: 'https://trybarakah.com/ur/learn/types-of-zakat',
  'x-default': 'https://trybarakah.com/learn/types-of-zakat',
};
export const metadata: Metadata = {
  title: 'أنواع الزكاة — زكاة المال وزكاة الفطر (2026)',
  description: 'أنواع الزكاة: زكاة المال (2.5% على المال) وزكاة الفطر (قبل صلاة العيد، عن كل فرد). على أي الأموال، وكم، ومتى.',
  keywords: ['أنواع الزكاة', 'زكاة المال', 'زكاة الفطر', 'الزكاة على المال', 'زكاة رمضان'],
  alternates: { canonical: L.ar, languages: L },
  openGraph: { title: 'أنواع الزكاة', description: 'زكاة المال وزكاة الفطر: الفروق والأموال والمقادير والأوقات.', url: L.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'ما الفرق بين زكاة المال وزكاة الفطر؟', acceptedAnswer: { '@type': 'Answer', text: 'زكاة المال صدقة سنوية مقدارها 2.5% على المال. أما زكاة الفطر فصدقة صغيرة مقدّرة تُخرَج عن كل فرد قبل صلاة عيد الفطر.' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'تعلّم', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'أنواع الزكاة', item: L.ar },
]};

export default function Page() {
  return (
    <main lang="ar" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">تعلّم</Link> · <Link href="/learn/types-of-zakat" className="underline">English</Link> · <Link href="/fr/learn/types-of-zakat" className="underline">Français</Link> · <Link href="/ur/learn/types-of-zakat" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">أنواع الزكاة</h1>
      <p className="mb-4">للزكاة صورتان رئيستان: <strong>زكاة المال</strong> و<strong>زكاة الفطر</strong> (قبل صلاة عيد الفطر).</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">1. زكاة المال</h2>
      <p className="mb-2">2.5% من المال الزكوي الذي بلغ النصاب ومضى عليه حول قمري. وتشمل:</p>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>النقود والادخار</li>
        <li>الذهب والفضة</li>
        <li>الأسهم والاستثمارات</li>
        <li>عروض التجارة</li>
        <li>الأنعام والزروع (بأحكامها الخاصة)</li>
      </ul>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">2. زكاة الفطر</h2>
      <p className="mb-4">صدقة صغيرة مقدّرة تُخرَج <strong>عن كل فرد</strong> من أهل البيت قبل صلاة العيد، ومقدارها صاع من غالب قوت البلد (نحو 2.5–3 كجم) أو قيمته. تطهّر الصائم وتُغني المحتاجين يوم العيد.</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">احسب زكاة مالك</p>
        <p className="mb-3 text-sm">لكل أنواع المال، بنصاب محدّث ومتابعة الحول.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">افتح الحاسبة →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">أقوال متداولة للعلم؛ تحقّق من عالِمك الخاص. ولا يدّعي تطبيق برَكة سلطةً شرعية.</p>
    </main>
  );
}
