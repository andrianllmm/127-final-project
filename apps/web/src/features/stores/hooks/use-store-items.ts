import { useQuery } from '@tanstack/react-query';

import { getStoreItems } from '../api/store-items-api';

interface UseStoreItemsOptions {
  storeId?: string;
  keyword?: string;
  enabled?: boolean;
}

export function useStoreItems(options: UseStoreItemsOptions = {}) {
  const { storeId, keyword, enabled = true } = options;
  const normalizedKeyword = keyword?.trim() ? keyword.trim() : '';

  return useQuery({
    queryKey: ['store-items', storeId ?? 'all', normalizedKeyword ?? ''],
    queryFn: () => getStoreItems({ storeId, keyword: normalizedKeyword }),
    enabled: enabled && (storeId === undefined || storeId.length > 0),
  });
}
