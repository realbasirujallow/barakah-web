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
    { url: `${baseUrl}/pricing`,    changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/features`,   changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/try`,        changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/compare`,    changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/careers`,    changeFrequency: 'monthly', priority: 0.66, lastModified: now },
    { url: `${baseUrl}/refer`,      changeFrequency: 'monthly', priority: 0.70 },

    // ── Trust / About ────────────────────────────────────────────────────────
    { url: `${baseUrl}/methodology`, changeFrequency: 'monthly', priority: 0.72, lastModified: now },
    { url: `${baseUrl}/methodology/changelog`, changeFrequency: 'weekly', priority: 0.75, lastModified: now },
    { url: `${baseUrl}/scholars`,    changeFrequency: 'monthly', priority: 0.70, lastModified: now },
    { url: `${baseUrl}/trust`,       changeFrequency: 'monthly', priority: 0.72 },
    { url: `${baseUrl}/security`,    changeFrequency: 'monthly', priority: 0.72 },

    // ── Learn hub index ───────────────────────────────────────────────────────
    { url: `${baseUrl}/learn`, changeFrequency: 'weekly', priority: 0.92, lastModified: now },

    // ── Zakat: core guides ────────────────────────────────────────────────────
    { url: `${baseUrl}/learn/what-is-zakat`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/how-much-zakat-do-i-owe`,    changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/nisab`,                      changeFrequency: 'weekly',  priority: 0.93, lastModified: now },
    { url: `${baseUrl}/learn/nisab-threshold`,            changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/hawl`,                       changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/types-of-zakat`,             changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-al-fitr`,              changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/zakat-al-fitr-calculator`,   changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/sadaqah-vs-zakat`,           changeFrequency: 'monthly', priority: 0.85 },

    // ── Zakat: by asset class ─────────────────────────────────────────────────
    { url: `${baseUrl}/learn/zakat-on-gold`,              changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-gold-hanafi`,       changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/learn/zakat-on-savings`,           changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-savings-account`,   changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/zakat-on-stocks`,            changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-stocks-and-etfs`,   changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/zakat-on-crypto`,            changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-401k`,              changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/zakat-on-retirement-accounts`, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/zakat-on-business-assets`,   changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/zakat-on-rental-property`,   changeFrequency: 'monthly', priority: 0.88 },

    // ── Islamic investing / halal ─────────────────────────────────────────────
    { url: `${baseUrl}/learn/halal-stocks`,                       changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-etfs`,                         changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-401k`,                         changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-zoya`,                  changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/halal-stock-screener`,               changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/halal-investing-guide`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/is-my-mortgage-halal`,               changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/halal-mortgage-providers-usa`,       changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/learn/diminishing-musharaka-explained`,    changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/riba-free-mortgage`,                 changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/riba-elimination`,                   changeFrequency: 'monthly', priority: 0.88 },

    // ── Budgeting & household finance ─────────────────────────────────────────
    { url: `${baseUrl}/learn/halal-budgeting`,            changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/muslim-household-budget`,    changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/learn/madhab-finance`,             changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/islamic-finance-basics`,     changeFrequency: 'monthly', priority: 0.88 },

    // ── Estate & giving ───────────────────────────────────────────────────────
    { url: `${baseUrl}/learn/islamic-will`,               changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/islamic-will-template`,      changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/islamic-estate-planning`,    changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/learn/hajj-savings-plan`,          changeFrequency: 'monthly', priority: 0.83 },
    { url: `${baseUrl}/learn/ramadan-giving-tracker`,     changeFrequency: 'monthly', priority: 0.83 },

    // ── App comparison / acquisition pages ───────────────────────────────────
    { url: `${baseUrl}/learn/islamic-finance-app`,        changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/mint-alternative-for-muslims`, changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/islamic-budgeting-app`,      changeFrequency: 'monthly', priority: 0.90, lastModified: now },

    // ── Auth pages ───────────────────────────────────────────────────────────
    { url: `${baseUrl}/login`,      changeFrequency: 'monthly', priority: 0.60 },
    { url: `${baseUrl}/signup`,     changeFrequency: 'monthly', priority: 0.80, lastModified: now },

    // ── Legal & contact ───────────────────────────────────────────────────────
    { url: `${baseUrl}/contact`,    changeFrequency: 'yearly', priority: 0.40 },
    { url: `${baseUrl}/privacy`,    changeFrequency: 'yearly', priority: 0.30 },
    { url: `${baseUrl}/terms`,      changeFrequency: 'yearly', priority: 0.30 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.30 },
  ];
}
