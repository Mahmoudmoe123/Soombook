import React from 'react';

const EnableNotificationsModal = ({ isOpen, onClose, onEnable }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-3 dark:text-white">Enable Notifications</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Stay updated with your order status and important updates by enabling notifications.
          </p>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
          <button 
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={onClose}
          >
            Not Now
          </button>
          <button
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={onEnable}
          >
            Enable Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

// Add keyframes for fade-in animation
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
`;

// Add styles to head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default EnableNotificationsModal;
