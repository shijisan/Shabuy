"use client"

import Link from "next/link";

export default function SellerDashboardNav({handleLogout}){
    return(
        <aside className="w-64 h-screen text-white bg-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <ul className="mt-4">
            <li><Link href="/dashboard/seller/products">Products</Link></li>
            <li><Link href="/dashboard/seller/orders">Orders</Link></li>
            <li><Link href="/dashboard/seller/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="px-4 py-2 mt-4 text-white bg-red-500 rounded">Logout</button></li>
          </ul>
        </div>
      </aside>
    );
}