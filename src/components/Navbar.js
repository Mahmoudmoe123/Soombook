import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
            <a
              href="/"
              className="hidden md:block text-white font-bold text-xl"
            >
              <Image
                src="https://logopond.com/logos/cfe0510f7a2888be7ea56da181e90d4a.png"
                width={100}
                height={100}
              />
            </a>

            <div className="hidden ml-4 space-x-4 md:flex">
              <button
                className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                onClick={() => router.push("/order")}
              >
                Order
              </button>
              <button
                className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                onClick={() => router.push("/travel")}
              >
                Travel
              </button>
              <button
                className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                onClick={() => router.push("/userDeliveriesPage")}
              >
                Your Deliveries
              </button>
            </div>

            {/* Sign In Button */}
            <div className="ml-auto">
              <button onClick={!session ? signIn : toggleSidebar}>
                <p>{session ? `Hello ${session.user.name}` : "Sign-In"}</p>
              </button>
            </div>
          </div>
          <a
            href="/"
            className="md:hidden text-white font-bold text-xl absolute left-1/2 transform -translate-x-1/2"
          >
            <Image
              src="https://logopond.com/logos/cfe0510f7a2888be7ea56da181e90d4a.png"
              width={100}
              height={100}
              objectFit="contain"
            />
          </a>
        </div>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
            onClick={() => router.push("/order")}
          >
            Order
          </button>
          <button
            className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
            onClick={() => router.push("/travel")}
          >
            Travel
          </button>
          <button
            className="block text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
            onClick={() => router.push("/userDeliveriesPage")}
          >
            Your Deliveries
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-y-0 right-0 flex flex-col bg-gray-800 w-64 h-full p-4 space-y-4 text-white z-50">
          <div className="flex justify-end">
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
          <button
            className="text-white font-medium text-lg"
            onClick={() => router.push("/navOption1")}
          >
            Nav Option 1
          </button>
          <button
            className="text-white font-medium text-lg"
            onClick={() => router.push("/navOption2")}
          >
            Nav Option 2
          </button>
          <button
            className="text-white font-medium text-lg"
            onClick={() => router.push("/navOption3")}
          >
            Nav Option 3
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
