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
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-4 md:p-6 text-gray-900"
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
                <div className="mt-4 md:mt-6">
                  <h2 className="text-lg font-medium">{order.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {order.category}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Origin: {order.originCountry}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Destination: {order.destinationCountry}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Arrival Date:{" "}
                    {order.arrivalDate
                      ? new Date(order.arrivalDate).toLocaleDateString()
                      : "Order Hasn't Been Accepted Yet"}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Deliverer Whatsapp Number:{" "}
                    {order.contactNumber
                      ? order.contactNumber
                      : "Order Hasn't Been Accepted Yet"}
                  </p>

                  <p className="text-sm mb-4">
                    <strong>Description: </strong>
                    {order.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">
                      Price: {order.price} SDG
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
