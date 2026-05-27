import { Router } from 'express';
import { DeliveriesController } from './deliveries.controller.js';

const router = Router();
const controller = new DeliveriesController();

router.get('/', controller.getAll);
router.get('/offers', controller.getOpenOffers);
router.get('/:id', controller.getById);
router.patch('/:id/accept', controller.acceptDelivery);
router.get('/active', controller.getActiveDeliveries);

export default router;
