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
  // Need these from redux to handle the shopping cart
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const router = useRouter();
  
  // State management for trips and UI
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { data: session, status } = useSession();
  const [showTravelForm, setShowTravelForm] = useState(false);
  const dispatch = useDispatch();
  
  // Need these for phone number collection and modals
  const [userPhoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showTravelFormModal, setShowTravelFormModal] = useState(false);
  const [tripAdded, setTripAdded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Loading and notification states for better UX
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Simple toggle for the travel form modal
  const toggleModal = () => {
    setShowTravelFormModal(!showTravelFormModal);
  };

  // Called after successfully adding a new trip
  const handleTripAdded = () => {
    setTripAdded(true);
    toggleModal();
  };

  // Fetch all my trips from the DB when component loads or after adding a new trip
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

  // Just for debugging - can remove later
  console.log("trips", trips);

  // Need to check if user has phone number stored - required for deliveries
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/getUserProfileInfo");
      const data = await res.json();
      setPhoneNumber(data.phoneNumber);
    }
    fetchUser();
  }, []);

  // Main checkout logic - handles everything from phone number collection to order processing
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (session && !userPhoneNumber) {
        // Gotta get their phone number first
        setIsOpen(true);
      } else {
        // All good - process the order
        await updateoOrderInfo();
        await sendCartUsersEmail();
        dispatch(clearBasket());
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Updates the phone number in DB when user adds it during checkout
  const handlePhoneNumberSubmit = async (number) => {
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

  // Updates all orders with trip details and contact info
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

  // Sends confirmation emails to everyone involved in the order
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

  // Updates selected trip when user clicks a trip card
  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  // Helper to check if we can proceed to checkout
  const canProceedToCheckout = !!selectedTrip;

  // For debugging selected trip info
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

  const Breadcrumb = () => (
    <nav className="flex py-3 px-5 text-gray-700 bg-gray-50 rounded-lg">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="/" className="hover:text-blue-600">Home</a>
        </li>
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <span className="text-blue-600">Checkout</span>
        </li>
      </ol>
    </nav>
  );

  // Add this component before the main content
  const CheckoutSteps = ({ currentStep }) => (
    <div className="flex justify-center mb-8">
      <div className="w-2/3">
        <div className="flex items-center">
          <div className={`flex-1 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
              }`}>
                1
              </div>
              <div className="ml-2">Select Items</div>
            </div>
          </div>
          <div className={`flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
              }`}>
                2
              </div>
              <div className="ml-2">Choose Trip</div>
            </div>
          </div>
          <div className={`flex-1 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
              }`}>
                3
              </div>
              <div className="ml-2">Checkout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add this component to show notifications
  const Toast = ({ message, type, onClose }) => (
    <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white flex items-center space-x-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  );

  // Add this component for better loading states
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="bg-gray-100">
      <Header />
      <Breadcrumb />
      <CheckoutSteps currentStep={1} />
      {/* MAIN CONTAINS ENTIRE LEFT AND RIGHT SIDE */}
      <main className="lg:flex max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 gap-8">
        <div className="flex-grow lg:w-2/3">
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
                        selectedTrip?.id === trip.id 
                          ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                          : 'hover:shadow-xl'
                      }`}
                      onClick={() => handleTripClick(trip)}
                    >
                      <div className="p-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <FaPlane className="text-blue-500 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{trip.originCountry}</h3>
                                <p className="text-sm text-gray-500">Origin</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-blue-500 text-2xl">→</span>
                              <span className="text-xs text-gray-400">Flight</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{trip.destinationCountry}</h3>
                              <p className="text-sm text-gray-500">Destination</p>
                            </div>
                          </div>
                          <div className="border-t pt-4 mt-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Departure</p>
                                <p className="font-medium">
                                  {new Date(trip.departureDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Arrival</p>
                                <p className="font-medium">
                                  {new Date(trip.arrivalDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
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
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          {/* RIGHT SIDE DIV TO SHOW THE TOTAL AND HANDLE THE PROCEED TO CHECKOUT LOGIC/ BUTTON */}
          <div className="flex-col sticky top-5 h-fit bg-white p-6 shadow-md rounded-lg">
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
        </div>
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
      {notification.show && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
}

export default Checkout;
