import type { Metadata } from 'next';
import Link from 'next/link';
import Calculator from '../../zakat-calculator/Calculator';

const LANGS = {
  en: 'https://trybarakah.com/zakat-calculator',
  fr: 'https://trybarakah.com/fr/zakat-calculator',
  ar: 'https://trybarakah.com/ar/zakat-calculator',
  ur: 'https://trybarakah.com/ur/zakat-calculator',
  'x-default': 'https://trybarakah.com/zakat-calculator',
};

export const metadata: Metadata = {
  title: 'زکوٰۃ کیلکولیٹر 2026 — 60 سیکنڈ میں مفت حساب',
  description:
    'زکوٰۃ کیلکولیٹر مفت اور دستی: لائیو سونے اور چاندی کا نصاب، نقد، اسٹاکس، ریٹائرمنٹ، اور کاروباری اثاثے۔ چاروں مذاہب (حنفی، شافعی، مالکی، حنبلی) کے مطابق۔',
  keywords: ['زکوٰۃ کیلکولیٹر', 'زکوٰۃ کا حساب', 'زکوٰۃ 2026', 'نصاب', 'نقد پر زکوٰۃ', 'سونے پر زکوٰۃ', 'اسلامی فنانس', 'زکوٰۃ کیسے حساب کریں'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'زکوٰۃ کیلکولیٹر 2026 — مفت اور آسان',
    description: 'سونے، چاندی، نقد، اسٹاکس، ریٹائرمنٹ اور کاروباری اثاثوں پر اپنی زکوٰۃ کا حساب کریں۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'website', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'زکوٰۃ کتنی ہوتی ہے؟',
    a: 'زکوٰۃ آپ کے اُس خالص قابلِ زکوٰۃ مال کا 2.5% ہے جو نصاب سے اوپر ہو اور اس پر پورا قمری سال گزر چکا ہو۔ مثلاً اگر آپ کے پاس 10,000 روپے کا قابلِ زکوٰۃ مال ہے تو زکوٰۃ 250 روپے بنتی ہے۔',
  },
  {
    q: 'نصاب کیا ہے اور کیسے طے ہوتا ہے؟',
    a: 'نصاب وہ کم از کم مال ہے جس پر زکوٰۃ فرض ہوتی ہے، اور یہ 85 گرام سونا یا 595 گرام چاندی کے موجودہ بازاری قیمت کے برابر ہے (آپ جو بھی بنیاد منتخب کریں)۔ Barakah دونوں نصاب لائیو دکھاتی ہے۔',
  },
  {
    q: 'کیا اپنے گھر پر زکوٰۃ ہے؟',
    a: 'نہیں۔ آپ کے رہائشی مکان پر زکوٰۃ نہیں ہے — یہ چاروں مذاہب کا متفقہ موقف ہے۔ البتہ کرایہ کی آمدنی یا فروخت کے لیے رکھی پراپرٹی پر زکوٰۃ ہے۔',
  },
  {
    q: 'زکوٰۃ کب ادا کی جائے؟',
    a: 'زکوٰۃ اُس وقت فرض ہوتی ہے جب آپ کا مال نصاب پر مکمل قمری سال (حول) پار کر لے۔ بہت سے مسلمان رمضان میں ادا کرنا پسند کرتے ہیں، لیکن یہ آپ کے حول کی تاریخ پر فرض ہوتی ہے، چاہے وہ کوئی بھی مہینہ ہو۔',
  },
  {
    q: 'کیا ریٹائرمنٹ اکاؤنٹس (401k، IRA، پراویڈنٹ فنڈ) پر زکوٰۃ ہے؟',
    a: 'علماء میں اختلاف ہے۔ ایک عصری طریقہ یہ ہے کہ زکوٰۃ اُس رقم پر حساب کی جائے جو ٹیکس اور ابتدائی برداشت کی جرمانے کے بعد فوری طور پر دستیاب ہو۔ اپنے مسلک کے مطابق مستند عالم سے رجوع کریں۔',
  },
  {
    q: 'زکوٰۃ اور صدقہ میں کیا فرق ہے؟',
    a: 'زکوٰۃ فرض ہے اور اسلام کے ارکان میں سے ہے، یعنی 2.5% نصاب سے اوپر اور حول پورا ہونے پر۔ صدقہ نفلی ہے، کوئی مقدار یا وقت طے نہیں۔ دونوں اہم ہیں، لیکن صرف زکوٰۃ ارکانِ اسلام میں سے ہے۔',
  },
];

