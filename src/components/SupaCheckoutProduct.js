import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../slices/basketSlice";
import numeral from "numeral";

function SupaCheckoutProduct({
  id,
  title,
  url,
  price,
  rating,
  description,
  category,
  origin,
  destination,
  userId,
  imageUrl,
}) {
  const dispatch = useDispatch();

  // const addItemToBasket = () => {
  //   const product = {
  //     id,
  //     title,
  //     url,
  //     price,
  //     rating,
  //     description,
  //     category,
  //     origin,
  //     destination,
  //     userId,
  //     imageUrl,
  //   };

  //   // push into redux
  //   dispatch(addToBasket(product));
  // };

  const removeItemFromBasket = () => {
    //removes item from redux basketslice
    dispatch(removeFromBasket({ id }));
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in">
           <Image src={imageUrl} height={200} width={200} />


      <div className="col-span-3 mx-5">
        <p className="text-xs italic text-gray-400">{category}</p>
        <h4 className="my-3 text-lg font-semibold">{title}</h4>
        <div className="mb-2">
          <p>{origin}</p>
          <p>{destination}</p>
        </div>
        <p className="text-xs my-2 line-clamp-2">{description}</p>
        <div className="mb-5 font-semibold text-lg">{numeral(price).format("0,0.00")} SDG</div>
        <p className="text-xs line-clamp-1">{url}</p>{" "}
      </div>

      <div className="flex flex-col space-y-2 my-auto justify-self-end">
    
        <button className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow transition duration-200 ease-in" onClick={removeItemFromBasket}>
          Remove from basket
        </button>
      </div>
    </div>
  );
}

export default SupaCheckoutProduct;
