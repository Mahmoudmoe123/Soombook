import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

import { useRouter } from "next/router";

import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const items = useSelector(selectItems);

  return (
    <header>
      <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src="https://links.papareact.com/f90"
            width={150}
            height={40}
            style={{ objectFit: "contain" }}
            className="cursor-pointer"
          />
        </div>
        <div className="hidden sm:flex items-center h-10 rounded-md bg-yellow-400 hover:bg-yellow-500 flex-grow cursor-pointer">
          <input
            type="text"
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 "
          />
          <ShoppingCartIcon className="h-12 p-4 " />
        </div>

        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div onClick={!session ? signIn : signOut} className=" link">
            <p>{session ? `Hello ${session.user.name}` : "Sign-In"}</p>
            <p className="font-extrabold md:text-sm">Accounts & Lists</p>
          </div>
          <div className="link">
            <p>Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>

          {session && (
            <div
              onClick={() => router.push("/payment")}
              className="link items-center"
            >
              <p>Payment</p>
              <p className="font-extrabold md:text-sm">Profile</p>
            </div>
          )}
          <div
            onClick={() => router.push("/supacheckout")}
            className="relative link flex items-center"
          >
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
              {items.length}
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2 ">
              Bakset
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light h-10 text-white text-sm">
        <p className="link flex items-center">
          <Bars3Icon className="h-6 mr-1" />
          All
        </p>
        <p onClick={() => router.push("travel")} className="link">
          Travel
        </p>
        <p onClick={() => router.push("order")} className="link">
          Order
        </p>

        <p className="link">Today's Deals</p>
        <p className="link hidden lg:inline-flex">Electronics</p>
        <p className="link hidden lg:inline-flex">Food & Grocery</p>

        <p className="link hidden lg:inline-flex">Soombook +</p>
        <p className="link hidden lg:inline-flex">Buy Again</p>

        <p className="link hidden lg:inline-flex">Shop/Order Now</p>

        <p className="link hidden lg:inline-flex">Beauty</p>
      </div>
    </header>
  );
}

export default Header;
