import Image from "next/image";
import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import numeral from "numeral";
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice";

function Product({
  id,
  title,
  url,
  price,
  description,
  category,
  origin,
  destination,
  userId,
  imageUrl,
}) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      url,
      origin,
      destination,
      userId,
      imageUrl,
    };
    dispatch(addToBasket(product));
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in">
      <p className="absolute right-2 top-2 text-xs italic text-gray-400">
        {category}
      </p>

      <div className="w-200 h-150 mx-auto mb-4 rounded-md overflow-hidden">
        <Image
          src={imageUrl}
          height={150}
          width={200}
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="mx-auto mb-4 rounded-md"
        />
      </div>

      <p className="text-xs mb-2 line-clamp-1">{url}</p>
      <h4 className="my-2 text-lg font-semibold">{title}</h4>
      <div className="mb-2">
        <p>{origin}</p>
        <p>{destination}</p>
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5 font-semibold text-lg">
        {numeral(price).format("0,0.00")} SDG
      </div>
      <button
        onClick={addItemToBasket}
        className="mt-auto w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-md shadow transition duration-200 ease-in"
      >
        Add to Basket
      </button>
    </div>
  );
}

export default Product;
