import { Spinner } from '@/shared/components/ui/spinner';
import { useDeliveries } from '../hooks/use-deliveries';
import { OrderCard } from '../../orders/component/OrderCard';

export function DeliveriesHistoryPage() {
  const { data: deliveries, isPending } = useDeliveries();
  const deliveryList = Array.isArray(deliveries) ? deliveries : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
          Delivery History
        </h1>
        <p className="text-sm text-muted-foreground">
          Review past and current delivery records in one place.
        </p>
      </div>

      {isPending ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-4xl border bg-card">
          <Spinner className="size-5 text-primary" />
        </div>
      ) : deliveryList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deliveryList.map((delivery) => (
            <OrderCard
              key={delivery.order_id}
              mode="rider"
              muted
              order={{
                id: delivery.order_id,
                title: delivery.store_name,
                status: delivery.status,
                referenceLabel: 'Delivery',
                referenceValue: delivery.order_id.slice(0, 8),
                dropoffLocation: delivery.delivery_address,
                totalPrice: delivery.total_price,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-dashed bg-card px-6 py-12 text-center text-muted-foreground">
          No delivery records found.
        </div>
      )}
    </div>
  );
}
