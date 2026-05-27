import { useQuery } from '@tanstack/react-query';
import { getDelivery } from '../api/deliveries-api';

export function useDelivery(id: string) {
  return useQuery({
    queryKey: ['deliveries', id],
    queryFn: () => getDelivery(id),
    enabled: !!id,
  });
}
