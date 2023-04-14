import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";

const PhoneNumberModal = ({ isOpen, setIsOpen, savePhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSave = () => {
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
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Enter your phone number
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Please provide your phone number to proceed with the
                checkout.This will allow Users to contact you regarding their
                orders
              </p>
            </div>
            <div className="mt-4">
              <input
                type="text"
                className="w-full px-3 py-2 text-gray-700 border-2 border-gray-200 rounded-md focus:outline-none focus:border-gray-500"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={handleSave}
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
