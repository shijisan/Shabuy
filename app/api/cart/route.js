import prisma from '@/lib/prisma'; // Adjust to your prisma setup
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token not provided' }), { status: 401 });
  }

  try {
    // Verify the token and get the userId
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    console.log("User ID (GET):", userId);

    // Fetch the cart items for the user from the database
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true, // Include product details
      },
    });

    console.log("Fetched Cart Items:", cartItems);

    return new Response(JSON.stringify(cartItems), { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), { status: 500 });
  }
}
