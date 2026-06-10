import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com',
  fr: 'https://trybarakah.com/fr',
  ar: 'https://trybarakah.com/ar',
  ur: 'https://trybarakah.com/ur',
  'x-default': 'https://trybarakah.com',
};

export const metadata: Metadata = {
  title: 'Barakah — اسلامی فنانس ایپ: زکوٰۃ اور حلال بجٹ',
  description:
    'آپ کے سارے مال کے لیے ایک ایپ، شریعت کے مطابق: زکوٰۃ، نصاب اور حول کا خودکار حساب، معاملات میں سود کی نشاندہی، حلال اسٹاک اسکریننگ، خاندانی بجٹ اور صدقے کا ٹریک — اردو میں۔',
  keywords: ['اسلامی فنانس ایپ', 'زکوٰۃ کیلکولیٹر', 'حلال بجٹ', 'سود کی نشاندہی', 'حلال اسٹاکس', 'زکوٰۃ ایپ'],
  alternates: { canonical: LANGS.ur, languages: LANGS },
  openGraph: {
    title: 'Barakah — اسلامی فنانس ایپ',
    description: 'زکوٰۃ، حلال بجٹ، سود کی نشاندہی اور اسٹاک اسکریننگ — ایک ہی ایپ میں۔',
    url: LANGS.ur, siteName: 'Barakah', type: 'website', locale: 'ur_PK',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col" dir="rtl">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <Link href="/ur" className="font-extrabold text-[#1B5E20] text-lg">Barakah</Link>
          <div className="flex items-center gap-3 text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20]">English</Link>
            <Link href="/ar" className="hover:text-[#1B5E20]">العربية</Link>
            <Link href="/fr" className="hover:text-[#1B5E20]">Français</Link>
            <Link href="/login" className="hover:text-[#1B5E20]">لاگ اِن</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h1 className="mb-4 text-4xl md:text-6xl font-extrabold text-[#1B5E20] leading-tight">
            آپ کا سارا مال، شریعت کے مطابق، ایک ایپ میں
          </h1>
          <p className="text-lg leading-9 text-gray-700 mb-8 max-w-2xl">
            Barakah آپ کی زکوٰۃ، نصاب اور حول خودکار طور پر نکالتا ہے، معاملات میں سود کے مصادر کی نشاندہی کرتا ہے،
            AAOIFI معیار کے مطابق اسٹاکس کی اسکریننگ کرتا ہے، اور خاندانی بجٹ اور صدقات میں آپ کا ساتھ دیتا ہے —
            فتوے کا دعویٰ کیے بغیر، شائع شدہ طریقۂ کار کے ساتھ جس کا مسلک آپ خود چنتے ہیں۔
          </p>
          <div className="flex flex-wrap gap-3 mb-14">
            <Link href="/signup" className="rounded-full bg-[#1B5E20] px-6 py-3 text-base font-bold text-white hover:bg-[#2E7D32] transition">مفت شروع کریں</Link>
            <Link href="/ur/zakat-calculator" className="rounded-full bg-amber-300 px-6 py-3 text-base font-bold text-amber-900 hover:bg-amber-200 transition">اپنی زکوٰۃ نکالیں</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-14">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">🌙 زکوٰۃ بغیر الجھن</h2>
              <p className="text-sm leading-7 text-gray-700">سونے کے آج کے بھاؤ سے زندہ نصاب، ہجری کیلنڈر پر حول کا ٹریک، بچت، سونے اور اسٹاکس پر خودکار حساب، اور ادائیگیوں کا ریکارڈ۔</p>
              <Link href="/ur/learn/what-is-zakat" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">زکوٰۃ کیا ہے؟ ←</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">🚫 سود کی نشاندہی</h2>
              <p className="text-sm leading-7 text-gray-700">آپ کے کھاتوں میں آنے اور جانے والے سود کو پہچانتا ہے، اور اس سے نجات اور موصول شدہ کی تطہیر کا منصوبہ بنانے میں مدد دیتا ہے۔</p>
              <Link href="/ur/learn/riba-elimination" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">سود سے نجات ←</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">📈 حلال اسٹاکس</h2>
              <p className="text-sm leading-7 text-gray-700">امریکی، خلیجی اور برطانوی اسٹاکس کی AAOIFI کے زندہ تناسب کے مطابق شرعی اسکریننگ، تطہیر کی رقم کے حساب کے ساتھ۔</p>
              <Link href="/ur/learn/halal-stocks" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">حلال اسٹاکس گائیڈ ←</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">👨‍👩‍👧 خاندانی بجٹ</h2>
              <p className="text-sm leading-7 text-gray-700">ایسا بجٹ جو واجبات کو آسائشوں پر مقدم رکھے، خاندان کے لیے مشترکہ اکاؤنٹ، اور صدقہ، وقف اور وصیت کا ٹریک۔</p>
              <Link href="/ur/learn/halal-budgeting" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">حلال بجٹ ←</Link>
            </div>
          </div>

          <section className="rounded-2xl bg-white p-6 shadow-sm mb-14">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">اردو میں پڑھیں</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/ur/learn/what-is-zakat" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کیا ہے؟</Link>
              <Link href="/ur/learn/nisab" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">نصاب</Link>
              <Link href="/ur/learn/hawl" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">حول</Link>
              <Link href="/ur/learn/zakat-on-gold" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">سونے پر زکوٰۃ</Link>
              <Link href="/ur/learn/types-of-zakat" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">زکوٰۃ کی اقسام</Link>
              <Link href="/ur/learn/what-is-sukuk" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">صکوک</Link>
              <Link href="/ur/learn/islamic-finance-app" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">اسلامی فنانس ایپ</Link>
              <Link href="/ur/learn/how-much-zakat-do-i-owe" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">میری زکوٰۃ کتنی؟</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-8 text-white text-center">
            <h2 className="mb-3 text-2xl font-bold">پاکیزہ مال کی طرف اپنا سفر شروع کریں</h2>
            <p className="mb-5 text-sm leading-7 text-green-100 max-w-xl mx-auto">
              شائع شدہ طریقۂ کار <Link href="/methodology" className="underline">میتھڈالوجی صفحے</Link> پر۔ ہم آپ کا ڈیٹا نہیں بیچتے — صرف سروس فراہم کنندگان۔
              Barakah فتویٰ جاری نہیں کرتا؛ خاص مسائل میں اہلِ علم سے رجوع کریں۔
            </p>
            <Link href="/signup" className="inline-block rounded-full bg-amber-300 px-8 py-3 text-base font-bold text-amber-900 hover:bg-amber-200 transition">مفت شروع کریں ←</Link>
          </section>
        </div>
      </main>
    </div>
  );
}
