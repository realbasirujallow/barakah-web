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
  title: 'الميزانية الحلال — كيف تدير مالك وفق الشريعة 2026',
  description:
    'إطار عملي لإدارة ميزانية الأسرة المسلمة: تقديم الزكاة والواجبات، وتجنّب الربا، وتمييز الحاجات عن الكماليات، والاعتدال في الإنفاق، وإفراد نصيب للصدقة، مع أدوات Barakah.',
  keywords: ['الميزانية الحلال', 'إدارة المال الإسلامية', 'ميزانية الأسرة المسلمة', 'الإنفاق الحلال', 'ميزانية بلا ربا', 'تطبيق ميزانية إسلامي'],
  alternates: { canonical: LANGS.ar, languages: LANGS },
  openGraph: {
    title: 'الميزانية الحلال — كيف تدير مالك وفق الشريعة 2026',
    description: 'إطار عملي لإدارة ميزانية الأسرة المسلمة: الزكاة أولاً، وتجنّب الربا، والاعتدال، وإفراد نصيب للصدقة.',
    url: LANGS.ar, siteName: 'Barakah', type: 'article', locale: 'ar_AR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: 'ما الذي يجعل الميزانية "حلالاً"؟',
    a: 'الميزانية الحلال ليست مجرد أرقام، بل ترتيب للأولويات وفق مقاصد الشريعة: أن يكون الدخل من كسب طيب، وأن تُقدَّم الحقوق الواجبة كالزكاة والنفقة، وأن يُتجنَّب الربا في الادخار والاقتراض، وأن يُعتدل في الإنفاق بلا إسراف ولا تقتير، وأن يُفرَد نصيب للصدقة. وهي تجمع بين الانضباط المالي والنية الصالحة.',
  },
  {
    q: 'كيف أرتّب أولويات الإنفاق إسلامياً؟',
    a: 'ترتيب مقترح: (1) الدخل الطيب، ثم (2) الحقوق الواجبة (الزكاة، النفقة، الديون الواجبة)، ثم (3) الحاجات الأساسية (سكن، طعام، تعليم، صحة)، ثم (4) الادخار والاستثمار الحلال للطوارئ والمستقبل، ثم (5) الصدقة والإحسان، ثم (6) الكماليات المباحة باعتدال. والقاعدة: الواجب قبل الحاجة، والحاجة قبل الكمالية.',
  },
  {
    q: 'هل تجنّب الربا جزء من الميزانية الحلال؟',
    a: 'نعم، وهو ركن أساسي. فالميزانية الحلال تتجنّب الفوائد في الاقتراض والادخار، وتسعى لسداد الديون الربوية إن وُجدت، وتختار البدائل المتوافقة مع الشريعة. والتخطيط المالي السليم يقلّل الحاجة إلى الاقتراض الربوي أصلاً.',
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
    { '@type': 'ListItem', position: 3, name: 'الميزانية الحلال', item: LANGS.ar },
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
          <span className="text-gray-900">الميزانية الحلال</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            متوفّر بـ:{' '}
            <Link href="/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/fr/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">Français</Link> ·{' '}
            <Link href="/ur/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">اردو</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">الميزانية الحلال</h1>
          <p className="text-base text-gray-600 mb-6">آخر مراجعة: 2026-06-09 · صفحة تعليمية لا تُغني عن سؤال العلماء</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">باختصار</h2>
            <p className="text-base leading-8 text-gray-800">
              الميزانية الحلال ترتيب للأولويات وفق مقاصد الشريعة: <strong>كسب طيب</strong>، ثم <strong>تقديم الواجبات</strong> كالزكاة والنفقة،
              ثم <strong>الحاجات</strong>، ثم <strong>الادخار والاستثمار الحلال</strong>، ثم <strong>الصدقة</strong>، ثم الكماليات باعتدال. مع تجنّب الربا في كل ذلك.
              وهي تجمع بين الانضباط والنية الصالحة لتحقيق البركة في المال.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">إطار الإنفاق وفق الأولويات</h2>
            <ol className="list-decimal space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>الدخل الطيب:</strong> ابدأ من كسبٍ حلال، فهو أساس بركة المال.</li>
              <li><strong>الحقوق الواجبة:</strong> الزكاة، والنفقة على من تعول، والديون الواجبة.</li>
              <li><strong>الحاجات الأساسية:</strong> سكن، وطعام، وتعليم، وصحة، ومواصلات.</li>
              <li><strong>الادخار والاستثمار الحلال:</strong> صندوق طوارئ ثم استثمار متوافق مع الشريعة.</li>
              <li><strong>الصدقة والإحسان:</strong> اجعل لها نصيباً ثابتاً ولو يسيراً.</li>
              <li><strong>الكماليات المباحة:</strong> باعتدال، بلا إسراف ولا تبذير.</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">مبادئ تحكم الميزانية الحلال</h2>
            <ul className="list-disc space-y-2 pr-6 text-base leading-8 text-gray-800">
              <li><strong>تجنّب الربا:</strong> في الاقتراض والادخار، مع السعي لسداد الديون الربوية.</li>
              <li><strong>الاعتدال:</strong> لا إسراف ولا تقتير، فخير الأمور أوسطها.</li>
              <li><strong>تقديم الواجب:</strong> الزكاة والنفقة قبل الكماليات.</li>
              <li><strong>نية صالحة:</strong> فالإنفاق على الأهل وصلة الرحم تؤجر عليه.</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">تنبيه</h2>
            <p className="text-sm leading-8 text-amber-900">
              هذه مبادئ عامة في إدارة المال من منظور إسلامي، ولا تصدر Barakah فتاوى. أما المسائل الخاصة (كحساب الزكاة أو حكم منتج مالي معيّن) فارجع فيها إلى عالم مختص.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">طبّق ميزانيتك الحلال في Barakah</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              يساعدك Barakah على وضع ميزانية تقدّم الزكاة والواجبات، ويكشف مصادر الربا في معاملاتك، ويتابع صدقاتك وزكاتك في مكان واحد.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/ar/zakat-calculator" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">حاسبة الزكاة ←</Link>
              <Link href="/ar/learn/riba-elimination" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">التخلص من الربا</Link>
              <Link href="/ar/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ما هي الزكاة؟</Link>
              <Link href="/signup" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">ابدأ مجاناً</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
