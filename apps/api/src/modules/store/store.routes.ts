import { Router } from 'express';
import { StoreController } from './store.controller.js';

const router = Router();
const controller = new StoreController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
