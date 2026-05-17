import { Router } from 'express';
import { OrdersController } from './orders.controller.js';

const router = Router();
const controller = new OrdersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
