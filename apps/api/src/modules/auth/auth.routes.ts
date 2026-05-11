import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const router = Router();
const controller = new AuthController();

router.get('/api/me', controller.me);

export default router;
