import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/what-is-sukuk',
  fr: 'https://trybarakah.com/fr/learn/what-is-sukuk',
  ar: 'https://trybarakah.com/ar/learn/what-is-sukuk',
  ur: 'https://trybarakah.com/ur/learn/what-is-sukuk',
  'x-default': 'https://trybarakah.com/learn/what-is-sukuk',
};

export const metadata: Metadata = {
  title: 'صکوک کیا ہیں؟ اسلامی بانڈز کی آسان وضاحت (2026)',
  description:
    'صکوک کیا ہیں؟ اسلامی سرمایہ کاری کے سرٹیفکیٹس کی آسان رہنمائی — روایتی بانڈز سے فرق، اہم اقسام (اجارہ، مرابحہ، مشارکہ، مضاربہ، وکالہ)، شرعی حیثیت، اور خطرات۔',
  keywords: ['صکوک کیا ہیں', 'صکوک', 'اسلامی بانڈز', 'صکوک حلال', 'اجارہ صکوک', 'صکوک کی اقسام'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'صکوک کیا ہیں؟ اسلامی بانڈز کی آسان وضاحت (2026)',
    description: 'صکوک کیسے کام کرتے ہیں، روایتی بانڈز سے کیسے مختلف ہیں، ان کی اقسام اور شرعی حیثیت۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const sukukTypes = [
  { name: 'اجارہ صکوک', desc: 'کرائے پر دیے گئے اثاثے کی بنیاد پر؛ ہولڈرز کو کرائے کی آمدنی ملتی ہے۔ سب سے زیادہ مروج قسم۔' },
  { name: 'مرابحہ صکوک', desc: 'لاگت کے ساتھ معلوم منافع پر بیع پر مبنی؛ آمدنی واضح کیے گئے منافع سے آتی ہے۔' },
  { name: 'مشارکہ صکوک', desc: 'شراکت یا مشترکہ منصوبہ؛ ہولڈرز حقیقی نفع و نقصان میں شریک ہوتے ہیں۔' },
  { name: 'مضاربہ صکوک', desc: 'ایک فریق سرمایہ فراہم کرتا ہے، دوسرا کاروبار چلاتا ہے؛ منافع طے شدہ تناسب پر تقسیم ہوتا ہے۔' },
  { name: 'وکالہ صکوک', desc: 'وکیل ہولڈرز کی طرف سے رقم سرمایہ کاری میں لگاتا ہے، فیس اور ہدف شدہ منافع کے بدلے۔' },
];

const faqItems = [
  {
    q: 'آسان الفاظ میں صکوک کیا ہیں؟',
    a: 'صکوک (واحد: صک) اسلامی سرمایہ کاری کے سرٹیفکیٹس ہیں جنہیں اکثر «اسلامی بانڈز» کہا جاتا ہے۔ سود پر قرض دینے کے بجائے، ہر سرٹیفکیٹ کسی حقیقی اثاثے، منصوبے یا کاروبار میں ملکیت کا حصہ ظاہر کرتا ہے، اور ہولڈر اُس اثاثے سے ہونے والی حقیقی آمدنی (کرایہ یا منافع) کا حصہ پاتا ہے — سود نہیں۔',
  },
  {
    q: 'کیا صکوک حلال ہیں؟',
    a: 'ہاں، بشرطیکہ شرعی طور پر درست ساخت دی گئی ہو اور کسی مستند شرعی بورڈ سے منظور ہو۔ انہیں جائز اثاثوں یا سرگرمیوں پر مبنی ہونا چاہیے، حقیقی معاشی خطرہ شیئر کرنا چاہیے، اور سود (ربا)، غیر معمولی غیر یقینی (غرر) اور حرام سرگرمیوں سے پاک ہونا چاہیے۔ کئی سرکاری اور کارپوریٹ صکوک ان شرائط پر پورا اترتے ہیں؛ ہمیشہ ہر اجراء کے ساتھ منسلک فتویٰ دیکھ لیں۔',
  },
  {
    q: 'صکوک اور روایتی بانڈز میں کیا فرق ہے؟',
    a: 'روایتی بانڈ ایک سود پر مبنی قرض ہے — جاری کنندہ کارکردگی سے قطع نظر اصل رقم اور کوپن ادا کرنے کا پابند ہوتا ہے۔ صکوک کسی اثاثے یا منصوبے میں حصے کی نمائندگی کرتے ہیں، اور آمدنی اُسی اثاثے کی حقیقی کمائی پر منحصر ہے۔ معاشی طور پر بعض صکوک (خصوصاً اجارہ) بانڈز کے قریب محسوس ہو سکتے ہیں، لیکن شرعی بنیاد اور خطرے کی نوعیت بنیادی طور پر مختلف ہیں۔',
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
    { '@type': 'ListItem', position: 3, name: 'صکوک کیا ہیں؟', item: LANGS.ur },
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
          <span className="text-gray-900">صکوک کیا ہیں؟</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">صکوک کیا ہیں؟</h1>
          <p className="text-base text-gray-600 mb-6">اسلامی بانڈز کی آسان وضاحت — 2026</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-7 text-gray-800">
              صکوک (واحد: صک) شریعت کے مطابق سرمایہ کاری کے سرٹیفکیٹس ہیں جو کسی اثاثے، منصوبے یا کاروبار میں ملکیت کا حصہ ظاہر کرتے ہیں، نہ کہ سود پر قرض۔ ہولڈرز کوپن سود کے بجائے حقیقی آمدنی (کرایہ یا منافع) کا اپنا حصہ پاتے ہیں۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">صکوک کی اہم اقسام</h2>
            <ul className="space-y-2 text-base leading-7 text-gray-800">
              {sukukTypes.map((t) => (
                <li key={t.name}><strong>{t.name}</strong> — {t.desc}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">کیا صکوک حلال ہیں؟</h2>
            <p className="text-base leading-7 text-gray-800">
              اگر شرعی طور پر درست ساخت دی گئی ہو اور مستند شرعی بورڈ سے منظور ہوں تو صکوک حلال ہیں۔ انہیں جائز اثاثوں یا سرگرمیوں پر مبنی ہونا چاہیے، حقیقی معاشی خطرہ شیئر کرنا چاہیے، اور سود (ربا)، غیر معمولی غیر یقینی (غرر) اور حرام سرگرمیوں سے پاک ہونا چاہیے۔ ہر اجراء کے ساتھ منسلک فتویٰ ضرور دیکھیں۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">جاننے کے قابل خطرات</h2>
            <ul className="list-disc space-y-1 pr-6 text-base leading-7 text-gray-800">
              <li>بنیادی اثاثے کا خطرہ (خالی رہنا، کرایہ دار کا ڈیفالٹ، قدر میں کمی)۔</li>
              <li>جاری کنندہ کا سرکاری یا قرضی خطرہ۔</li>
              <li>سیکنڈری مارکیٹ کا خطرہ — لیکویڈیٹی جاری کنندہ کے مطابق مختلف ہوتی ہے۔</li>
              <li>تعمیل کا خطرہ — غلط ساخت صکوک کی شرعی حیثیت ختم کر سکتی ہے۔</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">مزید جاننے کے لیے</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah Plus آپ کو صکوک اور دیگر حلال سرمایہ کاری پر زکوٰۃ کا حساب رکھنے اور اپنے اثاثوں کی شرعی تعمیل کی تصدیق میں مدد دیتا ہے۔
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
