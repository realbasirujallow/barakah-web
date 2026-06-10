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
  title: 'Budget halal — gérer son argent selon la charia 2026',
  description:
    "Un cadre concret pour le budget d'une famille musulmane : donner la priorité à la zakat et aux obligations, éviter le riba, distinguer besoins et envies, la modération, et réserver une part à la sadaqa, avec les outils Barakah.",
  keywords: ['budget halal', 'gestion argent islamique', 'budget famille musulmane', 'dépenses halal', 'budget sans riba', 'application budget islamique'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: 'Budget halal — gérer son argent selon la charia 2026',
    description: "Cadre concret pour le budget d'une famille musulmane : la zakat d'abord, éviter le riba, la modération, et une part pour la sadaqa.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: "Qu'est-ce qui rend un budget « halal » ?",
    a: "Un budget halal n'est pas qu'une question de chiffres : c'est une hiérarchie de priorités fidèle aux objectifs de la charia. Le revenu doit être licite, les droits obligatoires (zakat, entretien de la famille) viennent en premier, on évite le riba dans l'épargne et l'emprunt, on dépense avec modération sans gaspillage ni avarice, et on réserve une part à la sadaqa. Il allie discipline financière et bonne intention.",
  },
  {
    q: "Comment hiérarchiser ses dépenses de façon islamique ?",
    a: "Ordre suggéré : (1) revenu licite, puis (2) droits obligatoires (zakat, entretien, dettes dues), puis (3) besoins essentiels (logement, nourriture, éducation, santé), puis (4) épargne et investissement halal pour l'urgence et l'avenir, puis (5) sadaqa et bienfaisance, puis (6) le superflu licite avec modération. La règle : l'obligatoire avant le besoin, le besoin avant le superflu.",
  },
  {
    q: "Éviter le riba fait-il partie d'un budget halal ?",
    a: "Oui, c'est un pilier essentiel. Un budget halal évite les intérêts dans l'emprunt et l'épargne, cherche à rembourser les dettes à intérêt existantes, et choisit des alternatives conformes à la charia. Une bonne planification financière réduit d'ailleurs le besoin de recourir à l'emprunt à intérêt.",
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
    { '@type': 'ListItem', position: 3, name: 'Budget halal', item: LANGS.fr },
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
          <span className="text-gray-900">Budget halal</span>
        </div>
      </nav>
      <main className="flex-1" lang="fr">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            Disponible en :{' '}
            <Link href="/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/ar/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">العربية</Link> ·{' '}
            <Link href="/ur/learn/halal-budgeting" className="underline hover:text-[#1B5E20]">اردو</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Budget halal</h1>
          <p className="text-base text-gray-600 mb-6">Dernière révision : 2026-06-09 · Page informative — ne remplace pas l&apos;avis d&apos;un savant</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-8 text-gray-800">
              Un budget halal hiérarchise les priorités selon les objectifs de la charia : <strong>un revenu licite</strong>, puis <strong>les obligations</strong> comme la zakat et l&apos;entretien,
              puis <strong>les besoins</strong>, puis <strong>l&apos;épargne et l&apos;investissement halal</strong>, puis <strong>la sadaqa</strong>, puis le superflu avec modération — en évitant le riba partout.
              Il allie discipline et bonne intention pour rechercher la baraka dans l&apos;argent.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Le cadre des dépenses par priorité</h2>
            <ol className="list-decimal space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li><strong>Revenu licite :</strong> partez d&apos;un gain halal — c&apos;est le fondement de la baraka.</li>
              <li><strong>Droits obligatoires :</strong> la zakat, l&apos;entretien de ceux dont vous avez la charge, les dettes dues.</li>
              <li><strong>Besoins essentiels :</strong> logement, nourriture, éducation, santé, transport.</li>
              <li><strong>Épargne et investissement halal :</strong> d&apos;abord un fonds d&apos;urgence, puis un investissement conforme à la charia.</li>
              <li><strong>Sadaqa et bienfaisance :</strong> réservez-lui une part fixe, même modeste.</li>
              <li><strong>Superflu licite :</strong> avec modération, sans gaspillage ni excès.</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Les principes d&apos;un budget halal</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li><strong>Éviter le riba :</strong> dans l&apos;emprunt et l&apos;épargne, en cherchant à rembourser les dettes à intérêt.</li>
              <li><strong>La modération :</strong> ni gaspillage ni avarice — le meilleur des choix est le juste milieu.</li>
              <li><strong>Donner la priorité à l&apos;obligatoire :</strong> la zakat et l&apos;entretien avant le superflu.</li>
              <li><strong>La bonne intention :</strong> dépenser pour sa famille et entretenir les liens est récompensé.</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Avertissement</h2>
            <p className="text-sm leading-8 text-amber-900">
              Ce sont des principes généraux de gestion de l&apos;argent dans une perspective islamique, et Barakah n&apos;émet pas de fatwas. Pour les questions particulières (comme le calcul de la zakat ou le statut d&apos;un produit financier précis), référez-vous à un savant qualifié.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Construisez votre budget halal avec Barakah</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              Barakah vous aide à bâtir un budget qui donne la priorité à la zakat et aux obligations, détecte les sources de riba dans vos transactions, et suit vos dons et votre zakat au même endroit.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/zakat-calculator" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">Calculateur de zakat →</Link>
              <Link href="/fr/learn/riba-elimination" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Éliminer le riba</Link>
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu&apos;est-ce que la zakat ?</Link>
              <Link href="/signup" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Commencer gratuitement</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
