import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { name, description, price, quantity } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        sellerId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
