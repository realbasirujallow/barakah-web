import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/halal-budgeting',
  fr: 'https://trybarakah.com/fr/learn/halal-budgeting',
  ar: 'https://trybarakah.com/ar/learn/halal-budgeting',
  ur: 'https://trybarakah.com/ur/learn/halal-budgeting',
  'x-default': 'https://trybarakah.com/learn/halal-budgeting',
};

export const metadata: Metadata = {
  title: 'حلال بجٹ — شریعت کے مطابق مال کا انتظام 2026',
  description:
    'مسلم گھرانے کے بجٹ کا عملی خاکہ: زکوٰۃ اور واجبات کو مقدم رکھنا، سود سے بچنا، ضروریات اور خواہشات میں فرق، اعتدال، اور صدقے کے لیے حصہ مقرر کرنا، Barakah کے ٹولز کے ساتھ۔',
  keywords: ['حلال بجٹ', 'اسلامی مال کا انتظام', 'مسلم گھرانے کا بجٹ', 'حلال خرچ', 'بلا سود بجٹ', 'اسلامی بجٹ ایپ'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'حلال بجٹ — شریعت کے مطابق مال کا انتظام 2026',
    description: 'مسلم گھرانے کے بجٹ کا عملی خاکہ: زکوٰۃ پہلے، سود سے بچاؤ، اعتدال، اور صدقے کے لیے حصہ۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'بجٹ کو "حلال" کیا چیز بناتی ہے؟',
    a: 'حلال بجٹ محض اعداد نہیں بلکہ مقاصدِ شریعت کے مطابق ترجیحات کی ترتیب ہے: آمدنی حلال ہو، زکوٰۃ اور نفقہ جیسے واجب حقوق مقدم ہوں، بچت اور قرض میں سود سے بچا جائے، خرچ میں اعتدال ہو (نہ اسراف نہ بخل)، اور صدقے کے لیے حصہ مقرر ہو۔ یہ مالی نظم و ضبط اور نیکی کی نیت کو یکجا کرتا ہے۔',
  },
  {
    q: 'اسلامی طور پر خرچ کی ترجیحات کیسے ترتیب دوں؟',
    a: 'تجویز کردہ ترتیب: (1) حلال آمدنی، پھر (2) واجب حقوق (زکوٰۃ، نفقہ، واجب قرض)، پھر (3) بنیادی ضروریات (رہائش، خوراک، تعلیم، صحت)، پھر (4) ہنگامی فنڈ اور حلال سرمایہ کاری، پھر (5) صدقہ و خیرات، پھر (6) جائز آسائشیں اعتدال کے ساتھ۔ اصول: واجب پہلے، ضرورت اس کے بعد، آسائش سب سے آخر میں۔',
  },
  {
    q: 'کیا سود سے بچنا حلال بجٹ کا حصہ ہے؟',
    a: 'جی ہاں، یہ بنیادی رکن ہے۔ حلال بجٹ قرض اور بچت میں سود سے بچتا ہے، موجودہ سودی قرضوں کی ادائیگی کی کوشش کرتا ہے، اور شریعت کے مطابق متبادل اختیار کرتا ہے۔ اچھی مالی منصوبہ بندی سودی قرض کی ضرورت کو ویسے ہی کم کر دیتی ہے۔',
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
    { '@type': 'ListItem', position: 3, name: 'حلال بجٹ', item: LANGS.ur },
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
          <span className="text-gray-900">حلال بجٹ</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            دستیاب زبانیں:{' '}
            <Link href="/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/fr/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">Français</Link> ·{' '}
            <Link href="/ar/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">العربية</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">حلال بجٹ</h1>
          <p className="text-base text-gray-600 mb-6">آخری نظرثانی: 2026-06-09 · یہ معلوماتی صفحہ علماء سے رجوع کا متبادل نہیں</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-8 text-gray-800">
              حلال بجٹ مقاصدِ شریعت کے مطابق ترجیحات کی ترتیب ہے: <strong>حلال آمدنی</strong>، پھر <strong>واجبات</strong> جیسے زکوٰۃ و نفقہ،
              پھر <strong>ضروریات</strong>، پھر <strong>حلال بچت و سرمایہ کاری</strong>، پھر <strong>صدقہ</strong>، پھر اعتدال کے ساتھ آسائشیں — اور ان سب میں سود سے بچاؤ۔
              یہ نظم و ضبط اور نیکی کی نیت کو ملا کر مال میں برکت کی راہ کھولتا ہے۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">ترجیحات کے مطابق خرچ کا خاکہ</h2>
            <ol className="list-decimal space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>حلال آمدنی:</strong> حلال کمائی سے آغاز — یہی برکت کی بنیاد ہے۔</li>
              <li><strong>واجب حقوق:</strong> زکوٰۃ، اہل و عیال کا نفقہ، اور واجب قرض۔</li>
              <li><strong>بنیادی ضروریات:</strong> رہائش، خوراک، تعلیم، صحت، آمد و رفت۔</li>
              <li><strong>حلال بچت و سرمایہ کاری:</strong> پہلے ہنگامی فنڈ، پھر شریعت کے مطابق سرمایہ کاری۔</li>
              <li><strong>صدقہ و خیرات:</strong> اس کے لیے ایک مقررہ حصہ رکھیں، خواہ تھوڑا ہی ہو۔</li>
              <li><strong>جائز آسائشیں:</strong> اعتدال کے ساتھ، اسراف اور فضول خرچی کے بغیر۔</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">حلال بجٹ کے رہنما اصول</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>سود سے بچاؤ:</strong> قرض اور بچت میں، اور سودی قرضوں کی ادائیگی کی کوشش۔</li>
              <li><strong>اعتدال:</strong> نہ اسراف نہ بخل — بہترین راہ میانہ روی ہے۔</li>
              <li><strong>واجب کو مقدم رکھنا:</strong> زکوٰۃ اور نفقہ آسائشوں سے پہلے۔</li>
              <li><strong>نیکی کی نیت:</strong> اہل و عیال پر خرچ اور صلہ رحمی پر بھی اجر ہے۔</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">تنبیہ</h2>
            <p className="text-sm leading-8 text-amber-900">
              یہ اسلامی نقطۂ نظر سے مال کے انتظام کے عمومی اصول ہیں، اور Barakah فتویٰ جاری نہیں کرتا۔ خاص مسائل (جیسے زکوٰۃ کا حساب یا کسی مالی مصنوعہ کا حکم) کے لیے کسی مستند عالم سے رجوع کریں۔
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Barakah میں اپنا حلال بجٹ بنائیں</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              Barakah ایسا بجٹ بنانے میں مدد دیتا ہے جو زکوٰۃ اور واجبات کو مقدم رکھے، آپ کے معاملات میں سود کے مصادر پہچانے، اور آپ کے صدقات اور زکوٰۃ کو ایک جگہ ٹریک کرے۔
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/zakat-calculator" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">زکوٰۃ کیلکولیٹر ←</Link>
              <Link href="/ur/learn/riba-elimination" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">سود سے نجات</Link>
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/signup" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">مفت شروع کریں</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
