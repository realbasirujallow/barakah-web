import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Detroit, MI (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Detroit and Dearborn. Which halal mortgage providers serve Michigan (including Michigan-based UIF Corporation), the structures offered, and what to verify.',
  keywords: ['halal mortgage detroit', 'islamic home loan detroit', 'halal mortgage dearborn', 'islamic mortgage michigan', 'muslim mortgage detroit'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-detroit' },
  openGraph: {
    title: 'Halal Mortgage in Detroit, MI (2026)',
    description: 'Shariah-compliant home financing for Detroit & Dearborn Muslims — providers serving Michigan, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-detroit',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Detroit',
  state: 'Michigan',
  stateAbbr: 'MI',
  intro:
    'Metro Detroit — and Dearborn in particular — is home to one of the largest and most concentrated Arab and Muslim communities in the United States. It is also exceptionally well-served for halal home financing, because one of the country\'s major Islamic finance providers is based in Michigan.',
  marketNote:
    'Detroit is one of the most affordable major metros in the country, with home prices well below the national median across much of the city and many inner-ring suburbs. That low entry point makes a halal down payment reachable relatively quickly, though buyers should weigh neighborhood-level differences in price, taxes, and resale carefully when comparing renting to buying.',
  providerNote:
    'Michigan is the home state of UIF Corporation (University Islamic Financial), a subsidiary of Ann Arbor–based University Bank and one of the most established halal home financiers in the US. That local presence makes UIF a natural first stop for Detroit and Dearborn buyers. The national providers Guidance Residential and LARIBA, plus Devon Bank, also serve Michigan.',
  providers: ['UIF Corporation (Michigan)', 'Guidance Residential', 'LARIBA', 'Devon Bank'],
  localFaq: [
    {
      q: 'Is there a Michigan-based halal mortgage provider?',
      a: 'Yes. UIF Corporation (University Islamic Financial) is a subsidiary of University Bank in Ann Arbor, Michigan, and is one of the longest-running halal home financiers in the country. Its local roots make it a common choice for Detroit and Dearborn buyers, though comparing its effective cost against other providers is still wise.',
    },
    {
      q: 'Are halal mortgages available in Dearborn specifically?',
      a: 'Yes. Halal financing is licensed at the state level, so any provider authorized in Michigan can finance homes throughout the metro, including Dearborn, Dearborn Heights, Hamtramck, and the surrounding suburbs.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
