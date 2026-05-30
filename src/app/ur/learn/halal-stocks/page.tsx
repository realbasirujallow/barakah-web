import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/halal-stocks',
  fr: 'https://trybarakah.com/fr/learn/halal-stocks',
  ar: 'https://trybarakah.com/ar/learn/halal-stocks',
  ur: 'https://trybarakah.com/ur/learn/halal-stocks',
  'x-default': 'https://trybarakah.com/learn/halal-stocks',
};

export const metadata: Metadata = {
  title: 'حلال اسٹاکس 2026 — شریعت کے مطابق اسٹاکس کیسے چیک کریں',
  description:
    'حلال اسٹاکس کا عملی گائیڈ: AAOIFI معیار 21 کے مطابق شرعی اسکریننگ، کاروباری اور مالی فلٹر، قرض اور سود کی نسبتیں، اور غیر جائز آمدنی پر تطہیر کا حساب۔',
  keywords: ['حلال اسٹاکس', 'شریعت سے ہم آہنگ اسٹاکس', 'حلال سرمایہ کاری', 'AAOIFI 21', 'اسلامی اسٹاک اسکریننگ', 'پاکستان حلال اسٹاکس', 'تطہیر منافع'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'حلال اسٹاکس 2026 — شریعت کی اسکریننگ',
    description: 'AAOIFI معیار 21 کے مطابق اسٹاکس کی شرعی جانچ، مالی نسبتیں اور تطہیر کا حساب۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'کوئی اسٹاک حلال کیسے ہوتا ہے؟',
    a: 'اسٹاک حلال تب ہوتا ہے جب کمپنی دو اسکریننگ پاس کرے: (۱) کاروباری اسکریننگ (آمدنی کا کوئی بڑا حصہ شراب، جوا، روایتی بینکنگ، سود پر مبنی انشورنس، خنزیر، اسلحہ، یا فحش مواد سے نہ ہو) اور (۲) AAOIFI معیار 21 کے مطابق مالی نسبتیں (سود والا قرض کل مارکیٹ کیپ کے 30% سے کم، سود والی سیکیورٹیز اور نقد 30% سے کم، اور غیر جائز آمدنی کل آمدنی کے 5% سے کم)۔ یہ نسبتیں ہر سہ ماہی بدلتی ہیں۔',
  },
  {
    q: 'AAOIFI معیار 21 کیا ہے؟',
    a: 'AAOIFI معیار 21 (Accounting and Auditing Organization for Islamic Financial Institutions) شرعی اسٹاک اسکریننگ کا بین الاقوامی معیار ہے جسے زیادہ تر اسلامی فنڈز اور انڈیکس استعمال کرتے ہیں۔ یہ کاروباری ممنوعات، تین مالی نسبتیں، اور تطہیر کے حساب کا طریقہ کار طے کرتا ہے۔ دیگر معیارات (MSCI، S&P، FTSE Russell) بھی موجود ہیں لیکن حد کے فرق کے ساتھ۔',
  },
  {
    q: 'کیا حلال اسٹاکس کے منافع پر تطہیر ضروری ہے؟',
    a: 'جی ہاں۔ یہاں تک کہ جب کمپنی شرعی اسکریننگ پاس کر لے، پھر بھی اس کی آمدنی کا چھوٹا حصہ غیر جائز ذرائع (سود وغیرہ) سے آتا ہے۔ علماء کے مطابق آپ کو منافع یا کیپٹل گین کے اسی غیر جائز حصے کو ثواب کی نیت کے بغیر صدقہ کر دینا ہوتا ہے۔ تطہیر کا فیصد ہر سہ ماہی کمپنی کے غیر جائز آمدنی کے انکشاف سے نکالا جاتا ہے۔',
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
    { '@type': 'ListItem', position: 3, name: 'حلال اسٹاکس', item: LANGS.ur },
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
          <span className="text-gray-900">حلال اسٹاکس</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">حلال اسٹاکس 2026</h1>
          <p className="text-base text-gray-600 mb-6">آخری جائزہ: 2026-05-28 · AAOIFI معیار 21 کی طرز</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-7 text-gray-800">
              حلال اسٹاک وہ ہے جو دو اسکریننگ پاس کرے: <strong>کاروباری</strong> (آمدنی ممنوعہ ذرائع سے نہ ہو) اور <strong>مالی نسبتیں</strong> AAOIFI معیار 21 کے مطابق۔ پاس ہونے پر بھی غیر جائز آمدنی کے چھوٹے حصے کی <strong>تطہیر</strong> ضروری ہے۔ نسبتیں ہر سہ ماہی بدلتی ہیں — خریدنے سے پہلے موجودہ حالت چیک کریں۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">مرحلہ 1: کاروباری اسکریننگ</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">کمپنیاں اس وقت خارج ہو جاتی ہیں جب ان کی نمایاں آمدنی درج ذیل سے ہو:</p>
            <ul className="list-disc space-y-1 pr-6 text-base leading-7 text-gray-800">
              <li>شراب اور الکحل والی مصنوعات</li>
              <li>جوا</li>
              <li>روایتی بینک اور سود پر مبنی انشورنس</li>
              <li>سور اور اس کی مصنوعات</li>
              <li>اسلحے کی صنعت (بعض معیارات میں)</li>
              <li>فحش یا حرام مواد</li>
              <li>تمباکو (بعض معیارات میں)</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              AAOIFI 5% سے کم غیر جائز آمدنی کو تطہیر کے ساتھ برداشت کرتا ہے، کیونکہ بڑی کمپنیاں اس سے مکمل طور پر خالی نہیں ہوتیں۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">مرحلہ 2: AAOIFI مالی نسبتیں</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-right">
                    <th className="p-3 font-semibold text-gray-700">نسبت</th>
                    <th className="p-3 font-semibold text-gray-700">حد</th>
                    <th className="p-3 font-semibold text-gray-700">مقام</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">سود والا قرض</td><td className="p-3">&lt; 30%</td><td className="p-3">12 ماہ کا اوسط مارکیٹ کیپ</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">سود والی سیکیورٹیز + نقد</td><td className="p-3">&lt; 30%</td><td className="p-3">مارکیٹ کیپ</td></tr>
                  <tr><td className="p-3 font-semibold">غیر جائز آمدنی</td><td className="p-3">&lt; 5%</td><td className="p-3">کل آمدنی</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              قیمت کے ساتھ مارکیٹ کیپ بدلتی ہے، تو ایک سہ ماہی پاس ہونے والا اسٹاک اگلی میں ناکام بھی ہو سکتا ہے۔ باقاعدہ جانچ ضروری ہے۔
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">منافع کی تطہیر</h2>
            <p className="text-base leading-7 text-gray-800">
              اسکریننگ پاس ہونے کے بعد بھی، آمدنی کا چھوٹا حصہ غیر جائز ذرائع سے آتا ہے۔ مسلمان سرمایہ کار کو اپنے حصے کی اس غیر جائز نسبت کو منافع یا کیپٹل گین سے <em>تطہیر</em> کرنا ہوتا ہے یعنی ثواب کی نیت کے بغیر صدقہ کر دینا۔ تطہیر کی رقم کمپنی کی سہ ماہی غیر جائز آمدنی کے انکشاف سے حساب کی جاتی ہے۔
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">فقہی نوٹ</h2>
            <p className="text-sm leading-7 text-amber-900">
              یہ صفحہ معلوماتی ہے اور AAOIFI معیار اور تسلیم شدہ اسکریننگ طریقہ کار پر مبنی ہے۔ بعض علماء کرام کی مخصوص حدود یا تطہیر کے طریقوں میں اختلاف ہے۔ آپ کی اپنی حالت کے بارے میں مستند عالم سے رابطہ ضروری ہے۔ Barakah فتویٰ جاری نہیں کرتا۔
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Barakah میں اسٹاکس کی جانچ کریں</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah Plus امریکی، برطانوی اور خلیجی اسٹاکس پر AAOIFI 21 لائیو اسکریننگ چلاتا ہے، تطہیر کی رقم خود بخود حساب کرتا ہے، اور آپ کی پورٹ فولیو زکوٰۃ سال در سال ٹریک کرتا ہے۔
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/ur/learn/what-is-sukuk" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">صکوک</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">مفت شروع کریں ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
