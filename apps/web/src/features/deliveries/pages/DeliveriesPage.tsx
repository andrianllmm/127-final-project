import { toast } from 'sonner';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';
import { useActiveDeliveries } from '../hooks/use-active-deliveries';
import { useUpdateDeliveryStatus } from '../hooks/use-update-delivery-status';

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
        <Badge variant="secondary" className="w-fit">
          Live deliveries
        </Badge>
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
            <Card
              key={delivery.id}
              className="gap-0 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardHeader className="gap-2 border-b border-border/60 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{delivery.vendorName}</CardTitle>
                  <Badge variant={delivery.status === 'picked_up' ? 'default' : 'secondary'}>
                    {delivery.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription>{delivery.dropoffLocation}</CardDescription>
              </CardHeader>

              <CardContent className="py-4 text-sm text-muted-foreground">
                {delivery.status === 'accepted'
                  ? 'Mark the order once you have picked it up from the store.'
                  : 'Confirm completion after you hand the order to the customer.'}
              </CardContent>

              <CardFooter>
                {delivery.status === 'accepted' ? (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus(delivery.id, 'picked_up')}
                  >
                    Mark as picked up
                  </Button>
                ) : delivery.status === 'picked_up' ? (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus(delivery.id, 'delivered')}
                  >
                    Mark as delivered
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Completed
                  </Button>
                )}
              </CardFooter>
            </Card>
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
