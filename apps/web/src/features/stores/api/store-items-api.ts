import { apiClient } from '@/shared/lib/apiClient';
import type {
  CreateStoreItemInput,
  StoreItem,
  StoreItemsQuery,
  UpdateStoreItemInput,
} from '@repo/api';

export const getStoreItems = ({
  storeId,
  keyword,
  sortBy,
  sortOrder,
  priceMin,
  priceMax,
  available,
}: StoreItemsQuery = {}) =>
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

export const createStoreItem = (input: CreateStoreItemInput | FormData) =>
  apiClient.post<StoreItem, CreateStoreItemInput | FormData>(`/items`, input);

export const updateStoreItem = (itemId: string, input: UpdateStoreItemInput | FormData) =>
  apiClient.patch<StoreItem, UpdateStoreItemInput | FormData>(`/items/${itemId}`, input);

export const deleteStoreItem = (itemId: string) => apiClient.delete<void>(`/items/${itemId}`);
