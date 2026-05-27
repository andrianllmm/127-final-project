import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteStoreItem } from '../api/store-items-api';

export function useDeleteStoreItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteStoreItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items'] });
    },
  });
}
