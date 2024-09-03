"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [images, setImages] = useState([]); // Manage image files
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle image file selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Store files as an array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Prepare form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', parseFloat(price));
      formData.append('quantity', parseInt(quantity));

      // Append images to form data
      images.forEach((image) => {
        formData.append('images', image);
      });

      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        router.refresh(); // Refresh the products list after adding
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-gray-700 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
          <div className="mt-2">
            {images.length > 0 && (
              <div className="flex space-x-2">
                {Array.from(images).map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="object-cover w-24 h-24 border border-gray-300 rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
