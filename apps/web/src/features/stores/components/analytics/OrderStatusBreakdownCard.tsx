import { Card } from '@/shared/components/ui/card';
import { OrderStatusBreakdown } from '@repo/api';

interface OrderStatusBreakdownProps {
  data: OrderStatusBreakdown;
  isLoading?: boolean;
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-blue-100', textColor: 'text-blue-900' },
  accepted: { label: 'Accepted', color: 'bg-yellow-100', textColor: 'text-yellow-900' },
  picked_up: { label: 'Picked Up', color: 'bg-purple-100', textColor: 'text-purple-900' },
  delivered: { label: 'Delivered', color: 'bg-green-100', textColor: 'text-green-900' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100', textColor: 'text-red-900' },
};

export function OrderStatusBreakdownCard({ data, isLoading = false }: OrderStatusBreakdownProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Order Status Breakdown</h3>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      ) : total === 0 ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-gray-500">No orders yet</div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = data[key as keyof OrderStatusBreakdown];
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';

            return (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${config.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
