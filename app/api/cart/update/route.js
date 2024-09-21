// api/cart/update/route.js
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
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        const { productId, quantity } = await request.json();

        if (!productId || quantity === undefined) {
            return new Response(JSON.stringify({ error: 'Product ID and quantity are required' }), { status: 400 });
        }

        // Update the quantity in the cart
        const cartItem = await prisma.cart.update({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId,
                },
            },
            data: {
                quantity: quantity,
            },
        });

        return new Response(JSON.stringify(cartItem), { status: 200 });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return new Response(JSON.stringify({ error: 'Failed to update cart item' }), { status: 500 });
    }
}
