import type { Metadata } from 'next';
import Link from 'next/link';

const L = {
  en: 'https://trybarakah.com/learn/how-much-zakat-do-i-owe',
  fr: 'https://trybarakah.com/fr/learn/how-much-zakat-do-i-owe',
  ar: 'https://trybarakah.com/ar/learn/how-much-zakat-do-i-owe',
  ur: 'https://trybarakah.com/ur/learn/how-much-zakat-do-i-owe',
  'x-default': 'https://trybarakah.com/learn/how-much-zakat-do-i-owe',
};
export const metadata: Metadata = {
  title: 'مجھ پر کتنی زکوٰۃ ہے؟ حساب 2026 (مثال کے ساتھ)',
  description: 'آپ پر کتنی زکوٰۃ ہے؟ نصاب سے اوپر اور پورے حول والے خالص قابلِ زکوٰۃ مال کا 2.5% نکالیں۔ طریقہ، حل شدہ مثال، اور مفت کیلکولیٹر۔',
  keywords: ['کتنی زکوٰۃ', 'زکوٰۃ کا حساب', 'زکوٰۃ کی شرح', '2.5% زکوٰۃ', 'نصاب', 'زکوٰۃ کیلکولیٹر'],
  alternates: { canonical: L.ur, languages: L },
  openGraph: { title: 'مجھ پر کتنی زکوٰۃ ہے؟', description: 'طریقہ، حل شدہ مثال، اور مفت کیلکولیٹر تاکہ آپ کی زکوٰۃ کی صحیح رقم معلوم ہو۔', url: L.ur, siteName: 'Barakah', type: 'article', locale: 'ur_PK', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'زکوٰۃ کی شرح کیا ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'زکوٰۃ آپ کے خالص قابلِ زکوٰۃ مال کا 2.5% ہے جو نصاب سے اوپر ہو اور اس پر پورا حول گزر چکا ہو۔' } },
  { '@type': 'Question', name: 'کیا زکوٰۃ آمدنی پر ہوتی ہے؟', acceptedAnswer: { '@type': 'Answer', text: 'نہیں، یہ جمع شدہ مال (بچت، سونا، سرمایہ کاری) پر ہوتی ہے، سالانہ آمدنی پر نہیں۔' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'ہوم', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'سیکھیں', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'کتنی زکوٰۃ؟', item: L.ur },
]};

export default function Page() {
  return (
    <main lang="ur" dir="rtl" className="max-w-3xl mx-auto px-5 py-10 text-gray-800 text-right">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">سیکھیں</Link> · <Link href="/learn/how-much-zakat-do-i-owe" className="underline">English</Link> · <Link href="/fr/learn/how-much-zakat-do-i-owe" className="underline">Français</Link> · <Link href="/ar/learn/how-much-zakat-do-i-owe" className="underline">العربية</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">مجھ پر کتنی زکوٰۃ ہے؟</h1>
      <p className="mb-4">اصول سادہ ہے: <strong>خالص قابلِ زکوٰۃ مال کا 2.5%</strong>، بشرطیکہ وہ <em>نصاب</em> سے اوپر ہو اور اس پر پورا قمری <em>حول</em> گزر چکا ہو۔</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">فارمولا</h2>
      <p className="mb-4">(نقدی + سونا/چاندی + قابلِ زکوٰۃ سرمایہ کاری + وصول طلب قرضے) − فوری واجب الادا قرضے = خالص قابلِ زکوٰۃ مال۔ پھر × 2.5%۔</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">حل شدہ مثال</h2>
      <ul className="list-disc pr-6 space-y-1 mb-4">
        <li>بچت: 10000</li>
        <li>سونا: 3000</li>
        <li>حصص (قابلِ زکوٰۃ حصہ): 5000</li>
        <li>واجب الادا قرضے: −2000</li>
        <li><strong>خالص قابلِ زکوٰۃ: 16000 ← زکوٰۃ = 400</strong></li>
      </ul>
      <p className="mb-4">رہائشی گھر، ذاتی گاڑی اور ذاتی سامان حساب میں شامل نہیں۔</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">صحیح رقم مفت شمار کریں</p>
        <p className="mb-3 text-sm">سونے کی تازہ قیمت کے مطابق نصاب اور آپ کے حول کی نگرانی کے ساتھ۔</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">کیلکولیٹر کھولیں →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">معلومات کے لیے معروف آراء؛ اپنے عالم سے تصدیق کریں۔ برَکہ کسی دینی اتھارٹی کا دعویٰ نہیں کرتا۔</p>
    </main>
  );
}
