/**
 * Minimal i18n foundation for Barakah web.
 *
 * Phase 1: Simple key-value dictionaries for the most visible UI strings.
 * Phase 2 (future): Migrate to next-intl or i18next for full ICU support.
 *
 * Usage:
 *   import { t } from '@/lib/i18n';
 *   <h1>{t('dashboard')}</h1>
 */

type Translations = Record<string, string>;

const en: Translations = {
  // Navigation
  dashboard: 'Dashboard',
  assets: 'Assets',
  transactions: 'Transactions',
  budgets: 'Budgets',
  debts: 'Debts',
  bills: 'Bills',
  settings: 'Settings',

  // Dashboard
  goodMorning: 'Good morning',
  goodAfternoon: 'Good afternoon',
  goodEvening: 'Good evening',
  welcomeBack: 'Welcome back to Barakah. May your finances be blessed with barakah.',
  netWorth: 'Net Worth',
  zakatDue: 'Zakat Due',
  zakatEligible: 'Zakat Eligible',
  spendingThisMonth: 'Spending This Month',
  recentTransactions: 'Recent Transactions',
  upcomingBills: 'Upcoming Bills',
  quickActions: 'Quick Actions',
  exploreFeatures: 'Explore Features',

  // Islamic
  islamicDate: 'Islamic Date',
  prayerTimes: 'Prayer Times',
  zakatReminders: 'Zakat Reminders',
  hawlTracker: 'Hawl Tracker',
  ibadahFinance: 'Ibadah Finance',
  ramadanMode: 'Ramadan Mode',
  fiqhSettings: 'Fiqh Settings',
  sadaqah: 'Sadaqah',
  wasiyyah: 'Wasiyyah',
  waqf: 'Waqf',
  faraid: 'Faraid Calculator',

  // Common
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  confirm: 'Confirm',
  viewAll: 'View all',
  upgrade: 'Upgrade',
  loading: 'Loading...',

  // Error boundary (Round 27)
  errSomethingWentWrong: 'Something went wrong',
  errTryAgainMessage: 'An unexpected error occurred. Please try again.',
  errReloadMessage: 'This page keeps running into an error. Please reload the page.',
  errTryAgain: 'Try Again',
  errReloadPage: 'Reload Page',
};

const ar: Translations = {
  // Navigation
  dashboard: 'لوحة القيادة',
  assets: 'الأصول',
  transactions: 'المعاملات',
  budgets: 'الميزانيات',
  debts: 'الديون',
  bills: 'الفواتير',
  settings: 'الإعدادات',

  // Dashboard
  goodMorning: 'صباح الخير',
  goodAfternoon: 'مساء الخير',
  goodEvening: 'مساء الخير',
  welcomeBack: 'مرحبًا بعودتك إلى بركة. بارك الله في أموالك.',
  netWorth: 'صافي الثروة',
  zakatDue: 'الزكاة المستحقة',
  zakatEligible: 'مؤهل للزكاة',
  spendingThisMonth: 'الإنفاق هذا الشهر',
  recentTransactions: 'المعاملات الأخيرة',
  upcomingBills: 'الفواتير القادمة',
  quickActions: 'إجراءات سريعة',
  exploreFeatures: 'استكشاف الميزات',

  // Islamic
  islamicDate: 'التاريخ الهجري',
  prayerTimes: 'أوقات الصلاة',
  zakatReminders: 'تذكيرات الزكاة',
  hawlTracker: 'متتبع الحول',
  ibadahFinance: 'مالية العبادات',
  ramadanMode: 'وضع رمضان',
  fiqhSettings: 'إعدادات الفقه',
  sadaqah: 'الصدقة',
  wasiyyah: 'الوصية',
  waqf: 'الوقف',
  faraid: 'حاسبة الفرائض',

  // Common
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  confirm: 'تأكيد',
  viewAll: 'عرض الكل',
  upgrade: 'ترقية',
  loading: 'جاري التحميل...',

  // Error boundary (Round 27)
  errSomethingWentWrong: 'حدث خطأ ما',
  errTryAgainMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  errReloadMessage: 'تستمر هذه الصفحة في مواجهة خطأ. يرجى إعادة تحميل الصفحة.',
  errTryAgain: 'حاول مرة أخرى',
  errReloadPage: 'إعادة تحميل الصفحة',
};

