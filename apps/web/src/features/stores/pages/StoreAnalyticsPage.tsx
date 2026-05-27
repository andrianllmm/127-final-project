import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authClient } from '@/shared/lib/authClient';
import { currencyFormatter } from '@/shared/lib/currencyFormatter';
import { Spinner } from '@/shared/components/ui/spinner';
import { useStoreByUser } from '../hooks/use-store-by-user';
import { useStoreAnalytics } from '../hooks/use-store-analytics';
import { AnalyticsQuery } from '@repo/api';
import { MetricCard } from '../components/analytics/MetricCard';
import { DateRangePicker } from '../components/analytics/DateRangePicker';
import { TopItemsTable } from '../components/analytics/TopItemsTable';
import { OrderStatusBreakdownCard } from '../components/analytics/OrderStatusBreakdownCard';
import { DailyMetricsChart } from '../components/analytics/DailyMetricsChart';

export function StoreAnalyticsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  const { data: store, isPending: isStorePending } = useStoreByUser(userId);
  const [analyticsQuery, setAnalyticsQuery] = useState<AnalyticsQuery>({ limit: 10 });

  const storeId = store?.store_id ?? '';

  const { data: analyticsData, isPending: isAnalyticsPending } = useStoreAnalytics(
    storeId,
    analyticsQuery,
  );

  if (isSessionPending || isStorePending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session || session.user.role !== 'vendor') {
    return <Navigate to="/stores" replace />;
  }

  if (!store) {
    return <Navigate to="/stores/new" replace />;
  }

  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    setAnalyticsQuery((current) => ({
      ...current,
      startDate,
      endDate,
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
          {store.store_name}'s Analytics
        </h1>
        <p className="text-muted-foreground">Track your store performance and insights.</p>
      </div>

      <DateRangePicker
        value={{ startDate: analyticsQuery.startDate, endDate: analyticsQuery.endDate }}
        onRangeChange={handleDateRangeChange}
        isLoading={isAnalyticsPending}
      />

      {isAnalyticsPending ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      ) : analyticsData ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Orders"
              value={analyticsData.metrics.total_orders}
              description="All orders in selected period"
            />
            <MetricCard
              title="Total Revenue"
              value={currencyFormatter.format(Number(analyticsData.metrics.total_revenue) || 0)}
              description="Total sales revenue"
            />
            <MetricCard
              title="Avg Order Value"
              value={currencyFormatter.format(
                Number(analyticsData.metrics.average_order_value) || 0,
              )}
              description="Average per order"
            />
            <MetricCard
              title="Completed Orders"
              value={analyticsData.metrics.completed_orders}
              description="Delivered orders"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderStatusBreakdownCard data={analyticsData.order_status_breakdown} />
            <DailyMetricsChart data={analyticsData.daily_metrics} />
          </div>

          <TopItemsTable items={analyticsData.top_items} />
        </>
      ) : (
        <div className="flex justify-center rounded-lg border border-border py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No analytics data available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Place some orders to see analytics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
