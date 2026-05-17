import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStore } from '../api/stores-api';
import type { CreateStoreInput } from '@repo/api';

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStoreInput) => createStore(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}
