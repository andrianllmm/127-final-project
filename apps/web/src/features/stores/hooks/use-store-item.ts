import { useQuery } from '@tanstack/react-query';

import { getStoreItem } from '../api/store-items-api';

export function useStoreItem(itemId: string, enabled = true) {
  return useQuery({
    queryKey: ['store-items', itemId],
    queryFn: () => getStoreItem(itemId),
    enabled: enabled && !!itemId,
  });
}
