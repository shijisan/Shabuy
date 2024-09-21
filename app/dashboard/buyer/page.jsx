"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cart from '@/components/Cart';

export default function BuyerDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]); // To hold the cart items
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Verify the token to check the user role
        const res = await fetch('/api/auth/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const { roles } = await res.json(); // roles should be an array

          const hasBuyerRole = roles.some(role => role === 'USER');
          if (hasBuyerRole) {
            setAuthenticated(true);
            await fetchCartItems(token); // Fetch cart items after authentication
          } else {
            router.push('/login'); // Redirect if not a buyer
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  // Fetch cart items from the API
  const fetchCartItems = async (token) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data); // Set cart items from the API response
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Function to update the quantity of a cart item
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Function to remove a cart item
  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null; // Prevent render if not authenticated
  }

  return (
    <div>
      <h1>Welcome to your Buyer Dashboard!</h1>
      <p>Here you can view your orders, track shipments, and manage your account.</p>
      <Cart cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
    </div>
  );
}
