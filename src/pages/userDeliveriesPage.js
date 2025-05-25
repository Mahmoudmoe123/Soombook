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
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Your Delivery Trips
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                selectedTrip === trip.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  <h2 className="text-xl font-semibold">
                    {trip.originCountry} → {trip.destinationCountry}
                  </h2>
                </div>
              </div>

              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Departure: {new Date(trip.departureDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Arrival: {new Date(trip.arrivalDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTrip && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Deliveries for {trips.find(trip => trip.id === selectedTrip)?.originCountry} → {trips.find(trip => trip.id === selectedTrip)?.destinationCountry}
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                <p className="text-xl text-gray-400">No deliveries available for this trip</p>
                <p className="text-gray-500 mt-2">Check back later for new delivery requests</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden group">
                      <Image
                        src={order.imageUrl}
                        alt={order.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"/>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold">{order.title}</h4>
                      <p className="text-gray-300">Price: ${order.price}</p>
                      <p className="text-gray-400 line-clamp-2">{order.description}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400">
                        {order.category}
                      </span>
                    </div>
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
