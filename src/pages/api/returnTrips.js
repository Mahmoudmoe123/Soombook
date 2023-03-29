import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const { userEmail } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  const trips = await prisma.trip.findMany({
    where: { userId: user.id },
  });

  res.status(200).json(trips);
}
