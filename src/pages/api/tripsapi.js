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

      res.status(200).json(trip);
    } catch (e) {
      res.status(500).json({ message: "Something Went Wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
