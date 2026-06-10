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
  title: 'سونے پر زکوٰۃ 2026 — نصاب، شرح اور زیورات کا حکم',
  description:
    'سونے کی زکوٰۃ کیسے نکالیں: نصاب 85 گرام، سال مکمل ہونے پر 2.5% شرح، اور پہننے کے زیورات پر فقہی اختلاف، آج کے بھاؤ سے قیمت نکالنے کا عملی طریقہ۔',
  keywords: ['سونے پر زکوٰۃ', 'سونے کی زکوٰۃ', 'سونے کا نصاب', 'زیورات پر زکوٰۃ', 'زکوٰۃ کا حساب', 'سونے کا نصاب کتنا ہے'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'سونے پر زکوٰۃ 2026 — نصاب، شرح اور زیورات کا حکم',
    description: 'سونے کا نصاب 85 گرام، سال مکمل ہونے پر 2.5% زکوٰۃ، اور پہننے کے زیورات پر فقہی اختلاف کی وضاحت۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'سونے کا نصاب کتنا ہے؟',
    a: 'سونے کا نصاب تقریباً 85 گرام ہے (یعنی ساڑھے سات تولہ)۔ اگر آپ کی ملکیت میں اتنا یا اس سے زیادہ سونا ہو اور اس پر ایک قمری سال مکمل ہو جائے تو 2.5% زکوٰۃ واجب ہوتی ہے۔ قیمت زکوٰۃ کے دن کے بھاؤ سے لگائی جاتی ہے، خریداری کے دن کے بھاؤ سے نہیں۔',
  },
  {
    q: 'کیا پہننے والے زیورات پر زکوٰۃ ہے؟',
    a: 'یہ علماء کے درمیان مشہور اختلافی مسئلہ ہے۔ احناف کے نزدیک پہننے کے زیورات پر بھی زکوٰۃ واجب ہے جب وہ نصاب کو پہنچ جائیں اور سال گزر جائے۔ جمہور علماء (مالکی، شافعی، حنبلی) کے نزدیک عام استعمال کے زیورات پر زکوٰۃ نہیں، البتہ اگر سرمایہ کاری یا ذخیرے کے لیے ہوں یا معمول سے کہیں زیادہ ہوں تو زکوٰۃ ہے۔ برصغیر میں عموماً حنفی مسلک پر عمل ہوتا ہے۔ اپنی صورتِ حال کے لیے کسی مستند عالم سے رجوع کریں۔',
  },
  {
    q: 'سونے کی زکوٰۃ عملی طور پر کیسے نکالیں؟',
    a: 'اپنا سونا گرام میں تولیں (کیرٹ کا خیال رکھیں: 24، 22، 21 یا 18)، پھر وزن کو آج کے فی گرام بھاؤ سے ضرب دیں تاکہ کل قیمت معلوم ہو۔ اگر قیمت نصاب (خالص 85 گرام سونے کی قیمت) کو پہنچے اور سال گزر چکا ہو تو اس کا 2.5% بطورِ زکوٰۃ نکالیں۔ زکوٰۃ نقد یا سونے دونوں صورتوں میں دی جا سکتی ہے۔',
  },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ہوم', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'سیکھیں', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'سونے پر زکوٰۃ', item: LANGS.ur },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">ہوم</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">سیکھیں</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">سونے پر زکوٰۃ</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            دستیاب زبانیں:{' '}
            <Link href="/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/fr/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">Français</Link> ·{' '}
            <Link href="/ar/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">العربية</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">سونے پر زکوٰۃ</h1>
          <p className="text-base text-gray-600 mb-6">آخری نظرثانی: 2026-06-09 · یہ معلوماتی صفحہ علماء سے رجوع کا متبادل نہیں</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-8 text-gray-800">
              سونے پر زکوٰۃ تب واجب ہوتی ہے جب وہ <strong>نصاب (تقریباً 85 گرام)</strong> کو پہنچے اور اس پر <strong>ایک قمری سال</strong> گزر جائے،
              اور اس کی شرح <strong>2.5%</strong> ہے جو زکوٰۃ کے دن کے بھاؤ سے لگائی جاتی ہے۔ سب سے مشہور اختلاف پہننے کے زیورات کا ہے —
              احناف اسے واجب کہتے ہیں اور جمہور نہیں۔ حساب سے پہلے آج کا بھاؤ اور اپنا مسلک ضرور دیکھ لیں۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">زکوٰۃ کے واجب ہونے کی شرائط</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>نصاب کو پہنچنا:</strong> خالص سونا (24 کیرٹ) 85 گرام یا اس کے برابر قیمت۔</li>
              <li><strong>سال کا گزرنا:</strong> نصاب کی ملکیت پر پورا قمری سال مکمل ہو۔</li>
              <li><strong>مکمل ملکیت:</strong> سونا آپ کی پختہ ملکیت میں ہو۔</li>
              <li><strong>قرض سے زائد:</strong> بعض صورتوں میں واجب الادا قرض منہا کرنے کے بعد۔</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">بنیادی اعداد</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-right">
                    <th className="p-3 font-semibold text-gray-700">تفصیل</th>
                    <th className="p-3 font-semibold text-gray-700">قیمت</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">سونے کا نصاب</td><td className="p-3">85 گرام (≈ ساڑھے سات تولہ)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">زکوٰۃ کی شرح</td><td className="p-3">2.5% (چالیسواں حصہ)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">مدت</td><td className="p-3">ایک قمری سال (≈ 354 دن)</td></tr>
                  <tr><td className="p-3 font-semibold">قیمت کا حساب</td><td className="p-3">زکوٰۃ کے دن کا بازاری بھاؤ</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              نوٹ: 22، 21 یا 18 کیرٹ سونے کا حساب اس میں موجود خالص سونے کے تناسب سے ہوتا ہے؛ بہت سے لوگ آسانی کے لیے پوری چیز کی بازاری قیمت لگا لیتے ہیں۔
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">پہننے کے زیورات کا مسئلہ</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>احناف:</strong> پہننے کے زیورات پر بھی زکوٰۃ واجب ہے جب نصاب کو پہنچیں اور سال گزرے۔</li>
              <li><strong>جمہور (مالکی، شافعی، حنبلی):</strong> عام استعمال کے زیورات پر زکوٰۃ نہیں، البتہ ذخیرے، سرمایہ کاری یا معمول سے واضح زیادتی کی صورت میں واجب ہے۔</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              احتیاط کرنے والے زکوٰۃ ادا کر دیتے ہیں۔ اپنی صورتِ حال کی تفصیل کے لیے کسی مستند عالم سے رجوع کریں۔
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">فقہی تنبیہ</h2>
            <p className="text-sm leading-8 text-amber-900">
              یہ ایک معلوماتی صفحہ ہے جو سونے کی زکوٰۃ میں معتبر مسالک کے اقوال پیش کرتا ہے۔ Barakah فتویٰ جاری نہیں کرتا اور نہ آپ کے حق میں کسی قول کو ترجیح دیتا ہے۔
              اپنا طریقہ کسی قابلِ اعتماد عالم کی رہنمائی میں اختیار کریں، کیونکہ مسائل سونے کی نوعیت، نیت اور عُرف کے فرق سے بدلتے ہیں۔
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Barakah میں اپنی زکوٰۃ کا حساب لگائیں</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              Barakah آپ کے سونے، بچت اور سرمایہ کاری کو ٹریک کرتا ہے، آپ کے منتخب کردہ طریقے کے مطابق نصاب اور سال کی تاریخ خود نکالتا ہے، اور زکوٰۃ واجب ہونے پر یاد دہانی کراتا ہے۔
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/zakat-calculator" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">زکوٰۃ کیلکولیٹر ←</Link>
              <Link href="/ur/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">نصاب کیا ہے؟</Link>
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/signup" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">مفت شروع کریں</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
