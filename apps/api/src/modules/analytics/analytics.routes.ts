import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';

const router = Router();
const controller = new AnalyticsController();

// All analytics endpoints require authentication
router.use(requireAuth);

// Get analytics for a specific store
router.get('/stores/:storeId/analytics', controller.getStoreAnalytics);

export default router;
