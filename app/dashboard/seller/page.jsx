"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSellerData() {
      try {
        // Retrieve the token from client-side storage (localStorage)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        const res = await fetch('/api/seller', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSellerData(data);
        } else {
          console.error('Failed to fetch seller data:', await res.text());
          router.push('/login'); // Redirect to login if fetching data fails
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError('Error fetching seller data');
        router.push('/login'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    }

    fetchSellerData();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">Seller Dashboard</h1>
      
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Products</h2>
        {sellerData?.products?.length > 0 ? (
          <ul>
            {sellerData.products.map(product => (
              <li key={product.id} className="mb-2">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Orders</h2>
        {sellerData?.orders?.length > 0 ? (
          <ul>
            {sellerData.orders.map(order => (
              <li key={order.id} className="mb-2">
                <h3 className="text-lg font-bold">Order ID: {order.id}</h3>
                <p>Total Price: ${order.totalPrice}</p>
                <ul>
                  {order.products.map(product => (
                    <li key={product.productId}>
                      <p>Product Name: {product.product.name}</p>
                      <p>Quantity: {product.quantity}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
}
