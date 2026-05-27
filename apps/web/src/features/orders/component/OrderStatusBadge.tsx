import type { OrderStatus } from '@repo/api';

import { Badge } from '@/shared/components/ui/badge';

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  accepted: 'Accepted',
  picked_up: 'Picked Up',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusVariants: Record<OrderStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'outline',
  open: 'outline',
  accepted: 'secondary',
  picked_up: 'default',
  delivered: 'default',
  cancelled: 'destructive',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={className}>
      {statusLabels[status]}
    </Badge>
  );
}
