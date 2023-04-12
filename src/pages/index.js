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
        <title>Your App Name</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6 sm:px-8">
      <Banner />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-4xl font-semibold mb-6">
            Browse Products
          </h1>
          <CarouselProductFeed orders={orders} />
        </div>
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
