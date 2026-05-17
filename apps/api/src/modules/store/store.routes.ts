import { Router } from 'express';
import { StoreController } from './store.controller.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import validate from 'express-zod-safe';
import z from 'zod';
import { createStoreSchema, updateStoreSchema } from '@repo/api';

const router = Router();
const controller = new StoreController();

router.get('/', controller.getAll);

router.get(
  '/user/:userId',
  validate({ params: z.object({ userId: z.string() }) }),
  controller.getByUserId,
);

router.get('/:id', validate({ params: z.object({ id: z.uuid() }) }), controller.getById);

router.post(
  '/',
  requireAuth,
  requireRole('vendor'),
  validate({ body: createStoreSchema }),
  controller.create,
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('vendor'),
  validate({
    params: z.object({
      id: z.uuid(),
    }),
    body: updateStoreSchema,
  }),
  controller.update,
);

export default router;
