import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useActiveDeliveries } from '../hooks/use-active-deliveries';
import { useUpdateDeliveryStatus } from '../hooks/use-update-delivery-status';
import { OrderCard } from '../../orders/component/OrderCard';
import { OrderActionDialog } from '../../orders/component/OrderActionDialog';

export function DeliveriesPage() {
  const { data: activeDeliveries, isPending } = useActiveDeliveries();
  const updateDeliveryStatus = useUpdateDeliveryStatus();

  const handleUpdateStatus = async (id: string, status: 'picked_up' | 'delivered' | 'open') => {
    try {
      await updateDeliveryStatus.mutateAsync({ id, input: { status } });

      if (status === 'picked_up') {
        toast.success('Delivery marked as picked up');
        return;
      }

      if (status === 'delivered') {
        toast.success('Delivery marked as delivered');
        return;
      }

      toast.success('Delivery aborted');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update delivery status');
    }
  };

  const active = Array.isArray(activeDeliveries) ? activeDeliveries : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold text-primary-foreground">
          Active Deliveries
        </h1>
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
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => handleUpdateStatus(delivery.order_id, 'picked_up')}
                    >
                      Mark as picked up
                    </Button>

                    <OrderActionDialog
                      triggerLabel="Abort"
                      title="Abort delivery?"
                      description="This will return the order to open status and cannot be undone."
                      confirmLabel="Abort Delivery"
                      pendingLabel="Aborting..."
                      isPending={updateDeliveryStatus.isPending}
                      triggerClassName="border-red-500 text-red-600 hover:bg-red-50"
                      onConfirm={() => handleUpdateStatus(delivery.order_id, 'open')}
                    />
                  </>
                ) : delivery.status === 'picked_up' ? (
                  <Button
                    className="flex-1"
                    onClick={() => handleUpdateStatus(delivery.order_id, 'delivered')}
                  >
                    Mark as delivered
                  </Button>
                ) : (
                  <Button className="flex-1" variant="outline" disabled>
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
