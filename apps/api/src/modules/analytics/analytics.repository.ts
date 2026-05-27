import { sql } from 'slonik';
import { getPool } from '../../db/pool.js';
import {
  AnalyticsMetrics,
  analyticsMetricsSchema,
  topItemsSchema,
  TopItems,
  orderStatusBreakdownSchema,
  OrderStatusBreakdown,
  dailyMetricsSchema,
  DailyMetrics,
} from '@repo/api';

const DEFAULT_START_DATE = '1970-01-01';
const DEFAULT_END_DATE = '2099-12-31';

function buildDateFilters(startDate?: string, endDate?: string) {
  return {
    startDateFilter: startDate ?? DEFAULT_START_DATE,
    endDateFilter: endDate ?? DEFAULT_END_DATE,
  };
}

function formatDate(date: Date) {
  const [datePart] = date.toISOString().split('T');
  return datePart ?? DEFAULT_START_DATE;
}

export class AnalyticsRepository {
  async getMetrics(
    storeId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<AnalyticsMetrics> {
    const pool = await getPool();

    const { startDateFilter, endDateFilter } = buildDateFilters(startDate, endDate);

    const result = await pool.maybeOne(sql.type(analyticsMetricsSchema)`
      SELECT
        COUNT(DISTINCT o.order_id)::integer as total_orders,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) as total_revenue,
        CASE
          WHEN COUNT(DISTINCT o.order_id) > 0 THEN (COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) / COUNT(DISTINCT o.order_id))::numeric(10,2)
          ELSE 0
        END as average_order_value,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.order_id END)::integer as completed_orders
      FROM "order" o
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      WHERE o.store_id = ${storeId}
        AND DATE(o.created_at) >= ${startDateFilter}
        AND DATE(o.created_at) <= ${endDateFilter}
    `);

    return (
      result ?? {
        total_orders: 0,
        total_revenue: '0',
        average_order_value: '0',
        completed_orders: 0,
      }
    );
  }

  async getTopItems(
    storeId: string,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
  ): Promise<TopItems> {
    const pool = await getPool();

    const { startDateFilter, endDateFilter } = buildDateFilters(startDate, endDate);

    const rows = await pool.any(sql.type(topItemsSchema.element)`
      SELECT
        si.store_item_id,
        si.name,
        COALESCE(SUM(oi.quantity), 0)::integer as total_quantity_sold,
        COALESCE(SUM(oi.price_snapshot * oi.quantity), 0) as total_revenue,
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

    return rows.map((row) => ({
      store_item_id: row.store_item_id,
      name: row.name,
      total_quantity_sold: row.total_quantity_sold,
      total_revenue: row.total_revenue,
      order_count: row.order_count,
    }));
  }

  async getOrderStatusBreakdown(
    storeId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<OrderStatusBreakdown> {
    const pool = await getPool();

    const { startDateFilter, endDateFilter } = buildDateFilters(startDate, endDate);

    const result = await pool.maybeOne(sql.type(orderStatusBreakdownSchema)`
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

    return (
      result ?? {
        open: 0,
        accepted: 0,
        picked_up: 0,
        delivered: 0,
        cancelled: 0,
      }
    );
  }

  async getDailyMetrics(
    storeId: string,
    days: number = 30,
    startDate?: string,
    endDate?: string,
  ): Promise<DailyMetrics> {
    const pool = await getPool();

    const defaultStartDate = formatDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
    const defaultEndDate = formatDate(new Date());

    const startDateFilter: string = startDate ?? defaultStartDate;
    const endDateFilter: string = endDate ?? defaultEndDate;

    const rows = await pool.any(sql.type(dailyMetricsSchema.element)`
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

    return rows.map((row) => ({
      date: row.date,
      order_count: row.order_count,
      revenue: row.revenue,
      completed_count: row.completed_count,
    }));
  }
}
