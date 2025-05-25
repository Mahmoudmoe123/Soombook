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
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Your Travel Journey
        </h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-xl text-gray-400">No trips booked yet</p>
            <p className="text-gray-500 mt-2">Time to plan your next adventure!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-6"
              >
                <div className="relative w-full aspect-[16/9] mb-4 rounded-lg overflow-hidden group">
                  <Image
                    src="/sombook.png"
                    alt={`${trip.originCountry} to ${trip.destinationCountry}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"/>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-400 text-sm">From</p>
                      <p className="text-white font-medium">{trip.originCountry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-400 text-sm">To</p>
                      <p className="text-white font-medium">{trip.destinationCountry}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-400">Departure</p>
                        <p className="text-white">{new Date(trip.departureDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Arrival</p>
                        <p className="text-white">{new Date(trip.arrivalDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
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
