"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SellerDashboardNav from '@/components/SellerDashboardNav';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex">
      <SellerDashboardNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
