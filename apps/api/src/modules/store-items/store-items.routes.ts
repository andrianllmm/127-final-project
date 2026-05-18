import { Router } from 'express';
import validate from 'express-zod-safe';
import z from 'zod';

import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import { createStoreItemSchema, updateStoreItemSchema } from '@repo/api';
import { StoreItemsController } from './store-items.controller.js';

const router = Router();
const controller = new StoreItemsController();

const storeParamsSchema = z.object({
  storeId: z.uuid(),
});

const storeItemParamsSchema = z.object({
  storeId: z.uuid(),
  itemId: z.uuid(),
});

router.get('/:storeId/items', validate({ params: storeParamsSchema }), controller.getAll);

router.get(
  '/:storeId/items/:itemId',
  validate({ params: storeItemParamsSchema }),
  controller.getById,
);

router.post(
  '/:storeId/items',
  requireAuth,
  requireRole('vendor'),
  validate({ params: storeParamsSchema, body: createStoreItemSchema }),
  controller.create,
);

router.patch(
  '/:storeId/items/:itemId',
  requireAuth,
  requireRole('vendor'),
  validate({ params: storeItemParamsSchema, body: updateStoreItemSchema }),
  controller.update,
);

router.delete(
  '/:storeId/items/:itemId',
  requireAuth,
  requireRole('vendor'),
  validate({ params: storeItemParamsSchema }),
  controller.delete,
);

export default router;
