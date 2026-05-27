import { useQuery } from '@tanstack/react-query';
import { getDeliveryHistory } from '../api/deliveries-api';

export function useDeliveries() {
  return useQuery({
    queryKey: ['deliveries'],
    queryFn: getDeliveryHistory,
  });
}
