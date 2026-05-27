import { Badge } from '@/shared/components/ui/badge';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useDeliveries } from '../hooks/use-deliveries';

function statusVariant(status: string) {
  if (status === 'delivered') return 'default';
  if (status === 'cancelled') return 'destructive';
  return 'secondary';
}

export function DeliveriesHistoryPage() {
  const { data: deliveries, isPending } = useDeliveries();
  const deliveryList = Array.isArray(deliveries) ? deliveries : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="w-fit">
          Delivery archive
        </Badge>
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
            <Card
              key={delivery.id}
              className="gap-0 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardHeader className="gap-2 border-b border-border/60 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{delivery.vendorName}</CardTitle>
                  <Badge variant={statusVariant(delivery.status)}>
                    {delivery.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription>{delivery.dropoffLocation}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 py-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Pickup</span>
                  <span className="font-medium text-foreground">{delivery.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-medium text-foreground">{delivery.itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-medium text-foreground">
                    ₱{Number(delivery.totalPrice).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
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
