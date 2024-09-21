'use client';

import { useState } from 'react';
import CustomCarousel from '@/components/Carousel';
import Notification from '@/components/Notification'; // Import Notification component

const ClientProductView = ({ product, imageUrls }) => {
    const [quantity, setQuantity] = useState(1);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10); // Parse the input value as an integer
        if (!isNaN(value) && value >= 1 && value <= 10) { // Ensure the value is within range
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product.id, quantity }),
            });

            if (response.ok) {
                setNotificationMessage('Product added to cart successfully!'); // Show success message
            } else {
                const errorData = await response.json();
                setNotificationMessage(errorData.error || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setNotificationMessage('An error occurred while adding to cart');
        }
    };

    const handleBuyNow = () => {
        console.log('Buy now:', product.id, quantity);
    };

    // Default image placeholder
    const placeholderImage = 'https://via.placeholder.com/400x300.png?text=No+Image';

    // Ensure imageUrls has at least one image
    const validImageUrls = imageUrls.length > 0 ? imageUrls : [placeholderImage];

    return (
        <div className='flex flex-row flex-wrap'>
            <div className="col md:w-6/12 w-100">
                <CustomCarousel images={validImageUrls} />
            </div>
            <div className="col md:w-6/12 w-100">
                <div className="p-10 mt-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-lg text-gray-700">${product.price.toFixed(2)}</p>
                    <div className="flex flex-col gap-4 my-4 md:items-center md:flex-row">
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="p-2 border rounded"
                        />
                        <button onClick={handleAddToCart} className="px-4 py-2 text-white bg-blue-500 rounded">Add to Cart</button>
                        <button onClick={handleBuyNow} className="px-4 py-2 text-white bg-green-500 rounded">Buy Now</button>
                    </div>
                    <hr />
                    <p className="mt-2 text-gray-500">{product.description}</p>
                </div>
            </div>
            <Notification message={notificationMessage} onClose={() => setNotificationMessage('')} />
        </div>
    );
};

export default ClientProductView;
