import { apiClient } from '@/shared/lib/apiClient';
import { type Store, type CreateStoreInput, type UpdateStoreInput } from '@repo/api';

export const getStores = () => apiClient.get<Store[]>('/stores');

export const getStore = (id: string) => apiClient.get<Store>(`/stores/${id}`);

export const getStoreByUser = (userId: string) => apiClient.get<Store>(`/stores/user/${userId}`);

export const createStore = (input: CreateStoreInput) =>
  apiClient.post<Store, CreateStoreInput>('/stores', input);

export const updateStore = (id: string, input: UpdateStoreInput) =>
  apiClient.patch<Store, UpdateStoreInput>(`/stores/${id}`, input);
