// File: pages/api/paymentsapi.js
import prisma from "../../lib/prisma";
// Note: Model name is "Paymentmethod" (lowercase 'm') in the Prisma schema

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { firstName, lastName, accountNumber, cardNumber, currentUserEmail } = req.body;
      
      // Log the incoming data to troubleshoot
      console.log("Received data:", { firstName, lastName, accountNumber, cardNumber, currentUserEmail });
      
      // Check if all required fields are present
      if (!firstName || !lastName || !accountNumber || !cardNumber || !currentUserEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: {
          email: currentUserEmail,
        },
      });
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Create the payment method
      const paymentMethod = await prisma.paymentmethod.create({
        data: { 
          firstName, 
          lastName, 
          accountNumber, 
          cardNumber, 
          userId: user.id 
        },
      });
      
      // Return the created payment method
      res.status(200).json(paymentMethod);
      
      // Log success
      console.log("Payment method created successfully:", paymentMethod);
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Something Went Wrong", details: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { currentUserEmail } = req.query;
      
      if (!currentUserEmail) {
        return res.status(400).json({ error: "User email is required" });
      }
      
      const user = await prisma.user.findUnique({
        where: {
          email: currentUserEmail,
        },
      });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const paymentMethods = await prisma.paymentmethod.findMany({
        where: {
          userId: user.id,
        },
      });
      
      res.status(200).json(paymentMethods);
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Something Went Wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}