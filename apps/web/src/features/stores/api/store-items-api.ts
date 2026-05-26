import { apiClient } from '@/shared/lib/apiClient';
import type { CreateStoreItemInput, StoreItem, UpdateStoreItemInput } from '@repo/api';

interface GetStoreItemsParams {
  storeId?: string | undefined;
  keyword?: string | undefined;
}

export const getStoreItems = ({ storeId, keyword }: GetStoreItemsParams = {}) =>
  apiClient.get<StoreItem[]>(`/items`, {
    params: {
      ...(storeId ? { storeId } : {}),
      ...(keyword ? { keyword } : {}),
    },
  });

export const getStoreItem = (itemId: string) => apiClient.get<StoreItem>(`/items/${itemId}`);

export const createStoreItem = (input: CreateStoreItemInput) =>
  apiClient.post<StoreItem, CreateStoreItemInput>(`/items`, input);

export const updateStoreItem = (itemId: string, input: UpdateStoreItemInput) =>
  apiClient.patch<StoreItem, UpdateStoreItemInput>(`/items/${itemId}`, input);

export const deleteStoreItem = (itemId: string) => apiClient.delete<void>(`/items/${itemId}`);
