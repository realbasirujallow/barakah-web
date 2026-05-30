import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/islamic-finance-app',
  fr: 'https://trybarakah.com/fr/learn/application-finance-islamique',
  ar: 'https://trybarakah.com/ar/learn/islamic-finance-app',
  ur: 'https://trybarakah.com/ur/learn/islamic-finance-app',
  'x-default': 'https://trybarakah.com/learn/islamic-finance-app',
};

export const metadata: Metadata = {
  title: 'بہترین اسلامی فنانس ایپ 2026 — Barakah، Zoya، Wahed، Musaffa کا موازنہ',
  description:
    'اسلامی فنانس ایپس کا ایماندارانہ موازنہ 2026: زکوٰۃ کیلکولیٹر، حول ٹریکنگ، حلال اسٹاک اسکریننگ، ربا کا کھوج، وصیت کی منصوبہ بندی، مسلم خاندانی بجٹ۔ آپ کے گھرانے کے لیے کون سی بہتر؟',
  keywords: ['اسلامی فنانس ایپ', 'بہترین زکوٰۃ ایپ', 'حلال بجٹ ایپ', 'حلال اسٹاکس ایپ', 'مسلم فیملی فنانس', 'Barakah Zoya Wahed'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'بہترین اسلامی فنانس ایپ 2026',
    description: 'پاکستان اور ڈائسپورا کے مسلم خاندانوں کے لیے Barakah، Zoya، Wahed، Musaffa کا موازنہ۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const apps = [
  { name: 'Barakah', strength: 'مسلم گھرانے کے لیے مکمل پلیٹ فارم: مختلف اثاثوں پر زکوٰۃ، حول ٹریکنگ، اسٹاک اسکریننگ، ربا کا کھوج، فرائض کیلکولیٹر، وصیت پلانر، 6 ممبران تک فیملی پلان۔', weakness: 'نئی ٹیم اور پروڈکٹ؛ امریکا کے باہر بینک سپورٹ (پاکستان، یوکے، کینیڈا) ابھی روڈ میپ میں ہے۔' },
  { name: 'Zoya', strength: 'حلال اسٹاک اسکریننگ اس کی بنیادی طاقت ہے۔ سنگل ٹکر چیکنگ کے لیے بہترین یوزر انٹرفیس۔', weakness: 'پورٹ فولیو پر مکمل زکوٰۃ نہیں، حول ٹریکنگ نہیں، فیملی بجٹ نہیں۔' },
  { name: 'Wahed', strength: 'شریعت سے ہم آہنگ روبو ایڈوائزر، باضابطہ رجسٹرڈ۔ غیر فعال سرمایہ کاری کے لیے بہتر۔', weakness: 'بجٹنگ یا حول ایپ نہیں؛ صرف اپنا پورٹ فولیو منظم کرتا ہے، دیگر اکاؤنٹس نہیں۔' },
  { name: 'Musaffa', strength: 'تعلیمی انداز کی حلال اسٹاک اسکریننگ؛ ٹکر کے لحاظ سے گہرا تجزیہ۔', weakness: 'صرف اسٹاکس پر فوکس؛ نہ مکمل زکوٰۃ، نہ وصیت پلانگ، نہ فیملی بجٹ۔' },
];

const faqItems = [
  {
    q: '2026 میں مسلم گھرانے کے لیے بہترین اسلامی فنانس ایپ کون سی ہے؟',
    a: 'یہ آپ کی ضرورت پر منحصر ہے۔ اگر آپ ایک ہی پلیٹ فارم چاہتے ہیں جو زکوٰۃ، حول، اسٹاک اسکریننگ، ربا کا کھوج، وصیت پلانگ، اور خاندانی بجٹ کور کرے، تو Barakah اس کے قریب ترین ہے۔ اگر صرف اسٹاک اسکریننگ چاہیے تو Zoya یا Musaffa بہتر ہیں۔ اگر منظم پورٹ فولیو چاہیے تو Wahed بنایا گیا ہے اس کے لیے۔ ایک ساتھ کئی ایپس استعمال کرنا بھی ممکن ہے۔',
  },
  {
    q: 'کیا کوئی ایپ تمام اثاثوں پر زکوٰۃ حساب کرتی ہے؟',
    a: 'Barakah واحد ایپ ہے جو ایک ہی جگہ آپ کے نقد، سونے، چاندی، اسٹاکس، 401k/پراویڈنٹ فنڈ، کرایہ کی پراپرٹی، کرپٹو، اور کاروباری انوینٹری پر زکوٰۃ حساب کرتی ہے، چار مذاہب (حنفی، شافعی، مالکی، حنبلی) کی پوزیشن کے ساتھ۔ باقی ایپس یا تو زکوٰۃ حساب نہیں کرتیں یا جزوی۔',
  },
  {
    q: 'کیا حول کی ٹریکنگ اہم ہے؟',
    a: 'جی ہاں۔ حول قمری سال (تقریباً 354 دن) ہے جس میں آپ کا مال نصاب سے اوپر رہنا چاہیے تاکہ زکوٰۃ فرض ہو۔ بہت سے مسلم اپنے حول کی تاریخ نہیں جانتے اور ادائیگی کا صحیح موقع کھو دیتے ہیں۔ Barakah واحد ایپ ہے جو روزانہ نصاب کو لائیو سونے کی قیمت سے چیک کرتی ہے اور سال در سال آپ کے حول کا ریکارڈ رکھتی ہے۔',
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
    { '@type': 'ListItem', position: 3, name: 'اسلامی فنانس ایپ', item: LANGS.ur },
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
          <span className="text-gray-900">اسلامی فنانس ایپ</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">بہترین اسلامی فنانس ایپ 2026</h1>
          <p className="text-base text-gray-600 mb-6">Barakah، Zoya، Wahed، Musaffa کا موازنہ — آخری جائزہ 2026-05-28</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">مختصراً</h2>
            <p className="text-base leading-7 text-gray-800">
              اسلامی فنانس ایپس کا مقصد مختلف ہے۔ <strong>Barakah</strong> مسلم گھرانے کے لیے مکمل پلیٹ فارم (زکوٰۃ، حول، اسٹاکس، ربا، وصیت، بجٹ، فیملی پلان)۔ <strong>Zoya اور Musaffa</strong> اسٹاک اسکریننگ پر مرکوز ہیں۔ <strong>Wahed</strong> منظم روبو ایڈوائزر ہے۔ اگر آپ ایک ہی ایپ چاہتے ہیں جو سب کچھ کور کرے تو Barakah فطری انتخاب ہے۔ اگر صرف ایک پہلو میں گہرائی چاہیے تو دوسرے میں سے کوئی۔
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">فوری موازنہ</h2>
            <div className="space-y-4">
              {apps.map((a) => (
                <div key={a.name} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{a.name}</h3>
                  <p className="text-sm leading-6 text-gray-700"><strong>طاقت:</strong> {a.strength}</p>
                  <p className="text-sm leading-6 text-gray-700"><strong>ایماندار کمزوری:</strong> {a.weakness}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">کیسے انتخاب کریں؟</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-7 text-gray-800">
              <li><strong>اگر آپ فیملی ہیں:</strong> Barakah — ایک سبسکرپشن میں 6 ممبران تک فیملی پلان۔</li>
              <li><strong>صرف اسٹاک اسکریننگ چاہیے:</strong> Zoya، Musaffa یا Barakah Plus۔</li>
              <li><strong>منظم حلال پورٹ فولیو چاہیے:</strong> Wahed۔</li>
              <li><strong>ایک ہی ایپ میں سب کچھ چاہیے:</strong> Barakah۔</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
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

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Barakah مفت آزمائیں</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              مکمل زکوٰۃ، حول ٹریکنگ، حلال اسٹاک اسکریننگ، ربا کا کھوج، وصیت پلانر، فیملی بجٹ۔ شروع کرنے کے لیے کریڈٹ کارڈ کی ضرورت نہیں۔
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">حلال اسٹاکس</Link>
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">مفت شروع کریں ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
