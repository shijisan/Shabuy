import { useState } from 'react';

const Cart = ({ cartItems, onUpdateQuantity, onRemove }) => {
    const [selectedItems, setSelectedItems] = useState({});

    if (cartItems.length === 0) {
        return <div>Your cart is empty.</div>;
    }

    const handleIncrease = (item) => {
        const newQuantity = item.quantity + 1;
        onUpdateQuantity(item.id, newQuantity);
        updateCartItemInDatabase(item.product.id, newQuantity);
    };
    
    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            const newQuantity = item.quantity - 1;
            onUpdateQuantity(item.id, newQuantity);
            updateCartItemInDatabase(item.product.id, newQuantity);
        }
    };

    const updateCartItemInDatabase = async (productId, newQuantity) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Failed to update cart item:', data.error);
            } else {
                console.log('Cart item updated successfully:', data);
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };

    const handleSelect = (itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId], // Toggle selection
        }));
    };

    const handleBuySelected = async () => {
        const selectedProductIds = Object.keys(selectedItems).filter(itemId => selectedItems[itemId]);

        if (selectedProductIds.length === 0) {
            console.log('No items selected for purchase.');
            return;
        }

        // Implement your purchase logic here
        console.log('Buying selected items:', selectedProductIds);
    };

    const handleRemoveFromDatabase = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: itemId }), // Send the product ID to remove
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Failed to remove cart item:', data.error);
            } else {
                console.log('Cart item removed successfully:', data);
                onRemove(itemId); // Call the parent onRemove function to update state
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <ul className="mt-4 space-y-4">
                {cartItems.map(item => (
                    <li key={item.id} className="flex items-center justify-between p-4 border rounded shadow">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                checked={!!selectedItems[item.id]}
                                onChange={() => handleSelect(item.id)}
                                className="mr-2"
                            />
                            <div>
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p>${item.product.price.toFixed(2)} x {item.quantity}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleDecrease(item)}
                                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => handleIncrease(item)}
                                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleRemoveFromDatabase(item.product.id)} // Call the remove function
                                className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleBuySelected}
                className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
            >
                Buy Selected Items
            </button>
        </div>
    );
};

export default Cart;