const howToSteps = [
  { name: 'نصاب چیک کریں', text: 'اپنا خالص قابلِ زکوٰۃ مال (اثاثے منفی قرض) موجودہ نصاب سے موازنہ کریں جو 85 گرام سونا یا 595 گرام چاندی کی موجودہ بازاری قیمت پر ہے۔ اگر آپ کا مال نصاب سے کم ہے تو زکوٰۃ فرض نہیں۔' },
  { name: 'قابلِ زکوٰۃ مال جوڑیں', text: 'نقد، بچت، سونا، چاندی، اسٹاکس، کاروباری اثاثے، وصول شدہ کرایہ کی آمدنی وغیرہ شامل کریں۔ قیمتی دھاتوں کو موجودہ بازاری قیمت پر شمار کریں۔' },
  { name: 'فوری واجب الادا قرضے گھٹائیں', text: 'فوری واجب الادا قرض (قرضے، کارڈز، فوری ذمہ داریاں) منہا کریں۔ نصاب کا اطلاق خالص رقم پر ہوتا ہے۔' },
  { name: '2.5% لگائیں', text: 'اگر خالص رقم نصاب کو پہنچتی ہے تو اسے 0.025 سے ضرب دیں۔ یہ آپ کی زکوٰۃ ہے۔ 2.5% کا تناسب چاروں مذاہب میں ایک ہے۔' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const howToSchema = {
  '@context': 'https://schema.org', '@type': 'HowTo',
  name: 'زکوٰۃ کیسے حساب کریں', description: 'AAOIFI طریقہ کار اور چاروں مذاہب کی روشنی میں زکوٰۃ کے حساب کا قدم بہ قدم گائیڈ۔',
  step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ہوم', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'زکوٰۃ کیلکولیٹر', item: LANGS.ur },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">ہوم</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">زکوٰۃ کیلکولیٹر</span>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">زکوٰۃ کیلکولیٹر 2026</h1>
            <p className="text-base text-gray-600 mb-6">60 سیکنڈ میں مفت حساب · سونے اور چاندی کا لائیو نصاب · چاروں مذاہب</p>

            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
              <p className="text-base leading-7 text-gray-800">
                زکوٰۃ اسلام کا تیسرا رکن ہے۔ ہر مسلمان جس کا <strong>خالص قابلِ زکوٰۃ مال</strong> نصاب (85 گرام سونا یا 595 گرام چاندی) سے اوپر ہو اور اس پر <strong>پورا قمری سال (حول)</strong> گزر جائے، اُسے اس مال کا <strong>2.5%</strong> ادا کرنا ہے۔ یہ ٹول آپ کے تمام اثاثوں — نقد، سونا، چاندی، اسٹاکس، ریٹائرمنٹ اکاؤنٹس، کاروباری اثاثے وغیرہ پر زکوٰۃ کا حساب لگاتا ہے۔
              </p>
            </section>

            <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm leading-6 text-blue-900">
                <strong>نوٹ:</strong> ذیل کا کیلکولیٹر فی الحال انگریزی میں چل رہا ہے۔ تعداد، لائیو نصاب اور فقہی منطق سب صارفین کے لیے یکساں ہیں؛ انٹرفیس آنے والے ورژن میں ترجمہ کیا جائے گا۔
              </p>
            </section>

            <Calculator />

            <section className="mt-10 mb-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">زکوٰۃ کیسے حساب کریں — قدم بہ قدم</h2>
              <ol className="list-decimal space-y-2 pr-6 text-base leading-7 text-gray-800">
                {howToSteps.map((s) => (
                  <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>
                ))}
              </ol>
            </section>

            <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">عمومی سوالات</h2>
              <div className="space-y-4">
                {faqItems.map((f) => (
                  <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                    <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                    <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-2">فقہی نوٹ</h2>
              <p className="text-sm leading-7 text-amber-900">
                یہ ٹول زیادہ تر اثاثوں پر چاروں مذاہب میں متفق علیہ مواقف اپناتا ہے، اور جہاں اختلاف ہے (مثلاً سونے کے زیورات پر زکوٰۃ مذہب کے مطابق) وہاں اشارہ دیتا ہے۔ خاص معاملات (ریٹائرمنٹ اکاؤنٹس، اسٹاک آپشنز، مرکب کاروبار) کے لیے مستند عالم سے رجوع کریں۔ Barakah فتویٰ جاری نہیں کرتا۔
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-3">مزید جاننے کے لیے</h2>
              <div className="flex flex-wrap gap-2">
                <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">زکوٰۃ کیا ہے؟</Link>
                <Link href="/ur/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">نصاب</Link>
                <Link href="/ur/learn/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">حول</Link>
                <Link href="/ur/learn/types-of-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">زکوٰۃ کی اقسام</Link>
                <Link href="/ur/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">حلال اسٹاکس</Link>
                <Link href="/ur/learn/what-is-sukuk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">صکوک</Link>
              </div>
            </section>

            <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-3 text-xl font-bold">سال در سال اپنی زکوٰۃ ٹریک کریں</h2>
              <p className="mb-4 text-sm leading-7 text-green-100">
                Barakah Plus خود بخود آپ کا حول ٹریک کرتا ہے، روزانہ آپ کے مال کو لائیو نصاب سے موازنہ کرتا ہے، اور تمام اثاثوں — نقد، سونا، اسٹاکس، ریٹائرمنٹ، کاروباری اثاثے وغیرہ پر زکوٰۃ حساب کرتا ہے۔ شروع کرنے کے لیے کریڈٹ کارڈ کی ضرورت نہیں۔
              </p>
              <Link href="/signup?source=ur-zakat-calculator" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
                مفت اکاؤنٹ بنائیں ←
              </Link>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
