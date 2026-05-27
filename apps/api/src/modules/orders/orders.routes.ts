import { Router } from 'express';
import validate from 'express-zod-safe';
import z from 'zod';

import { addCartItemSchema, checkoutCartSchema } from '@repo/api';
import { OrdersController } from './orders.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = Router();
const controller = new OrdersController();

router.get('/me', requireAuth, controller.getMine);
router.get('/cart', requireAuth, controller.getCart);

router.post(
  '/cart/items',
  requireAuth,
  validate({ body: addCartItemSchema }),
  controller.addCartItem,
);

router.delete(
  '/cart/items/:orderItemId',
  requireAuth,
  validate({ params: z.object({ orderItemId: z.uuid() }) }),
  controller.removeCartItem,
);

router.patch(
  '/cart/items/:orderItemId',
  requireAuth,
  validate({
    params: z.object({ orderItemId: z.uuid() }),
    body: z.object({
      quantity: z.number().int().positive(),
    }),
  }),
  controller.updateCartItemQuantity,
);

router.delete(
  '/cart',
  requireAuth,
  controller.clearCart,
);

router.patch(
  '/cart/checkout',
  requireAuth,
  validate({ body: checkoutCartSchema }),
  controller.checkoutCart,
);

router.patch(
  '/:id/cancel',
  requireAuth,
  validate({ params: z.object({ id: z.uuid() }) }),
  controller.cancelOrder,
);

router.get(
  '/:id',
  requireAuth,
  validate({ params: z.object({ id: z.uuid() }) }),
  controller.getById,
);

export default router;