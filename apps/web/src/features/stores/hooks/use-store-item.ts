import { useQuery } from '@tanstack/react-query';

import { getStoreItem } from '../api/store-items-api';

export function useStoreItem(storeId: string, itemId: string, enabled = true) {
  return useQuery({
    queryKey: ['store-items', storeId, itemId],
    queryFn: () => getStoreItem(storeId, itemId),
    enabled: enabled && !!storeId && !!itemId,
  });
}
