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
  title: 'Comment éliminer le riba de vos finances — guide 2026',
  description:
    "Qu'est-ce que le riba, ses types (riba al-nasi'ah et riba al-fadl), où il se cache dans la vie financière moderne, et les étapes concrètes pour l'éliminer et purifier les intérêts perçus, avec les outils Barakah.",
  keywords: ['riba', 'éliminer le riba', "riba al-nasi'ah", 'intérêts bancaires haram', 'purification des intérêts', 'finance sans riba'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: 'Comment éliminer le riba de vos finances — guide 2026',
    description: "Les types de riba, où il se cache dans la vie financière moderne, et les étapes concrètes pour l'éliminer et le purifier.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: "Qu'est-ce que le riba ?",
    a: "Le riba est l'augmentation illicite dans certains contrats. Il en existe deux grands types : le riba al-nasi'ah (l'augmentation conditionnée par le délai, comme l'intérêt d'un prêt) et le riba al-fadl (l'échange inégal d'un même bien ribawi, comme de l'or contre de l'or en quantités différentes). L'interdiction du riba est établie par le Coran, la Sunna et le consensus des savants ; la divergence ne porte que sur son application à certaines transactions modernes.",
  },
  {
    q: "Où le riba se cache-t-il dans ma vie financière aujourd'hui ?",
    a: "Les formes les plus courantes : les intérêts des comptes d'épargne, les intérêts des cartes de crédit, les prêts personnels et auto à intérêt, le crédit immobilier conventionnel, les obligations à intérêt, et les pénalités de retard calculées comme un intérêt. La première étape est d'identifier ces sources dans vos transactions avant de les traiter.",
  },
  {
    q: "Que faire des intérêts déjà reçus sur mon compte ?",
    a: "De nombreux savants estiment qu'il n'est pas permis de profiter des intérêts perçus ; on s'en débarrasse en les versant aux pauvres et aux causes d'intérêt général, sans intention de récompense, simplement pour se défaire de l'illicite. Votre capital d'origine, lui, vous appartient. Référez-vous à un savant qualifié pour votre situation.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Apprendre', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Éliminer le riba', item: LANGS.fr },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Accueil</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">Apprendre</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Éliminer le riba</span>
        </div>
      </nav>
      <main className="flex-1" lang="fr">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            Disponible en :{' '}
            <Link href="/learn/riba-elimination" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/ar/learn/riba-elimination" className="underline hover:text-[#1B5E20]">العربية</Link> ·{' '}
            <Link href="/ur/learn/riba-elimination" className="underline hover:text-[#1B5E20]">اردو</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Comment éliminer le riba</h1>
          <p className="text-base text-gray-600 mb-6">Dernière révision : 2026-06-09 · Page informative — n&apos;émet pas de fatwa</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-8 text-gray-800">
              Le riba est une augmentation illicite, et son interdiction est établie par le Coran, la Sunna et le consensus des savants. S&apos;en libérer est un parcours en trois étapes :
              <strong> repérer</strong> les sources de riba dans vos transactions, <strong>arrêter et rembourser</strong> les dettes à intérêt,
              puis <strong>purifier</strong> les intérêts déjà perçus en les donnant sans intention de récompense. C&apos;est précisément ce que Barakah est conçu pour vous aider à faire.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Les types de riba</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li><strong>Riba al-nasi&apos;ah :</strong> l&apos;augmentation conditionnée par le délai sur une dette — l&apos;origine de l&apos;intérêt des prêts modernes.</li>
              <li><strong>Riba al-fadl :</strong> l&apos;échange inégal d&apos;un même bien ribawi de la main à la main (or contre or en quantités différentes).</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Où se cache le riba aujourd&apos;hui ?</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li>Les intérêts des comptes d&apos;épargne et des dépôts.</li>
              <li>Les intérêts des cartes de crédit et des prêts personnels.</li>
              <li>Le crédit immobilier conventionnel à intérêt.</li>
              <li>Les obligations et instruments à revenu fixe à intérêt.</li>
              <li>Les pénalités de retard calculées comme un intérêt.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Étapes concrètes pour s&apos;en libérer</h2>
            <ol className="list-decimal space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li><strong>Repérer :</strong> passez vos transactions en revue et identifiez chaque revenu ou dépense d&apos;intérêt.</li>
              <li><strong>Arrêter le nouveau :</strong> clôturez les produits à intérêt et adoptez des alternatives conformes à la charia.</li>
              <li><strong>Rembourser le plus coûteux d&apos;abord :</strong> planifiez le remboursement des dettes à intérêt en commençant par les plus chères.</li>
              <li><strong>Purifier le reçu :</strong> donnez les intérêts perçus aux pauvres, sans intention de récompense.</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Avertissement religieux</h2>
            <p className="text-sm leading-8 text-amber-900">
              L&apos;interdiction du principe du riba fait l&apos;objet d&apos;un consensus, mais son application à une transaction précise peut demander examen et nuance. Cette page est informative et Barakah n&apos;émet pas de fatwas ;
              sollicitez un savant qualifié pour votre situation et vos produits financiers.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Repérez le riba et suivez la purification avec Barakah</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              Barakah détecte automatiquement les sources d&apos;intérêt dans vos transactions, vous aide à fixer des objectifs pour vous libérer des dettes à intérêt, et suit les montants de purification pour que vous soyez serein quant à la pureté de votre argent.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu&apos;est-ce que la zakat ?</Link>
              <Link href="/fr/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Actions halal</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">Commencer gratuitement →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
