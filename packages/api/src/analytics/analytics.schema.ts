import { z } from 'zod';

export const analyticsMetricsSchema = z.object({
  total_orders: z.number().int().nonnegative(),
  total_revenue: z.string(), // Stored as numeric in DB
  average_order_value: z.string(),
  completed_orders: z.number().int().nonnegative(),
});

export type AnalyticsMetrics = z.infer<typeof analyticsMetricsSchema>;

export const topItemsSchema = z.array(
  z.object({
    store_item_id: z.string(),
    name: z.string(),
    total_quantity_sold: z.number().int().nonnegative(),
    total_revenue: z.string(),
    order_count: z.number().int(),
  }),
);

export type TopItems = z.infer<typeof topItemsSchema>;

export const orderStatusBreakdownSchema = z.object({
  open: z.number().int().nonnegative(),
  accepted: z.number().int().nonnegative(),
  picked_up: z.number().int().nonnegative(),
  delivered: z.number().int().nonnegative(),
  cancelled: z.number().int().nonnegative(),
});

export type OrderStatusBreakdown = z.infer<typeof orderStatusBreakdownSchema>;

export const dailyMetricsSchema = z.array(
  z.object({
    date: z.string(),
    order_count: z.number().int(),
    revenue: z.string(),
    completed_count: z.number().int(),
  }),
);

export type DailyMetrics = z.infer<typeof dailyMetricsSchema>;

export const analyticsResponseSchema = z.object({
  metrics: analyticsMetricsSchema,
  top_items: topItemsSchema,
  order_status_breakdown: orderStatusBreakdownSchema,
  daily_metrics: dailyMetricsSchema,
});

export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;

export const analyticsStoreParamsSchema = z.object({
  storeId: z.uuid(),
});

export type AnalyticsStoreParams = z.infer<typeof analyticsStoreParamsSchema>;

export const analyticsQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  limit: z.coerce.number().int().positive().default(10),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
