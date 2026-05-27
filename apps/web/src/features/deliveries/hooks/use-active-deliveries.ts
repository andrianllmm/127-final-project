import { useQuery } from '@tanstack/react-query';
import { getActiveDeliveries } from '../api/deliveries-api';

export function useActiveDeliveries() {
  return useQuery({
    queryKey: ['deliveries', 'active'],
    queryFn: getActiveDeliveries,
  });
}
