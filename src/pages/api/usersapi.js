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

      const { name, email, password } = req.body;

      const user = await prisma.user.create({
        data: { name, email, password },
      });

      res.status(200).json(user);
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
