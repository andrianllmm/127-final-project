import { apiClient } from '@/shared/lib/apiClient';
import {
  type Store,
  type CreateStoreInput,
  type UpdateStoreInput,
  type AnalyticsResponse,
  type AnalyticsQuery,
} from '@repo/api';

export const getStores = () => apiClient.get<Store[]>('/stores');

export const getStore = (id: string) => apiClient.get<Store>(`/stores/${id}`);

export const getStoreByUser = (userId: string) => apiClient.get<Store>(`/stores/user/${userId}`);

export const createStore = (input: CreateStoreInput) =>
  apiClient.post<Store, CreateStoreInput>('/stores', input);

export const updateStore = (id: string, input: UpdateStoreInput) =>
  apiClient.patch<Store, UpdateStoreInput>(`/stores/${id}`, input);

export const getStoreAnalytics = (storeId: string, query?: AnalyticsQuery) => {
  const params = new URLSearchParams();
  if (query?.startDate) params.append('startDate', query.startDate);
  if (query?.endDate) params.append('endDate', query.endDate);
  if (query?.limit) params.append('limit', String(query.limit));

  const queryString = params.toString();
  const url = `/analytics/stores/${storeId}/analytics${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<AnalyticsResponse>(url);
};
