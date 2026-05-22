import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Los Angeles, CA (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Los Angeles. Which halal mortgage providers serve California (including LA-area LARIBA), the structures offered, and how to manage a high-cost market.',
  keywords: ['halal mortgage los angeles', 'islamic home loan los angeles', 'islamic mortgage california', 'muslim mortgage los angeles', 'sharia home loan la'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-los-angeles' },
  openGraph: {
    title: 'Halal Mortgage in Los Angeles, CA (2026)',
    description: 'Shariah-compliant home financing for LA Muslims — providers serving California, structures, and high-cost-market tactics.',
    url: 'https://trybarakah.com/learn/halal-mortgage-los-angeles',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Los Angeles',
  state: 'California',
  stateAbbr: 'CA',
  intro:
    'Greater Los Angeles has a large, diverse Muslim population across the San Gabriel Valley, Orange County, and the Inland Empire. It is also one of the most expensive housing markets in the country, which makes choosing the right halal financing structure — and saving a sufficient down payment — especially important.',
  marketNote:
    'LA is consistently among the highest-cost metros in the US, with home prices well above the national median across most desirable neighborhoods. For many buyers that means a larger down payment and looking toward the Inland Empire or Antelope Valley for attainable entry points. Because the financed amount is large, even small differences in a provider\'s effective profit rate add up — compare carefully.',
  providerNote:
    'California is served by LARIBA, whose affiliated Bank of Whittier sits in the LA metro and is one of the longest-running Islamic finance institutions in the country. Ameen Housing also has a long California track record, and the national providers Guidance Residential and UIF Corporation are licensed in the state. Between them, LA buyers have several Shariah-compliant routes to ownership.',
  providers: ['LARIBA / Bank of Whittier', 'Ameen Housing', 'Guidance Residential', 'UIF Corporation'],
  localFaq: [
    {
      q: 'Is there a halal mortgage provider based in the LA area?',
      a: 'LARIBA, affiliated with Bank of Whittier in the Los Angeles metro, is one of the oldest Islamic finance institutions in the US and uses a co-investment model. Ameen Housing has also operated in California for years. Both are worth comparing alongside the national providers.',
    },
    {
      q: 'How do I afford a halal home purchase in such an expensive market?',
      a: 'Two practical levers: build a larger down payment to reduce the financed amount, and widen your search to more attainable parts of the metro such as the Inland Empire. Because halal structures price the financier\'s return on the amount financed, a bigger down payment directly lowers your monthly obligation.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
