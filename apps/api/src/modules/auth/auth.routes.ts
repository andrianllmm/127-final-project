import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = Router();
const controller = new AuthController();

router.get('/api/me', requireAuth, controller.me);

export default router;
