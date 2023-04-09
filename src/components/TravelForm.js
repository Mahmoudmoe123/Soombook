import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import TripAuthModal from "./travelAuthModal";




function TravelForm() {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitted Origin: ${origin}`);
    console.log(`Submitted Destination: ${destination}`);
    console.log(`Submitted Departure Date: ${formatedDepartureDate}`);
    console.log(`Submitted Arrival Date: ${formatedArrivalDate}`);

    if (!session) {
      setShowAuthModal(true);
    } else {
      if (!userPhoneNumber) {
        setShowModal(true);
      } else {
        addTrip();
      }
    }
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

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

  const formatedArrivalDate = format(arrivalDate, "yyyy-MM-dd");
  const formatedDepartureDate = format(departureDate, "yyyy-MM-dd");

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
        router.push("/userTripsPage"); // Redirect to a success page or the same page
      } else {
        // Handle errors
        console.error(response.data.error);
      }
    } catch (error) {
      // Handle errors
      console.error("An error occurred while creating the order:", error);
    }
  };

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
          >
            Add Trip{" "}
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
    </div>
  );
}

export default TravelForm;
