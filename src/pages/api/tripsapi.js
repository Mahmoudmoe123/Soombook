import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        origin,
        destination,
        formatedDepartureDate,
        formatedArrivalDate,
      } = req.body;

      const trip = await prisma.trip.create({
        data: {
          originCountry: origin,
          destinationCountry: destination,
          departureDate: formatedDepartureDate,
          arrivalDate: formatedArrivalDate,
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
