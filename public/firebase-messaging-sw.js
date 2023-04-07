import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCkcVV-R5uPsa-djMSVnodsw4mqU1riW34",
  authDomain: "soombook-6e9d1.firebaseapp.com",
  projectId: "soombook-6e9d1",
  storageBucket: "soombook-6e9d1.appspot.com",
  messagingSenderId: "825096238444",
  appId: "1:825096238444:web:04fe726102114721e42f49",
  measurementId: "G-JFDR10Z1JB",
});

const messaging = getMessaging(firebaseApp);

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken } from "firebase/messaging";

// // importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
// // importScripts('https https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

// const firebaseConfig = {
//   apiKey: "AIzaSyCkcVV-R5uPsa-djMSVnodsw4mqU1riW34",
//   authDomain: "soombook-6e9d1.firebaseapp.com",
//   projectId: "soombook-6e9d1",
//   storageBucket: "soombook-6e9d1.appspot.com",
//   messagingSenderId: "825096238444",
//   appId: "1:825096238444:web:04fe726102114721e42f49",
//   measurementId: "G-JFDR10Z1JB",
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // function requestPermission() {
// //   console.log("Requesting permission...");
// //   Notification.requestPermission().then((permission) => {
// //     if (permission === "granted") {
// //       console.log("Notification permission granted.");
// //       const app = initializeApp(firebaseConfig);

// //       const messaging = getMessaging(app);
// //       getToken(messaging, {
// //         vapidKey:
// //           "BCRcwBElQOj5ptR6h61H55skh2THtKolRbWvv8Ede_AA5ojmS6bC4brGqBQFYMMIjP9-rMZRj82RsX9BY4wVLS4",
// //       }).then((currentToken) => {
// //         if (currentToken) {
// //           console.log("current token", currentToken);
// //         } else {
// //           console.log("no token, cant get it");
// //         }
// //       });
// //     } else {
// //       console.log("permission not granted.");
// //     }
// //   });
// // }

// // requestPermission();
