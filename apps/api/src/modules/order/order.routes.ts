import { Router } from 'express';
import { OrderController } from './order.controller.js';

const router = Router();
const controller = new OrderController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
