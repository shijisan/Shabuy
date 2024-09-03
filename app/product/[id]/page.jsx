import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

// Server-side rendering for product data
export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: product.name,
      description: product.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'Failed to load product data',
    };
  }
}

export default async function ProductPage({ params }) {
  const { id } = params;
  let product = null;

  try {
    product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    if (!product) {
      notFound(); // Handles 404 for products not found
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return <div>Error fetching product details.</div>;
  }

  return (
    <div className="p-4 text-gray-700 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
      <p className="mb-4">{product.description}</p>
      <p className="mb-4 text-xl font-semibold">${product.price.toFixed(2)}</p>
      <p className="mb-4">Quantity: {product.quantity}</p>

      {product.images && product.images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {product.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={product.name}
              className="object-cover w-48 h-48 border border-gray-300 rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}
