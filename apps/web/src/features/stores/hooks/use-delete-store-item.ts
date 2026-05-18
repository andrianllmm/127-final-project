import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteStoreItem } from '../api/store-items-api';

export function useDeleteStoreItem(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteStoreItem(storeId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items', storeId] });
    },
  });
}
