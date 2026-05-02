type LocaleCode = 'en' | 'ar' | 'ur' | 'fr';

export type LocalizedString = Record<LocaleCode, string>;

type LocalizedFeatureCard = {
  icon: string;
  title: LocalizedString;
  desc: LocalizedString;
};

type LocalizedLearningResource = {
  href: string;
  title: LocalizedString;
  desc: LocalizedString;
};

export function localizeText(values: LocalizedString, locale: string): string {
  return values[(locale as LocaleCode) ?? 'en'] ?? values.en;
}

export const PUBLIC_FEATURE_CARDS: readonly LocalizedFeatureCard[] = [
  {
    icon: '💰',
    title: {
      en: 'Zakat Calculator',
      ar: 'حاسبة الزكاة',
      ur: 'زکوٰۃ کیلکولیٹر',
      fr: 'Calculateur de zakat',
    },
    desc: {
      en: "Multi-madhab nisab (gold or silver standard), live prices, Hawl tracker, and auto-categorized asset breakdown — supporting Hanafi, Shafi'i, Maliki, Hanbali, and AMJA methodologies.",
      ar: 'نصاب متعدد المذاهب (ذهب أو فضة)، وأسعار لحظية، ومتتبع للحول، وتقسيم تلقائي للأصول — مع دعم مناهج الحنفي والشافعي والمالكي والحنبلي وAMJA.',
      ur: 'کئی مذاہب کے مطابق نصاب (سونا یا چاندی)، لائیو قیمتیں، حول ٹریکر، اور اثاثوں کی خودکار درجہ بندی — حنفی، شافعی، مالکی، حنبلی اور AMJA طریقوں کے ساتھ۔',
      fr: "Nisab multi-madhhab (or ou argent), prix en direct, suivi du hawl et répartition automatique des actifs — avec prise en charge des méthodologies hanafite, shafi'ite, malikite, hanbalite et AMJA.",
    },
  },
  {
    icon: '🛡️',
    title: {
      en: 'Riba Detector',
      ar: 'كاشف الربا',
      ur: 'ربا ڈیٹیکٹر',
      fr: 'Détecteur de riba',
    },
    desc: {
      en: 'Scan transactions to flag interest-bearing activity and stay halal-compliant with automatic alerts.',
      ar: 'يفحص المعاملات لاكتشاف الأنشطة المرتبطة بالفائدة حتى تبقى معاملتك متوافقة مع الحلال عبر تنبيهات تلقائية.',
      ur: 'لین دین کو اسکین کر کے سودی سرگرمیوں کو نمایاں کرتا ہے تاکہ خودکار الرٹس کے ساتھ آپ حلال دائرے میں رہ سکیں۔',
      fr: "Analyse les transactions pour signaler les activités porteuses d'intérêt et rester conforme au halal grâce à des alertes automatiques.",
    },
  },
  {
    icon: '✅',
    title: {
      en: 'Halal Stock Screener',
      ar: 'مصفاة الأسهم الحلال',
      ur: 'حلال اسٹاک اسکرینر',
      fr: 'Filtre d’actions halal',
    },
    desc: {
      en: '30,000+ stocks screened using criteria based on AAOIFI Standard 21 — filter by halal or haram with sector breakdown.',
      ar: 'فحص أكثر من 30,000 سهم وفق معايير مستندة إلى المعيار 21 لـAAOIFI — مع تصفية الحلال والحرام وبيان القطاعات.',
      ur: '30,000 سے زیادہ اسٹاک AAOIFI اسٹینڈرڈ 21 پر مبنی معیار سے جانچے گئے — شعبہ وار تفصیل کے ساتھ حلال یا حرام فلٹر کریں۔',
      fr: 'Plus de 30 000 actions filtrées selon des critères inspirés de la norme 21 de l’AAOIFI — avec filtre halal/haram et ventilation sectorielle.',
    },
  },
  {
    icon: '📊',
    title: {
      en: 'Budgets & Analytics',
      ar: 'الميزانيات والتحليلات',
      ur: 'بجٹس اور تجزیات',
      fr: 'Budgets et analyses',
    },
    desc: {
      en: 'Track spending by category and see where every dollar goes with visualized insights and trends.',
      ar: 'تابع الإنفاق حسب الفئة واعرف أين يذهب كل دولار عبر رسوم ورؤى واتجاهات واضحة.',
      ur: 'زمرہ وار خرچ کو ٹریک کریں اور بصری بصیرتوں اور رجحانات کے ساتھ دیکھیں کہ ہر ڈالر کہاں جا رہا ہے۔',
      fr: 'Suivez les dépenses par catégorie et voyez où va chaque dollar grâce à des visualisations et tendances claires.',
    },
  },
  {
    icon: '💎',
    title: {
      en: 'Net Worth Tracker',
      ar: 'متتبع صافي الثروة',
      ur: 'نیٹ ورتھ ٹریکر',
      fr: 'Suivi de valeur nette',
    },
    desc: {
      en: 'Real-time net worth with assets, debts, and investments in one comprehensive dashboard.',
      ar: 'صافي الثروة في الوقت الحقيقي مع الأصول والديون والاستثمارات في لوحة واحدة شاملة.',
      ur: 'اثاثوں، قرضوں اور سرمایہ کاری کے ساتھ حقیقی وقت کی مجموعی مالیت ایک جامع ڈیش بورڈ میں۔',
      fr: 'Valeur nette en temps réel avec actifs, dettes et investissements dans un seul tableau de bord complet.',
    },
  },
  {
    icon: '🤲',
    title: {
      en: 'Sadaqah & Waqf',
      ar: 'الصدقة والوقف',
      ur: 'صدقہ اور وقف',
      fr: 'Sadaqah et waqf',
    },
    desc: {
      en: 'Log charitable giving and endowments alongside everyday finances with dedicated impact tracking.',
      ar: 'سجّل الصدقات والأوقاف إلى جانب المال اليومي مع تتبع مخصص للأثر.',
      ur: 'روزمرہ مالیات کے ساتھ خیرات اور اوقاف کو لاگ کریں اور اثرات کے لیے الگ ٹریکنگ رکھیں۔',
      fr: 'Enregistrez vos dons et dotations aux côtés des finances du quotidien avec un suivi d’impact dédié.',
    },
  },
  {
    icon: '📜',
    title: {
      en: 'Wasiyyah & Estate Obligations',
      ar: 'الوصية والتزامات التركة',
      ur: 'وصیت اور اسٹیٹ ذمہ داریاں',
      fr: 'Wasiyyah et obligations successorales',
    },
    desc: {
      en: 'Record your Islamic will, beneficiaries, and outstanding obligations (Zakat, Kaffarah, loans) for family.',
      ar: 'دوّن وصيتك الإسلامية والمستفيدين والالتزامات القائمة مثل الزكاة والكفارة والديون لتكون واضحة للأسرة.',
      ur: 'اپنی اسلامی وصیت، مستحقین، اور باقی ذمہ داریاں جیسے زکوٰۃ، کفارہ اور قرض خاندان کے لیے ریکارڈ کریں۔',
      fr: 'Enregistrez votre testament islamique, vos bénéficiaires et les obligations en cours (zakat, kaffarah, dettes) pour votre famille.',
    },
  },
  {
    icon: '🎯',
    title: {
      en: 'Savings Goals',
      ar: 'أهداف الادخار',
      ur: 'بچت کے اہداف',
      fr: 'Objectifs d’épargne',
    },
    desc: {
      en: 'Set goals for Hajj, emergency funds, or any milestone — with automatic Hajj savings template.',
      ar: 'ضع أهدافًا للحج أو لصندوق الطوارئ أو لأي مرحلة مهمة — مع قالب تلقائي لادخار الحج.',
      ur: 'حج، ایمرجنسی فنڈ، یا کسی بھی سنگ میل کے لیے اہداف مقرر کریں — خودکار حج سیونگز ٹیمپلیٹ کے ساتھ۔',
      fr: 'Fixez des objectifs pour le Hajj, un fonds d’urgence ou tout autre jalon — avec un modèle automatique d’épargne pour le Hajj.',
    },
  },
  {
    icon: '⭐',
    title: {
      en: 'Barakah Score',
      ar: 'مؤشر بركة',
      ur: 'برکہ اسکور',
      fr: 'Score Barakah',
    },
    desc: {
      en: 'Your Islamic financial health score (0–100) across Zakat, Riba-free living, Sadaqah, Hawl, and debt.',
      ar: 'مؤشر صحتك المالية الإسلامية (0–100) عبر الزكاة والبعد عن الربا والصدقة والحول والديون.',
      ur: 'زکوٰۃ، ربا سے پاک زندگی، صدقہ، حول، اور قرض کے لحاظ سے آپ کی اسلامی مالی صحت کا اسکور (0–100)।',
      fr: 'Votre score de santé financière islamique (0 à 100) à travers la zakat, une vie sans riba, la sadaqah, le hawl et la dette.',
    },
  },
  {
    icon: '🔄',
    title: {
      en: 'Subscription Detector',
      ar: 'كاشف الاشتراكات',
      ur: 'سبسکرپشن ڈیٹیکٹر',
      fr: 'Détecteur d’abonnements',
    },
    desc: {
      en: 'Automatically detect recurring subscriptions from your transactions — flag haram services instantly.',
      ar: 'يكتشف الاشتراكات المتكررة تلقائيًا من معاملاتك ويشير فورًا إلى الخدمات المحرمة.',
      ur: 'آپ کے لین دین سے بار بار آنے والی سبسکرپشنز خودکار طور پر پہچانیں — حرام سروسز کو فوراً نمایاں کریں۔',
      fr: 'Détecte automatiquement les abonnements récurrents à partir de vos transactions et signale immédiatement les services haram.',
    },
  },
  {
    icon: '🔔',
    title: {
      en: 'Smart Islamic Reminders',
      ar: 'تذكيرات إسلامية ذكية',
      ur: 'سمارٹ اسلامی یاددہانیاں',
      fr: 'Rappels islamiques intelligents',
    },
    desc: {
      en: 'Bill due alerts, Hawl anniversaries, Zakat nisab threshold alerts, and savings milestones built-in.',
      ar: 'تنبيهات استحقاق الفواتير وذكريات الحول وتنبيهات بلوغ النصاب ومراحل الادخار مدمجة في التطبيق.',
      ur: 'بل کی مقررہ تاریخ، حول کی سالگرہ، زکوٰۃ نصاب الرٹس، اور بچت کے سنگ میل — سب ایک جگہ۔',
      fr: 'Alertes d’échéance, anniversaires de hawl, alertes de seuil de nisab et jalons d’épargne intégrés.',
    },
  },
  {
    icon: '👥',
    title: {
      en: 'Shared Family Finances',
      ar: 'المال العائلي المشترك',
      ur: 'مشترکہ خاندانی مالیات',
      fr: 'Finances familiales partagées',
    },
    desc: {
      en: 'Family plan lets up to 6 members track shared expenses, group transactions, and family Zakat.',
      ar: 'تتيح الخطة العائلية لما يصل إلى 6 أعضاء تتبع المصاريف المشتركة والمعاملات الجماعية وزكاة الأسرة.',
      ur: 'فیملی پلان میں 6 افراد تک مشترکہ اخراجات، گروپ ٹرانزیکشنز، اور خاندانی زکوٰۃ کو ٹریک کر سکتے ہیں۔',
      fr: 'La formule famille permet à jusqu’à 6 membres de suivre les dépenses partagées, les transactions de groupe et la zakat familiale.',
    },
  },
  {
    icon: '🌍',
    title: {
      en: 'Multi-Currency Support',
      ar: 'دعم العملات المتعددة',
      ur: 'متعدد کرنسی سپورٹ',
      fr: 'Prise en charge multidevise',
    },
    desc: {
      en: 'Track finances across USD, GBP, EUR, AED, and 50+ currencies with live exchange rates daily.',
      ar: 'تابع أموالك عبر الدولار والجنيه والإيورو والدرهم وأكثر من 50 عملة مع أسعار صرف يومية مباشرة.',
      ur: 'USD، GBP، EUR، AED اور 50 سے زائد کرنسیوں میں اپنی مالیات کو روزانہ لائیو ایکسچینج ریٹس کے ساتھ ٹریک کریں۔',
      fr: 'Suivez vos finances en USD, GBP, EUR, AED et plus de 50 devises avec des taux de change mis à jour chaque jour.',
    },
  },
] as const;

