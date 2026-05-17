import { Router } from 'express';
import validate from 'express-zod-safe';
import { UsersController } from './users.controller.js';
import { userIdParamSchema } from '@repo/api';

const router = Router();
const controller = new UsersController();

router.get('/', controller.getAll);
router.get('/:id', validate({ params: userIdParamSchema }), controller.getById);

export default router;
