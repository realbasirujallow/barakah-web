export interface InvestmentFxRates {
  base: string;
  rates: Record<string, number>;
  estimated?: boolean;
  fetchedAt?: number;
}

export function convertInvestmentAmount(amount: number, from = 'USD', to: string, rates: InvestmentFxRates | null): number {
  if (!Number.isFinite(amount)) throw new Error('Invalid investment amount');
  const source = from.toUpperCase(), target = to.toUpperCase();
  if (source === target || amount === 0) return amount;
  if (!rates || rates.estimated || (rates.fetchedAt !== undefined && Date.now() - rates.fetchedAt > 86400000)) {
    throw new Error('Current exchange rates are unavailable');
  }
  const fromRate = source === rates.base ? 1 : rates.rates[source];
  const toRate = target === rates.base ? 1 : rates.rates[target];
  if (!(fromRate > 0) || !(toRate > 0) || !Number.isFinite(fromRate) || !Number.isFinite(toRate)) {
    throw new Error('Exchange rate missing for investment currency');
  }
  return amount / fromRate * toRate;
}

export function normalizeInvestmentAmounts<T extends object>(data: T, fields: readonly (keyof T)[], from: string | undefined, to: string, rates: InvestmentFxRates | null): T {
  const result = { ...data };
  for (const field of fields) {
    const value = data[field];
    if (typeof value === 'number') result[field] = convertInvestmentAmount(value, from, to, rates) as T[keyof T];
  }
  return result;
}