export const HOME_LEARNING_RESOURCES: readonly LocalizedLearningResource[] = [
  {
    href: '/learn/zakat-on-gold',
    title: {
      en: 'Zakat on Gold',
      ar: 'زكاة الذهب',
      ur: 'سونے پر زکوٰۃ',
      fr: 'Zakat sur l’or',
    },
    desc: {
      en: 'Understand how gold-based nisab works and calculate your zakat obligation.',
      ar: 'تعرّف على كيفية عمل نصاب الذهب واحسب زكاتك الواجبة.',
      ur: 'سمجھیں کہ سونے پر مبنی نصاب کیسے کام کرتا ہے اور اپنی زکوٰۃ کا حساب لگائیں۔',
      fr: 'Comprenez le fonctionnement du nisab fondé sur l’or et calculez votre zakat.',
    },
  },
  {
    href: '/learn/zakat-on-retirement-accounts',
    title: {
      en: 'Zakat on Retirement Accounts',
      ar: 'زكاة حسابات التقاعد',
      ur: 'ریٹائرمنٹ اکاؤنٹس پر زکوٰۃ',
      fr: 'Zakat sur les comptes retraite',
    },
    desc: {
      en: 'Navigate zakat rules for 401(k)s, IRAs, and other retirement savings.',
      ar: 'افهم أحكام الزكاة الخاصة بـ401(k) وIRA ومدخرات التقاعد الأخرى.',
      ur: '401(k)، IRA، اور دیگر ریٹائرمنٹ بچتوں کے لیے زکوٰۃ کے اصول سمجھیں۔',
      fr: 'Naviguez entre les règles de zakat pour les 401(k), IRA et autres comptes retraite.',
    },
  },
  {
    href: '/learn/zakat-on-savings',
    title: {
      en: 'Zakat on Savings',
      ar: 'زكاة المدخرات',
      ur: 'بچت پر زکوٰۃ',
      fr: 'Zakat sur l’épargne',
    },
    desc: {
      en: 'Learn which savings are zakatable and how to calculate your obligation.',
      ar: 'اعرف أي أنواع المدخرات تجب فيها الزكاة وكيف تحسب التزامك.',
      ur: 'جانیں کہ کون سی بچتوں پر زکوٰۃ واجب ہوتی ہے اور اپنا حساب کیسے کریں۔',
      fr: 'Découvrez quelles formes d’épargne sont zakatables et comment calculer votre obligation.',
    },
  },
  {
    href: '/learn/nisab',
    title: {
      en: 'Nisab Threshold',
      ar: 'حدّ النصاب',
      ur: 'نصاب کی حد',
      fr: 'Seuil du nisab',
    },
    desc: {
      en: 'Understand the nisab threshold and how it is calculated with current gold and silver prices.',
      ar: 'افهم حد النصاب وكيفية حسابه وفق أسعار الذهب والفضة الحالية.',
      ur: 'نصاب کی حد اور موجودہ سونے اور چاندی کی قیمتوں کے ساتھ اس کا حساب سمجھیں۔',
      fr: 'Comprenez le seuil du nisab et son calcul à partir des cours actuels de l’or et de l’argent.',
    },
  },
  {
    href: '/learn/zakat-al-fitr',
    title: {
      en: 'Zakat Al-Fitr',
      ar: 'زكاة الفطر',
      ur: 'زکوٰۃ الفطر',
      fr: 'Zakat al-Fitr',
    },
    desc: {
      en: 'Master Zakat Al-Fitr, the charity given at the end of Ramadan.',
      ar: 'تعرّف على زكاة الفطر، وهي الصدقة التي تُعطى في نهاية رمضان.',
      ur: 'زکوٰۃ الفطر کو سمجھیں، جو رمضان کے اختتام پر دی جانے والی صدقہ ہے۔',
      fr: 'Maîtrisez la zakat al-Fitr, l’aumône due à la fin du Ramadan.',
    },
  },
  {
    href: '/learn/islamic-finance-basics',
    title: {
      en: 'Islamic Finance Basics',
      ar: 'أساسيات التمويل الإسلامي',
      ur: 'اسلامی مالیات کی بنیادیات',
      fr: 'Bases de la finance islamique',
    },
    desc: {
      en: 'Learn the fundamentals of Islamic finance principles and halal investing.',
      ar: 'تعرّف على المبادئ الأساسية للتمويل الإسلامي والاستثمار الحلال.',
      ur: 'اسلامی مالیات کے بنیادی اصول اور حلال سرمایہ کاری کی بنیادیں سیکھیں۔',
      fr: 'Apprenez les principes fondamentaux de la finance islamique et de l’investissement halal.',
    },
  },
  {
    href: '/learn/riba-elimination',
    title: {
      en: 'Riba Elimination Guide',
      ar: 'دليل التخلّص من الربا',
      ur: 'ربا ختم کرنے کی رہنمائی',
      fr: 'Guide d’élimination du riba',
    },
    desc: {
      en: 'Step-by-step guide to removing interest from mortgages, credit cards, and loans.',
      ar: 'دليل خطوة بخطوة لإزالة الفائدة من الرهونات والبطاقات والقروض.',
      ur: 'مارگیج، کریڈٹ کارڈز، اور قرضوں سے سود نکالنے کی مرحلہ وار رہنمائی۔',
      fr: 'Guide pas à pas pour retirer l’intérêt des crédits immobiliers, cartes et prêts.',
    },
  },
  {
    href: '/learn/madhab-finance',
    title: {
      en: 'Madhab & Your Finances',
      ar: 'المذهب ومالُك',
      ur: 'مسلک اور آپ کی مالیات',
      fr: 'Votre madhhab et vos finances',
    },
    desc: {
      en: 'How Hanafi, Shafi\'i, Maliki, and Hanbali rulings affect zakat and estate planning.',
      ar: 'كيف تؤثر أحكام الحنفي والشافعي والمالكي والحنبلي على الزكاة وتخطيط التركة.',
      ur: 'حنفی، شافعی، مالکی، اور حنبلی آراء زکوٰۃ اور اسٹیٹ پلاننگ پر کیسے اثر ڈالتی ہیں۔',
      fr: 'Comment les avis hanafites, shafi’ites, malikites et hanbalites influencent la zakat et la planification successorale.',
    },
  },
  {
    href: '/faraid-calculator',
    title: {
      en: 'Islamic Inheritance (Faraid)',
      ar: 'المواريث الإسلامية (الفرائض)',
      ur: 'اسلامی وراثت (فرائض)',
      fr: 'Héritage islamique (Faraid)',
    },
    desc: {
      en: 'Calculate Quranic inheritance shares for all heirs with automatic Awl and Radd.',
      ar: 'احسب أنصبة الميراث القرآنية لجميع الورثة مع العَول والرّد تلقائيًا.',
      ur: 'تمام ورثاء کے لیے قرآنی وراثتی حصص کا حساب خودکار عول اور رد کے ساتھ لگائیں۔',
      fr: 'Calculez les parts d’héritage coraniques pour tous les héritiers avec Awl et Radd automatiques.',
    },
  },
] as const;

