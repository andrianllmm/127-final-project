import { z } from 'zod';

export const deliveryStatusSchema = z.enum([
  'open',
  'accepted',
  'picked_up',
  'delivered',
  'cancelled',
]);

export const updateDeliveryStatusSchema = z.object({
  status: deliveryStatusSchema,
});

export type DeliveryStatus = z.infer<typeof deliveryStatusSchema>;
export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>;
