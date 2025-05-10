import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function UserDeliveriesPage() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch("/api/returnTripsHeader");
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTrips();
  }, []);

  async function fetchOrders(tripId) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/getDeliveries?tripId=${tripId}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleTripClick(tripId) {
    setSelectedTrip(tripId);
    fetchOrders(tripId);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">
                {trip.originCountry} - {trip.destinationCountry}
              </h2>

              <p className="text-gray-600">
                Departure: {new Date(trip.departureDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Arrival: {new Date(trip.arrivalDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {selectedTrip && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">
              Orders for {trips.find(trip => trip.id === selectedTrip)?.originCountry} - {trips.find(trip => trip.id === selectedTrip)?.destinationCountry}
            </h3>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders available for this trip.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <div className="relative h-52 md:h-60 lg:h-64">
                      <Image
                        src={order.imageUrl}
                        alt={order.title}
                        fill
                        style={{
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{order.title}</h4>
                    <p className="text-gray-600">Price: {order.price}</p>
                    <p className="text-gray-600">
                      Description: {order.description}
                    </p>
                    <p className="text-gray-600">Category: {order.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDeliveriesPage;
