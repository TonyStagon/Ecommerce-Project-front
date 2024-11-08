// ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [cartVisible, setCartVisible] = useState(false);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.error("No such document!");
            }
        };

        fetchProduct();

        // Load cart from local storage on component mount
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, [id]);

    const handleAddToCart = () => {
        setCartVisible(true);

        const existingItem = cart.find((item) => item.id === product.id);
        let updatedCart;

        if (existingItem) {
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCloseCart = () => {
        setCartVisible(false);
    };

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

    const handleCheckout = () => {
        navigate('/checkout', { state: { totalPrice: getTotalPrice() } });
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            <h2>{product.name}</h2>
            {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} className="product-detail-image" />
            )}
            <p className="price">Price: R{product.price}</p>
            <p>{product.description}</p>

            <div className="button-container">
                <button className="button" onClick={handleAddToCart}>Add to Cart</button>
                <button className="button">Buy it Now</button>
            </div>

            {cartVisible && (
                <div className="cart-slide">
                    <button className="close-cart-button" onClick={handleCloseCart}>X</button>
                    <h3>Cart</h3>
                    <div className="cart-items-container">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p>{item.name}</p>
                                    <p>Sale: R{item.price}</p>
                                    <div className="quantity-control">
                                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    </div>
                                    <p>Total: R{(item.price * item.quantity).toFixed(2)}</p>
                                    <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-footer">
                        <p className="total-price">Total Price: R{getTotalPrice()}</p>
                        <button className="view-cart-button" onClick={() => navigate('/cart')}>View Cart</button>
                        <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
