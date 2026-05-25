import { Card } from '@/shared/components/ui/card';
import { DailyMetrics } from '@repo/api';

interface DailyMetricsChartProps {
  data: DailyMetrics;
  isLoading?: boolean;
}

export function DailyMetricsChart({ data, isLoading = false }: DailyMetricsChartProps) {
  const maxOrders = Math.max(...data.map(d => d.order_count), 1);

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Daily Order Trends (Last 30 Days)</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-gray-500">No data available</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-1 overflow-x-auto pb-4">
            {data.slice(0, 30).reverse().map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <div className="flex h-32 items-end justify-center">
                  <div
                    className="w-8 rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                    style={{
                      height: `${Math.max((day.order_count / maxOrders) * 120, 4)}px`,
                    }}
                    title={`${day.date}: ${day.order_count} orders`}
                  />
                </div>
                <span className="text-xs text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Total Orders</p>
                <p className="text-lg font-semibold text-gray-900">{data.reduce((sum, d) => sum + d.order_count, 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Avg Orders/Day</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data.length > 0 ? (data.reduce((sum, d) => sum + d.order_count, 0) / data.length).toFixed(1) : 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-lg font-semibold text-green-600">{data.reduce((sum, d) => sum + d.completed_count, 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
