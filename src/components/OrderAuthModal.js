import React, { useCallback } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; // Add Google icon

const OrderAuthModal = ({ showModal, closeModal }) => {
  if (!showModal) {
    return null;
  }

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signIn("google", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  }, []);

  // Close modal when clicking outside or pressing ESC
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <div
      className="fixed z-50 inset-0 overflow-y-auto bg-gray-600 bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <h3
              id="modal-title"
              className="text-xl leading-6 font-semibold text-gray-900 mb-4"
            >
              Sign in to Complete Order
            </h3>
            <p className="text-sm text-gray-600">
              Please sign in with your Google account to proceed with your order.
            </p>
          </div>

          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-4 py-2.5 bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors sm:w-auto"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>
            <button
              onClick={closeModal}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderAuthModal);
