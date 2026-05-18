import { apiClient } from '@/shared/lib/apiClient';
import type { CreateStoreItemInput, StoreItem, UpdateStoreItemInput } from '@repo/api';

export const getStoreItems = (storeId: string) =>
  apiClient.get<StoreItem[]>(`/stores/${storeId}/items`);

export const getStoreItem = (storeId: string, itemId: string) =>
  apiClient.get<StoreItem>(`/stores/${storeId}/items/${itemId}`);

export const createStoreItem = (storeId: string, input: CreateStoreItemInput) =>
  apiClient.post<StoreItem, CreateStoreItemInput>(`/stores/${storeId}/items`, input);

export const updateStoreItem = (storeId: string, itemId: string, input: UpdateStoreItemInput) =>
  apiClient.patch<StoreItem, UpdateStoreItemInput>(`/stores/${storeId}/items/${itemId}`, input);

export const deleteStoreItem = (storeId: string, itemId: string) =>
  apiClient.delete<void>(`/stores/${storeId}/items/${itemId}`);
