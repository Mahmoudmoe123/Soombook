import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { url, origin, destination, category, description, title, price } =
        req.body;

      const order = await prisma.order.create({
        data: {
          title: title,
          productUrl: url,
          originCountry: origin,
          destinationCountry: destination,
          price: price,
          description: description,

          category: category,
        },
      });

      res.status(200).json(order);
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
