import { Spinner } from '@/shared/components/ui/spinner';
import { useDeliveries } from '../hooks/use-deliveries';
import { OrderCard } from '../../orders/component/OrderCard';

export function DeliveriesHistoryPage() {
  const { data: deliveries, isPending } = useDeliveries();
  const deliveryList = Array.isArray(deliveries) ? deliveries : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="space-y-2">
        <div className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Delivery archive
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Delivery history</h1>
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
              key={delivery.id}
              mode="rider"
              muted
              order={{
                id: delivery.id,
                title: delivery.vendorName,
                status: delivery.status,
                referenceLabel: 'Delivery',
                referenceValue: delivery.id.slice(0, 8),
                pickupLocation: delivery.pickupLocation,
                dropoffLocation: delivery.dropoffLocation,
                totalPrice: delivery.totalPrice,
                itemCount: delivery.itemCount,
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
