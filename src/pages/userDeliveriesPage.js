import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function UserDeliveriesPage() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchTrips() {
      const res = await fetch("/api/returnTripsHeader");
      const data = await res.json();
      setTrips(data);
    }
    fetchTrips();
  }, []);

  async function fetchOrders(tripId) {
    const res = await fetch(`/api/getDeliveries?tripId=${tripId}`);
    const data = await res.json();
    setOrders(data);
  }

  function handleTripClick(tripId) {
    setSelectedTrip(tripId);
    fetchOrders(tripId);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip, index) => (
            <div
              key={index}
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
              Orders for Trip ID: {selectedTrip}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                     <div className="relative h-52 md:h-60 lg:h-64">
                <Image
                  src={order.imageUrl}
                  alt={order.title}
                  layout="fill"
                  objectFit="contain"
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
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDeliveriesPage;
