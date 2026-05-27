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
import { useAcceptDelivery } from '../hooks/use-accept-delivery';
import { useDeliveryOffers } from '../hooks/use-delivery-offers';

export function OffersPage() {
  const { data: offers, isPending } = useDeliveryOffers();
  const acceptDelivery = useAcceptDelivery();

  const handleAcceptDelivery = async (orderId: string) => {
    try {
      await acceptDelivery.mutateAsync(orderId);
      toast.success('Delivery accepted successfully');
    } catch (error) {
      console.error('Error accepting delivery:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const offerList = Array.isArray(offers) ? offers : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="w-fit">
          Rider queue
        </Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Available deliveries</h1>
        <p className="text-sm text-muted-foreground">
          Review open offers and claim one when you are ready to pick up.
        </p>
      </div>

      {isPending ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-4xl border bg-card">
          <Spinner className="size-5 text-primary" />
        </div>
      ) : offerList.length === 0 ? (
        <div className="rounded-4xl border border-dashed bg-card px-6 py-12 text-center text-muted-foreground">
          No open deliveries available right now.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {offerList.map((offer) => (
            <Card
              key={offer.id}
              className="gap-0 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardHeader className="gap-2 border-b border-border/60 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{offer.vendorName}</CardTitle>
                  <Badge variant="outline">Open</Badge>
                </div>
                <CardDescription>{offer.pickupLocation}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 py-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Dropoff</span>
                  <span className="font-medium text-foreground">{offer.dropoffLocation}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Items</span>
                  <span className="font-medium text-foreground">{offer.itemCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total</span>
                  <span className="font-semibold text-foreground">
                    ₱{Number(offer.totalPrice).toFixed(2)}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleAcceptDelivery(offer.id)}
                  disabled={acceptDelivery.isPending}
                >
                  Accept delivery
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
