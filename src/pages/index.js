import Head from "next/head";
import Banner from "../components/Banner";
import Supaproductfeed from "../components/Supaproductfeed";
import prisma from "../lib/prisma";
import Header from "../components/Header";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import NotificationPermissionModal from "../components/getNotificationModal";
import CarouselProductFeed from "../components/CarouselProductFeed";
import { useState } from "react";

export default function Home({ orders }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Alsombook</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6 sm:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Banner />
          <h1 className="text-2xl md:text-4xl font-semibold mb-6">
            Browse Orders
          </h1>
          <div className="mb-10 ml-0 sm:ml-[-5] md:ml-0 lg:ml-0 xl:ml-0 2xl:ml-0">
            {orders.length > 0 ? (
              <CarouselProductFeed orders={orders} />
            ) : (
              <p className="text-gray-500 text-center py-10">No orders available yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
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
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    // Return empty orders array if there's an error
    return {
      props: {
        orders: [],
      },
    };
  }
}
