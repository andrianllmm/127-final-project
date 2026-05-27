import { useState, useEffect } from 'react';

export function ActiveDeliveriesPage() {
  const [active, setActive] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/deliveries/active')
      .then((res) => res.json())
      .then((data) => setActive(data))
      .catch((err) => {
        console.error('Error:', err);
        setActive([]);
      });
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/deliveries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        window.location.reload(); // Refresh the page to show the updated status
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (active === null) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Active Deliveries</h1>
      {Array.isArray(active) && active.length > 0 ? (
        active.map((delivery) => (
          <div key={delivery.id} className="border p-4 rounded mb-4 shadow-sm">
            <h3 className="font-bold text-lg">{delivery?.vendorName || 'Unknown Vendor'}</h3>
            <p className="text-gray-600">Dropoff: {delivery?.dropoffLocation || 'N/A'}</p>
            <span className="text-sm font-semibold text-green-600 block mb-2">
              Status: {delivery?.status || 'N/A'}
            </span>

            {delivery?.status === 'accepted' && (
              <button
                onClick={() => handleUpdateStatus(delivery.id, 'picked_up')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Mark as Picked Up
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No active deliveries found.</p>
      )}
    </div>
  );
}
