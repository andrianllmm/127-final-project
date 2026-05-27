import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '@repo/api';

import { useOrders } from '../hooks/use-orders';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { Button } from '@/shared/components/ui/button';
import { OrderCard } from '../component/OrderCard';

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
              <OrderCard
                key={order.order_id}
                mode="customer"
                muted={muted}
                order={{
                  id: order.order_id,
                  title: order.store_name,
                  status: order.status,
                  referenceLabel: 'Order',
                  referenceValue: order.order_id.slice(0, 8),
                  paymentMethod: order.payment_method,
                  deliveryAddress: order.delivery_address,
                  totalPrice: order.total_price,
                }}
              />
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

  const activeOrders = orderList.filter((order) =>
    ['open', 'accepted', 'picked_up'].includes(order.status),
  );

  const orderHistory = orderList.filter((order) =>
    ['delivered', 'cancelled'].includes(order.status),
  );

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
            showMoreLabel={
              activeOrders.length > activeLimit ? 'Show More Active Orders' : undefined
            }
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
