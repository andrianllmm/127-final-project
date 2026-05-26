import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateStoreItem } from '../api/store-items-api';
import type { UpdateStoreItemInput } from '@repo/api';

export function useUpdateStoreItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, input }: { itemId: string; input: UpdateStoreItemInput }) =>
      updateStoreItem(itemId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items'] });
    },
  });
}
