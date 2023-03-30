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
  });



    res.status(200).json(orders);
    console.log("Orders from api are" + orders)
}
