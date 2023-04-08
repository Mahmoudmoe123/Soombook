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

 

  res.status(200).json(user);
  console.log("Current session user info" + user );
}
