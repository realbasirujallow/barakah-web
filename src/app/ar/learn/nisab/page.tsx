import type { Metadata } from 'next';
import Link from 'next/link';

const L = {
  en: 'https://trybarakah.com/learn/nisab',
  fr: 'https://trybarakah.com/fr/learn/nisab',
  ar: 'https://trybarakah.com/ar/learn/nisab',
  ur: 'https://trybarakah.com/ur/learn/nisab',
  'x-default': 'https://trybarakah.com/learn/nisab',
};
export const metadata: Metadata = {
  title: 'النصاب — حد وجوب الزكاة (الذهب والفضة) 2026',
  description: 'ما هو النصاب؟ الحد الأدنى الذي تجب عنده الزكاة: 85 جرامًا من الذهب أو 595 جرامًا من الفضة. الفرق بين الذهب والفضة ولماذا يتغير المبلغ.',
  keywords: ['النصاب', 'حد الزكاة', 'نصاب الذهب', 'نصاب الفضة', '85 جرام ذهب', '595 جرام فضة'],
  alternates: { canonical: L.ar, languages: L },
  openGraph: { title: 'النصاب', description: 'الحد الأدنى لوجوب الزكاة: الذهب مقابل الفضة، ولماذا يتغير المبلغ.', url: L.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'ما هو النصاب؟', acceptedAnswer: { '@type': 'Answer', text: 'النصاب هو الحد الأدنى من المال الذي تجب عنده الزكاة، ويعادل 85 جرامًا من الذهب أو 595 جرامًا من الفضة.' } },
  { '@type': 'Question', name: 'الذهب أم الفضة؟', acceptedAnswer: { '@type': 'Answer', text: 'نصاب الفضة أقل، فيدخل فيه عدد أكبر من الناس — ويرى كثير من العلماء اليوم اعتماده احتياطًا ورفقًا بالفقراء.' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'تعلّم', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'النصاب', item: L.ar },
]};

export default function Page() {
  return (
    <main lang="ar" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">تعلّم</Link> · <Link href="/learn/nisab" className="underline">English</Link> · <Link href="/fr/learn/nisab" className="underline">Français</Link> · <Link href="/ur/learn/nisab" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">النصاب</h1>
      <p className="mb-4"><strong>النصاب</strong> هو الحد الأدنى للمال: إذا بلغه مالك الزكوي ومضى عليه حول قمري، وجبت الزكاة.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">المعياران</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li><strong>الذهب:</strong> 85 جرامًا (نحو 7.5 تولة)</li>
        <li><strong>الفضة:</strong> 595 جرامًا (نحو 52.5 تولة)</li>
      </ul>
      <p className="mb-4">ولأن سعري الذهب والفضة يتغيران يوميًا، فإن قيمة النصاب بالعملة تتغير — لذا يجب التحقق منها وقت الحساب.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">الذهب أم الفضة؟</h2>
      <p className="mb-4">نصاب الفضة أقل بكثير؛ واعتماده يُدخِل عددًا أكبر في وجوب الزكاة ويزيد الصدقة — ولهذا يرجّحه كثير من العلماء اليوم لمن يملك أصنافًا مختلطة من المال.</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">شاهِد نصابك محدّثًا</p>
        <p className="mb-3 text-sm">يتابع برَكة النصاب بأسعار الذهب اللحظية ويخبرك هل بلغته.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">افتح الحاسبة →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">أقوال متداولة للعلم؛ تحقّق من عالِمك الخاص. ولا يدّعي تطبيق برَكة سلطةً شرعية.</p>
    </main>
  );
}
