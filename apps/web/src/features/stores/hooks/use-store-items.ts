import { useQuery } from '@tanstack/react-query';

import { getStoreItems } from '../api/store-items-api';

interface UseStoreItemsOptions {
  storeId?: string;
  keyword?: string;
  sortBy?: 'created_at' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  priceMin?: number;
  priceMax?: number;
  available?: boolean | undefined;
  enabled?: boolean;
}

export function useStoreItems(options: UseStoreItemsOptions = {}) {
  const {
    storeId,
    keyword,
    sortBy,
    sortOrder,
    priceMin,
    priceMax,
    available,
    enabled = true,
  } = options;
  const normalizedKeyword = keyword?.trim() ? keyword.trim() : undefined;

  return useQuery({
    queryKey: [
      'store-items',
      storeId ?? 'all',
      normalizedKeyword ?? '',
      sortBy ?? 'created_at',
      sortOrder ?? 'desc',
      priceMin ?? null,
      priceMax ?? null,
      available ?? null,
    ],
    queryFn: () =>
      getStoreItems({
        storeId,
        keyword: normalizedKeyword,
        sortBy,
        sortOrder,
        priceMin,
        priceMax,
        available,
      }),
    enabled: enabled && (storeId === undefined || storeId.length > 0),
  });
}
