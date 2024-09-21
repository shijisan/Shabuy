// Example: api/cart/remove/route.js
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function DELETE(request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return new Response(JSON.stringify({ error: 'Token not provided' }), { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        const { productId } = await request.json();

        if (!productId) {
            return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
        }

        // Delete the cart item
        await prisma.cart.deleteMany({
            where: {
                userId,
                productId,
            },
        });

        return new Response(JSON.stringify({ message: 'Cart item removed successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error removing cart item:', error);
        return new Response(JSON.stringify({ error: 'Failed to remove cart item' }), { status: 500 });
    }
}
