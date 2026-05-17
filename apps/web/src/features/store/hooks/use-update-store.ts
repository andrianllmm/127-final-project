import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStore } from '../api/stores-api';
import type { UpdateStoreInput } from '@repo/api';

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStoreInput }) => updateStore(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({
        queryKey: ['stores', variables.id],
      });
    },
  });
}
