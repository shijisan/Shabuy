"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UpdateProduct from './update-product'; // Adjust the import path as needed

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/seller/products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [router]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`/api/seller/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setProducts(products.filter(product => product.id !== id));
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">My Products</h1>
      <div className="p-4 mt-6 bg-white rounded-lg shadow-md">
        {loading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.id} className="mb-4">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
      {selectedProduct && <UpdateProduct product={selectedProduct} />}
    </div>
  );
}
