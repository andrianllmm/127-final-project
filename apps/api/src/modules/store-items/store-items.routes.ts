import { Router } from 'express';
import validate from 'express-zod-safe';
import z from 'zod';

import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import { createStoreItemSchema, updateStoreItemSchema } from '@repo/api';
import { StoreItemsController } from './store-items.controller.js';

const router = Router();
const controller = new StoreItemsController();

const storeItemsQuerySchema = z
  .object({
    storeId: z.uuid().optional(),
    keyword: z.string().trim().min(1).max(100).optional(),
    sortBy: z.enum(['created_at', 'name', 'price']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    priceMin: z.coerce.number().min(0).max(10000).optional(),
    priceMax: z.coerce.number().min(0).max(10000).optional(),
    available: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
  })
  .refine(
    (data) =>
      data.priceMin === undefined || data.priceMax === undefined || data.priceMin <= data.priceMax,
    {
      message: 'Minimum price must be less than or equal to maximum price',
      path: ['priceMax'],
    },
  );

const storeItemParamsSchema = z.object({
  itemId: z.uuid(),
});

router.get('/', validate({ query: storeItemsQuerySchema }), controller.getAll);

router.get('/:itemId', validate({ params: storeItemParamsSchema }), controller.getById);

router.post(
  '/',
  requireAuth,
  requireRole('vendor'),
  validate({ body: createStoreItemSchema }),
  controller.create,
);

router.patch(
  '/:itemId',
  requireAuth,
  requireRole('vendor'),
  validate({
    params: z.object({
      itemId: z.uuid(),
    }),
    body: updateStoreItemSchema,
  }),
  controller.update,
);

router.delete(
  '/:itemId',
  requireAuth,
  requireRole('vendor'),
  validate({
    params: z.object({
      itemId: z.uuid(),
    }),
  }),
  controller.delete,
);

export default router;
