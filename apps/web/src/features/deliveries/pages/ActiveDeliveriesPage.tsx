import { useState, useEffect } from 'react';

export function ActiveDeliveriesPage() {
  const [active, setActive] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/deliveries/active')
      .then((res) => res.json())
      .then((data) => setActive(data))
      .catch((err) => {
        console.error('Error:', err);
        setActive([]); // Set to empty array on error so it doesn't stay loading forever
      });
  }, []);

  if (active === null) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Active Deliveries</h1>
      {Array.isArray(active) && active.length > 0 ? (
        active.map((delivery) => (
          <div key={delivery.id} className="border p-4 rounded mb-4 shadow-sm">
            <h3 className="font-bold text-lg">{delivery?.vendorName || 'Unknown Vendor'}</h3>
            <p className="text-gray-600">Dropoff: {delivery?.dropoffLocation || 'N/A'}</p>
            <span className="text-sm font-semibold text-green-600">
              {delivery?.status || 'N/A'}
            </span>
          </div>
        ))
      ) : (
        <p>No active deliveries found.</p>
      )}
    </div>
  );
}
