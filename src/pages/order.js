import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import supabase from "../lib/supabase";
import { useRouter } from "next/router";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "../firebase";
import EnableNotificationsModal from "../components/RequestNotificationModal";
import {
  IoMdLink,
  IoMdPricetag,
  IoMdListBox,
  IoMdCompass,
  IoMdImages,
  IoMdGlobe,
  IoMdDocument,
} from "react-icons/io";

import { stringify } from "postcss";
import OrderAuthModal from "../components/OrderAuthModal";
function ProductForm() {
  const [url, setUrl] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [countries, setCountries] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Add this line
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const { data: session, status } = useSession();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      setShowAuthModal(true);
    } else {
      const userAlreadyHasToken = await checkIfuserHasNotificationToken();
      console.log(" Token Status: " + userAlreadyHasToken);

      if (!userAlreadyHasToken) {
        setShowNotificationModal(true);
      } else {
        setSubmitting(true);

        console.log(`Submitted URL: ${url}`);
        console.log(`Submitted Origin: ${origin}`);
        console.log(`Submitted Destination: ${destination}`);
        const priceAsInt = parseInt(price);

        const uploadedImageUrl = await uploadImage();

        await addProduct(priceAsInt, uploadedImageUrl);

        setSubmitting(false);
      }
    }
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
  };

  const handleEnableNotifications = async () => {
    // Request the FCM token and save it to the database
    // Close the modal

    console.log("Requesting permission...");


    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        const messaging = getMessaging(app);

        const token = await getToken(messaging, {
          vapidKey:
            "BPXJQ-KqNphqwXiq6giKPnru1p6glK9uoHgYT3y2YFXQy3vR37RQblC-EjG2ONJus_Dx1ZAhYEELqccxgZINVjY",
        });

        console.log("current token: " + token);

        // Save the token to your database (e.g., Supabase) associated with the user.
        // ...
        try {
          const response = await fetch("/api/addNotificationToken", {
            method: "PUT",

            body: JSON.stringify(token),
          });

          if (response.status === 200) {
            console.log("Token updated successfully");
          } else {
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("An error occurred while updating the token:", error);
        }
      } else {
        console.log("Permission not granted.");
      }
    });
  

    setShowNotificationModal(false);
  };

  const checkIfuserHasNotificationToken = async () => {
    try {
      const response = await fetch("/api/checkIfUserHasNotificationToken", {
        method: "GET",
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log("Token checked successfully");
        return data.hasNotificationToken;
      } else {
        console.error("An error occurred while checking the token");
        return false;
      }
    } catch (error) {
      console.error("An error occurred while checking the token:", error);
      return false;
    }
  };

  const uploadImage = async () => {
    const imageLocation = session.user.email + "/" + uuidv4();
    const { data, error } = await supabase.storage
      .from("images")
      .upload(imageLocation, image);
    if (error) {
      console.error(error);
      return;
    }

    const pulicImageUrl = await supabase.storage
      .from("images")
      .getPublicUrl(imageLocation);

    setImageUrl(JSON.stringify(pulicImageUrl));

    //stringyfy the url

    const stringifiedUrl = JSON.stringify(pulicImageUrl.data.publicUrl);
    const url = stringifiedUrl.replace(/"/g, "");
    console.log("No quote url" + url);
    return url;
  };

  const addProduct = async (intPrice, imageUrl) => {
    const data = {
      url,
      origin,
      destination,
      category,
      description,
      title,
      price: intPrice,
      currentUserEmail: session.user.email,
      imageUrl: imageUrl,
      pickupLocation,
    };

    try {
      const response = await axios.post("/api/ordersapi", data);

      if (response.status === 200) {
        console.log("Order created successfully redirecting .....");
        router.push("/userOrders"); // Redirect to a success page or the same page
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
      <Header />
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto my-4 p-4 bg-gray-100 shadow-md rounded-md space-y-4"
      >
        <div className="flex items-center space-x-3">
          <IoMdLink className="text-xl text-gray-600" />
          <label htmlFor="url" className="font-medium text-gray-700">
            Product URL
          </label>
        </div>
        <input
          type="text"
          id="url"
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <div className="flex items-center space-x-3">
          <IoMdImages className="text-xl text-gray-600" />
          <label htmlFor="image" className="font-medium text-gray-700">
            Upload Image
          </label>
        </div>
        <input
          type="file"
          id="image"
          className="bg-white rounded-lg px-4 py-2 w-full shadow-sm border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <div className="flex items-center space-x-3">
          <IoMdGlobe className="text-xl text-gray-600" />
          <label htmlFor="origin" className="font-medium text-gray-700">
            Origin Country
          </label>
        </div>
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

        <div className="flex items-center space-x-3">
          <IoMdGlobe className="text-xl text-gray-600" />
          <label htmlFor="destination" className="font-medium text-gray-700">
            Destination Country
          </label>
        </div>
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

        <div className="flex items-center space-x-3">
          <IoMdListBox className="text-xl text-gray-600" />
          <label htmlFor="category" className="font-medium text-gray-700">
            Category
          </label>
        </div>
        <select
          id="category"
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="clothing">Clothing</option>
          <option value="beauty">Beauty and personal care</option>
          <option value="electronics">Electronics</option>
          <option value="home">Home and garden</option>
          <option value="sports">Sports and outdoors</option>
          <option value="toys">Toys and games</option>
          <option value="health">Health and wellness</option>
          <option value="automotive">Automotive</option>
          {/* Add more options for other categories */}
        </select>

        <div className="flex items-center space-x-3">
          <IoMdDocument className="text-xl text-gray-600" />
          <label htmlFor="description" className="font-medium text-gray-700">
            Description
          </label>
        </div>
        <textarea
          id="description"
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="flex items-center space-x-3">
          <IoMdListBox className="text-xl text-gray-600" />
          <label htmlFor="title" className="font-medium text-gray-700">
            Title
          </label>
        </div>
        <input
          type="text"
          id="title"
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex items-center space-x-3">
          <IoMdPricetag className="text-xl text-gray-600" />
          <label htmlFor="price" className="font-medium text-gray-700">
            Price
          </label>
        </div>
        <input
          type="number"
          id="price"
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <div className="flex items-center space-x-3">
          <IoMdCompass className="text-xl text-gray-600" />
          <label htmlFor="pickupLocation" className="font-medium text-gray-700">
            Pickup Location
          </label>
        </div>
        <input
          type="text"
          id="pickupLocation"
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
        />

        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
            disabled={submitting} // Disable the button when submitting is true
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </form>

      <EnableNotificationsModal
        isOpen={showNotificationModal}
        onClose={handleCloseNotificationModal}
        onEnable={handleEnableNotifications}
      />

      <>
        <form onSubmit={handleSubmit}>
          {/* ...form content and styles... */}
          <button type="submit" className="btn btn-primary"></button>
        </form>
        <OrderAuthModal showModal={showAuthModal} closeModal={closeModal} />
      </>
    </div>
  );
}

export default ProductForm;
