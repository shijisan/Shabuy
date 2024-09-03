import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    const products = await prisma.product.findMany({
      where: {
        sellerId: sellerId,
        // Remove `deleted` filter if it's not part of your schema
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
