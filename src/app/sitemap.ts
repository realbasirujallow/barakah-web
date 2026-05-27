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
    { url: `${baseUrl}/press`,       changeFrequency: 'monthly', priority: 0.65, lastModified: now },

    // ── Learn hub index ───────────────────────────────────────────────────────
    { url: `${baseUrl}/learn`, changeFrequency: 'weekly', priority: 0.92, lastModified: now },

    // ── Zakat: core guides ────────────────────────────────────────────────────
    { url: `${baseUrl}/learn/what-is-zakat`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    // Localized (fr/ar/ur) — top zakat cluster
    { url: `${baseUrl}/fr/learn/what-is-zakat`,           changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/ar/learn/what-is-zakat`,           changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/ur/learn/what-is-zakat`,           changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/fr/learn/how-much-zakat-do-i-owe`, changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/ar/learn/how-much-zakat-do-i-owe`, changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/ur/learn/how-much-zakat-do-i-owe`, changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/fr/learn/nisab`,                   changeFrequency: 'weekly',  priority: 0.80, lastModified: now },
    { url: `${baseUrl}/ar/learn/nisab`,                   changeFrequency: 'weekly',  priority: 0.80, lastModified: now },
    { url: `${baseUrl}/ur/learn/nisab`,                   changeFrequency: 'weekly',  priority: 0.80, lastModified: now },
    { url: `${baseUrl}/fr/learn/types-of-zakat`,          changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/ar/learn/types-of-zakat`,          changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/ur/learn/types-of-zakat`,          changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    // Localized expansion 2026-05-27 — universal Islamic-finance concepts (sukuk, hawl)
    { url: `${baseUrl}/fr/learn/what-is-sukuk`,           changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/ar/learn/what-is-sukuk`,           changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/ur/learn/what-is-sukuk`,           changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/fr/learn/hawl`,                    changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/ar/learn/hawl`,                    changeFrequency: 'monthly', priority: 0.78, lastModified: now },
    { url: `${baseUrl}/ur/learn/hawl`,                    changeFrequency: 'monthly', priority: 0.78, lastModified: now },
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
    { url: `${baseUrl}/compare/barakah-vs-quicken`,               changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-pocketguard`,           changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-zeta`,                  changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-rocketmoney`,           changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-spendee`,               changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-fudget`,                changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-mvelopes`,              changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-robinhood`,             changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-acorns`,                changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-stash`,                 changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-yaqeen-money`,          changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-saturna`,               changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    // 2026-05-14: six compare pages existed as routes but were missing from
    // the sitemap — Google had no canonical discovery path for them. The
    // `/compare/islamic-finance-apps` hub gets the highest priority because
    // it's a multi-app comparison page with strong long-tail intent.
    { url: `${baseUrl}/compare/islamic-finance-apps`,             changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-empower`,               changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-personal-capital`,      changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-wealthfront`,           changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-copilot`,               changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/compare/barakah-vs-tiller`,                changeFrequency: 'monthly', priority: 0.83, lastModified: now },
    { url: `${baseUrl}/learn/halal-stock-screener`,               changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/halal-investing-guide`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/is-my-mortgage-halal`,               changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-providers-usa`,       changeFrequency: 'monthly', priority: 0.87, lastModified: now },
    // 2026-05-22 (SEO-7): city-specific halal mortgage pages + wasiyyah hadith (search-demand gaps)
    { url: `${baseUrl}/learn/halal-mortgage-chicago`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-los-angeles`,         changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-houston`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-atlanta`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-san-antonio`,         changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-tulsa`,               changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    // 2026-05-22 (SEO-8): more city halal-mortgage pages
    { url: `${baseUrl}/learn/halal-mortgage-detroit`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-dallas`,              changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-minneapolis`,         changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    // 2026-05-24 (SEO-9): five more city halal-mortgage pages + a "near me" hub
    // (cross-links all 14 city pages for internal-link equity). Provider state
    // availability verified against Guidance Residential's official licensed-states
    // page (CA/WA/OH/PA/AZ all confirmed). Provider lists limited to AMJA-permissible firms (Guidance; Ameen in CA).
    { url: `${baseUrl}/learn/halal-mortgage-san-jose`,            changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-seattle`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-columbus`,            changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-philadelphia`,        changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-phoenix`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-near-me`,             changeFrequency: 'monthly', priority: 0.84, lastModified: now },
    { url: `${baseUrl}/learn/islamic-loans-usa`,                  changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    // 2026-05-24 (SEO-10): five more city halal-mortgage pages (state coverage
    // confirmed against Guidance Residential's official division list: DC, MA,
    // TN, NC, CO all listed). Provider lists limited to AMJA-permissible firms (Guidance Residential).
    { url: `${baseUrl}/learn/halal-mortgage-washington-dc`,       changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-boston`,              changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-nashville`,           changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-raleigh`,             changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-denver`,              changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/la-wasiyyata-li-warith`,             changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/what-is-sukuk`,                      changeFrequency: 'monthly', priority: 0.86, lastModified: now },
    { url: `${baseUrl}/learn/islamic-estate-planning-tools`,      changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/diminishing-musharaka-explained`,    changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/riba-free-mortgage`,                 changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/riba-elimination`,                   changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-cryptocurrency`,            changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/is-my-401k-halal`,                   changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-robo-advisor-comparison`,      changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-stock-options-rsus`,        changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-vs-rent-2026`,        changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/ramadan-giving-tracker-setup`,       changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/is-bitcoin-halal-2026`,              changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/halal-life-insurance-vs-takaful`,    changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-credit-card-alternatives-2026`,    changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-nfts-and-digital-assets`,       changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/is-amazon-stock-halal-2026`,             changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/ijara-vs-murabaha-vs-musharaka-explained`, changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/is-a-529-plan-halal`,                    changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-emergency-fund-methodology`,       changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-receivables-and-business-debts`, changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/halal-real-estate-investing-2026`,       changeFrequency: 'monthly', priority: 0.90, lastModified: now },

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

    // ── UK-specific SEO ──────────────────────────────────────────────────────
    { url: `${baseUrl}/zakat-uk`,                 changeFrequency: 'weekly',  priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/nisab-gbp`,          changeFrequency: 'weekly',  priority: 0.90, lastModified: now },

    // ── Ramadan 2027 seasonal landing ────────────────────────────────────────
    { url: `${baseUrl}/ramadan`,                 changeFrequency: 'weekly',  priority: 0.92, lastModified: now },

    // ── Halal Stocks — per-ticker ────────────────────────────────────────────
    { url: `${baseUrl}/halal-stocks`,            changeFrequency: 'weekly',  priority: 0.93, lastModified: now },
    { url: `${baseUrl}/halal-stocks/list`,       changeFrequency: 'weekly',  priority: 0.92, lastModified: now },
    { url: `${baseUrl}/halal-stocks/aapl`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/msft`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/amzn`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/tsla`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/nvda`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    // 2026-05-17 (SEO-5): three new high-volume tickers
    { url: `${baseUrl}/halal-stocks/googl`,      changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/meta`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/nflx`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    // 2026-05-20 (SEO-6): four new tickers
    { url: `${baseUrl}/halal-stocks/orcl`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/crm`,        changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/amd`,        changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/adbe`,       changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    // 2026-05-22 (SEO-7): consumer-staples ticker (high search demand)
    { url: `${baseUrl}/halal-stocks/ul`,         changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    // 2026-05-22 (SEO-8): more consumer-staples tickers
    { url: `${baseUrl}/halal-stocks/pg`,         changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    { url: `${baseUrl}/halal-stocks/ko`,         changeFrequency: 'weekly',  priority: 0.90, lastModified: now },
    // 2026-05-25 (SEO-9): Nestlé — final consumer-staples ticker from gap analysis (was open item)
    { url: `${baseUrl}/halal-stocks/nsrgy`,      changeFrequency: 'weekly',  priority: 0.90, lastModified: now },


    // ── Fiqh Terms Glossary ──────────────────────────────────────────────────
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

    // ── Trust / verification ─────────────────────────────────────────────────
    { url: `${baseUrl}/verify`, changeFrequency: 'monthly', priority: 0.80, lastModified: now },
    { url: `${baseUrl}/transparency`, changeFrequency: 'monthly', priority: 0.82, lastModified: now },

    // ── Ambassador / outreach infrastructure ─────────────────────────────────
    { url: `${baseUrl}/ambassadors`, changeFrequency: 'monthly', priority: 0.75, lastModified: now },

    // ── Auth pages ───────────────────────────────────────────────────────────
    // 2026-05-18: /login and /signup both removed from sitemap. Both layouts
    // set `robots: { index: false, follow: false }`, so listing them caused
    // GSC "Submitted URL marked 'noindex'" errors ("New reasons prevent pages
    // from being indexed" alerts on 2026-05-17). Auth surfaces don't need to
    // rank — the homepage already deep-links to /signup for ranking signals.

    // ── About / founder ──────────────────────────────────────────────────────
    // 2026-05-11 (SEO-4): /about/founder exists in source and is linked from
    // the homepage hero but was missing from the sitemap.
    { url: `${baseUrl}/about/founder`, changeFrequency: 'monthly', priority: 0.78, lastModified: now },

    // ── Learn pages backfilled 2026-05-11 (SEO-4) ────────────────────────────
    // These existed in src/app/learn/* but were missing from the sitemap.
    { url: `${baseUrl}/learn/aaoifi-halal-screening`,             changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/faraid-awl-radd-explained`,          changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/halal-investing-for-beginners`,      changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-mortgage-total-cost-comparison`, changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/hawl-reset-rules`,                   changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/islamic-will-checklist`,             changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/nisab-gold-vs-silver`,               changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    // 2026-05-18: /learn/sadaqah-distribution removed — page is intentionally
    // `robots: { index: false, follow: true }` (placeholder until full
    // sadaqah/waqf disclosure ships). Listing it caused a GSC noindex error.
    // Re-add to sitemap when the full disclosure ships and noindex is lifted.
    { url: `${baseUrl}/learn/zakat-on-401k-methodology`,          changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-business-inventory`,        changeFrequency: 'monthly', priority: 0.85, lastModified: now },
    { url: `${baseUrl}/learn/zakat-recipients-2026`,              changeFrequency: 'monthly', priority: 0.88, lastModified: now },

    // ── Learn pages added 2026-05-17 (SEO-5): 7 new long-tail SEO pages ──────
    { url: `${baseUrl}/learn/halal-savings-account-usa`,          changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/halal-index-funds-2026`,             changeFrequency: 'monthly', priority: 0.92, lastModified: now },
    { url: `${baseUrl}/learn/islamic-banking-vs-conventional`,    changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/halal-money-market-funds`,           changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/sadaqah-jariyah-ideas`,              changeFrequency: 'monthly', priority: 0.88, lastModified: now },
    { url: `${baseUrl}/learn/halal-investing-canada`,             changeFrequency: 'monthly', priority: 0.90, lastModified: now },
    { url: `${baseUrl}/learn/zakat-on-pension-uk`,                changeFrequency: 'monthly', priority: 0.90, lastModified: now },

    // ── Legal & contact ───────────────────────────────────────────────────────
    { url: `${baseUrl}/contact`,    changeFrequency: 'yearly', priority: 0.40, lastModified: now },
    { url: `${baseUrl}/privacy`,    changeFrequency: 'yearly', priority: 0.30, lastModified: now },
    { url: `${baseUrl}/terms`,      changeFrequency: 'yearly', priority: 0.30, lastModified: now },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.30, lastModified: now },
  ];
}
