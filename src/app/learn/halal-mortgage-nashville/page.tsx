import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Nashville, TN (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Nashville, Tennessee. Which halal mortgage providers serve Tennessee, the structures offered, and what local buyers should verify.',
  keywords: ['halal mortgage nashville', 'islamic home loan nashville', 'halal mortgage tennessee', 'islamic mortgage nashville', 'muslim mortgage nashville'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-nashville' },
  openGraph: {
    title: 'Halal Mortgage in Nashville, TN (2026)',
    description: 'Shariah-compliant home financing for Nashville-area Muslims — providers serving Tennessee, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-nashville',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Nashville',
  state: 'Tennessee',
  stateAbbr: 'TN',
  intro:
    'Nashville is home to a vibrant Muslim community, including the largest Kurdish population in the United States — the South Nashville neighborhood widely known as "Little Kurdistan" — alongside a diverse and growing Muslim population across Middle Tennessee. Tennessee is served by national halal financing providers, so Shariah-compliant ownership is a realistic path here.',
  marketNote:
    'Nashville has grown quickly and home prices rose sharply during that boom, though the metro remains more affordable than the large coastal cities. Because the area is still expanding, prices and inventory vary widely between close-in neighborhoods and the surrounding counties — compare carefully. Tennessee also has no state income tax on wages, which can leave more room in a household budget to save toward a down payment.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in Tennessee. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current Tennessee availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Where is the main Muslim community in Nashville?',
      a: 'Nashville has a well-known concentration in South Nashville — the area often called "Little Kurdistan," home to the largest Kurdish community in the US — along with mosques and Muslim families spread across the metro and into surrounding counties. Halal financing is licensed at the state level, so a provider authorized in Tennessee can finance a home anywhere in the area.',
    },
    {
      q: 'Does Tennessee having no state income tax help?',
      a: 'Indirectly. Halal financing avoids interest (riba) regardless of state taxes, so it does not change the structure. But because Tennessee does not tax wage income, households may have more take-home pay to put toward a down payment — usually the hardest part of buying.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
