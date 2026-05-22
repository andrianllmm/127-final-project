import { Link, Navigate, useParams } from 'react-router-dom';

import { useOrder } from '../hooks/use-order';

import { Spinner } from '@/shared/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}

export function OrderDetailPage() {
  const { id = '' } = useParams();
  const { data: order, isPending } = useOrder(id);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Order Details</h1>
          <p className="text-sm text-muted-foreground">
            Order #{order.order_id.slice(0, 8)}
          </p>
        </div>

        <Button asChild variant="outline">
          <Link to="/orders">Back to Orders</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{order.store_name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Status: {order.status.toUpperCase()}</p>
          <p>Payment: {order.payment_method}</p>
          <p>Delivery Address: {order.delivery_address || 'To be provided at checkout'}</p>
          <p>Total: {formatCurrency(order.total_price)}</p>
        </CardContent>
      </Card>
    </div>
  );
}