/* eslint-disable react/no-unescaped-entities */
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
  title: 'Actions halal 2026 — Comment vérifier la conformité Shariah des actions',
  description:
    "Guide pratique des actions halal : norme AAOIFI 21, criblage d'activité et financier, ratios de dette et d'intérêt, et calcul de la purification des dividendes.",
  keywords: ['actions halal', 'bourse halal', 'investissement halal', 'AAOIFI 21', 'criblage actions shariah', 'purification dividendes', 'finance islamique investissement'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: 'Actions halal 2026 — Guide du criblage Shariah',
    description: "Comment vérifier la conformité Shariah d'une action selon la norme AAOIFI 21, avec ratios financiers et calcul de purification.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: "Qu'est-ce qui rend une action halal ?",
    a: "Une action est considérée halal lorsque la société réussit deux criblages : (1) le criblage d'activité (pas de revenus significatifs issus d'alcool, de jeux d'argent, de banque conventionnelle, d'assurance riba, de porc, d'armement ou de contenu illicite) et (2) le criblage financier selon la norme AAOIFI 21 (dette portant intérêt inférieure à 30% de la capitalisation boursière ; titres et liquidités portant intérêt inférieurs à 30% ; revenus non permissibles inférieurs à 5%). Les ratios sont recalculés chaque trimestre.",
  },
  {
    q: "Qu'est-ce que la norme AAOIFI 21 ?",
    a: "La norme AAOIFI 21 (Organisation de comptabilité et d'audit pour les institutions financières islamiques) est le standard international le plus utilisé pour le criblage Shariah des actions. Elle définit les exclusions d'activité, les trois ratios financiers, l'utilisation de la moyenne mobile sur 12 mois de la capitalisation comme dénominateur, et le calcul du montant de purification des dividendes. D'autres méthodologies existent (MSCI, S&P, FTSE Russell), avec des seuils légèrement différents.",
  },
  {
    q: "Faut-il purifier les dividendes des actions halal ?",
    a: "Oui. Même lorsque la société passe le criblage Shariah, une petite part de ses revenus provient typiquement de sources non permissibles (intérêts sur les liquidités). Les savants demandent de purifier cette part des dividendes ou des plus-values en faisant un don de charité sans en attendre de récompense. Le pourcentage de purification est recalculé chaque trimestre à partir du ratio de revenus non permissibles publié par la société.",
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
    { '@type': 'ListItem', position: 3, name: 'Actions halal', item: LANGS.fr },
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
          <span className="text-gray-900">Actions halal</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Actions halal 2026</h1>
          <p className="text-base text-gray-600 mb-6">Dernière révision : 2026-05-28 · Méthodologie AAOIFI 21</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-7 text-gray-800">
              Une action halal est une action d'une société qui passe deux criblages : <strong>activité</strong> (pas de revenus issus de domaines interdits) et <strong>ratios financiers</strong> selon la norme AAOIFI 21. Même en cas de réussite, il reste à <strong>purifier</strong> une petite part des dividendes liée aux revenus non permissibles. Les ratios bougent chaque trimestre — vérifiez l'état actuel avant d'acheter.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Étape 1 : Criblage d'activité</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">Les sociétés sont exclues si une part significative de leurs revenus provient de :</p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Alcool et boissons alcoolisées</li>
              <li>Jeux d'argent</li>
              <li>Banques conventionnelles et assurance riba</li>
              <li>Porc et produits dérivés</li>
              <li>Armement (selon certaines méthodologies)</li>
              <li>Contenu illicite ou pornographique</li>
              <li>Tabac (selon certaines méthodologies)</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              AAOIFI tolère une petite part (sous 5%) de revenus non permissibles à condition qu'elle soit purifiée — peu de grandes sociétés en sont totalement exemptes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Étape 2 : Ratios financiers AAOIFI</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">Limite</th>
                    <th className="p-3 font-semibold text-gray-700">Dénominateur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Dette portant intérêt</td><td className="p-3">&lt; 30%</td><td className="p-3">Capitalisation moyenne 12 mois</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Titres + liquidités portant intérêt</td><td className="p-3">&lt; 30%</td><td className="p-3">Capitalisation</td></tr>
                  <tr><td className="p-3 font-semibold">Revenus non permissibles</td><td className="p-3">&lt; 5%</td><td className="p-3">Revenus totaux</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Comme la capitalisation bouge avec le cours, un titre peut passer un trimestre et échouer le suivant. Une vérification régulière est nécessaire.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification des dividendes</h2>
            <p className="text-base leading-7 text-gray-800">
              Même lorsque l'action passe le criblage, une petite part du revenu vient de sources non permissibles. L'investisseur musulman doit <em>purifier</em> sa quote-part de cette portion des dividendes ou des plus-values en la donnant à une œuvre de charité sans en attendre de récompense. Le montant se calcule à partir des publications trimestrielles de revenus non permissibles de la société.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Note de fiqh</h2>
            <p className="text-sm leading-7 text-amber-900">
              Cette page est informative et s'appuie sur la norme AAOIFI et les méthodologies de criblage reconnues. Certains savants divergent sur les seuils précis ou les modalités de purification ; cette page ne remplace pas la consultation d'un savant qualifié pour votre cas particulier. Barakah n'émet pas de fatwa.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Criblez vos actions dans Barakah</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah Plus exécute le criblage AAOIFI Standard 21 en direct pour les actions US, UK et Golfe, calcule la purification automatiquement, et suit votre zakat sur portefeuille année après année.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu'est-ce que la zakat ?</Link>
              <Link href="/fr/learn/what-is-sukuk" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Sukuk</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">Commencer gratuitement →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
