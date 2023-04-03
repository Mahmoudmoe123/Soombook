import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        origin,
        destination,
        departureDate,
        arrivalDate,
        currentUserEmail,
      } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: currentUserEmail,
        },
      });

      const trip = await prisma.trip.create({
        data: {
          originCountry: origin,
          destinationCountry: destination,
          departureDate: departureDate,
          arrivalDate: arrivalDate,
          userId: user.id,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the Trip" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
