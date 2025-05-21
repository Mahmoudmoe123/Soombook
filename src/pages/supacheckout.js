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
import Modal from "../components/ModalForTravelForm";
import { clearBasket } from "../slices/basketSlice";
import { useDispatch } from "react-redux";
import TravelFormForCheckout from "../components/TravelFormForCheckout";
import { FaPlane } from "react-icons/fa";
import PhoneNumberModal from "../components/phoneNumberModal";

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
  const [showTravelFormModal, setShowTravelFormModal] = useState(false);
  const [tripAdded, setTripAdded] = useState(false);
  //for the phone Numebr Modal
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setShowTravelFormModal(!showTravelFormModal);
  };

  const handleTripAdded = () => {
    setTripAdded(true);
    toggleModal();
  };

  // loads the trips from the database
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

    if (tripAdded) {
      setTripAdded(false);
    }
  }, [session, tripAdded]);

  //prints the trips to the console. This is just for testing purposes
  console.log("trips", trips);

  //Fetches the user's profile info from the database. which really just returns the user object, then we extract the phone number from the user object and set it to the userPhoneNumber useState to see
  // if the user has a phone number in the database
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/getUserProfileInfo");
      const data = await res.json();
      setPhoneNumber(data.phoneNumber);
    }
    fetchUser();
  }, []);

  // handle the checkout button click event. calls the actual functions that handle the checkout.
  // If the deliverer doesnt have a phone number a modal will pop up asking for the phone number. which will be updated using the handlePhoneNumberSubmit function
  // If there is already a number, or the user has now entered a number the orders will be updated with the trip details, the phone number etc, the email will be sent to the users and the basket will be cleared
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (session && !userPhoneNumber) {
        setIsOpen(true);
      } else {
        await updateoOrderInfo();
        await sendCartUsersEmail();
        dispatch(clearBasket());
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If a user trys to checkout a order that they will be delivering without having their number in the database, they will be asked to enter their phone number.
  //This function handles the submit event and updates the deliverer's phone number.
  const handlePhoneNumberSubmit = async (number) => {
    // Update the user's phone number in the database
    if (!number) {
      console.error("Invalid number: empty or null");
      return;
    }

    setPhoneNumber(number);

    try {
      const response = await fetch("/api/addUserPhoneNumber", {
        method: "PUT",

        body: JSON.stringify(number),
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

  //calls an api route that updates the orders in the cart/basket with the trip details, the phone number of the deliver for contact
  //purposes etc.

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

  // calls an api route that sends an email to the users who have items in the cart/basket. The email contains the trip details, the items in the cart/basket etc.
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
        contactNumber: userPhoneNumber,
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

  // Handles the click event on the trip cards. When a trip card is clicked, the trip details are set to the selectedTrip useState
  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const canProceedToCheckout = !!selectedTrip;

  console.log("selectedTrip", selectedTrip);

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl text-gray-300 mb-4">🛒</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500">Add some items to get started!</p>
    </div>
  );

  const NoTrips = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
      <div className="text-6xl text-gray-300 mb-4">✈️</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        No Trips Available
      </h2>
      <p className="text-gray-500 mb-4">
        Add a new trip to start delivering
      </p>
      <button
        onClick={toggleModal}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
      >
        <FaPlane />
        <span>Add Trip</span>
      </button>
    </div>
  );

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
                ? "PLEASE ADD PRODUCTS FIRST"
                : "YOUR DELIVERY ITEMS"}
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

          {trips.length === 0 && items.length === 0 ? (
            <div className="p-5 shadow-sm">
              <h2 className="text-2xl mb-2">
                No Trips Available Please Add A Trip:
              </h2>
            </div>
          ) : (
            <div className="p-5 shadow-sm">
              <h2 className="text-2xl mb-2">Select a trip:</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className={`bg-white rounded-lg shadow-md cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                      selectedTrip?.id === trip.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleTripClick(trip)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <FaPlane className="text-blue-500" />
                          <h3 className="text-lg font-semibold">
                            {trip.originCountry}
                          </h3>
                        </div>
                        <span className="text-sm text-gray-500">→</span>
                        <h3 className="text-lg font-semibold">
                          {trip.destinationCountry}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Departure:</span>
                          <span>
                            {new Date(trip.departureDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Arrival:</span>
                          <span>
                            {new Date(trip.arrivalDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ////////////////   TRIP MODAL         //////////////////////// */}
          {/* Button for tripform modal */}
          <div className="container mx-auto">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2"
              onClick={toggleModal}
            >
              <FaPlane className="text-lg" />
              <span>Add Trip</span>
            </button>
            <Modal
              show={showTravelFormModal}
              onClose={toggleModal}
              onTripAdded={handleTripAdded}
            >
              <TravelFormForCheckout onTripAdded={handleTripAdded} />
            </Modal>
          </div>
        </div>

        {/* Right Side */}

        {/* RIGHT SIDE DIV TO SHOW THE TOTAL AND HANDLE THE PROCEED TO CHECKOUT LOGIC/ BUTTON */}
        <div className="flex flex-col bg-white p-10 shadow-md rounded-lg">
          {items.length > 0 && (
            <>
              {/* Shows the subtotal and total price */}
              <h2 className="whitespace-nowrap text-lg font-semibold text-gray-700">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  {numeral(total).format("$0,0.00")} SDG
                </span>
              </h2>

              {/* Order Summary Section */}
              <div className="space-y-4 mb-4">
                <h2 className="text-xl font-bold border-b pb-2">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({items.length}):</span>
                    <span>{numeral(total).format("$0,0.00")} SDG</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>{numeral(total).format("$0,0.00")} SDG</span>
                  </div>
                </div>
              </div>

              {canProceedToCheckout || !session ? (
                <button
                  onClick={handleCheckout}
                  disabled={!canProceedToCheckout || !session || isLoading}
                  className={`button mt-2 relative ${
                    !canProceedToCheckout || !session
                      ? "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white"
                  } px-4 py-2 font-semibold rounded`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : !session ? (
                    "Sign in to checkout"
                  ) : (
                    "Proceed to checkout"
                  )}
                </button>
              ) : (
                <>
                  {trips.length === 0 ? (
                    <p className="text-gray-600 mt-2">
                      No Trips Available. Please Add A Trip
                    </p>
                  ) : (
                    <h1 className="text-xl font-semibold text-gray-700">
                      Select A Trip Please
                    </h1>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* END OF RIGHT SIDE BUTTON AND TOTAL */}
      </main>

      {/* Phone Number Modal */}
      {session && !userPhoneNumber && (
        <PhoneNumberModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          savePhoneNumber={handlePhoneNumberSubmit}
        />
      )}
      {/* {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
      )} */}
    </div>
  );
}

export default Checkout;
