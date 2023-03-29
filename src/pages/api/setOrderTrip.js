import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const tripInfo = JSON.parse(req.body);

  const order = await prisma.order.update({
    where: {
      id: tripInfo.id,
    },
    data: {
      arrivalDate: tripInfo.arrivalDate,
      tripId: tripInfo.tripId,
    },
  });

  res.status(200).json(order);
}
