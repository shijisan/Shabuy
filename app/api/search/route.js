import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get('query') || '').toLowerCase();

  try {
    const products = await prisma.product.findMany({
      where: {
        deleted: false, // Ensure deleted is false
        name: {
          contains: query, // Case-insensitive search
        },
      },
      include: {
        images: true, // Include images in the response
      },
    });

    console.log('Fetched products:', products);

    if (!Array.isArray(products)) {
      console.error('Fetched data is not an array:', products);
      return NextResponse.json({ error: 'Unexpected server response' }, { status: 500 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
