import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import TripAuthModal from "./travelAuthModal";
import NotificationPermissionModal from "./getNotificationModal";

function TravelFormForCheckout({onTripAdded}) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [countries, setCountries] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userPhoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Add this line

  // Closes the auth modal when the user is not logged in
  const closeModal = () => {
    setShowAuthModal(false);
  };

  //Fetches the user's profile info from the database.
  //which really just returns the user object,
  //then we extract the phone number from the user object and set it to the userPhoneNumber useState to see
  // if the user has a phone number in the database
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/getUserProfileInfo");
      const data = await res.json();

      // Check if data is not null and has phoneNumber property
      if (data && data.hasOwnProperty("phoneNumber")) {
        setPhoneNumber(data.phoneNumber);
      } else {
        // You can handle the error here or set a default value for the phoneNumber state
        console.error("Unexpected data format or data is null:", data);
      }
    }
    fetchUser();
  }, []);

  //Fetches all countries from restcountries.com and sets them to the countries state
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v2/all");
        const data = await response.json();
        const countryList = data.map((country) => ({
          code: country.alpha2Code,
          name: country.name,
        }));
        setCountries(countryList);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCountries();
  }, []);

  // handles the acutal submission of the trip details to the database.
  //If there is no session (user is not logged in), the user will be asked to log in using a modal.
  //If there is a session, but the user doesnt have a phone number in the database,
  // the user will be asked to enter their phone number using a modal(setshowModal to true )
  //if there is a session and the user has a phone number in the database, the trip details will be submitted to the database
  //
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      setShowAuthModal(true);
    } else {
      if (!userPhoneNumber) {
        setShowModal(true);
      } else {
        setSubmitting(true);
        await addTrip();
        setSubmitting(false);
        onTripAdded();
        // pass the specialSUBMITBEHAVIOR function to the travelForm
      }
    }
  };

  // If a user trys to submit a trip without having their number in the database,
  //they will be asked to enter their phone number  using a modal.
  //This function handles the submit event and updates the deliverer's phone number.

  const handlePhoneNumberSubmit = async (event) => {
    event.preventDefault();

    // Update the user's phone number in the database
    try {
      const response = await fetch("/api/addUserPhoneNumber", {
        method: "PUT",

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

  // Handles the submission of the trip details to the database using the tripsapi route,
  // and redirects to the userTripsPage after submission
  const addTrip = async () => {
    const data = {
      origin,
      destination,
      departureDate,
      arrivalDate,
      currentUserEmail: session.user.email,
    };
    try {
      const response = await axios.post("/api/tripsapi", data);
      if (response.status === 200) {
        console.log("Trip created successfully redirecting .....");
        // router.push("/userTripsPage"); // Redirect to a success page or the same page
      } else {
        // Handle errors
        console.error(response.data.error);
      }
    } catch (error) {
      // Handle errors
      console.error("An error occurred while creating the order:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto my-4 p-4 bg-gray-100 shadow-md rounded-md"
      >
        <div className="mb-4">
          <label
            htmlFor="origin"
            className="block font-medium text-gray-700 mb-2"
          >
            Origin Country
          </label>
          <select
            id="origin"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          >
            <option value="">Select origin country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="destination"
            className="block font-medium text-gray-700 mb-2"
          >
            Destination Country
          </label>
          <select
            id="destination"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="">Select destination country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="departureDate"
            className="block font-medium text-gray-700 mb-2"
          >
            Departure Date
          </label>
          <DatePicker
            id="departureDate"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            dateFormat="dd/MM/yyyy"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="arrivalDate"
            className="block font-medium text-gray
700 mb-2"
          >
            Arrival Date
          </label>
          <DatePicker
            id="arrivalDate"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            selected={arrivalDate}
            onChange={(date) => setArrivalDate(date)}
            dateFormat="dd/MM/yyyy"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={submitting} // Disable the button when submitting is true
          >
            {submitting ? "Adding Trip..." : "Add Trip"}
          </button>
        </div>
      </form>

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

      <>
        <form onSubmit={handleSubmit}>
          {/* ...form content and styles... */}
          <button type="submit" className="btn btn-primary"></button>
        </form>
        <TripAuthModal showModal={showAuthModal} closeModal={closeModal} />
      </>
      <NotificationPermissionModal />
    </div>
  );
}

export default TravelFormForCheckout;
