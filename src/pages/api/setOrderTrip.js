import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
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
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
