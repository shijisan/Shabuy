"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

const SearchPage = ({ searchParams }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchParams.query)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams.query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} passHref>
              <div className="overflow-hidden border rounded-lg shadow-lg cursor-pointer">
                <img 
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/400x300.png?text=No+Image'} 
                  alt={item.name} 
                  className="object-contain w-full h-48"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x300.png?text=No+Image'} // Fallback on error
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-700">${item.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
