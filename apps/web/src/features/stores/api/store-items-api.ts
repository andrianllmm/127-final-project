import { apiClient } from '@/shared/lib/apiClient';
import type { CreateStoreItemInput, StoreItem, UpdateStoreItemInput } from '@repo/api';

interface GetStoreItemsParams {
  storeId?: string | undefined;
  keyword?: string | undefined;
  sortBy?: 'created_at' | 'name' | 'price' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  available?: boolean | undefined;
}

export const getStoreItems = ({
  storeId,
  keyword,
  sortBy,
  sortOrder,
  priceMin,
  priceMax,
  available,
}: GetStoreItemsParams = {}) =>
  apiClient.get<StoreItem[]>(`/items`, {
    params: {
      ...(storeId ? { storeId } : {}),
      ...(keyword ? { keyword } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      ...(typeof priceMin === 'number' ? { priceMin } : {}),
      ...(typeof priceMax === 'number' ? { priceMax } : {}),
      ...(typeof available === 'boolean' ? { available } : {}),
    },
  });

export const getStoreItem = (itemId: string) => apiClient.get<StoreItem>(`/items/${itemId}`);

export const createStoreItem = (input: CreateStoreItemInput) =>
  apiClient.post<StoreItem, CreateStoreItemInput>(`/items`, input);

export const updateStoreItem = (itemId: string, input: UpdateStoreItemInput) =>
  apiClient.patch<StoreItem, UpdateStoreItemInput>(`/items/${itemId}`, input);

export const deleteStoreItem = (itemId: string) => apiClient.delete<void>(`/items/${itemId}`);
