/**
 * Schema validation utilities for API responses
 * Uses simple runtime validators without external dependencies
 */

// ── Validation Helpers ────────────────────────────────────────────────────────

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  issues?: Array<{ path: string; message: string }>;
}

function isFiniteNumber(val: unknown): boolean {
  return typeof val === 'number' && Number.isFinite(val);
}

function isNonNegativeNumber(val: unknown): boolean {
  return isFiniteNumber(val) && (val as number) >= 0;
}

function isBoolean(val: unknown): boolean {
  return typeof val === 'boolean';
}

function isString(val: unknown): boolean {
  return typeof val === 'string';
}

function isEmail(val: unknown): boolean {
  return isString(val) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val as string);
}

function isArray(val: unknown, check?: (item: unknown) => boolean): boolean {
  return Array.isArray(val) && (!check || (val as unknown[]).every(check));
}

// ── User Profile ──────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  fullName: string;
  plan: 'free' | 'plus' | 'family';
  planExpiresAt: number | null | undefined;
  emailVerified: boolean;
  referralCode: string | null | undefined;
  state: string | null | undefined;
}

export function validateUser(data: unknown): ValidationResult<User> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;
  const issues: Array<{ path: string; message: string }> = [];

  if (!isFiniteNumber(obj.id)) issues.push({ path: 'id', message: 'Expected finite number' });
  if (!isEmail(obj.email)) issues.push({ path: 'email', message: 'Expected valid email' });
  if (!isString(obj.fullName)) issues.push({ path: 'fullName', message: 'Expected string' });
  if (obj.plan && !['free', 'plus', 'family'].includes(obj.plan as string)) {
    issues.push({ path: 'plan', message: 'Expected free | plus | family' });
  }
  if (obj.emailVerified !== undefined && !isBoolean(obj.emailVerified)) {
    issues.push({ path: 'emailVerified', message: 'Expected boolean' });
  }

  if (issues.length > 0) return { success: false, issues };

  const plan = (obj.plan as string) || 'free';
  return {
    success: true,
    data: {
      id: obj.id as number,
      email: obj.email as string,
      fullName: obj.fullName as string,
      plan: (['free', 'plus', 'family'].includes(plan) ? plan : 'free') as 'free' | 'plus' | 'family',
      planExpiresAt: obj.planExpiresAt as number | null | undefined,
      emailVerified: (obj.emailVerified as boolean) || false,
      referralCode: obj.referralCode as string | null | undefined,
      state: obj.state as string | null | undefined,
    },
  };
}

// ── Zakat Calculation Response ────────────────────────────────────────────────

export interface ZakatCalculation {
  totalWealth: number;
  zakatableWealth: number;
  nisab: number;
  zakatDue: number;
  zakatEligible: boolean;
  goldNisab?: number;
  silverNisab?: number;
  staleWarning?: boolean;
  priceAgeMs?: number;
  interestMustBeDonatedToCharity?: boolean;
  interestDonationAmount?: number;
  interestDonationGuidance?: string;
  // Asset breakdown from backend (per-asset zakatable/exempt detail)
  breakdown?: Array<Record<string, unknown>>;
  totalDebts?: number;
  nonZakatableWealth?: number;
  totalSavings?: number;
  netWorth?: number;
  currentLunarYear?: number;
  effectiveZakatAmount?: number;
  [key: string]: unknown;
}

export function validateZakatCalculation(data: unknown): ValidationResult<ZakatCalculation> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;
  const issues: Array<{ path: string; message: string }> = [];

  if (!isFiniteNumber(obj.totalWealth)) issues.push({ path: 'totalWealth', message: 'Expected finite number' });
  if (!isFiniteNumber(obj.zakatableWealth)) issues.push({ path: 'zakatableWealth', message: 'Expected finite number' });
  if (!isNonNegativeNumber(obj.nisab)) issues.push({ path: 'nisab', message: 'Expected non-negative number' });
  if (!isNonNegativeNumber(obj.zakatDue)) issues.push({ path: 'zakatDue', message: 'Expected non-negative number' });
  if (!isBoolean(obj.zakatEligible)) issues.push({ path: 'zakatEligible', message: 'Expected boolean' });

  if (issues.length > 0) return { success: false, issues };

  return {
    success: true,
    data: {
      totalWealth: obj.totalWealth as number,
      zakatableWealth: obj.zakatableWealth as number,
      nisab: obj.nisab as number,
      zakatDue: obj.zakatDue as number,
      zakatEligible: obj.zakatEligible as boolean,
      goldNisab: isNonNegativeNumber(obj.goldNisab) ? (obj.goldNisab as number) : undefined,
      silverNisab: isNonNegativeNumber(obj.silverNisab) ? (obj.silverNisab as number) : undefined,
      staleWarning: isBoolean(obj.staleWarning) ? (obj.staleWarning as boolean) : undefined,
      priceAgeMs: isFiniteNumber(obj.priceAgeMs) ? (obj.priceAgeMs as number) : undefined,
      interestMustBeDonatedToCharity: isBoolean(obj.interestMustBeDonatedToCharity) ? (obj.interestMustBeDonatedToCharity as boolean) : undefined,
      interestDonationAmount: isFiniteNumber(obj.interestDonationAmount) ? (obj.interestDonationAmount as number) : undefined,
      interestDonationGuidance: isString(obj.interestDonationGuidance) ? (obj.interestDonationGuidance as string) : undefined,
    },
  };
}

