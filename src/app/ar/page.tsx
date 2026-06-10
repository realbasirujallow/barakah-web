import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com',
  fr: 'https://trybarakah.com/fr',
  ar: 'https://trybarakah.com/ar',
  ur: 'https://trybarakah.com/ur',
  'x-default': 'https://trybarakah.com',
};

export const metadata: Metadata = {
  title: 'Barakah — تطبيق التمويل الإسلامي: الزكاة والميزانية الحلال',
  description:
    'تطبيق واحد لمالك كله وفق الشريعة: حساب الزكاة والنصاب والحول تلقائياً، وكشف الربا في معاملاتك، وفحص الأسهم الحلال، وميزانية الأسرة، وتتبع الصدقة — بالعربية.',
  keywords: ['تطبيق التمويل الإسلامي', 'حاسبة الزكاة', 'الميزانية الحلال', 'كشف الربا', 'الأسهم الحلال', 'تطبيق زكاة'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'Barakah — تطبيق التمويل الإسلامي',
    description: 'الزكاة، والميزانية الحلال، وكشف الربا، وفحص الأسهم — في تطبيق واحد.',
    url: LANGS.ar, siteName: 'Barakah', type: 'website', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <Link href="/ar" className="font-extrabold text-[#1B5E20] text-lg">Barakah</Link>
          <div className="flex items-center gap-3 text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20]">English</Link>
            <Link href="/fr" className="hover:text-[#1B5E20]">Français</Link>
            <Link href="/ur" className="hover:text-[#1B5E20]">اردو</Link>
            <Link href="/login" className="hover:text-[#1B5E20]">تسجيل الدخول</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h1 className="mb-4 text-4xl md:text-6xl font-extrabold text-[#1B5E20] leading-tight">
            مالك كلّه، وفق الشريعة، في تطبيق واحد
          </h1>
          <p className="text-lg leading-9 text-gray-700 mb-8 max-w-2xl">
            يحسب Barakah زكاتك ونصابك وحولك تلقائياً، ويكشف مصادر الربا في معاملاتك، ويفحص أسهمك وفق معيار AAOIFI،
            ويعينك على ميزانية أسرتك وصدقاتك — من غير ادعاء فتوى، ومع منهجية معلنة تختار أنت مذهبها.
          </p>
          <div className="flex flex-wrap gap-3 mb-14">
            <Link href="/signup" className="rounded-full bg-[#1B5E20] px-6 py-3 text-base font-bold text-white hover:bg-[#2E7D32] transition">ابدأ مجاناً</Link>
            <Link href="/ar/zakat-calculator" className="rounded-full bg-amber-300 px-6 py-3 text-base font-bold text-amber-900 hover:bg-amber-200 transition">احسب زكاتك الآن</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-14">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">🌙 الزكاة بلا حيرة</h2>
              <p className="text-sm leading-7 text-gray-700">نصاب حيّ بسعر الذهب اليوم، وتتبع الحول هجرياً، وحساب تلقائي على المدخرات والذهب والأسهم، مع سجل لما أخرجت.</p>
              <Link href="/ar/learn/what-is-zakat" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">ما هي الزكاة؟ ←</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">🚫 كشف الربا</h2>
              <p className="text-sm leading-7 text-gray-700">يتعرّف على الفوائد الداخلة والخارجة في حساباتك، ويساعدك على خطة للتخلص منها وتطهير ما دخل.</p>
              <Link href="/ar/learn/riba-elimination" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">كيف تتخلص من الربا؟ ←</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">📈 الأسهم الحلال</h2>
              <p className="text-sm leading-7 text-gray-700">فحص شرعي وفق نسب AAOIFI الحية لأي سهم أمريكي أو خليجي أو بريطاني، مع حساب نسبة التطهير.</p>
              <Link href="/ar/learn/halal-stocks" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">دليل الأسهم الحلال ←</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">👨‍👩‍👧 ميزانية الأسرة</h2>
              <p className="text-sm leading-7 text-gray-700">ميزانية تقدّم الواجبات على الكماليات، وحساب مشترك للأسرة، وتتبّع للصدقة والوقف والوصية.</p>
              <Link href="/ar/learn/halal-budgeting" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">الميزانية الحلال ←</Link>
            </div>
          </div>

          <section className="rounded-2xl bg-white p-6 shadow-sm mb-14">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">اقرأ بالعربية</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/ar/learn/nisab" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">النصاب</Link>
              <Link href="/ar/learn/hawl" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">الحول</Link>
              <Link href="/ar/learn/zakat-on-gold" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">زكاة الذهب</Link>
              <Link href="/ar/learn/types-of-zakat" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">أنواع الزكاة</Link>
              <Link href="/ar/learn/what-is-sukuk" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">الصكوك</Link>
              <Link href="/ar/learn/islamic-finance-app" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">تطبيق التمويل الإسلامي</Link>
              <Link href="/ar/learn/how-much-zakat-do-i-owe" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">كم زكاتي؟</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-8 text-white text-center">
            <h2 className="mb-3 text-2xl font-bold">ابدأ رحلتك نحو مال أطيب</h2>
            <p className="mb-5 text-sm leading-7 text-green-100 max-w-xl mx-auto">
              منهجية معلنة في <Link href="/methodology" className="underline">صفحة المنهجية</Link>، ولا نبيع بياناتك — مزوّدو الخدمة فقط.
              لا يصدر Barakah فتاوى؛ والمرجع في مسائلك الخاصة أهل العلم.
            </p>
            <Link href="/signup" className="inline-block rounded-full bg-amber-300 px-8 py-3 text-base font-bold text-amber-900 hover:bg-amber-200 transition">ابدأ مجاناً ←</Link>
          </section>
        </div>
      </main>
    </div>
  );
}
