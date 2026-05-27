import { z } from 'zod';
import { orderStatusSchema, paymentMethodSchema } from '../orders/orders.schema.js';

export const deliveryStatusSchema = z.enum(['accepted', 'picked_up', 'delivered', 'cancelled']);

export const deliverySummarySchema = z.object({
  id: z.string(),
  customerId: z.string(),
  storeId: z.string(),
  riderId: z.string().nullable(),
  vendorName: z.string(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  status: orderStatusSchema,
  paymentMethod: paymentMethodSchema,
  totalPrice: z.coerce.number(),
  itemCount: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const deliveryOfferSchema = deliverySummarySchema.pick({
  id: true,
  vendorName: true,
  pickupLocation: true,
  dropoffLocation: true,
  totalPrice: true,
  itemCount: true,
});

export const activeDeliverySchema = deliverySummarySchema.pick({
  id: true,
  vendorName: true,
  dropoffLocation: true,
  status: true,
});

export const updateDeliveryStatusSchema = z.object({
  status: deliveryStatusSchema,
});

export type DeliveryStatus = z.infer<typeof deliveryStatusSchema>;
export type DeliverySummary = z.infer<typeof deliverySummarySchema>;
export type DeliveryOffer = z.infer<typeof deliveryOfferSchema>;
export type ActiveDelivery = z.infer<typeof activeDeliverySchema>;
export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>;
