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
import TravelForm from "../components/TravelForm";
import { clearBasket } from "../slices/basketSlice";
import { useDispatch } from "react-redux";

function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { data: session, status } = useSession();
  const [showTravelForm, setShowTravelForm] = useState(false);
  const dispatch = useDispatch();
  const [userPhoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    if (!userPhoneNumber) {
      setShowModal(true);
    } else {
      await updateoOrderInfo();

      await sendCartUsersEmail();
      dispatch(clearBasket());
    }
  };

  const handlePhoneNumberSubmit = async (event) => {
    event.preventDefault();

    // Update the user's phone number in the database
    try {
      const response = await fetch("/api/addUserPhoneNumber", {
        method: "PUT",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify(userPhoneNumber),
      });

      if (response.status === 200) {
        console.log("Phone number updated successfully");
        setShowModal(false);
        submitTripDetails();
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(
        "An error occurred while updating the phone number:",
        error
      );
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/getUserProfileInfo");
      const data = await res.json();
      setPhoneNumber(data.phoneNumber);
    }
    fetchUser();
  }, []);

  const updateoOrderInfo = async () => {
    const promises = items.map((item) => {
      const orderData = {
        id: item.id,
        tripId: selectedTrip.id,
        arrivalDate: selectedTrip.arrivalDate,
        contactNumber: userPhoneNumber,
      };
      console.log("orderData", orderData);
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
        imageUrl: item.imageUrl,
        arrivalDate: selectedTrip.arrivalDate,
        contactNumber: new Date(userPhoneNumber).toLocaleDateString(),
      };

      return fetch("/api/orderemail", {
        method: "post",
        body: JSON.stringify(emailinfo),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("Order created successfully redirecting .....");
            router.push("/userDeliveriesPage"); // Redirect to a success page or the same page
          }

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
      {/* MAIN CONTAINS ENTIRE LEFT AND RIGHT SIDE */}
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* DIV TO CONTAIN THE Left Side  */}

        <div className="flex-grow m-5 shadow-sm">
          {/* DIV TO SHOW THE PRODUCTS IN THE BASKET */}
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
                imageUrl={item.imageUrl}
              />
            ))}
          </div>

          {/* DIV TO SHOW TRIPS AND ALLOW SELECTION BEFORE CHECKOUT */}

          {trips.length === 0 && showTravelForm ? (
            <div className="p-5 shadow-sm">
              <TravelForm />
            </div>
          ) : (
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
                        Departure:{" "}
                        {new Date(trip.departureDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        Arrival:{" "}
                        {new Date(trip.arrivalDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side */}

        {/* RIGHT SIDE DIV TO SHOW THE TOTAL AND HANDLE THE PROCEED TO CHECKOUT LOGIC/ BUTTON */}
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
                  onClick={handleCheckout}
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
                <>
                  {trips.length === 0 ? (
                    <>
                      <p className="text-gray-600 mt-2">
                        You don't have any trips yet. Please add a trip to
                        continue
                      </p>
                      <button
                        onClick={() => setShowTravelForm(true)}
                        className="button w-full"
                      >
                        Enter a Trip
                      </button>
                    </>
                  ) : (
                    <button disabled className="button w-full">
                      Select A Trip
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* END OF RIGHT SIDE BUTTON AND TOTAL */}
      </main>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* ... */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handlePhoneNumberSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block font-medium text-gray-700 mb-2"
                  >
                    Please Add A Phone Number To Your Account This Allows Users
                    To Contact You
                  </label>
                  <input
                    id="phoneNumber"
                    type="text"
                    className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={userPhoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
