import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trybarakah.com';
  const now = new Date().toISOString();

  return [
    // ── Homepage ─────────────────────────────────────────────────────────────
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0, lastModified: now },

    // ── High-value interactive tools ─────────────────────────────────────────
    { url: `${baseUrl}/zakat-calculator`,  changeFrequency: 'weekly', priority: 0.97, lastModified: now },
    { url: `${baseUrl}/faraid-calculator`, changeFrequency: 'weekly', priority: 0.92, lastModified: now },

    // ── Core marketing pages ─────────────────────────────────────────────────
    { url: `${baseUrl}/pricing`,    changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/features`,   changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/try`,        changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare`,    changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/careers`,    changeFrequency: 'monthly', priority: 0.66, lastModified: now },
    { url: `${baseUrl}/refer`,      changeFrequency: 'monthly', priority: 0.70, lastModified: now },

    // ── Trust / About ────────────────────────────────────────────────────────
    { url: `${baseUrl}/methodology`, changeFrequency: 'monthly', priority: 0.72, lastModified: now },
    { url: `${baseUrl}/methodology/changelog`, changeFrequency: 'weekly', priority: 0.75, lastModified: now },
    { url: `${baseUrl}/scholars`,    changeFrequency: 'monthly', priority: 0.70, lastModified: now },
    { url: `${baseUrl}/trust`,       changeFrequency: 'monthly', priority: 0.72, lastModified: now },
    { url: `${baseUrl}/security`,    changeFrequency: 'monthly', priority: 0.72, lastModified: now },

    // ── Learn hub index ───────────────────────────────────────────────────────
    { url: `${baseUrl}/learn`, changeFrequency: 'weekly', priority: 0.92, lastModified: now },

    // ── Zakat: core guides ────────────────────────────────────────────────────
    { url: `${baseUrl}/learn/what-is-zakat`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/how-much-zakat-do-i-owe`,    changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/nisab`,                      changeFrequency: 'weekly',  priority: 0.93, lastModified: now },
    { url: `${baseUrl}/learn/hawl`,                       changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/types-of-zakat`,             changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-al-fitr`,              changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-al-fitr-calculator`,   changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/sadaqah-vs-zakat`,           changeFrequency: 'monthly', priority: 0.85, lastModified: now },

    // ── Zakat: by asset class ─────────────────────────────────────────────────
    { url: `${baseUrl}/learn/zakat-on-gold`,              changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-gold-hanafi`,       changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-savings`,           changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-savings-account`,   changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-stocks`,            changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-stocks-and-etfs`,   changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-crypto`,            changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-401k`,              changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-retirement-accounts`, changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-business-assets`,   changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-rental-property`,   changeFrequency: 'monthly', priority: 0.88, lastModified: now },

    // ── Islamic investing / halal ─────────────────────────────────────────────
    { url: `${baseUrl}/learn/halal-stocks`,                       changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-etfs`,                         changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-401k`,                         changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-zoya`,                  changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-wahed`,                 changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-musaffa`,               changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-ynab`,                  changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-monarch`,               changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/learn/halal-stock-screener`,               changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/halal-investing-guide`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/is-my-mortgage-halal`,               changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-providers-usa`,       changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/learn/diminishing-musharaka-explained`,    changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/riba-free-mortgage`,                 changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/riba-elimination`,                   changeFrequency: 'monthly', priority: 0.88, lastModified: now },

    // ── Budgeting & household finance ─────────────────────────────────────────
    { url: `${baseUrl}/learn/halal-budgeting`,            changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/muslim-household-budget`,    changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/learn/madhab-finance`,             changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/islamic-finance-basics`,     changeFrequency: 'monthly', priority: 0.88, lastModified: now },

    // ── Estate & giving ───────────────────────────────────────────────────────
    { url: `${baseUrl}/learn/islamic-will`,               changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/islamic-will-template`,      changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/islamic-estate-planning`,    changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/hajj-savings-plan`,          changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/learn/ramadan-giving-tracker`,     changeFrequency: 'monthly', priority: 0.83, lastModified: now },

    // ── App comparison / acquisition pages ───────────────────────────────────
    { url: `${baseUrl}/learn/islamic-finance-app`,        changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/mint-alternative-for-muslims`, changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/islamic-budgeting-app`,      changeFrequency: 'monthly', priority: 0.90, lastModified: now },

    // ── UK-specific SEO (Week 12) ────────────────────────────────────────────
    { url: `${baseUrl}/zakat-uk`,                 changeFrequency: 'weekly',  priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/nisab-gbp`,          changeFrequency: 'weekly',  priority: 0.90, lastModified: now },

    // ── Ramadan 2027 seasonal landing (Week 6) ────────────────────────────────
    { url: `${baseUrl}/ramadan`,                 changeFrequency: 'weekly',  priority: 0.92, lastModified: now },

    // ── Halal Stocks — per-ticker (Week 6) ───────────────────────────────────
    { url: `${baseUrl}/halal-stocks`,            changeFrequency: 'weekly',  priority: 0.93, lastModified: now },
    { url: `${baseUrl}/halal-stocks/aapl`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/msft`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/amzn`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/tsla`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/nvda`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },


    // ── Fiqh Terms Glossary (Week 4) ─────────────────────────────────────────
    { url: `${baseUrl}/fiqh-terms`,              changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/zakat`,        changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/nisab`,        changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/hawl`,         changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/riba`,         changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/sadaqah`,      changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/musharaka`,    changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/murabaha`,     changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/ijara`,        changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/sukuk`,        changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/takaful`,      changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/waqf`,         changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/hibah`,        changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/faraid`,       changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/fiqh-terms/wassiyah`,     changeFrequency: 'monthly', priority: 0.85, lastModified: now },

    // ── Trust / verification (Week 7) ────────────────────────────────────────
    { url: `${baseUrl}/verify`, changeFrequency: 'monthly', priority: 0.80, lastModified: now },

    // ── Ambassador / outreach infrastructure (Week 11) ───────────────────────
    { url: `${baseUrl}/ambassadors`, changeFrequency: 'monthly', priority: 0.75, lastModified: now },

    // ── Auth pages ───────────────────────────────────────────────────────────
    { url: `${baseUrl}/login`,      changeFrequency: 'monthly', priority: 0.60, lastModified: now },
    { url: `${baseUrl}/signup`,     changeFrequency: 'monthly', priority: 0.80, lastModified: now },

    // ── Legal & contact ───────────────────────────────────────────────────────
    { url: `${baseUrl}/contact`,    changeFrequency: 'yearly', priority: 0.40, lastModified: now },
    { url: `${baseUrl}/privacy`,    changeFrequency: 'yearly', priority: 0.30, lastModified: now },
    { url: `${baseUrl}/terms`,      changeFrequency: 'yearly', priority: 0.30, lastModified: now },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.30, lastModified: now },
  ];
}
