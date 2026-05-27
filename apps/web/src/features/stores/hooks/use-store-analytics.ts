import { useQuery } from '@tanstack/react-query';
import { getStoreAnalytics } from '../api/stores-api';
import { AnalyticsQuery } from '@repo/api';

export function useStoreAnalytics(storeId: string, query?: AnalyticsQuery) {
  return useQuery({
    queryKey: ['analytics', storeId, query],
    queryFn: () => getStoreAnalytics(storeId, query),
    enabled: !!storeId,
  });
}
