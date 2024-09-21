// components/SearchInput.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to the search results page with the query
    if (searchQuery) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="items-center space-x-2 md:flex">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-2 py-1 rounded-md"
      />
      <button
        type="submit"
        className="px-3 py-1 text-white bg-orange-500 rounded-md hover:bg-orange-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
