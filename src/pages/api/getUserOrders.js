import { getServerSession } from "next-auth/next";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

// Returns the orders the signed-in user has requested.
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Sign in to see your orders." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "No account found for this email." });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
  });

  return res.status(200).json(orders);
}
