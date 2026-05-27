import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDeliveryStatus } from '../api/deliveries-api';
import type { UpdateDeliveryStatusInput } from '@repo/api';

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDeliveryStatusInput }) =>
      updateDeliveryStatus(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries', variables.id] });
    },
  });
}
