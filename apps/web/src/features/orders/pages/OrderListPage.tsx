import { Link } from 'react-router-dom';

import { useOrders } from '../hooks/use-orders';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
}

function formatStatus(status: string) {
  return status.replace('_', ' ').toUpperCase();
}

export function OrderListPage() {
  const { data: orders, isPending } = useOrders();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          View your current and past food delivery orders.
        </p>
      </div>

      {orders?.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.order_id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{order.store_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.order_id.slice(0, 8)}
                    </p>
                  </div>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {formatStatus(order.status)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                  <p>Payment: {order.payment_method.toUpperCase()}</p>
                  <p>Total: {formatCurrency(order.total_price)}</p>
                  <p className="md:col-span-2">Deliver to: {order.delivery_address}</p>
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link to={`/orders/${order.order_id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div>
              <h2 className="font-heading text-xl font-semibold">No orders yet</h2>
              <p className="text-sm text-muted-foreground">
                Browse stores and add items to start an order.
              </p>
            </div>

            <Button asChild>
              <Link to="/stores">Browse Stores</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}