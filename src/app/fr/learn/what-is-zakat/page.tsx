/* eslint-disable react/no-unescaped-entities */
// French content uses apostrophes throughout (l'islam, qu'est-ce, etc.);
// escaping every one hurts readability — disable the rule for this page.
import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/what-is-zakat',
  fr: 'https://trybarakah.com/fr/learn/what-is-zakat',
  ar: 'https://trybarakah.com/ar/learn/what-is-zakat',
  ur: 'https://trybarakah.com/ur/learn/what-is-zakat',
  'x-default': 'https://trybarakah.com/learn/what-is-zakat',
};

export const metadata: Metadata = {
  title: "Qu'est-ce que la Zakat ? Guide complet 2026 — Règles, calcul et qui doit la payer",
  description:
    "Qu'est-ce que la zakat ? Le guide complet : définition, les cinq conditions, le seuil du nisab, comment calculer 2,5 % sur chaque type de bien, qui doit la payer et quand. Avec un calculateur gratuit.",
  keywords: ['qu\'est-ce que la zakat', 'zakat expliquée', 'règles de la zakat', 'comment calculer la zakat', 'nisab', 'hawl', 'zakat 2,5 %', 'qui doit payer la zakat'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: "Qu'est-ce que la Zakat ? Guide complet 2026",
    description: "Tout ce qu'il faut savoir sur la zakat : les conditions, le nisab, le calcul de 2,5 %, les biens imposables et le moment de la verser.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Qu'est-ce que la zakat en islam ?", acceptedAnswer: { '@type': 'Answer', text: "La zakat est le troisième pilier de l'islam — une aumône annuelle obligatoire versée par les musulmans éligibles sur leur richesse imposable. Le mot « zakat » (زكاة) signifie purification et croissance. Ceux qui atteignent le nisab versent 2,5 % de leur richesse nette imposable chaque année lunaire (hawl)." } },
    { '@type': 'Question', name: 'Combien représente la zakat ?', acceptedAnswer: { '@type': 'Answer', text: 'La zakat représente 2,5 % de votre richesse nette imposable détenue au-dessus du nisab pendant une année lunaire complète.' } },
    { '@type': 'Question', name: "Qu'est-ce que le nisab ?", acceptedAnswer: { '@type': 'Answer', text: "Le nisab est le seuil minimal de richesse au-dessus duquel la zakat devient obligatoire. Il équivaut à 85 g d'or ou 595 g d'argent et varie avec leurs cours." } },
  ],
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Apprendre', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: "Qu'est-ce que la zakat ?", item: LANGS.fr },
  ],
};

export default function Page() {
  return (
    <main lang="fr" className="max-w-3xl mx-auto px-5 py-10 text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">Apprendre</Link> · Disponible en : <Link href="/learn/what-is-zakat" className="underline">English</Link> · <Link href="/ar/learn/what-is-zakat" className="underline">العربية</Link> · <Link href="/ur/learn/what-is-zakat" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">Qu'est-ce que la Zakat ?</h1>

      <p className="mb-4">La <strong>zakat</strong> est le troisième pilier de l'islam : une aumône annuelle obligatoire versée par les musulmans éligibles sur leur richesse imposable. Le mot signifie « purification » et « croissance » — en donnant, on purifie le reste de ses biens.</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Combien : 2,5 %</h2>
      <p className="mb-4">La zakat correspond à <strong>2,5 % de votre richesse nette imposable</strong> détenue au-dessus du <em>nisab</em> pendant une année lunaire complète (le <em>hawl</em>). Ce n'est pas 2,5 % de vos revenus, mais de votre patrimoine éligible.</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Les cinq conditions</h2>
      <ul className="list-disc pl-6 space-y-1 mb-4">
        <li>Être musulman</li>
        <li>Posséder une richesse atteignant le <strong>nisab</strong></li>
        <li>Que cette richesse soit votre pleine propriété</li>
        <li>Qu'une année lunaire complète (<strong>hawl</strong>) se soit écoulée</li>
        <li>Que la richesse dépasse les besoins essentiels</li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Le nisab</h2>
      <p className="mb-4">Le nisab est le seuil minimal : l'équivalent de <strong>85 g d'or</strong> ou <strong>595 g d'argent</strong>. Comme les cours varient, le montant en euros ou en dollars change — c'est pourquoi il faut le vérifier au moment du calcul.</p>

      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Biens soumis à la zakat</h2>
      <ul className="list-disc pl-6 space-y-1 mb-4">
        <li>Espèces et comptes d'épargne</li>
        <li>Or et argent</li>
        <li>Actions et investissements (la part imposable)</li>
        <li>Comptes de retraite (selon l'accessibilité)</li>
        <li>Stocks et créances commerciales</li>
      </ul>
      <p className="mb-4">La résidence principale, la voiture personnelle et les effets personnels ne sont pas concernés.</p>

      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">Calculez votre zakat gratuitement</p>
        <p className="mb-3 text-sm">Suivez votre nisab et votre hawl toute l'année et obtenez le montant exact au jour exact.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">Ouvrir le calculateur de zakat →</Link>
      </div>

      <p className="text-xs text-gray-500 mt-8">Cet article présente des positions largement suivies à titre informatif ; vérifiez auprès de votre propre savant. Barakah ne prétend pas à une autorité religieuse.</p>
    </main>
  );
}
