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
      contactNumber: tripInfo.contactNumber,
    },
  });

  const userToken = await prisma.user.findUnique({
    where: {
      id: order.userId,
    },
    select: {
      userNotificationToken: true,
    },
  });

  const message = {
    data: {
      arrivalDate: tripInfo.arrivalDate,
      contactNumber: tripInfo.contactNumber,
    },
    token: userToken,
  };

  try {
    // Send a message to the device corresponding to the provided registration token.
    const response = await messaging.send(message);
    // Response is a message ID string.
    console.log("Successfully sent message:", response);
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully sent message",
        messageId: response,
      });
  } catch (error) {
    console.log("Error sending message:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error sending message",
        error: error.message,
      });
  }

  res.status(200).json(order);
}
