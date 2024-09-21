"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardNav from "@/components/SellerDashboardNav";

export default function SellerDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const { role } = await res.json();

          if (role === 'SELLER') {
            setAuthenticated(true);
          } else {
            router.push('/login'); // Redirect if not a seller
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null; // Redirecting to login
  }

  return (
    <div>
      <SellerDashboardNav />
      <h1>Welcome to your Seller Dashboard!</h1>
      {/* Add more components and sections as needed */}
    </div>
  );
}
