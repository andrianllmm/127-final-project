import { useQuery } from '@tanstack/react-query';

import { getStoreItems } from '../api/store-items-api';
import { StoreItemsQuery } from '@repo/api';

type UseStoreItemsOptions = StoreItemsQuery & {
  enabled?: boolean;
};

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
