import React from 'react';

const EnableNotificationsModal = ({ isOpen, onClose, onEnable }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Enable Notifications</h2>
        <p className="text-gray-600 mb-6">Please enable notifications to receive order updates.</p>
        <div className="flex justify-end">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-6 rounded-xl mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onEnable}
          >
            Enable Notifications
          </button>
          <button className="text-gray-500 py-2 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnableNotificationsModal;
