import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

const SECRET_KEY = process.env.JWT_SECRET; // Make sure this is set in your environment variables

export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    const seller = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: true,
        orders: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.error('Error fetching seller data:', error);
    return NextResponse.json({ error: 'Failed to fetch seller data' }, { status: 500 });
  }
}
