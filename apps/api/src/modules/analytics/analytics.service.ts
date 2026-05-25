import { AnalyticsRepository } from './analytics.repository.js';
import { AnalyticsResponse, AnalyticsQuery } from '@repo/api';

export class AnalyticsService {
  private repo: AnalyticsRepository;

  constructor(repo?: AnalyticsRepository) {
    this.repo = repo ?? new AnalyticsRepository();
  }

  async getStoreAnalytics(storeId: string, query: AnalyticsQuery): Promise<AnalyticsResponse> {
    const { startDate, endDate, limit = 10 } = query;

    const [metrics, top_items, order_status_breakdown, daily_metrics] = await Promise.all([
      this.repo.getMetrics(storeId, startDate, endDate),
      this.repo.getTopItems(storeId, limit, startDate, endDate),
      this.repo.getOrderStatusBreakdown(storeId, startDate, endDate),
      this.repo.getDailyMetrics(storeId, 30, startDate, endDate),
    ]);

    return {
      metrics,
      top_items,
      order_status_breakdown,
      daily_metrics,
    };
  }
}
