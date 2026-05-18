import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateStoreItem } from '../api/store-items-api';
import type { UpdateStoreItemInput } from '@repo/api';

export function useUpdateStoreItem(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, input }: { itemId: string; input: UpdateStoreItemInput }) =>
      updateStoreItem(storeId, itemId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['store-items', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store-items', storeId, variables.itemId] });
    },
  });
}
