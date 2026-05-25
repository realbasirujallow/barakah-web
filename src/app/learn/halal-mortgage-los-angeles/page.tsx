import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Los Angeles, CA (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Los Angeles. Which halal mortgage providers serve California (including the AMJA-permissible Ameen Housing Cooperative), the structures offered, and how to manage a high-cost market.',
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
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model and the California-based Ameen Housing Cooperative permissible. Ameen, a member-owned co-op with a long California track record, operates only in California, and Guidance is licensed across the state. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and consult a qualified scholar before committing.',
  providers: ['Guidance Residential — AMJA-permissible', 'Ameen Housing Cooperative, California — AMJA-permissible'],
  localFaq: [
    {
      q: 'Is there a California-based halal home financing provider?',
      a: 'Yes. The Ameen Housing Cooperative is a member-owned co-op based in California that uses a genuine co-ownership model, and AMJA\'s Resident Fatwa Committee found its contracts permissible. AMJA also found Guidance Residential\'s co-ownership model permissible. Compare Ameen\'s membership terms against Guidance before deciding.',
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
