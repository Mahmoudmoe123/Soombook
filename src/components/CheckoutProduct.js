import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../slices/basketSlice";

function CheckoutProduct({
  id,
  title,
  price,
  rating,
  description,
  category,
  image,
  hasPrime,
}) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
      hasPrime,
    };

 

    // push into redux
    dispatch(addToBasket(product));
  };



  const removeItemFromBasket =()=> {
//removes item from redux basketslice
    dispatch (removeFromBasket({id}))
    
        }

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} />

      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>
                <div className="my-3">  <Currency quantity={price} currency="SDG" /></div>
      

        {hasPrime && (
          <div className=" flex items-center space-x-2 -mt-2">
            <img
              loading="lazy"
              className="w-12 "
              src="https://links.papareact.com/fdw"
              alt=""
            />
            <p className="text-xs text-gray-500 ">Free Soombook delivery</p>
          </div>
        )}
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

export default CheckoutProduct;
