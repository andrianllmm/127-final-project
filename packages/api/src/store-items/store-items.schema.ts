import { z } from 'zod';

export const storeItemSchema = z.object({
  store_item_id: z.string(),
  store_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.coerce.number(),
  is_available: z.boolean(),
  image_url: z.url().nullable(),
  created_at: z.coerce.date(),
});

export const createStoreItemSchema = z.object({
  name: z.string().trim().min(1, 'Item name is required').max(255, 'Item name is too long'),
  description: z.string().trim().max(1000, 'Description is too long').optional(),
  price: z.number('Invalid price').min(0, 'Price must be at least 0'),
  is_available: z.boolean().optional(),
  image_url: z.url().trim().max(2048, 'Image URL is too long').optional(),
});

export const updateStoreItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Item name is required')
    .max(255, 'Item name is too long')
    .optional(),
  description: z.string().trim().max(1000, 'Description is too long').optional(),
  price: z.number('Invalid price').min(0, 'Price must be at least 0').optional(),
  is_available: z.boolean().optional(),
  image_url: z.url().trim().max(2048, 'Image URL is too long').optional(),
});

export type StoreItem = z.infer<typeof storeItemSchema>;
export type CreateStoreItemInput = z.infer<typeof createStoreItemSchema>;
export type UpdateStoreItemInput = z.infer<typeof updateStoreItemSchema>;
