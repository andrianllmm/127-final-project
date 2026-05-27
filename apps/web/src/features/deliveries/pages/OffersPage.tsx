import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useAcceptDelivery } from '../hooks/use-accept-delivery';
import { useDeliveryOffers } from '../hooks/use-delivery-offers';
import { OrderCard } from '../../orders/component/OrderCard';

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
        <div className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Rider queue
        </div>
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
            <OrderCard
              key={offer.id}
              mode="rider"
              order={{
                id: offer.id,
                title: offer.vendorName,
                status: 'open',
                referenceLabel: 'Offer',
                referenceValue: offer.id.slice(0, 8),
                pickupLocation: offer.pickupLocation,
                dropoffLocation: offer.dropoffLocation,
                totalPrice: offer.totalPrice,
                itemCount: offer.itemCount,
              }}
              action={
                <Button
                  className="w-full"
                  onClick={() => handleAcceptDelivery(offer.id)}
                  disabled={acceptDelivery.isPending}
                >
                  Accept delivery
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
