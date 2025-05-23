import { getServerSession } from "next-auth/next";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
  
    // Get the tripId from the order table, then get the user from the trip table, and finally get the phone number from the user table
    
  });

  console.log("Orders from api are" + orders);
  



    res.status(200).json(orders);
    console.log("Orders from api are" + orders)
}
