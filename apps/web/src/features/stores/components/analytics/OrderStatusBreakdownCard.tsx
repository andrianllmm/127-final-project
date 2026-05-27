import { Card } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { OrderStatusBreakdown } from '@repo/api';

interface OrderStatusBreakdownProps {
  data: OrderStatusBreakdown;
  isLoading?: boolean;
}

const statusConfig = {
  open: { label: 'Open' },
  accepted: { label: 'Accepted' },
  picked_up: { label: 'Picked up' },
  delivered: { label: 'Delivered' },
  cancelled: { label: 'Cancelled' },
};

export function OrderStatusBreakdownCard({ data, isLoading = false }: OrderStatusBreakdownProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6">
      <div className="mb-5 space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Order Status Breakdown
        </h3>
        <p className="text-sm text-muted-foreground">Share of orders across each workflow stage.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : total === 0 ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">No orders yet</div>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = data[key as keyof OrderStatusBreakdown];
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">{config.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {count.toLocaleString()} ({percentage}%)
                  </span>
                </div>
                <Progress value={Number(percentage)} className="h-2" />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
