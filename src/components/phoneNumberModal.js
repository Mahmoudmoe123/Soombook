import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PhoneIcon, XMarkIcon } from "@heroicons/react/24/outline";

const PhoneNumberModal = ({ isOpen, setIsOpen, savePhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const validatePhoneNumber = (number) => {
    // Basic phone number validation - can be adjusted based on your needs
    const phoneRegex = /^[\d\s-+()]{10,}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setError("");
  };

  const handleSave = () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    savePhoneNumber(phoneNumber);
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50" />
          </Transition.Child>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div className="flex justify-between items-center">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
              >
                <PhoneIcon className="h-5 w-5 text-gray-600" />
                Enter your phone number
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Please provide your phone number to proceed with the checkout. This
                will allow users to contact you regarding their orders.
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                className={`w-full px-3 py-2 text-gray-700 border-2 ${
                  error ? "border-red-300" : "border-gray-200"
                } rounded-md focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!phoneNumber.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PhoneNumberModal;
