import { apiClient } from '@/shared/lib/apiClient';
import type {
  ActiveDelivery,
  DeliveryOffer,
  DeliverySummary,
  UpdateDeliveryStatusInput,
} from '@repo/api';

export const getDeliveryHistory = () => apiClient.get<DeliverySummary[]>('/deliveries');

export const getDelivery = (id: string) => apiClient.get<DeliverySummary>(`/deliveries/${id}`);

export const getDeliveryOffers = () => apiClient.get<DeliveryOffer[]>('/deliveries/offers');

export const getActiveDeliveries = () => apiClient.get<ActiveDelivery[]>('/deliveries/active');

export const acceptDelivery = (id: string) =>
  apiClient.patch<DeliverySummary, object>(`/deliveries/${id}/accept`, {});

export const updateDeliveryStatus = (id: string, input: UpdateDeliveryStatusInput) =>
  apiClient.patch<DeliverySummary, UpdateDeliveryStatusInput>(`/deliveries/${id}/status`, input);
