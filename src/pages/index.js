import Head from "next/head";
import Banner from "../components/Banner";
import Supaproductfeed from "../components/Supaproductfeed";
import prisma from "../lib/prisma";
import Header from "../components/Header";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import NotificationPermissionModal from "../components/getNotificationModal";

// import app from "../firebase";
import { useState } from "react";

export default function Home({ orders }) {
  // const [testToken, setTestToken] = useState("");

  // function requestPermission() {
  //   console.log("Requesting permission...");
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       console.log("Notification permission granted.");
  //       const messaging = getMessaging(app);
  //       onMessage(messaging, (payload) => {
  //         console.log('Message received. ', payload);
  //       });

  //       getToken(messaging, {
  //         vapidKey:
  //           "BPXJQ-KqNphqwXiq6giKPnru1p6glK9uoHgYT3y2YFXQy3vR37RQblC-EjG2ONJus_Dx1ZAhYEELqccxgZINVjY",
  //       }).then((currentToken) => {
  //         if (currentToken) {
  //           console.log("current token: " + currentToken);
  //           setTestToken(currentToken);
  //         } else {
  //           console.log("no token, cant get it");
  //         }
  //       });
  //     } else {
  //       console.log("permission not granted.");
  //     }
  //   });
  // }

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      {/* ---- TO BEGIN, delete this section and GET CODING!!! ---- */}
      {/* ---- ---- */}
      {/* <Header /> */}
      {/* <button onClick={requestPermission}> Notification Permission</button>

      //if there is a test token, display it
      {testToken && <p>Test Token is : {testToken}</p>} */}
      <NotificationPermissionModal />
      <Header />
      {/* <Navbar /> */}
      <main className="max-w-screen-2xl mx-auto">
        <Banner />
        <Supaproductfeed products={orders} />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const orders = await prisma.order.findMany();

  // Modify each order to remove the arrivalDate property
  const ordersWithoutArrivalDate = orders.map(
    ({ arrivalDate, ...rest }) => rest
  );

  return {
    props: {
      orders: ordersWithoutArrivalDate,
    },
  };
}
