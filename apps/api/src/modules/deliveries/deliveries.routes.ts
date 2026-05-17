import { Router } from 'express';
import { DeliveriesController } from './deliveries.controller.js';

const router = Router();
const controller = new DeliveriesController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