const COMPETITOR_FEATURE_LABELS: Record<string, LocalizedString> = {
  'Monthly price': { en: 'Monthly price', ar: 'السعر الشهري', ur: 'ماہانہ قیمت', fr: 'Prix mensuel' },
  'Annual price': { en: 'Annual price', ar: 'السعر السنوي', ur: 'سالانہ قیمت', fr: 'Prix annuel' },
  'Free trial': { en: 'Free trial', ar: 'التجربة المجانية', ur: 'مفت ٹرائل', fr: 'Essai gratuit' },
  'Bank account sync': { en: 'Bank account sync', ar: 'ربط الحسابات البنكية', ur: 'بینک اکاؤنٹ سنک', fr: 'Synchronisation bancaire' },
  'Budgeting & bills': { en: 'Budgeting & bills', ar: 'الميزانية والفواتير', ur: 'بجٹنگ اور بلز', fr: 'Budget et factures' },
  'Safe-to-spend': { en: 'Safe-to-spend', ar: 'المتاح للإنفاق', ur: 'محفوظ خرچ حد', fr: 'Montant sûr à dépenser' },
  'Cash-flow forecast': { en: 'Cash-flow forecast', ar: 'توقع التدفق النقدي', ur: 'کیش فلو پیش گوئی', fr: 'Prévision de trésorerie' },
  'Net worth tracking': { en: 'Net worth tracking', ar: 'تتبع صافي الثروة', ur: 'نیٹ ورتھ ٹریکنگ', fr: 'Suivi de la valeur nette' },
  'Investment tracking': { en: 'Investment tracking', ar: 'تتبع الاستثمارات', ur: 'سرمایہ کاری ٹریکنگ', fr: 'Suivi des investissements' },
  'Zakat calculator': { en: 'Zakat calculator', ar: 'حاسبة الزكاة', ur: 'زکوٰۃ کیلکولیٹر', fr: 'Calculateur de zakat' },
  'Multi-madhab support': { en: 'Multi-madhab support', ar: 'دعم تعدد المذاهب', ur: 'کئی مذاہب کی سپورٹ', fr: 'Support multi-madhhab' },
  'Hawl tracking': { en: 'Hawl tracking', ar: 'تتبع الحول', ur: 'حول ٹریکنگ', fr: 'Suivi du hawl' },
  'Faraid (inheritance)': { en: 'Faraid (inheritance)', ar: 'الفرائض (الميراث)', ur: 'فرائض (وراثت)', fr: 'Faraid (héritage)' },
  'Riba detection': { en: 'Riba detection', ar: 'كشف الربا', ur: 'ربا کی شناخت', fr: 'Détection du riba' },
  'Halal stock screening': { en: 'Halal stock screening', ar: 'فحص الأسهم الحلال', ur: 'حلال اسٹاک اسکریننگ', fr: 'Filtrage d’actions halal' },
  'Islamic will (Wasiyyah)': { en: 'Islamic will (Wasiyyah)', ar: 'الوصية الإسلامية', ur: 'اسلامی وصیت', fr: 'Testament islamique (Wasiyyah)' },
  'Sadaqah & Waqf tracking': { en: 'Sadaqah & Waqf tracking', ar: 'تتبع الصدقة والوقف', ur: 'صدقہ و وقف ٹریکنگ', fr: 'Suivi de la sadaqah et du waqf' },
  'Household/family plan': { en: 'Household/family plan', ar: 'الخطة العائلية', ur: 'گھرانہ / فیملی پلان', fr: 'Formule famille/foyer' },
  'Prayer times': { en: 'Prayer times', ar: 'أوقات الصلاة', ur: 'نماز کے اوقات', fr: 'Heures de prière' },
  'Ramadan Mode': { en: 'Ramadan Mode', ar: 'وضع رمضان', ur: 'رمضان موڈ', fr: 'Mode Ramadan' },
  'Arabic, Urdu & French support': { en: 'Arabic, Urdu & French support', ar: 'دعم العربية والأردية والفرنسية', ur: 'عربی، اردو اور فرانسیسی سپورٹ', fr: 'Prise en charge de l’arabe, de l’ourdou et du français' },
};

export function localizeCompetitorFeature(feature: string, locale: string): string {
  return localizeText(COMPETITOR_FEATURE_LABELS[feature] ?? { en: feature, ar: feature, ur: feature, fr: feature }, locale);
}
