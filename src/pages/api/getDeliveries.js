// pages/api/orders.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { tripId } = req.query;

    if (!tripId) {
      return res.status(400).json({ error: 'Missing tripId query parameter' });
    }

    try {
      const orders = await prisma.order.findMany({
        where: {
          tripId: tripId,
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch orders' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
