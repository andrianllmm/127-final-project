import { useQuery } from '@tanstack/react-query';
import { getStores } from '../api/stores-api';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });
}
