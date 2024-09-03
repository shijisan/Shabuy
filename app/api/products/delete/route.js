import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function DELETE(request, { params }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const { id } = params;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { deleted: true }, // Soft delete
    });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
