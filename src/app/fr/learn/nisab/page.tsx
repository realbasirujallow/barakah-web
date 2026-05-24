/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';

const L = {
  en: 'https://trybarakah.com/learn/nisab',
  fr: 'https://trybarakah.com/fr/learn/nisab',
  ar: 'https://trybarakah.com/ar/learn/nisab',
  ur: 'https://trybarakah.com/ur/learn/nisab',
  'x-default': 'https://trybarakah.com/learn/nisab',
};
export const metadata: Metadata = {
  title: 'Le Nisab expliqué — Le seuil de la zakat (or vs argent) 2026',
  description: "Qu'est-ce que le nisab ? Le seuil minimal qui rend la zakat obligatoire : 85 g d'or ou 595 g d'argent. Différence or/argent et pourquoi le montant change.",
  keywords: ['nisab', 'seuil de la zakat', 'nisab or', 'nisab argent', '85 grammes or', '595 grammes argent'],
  alternates: { canonical: L.fr, languages: L },
  openGraph: { title: 'Le Nisab expliqué', description: "Le seuil minimal de la zakat : or vs argent, et pourquoi le montant en euros change.", url: L.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: "Qu'est-ce que le nisab ?", acceptedAnswer: { '@type': 'Answer', text: "Le nisab est le seuil minimal de richesse au-dessus duquel la zakat devient obligatoire : l'équivalent de 85 g d'or ou 595 g d'argent." } },
  { '@type': 'Question', name: 'Or ou argent ?', acceptedAnswer: { '@type': 'Answer', text: "Le nisab argent est plus bas, donc plus de personnes deviennent redevables — beaucoup de savants le recommandent aujourd'hui par prudence et générosité." } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'Apprendre', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'Nisab', item: L.fr },
]};

export default function Page() {
  return (
    <main lang="fr" className="max-w-3xl mx-auto px-5 py-10 text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">Apprendre</Link> · <Link href="/learn/nisab" className="underline">English</Link> · <Link href="/ar/learn/nisab" className="underline">العربية</Link> · <Link href="/ur/learn/nisab" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">Le Nisab</h1>
      <p className="mb-4">Le <strong>nisab</strong> est le seuil minimal de richesse : si votre patrimoine imposable l'atteint et qu'une année lunaire s'écoule, la zakat devient obligatoire.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Les deux références</h2>
      <ul className="list-disc pl-6 space-y-1 mb-4">
        <li><strong>Or :</strong> 85 grammes (≈ 7,5 tola)</li>
        <li><strong>Argent :</strong> 595 grammes (≈ 52,5 tola)</li>
      </ul>
      <p className="mb-4">Comme les cours de l'or et de l'argent varient chaque jour, la valeur du nisab en euros ou en dollars change — il faut donc la vérifier au moment du calcul.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Or ou argent ?</h2>
      <p className="mb-4">Le nisab de l'argent est nettement plus bas. L'utiliser rend plus de personnes redevables et augmente l'aumône versée — c'est pourquoi de nombreux savants le recommandent aujourd'hui pour ceux qui détiennent un mélange de biens.</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">Voir votre nisab en direct</p>
        <p className="mb-3 text-sm">Barakah suit le nisab avec les cours de l'or en temps réel et vous dit si vous y êtes.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">Ouvrir le calculateur →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">Positions largement suivies, à titre informatif ; vérifiez auprès de votre savant. Barakah ne prétend pas à une autorité religieuse.</p>
    </main>
  );
}
