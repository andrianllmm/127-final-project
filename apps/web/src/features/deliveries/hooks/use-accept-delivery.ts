import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptDelivery } from '../api/deliveries-api';

export function useAcceptDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptDelivery(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries', 'offers'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries', id] });
    },
  });
}
