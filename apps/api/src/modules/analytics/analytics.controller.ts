import type { Request, Response } from 'express';
import type { AuthRequest } from '../../common/middleware/auth.middleware.js';
import { AnalyticsService } from './analytics.service.js';
import { StoresService } from '../stores/stores.service.js';
import type { AnalyticsQuery } from '@repo/api';

export class AnalyticsController {
  private service = new AnalyticsService();
  private storesService = new StoresService();

  getStoreAnalytics = async (req: Request, res: Response): Promise<Response> => {
    const { storeId } = req.params as { storeId: string };
    const authReq = req as AuthRequest;
    const { startDate, endDate, limit } = req.query as Partial<AnalyticsQuery>;

    try {
      const store = await this.storesService.getById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      if (store.user_id !== authReq.user?.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const data = await this.service.getStoreAnalytics(storeId, {
        startDate,
        endDate,
        limit: limit ?? 10,
      });

      return res.json(data);
    } catch (error) {
      console.error('Analytics error:', error);
      return res.status(500).json({
        message: 'Failed to fetch analytics',
      });
    }
  };
}
