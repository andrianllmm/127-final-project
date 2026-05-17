import { z } from 'zod';

export const storeSchema = z.object({
  store_id: z.string(),
  user_id: z.string(),
  store_name: z.string(),
  store_address: z.string(),
  created_at: z.coerce.date(),
});

export const createStoreSchema = z.object({
  store_name: z.string().trim().min(1, 'Store name is required').max(255, 'Store name is too long'),
  store_address: z.string().trim().min(1, 'Store address is required'),
});

export const updateStoreSchema = z.object({
  store_name: z
    .string()
    .trim()
    .min(1, 'Store name is required')
    .max(255, 'Store name is too long')
    .optional(),
  store_address: z.string().trim().min(1, 'Store address is required').optional(),
});

export type Store = z.infer<typeof storeSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
