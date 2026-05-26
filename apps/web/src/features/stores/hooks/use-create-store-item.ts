import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createStoreItem } from '../api/store-items-api';
import type { CreateStoreItemInput } from '@repo/api';

export function useCreateStoreItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStoreItemInput) => createStoreItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items'] });
    },
  });
}
