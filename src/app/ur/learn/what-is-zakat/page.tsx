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
  title: 'زکوٰۃ کیا ہے؟ مکمل گائیڈ 2026 — احکام، حساب اور کس پر فرض ہے',
  description:
    'زکوٰۃ کیا ہے؟ مکمل گائیڈ: تعریف، پانچ شرائط، نصاب، ہر قسم کے مال پر 2.5% کا حساب، کس پر فرض ہے اور کب۔ مفت زکوٰۃ کیلکولیٹر کے ساتھ۔',
  keywords: ['زکوٰۃ کیا ہے', 'زکوٰۃ کے احکام', 'زکوٰۃ کا حساب', 'نصاب', 'حول', 'زکوٰۃ 2.5%', 'زکوٰۃ کس پر فرض ہے'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'زکوٰۃ کیا ہے؟ مکمل گائیڈ 2026',
    description: 'زکوٰۃ کے بارے میں ہر ضروری بات: شرائط، نصاب، 2.5% کا حساب، قابلِ زکوٰۃ مال، اور ادائیگی کا وقت۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'اسلام میں زکوٰۃ کیا ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'زکوٰۃ اسلام کا تیسرا رکن ہے — ایک سالانہ فرض صدقہ جو صاحبِ نصاب مسلمان اپنے قابلِ زکوٰۃ مال پر ادا کرتے ہیں۔ لفظ «زکوٰۃ» کا مطلب پاکیزگی اور بڑھوتری ہے۔ جس کا مال نصاب کو پہنچ جائے وہ ہر قمری سال (حول) اپنے خالص قابلِ زکوٰۃ مال کا 2.5% ادا کرتا ہے۔' } },
    { '@type': 'Question', name: 'زکوٰۃ کتنی ہوتی ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'زکوٰۃ آپ کے اُس خالص قابلِ زکوٰۃ مال کا 2.5% ہے جو نصاب سے اوپر ہو اور اس پر پورا قمری سال گزر چکا ہو۔' } },
    { '@type': 'Question', name: 'نصاب کیا ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'نصاب وہ کم از کم مال ہے جس پر زکوٰۃ فرض ہوتی ہے، یعنی 85 گرام سونا یا 595 گرام چاندی، اور یہ ان کی قیمتوں کے ساتھ بدلتا رہتا ہے۔' } },
  ],
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ہوم', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'سیکھیں', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'زکوٰۃ کیا ہے؟', item: LANGS.ur },
  ],
};

export default function Page() {
  return (
    <main lang="ur" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">سیکھیں</Link> · دستیاب زبانیں: <Link href="/learn/what-is-zakat" className="underline">English</Link> · <Link href="/fr/learn/what-is-zakat" className="underline">Français</Link> · <Link href="/ar/learn/what-is-zakat" className="underline">العربية</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">زکوٰۃ کیا ہے؟</h1>

      <p className="mb-4"><strong>زکوٰۃ</strong> اسلام کا تیسرا رکن ہے: ایک سالانہ فرض صدقہ جو صاحبِ نصاب مسلمان اپنے قابلِ زکوٰۃ مال پر ادا کرتے ہیں۔ اس کا مطلب «پاکیزگی» اور «بڑھوتری» ہے — ادائیگی سے باقی مال پاک ہو جاتا ہے۔</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">مقدار: 2.5%</h2>
      <p className="mb-4">زکوٰۃ آپ کے <strong>خالص قابلِ زکوٰۃ مال کا 2.5%</strong> ہے جو <em>نصاب</em> سے اوپر ہو اور اس پر پورا <em>حول</em> گزر چکا ہو۔ یہ آپ کی آمدنی کا نہیں بلکہ مال کا 2.5% ہے۔</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">پانچ شرائط</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>مسلمان ہونا</li>
        <li>مال کا <strong>نصاب</strong> کو پہنچنا</li>
        <li>مال پر مکمل ملکیت</li>
        <li>پورا قمری <strong>حول</strong> گزرنا</li>
        <li>مال کا بنیادی ضروریات سے زائد ہونا</li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">نصاب</h2>
      <p className="mb-4">نصاب کم از کم حد ہے: <strong>85 گرام سونا</strong> یا <strong>595 گرام چاندی</strong> کے برابر۔ قیمتیں بدلتی رہتی ہیں اس لیے رقم بھی بدلتی ہے — اسی لیے حساب کے وقت اسے دیکھنا ضروری ہے۔</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">قابلِ زکوٰۃ مال</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>نقدی اور بچت کھاتے</li>
        <li>سونا اور چاندی</li>
        <li>حصص اور سرمایہ کاری (قابلِ زکوٰۃ حصہ)</li>
        <li>ریٹائرمنٹ اکاؤنٹس (رسائی کے مطابق)</li>
        <li>مالِ تجارت اور وصول طلب قرضے</li>
      </ul>
      <p className="mb-4">رہائشی گھر، ذاتی گاڑی اور ذاتی سامان پر زکوٰۃ نہیں۔</p>

      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">اپنی زکوٰۃ مفت شمار کریں</p>
        <p className="mb-3 text-sm">سال بھر اپنا نصاب اور حول ٹریک کریں اور ٹھیک دن پر ٹھیک رقم حاصل کریں۔</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">زکوٰۃ کیلکولیٹر کھولیں →</Link>
      </div>

      <p className="text-xs text-gray-500 mt-8">یہ مضمون معلومات کے لیے معروف آراء پیش کرتا ہے؛ براہِ کرم اپنے عالم سے تصدیق کریں۔ برَکہ کسی دینی اتھارٹی کا دعویٰ نہیں کرتا۔</p>
    </main>
  );
}
