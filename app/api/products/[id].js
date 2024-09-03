// pages/api/products/[id].js
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch the product by ID from the database
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          images: true, // Adjust based on your schema
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle other HTTP methods
    return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
