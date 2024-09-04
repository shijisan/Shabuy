import CustomCarousel from '@/components/Carousel';
import prisma from '@/lib/prisma';
import ClientProductView from '@/components/ClientProductView'; // Import the client component

// Server Component
const ProductPage = async ({ params }) => {
  const { id } = params;

  // Fetch product data from the server
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
    include: { images: true },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  // Set image sources
  const imageUrls = product.images.map((img) => img.url);

  // Pass data to Client Component
  return (
    <div className="p-4">
      <ClientProductView product={product} imageUrls={imageUrls} />
    </div>
  );
};

export default ProductPage;
