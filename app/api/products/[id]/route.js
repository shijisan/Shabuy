import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
