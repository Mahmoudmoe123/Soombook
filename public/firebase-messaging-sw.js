// Import the required Firebase libraries
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCkcVV-R5uPsa-djMSVnodsw4mqU1riW34",
  authDomain: "soombook-6e9d1.firebaseapp.com",
  projectId: "soombook-6e9d1",
  storageBucket: "soombook-6e9d1.appspot.com",
  messagingSenderId: "825096238444",
  appId: "1:825096238444:web:04fe726102114721e42f49",
  measurementId: "G-JFDR10Z1JB",
});

const messaging = firebase.messaging();
