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
        pickupLocation,
      } = req.body;

    
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
          pickupLocation: pickupLocation,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
