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
}) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      url,
      price,
      rating,
      description,
      category,
      origin,
      destination,
    };

    // push into redux
    dispatch(addToBasket(product));
  };

  const removeItemFromBasket = () => {
    //removes item from redux basketslice
    dispatch(removeFromBasket({ id }));
  };

  return (
    <div className="grid grid-cols-5">
        <p className="text-xs line-clamp-1">{url}</p>{" "}

      <div className="col-span-3 mx-5">
        <p className="    text-xs italic text-gray-400">
          {category}
        </p>
        <h4 className="my-3">{title}</h4>
        <div>
          <p>{origin}</p>
          <p>{destination}</p>
        </div>
        <p className="text-xs my-2 line-clamp-2">{description}</p>
        <div className="mb-5">{numeral(price).format("0,0.00")} SDG</div>
      </div>

      <div className=" flex flex-col space-y-2 my-auto justify-self-end">
        <button className=" button   " onClick={addItemToBasket}>
          Add to Basket
        </button>
        <button className=" button " onClick={removeItemFromBasket}>
          Remove from basket
        </button>
      </div>
    </div>
  );
}

export default SupaCheckoutProduct;
