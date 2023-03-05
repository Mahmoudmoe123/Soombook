import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Header from "../components/Header";
import { useSession } from "next-auth/react";

function FlightForm() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [countries, setCountries] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitted Origin: ${origin}`);
    console.log(`Submitted Destination: ${destination}`);
    console.log(
      `Submitted Departure Date: ${format(departureDate, "dd/MM/yyyy")}`
    );
    console.log(`Submitted Arrival Date: ${format(arrivalDate, "dd/MM/yyyy")}`);
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
      <Header />

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
              <option key={country.code} value={country.code}>
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
              <option key={country.code} value={country.code}>
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
            Search Flights
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlightForm;
