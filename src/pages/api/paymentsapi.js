import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  //     const users = await prisma.user.findMany({
  //     include: {
  //       products: true,
  //       purchases: true,
  //     },
  //   });

  //   res.status(200).json(users);

  if (req.method === "POST") {
    try {
      // TODO

      const { firstName, lastName, accountNumber, cardNumber } = req.body;

      const paymentmethod = await prisma.paymentmethod.create({
        data: { firstName, lastName, accountNumber, cardNumber },
      });

      await prisma.res.status(200).json(paymentmethod);
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
