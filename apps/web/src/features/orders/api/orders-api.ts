import {
  type AddCartItemInput,
  type CheckoutCartInput,
  type Order,
  type OrderItem,
} from '@repo/api';
import { apiClient } from '@/shared/lib/apiClient';

export interface CartResponse extends Order {
  items: OrderItem[];
}

export const getMyOrders = () => apiClient.get<Order[]>('/orders/me');

export const getCart = () => apiClient.get<CartResponse | null>('/orders/cart');

export const addCartItem = (input: AddCartItemInput) =>
  apiClient.post<CartResponse, AddCartItemInput>('/orders/cart/items', input);

export const removeCartItem = (orderItemId: string) =>
  apiClient.delete<CartResponse>(`/orders/cart/items/${orderItemId}`);

export const getOrder = (orderId: string) =>
  apiClient.get<CartResponse>(`/orders/${orderId}`);

export const checkoutCart = (input: CheckoutCartInput) =>
  apiClient.patch<CartResponse, CheckoutCartInput>('/orders/cart/checkout', input);

export const cancelOrder = (orderId: string) =>
  apiClient.patch<CartResponse, object>(`/orders/${orderId}/cancel`, {});