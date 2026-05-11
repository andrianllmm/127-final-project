import { Router } from 'express';
import { RiderController } from './rider.controller.js';

const router = Router();
const controller = new RiderController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
