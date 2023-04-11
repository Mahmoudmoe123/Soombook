import React, { useState } from "react";
import Modal from "react-modal";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "../firebase";


Modal.setAppElement("#__next"); // Replace with your app's root element id

const NotificationPermissionModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePermissionRequest = async () => {
    await requestPermissionAndSubscribe();
    closeModal();
  };

  async function requestPermissionAndSubscribe() {
    console.log("Requesting permission...");
    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {

        console.log("Notification permission granted.");
                const messaging = getMessaging(app);

        const token = await  getToken(messaging, {
                    vapidKey:
                      "BPXJQ-KqNphqwXiq6giKPnru1p6glK9uoHgYT3y2YFXQy3vR37RQblC-EjG2ONJus_Dx1ZAhYEELqccxgZINVjY",
                  })

        console.log("current token: " + token);

        // Save the token to your database (e.g., Supabase) associated with the user.
        // ...
        try {
          const response = await fetch("/api/addNotificationToken", {
            method: "PUT",
           
            body: JSON.stringify(token),
          });

          if (response.status === 200) {
            console.log("Token updated successfully");
          } else {
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("An error occurred while updating the token:", error);
        }
      } else {
        console.log("Permission not granted.");
      }
    });
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Enable notifications
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Notification Permission Modal"
        className="m-auto w-11/12 md:w-2/4 lg:w-1/3 border border-gray-300 rounded-lg p-6 bg-white"
        overlayClassName="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Enable notifications</h2>
        <p className="mb-6">
          We'd like to send you notifications when your product has been
          accepted for delivery. Do you allow us to send notifications?
        </p>
        <div className="flex justify-end">
          <button
            onClick={handlePermissionRequest}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Allow
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NotificationPermissionModal;