// ── Zakat Payment ─────────────────────────────────────────────────────────────

export interface ZakatPayment {
  id: number;
  amount: number;
  recipient?: string | null;
  notes?: string | null;
  paidAt?: number;
  lunarYear?: number;
  createdAt?: string | number | null;
}

export function validateZakatPayment(data: unknown): ValidationResult<ZakatPayment> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;
  const issues: Array<{ path: string; message: string }> = [];

  if (!isFiniteNumber(obj.id)) issues.push({ path: 'id', message: 'Expected finite number' });
  if (!isNonNegativeNumber(obj.amount)) issues.push({ path: 'amount', message: 'Expected non-negative number' });

  if (issues.length > 0) return { success: false, issues };

  const createdAt = obj.createdAt as string | number | null | undefined;
  return {
    success: true,
    data: {
      id: obj.id as number,
      amount: obj.amount as number,
      recipient: (obj.recipient as string | null) || undefined,
      notes: (obj.notes as string | null) || undefined,
      paidAt: isFiniteNumber(obj.paidAt) ? (obj.paidAt as number) : undefined,
      lunarYear: isFiniteNumber(obj.lunarYear) ? (obj.lunarYear as number) : undefined,
      createdAt: (isString(createdAt) || isFiniteNumber(createdAt)) ? createdAt : undefined,
    },
  };
}

export interface ZakatPaymentsResponse {
  payments: ZakatPayment[];
}

export function validateZakatPaymentsResponse(data: unknown): ValidationResult<ZakatPaymentsResponse> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;

  if (!isArray(obj.payments)) {
    return { success: false, issues: [{ path: 'payments', message: 'Expected array' }] };
  }

  const payments: ZakatPayment[] = [];
  for (const item of obj.payments as unknown[]) {
    const result = validateZakatPayment(item);
    if (result.success) {
      payments.push(result.data!);
    }
  }

  return {
    success: true,
    data: { payments: payments.length > 0 ? payments : [] },
  };
}

// ── Nisab Info ────────────────────────────────────────────────────────────────

export interface NisabInfo {
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldNisabGrams: number;
  silverNisabGrams: number;
  goldNisabUSD: number;
  silverNisabUSD: number;
  source?: string;
  staleWarning?: boolean;
  priceAgeMs?: number;
}

export function validateNisabInfo(data: unknown): ValidationResult<NisabInfo> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;
  const issues: Array<{ path: string; message: string }> = [];

  if (!isNonNegativeNumber(obj.goldPricePerGram)) issues.push({ path: 'goldPricePerGram', message: 'Expected non-negative number' });
  if (!isNonNegativeNumber(obj.silverPricePerGram)) issues.push({ path: 'silverPricePerGram', message: 'Expected non-negative number' });
  if (!isNonNegativeNumber(obj.goldNisabGrams)) issues.push({ path: 'goldNisabGrams', message: 'Expected non-negative number' });
  if (!isNonNegativeNumber(obj.silverNisabGrams)) issues.push({ path: 'silverNisabGrams', message: 'Expected non-negative number' });
  if (!isNonNegativeNumber(obj.goldNisabUSD)) issues.push({ path: 'goldNisabUSD', message: 'Expected non-negative number' });
  if (!isNonNegativeNumber(obj.silverNisabUSD)) issues.push({ path: 'silverNisabUSD', message: 'Expected non-negative number' });

  if (issues.length > 0) return { success: false, issues };

  return {
    success: true,
    data: {
      goldPricePerGram: obj.goldPricePerGram as number,
      silverPricePerGram: obj.silverPricePerGram as number,
      goldNisabGrams: obj.goldNisabGrams as number,
      silverNisabGrams: obj.silverNisabGrams as number,
      goldNisabUSD: obj.goldNisabUSD as number,
      silverNisabUSD: obj.silverNisabUSD as number,
      source: isString(obj.source) ? (obj.source as string) : undefined,
      staleWarning: isBoolean(obj.staleWarning) ? (obj.staleWarning as boolean) : undefined,
      priceAgeMs: isFiniteNumber(obj.priceAgeMs) ? (obj.priceAgeMs as number) : undefined,
    },
  };
}

