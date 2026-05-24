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
  title: 'زکوٰۃ کی اقسام — زکوٰۃ المال اور زکوٰۃ الفطر (2026)',
  description: 'زکوٰۃ کی اقسام: زکوٰۃ المال (مال پر 2.5%) اور زکوٰۃ الفطر (عید کی نماز سے پہلے، فی فرد)۔ کن اموال پر، کتنی، اور کب۔',
  keywords: ['زکوٰۃ کی اقسام', 'زکوٰۃ المال', 'زکوٰۃ الفطر', 'مال پر زکوٰۃ', 'رمضان زکوٰۃ'],
  alternates: { canonical: L.ur, languages: L },
  openGraph: { title: 'زکوٰۃ کی اقسام', description: 'زکوٰۃ المال اور زکوٰۃ الفطر: فرق، اموال، مقدار اور اوقات۔', url: L.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'زکوٰۃ المال اور زکوٰۃ الفطر میں کیا فرق ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'زکوٰۃ المال مال پر 2.5% سالانہ صدقہ ہے۔ زکوٰۃ الفطر ایک مقررہ چھوٹا صدقہ ہے جو عید کی نماز سے پہلے ہر فرد کی طرف سے ادا کیا جاتا ہے۔' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'ہوم', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'سیکھیں', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'زکوٰۃ کی اقسام', item: L.ur },
]};

export default function Page() {
  return (
    <main lang="ur" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">سیکھیں</Link> · <Link href="/learn/types-of-zakat" className="underline">English</Link> · <Link href="/fr/learn/types-of-zakat" className="underline">Français</Link> · <Link href="/ar/learn/types-of-zakat" className="underline">العربية</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">زکوٰۃ کی اقسام</h1>
      <p className="mb-4">زکوٰۃ کی دو بڑی صورتیں ہیں: <strong>زکوٰۃ المال</strong> (مال پر) اور <strong>زکوٰۃ الفطر</strong> (عید الفطر کی نماز سے پہلے)۔</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">1. زکوٰۃ المال</h2>
      <p className="mb-2">نصاب کو پہنچنے اور حول گزرنے والے قابلِ زکوٰۃ مال کا 2.5%۔ اس میں شامل ہے:</p>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>نقدی اور بچت</li>
        <li>سونا اور چاندی</li>
        <li>حصص اور سرمایہ کاری</li>
        <li>مالِ تجارت</li>
        <li>مویشی اور فصلیں (اپنے احکام کے ساتھ)</li>
      </ul>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">2. زکوٰۃ الفطر</h2>
      <p className="mb-4">ایک مقررہ چھوٹا صدقہ جو گھر کے <strong>ہر فرد</strong> کی طرف سے عید کی نماز سے پہلے ادا کیا جاتا ہے، یعنی غالب غذائی جنس کا ایک صاع (تقریباً 2.5–3 کلو) یا اس کی قیمت۔ یہ روزے کو پاک کرتا اور عید کے دن محتاجوں کو کفایت دیتا ہے۔</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">اپنی زکوٰۃ المال شمار کریں</p>
        <p className="mb-3 text-sm">ہر قسم کے مال کے لیے، تازہ نصاب اور حول کی نگرانی کے ساتھ۔</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">کیلکولیٹر کھولیں →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">معلومات کے لیے معروف آراء؛ اپنے عالم سے تصدیق کریں۔ برَکہ کسی دینی اتھارٹی کا دعویٰ نہیں کرتا۔</p>
    </main>
  );
}
