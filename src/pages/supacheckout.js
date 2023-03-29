import Image from "next/image";
import { useSelector } from "react-redux";
import SupaCheckoutProduct from "../components/SupaCheckoutProduct";
import Header from "../components/Header";
import { selectItems, selectTotal } from "../slices/basketSlice";
import numeral from "numeral";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import supabase from "../lib/supabase";

function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function loadTrips() {
      const user = session.user.email;
      const response = await fetch(`/api/returnTrips?userEmail=${user}`);
      const userTrips = await response.json();
      setTrips(userTrips);
    }

    if (session?.user?.email) {
      loadTrips();
    }
  }, [session]);

  console.log("trips", trips);

  const handleCheckout = async () => {
    await updateoOrderInfo();

    await sendCartUsersEmail();
  };

  const updateoOrderInfo = async () => {
    const promises = items.map((item) => {
      const orderData = {
        id: item.id,
        tripId: selectedTrip.id,
        arrivalDate: selectedTrip.arrivalDate,
      };
      return fetch("/api/setOrderTrip/", {
        method: "PUT",
        body: JSON.stringify(orderData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log(`Order ${item.id} updated with trip ID and arrival date`);
        })
        .catch((error) => {
          console.error(`Error updating order ${item.id}: ${error}`);
        });
    });

    await Promise.all(promises);
    console.log("All orders updated with trip ID and arrival date");
  };

  const sendCartUsersEmail = async () => {
    const promises = items.map((item, i) => {
      const emailinfo = {
        userId: item.userId,
        title: item.title,
        url: item.url,
        price: item.price,
        description: item.description,
        category: item.category,
        origin: item.origin,
        destination: item.destination,
      };
      return fetch("/api/orderemail", {
        method: "post",
        body: JSON.stringify(emailinfo),
      })
        .then(() => {
          console.log(`Email sent to ${emailinfo.userId}`);
        })
        .catch((error) => {
          console.log(`Error sending email to ${emailinfo.userId}: ${error}`);
        });
    });

    await Promise.all(promises);
    console.log("All emails sent");
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const canProceedToCheckout = !!selectedTrip;

  console.log("selectedTrip", selectedTrip);

  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/*Left Side  */}

        <div className="flex-grow m-5 shadow-sm">
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Basket Is Empty"
                : "Your Shopping Basket"}
            </h1>
            {items.map((item, i) => (
              <SupaCheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                url={item.url}
                price={item.price}
                rating={item.rating}
                description={item.description}
                category={item.category}
                origin={item.origin}
                destination={item.destination}
                userId={item.userId}
              />
            ))}
          </div>

          {/* Trip Selection before Delivery Checkout */}

          {/* Trip Selection before Delivery Checkout */}
          <div className="p-5 shadow-sm">
            <h2 className="text-2xl mb-2">Select a trip:</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className={`bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg ${
                    selectedTrip?.id === trip.id && "border-2 border-blue-500"
                  }`}
                  onClick={() => handleTripClick(trip)}
                >
                  <div className="h-48 relative"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {trip.originCountry}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {trip.destinationCountry}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      Departure: {trip.departureDate}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      Arrival: {trip.arrivalDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trip Selection before Delivery Checkout */}

        {/* Right Side */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  {numeral(total).format("$0,0.00")} SDG
                </span>{" "}
              </h2>

              {canProceedToCheckout || !session ? (
                <button
                  onClick={ handleCheckout}
                  disabled={!canProceedToCheckout || !session}
                  className={`button mt-2 ${
                    !canProceedToCheckout || !session
                      ? "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {!session
                    ? "Sign in to checkout"
                    : canProceedToCheckout
                    ? "Proceed to checkout"
                    : "Please select a trip"}
                </button>
              ) : (
                <p className="text-gray-600 mt-2">
                  Please select a trip to proceed to checkout.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