// ── Asset ─────────────────────────────────────────────────────────────────────

export interface Asset {
  id: number;
  name: string;
  type: string;
  value: number;
  isZakatable?: boolean;
  taxRate?: number;
  penaltyRate?: number;
  monthlyPayment?: number;
  notes?: string | null;
}

export function validateAsset(data: unknown): ValidationResult<Asset> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;
  const issues: Array<{ path: string; message: string }> = [];

  if (!isFiniteNumber(obj.id)) issues.push({ path: 'id', message: 'Expected finite number' });
  if (!isString(obj.name)) issues.push({ path: 'name', message: 'Expected string' });
  if (!isString(obj.type)) issues.push({ path: 'type', message: 'Expected string' });
  if (!isFiniteNumber(obj.value)) issues.push({ path: 'value', message: 'Expected finite number' });

  if (issues.length > 0) return { success: false, issues };

  return {
    success: true,
    data: {
      id: obj.id as number,
      name: obj.name as string,
      type: obj.type as string,
      value: obj.value as number,
      isZakatable: isBoolean(obj.isZakatable) ? (obj.isZakatable as boolean) : true,
      taxRate: isFiniteNumber(obj.taxRate) ? (obj.taxRate as number) : undefined,
      penaltyRate: isFiniteNumber(obj.penaltyRate) ? (obj.penaltyRate as number) : undefined,
      monthlyPayment: isFiniteNumber(obj.monthlyPayment) ? (obj.monthlyPayment as number) : undefined,
      notes: (obj.notes as string | null) || undefined,
    },
  };
}

// ── Wasiyyah Beneficiary ──────────────────────────────────────────────────────

export interface WasiyyahBeneficiary {
  id: number;
  name: string;
  relationship: string;
  shareType: 'legal' | 'voluntary' | 'percentage';
  sharePercentage: number;
  notes?: string | null;
}

export function validateWasiyyahBeneficiary(data: unknown): ValidationResult<WasiyyahBeneficiary> {
  if (!data || typeof data !== 'object') {
    return { success: false, issues: [{ path: 'root', message: 'Expected object' }] };
  }

  const obj = data as Record<string, unknown>;
  const issues: Array<{ path: string; message: string }> = [];

  if (!isFiniteNumber(obj.id)) issues.push({ path: 'id', message: 'Expected finite number' });
  if (!isString(obj.name)) issues.push({ path: 'name', message: 'Expected string' });
  if (!isString(obj.relationship)) issues.push({ path: 'relationship', message: 'Expected string' });
  if (!['legal', 'voluntary', 'percentage'].includes(obj.shareType as string)) {
    issues.push({ path: 'shareType', message: 'Expected legal | voluntary | percentage' });
  }
  if (!isNonNegativeNumber(obj.sharePercentage)) issues.push({ path: 'sharePercentage', message: 'Expected non-negative number' });

  if (issues.length > 0) return { success: false, issues };

  return {
    success: true,
    data: {
      id: obj.id as number,
      name: obj.name as string,
      relationship: obj.relationship as string,
      shareType: (obj.shareType as 'legal' | 'voluntary' | 'percentage') || 'voluntary',
      sharePercentage: obj.sharePercentage as number,
      notes: (obj.notes as string | null) || undefined,
    },
  };
}

// ── Safe Parse Helpers ────────────────────────────────────────────────────────

export function safeParse<T>(validate: (data: unknown) => ValidationResult<T>, data: unknown, context: string): T | null {
  const result = validate(data);
  if (!result.success) {
    console.error(`[Schema Validation] ${context}:`, result.issues);
    return null;
  }
  return result.data || null;
}

export function safeParseWithFallback<T>(validate: (data: unknown) => ValidationResult<T>, data: unknown, context: string): T {
  const result = validate(data);
  if (!result.success) {
    console.warn(`[Schema Validation] ${context}: validation failed, using raw data`, result.issues);
    return data as T;
  }
  return result.data!;
}

// ── formatTimeAgo helper ──────────────────────────────────────────────────────

export function formatTimeAgo(milliseconds?: number): string {
  if (!milliseconds || milliseconds < 0) return 'unknown';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // If age exceeds 365 days, prices were likely never fetched (cache
  // initialized at epoch 0). Show a user-friendly message instead of
  // an absurd day count like "20545d ago".
  if (days > 365) return 'a long time ago — prices may not have loaded';

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
