import { useState, useEffect } from 'react';

interface Offer {
  id: string;
  vendorName: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  itemCount: number;
}

export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/deliveries/offers')
      .then((res) => res.json())
      .then((data) => {
        setOffers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch:', err);
        setIsLoading(false);
      });
  }, []);

  const handleAcceptDelivery = async (orderId: string) => {
    console.log('Accepting order:', orderId);
  };

  return (
    <div className="flex flex-col p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#893302] mb-8">Available Deliveries</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : offers.length === 0 ? (
          <div className="text-gray-500">No open deliveries available right now.</div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#893302]">{offer.vendorName}</h3>
              <p className="text-sm text-gray-500 mb-4">{offer.pickupLocation}</p>
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-sm text-gray-600 font-semibold">
                  Dropoff: {offer.dropoffLocation}
                </p>
                <p className="text-[#893302] font-bold">
                  Total: ₱{Number(offer.totalPrice).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleAcceptDelivery(offer.id)}
                className="w-full bg-[#FBC107] text-[#893302] font-bold py-3 rounded-full"
              >
                Accept Delivery
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
