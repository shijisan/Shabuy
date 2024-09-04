// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/SearchInput";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in by checking the token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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

        <div className="hidden space-x-6 md:flex">
          <Link href="/" className="hover:text-orange-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-orange-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-orange-300">
            Contact
          </Link>
        </div>

        {/* Search Input Component */}
        <SearchInput />

        <div className="items-center hidden space-x-4 md:flex">
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hover:text-orange-300">
                Profile
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
        <div className="mt-4 space-y-4 md:hidden">
          <Link href="/" className="block text-orange-100 hover:text-orange-300" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="block text-orange-100 hover:text-orange-300" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/contact" className="block text-orange-100 hover:text-orange-300" onClick={toggleMenu}>
            Contact
          </Link>
          {/* Mobile Search Input Component */}
          <SearchInput />
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="block text-orange-100 hover:text-orange-300" onClick={toggleMenu}>
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left text-orange-100 hover:text-orange-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-orange-100 hover:text-orange-300" onClick={toggleMenu}>
                Login
              </Link>
              <Link href="/register" className="block text-orange-100 hover:text-orange-300" onClick={toggleMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
