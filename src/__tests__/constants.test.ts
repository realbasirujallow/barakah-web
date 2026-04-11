import { describe, it, expect } from 'vitest';
import {
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
  DEBT_TYPES,
  BILL_CATEGORIES,
  SADAQAH_CATEGORIES,
  WAQF_TYPES,
  WAQF_STATUSES,
  CURRENCIES,
  FIQH_SCHOOLS,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_ACTIVE_STATUSES,
  NOTIFICATION_TYPES,
  RIBA_SOURCE_TYPES,
  WASIYYAH_RELATIONSHIPS,
  WASIYYAH_OBLIGATION_TYPES,
  formatLabel,
} from '../lib/constants';

describe('DomainConstants', () => {
  it('has 3 transaction types', () => {
    expect(TRANSACTION_TYPES).toHaveLength(3);
    expect(TRANSACTION_TYPES).toContain('income');
    expect(TRANSACTION_TYPES).toContain('expense');
    expect(TRANSACTION_TYPES).toContain('transfer');
  });

  it('has 42 transaction categories', () => {
    expect(TRANSACTION_CATEGORIES.length).toBe(42);
  });

  it('has 9 debt types', () => {
    expect(DEBT_TYPES).toHaveLength(9);
  });

  it('has 12 bill categories', () => {
    expect(BILL_CATEGORIES).toHaveLength(12);
  });

  it('has 12 sadaqah categories', () => {
    expect(SADAQAH_CATEGORIES).toHaveLength(12);
  });

  it('has 6 waqf types', () => {
    expect(WAQF_TYPES).toHaveLength(6);
  });

  it('has 3 waqf statuses', () => {
    expect(WAQF_STATUSES).toHaveLength(3);
    expect(WAQF_STATUSES).toContain('active');
  });

  it('has 40 currencies', () => {
    expect(CURRENCIES).toHaveLength(40);
    expect(CURRENCIES).toContain('USD');
    expect(CURRENCIES).toContain('SAR');
  });

  it('has 5 fiqh schools', () => {
    expect(FIQH_SCHOOLS).toHaveLength(5);
    expect(FIQH_SCHOOLS).toContain('HANAFI');
    expect(FIQH_SCHOOLS).toContain('GENERAL');
  });

  it('has 3 subscription plans', () => {
    expect(SUBSCRIPTION_PLANS).toEqual(['free', 'plus', 'family']);
  });

  it('has 4 subscription active statuses', () => {
    expect(SUBSCRIPTION_ACTIVE_STATUSES).toHaveLength(4);
  });

  it('has 8 notification types', () => {
    expect(NOTIFICATION_TYPES).toHaveLength(8);
  });

  it('has 8 riba source types', () => {
    expect(RIBA_SOURCE_TYPES).toHaveLength(8);
  });

  it('has 11 wasiyyah relationships', () => {
    expect(WASIYYAH_RELATIONSHIPS).toHaveLength(11);
  });

  it('has 6 wasiyyah obligation types', () => {
    expect(WASIYYAH_OBLIGATION_TYPES).toHaveLength(6);
  });

  it('formatLabel converts slugs correctly', () => {
    expect(formatLabel('debt_payment')).toBe('Debt Payment');
    expect(formatLabel('food')).toBe('Food');
    expect(formatLabel('qard_hasan')).toBe('Qard Hasan');
  });
});
