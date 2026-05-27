import { z } from 'zod';

export const orderStatusSchema = z.enum(['draft', 'open', 'accepted', 'picked_up', 'delivered', 'cancelled']);
export const paymentMethodSchema = z.enum(['cash', 'gcash']);

export const orderItemSchema = z.object({
  order_item_id: z.string(),
  order_id: z.string(),
  store_item_id: z.string(),
  name: z.string(),
  price_snapshot: z.coerce.number(),
  quantity: z.number(),
  subtotal: z.coerce.number(),
});

export const orderSchema = z.object({
  order_id: z.string(),
  customer_id: z.string(),
  store_id: z.string(),
  store_name: z.string(),
  rider_id: z.string().nullable(),
  status: orderStatusSchema,
  payment_method: paymentMethodSchema,
  delivery_address: z.string(),
  total_price: z.coerce.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const addCartItemSchema = z.object({
  store_item_id: z.string(),
  quantity: z.number().int().min(1),
});

export const checkoutCartSchema = z.object({
  payment_method: paymentMethodSchema,
  delivery_address: z.string().trim().min(1, 'Delivery address is required'),
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type CheckoutCartInput = z.infer<typeof checkoutCartSchema>;