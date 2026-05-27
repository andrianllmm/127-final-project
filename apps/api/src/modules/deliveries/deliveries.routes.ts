import { Router } from 'express';
import { DeliveriesController } from './deliveries.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import validate from 'express-zod-safe';
import z from 'zod';
import { updateDeliveryStatusSchema } from '@repo/api';

const router = Router();
const controller = new DeliveriesController();

router.use(requireAuth, requireRole('rider'));

router.get('/', controller.getAll);
router.get('/offers', controller.getOpenOffers);
router.get('/active', controller.getActiveDeliveries);
router.get('/:id', validate({ params: z.object({ id: z.string().min(1) }) }), controller.getById);
router.patch(
  '/:id/accept',
  validate({ params: z.object({ id: z.string().min(1) }) }),
  controller.acceptDelivery,
);
router.patch(
  '/:id/status',
  validate({ params: z.object({ id: z.string().min(1) }), body: updateDeliveryStatusSchema }),
  controller.updateStatus,
);

export default router;
