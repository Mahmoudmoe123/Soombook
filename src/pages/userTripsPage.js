import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function UserOrders() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/returnTripsHeader");
      const data = await res.json();
      setTrips(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Trips</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-sm p-4 md:p-6 text-gray-900"
            >
              <div className="relative h-52 md:h-60 lg:h-64"></div>
              <div className="mt-4 md:mt-6">
                <p className="text-sm text-gray-500 mb-2">
                  Origin: {trip.originCountry}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Destination: {trip.destinationCountry}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Departure Date: {new Date(trip.departureDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Arrival Date: {new Date(trip.arrivalDate).toLocaleDateString()}
                </p>

                <div className="flex justify-between items-center"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserOrders;
