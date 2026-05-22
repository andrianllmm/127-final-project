import { apiClient } from '@/shared/lib/apiClient';
import { type Order, type OrderItem } from '@repo/api';

export interface CartResponse extends Order {
  items: OrderItem[];
}

export const getMyOrders = () => apiClient.get<Order[]>('/orders/me');

export const getCart = () => apiClient.get<CartResponse | null>('/orders/cart');