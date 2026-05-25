import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Philadelphia, PA (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Philadelphia. Which halal mortgage providers serve Pennsylvania, the structures offered, and what local buyers should verify.',
  keywords: ['halal mortgage philadelphia', 'islamic home loan philadelphia', 'halal mortgage pennsylvania', 'islamic mortgage philadelphia', 'muslim mortgage philadelphia'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-philadelphia' },
  openGraph: {
    title: 'Halal Mortgage in Philadelphia, PA (2026)',
    description: 'Shariah-compliant home financing for Philadelphia-area Muslims — providers serving Pennsylvania, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-philadelphia',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Philadelphia',
  state: 'Pennsylvania',
  stateAbbr: 'PA',
  intro:
    'Philadelphia is home to one of the oldest and largest Muslim communities in the United States, with deep roots in the city’s African American Muslim history and a diverse population of immigrant families across the metro. Pennsylvania is served by national halal financing providers, so Shariah-compliant home ownership is a realistic option for Philadelphia families.',
  marketNote:
    'Among large East Coast metros, Philadelphia is relatively affordable, with home prices generally well below those of New York, Boston, or Washington. That makes the down payment — usually the hardest part of a halal purchase — more attainable than in pricier coastal cities. Prices and taxes vary widely between city neighborhoods and the surrounding suburbs, so compare carefully and factor in Philadelphia’s local taxes when weighing renting against buying.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in Pennsylvania. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current Pennsylvania availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Which halal mortgage providers are recommended for Pennsylvania?',
      a: 'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s co-ownership model permissible, and Guidance is licensed in Pennsylvania. AMJA permitted some other companies only in cases of dire need and ruled others — whose contracts contain disguised interest — impermissible. Confirm a provider\'s current AMJA status and Pennsylvania availability before applying, and consult a qualified scholar about the specific contract.',
    },
    {
      q: 'Is buying with halal financing realistic in Philadelphia?',
      a: 'For many families, yes. Philadelphia’s relatively moderate home prices for a major East Coast city mean the upfront share is more attainable than in costlier metros. The structure is the same as anywhere — co-ownership (diminishing musharaka), lease-to-own (ijara), or cost-plus sale (murabaha) — so the main work is saving the down payment and comparing providers’ effective costs.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
