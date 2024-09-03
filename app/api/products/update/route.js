import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function PUT(request, { params }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { id } = params;
  const { name, description, price, quantity } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        quantity,
        sellerId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
