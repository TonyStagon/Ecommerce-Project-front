import React, { useState, useEffect } from 'react';
import './CartPage.css';

const CartPage = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Load cart from local storage when component mounts
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const handleQuantityChange = (id, change) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                const newQuantity = Math.max(item.quantity + change, 1);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart-page-container">
            <h2>My Cart</h2>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id} className="cart-item-row">
                            <td className="product-info">
                                <img src={item.images[0]} alt={item.name} className="product-image" />
                                <div>
                                    <p>{item.name}</p>
                                    <p>R{item.price}</p>
                                </div>
                            </td>
                            <td>
                                <div className="quantity-control">
                                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    <button onClick={() => handleRemoveItem(item.id)} className="remove-button">
                                        Remove
                                    </button>
                                </div>
                            </td>
                            <td>R{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="cart-summary">
                <p>Total Price: R{getTotalPrice()}</p>
                <button className="checkout-button">Checkout</button>
            </div>
        </div>
    );
};

export default CartPage;
