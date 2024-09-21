"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/SearchInput";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // New state for user role
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in by checking the token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the token to get user info
      setUserRole(decoded.role); // Assuming the role is stored in the token
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="p-4 text-white bg-orange-400 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            SHABU
            <span className="text-orange-500">Y</span>
          </Link>
        </div>

        <div className="items-center hidden space-x-6 md:flex">
          <Link href="/" className="hover:text-orange-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-orange-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-orange-300">
            Contact
          </Link>
          <SearchInput className="hidden md:flex" />
        </div>

        <div className="items-center hidden space-x-4 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href={userRole === "SELLER" ? "/dashboard/seller" : "/dashboard/buyer"}
                className="hover:text-orange-300"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:text-orange-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-orange-300">
                Login
              </Link>
              <Link href="/register" className="hover:text-orange-300">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="block md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col items-center content-center mt-4 space-y-4 md:hidden">
          <SearchInput />
          <Link href="/" className="block hover:text-orange-300" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="block hover:text-orange-300" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/contact" className="block hover:text-orange-300" onClick={toggleMenu}>
            Contact
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={userRole === "SELLER" ? "/dashboard/seller" : "/dashboard/buyer"}
                className="block hover:text-orange-300"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left hover:text-orange-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:text-orange-300" onClick={toggleMenu}>
                Login
              </Link>
              <Link href="/register" className="block hover:text-orange-300" onClick={toggleMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