const ur: Translations = {
  // Navigation
  dashboard: 'ڈیش بورڈ',
  assets: 'اثاثے',
  transactions: 'لین دین',
  budgets: 'بجٹ',
  debts: 'قرض',
  bills: 'بل',
  settings: 'ترتیبات',

  // Dashboard
  goodMorning: 'صبح بخیر',
  goodAfternoon: 'سہ پہر بخیر',
  goodEvening: 'شام بخیر',
  welcomeBack: 'برکہ میں واپسی پر خوش آمدید۔ آپ کی دولت میں برکت ہو۔',
  netWorth: 'مجموعی مالیت',
  zakatDue: 'زکوٰۃ واجب',
  zakatEligible: 'زکوٰۃ کے لیے اہل',
  spendingThisMonth: 'اس ماہ کے اخراجات',
  recentTransactions: 'حالیہ لین دین',
  upcomingBills: 'آنے والے بل',
  quickActions: 'فوری اقدامات',
  exploreFeatures: 'خصوصیات دریافت کریں',

  // Islamic
  islamicDate: 'اسلامی تاریخ',
  prayerTimes: 'نماز کے اوقات',
  zakatReminders: 'زکوٰۃ کی یاددہانی',
  hawlTracker: 'حول ٹریکر',
  ibadahFinance: 'عبادات کے مالیات',
  ramadanMode: 'رمضان موڈ',
  fiqhSettings: 'فقہ کی ترتیبات',
  sadaqah: 'صدقہ',
  wasiyyah: 'وصیت',
  waqf: 'وقف',
  faraid: 'فرائض کیلکولیٹر',

  // Common
  save: 'محفوظ کریں',
  cancel: 'منسوخ',
  delete: 'حذف کریں',
  confirm: 'تصدیق',
  viewAll: 'سب دیکھیں',
  upgrade: 'اپ گریڈ',
  loading: 'لوڈ ہو رہا ہے...',

  // Error boundary (Round 27)
  errSomethingWentWrong: 'کچھ غلط ہو گیا',
  errTryAgainMessage: 'ایک غیر متوقع خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔',
  errReloadMessage: 'یہ صفحہ بار بار خرابی کا شکار ہو رہا ہے۔ براہ کرم صفحہ کو دوبارہ لوڈ کریں۔',
  errTryAgain: 'دوبارہ کوشش کریں',
  errReloadPage: 'صفحہ دوبارہ لوڈ کریں',
};

const fr: Translations = {
  // Navigation
  dashboard: 'Tableau de bord',
  assets: 'Actifs',
  transactions: 'Transactions',
  budgets: 'Budgets',
  debts: 'Dettes',
  bills: 'Factures',
  settings: 'Paramètres',

  // Dashboard
  goodMorning: 'Bonjour',
  goodAfternoon: 'Bon après-midi',
  goodEvening: 'Bonsoir',
  welcomeBack: 'Bon retour sur Barakah. Que vos finances soient bénies de barakah.',
  netWorth: 'Valeur nette',
  zakatDue: 'Zakat due',
  zakatEligible: 'Éligible à la Zakat',
  spendingThisMonth: 'Dépenses ce mois-ci',
  recentTransactions: 'Transactions récentes',
  upcomingBills: 'Factures à venir',
  quickActions: 'Actions rapides',
  exploreFeatures: 'Explorer les fonctionnalités',

  // Islamic
  islamicDate: 'Date hégirienne',
  prayerTimes: 'Heures de prière',
  zakatReminders: 'Rappels de Zakat',
  hawlTracker: 'Suivi du Hawl',
  ibadahFinance: 'Finance des actes d\'adoration',
  ramadanMode: 'Mode Ramadan',
  fiqhSettings: 'Paramètres du fiqh',
  sadaqah: 'Sadaqa',
  wasiyyah: 'Wasiyyah',
  waqf: 'Waqf',
  faraid: 'Calculateur de Faraid',

  // Common
  save: 'Enregistrer',
  cancel: 'Annuler',
  delete: 'Supprimer',
  confirm: 'Confirmer',
  viewAll: 'Tout voir',
  upgrade: 'Mettre à niveau',
  loading: 'Chargement…',

  // Error boundary (Round 27)
  errSomethingWentWrong: 'Une erreur est survenue',
  errTryAgainMessage: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  errReloadMessage: 'Cette page rencontre une erreur récurrente. Veuillez recharger la page.',
  errTryAgain: 'Réessayer',
  errReloadPage: 'Recharger la page',
};

const dictionaries: Record<string, Translations> = { en, ar, ur, fr };

/** localStorage key for persisted locale selection. Must match the pre-paint
 *  script in app/layout.tsx that reads this to set <html dir="rtl"> before
 *  paint (avoids RTL-flash on cold loads for Arabic / Urdu users). */
export const LOCALE_STORAGE_KEY = 'barakah_locale';

/** Locales that render right-to-left. */
const RTL_LOCALES = new Set(['ar', 'ur', 'fa', 'he']);

function readStoredLocale(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && dictionaries[stored]) return stored;
  } catch {
    /* private-mode / SSR */
  }
  return 'en';
}

let currentLocale = readStoredLocale();

/** Set the active locale. Persists to localStorage and updates the
 *  <html dir> attribute so RTL scripts align correctly. */
export function setLocale(locale: string) {
  currentLocale = dictionaries[locale] ? locale : 'en';
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale);
    } catch {
      /* quota / private mode — non-fatal */
    }
    try {
      document.documentElement.dir = RTL_LOCALES.has(currentLocale) ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLocale;
    } catch {
      /* DOM not ready — pre-paint script has us covered */
    }
  }
}

/** Get the current locale. */
export function getLocale(): string {
  return currentLocale;
}

/** Whether a locale is right-to-left. */
export function isRtl(locale: string = currentLocale): boolean {
  return RTL_LOCALES.has(locale);
}

/** Translate a key. Falls back to English if key is missing in current locale. */
export function t(key: string): string {
  return dictionaries[currentLocale]?.[key] ?? dictionaries.en[key] ?? key;
}

/** Available locales with display names. */
export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
  { code: 'fr', label: 'Français' },
] as const;
