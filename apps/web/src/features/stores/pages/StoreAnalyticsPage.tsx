import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authClient } from '@/shared/lib/authClient';
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
  const [analyticsQuery, setAnalyticsQuery] = useState<AnalyticsQuery>({});

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
    setAnalyticsQuery({ ...analyticsQuery, startDate, endDate });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{store.store_name} Analytics</h1>
        <p className="mt-1 text-gray-600">Track your store performance and insights</p>
      </div>

      {/* Filter Section */}
      <DateRangePicker onRangeChange={handleDateRangeChange} isLoading={isAnalyticsPending} />

      {isAnalyticsPending ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      ) : analyticsData ? (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Orders"
              value={analyticsData.metrics.total_orders}
              description="All orders in selected period"
            />
            <MetricCard
              title="Total Revenue"
              value={`₱${parseFloat(analyticsData.metrics.total_revenue).toFixed(2)}`}
              description="Total sales revenue"
            />
            <MetricCard
              title="Avg Order Value"
              value={`₱${parseFloat(analyticsData.metrics.average_order_value).toFixed(2)}`}
              description="Average per order"
            />
            <MetricCard
              title="Completed Orders"
              value={analyticsData.metrics.completed_orders}
              description="Delivered orders"
            />
          </div>

          {/* Status and Daily Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <OrderStatusBreakdownCard data={analyticsData.order_status_breakdown} />
            <div className="lg:col-span-2">
              <DailyMetricsChart data={analyticsData.daily_metrics} />
            </div>
          </div>

          {/* Top Items */}
          <TopItemsTable items={analyticsData.top_items} />

          {/* Additional Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Cancelled Orders"
              value={analyticsData.metrics.cancelled_orders}
              description="Cancelled in period"
            />
            <MetricCard
              title="Pending Orders"
              value={analyticsData.metrics.pending_orders}
              description="Open or in transit"
            />
            <MetricCard
              title="Top Item"
              value={analyticsData.top_items[0]?.name ?? 'N/A'}
              description={`${analyticsData.top_items[0]?.total_quantity_sold ?? 0} sold`}
            />
          </div>
        </>
      ) : (
        <div className="flex justify-center rounded-lg border border-gray-200 py-12">
          <div className="text-center">
            <p className="text-gray-600">No analytics data available</p>
            <p className="mt-1 text-sm text-gray-500">Place some orders to see analytics</p>
          </div>
        </div>
      )}
    </div>
  );
}
