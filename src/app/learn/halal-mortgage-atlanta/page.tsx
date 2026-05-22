import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Atlanta, GA (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Atlanta. Which halal mortgage providers serve Georgia, the structures offered, and what to verify before you apply.',
  keywords: ['halal mortgage atlanta', 'islamic home loan atlanta', 'islamic mortgage georgia', 'muslim mortgage atlanta', 'sharia home loan atlanta'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-atlanta' },
  openGraph: {
    title: 'Halal Mortgage in Atlanta, GA (2026)',
    description: 'Shariah-compliant home financing for Atlanta Muslims — providers serving Georgia, structures, and local market notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-atlanta',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Atlanta',
  state: 'Georgia',
  stateAbbr: 'GA',
  intro:
    'Metro Atlanta has a rapidly growing Muslim community, particularly in suburbs like Alpharetta, Duluth, and Lilburn. Combined with relatively moderate Sun Belt housing prices, that growth has made Shariah-compliant home financing an increasingly common question for Atlanta families.',
  marketNote:
    'Atlanta sits in the middle of the affordability range for large US metros — pricier than the rural Southeast but well below the coasts, with strong suburban inventory in the northern counties. Steady population growth has pushed prices up in recent years, so saving a solid down payment ahead of time materially improves the math on a diminishing-musharaka purchase.',
  providerNote:
    'Georgia is served by the major national halal financiers. Guidance Residential and UIF Corporation operate in the state, and LARIBA and Devon Bank are available to buyers across most US states. Confirm current licensing and program terms with each before you apply, since availability and pricing shift over time.',
  providers: ['Guidance Residential', 'UIF Corporation', 'LARIBA', 'Devon Bank'],
  localFaq: [
    {
      q: 'Which halal mortgage providers serve the Atlanta area?',
      a: 'The national providers Guidance Residential and UIF Corporation are the most commonly used in Georgia, with LARIBA and Devon Bank also serving buyers in most states. There is no large Atlanta-headquartered Islamic financier, so most buyers work with these national programs.',
    },
    {
      q: 'Is Atlanta a good market for a first halal home purchase?',
      a: 'For many buyers, yes — Atlanta\'s suburban inventory and mid-range prices are more forgiving than coastal metros. As always, compare the total cost of a halal program against renting over your expected time in the home, and factor in Georgia property taxes and HOA fees common in the northern suburbs.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
