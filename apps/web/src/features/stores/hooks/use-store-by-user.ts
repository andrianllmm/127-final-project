import { useQuery } from '@tanstack/react-query';
import { getStoreByUser } from '../api/stores-api';

export function useStoreByUser(userId: string) {
  return useQuery({
    queryKey: ['stores', 'user', userId],
    queryFn: () => getStoreByUser(userId),
    enabled: !!userId,
  });
}
