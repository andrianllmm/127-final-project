import { useQuery } from '@tanstack/react-query';
import { getStore } from '../api/stores-api';

export function useStore(id: string) {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => getStore(id),
    enabled: !!id,
  });
}
