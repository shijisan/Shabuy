// pages/product/[id].js
import React from 'react';
import CustomCarousel from '@/components/Carousel';

// Sample function to fetch product data
const fetchProductById = async (id) => {
  // Replace with your actual data fetching logic
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  const product = await res.json();
  return product;
};

const ProductPage = ({ product }) => {
  const { name, description, price, quantity, images } = product; // Destructure product details

  return (
    <div className="max-w-4xl p-6 mx-auto">
      {/* Carousel */}
      <CustomCarousel images={images} autoplay={true} interval={5000} showArrows={true} />

      {/* Product Details */}
      <div className="mt-6">
        <h1 className="mb-2 text-4xl font-bold">{name}</h1>
        <p className="mb-4 text-lg text-gray-700">{description}</p>
        <p className="mb-4 text-xl font-semibold">Price: ${price.toFixed(2)}</p>
        <p className="text-lg text-gray-600">Quantity in stock: {quantity}</p>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const product = await fetchProductById(context.params.id);
    return { props: { product } };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { props: { product: null } }; // Handle errors gracefully
  }
}

export default ProductPage;
