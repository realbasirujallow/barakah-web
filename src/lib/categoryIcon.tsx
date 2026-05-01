/**
 * Centralized Lucide-icon mapper for transaction / budget categories.
 *
 * Phase 24f (2026-04-30): replaces the ~5 emoji-to-string maps duplicated
 * across dashboard pages (recurring, notifications, summary, transactions,
 * categorize, etc). Now they all import from one place — adding a new
 * category icon is one edit, not five.
 *
 * Why Lucide and not emojis:
 *   • Cross-platform consistency: emojis render differently on
 *     Apple / Google / Microsoft / Meta platforms; Lucide is a single
 *     SVG glyph that always looks the same.
 *   • Color control: Lucide takes a `color` prop, so we can match the
 *     category's brand colour (food = orange, charity = teal). Emojis
 *     ignore colour CSS.
 *   • Accessibility: Lucide icons have proper `aria-hidden` defaults
 *     and don't carry the cultural/skin-tone baggage some emojis do.
 *   • Bundle: tree-shakeable; we only ship the icons we actually import.
 *
 * Phase 10 already migrated nav + sidebar to Lucide. This module
 * finishes the migration on the page-level surfaces.
 *
 * Usage:
 *   import { CategoryIcon, categoryColor } from '@/lib/categoryIcon';
 *   <CategoryIcon category="food" className="w-5 h-5" />
 *
 * Or with the hook for compound styling:
 *   const { Icon, color } = getCategoryIconAndColor('food');
 *   <Icon className="w-5 h-5" style={{ color }} />
 */

import {
  Utensils,
  Coffee,
  ShoppingBag,
  ShoppingCart,
  Car,
  Home,
  Lightbulb,
  Heart,
  Pill,
  GraduationCap,
  Baby,
  Film,
  Tv,
  Plane,
  Gift,
  Sparkles,
  Dog,
  Shirt,
  Laptop,
  PiggyBank,
  CreditCard,
  Receipt,
  HandCoins,
  Banknote,
  TrendingUp,
  ArrowLeftRight,
  AlertTriangle,
  Briefcase,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

/**
 * Mapping from category slug to its Lucide icon component.
 *
 * Slugs come from `Transaction.category` / `Budget.category` on the
 * backend — keep this in sync with the CATEGORIES constant in
 * `src/app/dashboard/budget/page.tsx`. Anything we don't have a
 * specific glyph for falls through to `Wallet`.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // Food & dining
  food: Utensils,
  dining: Utensils,
  groceries: ShoppingCart,
  coffee: Coffee,
  // Transport
  transportation: Car,
  fuel: Car,
  parking: Car,
  public_transit: Car,
  // Housing & utilities
  housing: Home,
  rent: Home,
  home_maintenance: Home,
  utilities: Lightbulb,
  insurance: Receipt,
  // Health
  healthcare: Heart,
  fitness: Heart,
  pharmacy: Pill,
  // Education / family
  education: GraduationCap,
  kids: Baby,
  childcare: Baby,
  // Lifestyle
  entertainment: Film,
  subscriptions: Tv,
  travel: Plane,
  gifts: Gift,
  personal_care: Sparkles,
  pets: Dog,
  // Shopping
  shopping: ShoppingBag,
  clothing: Shirt,
  electronics: Laptop,
  // Finance
  savings: PiggyBank,
  debt_payment: CreditCard,
  taxes: Receipt,
  transfer: ArrowLeftRight,
  // Islamic
  charity: HandCoins,
  zakat: HandCoins,
  sadaqah: HandCoins,
  // Income / business
  income: Banknote,
  business: Briefcase,
  investment: TrendingUp,
  // Compliance flags
  interest: AlertTriangle,
  riba: AlertTriangle,
  // Catch-all
  other: Wallet,
};

/** Brand colour per category. Used for icon `color` prop where consistent
 *  category colouring matters (chart legends, big icon disks). Hex values
 *  match the Tailwind palette (e.g. `text-orange-500` ↔ `#F97316`). */
const COLOR_MAP: Record<string, string> = {
  food: '#F97316',           // orange-500
  dining: '#F97316',
  groceries: '#22C55E',      // green-500
  coffee: '#92400E',         // amber-800
  transportation: '#3B82F6', // blue-500
  fuel: '#3B82F6',
  housing: '#0EA5E9',        // sky-500
  rent: '#0EA5E9',
  utilities: '#EAB308',      // yellow-500
  insurance: '#6366F1',      // indigo-500
  healthcare: '#EC4899',     // pink-500
  fitness: '#10B981',        // emerald-500
  pharmacy: '#EC4899',
  education: '#8B5CF6',      // violet-500
  kids: '#F472B6',           // pink-400
  childcare: '#F472B6',
  entertainment: '#EF4444',  // red-500
  subscriptions: '#EF4444',
  travel: '#06B6D4',         // cyan-500
  gifts: '#EC4899',
  personal_care: '#A855F7',  // purple-500
  pets: '#92400E',
  shopping: '#F97316',
  clothing: '#F97316',
  electronics: '#64748B',    // slate-500
  savings: '#16A34A',        // green-600
  debt_payment: '#DC2626',   // red-600
  taxes: '#374151',          // gray-700
  transfer: '#6366F1',
  charity: '#0D9488',        // teal-600
  zakat: '#0D9488',
  sadaqah: '#0D9488',
  income: '#16A34A',
  business: '#1F2937',       // gray-800
  investment: '#0EA5E9',
  interest: '#DC2626',
  riba: '#DC2626',
  other: '#64748B',
};

/**
 * Look up the Lucide component AND brand colour for a category in one
 * call. Falls through to `Wallet` + slate for unknown categories so
 * downstream renderers don't need to null-check.
 */
export function getCategoryIconAndColor(category: string | undefined | null): {
  Icon: LucideIcon;
  color: string;
} {
  const key = (category || 'other').toLowerCase();
  return {
    Icon: ICON_MAP[key] ?? Wallet,
    color: COLOR_MAP[key] ?? COLOR_MAP.other,
  };
}

/**
 * `<CategoryIcon category="food" />` convenience component for the
 * common case where you want the icon at default size with category
 * colour applied. Pass through className/size to override.
 */
export function CategoryIcon({
  category,
  className = 'w-5 h-5',
  colored = true,
}: {
  category: string | undefined | null;
  className?: string;
  /** When true (default), icon is rendered in the category's brand
   *  colour. Set to false for monochrome surfaces (sidebar, tooltips). */
  colored?: boolean;
}) {
  const { Icon, color } = getCategoryIconAndColor(category);
  return (
    <Icon
      className={className}
      aria-hidden="true"
      {...(colored ? { color } : {})}
    />
  );
}

/** Just the colour, no icon — useful for chart legends. */
export function categoryColor(category: string | undefined | null): string {
  return getCategoryIconAndColor(category).color;
}
