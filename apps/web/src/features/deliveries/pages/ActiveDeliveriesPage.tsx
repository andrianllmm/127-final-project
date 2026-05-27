import { useState, useEffect } from 'react';

export function ActiveDeliveriesPage() {
  const [active, setActive] = useState<any[]>([]);

  useEffect(() => {
    // Replace the URL with your environment variable if configured
    fetch('http://localhost:3000/deliveries/active')
      .then((res) => res.json())
      .then((data) => setActive(data))
      .catch((err) => console.error('Error fetching active deliveries:', err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Active Deliveries</h1>
      {active.length === 0 ? (
        <p>No active deliveries found.</p>
      ) : (
        active.map((delivery) => (
          <div key={delivery.id} className="border p-4 rounded mb-4 shadow-sm">
            <h3 className="font-bold text-lg">{delivery.vendorName}</h3>
            <p className="text-gray-600">Dropoff: {delivery.dropoffLocation}</p>
            <span className="text-sm font-semibold text-green-600">{delivery.status}</span>
          </div>
        ))
      )}
    </div>
  );
}
