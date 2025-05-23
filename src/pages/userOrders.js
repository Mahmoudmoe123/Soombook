import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/getUserOrders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Orders</h1>
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-700 rounded-lg">
            <p className="text-xl">No orders available yet</p>
            <p className="text-gray-400 mt-2">
              Your ordered items will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 bg-gray-100">
                  <Image
                    src={order.imageUrl}
                    alt={order.title}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                    className="p-2"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {order.title}
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Category:</span>
                      <span>{order.category}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Origin:</span>
                      <span>{order.originCountry}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Destination:</span>
                      <span>{order.destinationCountry}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Arrival:</span>
                      <span>
                        {order.arrivalDate
                          ? new Date(order.arrivalDate).toLocaleDateString()
                          : "Pending acceptance"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Contact:</span>
                      <span>{order.contactNumber || "Pending acceptance"}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Description: </span>
                      {order.description}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-lg font-bold text-blue-600">
                      {order.price} SDG
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
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
