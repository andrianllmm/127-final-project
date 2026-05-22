import { Router } from 'express';
import validate from 'express-zod-safe';
import z from 'zod';

import { OrdersController } from './orders.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = Router();
const controller = new OrdersController();

router.get('/me', requireAuth, controller.getMine);
router.get('/cart', requireAuth, controller.getCart);

router.get(
  '/:id',
  requireAuth,
  validate({ params: z.object({ id: z.uuid() }) }),
  controller.getById,
);

export default router;