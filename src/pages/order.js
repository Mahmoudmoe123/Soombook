import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import supabase from "../lib/supabase";
import { useRouter } from "next/router";

import { stringify } from "postcss";
function ProductForm() {
  const [url, setUrl] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [countries, setCountries] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { data: session, status } = useSession();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Submitted URL: ${url}`);
    console.log(`Submitted Origin: ${origin}`);
    console.log(`Submitted Destination: ${destination}`);
    const priceAsInt = parseInt(price);

    const uploadedImageUrl = await uploadImage();

    addProduct(priceAsInt, uploadedImageUrl);
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
        className="max-w-lg mx-auto my-4 p-4 bg-gray-100 shadow-md rounded-md"
      >
        <div className="mb-4">
          <label htmlFor="url" className="block font-medium text-gray-700 mb-2">
            Product URL
          </label>
          <input
            type="text"
            id="url"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block font-medium text-gray-500 mb-1 text-lg px-2 py-1"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            // accept="image/*"
            className="bg-white rounded-lg px-4 py-2 w-full shadow-sm border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

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
            htmlFor="category"
            className="block font-medium text-gray-700 mb-2"
          >
            Category
          </label>
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

            <option value="clothing">Electronics</option>
            <option value="beauty">Home and garden</option>

            <option value="clothing">Clothing</option>
            <option value="beauty">Sports and outdoors</option>

            <option value="clothing">Toys and games</option>
            <option value="beauty">Beauty</option>

            <option value="clothing">Health and wellness</option>
            <option value="beauty">Automotive</option>
            {/* Add more options for other categories */}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block font-medium text-gray-700 mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
