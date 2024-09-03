import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
import fs from 'fs';
import path from 'path';

const SECRET_KEY = process.env.JWT_SECRET;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads'); // Directory to store images

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
        deleted: false,
      },
      include: {
        images: true, // Include images in the response
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData(); // Get the form data
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const quantity = parseInt(formData.get('quantity'), 10);

    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        sellerId,
        deleted: false,
      },
    });

    // Handle image uploads
    const imageFiles = formData.getAll('images');
    const imagePromises = imageFiles.map(async (imageFile) => {
      const uniqueFilename = `${uuidv4()}-${imageFile.name}`;
      const imagePath = path.join(UPLOAD_DIR, uniqueFilename);
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

      // Save the image to the server
      fs.writeFileSync(imagePath, imageBuffer);

      // Save image record in the database
      return prisma.image.create({
        data: {
          url: `/uploads/${uniqueFilename}`,
          productId: product.id,
        },
      });
    });

    // Wait for all image records to be created
    await Promise.all(imagePromises);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
