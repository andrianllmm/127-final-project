import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '@repo/api';

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

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'open': return 'bg-yellow-100 text-yellow-800';
    case 'accepted': return 'bg-blue-100 text-blue-800';
    case 'picked_up': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-muted text-foreground';
  }
}

function OrderCard({ order, muted = false }: { order: Order; muted?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${muted ? 'bg-muted/10' : 'bg-background'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold">{order.store_name}</h3>
          <p className="text-sm text-muted-foreground">Order #{order.order_id.slice(0, 8)}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
            order.status,
          )}`}
        >
          {formatStatus(order.status)}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-6">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Payment: {order.payment_method.toUpperCase()}</p>
          <p>Deliver to: {order.delivery_address || 'Address not provided'}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatCurrency(order.total_price)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button asChild variant="outline" size="sm">
          <Link to={`/orders/${order.order_id}`}>
            {order.status === 'open' ? 'View Order' : 'View Details'}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function OrderSection({
  title,
  description,
  orders,
  emptyMessage,
  muted = false,
  showMoreLabel,
  onShowMore,
}: {
  title: string;
  description: string;
  orders: Order[];
  emptyMessage: string;
  muted?: boolean;
  showMoreLabel?: string | undefined;
  onShowMore?: (() => void) | undefined;
}) {
  return (
    <Card className="border-muted/80">
      <CardHeader>
        <CardTitle className="font-heading text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        {orders.length ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.order_id} order={order} muted={muted} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}

        {onShowMore && showMoreLabel && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={onShowMore}>
              {showMoreLabel}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OrderListPage() {
  const { data: orders, isPending } = useOrders();
  const [activeLimit, setActiveLimit] = useState(3);
  const [historyLimit, setHistoryLimit] = useState(3);
  

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const orderList = orders ?? [];

  const activeOrders =
    orderList.filter((order) => ['open', 'accepted', 'picked_up'].includes(order.status));

  const orderHistory =
    orderList.filter((order) => ['delivered', 'cancelled'].includes(order.status));

  const visibleActiveOrders = activeOrders.slice(0, activeLimit);
  const visibleOrderHistory = orderHistory.slice(0, historyLimit);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          Track active deliveries and review past orders.
        </p>
      </div>

      {activeOrders.length || orderHistory.length ? (
        <div className="grid gap-6">
          <OrderSection
            title="Active Orders"
            description="Orders currently waiting for rider acceptance or delivery completion."
            orders={visibleActiveOrders}
            emptyMessage="No active orders right now."
            showMoreLabel={activeOrders.length > activeLimit ? 'Show More Active Orders' : undefined}
            onShowMore={
              activeOrders.length > activeLimit
                ? () => setActiveLimit((limit) => limit + 3)
                : undefined
            }
          />

          <OrderSection
            title="Order History"
            description="Delivered and cancelled orders are listed here."
            orders={visibleOrderHistory}
            emptyMessage="No past orders yet."
            muted
            showMoreLabel={
              orderHistory.length > historyLimit ? 'Show More Order History' : undefined
            }
            onShowMore={
              orderHistory.length > historyLimit
                ? () => setHistoryLimit((limit) => limit + 3)
                : undefined
            }
          />
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