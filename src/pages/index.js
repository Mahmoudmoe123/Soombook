import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
// import { PrismaClient } from '@prisma/client'
import Supaproductfeed from "../components/Supaproductfeed";
import prisma from "../lib/prisma";

export default function Home({ orders }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      {/* ---- TO BEGIN, delete this section and GET CODING!!! ---- */}
      {/* ---- ---- */}
      <Header />
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
