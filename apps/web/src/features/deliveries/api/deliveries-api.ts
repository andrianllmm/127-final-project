import { apiClient } from '@/shared/lib/apiClient';
import type { Order, UpdateDeliveryStatusInput } from '@repo/api';

export const getDeliveryHistory = () => apiClient.get<Order[]>('/deliveries');

export const getDelivery = (id: string) => apiClient.get<Order>(`/deliveries/${id}`);

export const getDeliveryOffers = () => apiClient.get<Order[]>('/deliveries/offers');

export const getActiveDeliveries = () => apiClient.get<Order[]>('/deliveries/active');

export const acceptDelivery = (id: string) =>
  apiClient.patch<Order, object>(`/deliveries/${id}/accept`, {});

export const updateDeliveryStatus = (id: string, input: UpdateDeliveryStatusInput) =>
  apiClient.patch<Order, UpdateDeliveryStatusInput>(`/deliveries/${id}/status`, input);
