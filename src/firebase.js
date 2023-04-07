// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCkcVV-R5uPsa-djMSVnodsw4mqU1riW34",
  authDomain: "soombook-6e9d1.firebaseapp.com",
  projectId: "soombook-6e9d1",
  storageBucket: "soombook-6e9d1.appspot.com",
  messagingSenderId: "825096238444",
  appId: "1:825096238444:web:04fe726102114721e42f49",
  measurementId: "G-JFDR10Z1JB",
};

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

export default app;


