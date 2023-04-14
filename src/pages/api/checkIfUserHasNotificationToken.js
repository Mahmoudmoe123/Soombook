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

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const hasNotificationToken =
    user.userNotificationToken !== null && user.userNotificationToken !== "";

  res.status(200).json({ hasNotificationToken });
}
