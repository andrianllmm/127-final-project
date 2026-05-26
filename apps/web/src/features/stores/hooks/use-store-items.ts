import { useQuery } from '@tanstack/react-query';

import { getStoreItems } from '../api/store-items-api';

export function useStoreItems(storeId?: string, enabled = true) {
  return useQuery({
    queryKey: ['store-items', storeId ?? 'all'],
    queryFn: () => getStoreItems(storeId),
    enabled: enabled && (storeId === undefined || storeId.length > 0),
  });
}
