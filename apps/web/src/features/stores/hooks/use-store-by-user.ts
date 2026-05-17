import { useQuery } from '@tanstack/react-query';
import { getStoresByUser } from '../api/stores-api';

export function useStoresByUser(userId: string) {
  return useQuery({
    queryKey: ['stores', 'user', userId],
    queryFn: () => getStoresByUser(userId),
    enabled: !!userId,
  });
}
