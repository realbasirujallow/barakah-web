/* eslint-disable react/no-unescaped-entities */
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
  title: 'Combien de zakat dois-je payer ? Calcul 2026 (avec exemple)',
  description: "Combien de zakat devez-vous ? Calculez 2,5 % de votre richesse nette imposable au-dessus du nisab, sur une année lunaire. Méthode, exemple chiffré et calculateur gratuit.",
  keywords: ['combien de zakat', 'calcul de la zakat', 'montant de la zakat', '2,5 % zakat', 'nisab', 'calculateur de zakat'],
  alternates: { canonical: L.fr, languages: L },
  openGraph: { title: 'Combien de zakat dois-je payer ?', description: 'Méthode, exemple chiffré et calculateur gratuit pour connaître le montant exact de votre zakat.', url: L.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR', images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }] },
};
const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'Quel pourcentage représente la zakat ?', acceptedAnswer: { '@type': 'Answer', text: 'La zakat est de 2,5 % de votre richesse nette imposable détenue au-dessus du nisab pendant une année lunaire complète.' } },
  { '@type': 'Question', name: 'La zakat se calcule-t-elle sur le revenu ?', acceptedAnswer: { '@type': 'Answer', text: 'Non. La zakat porte sur la richesse accumulée (épargne, or, investissements), pas sur le revenu annuel.' } },
]};
const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
  { '@type': 'ListItem', position: 2, name: 'Apprendre', item: 'https://trybarakah.com/learn' },
  { '@type': 'ListItem', position: 3, name: 'Combien de zakat ?', item: L.fr },
]};

export default function Page() {
  return (
    <main lang="fr" className="max-w-3xl mx-auto px-5 py-10 text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <p className="text-sm text-gray-500 mb-2"><Link href="/learn" className="hover:underline">Apprendre</Link> · <Link href="/learn/how-much-zakat-do-i-owe" className="underline">English</Link> · <Link href="/ar/learn/how-much-zakat-do-i-owe" className="underline">العربية</Link> · <Link href="/ur/learn/how-much-zakat-do-i-owe" className="underline">اردو</Link></p>
      <h1 className="text-3xl font-bold text-[#1B5E20] mb-4">Combien de zakat dois-je payer ?</h1>
      <p className="mb-4">La règle est simple : <strong>2,5 % de votre richesse nette imposable</strong>, à condition qu'elle dépasse le <em>nisab</em> et qu'une année lunaire complète (<em>hawl</em>) se soit écoulée.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">La formule</h2>
      <p className="mb-4">(Espèces + or/argent + investissements zakatables + créances) − dettes immédiates = richesse nette imposable. Puis × 2,5 %.</p>
      <h2 className="text-2xl font-semibold text-[#1B5E20] mt-8 mb-3">Exemple chiffré</h2>
      <ul className="list-disc pl-6 space-y-1 mb-4">
        <li>Épargne : 10 000 €</li>
        <li>Or : 3 000 €</li>
        <li>Actions (part zakatable) : 5 000 €</li>
        <li>Dettes dues maintenant : −2 000 €</li>
        <li><strong>Net imposable : 16 000 € → zakat = 400 €</strong></li>
      </ul>
      <p className="mb-4">La résidence principale, la voiture personnelle et les effets personnels ne comptent pas.</p>
      <div className="bg-[#E8F5E9] border border-[#1B5E20]/20 rounded-xl p-5 my-8">
        <p className="font-semibold text-[#1B5E20] mb-2">Calculez le montant exact gratuitement</p>
        <p className="mb-3 text-sm">Avec le nisab en direct (cours de l'or) et le suivi de votre hawl.</p>
        <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold">Ouvrir le calculateur →</Link>
      </div>
      <p className="text-xs text-gray-500 mt-8">Positions largement suivies, à titre informatif ; vérifiez auprès de votre savant. Barakah ne prétend pas à une autorité religieuse.</p>
    </main>
  );
}
