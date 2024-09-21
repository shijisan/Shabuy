"use client";

import Navbar from "@/components/Navbar";

export default function BuyerDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
