import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/riba-elimination',
  fr: 'https://trybarakah.com/fr/learn/riba-elimination',
  ar: 'https://trybarakah.com/ar/learn/riba-elimination',
  ur: 'https://trybarakah.com/ur/learn/riba-elimination',
  'x-default': 'https://trybarakah.com/learn/riba-elimination',
};

export const metadata: Metadata = {
  title: 'سود (ربا) سے نجات کیسے پائیں — عملی رہنمائی 2026',
  description:
    'سود کیا ہے، اس کی اقسام (ربا النسیئہ اور ربا الفضل)، آج کی مالی زندگی میں یہ کہاں چھپا ہوتا ہے، اور اس سے نجات اور موصول شدہ سود کی تطہیر کے عملی اقدامات، Barakah کے ٹولز کے ساتھ۔',
  keywords: ['سود', 'ربا', 'سود سے نجات', 'بینک سود حرام', 'سود کی تطہیر', 'بلا سود فنانس', 'ربا النسیئہ'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'سود (ربا) سے نجات کیسے پائیں — عملی رہنمائی 2026',
    description: 'سود کی اقسام، آج کی مالی زندگی میں یہ کہاں چھپا ہے، اور اس سے نجات اور تطہیر کے عملی اقدامات۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'ربا (سود) کیا ہے؟',
    a: 'ربا یعنی بعض معاملات میں مقررہ حرام اضافہ۔ اس کی دو بڑی اقسام ہیں: ربا النسیئہ (مدت کے بدلے مشروط اضافہ، جیسے قرض پر سود) اور ربا الفضل (ایک ہی جنس کے تبادلے میں کمی بیشی، جیسے سونے کے بدلے سونا کم زیادہ)۔ سود کی حرمت قرآن و سنت اور علماء کے اجماع سے ثابت ہے؛ اختلاف صرف بعض جدید معاملات پر اس کے انطباق میں ہوتا ہے۔',
  },
  {
    q: 'آج میری مالی زندگی میں سود کہاں چھپا ہے؟',
    a: 'سب سے عام صورتیں: بچت کھاتوں کا سود، کریڈٹ کارڈ کا سود، ذاتی اور گاڑی کے سودی قرضے، روایتی سودی مارگیج، سودی بانڈز، اور تاخیر پر سود کے طور پر لگنے والے جرمانے۔ پہلا قدم یہ ہے کہ آپ اپنے معاملات میں ان مصادر کو پہچانیں۔',
  },
  {
    q: 'جو سود میرے کھاتے میں پہلے ہی آ چکا، اس کا کیا کروں؟',
    a: 'بہت سے علماء کے نزدیک موصول شدہ سود سے فائدہ اٹھانا جائز نہیں؛ اسے ثواب کی نیت کے بغیر، محض حرام سے جان چھڑانے کے لیے، غریبوں اور رفاہی کاموں پر خرچ کر دیا جائے۔ آپ کا اصل سرمایہ آپ ہی کا ہے۔ اپنی صورتِ حال کے لیے کسی مستند عالم سے رجوع کریں۔',
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
    { '@type': 'ListItem', position: 3, name: 'سود سے نجات', item: LANGS.ur },
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
          <span className="text-gray-900">سود سے نجات</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            دستیاب زبانیں:{' '}
            <Link href="/learn/riba-elimination" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/fr/learn/riba-elimination" className="underline hover:text-[#1B5E20]">Français</Link> ·{' '}
            <Link href="/ar/learn/riba-elimination" className="underline hover:text-[#1B5E20]">العربية</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">سود (ربا) سے نجات</h1>
          <p className="text-base text-gray-600 mb-6">آخری نظرثانی: 2026-06-09 · یہ معلوماتی صفحہ فتویٰ نہیں دیتا</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-8 text-gray-800">
              ربا (سود) ایک حرام اضافہ ہے، اور اس کی حرمت قرآن، سنت اور اجماعِ امت سے ثابت ہے۔ اس سے نجات تین مرحلوں کا سفر ہے:
              اپنے معاملات میں سود کے مصادر کو <strong>پہچاننا</strong>، سودی قرضوں کو <strong>روکنا اور ادا کرنا</strong>،
              اور کھاتے میں آئے ہوئے سود کو ثواب کی نیت کے بغیر خرچ کر کے <strong>تطہیر کرنا</strong>۔ Barakah اسی میں آپ کی مدد کے لیے بنایا گیا ہے۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">ربا کی اقسام</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>ربا النسیئہ:</strong> مدت کے بدلے قرض پر مشروط اضافہ — جدید قرضوں کے سود کی اصل۔</li>
              <li><strong>ربا الفضل:</strong> ایک ہی جنس کے دست بدست تبادلے میں کمی بیشی (جیسے سونے کے بدلے سونا کم زیادہ)۔</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">آج سود کہاں چھپا ہے؟</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li>بچت کھاتوں اور ڈپازٹ کا سود۔</li>
              <li>کریڈٹ کارڈ اور ذاتی قرضوں کا سود۔</li>
              <li>روایتی سودی مارگیج۔</li>
              <li>سودی بانڈز اور فکسڈ انکم آلات۔</li>
              <li>تاخیر پر سود کے طور پر لگنے والے جرمانے۔</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">نجات کے عملی اقدامات</h2>
            <ol className="list-decimal space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>پہچانیں:</strong> اپنے معاملات کا جائزہ لیں اور ہر سودی آمدنی یا خرچ کی نشاندہی کریں۔</li>
              <li><strong>نیا روکیں:</strong> سودی مصنوعات بند کریں اور شریعت کے مطابق متبادل اپنائیں۔</li>
              <li><strong>پہلے بھاری ادا کریں:</strong> سب سے مہنگے سودی قرض سے شروع کر کے ادائیگی کا منصوبہ بنائیں۔</li>
              <li><strong>تطہیر کریں:</strong> موصول شدہ سود کو ثواب کی نیت کے بغیر غریبوں پر خرچ کریں۔</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">فقہی تنبیہ</h2>
            <p className="text-sm leading-8 text-amber-900">
              اصل سود کی حرمت اجماعی ہے، البتہ کسی خاص معاملے پر اس کے انطباق میں غور و تفصیل درکار ہو سکتی ہے۔ یہ ایک معلوماتی صفحہ ہے اور Barakah فتویٰ جاری نہیں کرتا؛
              اپنی صورتِ حال اور مالی مصنوعات کے بارے میں کسی مستند عالم سے رہنمائی لیں۔
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Barakah میں سود پہچانیں اور تطہیر ٹریک کریں</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              Barakah آپ کے معاملات میں سود کے مصادر خودکار طور پر پہچانتا ہے، سودی قرضوں سے نجات کے اہداف بنانے میں مدد دیتا ہے، اور تطہیر کی رقم ٹریک کرتا ہے تاکہ آپ اپنے مال کی پاکیزگی پر مطمئن رہیں۔
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/ur/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">حلال اسٹاکس</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">مفت شروع کریں ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
