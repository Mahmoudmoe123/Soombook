import Image from "next/image";
import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import numeral from "numeral";
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice";

const MAX_RATING = 5;
const MIN_RATING = 1;
function Product({
  id,
  title,
  url,
  price,
  description,
  category,
  origin,
  destination,
  userId
}) {
  //   const [rating, setRating] = useState(1);
  //   const [hasPrime, setHasPrime] = useState(true);
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
      userId
    };
    //Sending the product as an actoin to the redux store
    dispatch(addToBasket(product));
  };

  //   useEffect(() => {
  //     setRating(
  //       Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  //     );
  //     setHasPrime(Math.random() < 0.5);
  //   }, []);
  return (
    <div
      className="relative flex
     flex-col m-5 bg-white z-30  p-10 "
    >
      <p className="  absolute right-2 top-2  text-xs italic text-gray-400">
        {category}
      </p>
      <p className="text-xs line-clamp-1">{url}</p> <h4 className="my-3">{title}</h4>
      <div>
        <p>{origin}</p>
        <p>{destination}</p>
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">{numeral(price).format("0,0.00")} SDG</div>
      {/* {hasPrime && (
        <div className=" flex items-center space-x-2 -mt-2">
          <img className="w-12 " src="https://links.papareact.com/fdw" alt="" />
          <p className="text-xs text-gray-500 ">Free Soombook delivery</p>
        </div>
      )} */}

      
      <button onClick={addItemToBasket} className="mt-auto button">
        Add to Basket
      </button>
    </div>
  );
}

export default Product;
