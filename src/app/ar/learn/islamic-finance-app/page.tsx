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
  title: 'أفضل تطبيق للتمويل الإسلامي 2026 — مقارنة Barakah وZoya وWahed وMusaffa',
  description:
    'مقارنة تطبيقات التمويل الإسلامي 2026: حاسبة الزكاة، تتبع الحول، فحص الأسهم الحلال، كشف الربا، تخطيط الوصية الشرعية، وميزانية الأسرة المسلمة. أيها يناسب احتياجك؟',
  keywords: ['تطبيق التمويل الإسلامي', 'أفضل تطبيق للزكاة', 'تطبيق ميزانية حلال', 'تطبيق فحص الأسهم الحلال', 'مقارنة تطبيقات الزكاة', 'Barakah Zoya Wahed Musaffa'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'أفضل تطبيق للتمويل الإسلامي 2026',
    description: 'مقارنة Barakah وZoya وWahed وMusaffa للأسر المسلمة في 2026.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const apps = [
  { name: 'Barakah', strength: 'منصة شاملة للأسرة المسلمة: زكاة متعددة الأصول، تتبع الحول، فحص الأسهم، كشف الربا، حاسبة الفرائض، خطة الوصية، خطة عائلية حتى 6 أعضاء.', weakness: 'فريق صغير وتطبيق حديث؛ تغطية بعض الأسواق خارج الولايات المتحدة ما زالت قيد التطوير.' },
  { name: 'Zoya', strength: 'فحص الأسهم الحلال هو نقطة قوته الأساسية؛ واجهة استخدام ممتازة لمنفذي الفحص الفردي.', weakness: 'لا يحسب الزكاة الشاملة على المحفظة الكاملة، ولا يتتبع الحول، ولا يدعم الميزانية الأسرية.' },
  { name: 'Wahed', strength: 'مدير محافظ آلي متوافق مع الشريعة وموثق رسمياً؛ مناسب للاستثمار السلبي.', weakness: 'ليس تطبيقاً للميزانية ولا للحول؛ يدير حسابك المُدار فقط، ولا يحلل حساباتك الخارجية.' },
  { name: 'Musaffa', strength: 'فحص الأسهم الحلال بأسلوب أكاديمي ممتاز؛ تحليل مفصل لكل سهم.', weakness: 'يركز على الأسهم فقط؛ لا يقدم زكاة شاملة أو تخطيط الوصية أو ميزانية الأسرة.' },
];

const faqItems = [
  {
    q: 'ما هو أفضل تطبيق للتمويل الإسلامي للأسرة في 2026؟',
    a: 'يعتمد ذلك على احتياجك: إذا كنت تبحث عن منصة شاملة تجمع الزكاة وتتبع الحول وفحص الأسهم وكشف الربا وتخطيط الوصية مع خطة عائلية متعددة الأعضاء، فإن Barakah هي الأقرب لهذا الاحتياج. وإذا كنت تريد فقط فحص الأسهم الفردية فإن Zoya وMusaffa مختصان في هذا، وإذا كنت تريد محفظة مدارة فإن Wahed مصمم لذلك. يمكن استخدام أكثر من تطبيق معاً.',
  },
  {
    q: 'هل يحسب أي تطبيق منها الزكاة على جميع الأصول؟',
    a: 'Barakah هو الوحيد الذي يحسب الزكاة على نقدك، وذهبك، وفضتك، وأسهمك، وصندوق التقاعد (401k)، وعقارك المؤجر، والعملات المشفرة، ومخزون الشركة في تطبيق واحد، مع دعم المذاهب الأربعة. الباقي إما لا يحسب الزكاة أو يحسبها جزئياً.',
  },
  {
    q: 'هل تتبع الحول مهم؟',
    a: 'نعم. الحول هو السنة القمرية (نحو 354 يوماً) التي يجب أن يبقى فيها مالك فوق النصاب لتجب الزكاة. كثير من المسلمين لا يعرفون تاريخ بداية حولهم ولا يتابعونه يومياً، فيفوّتون الموعد الصحيح للإخراج. Barakah هو التطبيق الوحيد الذي يفحص النصاب يومياً ضد سعر الذهب الحي ويحتفظ بتاريخ حولك من سنة إلى أخرى.',
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
    { '@type': 'ListItem', position: 3, name: 'تطبيقات التمويل الإسلامي', item: LANGS.ar },
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
          <span className="text-gray-900">تطبيقات التمويل الإسلامي</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">أفضل تطبيق للتمويل الإسلامي 2026</h1>
          <p className="text-base text-gray-600 mb-6">مقارنة عملية بين Barakah وZoya وWahed وMusaffa — آخر مراجعة 2026-05-28</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-7 text-gray-800">
              تختلف تطبيقات التمويل الإسلامي في مهمتها الأساسية. <strong>Barakah</strong> منصة شاملة للأسرة المسلمة (زكاة، حول، أسهم، ربا، وصية، ميزانية، خطة عائلية). <strong>Zoya وMusaffa</strong> متخصصان في فحص الأسهم الحلال. <strong>Wahed</strong> مدير محافظ آلي. فإذا كنت تبحث عن تطبيق واحد يغطي كل احتياجاتك المالية الإسلامية، فإن Barakah هي الخيار الطبيعي. أما إذا كنت تريد التخصص في جانب واحد فقد تحتاج إلى أحد الآخرين أو الجمع بينهم.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">مقارنة سريعة</h2>
            <div className="space-y-4">
              {apps.map((a) => (
                <div key={a.name} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{a.name}</h3>
                  <p className="text-sm leading-6 text-gray-700"><strong>نقطة القوة:</strong> {a.strength}</p>
                  <p className="text-sm leading-6 text-gray-700"><strong>نقطة الضعف:</strong> {a.weakness}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">كيف تختار؟</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-7 text-gray-800">
              <li><strong>إذا كنت أسرة:</strong> اختر Barakah — الخطة العائلية حتى 6 أعضاء بسعر اشتراك واحد.</li>
              <li><strong>إذا كنت تريد فقط فحص الأسهم:</strong> Zoya أو Musaffa أو Barakah Plus.</li>
              <li><strong>إذا كنت تريد محفظة مدارة:</strong> Wahed.</li>
              <li><strong>إذا كنت ترغب في كل ذلك من تطبيق واحد:</strong> Barakah.</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">أسئلة شائعة</h2>
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
            <h2 className="mb-3 text-xl font-bold">جرّب Barakah مجاناً</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              زكاة شاملة، تتبع الحول، فحص الأسهم الحلال، كشف الربا، خطة الوصية، وميزانية الأسرة — في تطبيق واحد. لا يحتاج إلى بطاقة ائتمان للبدء.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">الأسهم الحلال</Link>
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">ابدأ مجاناً ←</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
