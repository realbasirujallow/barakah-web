import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Washington, DC (2026) — Islamic Home Financing (DMV)',
  description:
    'How to get a Shariah-compliant home loan in Washington, DC and the DMV (Maryland & Virginia suburbs). Which halal mortgage providers serve the area, the structures offered, and what to verify.',
  keywords: ['halal mortgage washington dc', 'islamic home loan dc', 'halal mortgage dmv', 'islamic mortgage virginia maryland', 'muslim mortgage washington dc'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-washington-dc' },
  openGraph: {
    title: 'Halal Mortgage in Washington, DC (2026)',
    description: 'Shariah-compliant home financing across the DMV — providers serving DC, Maryland & Virginia, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-washington-dc',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Washington',
  state: 'Washington, DC',
  stateAbbr: 'DC',
  intro:
    'The Washington, DC metro — the DMV, spanning the District, suburban Maryland, and Northern Virginia — is home to one of the largest, most diverse, and most highly educated Muslim communities in the country. It is well-served for halal home financing, with national providers licensed across DC, Maryland, and Virginia.',
  marketNote:
    'The DMV is a high-cost housing market, especially in Northern Virginia and close-in Maryland suburbs, so the down payment is typically the biggest hurdle. Where you buy across the three jurisdictions can meaningfully change your price, property taxes, and commute — many Muslim families weigh Fairfax, Loudoun, and Prince William counties in Virginia or Montgomery and Prince George\'s in Maryland against District prices. Compare carefully before deciding to buy or keep renting.',
  providerNote:
    'Halal financing is licensed jurisdiction by jurisdiction. AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in the District of Columbia as well as Maryland and Virginia — so DMV buyers are covered on any side of the line. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current DC/MD/VA availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Does it matter whether I buy in DC, Maryland, or Virginia?',
      a: 'For halal financing, what matters is that your provider is licensed in the specific jurisdiction where the home sits. Guidance Residential — found permissible by AMJA\'s Resident Fatwa Committee — is licensed in DC, Maryland, and Virginia, so most DMV buyers are covered across all three. Beyond financing, the jurisdictions differ a lot on price, property tax, and transfer/recordation costs — factor those in, and consult a scholar about the specific contract.',
    },
    {
      q: 'Which DMV areas have the largest Muslim communities?',
      a: 'Muslim families are spread throughout the metro, with well-established communities in Northern Virginia (Fairfax, Loudoun, Prince William) and suburban Maryland (Montgomery and Prince George\'s counties), alongside the District itself. Because financing is licensed by jurisdiction rather than neighborhood, any provider authorized where you are buying can finance your home.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
