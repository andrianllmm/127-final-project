import { Router } from 'express';
import validate from 'express-zod-safe';
import z from 'zod';
import { storeItemImageUpload } from './store-items.upload.js';

import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import { storeItemsQuerySchema } from '@repo/api';
import { StoreItemsController } from './store-items.controller.js';

const router = Router();
const controller = new StoreItemsController();

const storeItemParamsSchema = z.object({
  itemId: z.uuid(),
});

router.get('/', validate({ query: storeItemsQuerySchema }), controller.getAll);

router.get('/:itemId', validate({ params: storeItemParamsSchema }), controller.getById);

router.post(
  '/',
  requireAuth,
  requireRole('vendor'),
  storeItemImageUpload.single('image'),
  controller.create,
);

router.patch(
  '/:itemId',
  requireAuth,
  requireRole('vendor'),
  storeItemImageUpload.single('image'),
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
