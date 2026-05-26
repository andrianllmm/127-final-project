export const PRICE_MIN = 0;
export const PRICE_MAX = 2000;

export type StoreItemsSortBy = 'created_at' | 'name' | 'price';
export type StoreItemsSortOrder = 'asc' | 'desc';

export function parseSortBy(value: string | null): StoreItemsSortBy {
  if (value === 'name' || value === 'price') return value;
  return 'created_at';
}

export function parseSortOrder(value: string | null): StoreItemsSortOrder {
  return value === 'asc' ? 'asc' : 'desc';
}

export function parsePrice(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, parsed));
}

export function normalizePriceRange(min: number, max: number): [number, number] {
  return min <= max ? [min, max] : [max, min];
}
