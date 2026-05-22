import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in San Antonio, TX (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in San Antonio. Which halal mortgage providers serve Texas, the structures offered, and how local affordability shapes the rent-versus-buy decision.',
  keywords: ['halal mortgage san antonio', 'islamic home loan san antonio', 'islamic mortgage texas', 'muslim mortgage san antonio', 'sharia home loan san antonio'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-san-antonio' },
  openGraph: {
    title: 'Halal Mortgage in San Antonio, TX (2026)',
    description: 'Shariah-compliant home financing for San Antonio Muslims — providers serving Texas, structures, and affordability notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-san-antonio',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'San Antonio',
  state: 'Texas',
  stateAbbr: 'TX',
  intro:
    'San Antonio combines a growing Muslim community with some of the most attainable housing among large Texas metros. For families weighing a first home, that affordability makes Shariah-compliant financing a realistic near-term goal rather than a distant one.',
  marketNote:
    'San Antonio is typically more affordable than Austin, Dallas, or Houston, with home prices below the national median in many neighborhoods. As across Texas, there is no state income tax but property taxes run high — so even in an affordable market, build the full property-tax bill into your homeownership budget when comparing against renting.',
  providerNote:
    'As a Texas market, San Antonio is covered by the national halal financiers: Guidance Residential and UIF Corporation are active in the state, Ameen Housing has historically operated in Texas, and LARIBA serves buyers across most states. Compare each provider\'s structure and effective cost before committing.',
  providers: ['Guidance Residential', 'UIF Corporation', 'Ameen Housing', 'LARIBA'],
  localFaq: [
    {
      q: 'Is San Antonio affordable enough to buy halal rather than rent?',
      a: 'For many families, yes — San Antonio is among the more affordable large Texas metros, which shortens the time needed to save a down payment. Run a rent-versus-buy comparison over how long you plan to stay, including high Texas property taxes, before deciding.',
    },
    {
      q: 'Do I need a Texas-based provider to finance a San Antonio home?',
      a: 'No. Halal financing is licensed at the state level, so any provider authorized in Texas — including the national programs — can finance a home anywhere in the San Antonio metro.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
