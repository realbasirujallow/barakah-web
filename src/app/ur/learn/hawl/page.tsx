import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/hawl',
  fr: 'https://trybarakah.com/fr/learn/hawl',
  ar: 'https://trybarakah.com/ar/learn/hawl',
  ur: 'https://trybarakah.com/ur/learn/hawl',
  'x-default': 'https://trybarakah.com/learn/hawl',
};

export const metadata: Metadata = {
  title: 'حول کیا ہے؟ زکوٰۃ کے قمری سال کی وضاحت (2026)',
  description:
    'حول کیا ہے؟ زکوٰۃ کے قمری سال کی تعریف، یہ کب شروع ہوتا ہے، کس بات سے ٹوٹتا ہے، اور اپنی زکوٰۃ کی تاریخ کو کیسے ٹریک کریں۔',
  keywords: ['حول کیا ہے', 'حول', 'زکوٰۃ کا قمری سال', 'زکوٰۃ کب فرض ہوتی ہے', 'حول کا حساب'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'حول کیا ہے؟ زکوٰۃ کے قمری سال کی وضاحت',
    description: 'حول کیسے حساب ہوتا ہے، کب شروع ہوتا ہے، کس بات سے ٹوٹتا ہے، اور اپنی زکوٰۃ کی تاریخ کیسے ٹریک کریں۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'زکوٰۃ میں حول کیا ہے؟',
    a: 'حول وہ قمری سال (تقریباً 354 دن) ہے جس میں آپ کے قابلِ زکوٰۃ مال کو نصاب سے اوپر برقرار رہنا چاہیے تاکہ زکوٰۃ فرض ہو۔ یہ ہجری کیلنڈر کے مطابق گنا جاتا ہے، عیسوی نہیں۔',
  },
  {
    q: 'حول کب شروع ہوتا ہے؟',
    a: 'حول اُس دن سے شروع ہوتا ہے جب آپ کا قابلِ زکوٰۃ مال پہلی مرتبہ نصاب کو پہنچتا ہے۔ اسی تاریخ سے ایک پورا قمری سال شمار کیا جاتا ہے۔ اگر سال کے اختتام پر آپ کا مال اب بھی نصاب سے اوپر ہو تو اُسی دن اپنے خالص قابلِ زکوٰۃ مال کا 2.5% ادا کریں گے۔',
  },
  {
    q: 'حول کس بات سے ٹوٹتا ہے؟',
    a: 'اگر سال کے دوران آپ کا قابلِ زکوٰۃ مال نصاب سے کم ہو جائے تو حول ٹوٹ جاتا ہے۔ نیا حول اُسی وقت شروع ہوگا جب مال دوبارہ نصاب سے اوپر چلا جائے۔ عام اخراجات کی وجہ سے ہونے والی بہت مختصر کمی کو فقہا عام طور پر حول کے ٹوٹنے کا سبب نہیں مانتے، بشرطیکہ آپ جلد دوبارہ نصاب سے اوپر آ جائیں۔',
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
    { '@type': 'ListItem', position: 3, name: 'حول کیا ہے؟', item: LANGS.ur },
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
          <span className="text-gray-900">حول کیا ہے؟</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">زکوٰۃ میں حول کیا ہے؟</h1>
          <p className="text-base text-gray-600 mb-6">زکوٰۃ کے قمری سال کی وضاحت — 2026</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-7 text-gray-800">
              حول (حَوْل) ایک مکمل قمری سال (تقریباً 354 دن) کی مدت ہے جس میں آپ کے قابلِ زکوٰۃ مال کو نصاب سے اوپر برقرار رہنا چاہیے تاکہ زکوٰۃ فرض ہو۔ یہ ہجری کیلنڈر کے مطابق شمار کیا جاتا ہے۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">حول کیسے حساب کیا جاتا ہے؟</h2>
            <ol className="list-decimal space-y-2 pr-6 text-base leading-7 text-gray-800">
              <li>آپ کا قابلِ زکوٰۃ مال (نقد، سونا، چاندی، حصص، وغیرہ) پہلی مرتبہ نصاب کو پہنچتا ہے۔ یہی تاریخ آپ کی «حول کی تاریخ» بن جاتی ہے۔</li>
              <li>اُس تاریخ سے ایک پورا قمری سال شمار کیا جاتا ہے۔</li>
              <li>اگر سال کے اختتام پر مال اب بھی نصاب سے اوپر ہو تو اُسی دن اپنے خالص قابلِ زکوٰۃ مال کا 2.5% ادا کریں۔</li>
              <li>اگر سال کے دوران مال نصاب سے کم ہو جائے تو حول ٹوٹ جاتا ہے، اور دوبارہ نصاب سے اوپر جاتے ہی نیا حول شروع ہوگا۔</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">حول کو توڑنے والی چیزیں</h2>
            <ul className="list-disc space-y-1 pr-6 text-base leading-7 text-gray-800">
              <li>قابلِ زکوٰۃ مال کا نصاب سے مستقل کم ہو جانا۔</li>
              <li>غیر ارادی نقصان یا ہلاک ہو جانا (خاص حالت، علماء سے رجوع کریں)۔</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              مہینے کے دوران معمولی بل اور عام اخراجات کی وجہ سے ہونے والی بہت مختصر کمی کو عام طور پر حول کے ٹوٹنے کا سبب نہیں سمجھا جاتا، بشرطیکہ آپ جلد نصاب سے اوپر واپس آ جائیں۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">اپنا حول کیسے ٹریک کریں</h2>
            <p className="text-base leading-7 text-gray-800">
              وہ ہجری تاریخ نوٹ کر لیں جس دن آپ کا مال پہلی مرتبہ نصاب سے اوپر گیا۔ اگلے سال اُسی تاریخ کو اپنے قابلِ زکوٰۃ مال کا حساب کر کے 2.5% ادا کریں۔ Barakah یہ سب خود بخود کرتا ہے: لائیو نصاب قیمتیں، عیسوی ↔ ہجری تبدیلی، اور ادائیگی سے پہلے یاد دہانیاں۔
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">مزید جاننے کے لیے</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah روزانہ آپ کے قابلِ زکوٰۃ مال کا لائیو نصاب سے موازنہ کرتا ہے اور آپ کو زکوٰۃ کی تاریخ سے پہلے مطلع کرتا ہے۔
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/ur/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">نصاب</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">مفت شروع کریں ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
