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
};

const dictionaries: Record<string, Translations> = { en, ar, ur };

let currentLocale = 'en';

/** Set the active locale. */
export function setLocale(locale: string) {
  currentLocale = dictionaries[locale] ? locale : 'en';
}

/** Get the current locale. */
export function getLocale(): string {
  return currentLocale;
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
] as const;
