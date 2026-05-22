import { useQuery } from '@tanstack/react-query';
import { getCart } from '../api/orders-api';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
}