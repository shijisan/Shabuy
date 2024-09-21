import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return new Response(JSON.stringify({ error: 'Token not provided' }), { status: 401 });
    }

    try {
        // Verify the token and extract user ID
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        const { productId, quantity } = await request.json();

        console.log("Product ID (POST):", productId);
        console.log("User ID (POST):", userId);

        if (!productId || !quantity) {
            return new Response(JSON.stringify({ error: 'Product ID and quantity are required' }), { status: 400 });
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }

        // Add or update the product in the cart
        const cartItem = await prisma.cart.upsert({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId,
                },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                userId: userId,
                productId: productId,
                quantity: quantity,
            },
        });

        console.log("Cart Item Added/Updated:", cartItem);
        return new Response(JSON.stringify(cartItem), { status: 200 });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return new Response(JSON.stringify({ error: 'Failed to add to cart' }), { status: 500 });
    }
}
