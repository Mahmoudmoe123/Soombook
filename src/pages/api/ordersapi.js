import prisma from "../../lib/prisma";
import supabase from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        // image,
        url,
        origin,
        destination,
        category,
        description,
        title,
        price,
        currentUserEmail,
        imageUrl,
      } = req.body;

      //   console.log(req.body);

      //  const {data , error} = await supabase.storage

      //   const imageUrl = data.Key;

      // console.log("The image is" + image);
      const user = await prisma.user.findUnique({
        where: {
          email: currentUserEmail,
        },
      });

      const order = await prisma.order.create({
        data: {
          title: title,
          productUrl: url,
          originCountry: origin,
          destinationCountry: destination,
          price: price,
          description: description,

          category: category,
          userId: user.id,
          imageUrl: imageUrl,
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
