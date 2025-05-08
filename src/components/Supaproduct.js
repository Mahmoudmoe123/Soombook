import Image from "next/image";
import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import numeral from "numeral";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, selectItems } from "../slices/basketSlice";
import { useRouter } from "next/router";


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
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);
  const basketItems = useSelector(selectItems);


  const redirectToUrl = () => {
    router.push(url);
  };


  const addItemToBasket = () => {
    const productExists = basketItems.some(item => item.id === id);

    if (productExists) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
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
    }
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in w-full sm:w-80">
      
      {showMessage && (
        <div className="absolute top-0 right-0 mt-2 mr-2 w-full sm:w-3/4 bg-red-500 text-white text-center py-2 px-4 rounded-lg shadow-md">
          Item is already in the basket!
        </div>
      )}
      <p className="absolute right-2 top-2 text-xs italic text-gray-400">
        {category}
      </p>

      <div className="w-full h-48 mx-auto mb-4 rounded-md overflow-hidden">
        <Image
          src={imageUrl}
          height={192}
          width={288}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          className="mx-auto mb-4 rounded-md"
        />
      </div>

      <p className="text-xs mb-2 line-clamp-1">{url}</p>
      <h4 className="my-2 text-lg font-semibold">{title}</h4>
      <div className="mb-2 flex flex-col sm:flex-row justify-between">
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
      <button
        onClick={redirectToUrl}
        className="mt-2 w-full py-2 px-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-md shadow transition duration-200 ease-in"
      >
        View Product
      </button>
    </div>
  );
}

export default Product;
