import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import {
  AnalyticsMetrics,
  TopItems,
  OrderStatusBreakdown,
  DailyMetrics,
} from '@repo/api';

export class AnalyticsRepository {
  async getMetrics(storeId: string, startDate?: string, endDate?: string): Promise<AnalyticsMetrics> {
    const pool = await getPool();

    const startDateFilter = startDate ?? '1970-01-01';
    const endDateFilter = endDate ?? '2099-12-31';

    // @ts-ignore - Slonik sql tag typing issue
    const result = await pool.maybeOne(sql`
      SELECT
        COUNT(DISTINCT o.order_id)::integer as total_orders,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) as total_revenue,
        CASE
          WHEN COUNT(DISTINCT o.order_id) > 0 THEN (COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) / COUNT(DISTINCT o.order_id))::numeric(10,2)
          ELSE 0
        END as average_order_value,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.order_id END)::integer as completed_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.order_id END)::integer as cancelled_orders,
        COUNT(DISTINCT CASE WHEN o.status IN ('open', 'accepted', 'picked_up') THEN o.order_id END)::integer as pending_orders
      FROM "order" o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.store_id = ${storeId}
        AND DATE(o.created_at) >= ${startDateFilter}
        AND DATE(o.created_at) <= ${endDateFilter}
    `);

    return {
      // @ts-ignore
      total_orders: (result?.total_orders as number) ?? 0,
      // @ts-ignore
      total_revenue: String((result?.total_revenue as number) ?? 0),
      // @ts-ignore
      average_order_value: String((result?.average_order_value as number) ?? 0),
      // @ts-ignore
      completed_orders: (result?.completed_orders as number) ?? 0,
      // @ts-ignore
      cancelled_orders: (result?.cancelled_orders as number) ?? 0,
      // @ts-ignore
      pending_orders: (result?.pending_orders as number) ?? 0,
    };
  }

  async getTopItems(storeId: string, limit: number = 10, startDate?: string, endDate?: string): Promise<TopItems> {
    const pool = await getPool();

    const startDateFilter = startDate ?? '1970-01-01';
    const endDateFilter = endDate ?? '2099-12-31';

    // @ts-ignore - Slonik sql tag typing issue
    const rows = await pool.any(sql`
      SELECT
        si.store_item_id,
        si.name,
        SUM(oi.quantity)::integer as total_quantity_sold,
        SUM(oi.price_snapshot * oi.quantity) as total_revenue,
        COUNT(DISTINCT oi.order_id)::integer as order_count
      FROM store_item si
      LEFT JOIN order_item oi ON si.store_item_id = oi.store_item_id
      LEFT JOIN "order" o ON oi.order_id = o.order_id
      WHERE si.store_id = ${storeId}
        AND (o.order_id IS NULL OR (DATE(o.created_at) >= ${startDateFilter} AND DATE(o.created_at) <= ${endDateFilter}))
      GROUP BY si.store_item_id, si.name
      ORDER BY total_quantity_sold DESC NULLS LAST
      LIMIT ${limit}
    `);

    return rows.map((row: any) => ({
      store_item_id: row.store_item_id,
      name: row.name,
      total_quantity_sold: String(row.total_quantity_sold ?? 0),
      total_revenue: String(row.total_revenue ?? 0),
      order_count: row.order_count ?? 0,
    }));
  }

  async getOrderStatusBreakdown(storeId: string, startDate?: string, endDate?: string): Promise<OrderStatusBreakdown> {
    const pool = await getPool();

    const startDateFilter = startDate ?? '1970-01-01';
    const endDateFilter = endDate ?? '2099-12-31';

    // @ts-ignore - Slonik sql tag typing issue
    const result = await pool.maybeOne(sql`
      SELECT
        COUNT(CASE WHEN status = 'open' THEN 1 END)::integer as open,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END)::integer as accepted,
        COUNT(CASE WHEN status = 'picked_up' THEN 1 END)::integer as picked_up,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END)::integer as delivered,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::integer as cancelled
      FROM "order"
      WHERE store_id = ${storeId}
        AND DATE(created_at) >= ${startDateFilter}
        AND DATE(created_at) <= ${endDateFilter}
    `);

    return {
      // @ts-ignore
      open: (result?.open as number) ?? 0,
      // @ts-ignore
      accepted: (result?.accepted as number) ?? 0,
      // @ts-ignore
      picked_up: (result?.picked_up as number) ?? 0,
      // @ts-ignore
      delivered: (result?.delivered as number) ?? 0,
      // @ts-ignore
      cancelled: (result?.cancelled as number) ?? 0,
    };
  }

  async getDailyMetrics(storeId: string, days: number = 30, startDate?: string, endDate?: string): Promise<DailyMetrics> {
    const pool = await getPool();

    const startDateFilter = startDate ?? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDateFilter = endDate ?? new Date().toISOString().split('T')[0];

    // @ts-ignore - Slonik sql tag typing issue
    const rows = await pool.any(sql`
      SELECT
        DATE(o.created_at)::text as date,
        COUNT(DISTINCT o.order_id)::integer as order_count,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0)::numeric as revenue,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.order_id END)::integer as completed_count
      FROM "order" o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.store_id = ${storeId}
        AND DATE(o.created_at) >= ${startDateFilter}
        AND DATE(o.created_at) <= ${endDateFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY DATE(o.created_at) DESC
    `);

    return rows.map((row: any) => ({
      date: row.date,
      order_count: row.order_count,
      revenue: String(row.revenue),
      completed_count: row.completed_count,
    }));
  }
}





