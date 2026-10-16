import prisma from "../../lib/prisma";
import logger from "../../lib/logger";
import { withRequestLogging } from "../../lib/withRequestLogging";

async function handler(req, res) {
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
      logger.error("could not create trip", { requestId: req.requestId, error });
      res
        .status(500)
        .json({ error: "An error occurred while creating the Trip" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default withRequestLogging("/api/tripsapi", handler);
