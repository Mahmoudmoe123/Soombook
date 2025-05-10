import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function UserOrders() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/returnTripsHeader");
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Trips</h1>
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : trips.length === 0 ? (
          <p>No trips available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow-sm p-4 md:p-6 text-gray-900"
              >
                <div className="relative h-52 md:h-60 lg:h-64">
                  <Image
                    src="/sombook.png"
                    alt={`${trip.originCountry} to ${trip.destinationCountry}`}
                    fill
                    style={{
                      objectFit: 'contain'
                    }}
                  />
                </div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default UserOrders;
