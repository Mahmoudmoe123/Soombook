import { getServerSession } from "next-auth/next";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  //   const userProfileInfo = JSON.parse(req.body);
  const userToken = JSON.parse(req.body);

  //   console.log("Current session user info" + session.user.email);
  //   console.log("Current session user info" + req.body.name);
  //   console.log("Current session user info" + req.body.phoneNumber);
  //     console.log("Current session user info" + req.body.email);

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      userNotificationToken: userToken,
    },
  });

  res.status(200).json(user);
  console.log("Current session user info" + user);
}
