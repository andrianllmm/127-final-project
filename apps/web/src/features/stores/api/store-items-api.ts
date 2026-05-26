import { apiClient } from '@/shared/lib/apiClient';
import type { CreateStoreItemInput, StoreItem, UpdateStoreItemInput } from '@repo/api';

export const getStoreItems = (storeId?: string) =>
  apiClient.get<StoreItem[]>(`/items`, {
    params: storeId ? { storeId } : {},
  });

export const getStoreItem = (itemId: string) => apiClient.get<StoreItem>(`/items/${itemId}`);

export const createStoreItem = (input: CreateStoreItemInput) =>
  apiClient.post<StoreItem, CreateStoreItemInput>(`/items`, input);

export const updateStoreItem = (itemId: string, input: UpdateStoreItemInput) =>
  apiClient.patch<StoreItem, UpdateStoreItemInput>(`/items/${itemId}`, input);

export const deleteStoreItem = (itemId: string) => apiClient.delete<void>(`/items/${itemId}`);
