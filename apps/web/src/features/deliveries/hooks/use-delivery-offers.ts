import { useQuery } from '@tanstack/react-query';
import { getDeliveryOffers } from '../api/deliveries-api';

export function useDeliveryOffers() {
  return useQuery({
    queryKey: ['deliveries', 'offers'],
    queryFn: getDeliveryOffers,
  });
}
