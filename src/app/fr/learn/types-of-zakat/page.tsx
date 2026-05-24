/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';

const L = {
  en: 'https://trybarakah.com/learn/types-of-zakat',
  fr: 'https://trybarakah.com/fr/learn/types-of-zakat',
  ar: 'https://trybarakah.com/ar/learn/types-of-zakat',
  ur: 'https://trybarakah.com/ur/learn/types-of-zakat',
  'x-default': 'https://trybarakah.com/learn/types-of-zakat',
};
export const metadata: Metadata = {
  title: 'Les types de Zakat — Zakat al-Mal et Zakat al-Fitr (2026)',
  description: "Les types de zakat : la zakat al-mal (sur la richesse, 2,5 %) et la zakat al-fitr (avant l'Aïd, par personne). Sur quels biens, combien et quand.",
  keywords: ['types de zakat', 'zakat al-mal', 'zakat al-fitr', 'zakat sur la richesse', 'zakat Ramadan'],
  alternates: { canonical: L.fr, languages: L },
  openGraph: { title: 'Les types de Zakat', description: "Zakat al-mal et zakat al-fitr : différences, biens concernés, montants et moments.", url: L.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'Quelle est la différence entre zakat al-mal et zakat al-fitr ?', acceptedAnswer: { '@type': 'Answer', text: "La zakat al-mal est l'aumône annuelle de 2,5 % sur la richesse. La zakat al-fitr est une petite aumône fixe versée par personne avant la prière de l'Aïd al-Fitr." } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'Apprendre', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'Types de zakat', item: L.fr },
]};

export default function Page() {
  return (
    <main lang="fr" className="max-w-3xl mx-auto px-5 py-10 text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">Apprendre</Link> · <Link href="/learn/types-of-zakat" className="underline">English</Link> · <Link href="/ar/learn/types-of-zakat" className="underline">العربية</Link> · <Link href="/ur/learn/types-of-zakat" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">Les types de Zakat</h1>
      <p className="mb-4">Il existe deux grandes formes de zakat : la <strong>zakat al-mal</strong> (sur la richesse) et la <strong>zakat al-fitr</strong> (avant l'Aïd al-Fitr).</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">1. Zakat al-Mal (sur la richesse)</h2>
      <p className="mb-2">2,5 % de la richesse imposable détenue au-dessus du nisab pendant une année lunaire. Elle s'applique à :</p>
      <ul className="list-disc pl-6 space-y-1 mb-4">
        <li>Espèces et épargne</li>
        <li>Or et argent</li>
        <li>Actions et investissements</li>
        <li>Biens et stocks commerciaux</li>
        <li>Bétail et récoltes (règles propres)</li>
      </ul>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">2. Zakat al-Fitr (de la rupture du jeûne)</h2>
      <p className="mb-4">Une petite aumône fixe versée <strong>par personne</strong> du foyer avant la prière de l'Aïd al-Fitr, traditionnellement l'équivalent d'environ un repas (≈ 2,5–3 kg d'un aliment de base ou sa valeur). Elle purifie le jeûne et nourrit les nécessiteux pour la fête.</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">Calculez votre zakat al-mal</p>
        <p className="mb-3 text-sm">Tous types de biens, avec nisab en direct et suivi du hawl.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">Ouvrir le calculateur →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">Positions largement suivies, à titre informatif ; vérifiez auprès de votre savant. Barakah ne prétend pas à une autorité religieuse.</p>
    </main>
  );
}
