import { Router, type Response } from 'express';
import validate from 'express-zod-safe';
import { AnalyticsController } from './analytics.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/rbac.middleware.js';
import { analyticsQuerySchema, analyticsStoreParamsSchema } from '@repo/api';

const router = Router();
const controller = new AnalyticsController();

// All analytics endpoints require authentication
router.use(requireAuth, requireRole('vendor'));

// Get analytics for a specific store
router.get(
  '/stores/:storeId/analytics',
  validate({ params: analyticsStoreParamsSchema, query: analyticsQuerySchema }),
  (req: any, res: Response) => controller.getStoreAnalytics(req, res),
);

export default router;
