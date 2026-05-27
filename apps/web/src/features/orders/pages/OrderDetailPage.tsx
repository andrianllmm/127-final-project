import { Navigate, useParams } from 'react-router-dom';

import { useOrder } from '../hooks/use-order';
import { useCancelOrder } from '../hooks/use-cancel-order';

import { currencyFormatter } from '@/shared/lib/currencyFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { OrderActionDialog } from '../component/OrderActionDialog';
import { Spinner } from '@/shared/components/ui/spinner';
import { toast } from 'sonner';
import { OrderStatusBadge } from '../component/OrderStatusBadge';

export function OrderDetailPage() {
  const { id = '' } = useParams();
  const { data: order, isPending } = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Order Details</h1>
          <p className="text-sm text-muted-foreground">Order #{order.order_id.slice(0, 8)}</p>
        </div>

        <div className="flex gap-2">
          {order.status === 'open' && (
            <OrderActionDialog
              triggerLabel="Cancel Order"
              title="Cancel order?"
              description="This will cancel the order. This action cannot be undone."
              confirmLabel="Cancel Order"
              pendingLabel="Cancelling..."
              isPending={cancelOrder.isPending}
              triggerClassName="border-red-500 text-red-600 hover:bg-red-50"
              onConfirm={() =>
                cancelOrder.mutate(order.order_id, {
                  onSuccess: () => {
                    toast.success('Order cancelled successfully.');
                  },
                })
              }
            />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{order.store_name}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
              <OrderStatusBadge status={order.status} className="mt-2" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment</p>
              <p className="font-semibold">{order.payment_method.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Delivery Address
              </p>
              <p className="font-semibold">{order.delivery_address}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{currencyFormatter.format(order.total_price)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordered Items</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.order_item_id}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x {currencyFormatter.format(item.price_snapshot)}
                </p>
              </div>

              <p className="font-semibold">{currencyFormatter.format(item.subtotal)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
