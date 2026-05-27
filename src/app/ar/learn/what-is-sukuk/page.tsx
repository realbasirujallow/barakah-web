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
  title: 'ما هي الصكوك؟ السندات الإسلامية بشرح مبسّط (2026)',
  description:
    'ما هي الصكوك؟ دليل مبسّط لشهادات الاستثمار الإسلامية — الفرق بينها وبين السندات التقليدية، أهم الأنواع (إجارة، مرابحة، مشاركة، مضاربة، وكالة)، حكمها الشرعي، ومخاطرها.',
  keywords: ['ما هي الصكوك', 'الصكوك', 'تعريف الصكوك', 'السندات الإسلامية', 'حكم الصكوك', 'صكوك الإجارة'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'ما هي الصكوك؟ السندات الإسلامية بشرح مبسّط (2026)',
    description: 'كيف تعمل الصكوك، وكيف تختلف عن السندات التقليدية، وأهم أنواعها، وحكمها الشرعي.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const sukukTypes = [
  { name: 'صكوك الإجارة', desc: 'مستندة إلى أصل مؤجَّر؛ يحصل حملتها على دخل إيجاري. وهي أكثر الأنواع شيوعًا.' },
  { name: 'صكوك المرابحة', desc: 'قائمة على بيع بالتكلفة مع ربح معلوم؛ والعائد من هامش الربح المُفصح عنه.' },
  { name: 'صكوك المشاركة', desc: 'شراكة أو مشروع مشترك؛ يتقاسم حملتها الأرباح والخسائر الفعلية.' },
  { name: 'صكوك المضاربة', desc: 'طرف يقدّم رأس المال وآخر يقوم بالإدارة؛ وتُقسم الأرباح بنسبة متفق عليها.' },
  { name: 'صكوك الوكالة', desc: 'وكيل يستثمر الأموال نيابةً عن حملتها مقابل أجر وعائد مستهدف.' },
];

const faqItems = [
  {
    q: 'ما هي الصكوك بكلمات بسيطة؟',
    a: 'الصكوك (مفردها صكّ) شهادات استثمار إسلامية تُسمّى أحيانًا «السندات الإسلامية». بدلًا من الإقراض بفائدة، يمثّل كل صكّ حصةً من ملكية أصل حقيقي أو مشروع أو نشاط تجاري، فيحصل حامله على نصيبه من الدخل الذي يولّده هذا الأصل — أجرة أو ربح، لا فائدة.',
  },
  {
    q: 'هل الصكوك حلال؟',
    a: 'نعم، بشرط أن تكون مُهيّكلة بطريقة شرعية صحيحة ومعتمدة من هيئة شرعية مختصة. يجب أن تستند إلى أصول أو أنشطة جائزة، وأن تشترك في مخاطرة اقتصادية حقيقية، وأن تخلو من الربا والغرر الفاحش والأنشطة المحرّمة. كثير من الصكوك السيادية والشركاتية تستوفي هذه الشروط، لكن يجب الرجوع إلى الفتوى المرفقة بكل إصدار.',
  },
  {
    q: 'ما الفرق بين الصكوك والسندات التقليدية؟',
    a: 'السند التقليدي قرض بفائدة ثابتة — يلتزم المُصدر بسداد أصل الدين والكوبونات بصرف النظر عن الأداء. أما الصكّ فيمثّل حصةً في أصل أو مشروع، ويعتمد العائد على الدخل الذي يولّده. وقد تتشابه بعض أنواع الصكوك اقتصاديًا مع السندات (كصكوك الإجارة)، غير أن الأساس الشرعي وطبيعة المخاطرة مختلفان جوهريًا.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'تعلّم', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'ما هي الصكوك؟', item: LANGS.ar },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">الرئيسية</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">تعلّم</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">ما هي الصكوك؟</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">ما هي الصكوك؟</h1>
          <p className="text-base text-gray-600 mb-6">السندات الإسلامية بشرح مبسّط — 2026</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-7 text-gray-800">
              الصكوك (صكّ مفرد) شهاداتُ استثمارٍ متوافقة مع الشريعة تمثّل حصةً من ملكية أصل أو مشروع أو نشاط تجاري، لا قرضًا بفائدة. يحصل حملتها على حصّتهم من الدخل الفعلي (أجرة أو ربح) بدلًا من كوبونات الفائدة.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">أنواع الصكوك الرئيسية</h2>
            <ul className="space-y-2 text-base leading-7 text-gray-800">
              {sukukTypes.map((t) => (
                <li key={t.name}><strong>{t.name}</strong> — {t.desc}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">هل الصكوك حلال؟</h2>
            <p className="text-base leading-7 text-gray-800">
              إذا هُيّكلت بطريقة شرعية صحيحة واعتُمدت من هيئة شرعية مختصة، فالصكوك حلال. يجب أن تستند إلى أصول أو أنشطة جائزة، وأن تشترك في مخاطرة اقتصادية حقيقية، وأن تخلو من الربا والغرر الفاحش والأنشطة المحرّمة. يُرجى الرجوع دائمًا إلى الفتوى المرفقة بكل إصدار.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">مخاطر ينبغي معرفتها</h2>
            <ul className="list-disc space-y-1 pr-6 text-base leading-7 text-gray-800">
              <li>مخاطر الأصل الأساسي (شغور، تعثّر المستأجر، انخفاض القيمة).</li>
              <li>المخاطر السيادية أو الائتمانية للمُصدر.</li>
              <li>مخاطر السوق الثانوية — السيولة تتفاوت بحسب المُصدر.</li>
              <li>مخاطر الامتثال — هيكلة غير سليمة قد تُفقد الصكّ صفته الشرعية.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">لمعرفة المزيد</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              يساعدك Barakah Plus على متابعة زكاتك على الصكوك وسائر الاستثمارات الحلال، والتحقق من توافق ممتلكاتك مع الشريعة.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/ar/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">النصاب</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">ابدأ مجانًا ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
