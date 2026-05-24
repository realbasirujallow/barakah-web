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
  title: 'نصاب — زکوٰۃ کے وجوب کی حد (سونا اور چاندی) 2026',
  description: 'نصاب کیا ہے؟ وہ کم از کم حد جس پر زکوٰۃ فرض ہوتی ہے: 85 گرام سونا یا 595 گرام چاندی۔ سونے اور چاندی کا فرق اور رقم کیوں بدلتی ہے۔',
  keywords: ['نصاب', 'زکوٰۃ کی حد', 'سونے کا نصاب', 'چاندی کا نصاب', '85 گرام سونا', '595 گرام چاندی'],
  alternates: { canonical: L.ur, languages: L },
  openGraph: { title: 'نصاب', description: 'زکوٰۃ کے وجوب کی کم از کم حد: سونا بمقابلہ چاندی، اور رقم کیوں بدلتی ہے۔', url: L.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'نصاب کیا ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'نصاب وہ کم از کم مال ہے جس پر زکوٰۃ فرض ہوتی ہے، یعنی 85 گرام سونا یا 595 گرام چاندی۔' } },
  { '@type': 'Question', name: 'سونا یا چاندی؟', acceptedAnswer: { '@type': 'Answer', text: 'چاندی کا نصاب کم ہے، اس لیے زیادہ لوگ صاحبِ نصاب بنتے ہیں — بہت سے علماء آج احتیاطاً اسی کو ترجیح دیتے ہیں۔' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'ہوم', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'سیکھیں', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'نصاب', item: L.ur },
]};

export default function Page() {
  return (
    <main lang="ur" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">سیکھیں</Link> · <Link href="/learn/nisab" className="underline">English</Link> · <Link href="/fr/learn/nisab" className="underline">Français</Link> · <Link href="/ar/learn/nisab" className="underline">العربية</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">نصاب</h1>
      <p className="mb-4"><strong>نصاب</strong> مال کی کم از کم حد ہے: اگر آپ کا قابلِ زکوٰۃ مال اسے پہنچ جائے اور اس پر قمری سال گزر جائے تو زکوٰۃ فرض ہو جاتی ہے۔</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">دو معیار</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li><strong>سونا:</strong> 85 گرام (تقریباً 7.5 تولہ)</li>
        <li><strong>چاندی:</strong> 595 گرام (تقریباً 52.5 تولہ)</li>
      </ul>
      <p className="mb-4">چونکہ سونے اور چاندی کی قیمتیں روز بدلتی ہیں، نصاب کی رقم بھی بدلتی ہے — اس لیے حساب کے وقت اسے دیکھنا ضروری ہے۔</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">سونا یا چاندی؟</h2>
      <p className="mb-4">چاندی کا نصاب خاصا کم ہے؛ اسے اختیار کرنے سے زیادہ لوگ صاحبِ نصاب بنتے ہیں اور صدقہ بڑھتا ہے — اسی لیے آج بہت سے علماء مخلوط مال رکھنے والوں کے لیے اسی کو ترجیح دیتے ہیں۔</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">اپنا نصاب تازہ قیمت پر دیکھیں</p>
        <p className="mb-3 text-sm">برَکہ سونے کی لائیو قیمت کے ساتھ نصاب ٹریک کرتا ہے اور بتاتا ہے کہ آپ پہنچے یا نہیں۔</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">کیلکولیٹر کھولیں →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">معلومات کے لیے معروف آراء؛ اپنے عالم سے تصدیق کریں۔ برَکہ کسی دینی اتھارٹی کا دعویٰ نہیں کرتا۔</p>
    </main>
  );
}
