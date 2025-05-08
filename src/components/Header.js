import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import { useState } from "react";
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineShoppingBag,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineLogout,
} from "react-icons/hi";
import { IoAirplaneOutline } from "react-icons/io5";
import { GoPackage } from "react-icons/go";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const items = useSelector(selectItems);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          <div className="flex items-center justify-between w-full md:justify-start">
            <div className="-ml-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <div
              onClick={() => router.push("/")}
              className="hidden md:block text-white font-bold text-xl cursor-pointer"
            >
              <div className="relative h-16 w-40">
                <Image
                  src="/sombook.png"
                  alt="Sombook Logo"
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                  className="absolute top-0 left-0"
                />
              </div>
            </div>

            <div className="hidden ml-4 space-x-4 md:flex">
              <button
                className=" flex text-white px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                onClick={() => router.push("/order")}
              >
                <HiOutlineShoppingBag className="w-6 h-6" />
                Order
              </button>

              <button
                className=" flex text-white px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                onClick={() => router.push("/travel")}
              >
                <IoAirplaneOutline className="w-6 h-6" />
                Travel
              </button>
            </div>
            {/* Sign In Button */}
            <div className="ml-auto flex justify-between space-x-3">
              <button
                onClick={!session ? () => signIn("google") : toggleSidebar}
                className="text-white font-medium text-sm hover:underline focus:outline-none flex items-center"
              >
                <p className="hidden md:inline">
                  {session ? `Hello ${session.user.name}` : "Sign-In"}
                </p>
                {session && (
                  <img
                    src={session.user.image}
                    alt="User profile"
                    className="w-10 h-10 md:w-10 md:h-10 rounded-full object-cover inline ml-2"
                  />
                )}
              </button>

              <div
                onClick={() => router.push("/supacheckout")}
                className="relative link flex items-center"
              >
                <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
                  {items.length}
                </span>
                <ShoppingCartIcon className="h-10" />
                <p className="hidden md:inline font-extrabold md:text-sm mt-2">
                  Basket
                </p>
              </div>
            </div>
          </div>
          <div className="md:hidden text-white font-bold text-xl absolute left-1/2 transform -translate-x-1/2 ">
            <div className="h-16 w-16 overflow-hidden">
              <Image
                src="/sombook.png"
                alt="Sombook Logo"
                width={100}
                height={100}
                priority
                onClick={() => router.push("/")}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            onClick={() => router.push("/order")}
          >
            <HiOutlineShoppingBag className="w-6 h-6" />
            Order
          </button>
          <button
            className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            onClick={() => router.push("/travel")}
          >
            <IoAirplaneOutline className="w-6 h-6" />
            Travel
          </button>

          {!session && (
            <button
              className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              onClick={signIn}
            >
              Sign In{" "}
            </button>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-y-0 right-0 flex flex-col justify-between bg-gray-800 w-64 h-full p-4 space-y-4 text-white z-50">
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleSidebar}
                className="text-white focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <button
                className="flex items-center space-x-4 text-white font-medium text-lg py-2 px-4 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none w-full text-left"
                onClick={() => router.push("/userTripsPage")}
              >
                <IoAirplaneOutline className="w-6 h-6" />
                <span>Your Trips</span>
              </button>
              <button
                className="flex items-center space-x-4 text-white font-medium text-lg py-2 px-4 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none w-full text-left"
                onClick={() => router.push("/userOrders")}
              >
                <HiOutlineShoppingBag className="w-6 h-6" />
                <span>Your Orders</span>
              </button>
              <button
                className="flex items-center space-x-4 text-white font-medium text-lg py-2 px-4 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none w-full text-left"
                onClick={() => router.push("/userDeliveriesPage")}
              >
                <GoPackage className="w-6 h-6" />
                <span>Your Deliveries</span>
              </button>
              <button
                className="flex items-center space-x-4 text-white font-medium text-lg py-2 px-4 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none w-full text-left"
                onClick={() => router.push("/payment")}
              >
                <HiOutlineCreditCard className="w-6 h-6" />
                <span>Your Payment Profile</span>
              </button>
              <button
                className="flex items-center space-x-4 text-white font-medium text-lg py-2 px-4 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none w-full text-left"
                onClick={() => router.push("/userProfile")}
              >
                <HiOutlineUserCircle className="w-6 h-6" />
                <span>Your User Profile</span>
              </button>
            </div>
          </div>

          <button
            className="flex items-center space-x-4 text-white font-medium text-lg py-2 px-4 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none w-full text-left"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <HiOutlineLogout className="w-6 h-6" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
