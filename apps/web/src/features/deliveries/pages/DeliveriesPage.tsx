import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useActiveDeliveries } from '../hooks/use-active-deliveries';
import { useUpdateDeliveryStatus } from '../hooks/use-update-delivery-status';
import { OrderCard } from '../../orders/component/OrderCard';

export function DeliveriesPage() {
  const { data: activeDeliveries, isPending } = useActiveDeliveries();
  const updateDeliveryStatus = useUpdateDeliveryStatus();

  const handleUpdateStatus = async (id: string, status: 'picked_up' | 'delivered') => {
    try {
      await updateDeliveryStatus.mutateAsync({ id, input: { status } });

      if (status === 'picked_up') {
        toast.success('Delivery marked as picked up');
        return;
      }

      toast.success('Delivery marked as delivered');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update delivery status');
    }
  };

  const active = Array.isArray(activeDeliveries) ? activeDeliveries : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="space-y-2">
        <div className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Live deliveries
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Active deliveries</h1>
        <p className="text-sm text-muted-foreground">
          Keep track of accepted orders that are ready for pickup or already in transit.
        </p>
      </div>

      {isPending ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-4xl border bg-card">
          <Spinner className="size-5 text-primary" />
        </div>
      ) : active.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {active.map((delivery) => (
            <OrderCard
              key={delivery.order_id}
              mode="rider"
              order={{
                id: delivery.order_id,
                title: delivery.store_name,
                status: delivery.status,
                referenceLabel: 'Delivery',
                referenceValue: delivery.order_id.slice(0, 8),
                dropoffLocation: delivery.delivery_address,
              }}
              action={
                delivery.status === 'accepted' ? (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus(delivery.order_id, 'picked_up')}
                  >
                    Mark as picked up
                  </Button>
                ) : delivery.status === 'picked_up' ? (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus(delivery.order_id, 'delivered')}
                  >
                    Mark as delivered
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Completed
                  </Button>
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-dashed bg-card px-6 py-12 text-center text-muted-foreground">
          No active deliveries found.
        </div>
      )}
    </div>
  );
}
