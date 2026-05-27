import { useSearchParams } from 'react-router-dom';

import {
  PRICE_MIN,
  PRICE_MAX,
  parseSortBy,
  parseSortOrder,
  parsePrice,
  normalizePriceRange,
  type StoreItemsSortBy,
  type StoreItemsSortOrder,
} from '../lib/storeFilters';

export function useStoreFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('q')?.trim() || '';

  const sortBy = parseSortBy(searchParams.get('sortBy'));
  const sortOrder = parseSortOrder(searchParams.get('sortOrder'));

  const priceRange = normalizePriceRange(
    parsePrice(searchParams.get('priceMin'), PRICE_MIN),
    parsePrice(searchParams.get('priceMax'), PRICE_MAX),
  );

  const availableOnly = searchParams.get('available') === 'true';

  const updateSearchParams = (updater: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    setSearchParams(next, { replace: true });
  };

  const setParam = (key: string, value?: string | number | boolean) => {
    updateSearchParams((p) => {
      if (value === undefined || value === null || value === '') {
        p.delete(key);
      } else {
        p.set(key, String(value));
      }
    });
  };

  const setSortBy = (v: StoreItemsSortBy) => setParam('sortBy', v);

  const setSortOrder = (v: StoreItemsSortOrder) => setParam('sortOrder', v);

  const setAvailableOnly = (v: boolean) => setParam('available', v ? true : undefined);

  const setPriceRange = ([min, max]: [number, number]) => {
    const [a, b] = normalizePriceRange(min, max);

    updateSearchParams((p) => {
      if (a <= PRICE_MIN) p.delete('priceMin');
      else p.set('priceMin', String(a));

      if (b >= PRICE_MAX) p.delete('priceMax');
      else p.set('priceMax', String(b));
    });
  };

  return {
    keyword,

    sortBy,
    sortOrder,
    priceRange,
    availableOnly,

    setSortBy,
    setSortOrder,
    setPriceRange,
    setAvailableOnly,
  };
}
