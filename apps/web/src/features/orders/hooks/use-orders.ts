import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../api/orders-api';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getMyOrders,
  });
}