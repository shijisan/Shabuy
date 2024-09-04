'use client';

import { useState } from 'react';
import CustomCarousel from '@/components/Carousel';

const ClientProductView = ({ product, imageUrls }) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddToCart = () => {
        // Add logic to add product to cart
        console.log('Add to cart:', product.id, quantity);
    };

    const handleBuyNow = () => {
        // Add logic to handle immediate purchase
        console.log('Buy now:', product.id, quantity);
    };

    // Default image placeholder
    const placeholderImage = 'https://via.placeholder.com/400x300.png?text=No+Image';

    // Ensure imageUrls has at least one image
    const validImageUrls = imageUrls.length > 0 ? imageUrls : [placeholderImage];

    return (
        <div className='flex flex-row'>
            <div className="w-1/2">
                <CustomCarousel images={validImageUrls} />
            </div>
            <div className="w-1/2">
                <div className="p-10 mt-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-lg text-gray-700">${product.price.toFixed(2)}</p>
                    <p className="mt-2 text-gray-500">{product.description}</p>
                    <div className="flex items-center gap-4 mt-4">
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
                </div>
            </div>

        </div>
    );
};

export default ClientProductView;
