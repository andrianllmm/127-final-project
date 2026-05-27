import type { Response } from 'express';
import type { AuthRequest } from '../../common/middleware/auth.middleware.js';
import { AnalyticsService } from './analytics.service.js';
import { StoresService } from '../stores/stores.service.js';
import { analyticsQuerySchema, analyticsResponseSchema } from '@repo/api';

export class AnalyticsController {
  private service = new AnalyticsService();
  private storesService = new StoresService();

  getStoreAnalytics = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { storeId } = req.params;
    const { startDate, endDate, limit } = req.query;

    if (typeof storeId !== 'string') {
      return res.status(400).json({
        message: 'Invalid store ID',
      });
    }

    try {
      const queryValidation = analyticsQuerySchema.safeParse({
        startDate,
        endDate,
        limit,
      });

      if (!queryValidation.success) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: queryValidation.error.flatten(),
        });
      }

      const store = await this.storesService.getById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      if (!req.user || store.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const data = await this.service.getStoreAnalytics(storeId, queryValidation.data);

      const validatedData = analyticsResponseSchema.safeParse(data);
      if (!validatedData.success) {
        return res.status(500).json({
          message: 'Invalid response data',
        });
      }

      return res.json(validatedData.data);
    } catch (error) {
      console.error('Analytics error:', error);
      return res.status(500).json({
        message: 'Failed to fetch analytics',
      });
    }
  };
}
